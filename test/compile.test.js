import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { checkProject, compileProject, compileProjectWithOptions, diffProject, doctorProject } from "../src/compiler.js";
import { stringifyManifest } from "../src/manifest.js";

async function callMcpServer(serverPath, messages) {
  const child = spawn("node", [serverPath], { stdio: ["pipe", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });
  for (const message of messages) {
    child.stdin.write(`${JSON.stringify(message)}\n`);
  }
  child.stdin.end();
  const code = await new Promise((resolve) => {
    child.on("close", resolve);
  });
  assert.equal(code, 0, stderr);
  return stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

test("compileProject writes AGENTS, skills, MCP, Cursor, and Copilot files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-compile-"));
  const manifest = {
    name: "demo-agent-tool",
    summary: "Browser automation CLI",
    targets: ["agents", "claude-md", "claude", "codex", "cursor", "copilot", "mcp"],
    principles: ["Keep edits scoped", "Run verification before success claims"],
    commands: {
      install: "npm install",
      test: "npm test",
      lint: "npm run lint"
    },
    skills: [
      {
        name: "demo-agent-tool-developer",
        description: "Use when changing the demo agent tool.",
        workflow: ["Inspect project context", "Run node --test"]
      }
    ]
  };
  await writeFile(path.join(root, "skillpack.yaml"), stringifyManifest(manifest));

  const result = await compileProject(root);

  assert.deepEqual(
    result.files.sort(),
    [
      ".claude/skills/demo-agent-tool-developer/SKILL.md",
      ".codex/skills/demo-agent-tool-developer/SKILL.md",
      ".cursor/rules/demo-agent-tool.mdc",
      ".github/copilot-instructions.md",
      ".mcp/README.md",
      ".mcp/skillpack-server.mjs",
      "CLAUDE.md",
      "AGENTS.md"
    ].sort()
  );
  assert.match(await readFile(path.join(root, "AGENTS.md"), "utf8"), /demo-agent-tool/);
  assert.match(await readFile(path.join(root, "CLAUDE.md"), "utf8"), /Claude Instructions/);
  assert.match(
    await readFile(path.join(root, ".codex/skills/demo-agent-tool-developer/SKILL.md"), "utf8"),
    /Run node --test/
  );
  await stat(path.join(root, ".github/copilot-instructions.md"));
  await stat(path.join(root, ".mcp/skillpack-server.mjs"));
});

test("generated MCP server exposes skillpack resources and tools", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-mcp-"));
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "demo-agent-tool",
      summary: "Browser automation CLI",
      targets: ["mcp"],
      principles: ["Keep edits scoped"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "demo-agent-tool-developer",
          description: "Use when changing the demo agent tool.",
          workflow: ["Inspect project context", "Run npm test"]
        }
      ]
    })
  );
  await compileProject(root);

  const responses = await callMcpServer(path.join(root, ".mcp/skillpack-server.mjs"), [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
    { jsonrpc: "2.0", id: 2, method: "resources/list", params: {} },
    { jsonrpc: "2.0", id: 3, method: "resources/read", params: { uri: "skillpack://summary" } },
    { jsonrpc: "2.0", id: 4, method: "tools/list", params: {} },
    { jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "skillpack_commands", arguments: {} } }
  ]);

  assert.equal(responses[0].result.serverInfo.name, "demo-agent-tool-skillpack");
  assert.ok(responses[1].result.resources.some((resource) => resource.uri === "skillpack://manifest"));
  assert.match(responses[2].result.contents[0].text, /Browser automation CLI/);
  assert.ok(responses[3].result.tools.some((tool) => tool.name === "skillpack_commands"));
  assert.match(responses[4].result.content[0].text, /npm test/);
});

test("doctorProject reports missing generated files before compile and passes after compile", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-doctor-"));
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "demo-agent-tool",
      summary: "Browser automation CLI",
      targets: ["agents"],
      principles: ["Verify before completion"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "demo-agent-tool-developer",
          description: "Use when changing the demo agent tool.",
          workflow: ["Run tests"]
        }
      ]
    })
  );

  const before = await doctorProject(root);
  assert.equal(before.ok, false);
  assert.ok(before.issues.some((issue) => issue.includes("AGENTS.md")));

  await compileProject(root);
  const after = await doctorProject(root);
  assert.equal(after.ok, true);
  assert.deepEqual(after.issues, []);
});

test("compileProjectWithOptions dry-run lists outputs without writing files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-dry-run-"));
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "demo-agent-tool",
      summary: "Browser automation CLI",
      targets: ["agents", "codex"],
      principles: ["Verify before completion"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "demo-agent-tool-developer",
          description: "Use when changing the demo agent tool.",
          workflow: ["Run tests"]
        }
      ]
    })
  );

  const result = await compileProjectWithOptions(root, { dryRun: true });

  assert.equal(result.dryRun, true);
  assert.deepEqual(result.files.sort(), [".codex/skills/demo-agent-tool-developer/SKILL.md", "AGENTS.md"].sort());
  assert.equal(result.actions.every((action) => action.exists === false), true);
  await assert.rejects(stat(path.join(root, "AGENTS.md")));
});

test("diffProject reports missing, stale, and clean generated outputs", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-diff-"));
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "demo-agent-tool",
      summary: "Browser automation CLI",
      targets: ["agents"],
      principles: ["Verify before completion"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "demo-agent-tool-developer",
          description: "Use when changing the demo agent tool.",
          workflow: ["Run tests"]
        }
      ]
    })
  );

  const missing = await diffProject(root);
  assert.equal(missing.ok, false);
  assert.ok(missing.issues.some((issue) => issue.includes("Missing generated file")));

  await writeFile(path.join(root, "AGENTS.md"), "stale instructions\n");
  const stale = await diffProject(root);
  assert.equal(stale.ok, false);
  assert.ok(stale.issues.some((issue) => issue.includes("stale")));

  await compileProject(root);
  const clean = await diffProject(root);
  assert.equal(clean.ok, true);
  assert.deepEqual(clean.issues, []);
});

test("checkProject strict mode reports unexpected old generated files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-check-"));
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "demo-agent-tool",
      summary: "Browser automation CLI",
      targets: ["codex"],
      principles: ["Verify before completion"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "demo-agent-tool-old",
          description: "Use when changing the old skill.",
          workflow: ["Run tests"]
        }
      ]
    })
  );
  await compileProject(root);
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "demo-agent-tool",
      summary: "Browser automation CLI",
      targets: ["codex"],
      principles: ["Verify before completion"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "demo-agent-tool-new",
          description: "Use when changing the new skill.",
          workflow: ["Run tests"]
        }
      ]
    })
  );
  await compileProject(root);

  const normal = await checkProject(root);
  assert.equal(normal.ok, true);

  const strict = await checkProject(root, { strict: true });
  assert.equal(strict.ok, false);
  assert.ok(strict.issues.some((issue) => issue.includes("demo-agent-tool-old")));
});
