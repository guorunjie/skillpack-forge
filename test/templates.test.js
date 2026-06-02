import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { compileProject, doctorProject } from "../src/compiler.js";
import { stringifyManifest } from "../src/manifest.js";
import { createTemplateManifest, templateNames } from "../src/templates.js";

test("templateNames lists automation presets", () => {
  assert.deepEqual(templateNames(), [
    "automation",
    "browser-automation",
    "playwright-browser",
    "docs-automation",
    "release-automation",
    "ops-automation",
    "data-automation"
  ]);
});

test("createTemplateManifest creates a Playwright-specific browser skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-playwright-template-"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "playwright-demo",
      scripts: { test: "playwright test", e2e: "playwright test" },
      devDependencies: { "@playwright/test": "^1.0.0" }
    })
  );

  const manifest = await createTemplateManifest("playwright-browser", root);

  assert.equal(manifest.name, "playwright-demo");
  assert.equal(manifest.targets.includes("claude-md"), true);
  assert.match(manifest.summary, /Playwright/);
  assert.match(manifest.skills[0].workflow.join("\n"), /npx playwright test/);
});

test("createTemplateManifest creates a compilable browser automation skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-template-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "browser-demo", scripts: { test: "node --test" } }));

  const manifest = await createTemplateManifest("browser-automation", root);

  assert.equal(manifest.name, "browser-demo");
  assert.equal(manifest.targets.includes("claude"), true);
  assert.match(manifest.summary, /Browser automation/);
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].name, "browser-demo-browser-automation");

  await writeFile(path.join(root, "skillpack.yaml"), stringifyManifest(manifest));
  await compileProject(root);
  const doctor = await doctorProject(root);
  assert.equal(doctor.ok, true);
  assert.match(await readFile(path.join(root, ".github/copilot-instructions.md"), "utf8"), /Browser automation/);
});

test("createTemplateManifest rejects unknown templates", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-template-unknown-"));

  await assert.rejects(createTemplateManifest("unknown-template", root), /Unknown template/);
});
