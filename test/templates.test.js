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
    "test-automation",
    "ci-triage",
    "docs-automation",
    "release-automation",
    "ops-automation",
    "data-automation",
    "data-pipeline"
  ]);
});

test("automation skillpack gallery lists every template", async () => {
  const gallery = await readFile(path.resolve("docs/skillpack-gallery.md"), "utf8");
  for (const template of templateNames()) {
    assert.match(gallery, new RegExp(`\\\`${template}\\\``));
    assert.match(gallery, new RegExp(`examples/generated/${template}`));
  }
});

test("createTemplateManifest creates a CI triage skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-ci-triage-template-"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "ci-triage-demo",
      scripts: {
        test: "node --test",
        lint: "node scripts/lint.js",
        "ci:failed": "gh run view --log-failed"
      }
    })
  );

  const manifest = await createTemplateManifest("ci-triage", root);

  assert.equal(manifest.name, "ci-triage-demo");
  assert.equal(manifest.targets.includes("claude"), true);
  assert.equal(manifest.targets.includes("mcp"), true);
  assert.equal(manifest.commands["ci:failed"], "npm run ci:failed");
  assert.match(manifest.summary, /CI triage/);
  assert.match(manifest.skills[0].workflow.join("\n"), /failed step logs/);
  assert.match(manifest.skills[0].workflow.join("\n"), /likely flaky/);

  await writeFile(path.join(root, "skillpack.yaml"), stringifyManifest(manifest));
  await compileProject(root);
  const doctor = await doctorProject(root);
  assert.equal(doctor.ok, true);
});

test("createTemplateManifest creates a focused test automation skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-test-automation-template-"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "test-automation-demo",
      scripts: {
        test: "node --test",
        "test:watch": "node --watch --test",
        coverage: "node --test --experimental-test-coverage"
      }
    })
  );

  const manifest = await createTemplateManifest("test-automation", root);

  assert.equal(manifest.name, "test-automation-demo");
  assert.equal(manifest.targets.includes("claude-md"), true);
  assert.equal(manifest.targets.includes("mcp"), true);
  assert.equal(manifest.commands.test, "npm test");
  assert.match(manifest.summary, /Test automation/);
  assert.match(manifest.skills[0].workflow.join("\n"), /focused test/);
  assert.match(manifest.skills[0].workflow.join("\n"), /broader relevant suite/);

  await writeFile(path.join(root, "skillpack.yaml"), stringifyManifest(manifest));
  await compileProject(root);
  const doctor = await doctorProject(root);
  assert.equal(doctor.ok, true);
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
  assert.equal(manifest.targets.includes("mcp"), true);
  assert.match(manifest.summary, /Playwright/);
  assert.match(manifest.skills[0].workflow.join("\n"), /npx playwright test/);
});

test("createTemplateManifest creates a compilable browser automation skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-template-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "browser-demo", scripts: { test: "node --test" } }));

  const manifest = await createTemplateManifest("browser-automation", root);

  assert.equal(manifest.name, "browser-demo");
  assert.equal(manifest.targets.includes("claude"), true);
  assert.equal(manifest.targets.includes("mcp"), true);
  assert.match(manifest.summary, /Browser automation/);
  assert.equal(manifest.commands.test, "npm test");
  assert.equal(manifest.skills[0].name, "browser-demo-browser-automation");

  await writeFile(path.join(root, "skillpack.yaml"), stringifyManifest(manifest));
  await compileProject(root);
  const doctor = await doctorProject(root);
  assert.equal(doctor.ok, true);
  assert.match(await readFile(path.join(root, ".github/copilot-instructions.md"), "utf8"), /Browser automation/);
});

test("createTemplateManifest creates a data pipeline skillpack with pipeline commands", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-data-pipeline-template-"));
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({
      name: "data-pipeline-demo",
      scripts: {
        test: "node --test",
        "data:validate": "node scripts/validate-data.js",
        "data:transform": "node scripts/transform-data.js",
        "data:report": "node scripts/report-data.js"
      }
    })
  );

  const manifest = await createTemplateManifest("data-pipeline", root);

  assert.equal(manifest.name, "data-pipeline-demo");
  assert.equal(manifest.targets.includes("mcp"), true);
  assert.equal(manifest.commands["data:validate"], "npm run data:validate");
  assert.equal(manifest.commands["data:transform"], "npm run data:transform");
  assert.equal(manifest.commands["data:report"], "npm run data:report");
  assert.match(manifest.summary, /Data pipeline/);
  assert.match(manifest.skills[0].workflow.join("\n"), /row counts/);

  await writeFile(path.join(root, "skillpack.yaml"), stringifyManifest(manifest));
  await compileProject(root);
  const doctor = await doctorProject(root);
  assert.equal(doctor.ok, true);
});

test("createTemplateManifest rejects unknown templates", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-template-unknown-"));

  await assert.rejects(createTemplateManifest("unknown-template", root), /Unknown template/);
});
