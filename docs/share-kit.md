# Share Kit

Use these short posts when sharing Skillpack Forge. Keep the first link pointed at the main repo and include the live fixture when the audience needs proof.

## Primary Links

- Repo: https://github.com/guorunjie/skillpack-forge
- npm: https://www.npmjs.com/package/skillpack-forge
- Live fixture: https://github.com/guorunjie/skillpack-forge-demo
- Good first issues: https://github.com/guorunjie/skillpack-forge/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22
- Discussions: https://github.com/guorunjie/skillpack-forge/discussions

## One-Liner

One `skillpack.yaml` for every AI coding agent: generate AGENTS.md, CLAUDE.md, Claude/Codex Skills, Cursor rules, Copilot instructions, MCP resources, and MCPB bundles.

## Short Launch Post

I built Skillpack Forge, a zero-dependency CLI that compiles one `skillpack.yaml` into the context files AI coding agents already read.

It generates AGENTS.md, CLAUDE.md, Claude Skills, Codex Skills, Cursor rules, GitHub Copilot instructions, local MCP resources, and `.mcpb` bundles.

Try it:

```bash
npx skillpack-forge@latest init .
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest check . --strict
npx skillpack-forge@latest mcpb .
```

Repo: https://github.com/guorunjie/skillpack-forge
Live fixture: https://github.com/guorunjie/skillpack-forge-demo

## Hacker News / Reddit Title Ideas

- Show HN: Skillpack Forge - one manifest for every AI coding agent
- I built a compiler for AGENTS.md, CLAUDE.md, Cursor, Copilot, Skills, and MCP
- One skillpack.yaml to generate repo context for Claude, Codex, Cursor, Copilot, and MCP

## X / LinkedIn Short Post

AI coding agents all want the same repo context, but every tool asks for a different file.

Skillpack Forge turns one `skillpack.yaml` into AGENTS.md, CLAUDE.md, Claude/Codex Skills, Cursor rules, Copilot instructions, MCP resources, and MCPB bundles.

`npx skillpack-forge@latest init .`

https://github.com/guorunjie/skillpack-forge

## Maintainer-Focused Angle

If your repo has separate instructions for Claude, Codex, Cursor, Copilot, and AGENTS.md-aware tools, Skillpack Forge keeps them synchronized from one manifest and gives CI a `check --strict` guardrail.

## MCP-Focused Angle

Skillpack Forge can generate a repo-local read-only MCP stdio server from `skillpack.yaml`, then pack it into an `.mcpb` bundle without adding runtime dependencies.

## Community Call

Looking for starter contributions:

- Add a `dependency-upgrade` template
- Improve MCP client install docs
- Write a reusable skillpack submission guide

Starter issues: https://github.com/guorunjie/skillpack-forge/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22
