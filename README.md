# Skillpack Forge

Skillpack Forge turns one repo manifest into portable agent instructions, skills, and rules for AGENTS.md, Claude, Codex, Cursor, and GitHub Copilot.

AI coding tools now ask for the same project knowledge in different formats: `AGENTS.md`, Claude Skills, Codex Skills, Cursor rules, GitHub Copilot instructions, and MCP-adjacent docs. Skillpack Forge gives maintainers one source of truth:

```bash
npx skillpack-forge init .
npx skillpack-forge compile . --dry-run
npx skillpack-forge compile .
npx skillpack-forge doctor .
npx skillpack-forge diff .
```

It scans the repo, writes `skillpack.yaml`, then compiles it into:

- `AGENTS.md`
- `.claude/skills/<skill>/SKILL.md`
- `.codex/skills/<skill>/SKILL.md`
- `.cursor/rules/<project>.mdc`
- `.github/copilot-instructions.md`

Skillpack Forge is a compiler for repo-specific agent instructions, not a skill registry, skill installer, readiness-score linter, or agent runtime. See the [competitive analysis](docs/competitive-analysis.md) for how it differs from adjacent projects such as MDA, repo2agent, and skillpack.

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

Install from the repo:

```bash
npm install
npm test
```

Create a skillpack for any project:

```bash
node ./bin/skillpack-forge.js init /path/to/project
node ./bin/skillpack-forge.js compile /path/to/project --dry-run
node ./bin/skillpack-forge.js compile /path/to/project
node ./bin/skillpack-forge.js doctor /path/to/project
node ./bin/skillpack-forge.js diff /path/to/project
```

Inspect a repo without writing files:

```bash
node ./bin/skillpack-forge.js scan /path/to/project --json
```

Compile an Agentic Workflow Guard safety skillpack:

```bash
node ../agentic-workflow-guard/bin/agentic-workflow-guard.js skillpack > skillpack.yaml
node ./bin/skillpack-forge.js compile . --dry-run
node ./bin/skillpack-forge.js compile .
node ./bin/skillpack-forge.js doctor .
node ./bin/skillpack-forge.js diff .
```

This gives automation security projects a portable context bundle for `AGENTS.md`, Claude Skills, Codex Skills, Cursor rules, and Copilot instructions. See [Agentic Workflow Guard](https://github.com/guorunjie/agentic-workflow-guard) for the scanner side of the workflow.

## Example Manifest

See [`examples/skillpack.yaml`](examples/skillpack.yaml) and the generated files in [`examples/AGENTS.md`](examples/AGENTS.md), `examples/.claude/skills`, `examples/.codex/skills`, `examples/.cursor/rules`, and `examples/.github/copilot-instructions.md`.

```yaml
name: "my-agent-tool"
summary: "Browser automation CLI for recurring operator workflows"
targets:
  - "agents"
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

### JSON Schema

Use [`skillpack.schema.json`](skillpack.schema.json) to validate manifest shape in editors or CI. The schema covers the current portable targets: AGENTS.md, Claude Skills, Codex Skills, Cursor rules, and Copilot instructions.

## Positioning

Skillpack Forge is for:

- open-source maintainers who want every coding agent to understand their repo quickly;
- teams that already maintain separate Copilot, Cursor, Claude, and Codex instructions;
- automation tool builders who want reusable skill packs around browser, ops, data, or workflow tasks;
- agent framework authors who need a clean bridge from repo context to tool-specific instructions.

It is intentionally small: no hosted service, no database, no LLM dependency, no lock-in.

## Roadmap

- Importers for existing `AGENTS.md`, `.cursor/rules`, and Copilot instructions.
- MCP server target that exposes the compiled skillpack as tools/resources.
- Browser automation recipe target for Playwright and browser-use style tools.
- GitHub Action that runs `skillpack-forge doctor` on pull requests.
- Public gallery of reusable automation skillpacks.

## Development

```bash
npm test
node ./bin/skillpack-forge.js scan . --json
node ./bin/skillpack-forge.js doctor .
node ./bin/skillpack-forge.js diff .
```

The implementation is dependency-free Node.js so the CLI stays easy to audit and install.
