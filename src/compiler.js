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
  const files = [];
  const targets = new Set(manifest.targets ?? []);
  const skills = manifest.skills ?? [];
  if (targets.has("agents")) files.push("AGENTS.md");
  if (targets.has("cursor")) files.push(`.cursor/rules/${manifest.name}.mdc`);
  if (targets.has("copilot")) files.push(".github/copilot-instructions.md");
  for (const skill of skills) {
    if (targets.has("claude")) files.push(`.claude/skills/${skill.name}/SKILL.md`);
    if (targets.has("codex")) files.push(`.codex/skills/${skill.name}/SKILL.md`);
  }
  return files;
}

async function writeGenerated(root, relative, content) {
  const absolute = path.join(root, relative);
  await mkdir(path.dirname(absolute), { recursive: true });
  await writeFile(absolute, content);
}

export async function compileProject(root = process.cwd()) {
  const projectRoot = path.resolve(root);
  const manifest = await readManifest(projectRoot);
  const targets = new Set(manifest.targets ?? []);
  const files = [];

  if (targets.has("agents")) {
    await writeGenerated(projectRoot, "AGENTS.md", renderAgents(manifest));
    files.push("AGENTS.md");
  }
  if (targets.has("cursor")) {
    const file = `.cursor/rules/${manifest.name}.mdc`;
    await writeGenerated(projectRoot, file, renderCursorRule(manifest));
    files.push(file);
  }
  if (targets.has("copilot")) {
    await writeGenerated(projectRoot, ".github/copilot-instructions.md", renderCopilotInstructions(manifest));
    files.push(".github/copilot-instructions.md");
  }

  for (const skill of manifest.skills ?? []) {
    if (targets.has("claude")) {
      const file = `.claude/skills/${skill.name}/SKILL.md`;
      await writeGenerated(projectRoot, file, renderSkill(manifest, skill));
      files.push(file);
    }
    if (targets.has("codex")) {
      const file = `.codex/skills/${skill.name}/SKILL.md`;
      await writeGenerated(projectRoot, file, renderSkill(manifest, skill));
      files.push(file);
    }
  }

  return { files };
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
