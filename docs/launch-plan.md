# Launch Plan

## Repository Description

One manifest for every AI coding agent: generate AGENTS.md, CLAUDE.md, Claude Skills, Codex Skills, Cursor rules, Copilot instructions, MCP resources, and MCPB manifests.

## GitHub Topics

- agents-md
- ai-agents
- claude-skills
- codex-skills
- cursor-rules
- copilot-instructions
- mcp
- mcpb
- automation
- developer-tools

## Launch Post

Title:

> I built a compiler for AI agent instructions: one skillpack.yaml to AGENTS.md, CLAUDE.md, Claude, Codex, Cursor, Copilot, and MCP

Body:

> AI coding agents all want the same repo context, but every tool asks for a different file. Skillpack Forge scans a repo, creates one `skillpack.yaml`, and compiles it into AGENTS.md, CLAUDE.md, Claude Skills, Codex Skills, Cursor rules, GitHub Copilot instructions, a local MCP server, and an MCPB-ready manifest.
>
> It is dependency-free Node.js, works locally, and has a `doctor` command for CI. The goal is to stop maintainers from hand-maintaining five versions of the same agent guidance.

## First Issues

- Add a short terminal GIF for `init -> compile -> check`.
- Add MCPB packaging or remote MCP transport.

## Distribution Checklist

Done:

- Publish npm package.
- Add test, release, license, and zero-dependency badges.
- Add GitHub Action docs.
- Add checked-in demo script.
- Add animated terminal preview to the README.
- Add Playwright-specific browser automation template.
- Add data pipeline automation template and generated example.
- Add `CLAUDE.md` target and importer support.
- Add local MCP stdio target.
- Add MCPB-ready manifest generation.
- Add public automation skillpack gallery.
- Submit to `punkpeye/awesome-mcp-servers`.

Next:

- Submit to `github/awesome-copilot`.
- Submit to `ComposioHQ/awesome-claude-skills`.
