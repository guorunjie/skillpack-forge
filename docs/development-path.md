# Development Path

## Product Thesis

AI coding agents are becoming repo collaborators, but their context files are fragmented. A small compiler that turns one manifest into every major agent format can become default infrastructure for open-source maintainers.

## Milestone 0: GitHub-Ready MVP

Delivered in this repo:

- `scan`: detects project metadata, commands, docs, and automation capabilities.
- `init`: creates `skillpack.yaml`.
- `compile`: writes AGENTS, CLAUDE.md, Claude Skill, Codex Skill, Cursor rule, Copilot instructions, a local MCP stdio server, and an MCPB-ready manifest.
- `doctor`: verifies generated files exist and contain no placeholder text.
- `diff`: detects stale or missing generated agent files.
- `check --strict`: combines health, drift, and unexpected generated-file checks.
- `import`: creates `skillpack.yaml` from existing agent files.
- `new`: creates automation skillpack templates for browser, docs, release, ops, data automation, and data pipeline workflows.
- `claude-md` target: generates `CLAUDE.md` alongside Claude Skill output.
- Playwright browser template for focused UI automation workflows.
- `mcp` target: exposes the manifest, summary, commands, and workflows as read-only MCP resources/tools, with an MCPB-ready `manifest.json`.
- `mcpb`: packs generated `.mcp` directories into `.mcpb` bundles without runtime dependencies.
- GitHub Action wrapper for `check --strict`.
- JSON Schema for editor and CI validation of `skillpack.yaml`.
- generated automation, browser automation, Playwright, release, docs, ops, data automation, and data pipeline examples under `examples/generated`.
- generated automation template gallery covering every current template.
- checked-in `npm run demo` script for the quick-start flow.
- public live fixture demo at https://github.com/guorunjie/skillpack-forge-demo.
- tests for scanner, manifest round-trip, compiler, doctor, and CLI flow.
- README, market map, roadmap, and launch positioning.

## Milestone 1: Public Launch

Goal: make the project immediately understandable in under 30 seconds.

- Animated terminal preview of `init -> compile -> check`.
- Public repo fixture demo: https://github.com/guorunjie/skillpack-forge-demo.
- npm package badge and package link in the README.

## Milestone 2: Developer Trust

Goal: prove it is safe enough for maintainers.

- Improve importers for custom Cursor glob rules and mixed hand-written/generated files.

## Milestone 3: Automation Skillpacks

Goal: turn the project from a compiler into a useful automation catalog.

- Add deeper template packs for docs, release work, ops workflows, and additional data pipeline patterns.
- Add MCPB signing docs or remote MCP transport after local stdio adoption feedback.

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
