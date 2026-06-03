import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { createManifestFromScan, parseManifest, stringifyManifest } from "../src/manifest.js";

test("createManifestFromScan produces portable agent targets", () => {
  const manifest = createManifestFromScan({
    name: "demo-agent-tool",
    summary: "Browser automation CLI",
    languages: ["javascript"],
    packageManagers: ["npm"],
    commands: {
      install: "npm install",
      test: "npm test",
      lint: "npm run lint"
    },
    capabilities: ["browser-automation"],
    docs: ["README.md"]
  });

  assert.equal(manifest.name, "demo-agent-tool");
  assert.deepEqual(manifest.targets, ["agents", "claude-md", "claude", "codex", "cursor", "copilot", "mcp"]);
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].name, "demo-agent-tool-developer");
});

test("stringifyManifest and parseManifest round-trip the supported schema", () => {
  const manifest = {
    name: "demo-agent-tool",
    summary: "Browser automation CLI",
    targets: ["agents", "claude-md", "claude", "codex", "mcp"],
    principles: ["Preserve user changes", "Verify before completion"],
    commands: {
      install: "npm install",
      test: "npm test",
      "test:e2e": "npm run test:e2e",
      "data:validate": "npm run data:validate"
    },
    cursor: {
      description: "Use for TypeScript source and test files.",
      globs: ["src/**/*.ts", "test/**/*.ts"],
      alwaysApply: false
    },
    skills: [
      {
        name: "demo-agent-tool-developer",
        description: "Use when changing the demo agent tool.",
        workflow: ["Scan context", "Run focused tests"]
      }
    ]
  };

  const parsed = parseManifest(stringifyManifest(manifest));

  assert.deepEqual(parsed, manifest);
});

test("skillpack.schema.json describes the supported manifest shape", async () => {
  const schema = JSON.parse(await readFile("skillpack.schema.json", "utf8"));

  assert.equal(schema.title, "Skillpack Forge Manifest");
  assert.deepEqual(schema.required, ["name", "summary", "targets", "principles", "commands", "skills"]);
  assert.deepEqual(schema.properties.targets.items.enum, ["agents", "claude-md", "claude", "codex", "cursor", "copilot", "mcp"]);
  assert.deepEqual(Object.keys(schema.properties.cursor.properties), ["description", "globs", "alwaysApply"]);
  assert.equal(schema.properties.skills.items.required.includes("workflow"), true);
});
