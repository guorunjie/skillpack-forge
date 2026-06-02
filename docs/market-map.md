# Market Map: Agent Skill and Automation Tools

Date: 2026-05-27

Method: GitHub Search API queries for high-star repositories around MCP, agent instructions, AI coding skills, browser automation, and workflow automation. Star counts move over time; these numbers are a snapshot from the scan.

## Signals

| Category | Repository | Stars observed | What it proves |
| --- | --- | ---: | --- |
| Agent skills | [`anthropics/skills`](https://github.com/anthropics/skills) | 141,536 | Agent Skills are a first-class distribution format. |
| Agent methodology | [`obra/superpowers`](https://github.com/obra/superpowers) | 208,483 | Developers want higher-level agent operating systems, not only prompts. |
| Agent rules | [`agentsmd/agents.md`](https://github.com/agentsmd/agents.md) | 21,730 | Repo-local agent instructions have a recognizable standard. |
| Copilot configs | [`github/awesome-copilot`](https://github.com/github/awesome-copilot) | 33,901 | GitHub users collect instructions, agents, skills, and configs. |
| Skill collections | [`ComposioHQ/awesome-claude-skills`](https://github.com/ComposioHQ/awesome-claude-skills) | 62,035 | Curated skill distribution attracts broad attention. |
| Engineering skills | [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) | 46,240 | Production-grade skills have clearer value than generic prompts. |
| MCP servers | [`punkpeye/awesome-mcp-servers`](https://github.com/punkpeye/awesome-mcp-servers) | 87,978 | MCP server discovery is a high-demand category. |
| MCP automation | [`microsoft/playwright-mcp`](https://github.com/microsoft/playwright-mcp) | 33,078 | Browser automation plus MCP is a strong wedge. |
| Official MCP | [`github/github-mcp-server`](https://github.com/github/github-mcp-server) | 30,206 | Major platforms are shipping MCP servers directly. |
| Browser agents | [`vercel-labs/agent-browser`](https://github.com/vercel-labs/agent-browser) | 34,420 | Agent-facing browser automation can break out. |
| Workflow automation | [`n8n-io/n8n`](https://github.com/n8n-io/n8n) | 189,870 | Automation platforms remain a large developer market. |
| Agent workflows | [`langgenius/dify`](https://github.com/langgenius/dify) | 142,817 | Agentic workflow development is a proven category. |

## Gap

The market has many formats:

- `AGENTS.md`
- Claude Skills
- Codex Skills
- Cursor rules
- GitHub Copilot instructions
- MCP servers and registries

Most repos either hand-maintain each format or only support one tool. That creates drift: commands, safety rules, and workflows diverge across agents.

## Opportunity

Create a compiler, not another prompt list.

Skillpack Forge turns one `skillpack.yaml` into the files that multiple agents already look for. This gives the project a clear GitHub hook:

> "Stop rewriting the same AI agent instructions five times."

## First Wedge

The first stable version focuses on developer adoption:

1. zero-dependency CLI;
2. `scan`, `init`, `import`, `new`, `compile`, `doctor`, and `diff` commands;
3. generated targets for AGENTS, Claude, Codex, Cursor, and Copilot;
4. templates for browser, docs, release, ops, and data automation;
5. GitHub Action checks for generated-file freshness;
6. docs that explain the multi-agent fragmentation problem.

## Star Strategy

- Lead the README with the pain: one source of truth for agent context.
- Include generated output examples so users can trust the tool quickly.
- Keep installation simple through `npx`.
- Publish to Hacker News, X, Reddit, and relevant awesome lists with a comparison table.
- Add more generated examples and a short terminal GIF.
- Add deeper templates for Playwright, release automation, and docs automation.
- Add an MCP target once the manifest model is stable.
