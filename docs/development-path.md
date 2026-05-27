# Development Path

## Product Thesis

AI coding agents are becoming repo collaborators, but their context files are fragmented. A small compiler that turns one manifest into every major agent format can become default infrastructure for open-source maintainers.

## Milestone 0: GitHub-Ready MVP

Delivered in this repo:

- `scan`: detects project metadata, commands, docs, and automation capabilities.
- `init`: creates `skillpack.yaml`.
- `compile`: writes AGENTS, Claude Skill, Codex Skill, Cursor rule, and Copilot instructions.
- `doctor`: verifies generated files exist and contain no placeholder text.
- tests for scanner, manifest round-trip, compiler, doctor, and CLI flow.
- README, market map, roadmap, and launch positioning.

## Milestone 1: Public Launch

Goal: make the project immediately understandable in under 30 seconds.

- Add screenshots or terminal GIF of `init -> compile -> doctor`.
- Publish npm package as `skillpack-forge`.
- Create a one-command demo using a public repo fixture.
- Add generated examples under `examples/generated`.
- Add badges for npm version, tests, license, and zero dependencies.

## Milestone 2: Developer Trust

Goal: prove it is safe enough for maintainers.

- Add JSON Schema for `skillpack.yaml`.
- Add `skillpack-forge diff` to show generated-file drift.
- Add `skillpack-forge check --strict` for CI.
- Add GitHub Action documentation.
- Add importers for existing `AGENTS.md`, Copilot instructions, and Cursor rules.

## Milestone 3: Automation Skillpacks

Goal: turn the project from a compiler into a useful automation catalog.

- Add template packs for browser automation, data pipelines, docs, release work, and ops workflows.
- Add `skillpack-forge new browser-automation`.
- Add Playwright recipe output.
- Add MCP target that exposes project commands and workflows as tools/resources.

## Milestone 4: Community Flywheel

Goal: become the place people share portable skills.

- Create `awesome-skillpacks` directory or companion repo.
- Accept community templates.
- Add compatibility matrix across Codex, Claude, Cursor, Copilot, and MCP clients.
- Add website with copy-paste install and examples.

## Technical Principles

- Keep the core CLI dependency-free.
- Generated files should be boring, readable, and editable.
- Never require an LLM to generate deterministic project files.
- Prefer explicit manifest fields over hidden inference.
- Make `doctor` good enough for CI before adding advanced features.
