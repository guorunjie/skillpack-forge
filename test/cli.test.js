import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
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
