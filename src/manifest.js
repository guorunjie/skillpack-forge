export function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}

export function createManifestFromScan(scan) {
  const name = slugify(scan.name);
  const testCommand = scan.commands?.test ?? "the project's focused verification command";
  return {
    name,
    summary: scan.summary ?? "Automation-ready repository",
    targets: ["agents", "claude", "codex", "cursor", "copilot"],
    principles: [
      "Preserve user changes and keep edits scoped",
      "Inspect the current repo state before changing files",
      "Run verification before claiming success"
    ],
    commands: {
      ...(scan.commands ?? {})
    },
    skills: [
      {
        name: `${name}-developer`,
        description: `Use when changing, testing, or automating ${name}.`,
        workflow: [
          "Inspect the current project context and nearby files",
          `Run ${testCommand} before completion`,
          "Document any command that cannot be run"
        ]
      }
    ]
  };
}

function scalar(value) {
  return JSON.stringify(String(value));
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith("\"") && trimmed.endsWith("\"")) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return JSON.parse(trimmed);
  }
  return trimmed;
}

export function stringifyManifest(manifest) {
  const lines = [];
  for (const [key, value] of Object.entries(manifest)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      if (value.every((item) => typeof item === "string")) {
        for (const item of value) lines.push(`  - ${scalar(item)}`);
        continue;
      }
      for (const item of value) {
        const entries = Object.entries(item);
        const [firstKey, firstValue] = entries[0];
        lines.push(`  - ${firstKey}: ${scalar(firstValue)}`);
        for (const [nestedKey, nestedValue] of entries.slice(1)) {
          if (Array.isArray(nestedValue)) {
            lines.push(`    ${nestedKey}:`);
            for (const child of nestedValue) lines.push(`      - ${scalar(child)}`);
          } else {
            lines.push(`    ${nestedKey}: ${scalar(nestedValue)}`);
          }
        }
      }
      continue;
    }
    if (value && typeof value === "object") {
      lines.push(`${key}:`);
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        lines.push(`  ${nestedKey}: ${scalar(nestedValue)}`);
      }
      continue;
    }
    lines.push(`${key}: ${scalar(value)}`);
  }
  return `${lines.join("\n")}\n`;
}

export function parseManifest(text) {
  const lines = text
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"));
  const manifest = {};
  let i = 0;

  while (i < lines.length) {
    const top = lines[i].match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (!top) {
      i += 1;
      continue;
    }
    const key = top[1];
    const inline = top[2].trim();
    if (inline) {
      manifest[key] = parseScalar(inline);
      i += 1;
      continue;
    }

    const next = lines[i + 1] ?? "";
    if (/^  - /.test(next)) {
      if (/^  - [A-Za-z0-9_-]+:/.test(next)) {
        const items = [];
        i += 1;
        while (i < lines.length && /^  - /.test(lines[i])) {
          const first = lines[i].match(/^  - ([A-Za-z0-9_-]+):\s*(.*)$/);
          const item = {};
          item[first[1]] = parseScalar(first[2]);
          i += 1;
          while (i < lines.length && /^    [A-Za-z0-9_-]+:/.test(lines[i])) {
            const nested = lines[i].match(/^    ([A-Za-z0-9_-]+):\s*(.*)$/);
            if (nested[2].trim()) {
              item[nested[1]] = parseScalar(nested[2]);
              i += 1;
              continue;
            }
            const children = [];
            i += 1;
            while (i < lines.length && /^      - /.test(lines[i])) {
              children.push(parseScalar(lines[i].replace(/^      - /, "")));
              i += 1;
            }
            item[nested[1]] = children;
          }
          items.push(item);
        }
        manifest[key] = items;
        continue;
      }
      const values = [];
      i += 1;
      while (i < lines.length && /^  - /.test(lines[i])) {
        values.push(parseScalar(lines[i].replace(/^  - /, "")));
        i += 1;
      }
      manifest[key] = values;
      continue;
    }

    const object = {};
    i += 1;
    while (i < lines.length && /^  [A-Za-z0-9_-]+:/.test(lines[i])) {
      const nested = lines[i].match(/^  ([A-Za-z0-9_-]+):\s*(.*)$/);
      object[nested[1]] = parseScalar(nested[2]);
      i += 1;
    }
    manifest[key] = object;
  }

  return manifest;
}
