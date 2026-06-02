import path from "node:path";

import { createManifestFromScan, slugify } from "./manifest.js";
import { scanProject } from "./scanner.js";

const TARGETS = ["agents", "claude", "codex", "cursor", "copilot"];

const DEFINITIONS = {
  automation: {
    summary: "Automation-ready repo context for repeatable agent workflows.",
    principles: [
      "Define the task inputs, outputs, and success criteria before running automation",
      "Keep generated changes reviewable and reversible",
      "Run the smallest reliable verification command before reporting completion"
    ],
    workflow: [
      "Inspect the current repo state and identify the automation entrypoint",
      "Confirm required inputs, credentials, and output paths",
      "Run the automation with a dry run or narrow scope first",
      "Verify outputs and document any skipped step"
    ]
  },
  "browser-automation": {
    summary: "Browser automation workflows for testing, scraping, and operator tasks.",
    principles: [
      "Prefer deterministic selectors and explicit waits",
      "Capture screenshots or traces when a browser flow fails",
      "Avoid storing secrets, cookies, or private page content in generated files"
    ],
    workflow: [
      "Identify the target URL, browser state, and expected user path",
      "Run the browser flow in a narrow, repeatable scenario",
      "Inspect visible page state before and after each important action",
      "Save failure evidence and rerun focused verification"
    ]
  },
  "docs-automation": {
    summary: "Documentation automation workflows for keeping project docs current.",
    principles: [
      "Prefer source-of-truth files over stale summaries",
      "Keep generated documentation concise and easy to review",
      "Link commands, files, and examples that readers can verify"
    ],
    workflow: [
      "Scan README, docs, package metadata, and generated agent files",
      "Identify missing, stale, or duplicated documentation",
      "Update the smallest useful set of docs",
      "Run doc-related checks or explain why none exist"
    ]
  },
  "release-automation": {
    summary: "Release automation workflows for changelogs, tags, packages, and CI checks.",
    principles: [
      "Verify a clean worktree and passing checks before release steps",
      "Keep version, tag, package, and release notes aligned",
      "Treat publish credentials and tokens as sensitive"
    ],
    workflow: [
      "Inspect git status, recent commits, package metadata, and release history",
      "Run tests and package dry-run checks",
      "Prepare release notes from concrete changes",
      "Publish only after verifying the target registry or GitHub release state"
    ]
  },
  "ops-automation": {
    summary: "Operations automation workflows for recurring checks, monitors, and runbooks.",
    principles: [
      "Make every operational action observable and auditable",
      "Prefer idempotent commands with clear rollback paths",
      "Escalate destructive or credential-sensitive actions before execution"
    ],
    workflow: [
      "Identify the service, environment, and operational objective",
      "Check current state before making changes",
      "Run the least invasive command that proves or fixes the issue",
      "Record verification output and any remaining risk"
    ]
  },
  "data-automation": {
    summary: "Data automation workflows for repeatable extraction, validation, and reporting.",
    principles: [
      "Preserve raw inputs before transforming data",
      "Validate schemas, row counts, and representative samples",
      "Separate generated reports from source data"
    ],
    workflow: [
      "Locate source data, expected schema, and output format",
      "Run extraction or transformation on a small sample first",
      "Validate counts, types, and important edge cases",
      "Generate the report and document assumptions"
    ]
  }
};

export function templateNames() {
  return Object.keys(DEFINITIONS);
}

export async function createTemplateManifest(templateName = "automation", root = process.cwd()) {
  const definition = DEFINITIONS[templateName];
  if (!definition) {
    throw new Error(`Unknown template: ${templateName}. Available templates: ${templateNames().join(", ")}`);
  }

  const scan = await scanProject(root);
  const base = createManifestFromScan(scan);
  const projectName = slugify(scan.name || path.basename(path.resolve(root)));
  const skillName = `${projectName}-${templateName}`;

  return {
    ...base,
    name: projectName,
    summary: definition.summary,
    targets: TARGETS,
    principles: definition.principles,
    commands: Object.keys(base.commands).length ? base.commands : { test: "your verification command" },
    skills: [
      {
        name: skillName,
        description: `Use when running ${templateName.replaceAll("-", " ")} workflows for ${projectName}.`,
        workflow: definition.workflow
      }
    ]
  };
}
