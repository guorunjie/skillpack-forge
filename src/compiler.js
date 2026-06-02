import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { parseManifest } from "./manifest.js";

const GENERATED_MARKER = "Generated from `skillpack.yaml` by Skillpack Forge.";

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

${GENERATED_MARKER}

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

${GENERATED_MARKER}

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

${GENERATED_MARKER}

${manifest.summary}

## Principles
${list(manifest.principles ?? [])}

## Commands
${commandList(manifest.commands)}
`;
}

function renderCopilotInstructions(manifest) {
  return `# Copilot Instructions for ${manifest.name}

${GENERATED_MARKER}

${manifest.summary}

## Principles
${list(manifest.principles ?? [])}

## Commands
${commandList(manifest.commands)}

## Preferred Workflow
${list((manifest.skills?.[0]?.workflow) ?? [])}
`;
}

function renderClaudeInstructions(manifest) {
  return `# Claude Instructions for ${manifest.name}

${GENERATED_MARKER}

${manifest.summary}

## Principles
${list(manifest.principles ?? [])}

## Commands
${commandList(manifest.commands)}

## Preferred Workflow
${list((manifest.skills?.[0]?.workflow) ?? [])}
`;
}

function jsonForScript(value) {
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function renderMcpServer(manifest) {
  return `#!/usr/bin/env node
// ${GENERATED_MARKER}

const manifest = ${jsonForScript(manifest)};

