import assert from "node:assert/strict";
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
  assert.deepEqual(manifest.targets, ["agents", "claude", "codex", "cursor", "copilot"]);
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].name, "demo-agent-tool-developer");
});

test("stringifyManifest and parseManifest round-trip the supported schema", () => {
  const manifest = {
    name: "demo-agent-tool",
    summary: "Browser automation CLI",
    targets: ["agents", "claude", "codex"],
    principles: ["Preserve user changes", "Verify before completion"],
    commands: {
      install: "npm install",
      test: "npm test"
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
