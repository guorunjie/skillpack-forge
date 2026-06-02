import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const IGNORED_DIRS = new Set([".git", "node_modules", "dist", "build", "coverage", ".next", ".turbo"]);

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function scriptCommand(scriptName, packageManagers) {
  const manager = packageManagers[0] ?? "npm";
  if (manager === "pnpm") return scriptName === "test" ? "pnpm test" : `pnpm run ${scriptName}`;
  if (manager === "yarn") return scriptName === "test" ? "yarn test" : `yarn ${scriptName}`;
  return scriptName === "test" ? "npm test" : `npm run ${scriptName}`;
}

function packageManagersFor(rootFiles) {
  if (rootFiles.includes("pnpm-lock.yaml")) return ["pnpm"];
  if (rootFiles.includes("yarn.lock")) return ["yarn"];
  if (rootFiles.includes("package-lock.json")) return ["npm"];
  if (rootFiles.includes("package.json")) return ["npm"];
  return [];
}

function dependencyNames(pkg) {
  return [
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.optionalDependencies ?? {})
  ];
}

async function collectDocs(root, dir = "", depth = 0) {
  if (depth > 2) return [];
  const absolute = path.join(root, dir);
  const entries = await readdir(absolute, { withFileTypes: true });
  const docs = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      docs.push(...(await collectDocs(root, path.join(dir, entry.name), depth + 1)));
      continue;
    }
    const relative = path.join(dir, entry.name).replaceAll(path.sep, "/");
    if (/^(README|AGENTS|CLAUDE|CHANGELOG)(\..*)?$/i.test(entry.name) || /^docs\/.+\.md$/i.test(relative)) {
      docs.push(relative);
    }
  }
  return docs.sort();
}

export async function scanProject(root = process.cwd()) {
  const projectRoot = path.resolve(root);
  const rootFiles = (await readdir(projectRoot)).sort();
  const commands = {};
  const languages = [];
  const capabilities = [];
  let name = path.basename(projectRoot);
  let summary = "Automation-ready repository";
  let packageManagers = [];

  if (rootFiles.includes("package.json")) {
    const pkg = await readJson(path.join(projectRoot, "package.json"));
    name = pkg.name ?? name;
    summary = pkg.description ?? summary;
    languages.push("javascript");
    packageManagers = packageManagersFor(rootFiles);
    commands.install = packageManagers[0] === "pnpm" ? "pnpm install" : packageManagers[0] === "yarn" ? "yarn install" : "npm install";
    for (const scriptName of [
      "dev",
      "test",
      "e2e",
      "test:e2e",
      "lint",
      "build",
      "format",
      "docs",
      "docs:check",
      "release",
      "validate",
      "data:validate",
      "data:extract",
      "data:transform",
      "data:load",
      "data:report",
      "compile",
      "doctor",
      "scan",
      "diff",
      "check",
      "mcpb",
      "templates",
      "import-json"
    ]) {
      if (pkg.scripts?.[scriptName]) commands[scriptName] = scriptCommand(scriptName, packageManagers);
    }
    if (["data:validate", "data:extract", "data:transform", "data:load", "data:report"].some((scriptName) => pkg.scripts?.[scriptName])) {
      capabilities.push("data-pipeline");
    }
    const deps = dependencyNames(pkg);
    if (deps.some((dep) => ["playwright", "@playwright/test", "puppeteer", "selenium-webdriver"].includes(dep))) {
      capabilities.push("browser-automation");
    }
    if (deps.includes("electron")) capabilities.push("desktop-automation");
    if (deps.includes("xlsx")) capabilities.push("spreadsheet-automation");
  }

  if (rootFiles.includes("pyproject.toml") || rootFiles.includes("requirements.txt")) {
    languages.push("python");
    if (!commands.install) commands.install = rootFiles.includes("requirements.txt") ? "python -m pip install -r requirements.txt" : "python -m pip install -e .";
    if (!commands.test) commands.test = "pytest";
  }

  if (rootFiles.includes("go.mod")) {
    languages.push("go");
    commands.test ??= "go test ./...";
    commands.build ??= "go build ./...";
  }

  if (rootFiles.includes("Cargo.toml")) {
    languages.push("rust");
    commands.test ??= "cargo test";
    commands.build ??= "cargo build";
  }

  if (await exists(path.join(projectRoot, "playwright.config.js"))) capabilities.push("browser-automation");
  if (await exists(path.join(projectRoot, "playwright.config.ts"))) capabilities.push("browser-automation");

  return {
    root: projectRoot,
    name,
    summary,
    languages: unique(languages),
    packageManagers: unique(packageManagers),
    commands,
    capabilities: unique(capabilities),
    docs: await collectDocs(projectRoot)
  };
}
