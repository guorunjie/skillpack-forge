import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { compileProject } from "../src/compiler.js";
import { importManifestFromProject } from "../src/importer.js";
import { stringifyManifest } from "../src/manifest.js";

test("importManifestFromProject detects generated agent targets and metadata", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-import-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "import-demo", scripts: { test: "node --test" } }));
  await writeFile(
    path.join(root, "skillpack.yaml"),
    stringifyManifest({
      name: "import-demo",
      summary: "Existing browser automation repo",
      targets: ["agents", "claude-md", "claude", "codex", "cursor", "copilot", "mcp"],
      principles: ["Keep edits scoped", "Run verification"],
      commands: {
        test: "npm test"
      },
      skills: [
        {
          name: "import-demo-developer",
          description: "Use when changing import-demo.",
          workflow: ["Inspect context", "Run npm test"]
        }
      ]
    })
  );
  await compileProject(root);

  const manifest = await importManifestFromProject(root);

  assert.equal(manifest.name, "import-demo");
  assert.equal(manifest.summary, "Existing browser automation repo");
  assert.deepEqual(manifest.targets.sort(), ["agents", "claude-md", "claude", "codex", "copilot", "cursor", "mcp"].sort());
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].name, "import-demo-developer");
});

test("importManifestFromProject creates a manifest from a hand-written AGENTS.md", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-import-agents-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "handwritten-demo" }));
  await writeFile(
    path.join(root, "AGENTS.md"),
    `# Agent Guide: handwritten-demo

## Project
Hand-written agent instructions.

## Working Principles
- Preserve user changes
- Verify before completion

## Commands
- test: \`npm test\`

## Agent Workflows
### handwritten-demo-developer
Use when changing handwritten-demo.

- Inspect context
- Run npm test
`
  );

  const manifest = await importManifestFromProject(root);

  assert.equal(manifest.summary, "Hand-written agent instructions.");
  assert.deepEqual(manifest.targets, ["agents"]);
  assert.deepEqual(manifest.principles, ["Preserve user changes", "Verify before completion"]);
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].description, "Use when changing handwritten-demo.");
  assert.deepEqual(manifest.skills[0].workflow, ["Inspect context", "Run npm test"]);
});

test("importManifestFromProject imports CLAUDE.md as claude-md target", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-import-claude-md-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "claude-md-demo" }));
  await writeFile(
    path.join(root, "CLAUDE.md"),
    `# Claude Instructions for claude-md-demo

## Project
Claude repo instructions.

## Principles
- Keep Claude focused

## Commands
- test: \`npm test\`

## Preferred Workflow
- Inspect the repo
- Run npm test
`
  );

  const manifest = await importManifestFromProject(root);

  assert.equal(manifest.summary, "Claude repo instructions.");
  assert.deepEqual(manifest.targets, ["claude-md"]);
  assert.deepEqual(manifest.principles, ["Keep Claude focused"]);
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].name, "claude-md-demo-developer");
  assert.deepEqual(manifest.skills[0].workflow, ["Inspect the repo", "Run npm test"]);
});

test("importManifestFromProject detects an MCPB manifest as the mcp target", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-import-mcpb-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "mcpb-demo" }));
  await mkdir(path.join(root, ".mcp"), { recursive: true });
  await writeFile(
    path.join(root, ".mcp/manifest.json"),
    JSON.stringify({
      manifest_version: "0.3",
      name: "mcpb-demo-skillpack",
      version: "1.0.0",
      description: "Generated MCPB manifest",
      author: { name: "mcpb-demo" },
      server: {
        type: "node",
        entry_point: "skillpack-server.mjs",
        mcp_config: {
          command: "node",
          args: ["${__dirname}/skillpack-server.mjs"]
        }
      }
    })
  );

  const manifest = await importManifestFromProject(root);

  assert.deepEqual(manifest.targets, ["mcp"]);
  assert.equal(manifest.name, "mcpb-demo");
});
