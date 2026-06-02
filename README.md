# Skillpack Forge

[![test](https://github.com/guorunjie/skillpack-forge/actions/workflows/test.yml/badge.svg)](https://github.com/guorunjie/skillpack-forge/actions/workflows/test.yml)
[![GitHub release](https://img.shields.io/github/v/release/guorunjie/skillpack-forge?include_prereleases&sort=semver)](https://github.com/guorunjie/skillpack-forge/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)

Skillpack Forge turns one repo manifest into portable agent instructions, skills, and rules for AGENTS.md, CLAUDE.md, Claude, Codex, Cursor, and GitHub Copilot.

AI coding tools now ask for the same project knowledge in different formats: `AGENTS.md`, `CLAUDE.md`, Claude Skills, Codex Skills, Cursor rules, GitHub Copilot instructions, and MCP-adjacent docs. Skillpack Forge gives maintainers one source of truth.

## Try It In 30 Seconds

```bash
npx skillpack-forge@latest init .
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest doctor .
npx skillpack-forge@latest diff .
npx skillpack-forge@latest check . --strict
```

It scans the repo, writes `skillpack.yaml`, then compiles it into:

- `AGENTS.md`
- `CLAUDE.md`
- `.claude/skills/<skill>/SKILL.md`
- `.codex/skills/<skill>/SKILL.md`
- `.cursor/rules/<project>.mdc`
- `.github/copilot-instructions.md`

Start from an automation template instead:

```bash
npx skillpack-forge@latest new browser-automation .
npx skillpack-forge@latest new playwright-browser .
npx skillpack-forge@latest compile . --dry-run
```

Import existing agent files into one manifest:

```bash
npx skillpack-forge@latest import . --force
```

Skillpack Forge is a compiler for repo-specific agent instructions, not a skill registry, skill installer, readiness-score linter, or agent runtime. See [how it differs](docs/how-it-differs.md) and the [competitive analysis](docs/competitive-analysis.md).

## Why This Can Win Stars

The high-star signal is clear: developers are collecting agent instructions and skills, but the ecosystem is fragmented.

- [`agentsmd/agents.md`](https://github.com/agentsmd/agents.md): simple repo-level agent guidance format.
- [`github/awesome-copilot`](https://github.com/github/awesome-copilot): community instructions, agents, skills, and configurations for GitHub Copilot.
- [`anthropics/skills`](https://github.com/anthropics/skills): public repository for Agent Skills.
- [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills): production-grade engineering skills for coding agents.
- [`microsoft/playwright-mcp`](https://github.com/microsoft/playwright-mcp) and [`github/github-mcp-server`](https://github.com/github/github-mcp-server): MCP is becoming a default automation surface.
- [`vercel-labs/agent-browser`](https://github.com/vercel-labs/agent-browser): browser automation for AI agents is already a high-interest category.

Skillpack Forge sits between those trends: it is not another list of prompts, and it is not a full workflow platform. It is the missing compiler that lets any repo ship consistent agent context everywhere.

## Quick Start

Use the npm CLI:

```bash
npx skillpack-forge@latest --help
```

Create a skillpack for any project:

```bash
npx skillpack-forge@latest init /path/to/project
npx skillpack-forge@latest compile /path/to/project --dry-run
npx skillpack-forge@latest compile /path/to/project
npx skillpack-forge@latest doctor /path/to/project
npx skillpack-forge@latest diff /path/to/project
npx skillpack-forge@latest check /path/to/project --strict
```

Inspect a repo without writing files:

```bash
npx skillpack-forge@latest scan /path/to/project --json
```

Generate a template skillpack:

```bash
npx skillpack-forge@latest new --list
npx skillpack-forge@latest new release-automation /path/to/project
```

Import existing agent files:

```bash
npx skillpack-forge@latest import /path/to/project
```

Compile an Agentic Workflow Guard safety skillpack:

```bash
node ../agentic-workflow-guard/bin/agentic-workflow-guard.js skillpack > skillpack.yaml
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest doctor .
npx skillpack-forge@latest diff .
npx skillpack-forge@latest check . --strict
```

This gives automation security projects a portable context bundle for `AGENTS.md`, Claude Skills, Codex Skills, Cursor rules, and Copilot instructions. See [Agentic Workflow Guard](https://github.com/guorunjie/agentic-workflow-guard) for the scanner side of the workflow.

## Example Manifest

See [`examples/skillpack.yaml`](examples/skillpack.yaml) and the generated files in [`examples/AGENTS.md`](examples/AGENTS.md), `examples/.claude/skills`, `examples/.codex/skills`, `examples/.cursor/rules`, and `examples/.github/copilot-instructions.md`.

For template-driven examples, see [`examples/generated/browser-automation`](examples/generated/browser-automation), [`examples/generated/playwright-browser`](examples/generated/playwright-browser), and the [generated examples index](examples/generated/README.md).

```yaml
name: "my-agent-tool"
summary: "Browser automation CLI for recurring operator workflows"
targets:
  - "agents"
  - "claude-md"
  - "claude"
  - "codex"
  - "cursor"
  - "copilot"
principles:
  - "Preserve user changes and keep edits scoped"
  - "Inspect the current repo state before changing files"
  - "Run verification before claiming success"
commands:
  install: "npm install"
  test: "npm test"
  lint: "npm run lint"
skills:
  - name: "my-agent-tool-developer"
    description: "Use when changing, testing, or automating my-agent-tool."
    workflow:
      - "Inspect the current project context and nearby files"
      - "Run npm test before completion"
      - "Document any command that cannot be run"
```

## CLI

### `scan`

Detects project metadata, package managers, useful commands, docs, and automation capabilities.

```bash
skillpack-forge scan .
skillpack-forge scan . --json
```

### `init`

Creates `skillpack.yaml` from the scan.

```bash
skillpack-forge init .
skillpack-forge init . --force
```

### `import`

Creates `skillpack.yaml` from existing agent files such as `AGENTS.md`, `.github/copilot-instructions.md`, `.cursor/rules/*.mdc`, `.claude/skills/*/SKILL.md`, and `.codex/skills/*/SKILL.md`.

```bash
skillpack-forge import .
skillpack-forge import . --force
skillpack-forge import . --json
```

### `new`

Creates a template manifest for common automation skillpacks.

```bash
skillpack-forge new --list
skillpack-forge new browser-automation .
skillpack-forge new playwright-browser .
skillpack-forge new docs-automation .
skillpack-forge new release-automation .
skillpack-forge new ops-automation .
skillpack-forge new data-automation .
```

### `compile`

Compiles `skillpack.yaml` into the selected targets. Use `--dry-run` first to list files that would be created or overwritten without changing the repo.

```bash
skillpack-forge compile .
skillpack-forge compile . --dry-run
```

### `doctor`

Checks that generated files exist and do not contain placeholder text.

```bash
skillpack-forge doctor .
```

### `diff`

Checks whether generated files match the current `skillpack.yaml`. This exits non-zero when generated agent instructions are missing or stale, which makes it useful in CI.

```bash
skillpack-forge diff .
```

### `check`

Runs `doctor` and `diff` as one CI-friendly command. Use `--strict` to also fail on unexpected old Skillpack Forge generated files.

```bash
skillpack-forge check .
skillpack-forge check . --strict
```

### JSON Schema

Use [`skillpack.schema.json`](skillpack.schema.json) to validate manifest shape in editors or CI. The schema covers the current portable targets: AGENTS.md, CLAUDE.md, Claude Skills, Codex Skills, Cursor rules, and Copilot instructions.

### GitHub Action

Use the bundled action to keep generated files fresh in pull requests:

```yaml
- uses: guorunjie/skillpack-forge@v1
  with:
    path: .
```

See the [GitHub Action guide](docs/github-action.md).

## Positioning

Skillpack Forge is for:

- open-source maintainers who want every coding agent to understand their repo quickly;
- teams that already maintain separate Copilot, Cursor, Claude, and Codex instructions;
- automation tool builders who want reusable skill packs around browser, ops, data, or workflow tasks;
- agent framework authors who need a clean bridge from repo context to tool-specific instructions.

It is intentionally small: no hosted service, no database, no LLM dependency, no lock-in.

## Roadmap

- Richer import support for hand-written agent files.
- MCP server target that exposes the compiled skillpack as tools/resources.
- Browser automation recipe target for browser-use style tools.
- Public gallery of reusable automation skillpacks.

## Development

```bash
npm test
node ./bin/skillpack-forge.js scan . --json
node ./bin/skillpack-forge.js doctor .
node ./bin/skillpack-forge.js diff .
```

The implementation is dependency-free Node.js so the CLI stays easy to audit and install.
