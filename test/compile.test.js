import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { checkProject, compileProject, compileProjectWithOptions, diffProject, doctorProject } from "../src/compiler.js";
import { stringifyManifest } from "../src/manifest.js";

test("compileProject writes AGENTS, skills, Cursor, and Copilot files", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-compile-"));
  const manifest = {
    name: "demo-agent-tool",
    summary: "Browser automation CLI",
    targets: ["agents", "claude-md", "claude", "codex", "cursor", "copilot"],
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
