import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

const ZIP_EPOCH_DATE = 33;
const ZIP_EPOCH_TIME = 0;

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(root, outputPath, dir = "") {
  const absoluteDir = path.join(root, dir);
  const entries = await readdir(absoluteDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const relative = path.join(dir, entry.name).replaceAll(path.sep, "/");
    const absolute = path.join(root, relative);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(root, outputPath, relative)));
      continue;
    }
    if (relative.endsWith(".mcpb")) continue;
    if (path.resolve(absolute) === path.resolve(outputPath)) continue;
    files.push({
      name: relative,
      absolute
    });
  }
  return files.sort((a, b) => a.name.localeCompare(b.name));
}

const CRC_TABLE = new Uint32Array(256).map((_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function localHeader(entry) {
  const header = Buffer.alloc(30 + entry.nameBuffer.length);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(0, 6);
  header.writeUInt16LE(entry.method, 8);
  header.writeUInt16LE(ZIP_EPOCH_TIME, 10);
  header.writeUInt16LE(ZIP_EPOCH_DATE, 12);
  header.writeUInt32LE(entry.crc, 14);
  header.writeUInt32LE(entry.compressedSize, 18);
  header.writeUInt32LE(entry.uncompressedSize, 22);
  header.writeUInt16LE(entry.nameBuffer.length, 26);
  header.writeUInt16LE(0, 28);
  entry.nameBuffer.copy(header, 30);
  return header;
}

function centralHeader(entry) {
  const header = Buffer.alloc(46 + entry.nameBuffer.length);
  header.writeUInt32LE(0x02014b50, 0);
  header.writeUInt16LE(20, 4);
  header.writeUInt16LE(20, 6);
  header.writeUInt16LE(0, 8);
  header.writeUInt16LE(entry.method, 10);
  header.writeUInt16LE(ZIP_EPOCH_TIME, 12);
  header.writeUInt16LE(ZIP_EPOCH_DATE, 14);
  header.writeUInt32LE(entry.crc, 16);
  header.writeUInt32LE(entry.compressedSize, 20);
  header.writeUInt32LE(entry.uncompressedSize, 24);
  header.writeUInt16LE(entry.nameBuffer.length, 28);
  header.writeUInt16LE(0, 30);
  header.writeUInt16LE(0, 32);
  header.writeUInt16LE(0, 34);
  header.writeUInt16LE(0, 36);
  header.writeUInt32LE(0o100644 * 0x10000, 38);
  header.writeUInt32LE(entry.offset, 42);
  entry.nameBuffer.copy(header, 46);
  return header;
}

function endOfCentralDirectory(entries, centralSize, centralOffset) {
  const footer = Buffer.alloc(22);
  footer.writeUInt32LE(0x06054b50, 0);
  footer.writeUInt16LE(0, 4);
  footer.writeUInt16LE(0, 6);
  footer.writeUInt16LE(entries.length, 8);
  footer.writeUInt16LE(entries.length, 10);
  footer.writeUInt32LE(centralSize, 12);
  footer.writeUInt32LE(centralOffset, 16);
  footer.writeUInt16LE(0, 20);
  return footer;
}

async function zipBuffer(files) {
  const localParts = [];
  const entries = [];
  let offset = 0;
  for (const file of files) {
    const data = await readFile(file.absolute);
    const compressed = deflateRawSync(data, { level: 9 });
    const useCompressed = compressed.length < data.length;
    const body = useCompressed ? compressed : data;
    const entry = {
      name: file.name,
      nameBuffer: Buffer.from(file.name),
      method: useCompressed ? 8 : 0,
      crc: crc32(data),
      compressedSize: body.length,
      uncompressedSize: data.length,
      offset
    };
    const header = localHeader(entry);
    localParts.push(header, body);
    offset += header.length + body.length;
    entries.push(entry);
  }

  const centralOffset = offset;
  const centralParts = entries.map(centralHeader);
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  return Buffer.concat([...localParts, ...centralParts, endOfCentralDirectory(entries, centralSize, centralOffset)]);
}

function defaultOutputPath(projectRoot, manifest) {
  return path.join(projectRoot, `${manifest.name}-${manifest.version}.mcpb`);
}

export async function packMcpb(projectRoot = process.cwd(), output) {
  const root = path.resolve(projectRoot);
  const mcpDir = path.join(root, ".mcp");
  if (!(await exists(mcpDir))) {
    throw new Error("Missing .mcp directory. Run `skillpack-forge compile <path>` with the `mcp` target first.");
  }

  const manifestPath = path.join(mcpDir, "manifest.json");
  if (!(await exists(manifestPath))) {
    throw new Error("Missing .mcp/manifest.json. Run `skillpack-forge compile <path>` before packing MCPB.");
  }

  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const entryPoint = manifest.server?.entry_point;
  if (!entryPoint) {
    throw new Error("Invalid .mcp/manifest.json: missing server.entry_point.");
  }

  const serverPath = path.join(mcpDir, entryPoint);
  if (!(await exists(serverPath))) {
    throw new Error(`Missing MCP server entry point: .mcp/${entryPoint}. Run \`skillpack-forge compile <path>\` again.`);
  }

  const outputPath = output ? path.resolve(root, output) : defaultOutputPath(root, manifest);
  const files = await collectFiles(mcpDir, outputPath);
  if (!files.some((file) => file.name === "manifest.json")) {
    throw new Error("MCPB package would not include manifest.json.");
  }

  const bundle = await zipBuffer(files);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, bundle);

  return {
    output: outputPath,
    files: files.map((file) => file.name),
    manifest,
    size: bundle.length
  };
}
