import path from "node:path";

import { createManifestFromScan, slugify } from "./manifest.js";
import { scanProject } from "./scanner.js";

const TARGETS = ["agents", "claude-md", "claude", "codex", "cursor", "copilot", "mcp"];

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
  "playwright-browser": {
    summary: "Playwright browser automation workflows for reliable UI tests, inspections, and scripted operator tasks.",
    principles: [
      "Use locators that reflect user-visible intent before falling back to brittle selectors",
      "Capture screenshots, traces, or console output when a browser run fails",
      "Keep browser state, credentials, and downloaded artifacts out of committed files",
      "Prefer small reproducible flows over broad end-to-end scripts"
    ],
    workflow: [
      "Identify the target URL, browser project, viewport, and expected user journey",
      "Run the narrowest Playwright command first, such as npx playwright test path/to/spec --headed",
      "Inspect page state with screenshots or traces before changing selectors",
      "Update fixtures, waits, and assertions only after reproducing the failure",
      "Rerun the focused Playwright test and document any skipped browser coverage"
    ]
  },
  "test-automation": {
    summary: "Test automation workflows for reproducing failures, running focused checks, and documenting verification.",
    principles: [
      "Reproduce failures with the smallest reliable command before changing code",
      "Prefer focused tests and minimal fixtures over broad test runs during diagnosis",
      "Keep verification output, failing inputs, and skipped coverage easy to review",
      "Broaden to the full relevant test suite before reporting completion"
    ],
    workflow: [
      "Identify the failing behavior, expected outcome, and narrowest reproducible test command",
      "Run the focused test first and capture the exact failure output",
      "Inspect nearby code, fixtures, and assertions before changing test expectations",
      "Add or update the smallest fixture that proves the behavior",
      "Rerun the focused test, then the broader relevant suite, and document any remaining risk"
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
  },
  "data-pipeline": {
    summary: "Data pipeline workflows for extraction, validation, transformation, and reporting.",
    principles: [
      "Preserve raw inputs and keep derived outputs separate",
      "Validate schemas, row counts, checksums, and representative samples",
      "Run transformations on a narrow sample before full pipeline execution",
      "Record data assumptions, freshness, and known quality gaps"
    ],
    workflow: [
      "Locate source data, schema contracts, and expected output destinations",
      "Run validation first, such as npm run data:validate, before transforming data",
      "Run extraction or transformation on a small sample or dry run",
      "Compare row counts, null rates, key fields, and generated report artifacts",
      "Document assumptions, skipped checks, and any remaining data quality risk"
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
