#!/usr/bin/env node
import { stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { checkProject, compileProjectWithOptions, diffProject, doctorProject } from "../src/compiler.js";
import { importManifestFromProject } from "../src/importer.js";
import { createManifestFromScan, stringifyManifest } from "../src/manifest.js";
import { scanProject } from "../src/scanner.js";
import { createTemplateManifest, templateNames } from "../src/templates.js";

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
  skillpack-forge import [path] [--force] [--json]
  skillpack-forge new [template] [path] [--force] [--json]
  skillpack-forge compile [path] [--dry-run]
  skillpack-forge doctor [path]
  skillpack-forge diff [path]
  skillpack-forge check [path] [--strict]
`;
}

function positional(args, fallback = process.cwd()) {
  return args.find((arg) => !arg.startsWith("--")) ?? fallback;
}

function positionals(args) {
  return args.filter((arg) => !arg.startsWith("--"));
}

function looksLikePath(value) {
  return value === "." || value === ".." || value.startsWith("/") || value.startsWith("./") || value.startsWith("../");
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

  if (command === "import") {
    const root = path.resolve(positional(args));
    const manifest = await importManifestFromProject(root);
    if (args.includes("--json")) {
      console.log(JSON.stringify(manifest, null, 2));
      return 0;
    }
    const manifestPath = path.join(root, "skillpack.yaml");
    if ((await exists(manifestPath)) && !args.includes("--force")) {
      throw new Error("skillpack.yaml already exists. Re-run with --force to overwrite it.");
    }
    await writeFile(manifestPath, stringifyManifest(manifest));
    console.log(`imported ${manifestPath}`);
    return 0;
  }

  if (command === "new") {
    if (args.includes("--list")) {
      console.log(templateNames().join("\n"));
      return 0;
    }
    const values = positionals(args);
    let template = "automation";
    let rootArg = process.cwd();
    if (values[0]) {
      if (templateNames().includes(values[0])) {
        template = values[0];
        rootArg = values[1] ?? process.cwd();
      } else if (looksLikePath(values[0])) {
        rootArg = values[0];
      } else {
        template = values[0];
        rootArg = values[1] ?? process.cwd();
      }
    }

    const root = path.resolve(rootArg);
    const manifest = await createTemplateManifest(template, root);
    if (args.includes("--json")) {
      console.log(JSON.stringify(manifest, null, 2));
      return 0;
    }
    const manifestPath = path.join(root, "skillpack.yaml");
    if ((await exists(manifestPath)) && !args.includes("--force")) {
      throw new Error("skillpack.yaml already exists. Re-run with --force to overwrite it.");
    }
    await writeFile(manifestPath, stringifyManifest(manifest));
    console.log(`created ${manifestPath} from ${template}`);
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

  if (command === "check") {
    const root = positional(args);
    const result = await checkProject(root, { strict: args.includes("--strict") });
    if (!result.ok) {
      for (const issue of result.issues) console.error(`issue: ${issue}`);
      return 1;
    }
    console.log(args.includes("--strict") ? "ok: strict skillpack checks passed" : "ok: skillpack checks passed");
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
