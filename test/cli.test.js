import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";

const execFileAsync = promisify(execFile);

test("CLI init and compile create a working skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-cli-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "cli-demo", scripts: { test: "node --test" } }));

  await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "init", root], {
    cwd: path.resolve(".")
  });
  await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "compile", root], {
    cwd: path.resolve(".")
  });
  const { stdout } = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "doctor", root], {
    cwd: path.resolve(".")
  });

  assert.match(await readFile(path.join(root, "skillpack.yaml"), "utf8"), /cli-demo/);
  assert.match(await readFile(path.join(root, "AGENTS.md"), "utf8"), /cli-demo/);
  assert.match(stdout, /ok/);
});

test("CLI compile --dry-run does not write generated files and diff detects drift", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-cli-dry-run-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "cli-demo", scripts: { test: "node --test" } }));
  await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "init", root], {
    cwd: path.resolve(".")
  });

  const dryRun = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "compile", root, "--dry-run"], {
    cwd: path.resolve(".")
  });
  assert.match(dryRun.stdout, /would create AGENTS\.md/);
  await assert.rejects(readFile(path.join(root, "AGENTS.md"), "utf8"));

  await assert.rejects(
    execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "diff", root], {
      cwd: path.resolve(".")
    }),
    (error) => {
      assert.match(error.stderr, /Missing generated file/);
      return error.code === 1;
    }
  );

  await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "compile", root], {
    cwd: path.resolve(".")
  });
  const diff = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "diff", root], {
    cwd: path.resolve(".")
  });
  assert.match(diff.stdout, /generated files match/);
  const check = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "check", root, "--strict"], {
    cwd: path.resolve(".")
  });
  assert.match(check.stdout, /strict skillpack checks passed/);
});

test("CLI import creates skillpack.yaml from existing agent instructions", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-cli-import-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "import-cli-demo" }));
  await writeFile(
    path.join(root, "AGENTS.md"),
    `# Agent Guide: import-cli-demo

## Project
Imported CLI instructions.

## Working Principles
- Keep edits scoped

## Commands
- test: \`npm test\`

## Agent Workflows
### import-cli-demo-developer
Use when changing import-cli-demo.

- Run npm test
`
  );

  const result = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "import", root], {
    cwd: path.resolve(".")
  });

  assert.match(result.stdout, /imported/);
  const manifest = await readFile(path.join(root, "skillpack.yaml"), "utf8");
  assert.match(manifest, /Imported CLI instructions/);
  assert.match(manifest, /import-cli-demo-developer/);
});

test("CLI new creates a template skillpack", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-cli-new-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "new-cli-demo" }));

  const result = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "new", "release-automation", root], {
    cwd: path.resolve(".")
  });

  assert.match(result.stdout, /release-automation/);
  const manifest = await readFile(path.join(root, "skillpack.yaml"), "utf8");
  assert.match(manifest, /Release automation/);
  assert.match(manifest, /new-cli-demo-release-automation/);
});

test("CLI mcpb packs a generated MCPB bundle", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-cli-mcpb-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({ name: "mcpb-cli-demo", scripts: { test: "node --test" } }));
  await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "init", root], {
    cwd: path.resolve(".")
  });
  await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "compile", root], {
    cwd: path.resolve(".")
  });

  const output = path.join(root, "dist/mcpb-cli-demo.mcpb");
  const result = await execFileAsync("node", [path.resolve("bin/skillpack-forge.js"), "mcpb", root, output], {
    cwd: path.resolve(".")
  });

  assert.match(result.stdout, /packed/);
  assert.match(result.stdout, /manifest\.json/);
  assert.ok((await stat(output)).size > 0);
});
