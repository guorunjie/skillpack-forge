# Changelog

## 1.5.0

- Added MCPB-ready `.mcp/manifest.json` generation for the `mcp` target.
- Added MCPB validation and packing instructions to generated `.mcp/README.md`.
- Added an MCP packaging design note comparing manifest generation, pack helpers, client snippets, and remote MCP.
- Added strict-check coverage and tests for generated MCPB manifests.

## 1.4.0

- Added `data-pipeline` template for extraction, validation, transformation, and reporting workflows.
- Added scanner support for common data pipeline scripts such as `data:validate`, `data:transform`, and `data:report`.
- Added generated data pipeline example output under `examples/generated`.

## 1.3.0

- Added `mcp` target that generates a zero-dependency local MCP stdio server.
- Added MCP resources and tools for manifest, summary, commands, and workflows.
- Added MCP generated output to strict checks.
- Added generated release, docs, and ops automation examples.
- Improved scanner support for docs and release scripts.

## 1.2.0

- Added `claude-md` target to generate `CLAUDE.md` from `skillpack.yaml`.
- Added `CLAUDE.md` import support.
- Added `playwright-browser` template for focused Playwright automation workflows.
- Added generated Playwright example output under `examples/generated`.
- Added checked-in demo script via `npm run demo`.
- Improved scanner support for `@playwright/test`, `e2e`, and `test:e2e` scripts.

## 1.1.0

- Added `skillpack-forge import` to create `skillpack.yaml` from existing agent files.
- Added `skillpack-forge new` templates for automation, browser automation, docs automation, release automation, ops automation, and data automation.
- Added `skillpack-forge check --strict` for combined CI checks and stale generated-file cleanup.
- Added a reusable GitHub Action that runs `check --strict`.
- Added docs for quick demos, GitHub Action setup, and competitive differentiation.
- Improved scanner coverage for CI and release-related scripts.

## 1.0.0

- First stable release.
- Generated `AGENTS.md`, Claude Skills, Codex Skills, Cursor rules, and GitHub Copilot instructions from one `skillpack.yaml`.
- Added `scan`, `init`, `compile`, `doctor`, and `diff`.
- Added JSON Schema, tests, examples, MIT license, and zero runtime dependencies.
