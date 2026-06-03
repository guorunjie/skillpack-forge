# Distribution Notes

Use these short descriptions when submitting Skillpack Forge to awesome lists, newsletters, or launch posts.

## One-Line Description

Skillpack Forge compiles one `skillpack.yaml` into AGENTS.md, CLAUDE.md, Claude/Codex Skills, Cursor rules, Copilot instructions, local MCP resources, and MCPB bundles.

## Short Listing Copy

Skillpack Forge is a zero-dependency Node.js CLI for maintainers who want one source of truth for AI coding-agent context. It scans a repo, creates `skillpack.yaml`, generates portable instructions for AGENTS.md, Claude, Codex, Cursor, GitHub Copilot, and MCP clients, and can pack the generated local MCP server as an `.mcpb` bundle.

The automation skillpack gallery gives new users concrete starting points for browser automation, Playwright, docs, release, ops, data automation, and data pipeline workflows.

Live proof: https://github.com/guorunjie/skillpack-forge-demo shows one checked-in `skillpack.yaml`, generated AGENTS/CLAUDE/Claude/Codex/Cursor/Copilot/MCP outputs, a packed `.mcpb` bundle, and a passing GitHub Actions check.

## Suggested Categories

- AI coding agents
- Agent skills
- Developer tools
- MCP servers
- Context engineering
- Automation tooling

## Candidate Directories

- `punkpeye/awesome-mcp-servers`: [PR #7299](https://github.com/punkpeye/awesome-mcp-servers/pull/7299) opened for the generated repo-local read-only MCP server and MCPB bundle output.
- `github/awesome-copilot`: [PR #1905](https://github.com/github/awesome-copilot/pull/1905) opened for a Skillpack Forge custom instruction that teaches Copilot to create, compile, verify, and package portable agent context.
- `ComposioHQ/awesome-claude-skills`: [PR #996](https://github.com/ComposioHQ/awesome-claude-skills/pull/996) opened for a Claude Skill that guides agents through Skillpack Forge workflows.
- `rohitg00/awesome-claude-code-toolkit`: [PR #484](https://github.com/rohitg00/awesome-claude-code-toolkit/pull/484) opened for the Claude Code toolkit list.
- `e2b-dev/awesome-ai-sdks`: [PR #222](https://github.com/e2b-dev/awesome-ai-sdks/pull/222) opened for the AI agent SDK/tooling list. This PR requires the repository owner to sign the e2b CLA at https://e2b.dev/docs/cla and then comment `@cla-bot check`.
- `hesreallyhim/awesome-claude-code`: manual Web UI issue form only. Prepared submission fields in [`docs/awesome-claude-code-submission.md`](awesome-claude-code-submission.md).
- `appcypher/awesome-mcp-servers`: fork branch prepared in `guorunjie/awesome-mcp-servers-1:add-skillpack-forge`, but GitHub returned `FORBIDDEN` when creating the PR by API because of fork/permission handling. Use the GitHub compare UI if pursuing this directory.

## Submission Angle

Emphasize that Skillpack Forge is not another prompt list or hosted runtime. It is a small compiler that keeps project context synchronized across multiple agent surfaces.
