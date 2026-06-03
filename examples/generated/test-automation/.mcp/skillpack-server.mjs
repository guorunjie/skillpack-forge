#!/usr/bin/env node
// Generated from `skillpack.yaml` by Skillpack Forge.

const manifest = {
  "name": "test-automation-demo",
  "summary": "Test automation workflows for reproducing failures, running focused checks, and documenting verification.",
  "targets": [
    "agents",
    "claude-md",
    "claude",
    "codex",
    "cursor",
    "copilot",
    "mcp"
  ],
  "principles": [
    "Reproduce failures with the smallest reliable command before changing code",
    "Prefer focused tests and minimal fixtures over broad test runs during diagnosis",
    "Keep verification output, failing inputs, and skipped coverage easy to review",
    "Broaden to the full relevant test suite before reporting completion"
  ],
  "commands": {
    "install": "npm install",
    "test": "npm test"
  },
  "skills": [
    {
      "name": "test-automation-demo-test-automation",
      "description": "Use when running test automation workflows for test-automation-demo.",
      "workflow": [
        "Identify the failing behavior, expected outcome, and narrowest reproducible test command",
        "Run the focused test first and capture the exact failure output",
        "Inspect nearby code, fixtures, and assertions before changing test expectations",
        "Add or update the smallest fixture that proves the behavior",
        "Rerun the focused test, then the broader relevant suite, and document any remaining risk"
      ]
    }
  ]
};

function asList(values = []) {
  return values.map((value) => `- ${value}`).join("\n");
}

function commandList(commands = {}) {
  const entries = Object.entries(commands);
  if (!entries.length) return "- No commands recorded yet";
  return entries.map(([name, command]) => `- ${name}: \`${command}\``).join("\n");
}

function workflowList() {
  return (manifest.skills ?? [])
    .map((skill) => `## ${skill.name}\n${skill.description}\n\n${asList(skill.workflow ?? [])}`)
    .join("\n\n");
}

function summaryText() {
  return `# ${manifest.name}\n\n${manifest.summary}\n\n## Targets\n${asList(manifest.targets ?? [])}\n\n## Principles\n${asList(manifest.principles ?? [])}`;
}

function commandsText() {
  return `# Commands for ${manifest.name}\n\n${commandList(manifest.commands)}`;
}

function workflowsText() {
  return `# Workflows for ${manifest.name}\n\n${workflowList() || "No workflows recorded yet"}`;
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
    "name": "skillpack_summary",
    "description": "Return the project summary, targets, and principles.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    }
  },
  {
    "name": "skillpack_commands",
    "description": "Return the project commands from skillpack.yaml.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    }
  },
  {
    "name": "skillpack_workflows",
    "description": "Return agent workflows from skillpack.yaml.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    }
  },
  {
    "name": "skillpack_manifest",
    "description": "Return the full skillpack manifest as JSON.",
    "inputSchema": {
      "type": "object",
      "additionalProperties": false,
      "properties": {}
    }
  }
];

function toolText(name) {
  if (name === "skillpack_summary") return summaryText();
  if (name === "skillpack_commands") return commandsText();
  if (name === "skillpack_workflows") return workflowsText();
  if (name === "skillpack_manifest") return JSON.stringify(manifest, null, 2);
  throw new Error(`Unknown tool: ${name}`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
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
          name: "test-automation-demo-skillpack",
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
        fail(id, -32602, `Unknown resource: ${uri}`);
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
    fail(id, -32601, `Method not found: ${method}`);
  } catch (error) {
    fail(id, -32603, error.message);
  }
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      handle(JSON.parse(line));
    } catch (error) {
      fail(null, -32700, `Parse error: ${error.message}`);
    }
  }
});
