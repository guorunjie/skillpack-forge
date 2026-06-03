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

function frontmatterBlock(text) {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return "";
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return match?.[1] ?? "";
}

function stripFrontmatter(text) {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) return text;
  return text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "");
}

function parseFrontmatterScalar(value) {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatterInlineList(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  return trimmed
    .slice(1, -1)
    .split(",")
    .map((item) => parseFrontmatterScalar(item))
    .filter(Boolean);
}

function frontmatter(text) {
  const block = frontmatterBlock(text);
  if (!block) return {};
  const values = {};
  const lines = block.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (raw.trim()) {
      values[key] = parseFrontmatterInlineList(raw) ?? parseFrontmatterScalar(raw);
      continue;
    }
    const items = [];
    i += 1;
    while (i < lines.length) {
      const item = lines[i].match(/^\s*-\s+(.+)$/);
      if (!item) {
        i -= 1;
        break;
      }
      items.push(parseFrontmatterScalar(item[1]));
      i += 1;
    }
    values[key] = items;
  }
  return values;
}

function summaryFrom(text) {
  const project = section(text, ["Project"]);
  const source = project || stripFrontmatter(text);
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith("---") && !line.startsWith("- ") && !line.startsWith("Generated from `skillpack.yaml`")) ?? "";
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

function globList(value) {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function cursorMetadataFrom(text) {
  const meta = frontmatter(text);
  const cursor = {};
  if (meta.description) cursor.description = String(meta.description);
  const globs = globList(meta.globs);
  if (globs.length) cursor.globs = globs;
  if (typeof meta.alwaysApply === "boolean") cursor.alwaysApply = meta.alwaysApply;
  if (typeof meta.alwaysApply === "string" && /^(true|false)$/.test(meta.alwaysApply)) {
    cursor.alwaysApply = meta.alwaysApply === "true";
  }
  return Object.keys(cursor).length ? cursor : null;
}

function mergeCursorMetadata(metadata) {
  const globs = mergeUnique(metadata.flatMap((item) => item.globs ?? []));
  const alwaysApplyValues = metadata
    .map((item) => item.alwaysApply)
    .filter((value) => typeof value === "boolean");
  const cursor = {};
  const description = metadata.map((item) => item.description).find(Boolean);
  if (description) cursor.description = description;
  if (globs.length) cursor.globs = globs;
  if (alwaysApplyValues.length) cursor.alwaysApply = alwaysApplyValues.includes(true);
  return Object.keys(cursor).length ? cursor : null;
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
  const cursorMetadata = [];

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
  for (const relative of cursorFiles) {
    const text = await readFile(path.join(projectRoot, relative), "utf8");
    texts.push(text);
    const metadata = cursorMetadataFrom(text);
    if (metadata) cursorMetadata.push(metadata);
  }
  if (cursorFiles.length) targets.push("cursor");

  const mcpReadme = await readIfExists(path.join(projectRoot, ".mcp/README.md"));
  const mcpServer = await readIfExists(path.join(projectRoot, ".mcp/skillpack-server.mjs"));
  const mcpManifest = await readIfExists(path.join(projectRoot, ".mcp/manifest.json"));
  if (mcpReadme || mcpServer || mcpManifest) {
    targets.push("mcp");
    if (mcpReadme) texts.push(mcpReadme);
  }

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
    throw new Error("No importable agent files found. Expected AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, .cursor/rules/*.mdc, .mcp/manifest.json, .mcp/skillpack-server.mjs, or */SKILL.md.");
  }

  const principles = mergeUnique(texts.flatMap((text) => bullets(section(text, ["Working Principles", "Principles"]))));
  const commands = texts.reduce((acc, text) => ({ ...acc, ...commandsFrom(text) }), {});
  const summary = texts.map(summaryFrom).find(Boolean);
  const cursor = mergeCursorMetadata(cursorMetadata);

  const manifest = {
    ...base,
    name,
    summary: summary || base.summary,
    targets: mergeUnique(targets),
    principles: principles.length ? principles : base.principles,
    commands: Object.keys(commands).length ? commands : base.commands,
    skills: importedSkills.length ? mergeSkills(importedSkills, base.skills[0]) : base.skills
  };
  if (cursor) manifest.cursor = cursor;
  return manifest;
}
