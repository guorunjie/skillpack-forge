# Automation Skillpack Gallery

Skillpack Forge templates are starter manifests for common AI coding-agent workflows. Each template compiles into the same portable target set: `AGENTS.md`, `CLAUDE.md`, Claude Skill, Codex Skill, Cursor rule, Copilot instructions, local MCP server, and packable MCPB bundle.

Use any template in a project:

```bash
npx skillpack-forge@latest new <template> .
npx skillpack-forge@latest compile .
```

## Template Index

| Template | Best for | Example |
| --- | --- | --- |
| `automation` | General repeatable automation workflows | [`examples/generated/automation`](../examples/generated/automation) |
| `browser-automation` | Browser testing, scraping, and operator tasks | [`examples/generated/browser-automation`](../examples/generated/browser-automation) |
| `playwright-browser` | Playwright UI tests and browser inspections | [`examples/generated/playwright-browser`](../examples/generated/playwright-browser) |
| `test-automation` | Reproducing failures, focused tests, fixtures, and verification output | [`examples/generated/test-automation`](../examples/generated/test-automation) |
| `ci-triage` | Inspecting failing CI runs, isolating causes, and classifying flaky versus real failures | [`examples/generated/ci-triage`](../examples/generated/ci-triage) |
| `dependency-upgrade` | Reviewing outdated packages, applying safe updates, and verifying compatibility | [`examples/generated/dependency-upgrade`](../examples/generated/dependency-upgrade) |
| `docs-automation` | README, docs, and generated documentation maintenance | [`examples/generated/docs-automation`](../examples/generated/docs-automation) |
| `release-automation` | Changelogs, versions, tags, packages, and release checks | [`examples/generated/release-automation`](../examples/generated/release-automation) |
| `ops-automation` | Runbooks, recurring checks, monitors, and operational workflows | [`examples/generated/ops-automation`](../examples/generated/ops-automation) |
| `data-automation` | Lightweight extraction, validation, and reporting | [`examples/generated/data-automation`](../examples/generated/data-automation) |
| `data-pipeline` | Data pipelines with validation, transformation, and reports | [`examples/generated/data-pipeline`](../examples/generated/data-pipeline) |

## Automation

Use `automation` when the repo has repeatable tasks but does not fit a narrower category yet.

```bash
npx skillpack-forge@latest new automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/automation/skillpack.yaml`](../examples/generated/automation/skillpack.yaml)

## Browser Automation

Use `browser-automation` for browser workflows where selectors, screenshots, traces, and visible page state matter.

```bash
npx skillpack-forge@latest new browser-automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/browser-automation/skillpack.yaml`](../examples/generated/browser-automation/skillpack.yaml)

## Playwright Browser

Use `playwright-browser` when the repo uses Playwright or needs Playwright-specific guidance.

```bash
npx skillpack-forge@latest new playwright-browser .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/playwright-browser/skillpack.yaml`](../examples/generated/playwright-browser/skillpack.yaml)

## Test Automation

Use `test-automation` when agents should reproduce failures, run focused tests, keep fixtures minimal, and document verification output.

```bash
npx skillpack-forge@latest new test-automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/test-automation/skillpack.yaml`](../examples/generated/test-automation/skillpack.yaml)

## CI Triage

Use `ci-triage` when agents should inspect failing workflow logs, avoid blind reruns, isolate the smallest failing command, and document whether a failure is flaky or a real regression.

```bash
npx skillpack-forge@latest new ci-triage .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/ci-triage/skillpack.yaml`](../examples/generated/ci-triage/skillpack.yaml)

## Dependency Upgrade

Use `dependency-upgrade` when agents should review outdated packages, apply safe patch/minor updates first, inspect changelog and lockfile changes, and document deferred major upgrades.

```bash
npx skillpack-forge@latest new dependency-upgrade .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/dependency-upgrade/skillpack.yaml`](../examples/generated/dependency-upgrade/skillpack.yaml)

## Docs Automation

Use `docs-automation` when agents should keep README files, docs pages, and generated examples aligned with source-of-truth files.

```bash
npx skillpack-forge@latest new docs-automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/docs-automation/skillpack.yaml`](../examples/generated/docs-automation/skillpack.yaml)

## Release Automation

Use `release-automation` for repos that need careful version, changelog, tag, package, and CI verification guidance.

```bash
npx skillpack-forge@latest new release-automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/release-automation/skillpack.yaml`](../examples/generated/release-automation/skillpack.yaml)

## Ops Automation

Use `ops-automation` for recurring checks, runbooks, monitors, and operational workflows where auditability matters.

```bash
npx skillpack-forge@latest new ops-automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/ops-automation/skillpack.yaml`](../examples/generated/ops-automation/skillpack.yaml)

## Data Automation

Use `data-automation` for lightweight data extraction, validation, and reporting tasks.

```bash
npx skillpack-forge@latest new data-automation .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/data-automation/skillpack.yaml`](../examples/generated/data-automation/skillpack.yaml)

## Data Pipeline

Use `data-pipeline` for structured data workflows with extraction, validation, transformation, loading, and reporting steps.

```bash
npx skillpack-forge@latest new data-pipeline .
npx skillpack-forge@latest compile .
```

Example: [`examples/generated/data-pipeline/skillpack.yaml`](../examples/generated/data-pipeline/skillpack.yaml)

## Generated Targets

Every gallery example is compiled from its checked-in `skillpack.yaml` and includes:

```text
AGENTS.md
CLAUDE.md
.claude/skills/<skill>/SKILL.md
.codex/skills/<skill>/SKILL.md
.cursor/rules/<project>.mdc
.github/copilot-instructions.md
.mcp/manifest.json
.mcp/skillpack-server.mjs
.mcp/README.md
```
