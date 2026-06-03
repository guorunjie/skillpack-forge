# Launch Plan

## Repository Description

One manifest for every AI coding agent: generate AGENTS.md, CLAUDE.md, Claude Skills, Codex Skills, Cursor rules, Copilot instructions, MCP resources, and MCPB bundles.

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
- community
- good-first-issue

## Launch Post

Title:

> I built a compiler for AI agent instructions: one skillpack.yaml to AGENTS.md, CLAUDE.md, Claude, Codex, Cursor, Copilot, and MCP

Body:

> AI coding agents all want the same repo context, but every tool asks for a different file. Skillpack Forge scans a repo, creates one `skillpack.yaml`, and compiles it into AGENTS.md, CLAUDE.md, Claude Skills, Codex Skills, Cursor rules, GitHub Copilot instructions, a local MCP server, and a packable MCPB bundle.
>
> It is dependency-free Node.js, works locally, and has a `doctor` command for CI. The goal is to stop maintainers from hand-maintaining five versions of the same agent guidance.

## First Issues

- Add a short terminal GIF for `init -> compile -> check`.
- Add remote MCP transport after the local MCPB flow has enough users.

## Distribution Checklist

Done:

- Publish npm package.
- Add test, release, license, and zero-dependency badges.
- Add npm package badge.
- Add GitHub Action docs.
- Add checked-in demo script.
- Add animated terminal preview to the README.
- Create public live fixture demo at https://github.com/guorunjie/skillpack-forge-demo.
- Add Playwright-specific browser automation template.
- Add data pipeline automation template and generated example.
- Add `CLAUDE.md` target and importer support.
- Add local MCP stdio target.
- Add MCPB-ready manifest generation.
- Add zero-dependency MCPB bundle packing.
- Add public automation skillpack gallery.
- Submit to `punkpeye/awesome-mcp-servers`.
- Submit to `github/awesome-copilot`.
- Fix generated README update on the `github/awesome-copilot` PR.
- Submit to `ComposioHQ/awesome-claude-skills`.
- Submit to `rohitg00/awesome-claude-code-toolkit`.
- Submit to `e2b-dev/awesome-ai-sdks`.
- Prepare manual `hesreallyhim/awesome-claude-code` submission packet.
- Add npm/live fixture reviewer proof comments to the Copilot, Claude Skills, and Claude Code toolkit PRs.
- Seed community labels and open starter issues for templates, MCP docs, importer work, and contribution docs.
- Add GitHub topics for `community` and `good-first-issue`.

Next:

- Sign the e2b CLA for PR #222, then comment `@cla-bot check`.
- Submit the `hesreallyhim/awesome-claude-code` issue form manually from the prepared packet.
- Monitor external PR reviews and respond quickly.
