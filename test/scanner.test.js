import assert from "node:assert/strict";
import { mkdtemp, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { scanProject } from "../src/scanner.js";

test("scanProject detects package metadata, commands, and docs", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-scan-"));
  await mkdir(path.join(root, "docs"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify(
      {
        name: "demo-agent-tool",
        scripts: {
          dev: "vite --host 127.0.0.1",
          test: "node --test",
          lint: "eslint .",
          doctor: "node ./bin/demo.js doctor ."
        },
        dependencies: {
          playwright: "^1.0.0"
        }
      },
      null,
      2
    )
  );
  await writeFile(path.join(root, "README.md"), "# Demo\n");
  await writeFile(path.join(root, "docs/runbook.md"), "# Runbook\n");

  const scan = await scanProject(root);

  assert.equal(scan.name, "demo-agent-tool");
  assert.deepEqual(scan.packageManagers, ["npm"]);
  assert.deepEqual(scan.languages, ["javascript"]);
  assert.equal(scan.commands.dev, "npm run dev");
  assert.equal(scan.commands.test, "npm test");
  assert.equal(scan.commands.lint, "npm run lint");
  assert.equal(scan.commands.doctor, "npm run doctor");
  assert.ok(scan.capabilities.includes("browser-automation"));
  assert.ok(scan.docs.includes("README.md"));
  assert.ok(scan.docs.includes("docs/runbook.md"));
});
