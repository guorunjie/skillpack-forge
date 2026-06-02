import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { compileProject } from "../src/compiler.js";
import { stringifyManifest } from "../src/manifest.js";
import { packMcpb } from "../src/mcpb.js";

function zipEntryNames(buffer) {
  const footerSignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const footerOffset = buffer.lastIndexOf(footerSignature);
  assert.notEqual(footerOffset, -1);
  const entries = buffer.readUInt16LE(footerOffset + 10);
  let offset = buffer.readUInt32LE(footerOffset + 16);
  const names = [];
  for (let index = 0; index < entries; index += 1) {
    assert.equal(buffer.readUInt32LE(offset), 0x02014b50);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    names.push(buffer.subarray(offset + 46, offset + 46 + nameLength).toString("utf8"));
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return names;
}

test("packMcpb writes a zero-dependency MCPB bundle", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-mcpb-pack-"));
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

  const result = await packMcpb(root);

  assert.equal(path.basename(result.output), "demo-agent-tool-skillpack-1.0.0.mcpb");
  assert.deepEqual(result.files.toSorted(), ["README.md", "manifest.json", "skillpack-server.mjs"]);
  assert.equal(result.manifest.name, "demo-agent-tool-skillpack");
  assert.ok(result.size > 0);
  await stat(result.output);
  assert.deepEqual(zipEntryNames(await readFile(result.output)).sort(), ["README.md", "manifest.json", "skillpack-server.mjs"]);
});

test("packMcpb reports actionable errors before compile", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "skillpack-mcpb-missing-"));

  await assert.rejects(packMcpb(root), /Run `skillpack-forge compile <path>`/);
});
