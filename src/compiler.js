import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseManifest } from "./manifest.js";

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readManifest(root) {
  const yamlPath = path.join(root, "skillpack.yaml");
  const jsonPath = path.join(root, "skillpack.json");
  if (await exists(yamlPath)) return parseManifest(await readFile(yamlPath, "utf8"));
  if (await exists(jsonPath)) return JSON.parse(await readFile(jsonPath, "utf8"));
  throw new Error("Missing skillpack.yaml or skillpack.json");
}

function list(values) {
  return values.map((value) => `- ${value}`).join("\n");
}

function commandList(commands) {
  const entries = Object.entries(commands ?? {});
  if (!entries.length) return "- No commands recorded yet";
  return entries.map(([name, command]) => `- ${name}: \`${command}\``).join("\n");
}

function renderAgents(manifest) {
  return `# Agent Guide: ${manifest.name}

Generated from \`skillpack.yaml\` by Skillpack Forge.

## Project
${manifest.summary}

## Working Principles
${list(manifest.principles ?? [])}

## Commands
${commandList(manifest.commands)}

## Agent Workflows
${(manifest.skills ?? [])
  .map((skill) => `### ${skill.name}\n${skill.description}\n\n${list(skill.workflow ?? [])}`)
  .join("\n\n")}
`;
}

function renderSkill(manifest, skill) {
  return `---
name: ${skill.name}
description: ${skill.description}
---

# ${skill.name}

## Project
${manifest.summary}

## Workflow
${list(skill.workflow ?? [])}

## Commands
${commandList(manifest.commands)}

## Principles
${list(manifest.principles ?? [])}
`;
}

function renderCursorRule(manifest) {
  return `---
description: Agent rules for ${manifest.name}
globs:
  - "**/*"
alwaysApply: true
---

# ${manifest.name}

${manifest.summary}

## Principles
${list(manifest.principles ?? [])}

## Commands
${commandList(manifest.commands)}
`;
}

function renderCopilotInstructions(manifest) {
  return `# Copilot Instructions for ${manifest.name}

${manifest.summary}

## Principles
${list(manifest.principles ?? [])}

## Commands
${commandList(manifest.commands)}

## Preferred Workflow
${list((manifest.skills?.[0]?.workflow) ?? [])}
`;
}

function expectedFiles(manifest) {
  return generatedArtifacts(manifest).map((artifact) => artifact.file);
}

function generatedArtifacts(manifest) {
  const artifacts = [];
  const targets = new Set(manifest.targets ?? []);
  const skills = manifest.skills ?? [];
  if (targets.has("agents")) artifacts.push({ file: "AGENTS.md", content: renderAgents(manifest) });
  if (targets.has("cursor")) artifacts.push({ file: `.cursor/rules/${manifest.name}.mdc`, content: renderCursorRule(manifest) });
  if (targets.has("copilot")) artifacts.push({ file: ".github/copilot-instructions.md", content: renderCopilotInstructions(manifest) });
  for (const skill of skills) {
    if (targets.has("claude")) artifacts.push({ file: `.claude/skills/${skill.name}/SKILL.md`, content: renderSkill(manifest, skill) });
    if (targets.has("codex")) artifacts.push({ file: `.codex/skills/${skill.name}/SKILL.md`, content: renderSkill(manifest, skill) });
  }
  return artifacts;
}

async function writeGenerated(root, relative, content) {
  const absolute = path.join(root, relative);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, content);
}

export async function compileProject(root = process.cwd()) {
  return compileProjectWithOptions(root);
}

async function planWrites(root, artifacts) {
  const actions = [];
  for (const artifact of artifacts) {
    actions.push({
      file: artifact.file,
      exists: await exists(path.join(root, artifact.file))
    });
  }
  return actions;
}

export async function compileProjectWithOptions(root = process.cwd(), options = {}) {
  const projectRoot = path.resolve(root);
  const manifest = await readManifest(projectRoot);
  const artifacts = generatedArtifacts(manifest);
  const files = artifacts.map((artifact) => artifact.file);
  const actions = await planWrites(projectRoot, artifacts);

  if (options.dryRun) {
    return { files, actions, dryRun: true };
  }

  for (const artifact of artifacts) {
    await writeGenerated(projectRoot, artifact.file, artifact.content);
  }

  return { files, actions, dryRun: false };
}

export async function diffProject(root = process.cwd()) {
  const projectRoot = path.resolve(root);
  const issues = [];
  let manifest;
  try {
    manifest = await readManifest(projectRoot);
  } catch (error) {
    return { ok: false, issues: [error.message], files: [] };
  }

  const artifacts = generatedArtifacts(manifest);
  for (const artifact of artifacts) {
    const absolute = path.join(projectRoot, artifact.file);
    if (!(await exists(absolute))) {
      issues.push(`Missing generated file: ${artifact.file}`);
      continue;
    }
    const current = await readFile(absolute, "utf8");
    if (current !== artifact.content) {
      issues.push(`Generated file is stale: ${artifact.file}`);
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    files: artifacts.map((artifact) => artifact.file)
  };
}

export async function doctorProject(root = process.cwd()) {
  const projectRoot = path.resolve(root);
  const issues = [];
  let manifest;
  try {
    manifest = await readManifest(projectRoot);
  } catch (error) {
    return { ok: false, issues: [error.message] };
  }

  for (const file of expectedFiles(manifest)) {
    const absolute = path.join(projectRoot, file);
    if (!(await exists(absolute))) {
      issues.push(`Missing generated file: ${file}`);
      continue;
    }
    const content = await readFile(absolute, "utf8");
    if (/\b(TBD|TODO|FIXME|PLACEHOLDER)\b/i.test(content)) {
      issues.push(`Generated file contains placeholder text: ${file}`);
    }
  }

  return { ok: issues.length === 0, issues };
}
