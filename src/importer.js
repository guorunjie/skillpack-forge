import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { createManifestFromScan, slugify } from "./manifest.js";
import { scanProject } from "./scanner.js";

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readIfExists(filePath) {
  if (!(await exists(filePath))) return "";
  return readFile(filePath, "utf8");
}

async function collectFiles(root, dir, matcher) {
  const absolute = path.join(root, dir);
  if (!(await exists(absolute))) return [];
  const entries = await readdir(absolute, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(dir, entry.name).replaceAll(path.sep, "/");
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(root, relative, matcher)));
      continue;
    }
    if (matcher(relative)) files.push(relative);
  }
  return files.sort();
}

function section(text, headingNames) {
  const names = headingNames.map((name) => name.toLowerCase());
  const lines = text.split(/\r?\n/);
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^(#{2,6})\s+(.+)$/);
    if (!match) continue;
    if (names.includes(match[2].trim().toLowerCase())) {
      start = i + 1;
      level = match[1].length;
      break;
    }
  }
  if (start === -1) return "";
  const body = [];
  for (let i = start; i < lines.length; i += 1) {
    const match = lines[i].match(/^(#{2,6})\s+/);
    if (match && match[1].length <= level) break;
    body.push(lines[i]);
  }
  return body.join("\n").trim();
}

function bullets(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*[-*]\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function commandsFrom(text) {
  const found = {};
  for (const item of bullets(section(text, ["Commands"]))) {
    const match = item.match(/^([A-Za-z0-9_-]+):\s*`?([^`]+?)`?$/);
    if (match) found[match[1]] = match[2].trim();
  }
  return found;
}

function frontmatter(text) {
  if (!text.startsWith("---\n")) return {};
  const end = text.indexOf("\n---", 4);
  if (end === -1) return {};
  const values = {};
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (match) values[match[1]] = match[2].trim();
  }
  return values;
}

function summaryFrom(text) {
  const project = section(text, ["Project"]);
  const source = project || text;
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith("---") && !line.startsWith("- ")) ?? "";
}

function firstHeading(text) {
  return text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
}

function skillsFromAgents(text, fallbackName) {
  const lines = section(text, ["Agent Workflows", "Preferred Workflow"]).split(/\r?\n/);
  const skills = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      if (current) skills.push(current);
      current = {
        name: slugify(heading[1]),
        description: "",
        workflow: []
      };
      continue;
    }
    if (!current) continue;
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      current.workflow.push(bullet[1].trim());
    } else if (!current.description && line.trim()) {
      current.description = line.trim();
    }
  }
  if (current) skills.push(current);
  if (skills.length) return skills;
  const workflow = bullets(section(text, ["Preferred Workflow", "Workflow", "Agent Workflows"]));
  if (!workflow.length) return [];
  return [
    {
      name: `${fallbackName}-developer`,
      description: `Use when changing, testing, or automating ${fallbackName}.`,
      workflow
    }
  ];
}

function skillFromSkillFile(text, fallbackName) {
  const meta = frontmatter(text);
  const heading = firstHeading(text);
  const name = slugify(meta.name ?? heading ?? fallbackName);
  return {
    name,
    description: meta.description ?? `Use when changing, testing, or automating ${fallbackName}.`,
    workflow: bullets(section(text, ["Workflow", "Preferred Workflow"])) || []
  };
}

function mergeUnique(values) {
  return [...new Set(values.filter(Boolean))];
}

function mergeSkills(skills, fallbackSkill) {
  const byName = new Map();
  for (const skill of skills) {
    const normalized = {
      name: slugify(skill.name),
      description: skill.description || fallbackSkill.description,
      workflow: skill.workflow?.length ? mergeUnique(skill.workflow) : fallbackSkill.workflow
    };
    if (!byName.has(normalized.name)) {
      byName.set(normalized.name, normalized);
      continue;
    }
    const current = byName.get(normalized.name);
    byName.set(normalized.name, {
      ...current,
      description: current.description || normalized.description,
      workflow: mergeUnique([...(current.workflow ?? []), ...(normalized.workflow ?? [])])
    });
  }
  return [...byName.values()];
}

export async function importManifestFromProject(root = process.cwd()) {
  const projectRoot = path.resolve(root);
  const scan = await scanProject(projectRoot);
  const base = createManifestFromScan(scan);
  const name = slugify(scan.name);
  const targets = [];
  const texts = [];
  const importedSkills = [];

  const agents = await readIfExists(path.join(projectRoot, "AGENTS.md"));
  if (agents) {
    targets.push("agents");
    texts.push(agents);
    importedSkills.push(...skillsFromAgents(agents, name));
  }

  const claudeMd = await readIfExists(path.join(projectRoot, "CLAUDE.md"));
  if (claudeMd) {
    targets.push("claude-md");
    texts.push(claudeMd);
    importedSkills.push(...skillsFromAgents(claudeMd, name));
  }

  const copilot = await readIfExists(path.join(projectRoot, ".github/copilot-instructions.md"));
  if (copilot) {
    targets.push("copilot");
    texts.push(copilot);
    importedSkills.push(...skillsFromAgents(copilot, name));
  }

  const cursorFiles = await collectFiles(projectRoot, ".cursor/rules", (relative) => relative.endsWith(".mdc"));
  for (const relative of cursorFiles) texts.push(await readFile(path.join(projectRoot, relative), "utf8"));
  if (cursorFiles.length) targets.push("cursor");

  const skillFiles = [
    ...(await collectFiles(projectRoot, ".claude/skills", (relative) => relative.endsWith("/SKILL.md"))).map((file) => ({
      file,
      target: "claude"
    })),
    ...(await collectFiles(projectRoot, ".codex/skills", (relative) => relative.endsWith("/SKILL.md"))).map((file) => ({
      file,
      target: "codex"
    }))
  ];
  for (const { file, target } of skillFiles) {
    const text = await readFile(path.join(projectRoot, file), "utf8");
    targets.push(target);
    texts.push(text);
    importedSkills.push(skillFromSkillFile(text, name));
  }

  if (!targets.length) {
    throw new Error("No importable agent files found. Expected AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/*.mdc, or */SKILL.md.");
  }

  const principles = mergeUnique(texts.flatMap((text) => bullets(section(text, ["Working Principles", "Principles"]))));
  const commands = texts.reduce((acc, text) => ({ ...acc, ...commandsFrom(text) }), {});
  const summary = texts.map(summaryFrom).find(Boolean);

  return {
    ...base,
    name,
    summary: summary || base.summary,
    targets: mergeUnique(targets),
    principles: principles.length ? principles : base.principles,
    commands: Object.keys(commands).length ? commands : base.commands,
    skills: importedSkills.length ? mergeSkills(importedSkills, base.skills[0]) : base.skills
  };
}
