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

- Add a short terminal GIF for `init -> compile -> doctor`.
- Add importer support for `CLAUDE.md`.
- Add template pack for Playwright-specific browser automation.
- Add MCP target that exposes skillpack commands as tools.

## Distribution Checklist

Done:

- Publish npm package.
- Add test, release, license, and zero-dependency badges.
- Add GitHub Action docs.

Next:

- Submit to `github/awesome-copilot`.
- Submit to `ComposioHQ/awesome-claude-skills`.
- Submit to `punkpeye/awesome-mcp-servers` after MCP target lands.
- Post short demo video or terminal GIF.
