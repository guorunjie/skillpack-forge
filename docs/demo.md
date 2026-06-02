# 30-Second Demo

Run Skillpack Forge in any repo:

```bash
npx skillpack-forge@latest init .
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest doctor .
npx skillpack-forge@latest diff .
npx skillpack-forge@latest check . --strict
```

Or run the checked-in demo script:

```bash
npm run demo
```

Start from a template:

```bash
npx skillpack-forge@latest new browser-automation .
npx skillpack-forge@latest compile . --dry-run
```

Import existing agent files:

```bash
npx skillpack-forge@latest import . --force
npx skillpack-forge@latest diff .
```

Expected generated files:

```text
AGENTS.md
CLAUDE.md
.claude/skills/<skill>/SKILL.md
.codex/skills/<skill>/SKILL.md
.cursor/rules/<project>.mdc
.github/copilot-instructions.md
.mcp/skillpack-server.mjs
.mcp/README.md
```