function asList(values = []) {
  return values.map((value) => \`- \${value}\`).join("\\n");
}

function commandList(commands = {}) {
  const entries = Object.entries(commands);
  if (!entries.length) return "- No commands recorded yet";
  return entries.map(([name, command]) => \`- \${name}: \\\`\${command}\\\`\`).join("\\n");
}

function workflowList() {
  return (manifest.skills ?? [])
    .map((skill) => \`## \${skill.name}\\n\${skill.description}\\n\\n\${asList(skill.workflow ?? [])}\`)
    .join("\\n\\n");
}

function summaryText() {
  return \`# \${manifest.name}\\n\\n\${manifest.summary}\\n\\n## Targets\\n\${asList(manifest.targets ?? [])}\\n\\n## Principles\\n\${asList(manifest.principles ?? [])}\`;
}

function commandsText() {
  return \`# Commands for \${manifest.name}\\n\\n\${commandList(manifest.commands)}\`;
}

function workflowsText() {
  return \`# Workflows for \${manifest.name}\\n\\n\${workflowList() || "No workflows recorded yet"}\`;
}

const resourceHandlers = {
  "skillpack://manifest": () => JSON.stringify(manifest, null, 2),
  "skillpack://summary": summaryText,
  "skillpack://commands": commandsText,
  "skillpack://workflows": workflowsText
};

const resources = [
  {
    uri: "skillpack://manifest",
    name: "Skillpack manifest",
    description: "The complete skillpack manifest as JSON.",
    mimeType: "application/json"
  },
  {
    uri: "skillpack://summary",
    name: "Project summary",
    description: "Project summary, targets, and principles.",
    mimeType: "text/markdown"
  },
  {
    uri: "skillpack://commands",
    name: "Project commands",
    description: "Install, test, build, and automation commands from the skillpack.",
    mimeType: "text/markdown"
  },
  {
    uri: "skillpack://workflows",
    name: "Agent workflows",
    description: "Skill workflows from the skillpack.",
    mimeType: "text/markdown"
  }
];

const tools = [
  {
    name: "skillpack_summary",
    description: "Return the project summary, targets, and principles.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} }
  },
  {
    name: "skillpack_commands",
    description: "Return the project commands from skillpack.yaml.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} }
  },
  {
    name: "skillpack_workflows",
    description: "Return agent workflows from skillpack.yaml.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} }
  },
  {
    name: "skillpack_manifest",
    description: "Return the full skillpack manifest as JSON.",
    inputSchema: { type: "object", additionalProperties: false, properties: {} }
  }
];

function toolText(name) {
  if (name === "skillpack_summary") return summaryText();
  if (name === "skillpack_commands") return commandsText();
  if (name === "skillpack_workflows") return workflowsText();
  if (name === "skillpack_manifest") return JSON.stringify(manifest, null, 2);
  throw new Error(\`Unknown tool: \${name}\`);
}

function send(message) {
  process.stdout.write(\`\${JSON.stringify(message)}\\n\`);
}

function ok(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function handle(message) {
  const { id, method, params = {} } = message;
  if (method?.startsWith("notifications/")) return;
  try {
    if (method === "initialize") {
      ok(id, {
        protocolVersion: "2025-06-18",
        capabilities: {
          resources: {},
          tools: {}
        },
        serverInfo: {
          name: \`\${manifest.name}-skillpack\`,
          version: "1.0.0"
        }
      });
      return;
    }
    if (method === "ping") {
      ok(id, {});
      return;
    }
    if (method === "resources/list") {
      ok(id, { resources });
      return;
    }
    if (method === "resources/read") {
      const uri = params.uri;
      const read = resourceHandlers[uri];
      if (!read) {
        fail(id, -32602, \`Unknown resource: \${uri}\`);
        return;
      }
      const mimeType = resources.find((resource) => resource.uri === uri)?.mimeType ?? "text/plain";
      ok(id, { contents: [{ uri, mimeType, text: read() }] });
      return;
    }
    if (method === "tools/list") {
      ok(id, { tools });
      return;
    }
    if (method === "tools/call") {
      const text = toolText(params.name);
      ok(id, {
        content: [{ type: "text", text }],
        structuredContent: params.name === "skillpack_manifest" ? manifest : undefined
      });
      return;
    }
    fail(id, -32601, \`Method not found: \${method}\`);
  } catch (error) {
    fail(id, -32603, error.message);
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\\r?\\n/);
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      handle(JSON.parse(line));
    } catch (error) {
      fail(null, -32700, \`Parse error: \${error.message}\`);
    }
  }
});
`;
}

function renderMcpReadme(manifest) {
  return `# Skillpack MCP Server: ${manifest.name}

${GENERATED_MARKER}

This directory contains a zero-dependency local MCP stdio server generated from \`skillpack.yaml\`.

## Run

\`\`\`bash
node .mcp/skillpack-server.mjs
\`\`\`

## Client Configuration

Use this server as a local stdio MCP server:

\`\`\`json
{
  "mcpServers": {
    "${manifest.name}-skillpack": {
      "command": "node",
      "args": ["/absolute/path/to/.mcp/skillpack-server.mjs"]
    }
  }
}
\`\`\`

## Exposed Resources

- \`skillpack://manifest\`
- \`skillpack://summary\`
- \`skillpack://commands\`
- \`skillpack://workflows\`

## Exposed Tools

- \`skillpack_summary\`
- \`skillpack_commands\`
- \`skillpack_workflows\`
- \`skillpack_manifest\`
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
  if (targets.has("claude-md")) artifacts.push({ file: "CLAUDE.md", content: renderClaudeInstructions(manifest) });
  if (targets.has("cursor")) artifacts.push({ file: `.cursor/rules/${manifest.name}.mdc`, content: renderCursorRule(manifest) });
  if (targets.has("copilot")) artifacts.push({ file: ".github/copilot-instructions.md", content: renderCopilotInstructions(manifest) });
  if (targets.has("mcp")) {
    artifacts.push({ file: ".mcp/skillpack-server.mjs", content: renderMcpServer(manifest) });
    artifacts.push({ file: ".mcp/README.md", content: renderMcpReadme(manifest) });
  }
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

async function collectMatchingFiles(root, dir, matcher) {
  const absolute = path.join(root, dir);
  if (!(await exists(absolute))) return [];
  const entries = await readdir(absolute, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(dir, entry.name).replaceAll(path.sep, "/");
    if (entry.isDirectory()) {
      files.push(...(await collectMatchingFiles(root, relative, matcher)));
    } else if (matcher(relative)) {
      files.push(relative);
    }
  }
  return files;
}

async function generatedFilesOnDisk(root) {
  const candidates = [
    "AGENTS.md",
    "CLAUDE.md",
    ".github/copilot-instructions.md",
    ...(await collectMatchingFiles(root, ".mcp", (file) => file.endsWith(".mjs") || file.endsWith(".md"))),
    ...(await collectMatchingFiles(root, ".cursor/rules", (file) => file.endsWith(".mdc"))),
    ...(await collectMatchingFiles(root, ".claude/skills", (file) => file.endsWith("/SKILL.md"))),
    ...(await collectMatchingFiles(root, ".codex/skills", (file) => file.endsWith("/SKILL.md")))
  ];
  const files = [];
  for (const file of candidates) {
    const absolute = path.join(root, file);
    if (!(await exists(absolute))) continue;
    const content = await readFile(absolute, "utf8");
    if (content.includes(GENERATED_MARKER)) files.push(file);
  }
  return files.sort();
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

export async function checkProject(root = process.cwd(), options = {}) {
  const projectRoot = path.resolve(root);
  const doctor = await doctorProject(projectRoot);
  const diff = await diffProject(projectRoot);
  const issues = [...new Set([...doctor.issues, ...diff.issues])];

  if (options.strict) {
    let manifest;
    try {
      manifest = await readManifest(projectRoot);
    } catch {
      return { ok: issues.length === 0, issues };
    }
    const expected = new Set(expectedFiles(manifest));
    const generated = await generatedFilesOnDisk(projectRoot);
    for (const file of generated) {
      if (!expected.has(file)) issues.push(`Unexpected generated file: ${file}`);
    }
  }

  return { ok: issues.length === 0, issues };
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
