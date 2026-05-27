# Launch Plan

## Repository Description

One manifest for every AI coding agent: generate AGENTS.md, Claude Skills, Codex Skills, Cursor rules, and Copilot instructions.

## GitHub Topics

- agents-md
- ai-agents
- claude-skills
- codex-skills
- cursor-rules
- copilot-instructions
- mcp
- automation
- developer-tools

## Launch Post

Title:

> I built a compiler for AI agent instructions: one skillpack.yaml to AGENTS.md, Claude, Codex, Cursor, and Copilot

Body:

> AI coding agents all want the same repo context, but every tool asks for a different file. Skillpack Forge scans a repo, creates one `skillpack.yaml`, and compiles it into AGENTS.md, Claude Skills, Codex Skills, Cursor rules, and GitHub Copilot instructions.
>
> It is dependency-free Node.js, works locally, and has a `doctor` command for CI. The goal is to stop maintainers from hand-maintaining five versions of the same agent guidance.

## First Issues

- Add JSON Schema for `skillpack.yaml`.
- Add `diff` command to detect stale generated files.
- Add GitHub Action wrapper for `doctor`.
- Add template pack for Playwright browser automation.
- Add importer for existing AGENTS.md.
- Add MCP target that exposes skillpack commands as tools.

## Distribution Checklist

- Publish npm package.
- Add npm, test, and license badges.
- Submit to `github/awesome-copilot`.
- Submit to `ComposioHQ/awesome-claude-skills`.
- Submit to `punkpeye/awesome-mcp-servers` after MCP target lands.
- Post short demo video or terminal GIF.
