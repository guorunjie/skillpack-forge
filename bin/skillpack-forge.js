#!/usr/bin/env node
import { stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { compileProjectWithOptions, diffProject, doctorProject } from "../src/compiler.js";
import { createManifestFromScan, stringifyManifest } from "../src/manifest.js";
import { scanProject } from "../src/scanner.js";

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

function help() {
  return `Skillpack Forge

Usage:
  skillpack-forge scan [path] [--json]
  skillpack-forge init [path] [--force]
  skillpack-forge compile [path] [--dry-run]
  skillpack-forge doctor [path]
  skillpack-forge diff [path]
`;
}

function positional(args, fallback = process.cwd()) {
  return args.find((arg) => !arg.startsWith("--")) ?? fallback;
}

async function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (!command || command === "--help" || command === "-h") {
    console.log(help());
    return 0;
  }

  if (command === "scan") {
    const root = positional(args);
    const scan = await scanProject(root);
    if (args.includes("--json")) {
      console.log(JSON.stringify(scan, null, 2));
    } else {
      console.log(`${scan.name}`);
      console.log(`languages: ${scan.languages.join(", ") || "unknown"}`);
      console.log(`commands: ${Object.keys(scan.commands).join(", ") || "none"}`);
      console.log(`capabilities: ${scan.capabilities.join(", ") || "none"}`);
    }
    return 0;
  }

  if (command === "init") {
    const root = path.resolve(positional(args));
    const manifestPath = path.join(root, "skillpack.yaml");
    if ((await exists(manifestPath)) && !args.includes("--force")) {
      throw new Error("skillpack.yaml already exists. Re-run with --force to overwrite it.");
    }
    const manifest = createManifestFromScan(await scanProject(root));
    await writeFile(manifestPath, stringifyManifest(manifest));
    console.log(`created ${manifestPath}`);
    return 0;
  }

  if (command === "compile") {
    const root = positional(args);
    const result = await compileProjectWithOptions(root, { dryRun: args.includes("--dry-run") });
    if (result.dryRun) {
      for (const action of result.actions) console.log(`${action.exists ? "would overwrite" : "would create"} ${action.file}`);
    } else {
      for (const file of result.files) console.log(`wrote ${file}`);
    }
    return 0;
  }

  if (command === "doctor") {
    const root = positional(args);
    const result = await doctorProject(root);
    if (!result.ok) {
      for (const issue of result.issues) console.error(`issue: ${issue}`);
      return 1;
    }
    console.log("ok: skillpack is healthy");
    return 0;
  }

  if (command === "diff") {
    const root = positional(args);
    const result = await diffProject(root);
    if (!result.ok) {
      for (const issue of result.issues) console.error(`issue: ${issue}`);
      return 1;
    }
    console.log("ok: generated files match skillpack manifest");
    return 0;
  }

  throw new Error(`Unknown command: ${command}`);
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
