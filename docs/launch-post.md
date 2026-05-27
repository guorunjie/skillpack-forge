# One manifest for every AI coding agent

AI coding agents all want the same project context, but each tool asks for a different file:

- `AGENTS.md`
- Claude Skills
- Codex Skills
- Cursor rules
- GitHub Copilot instructions

Skillpack Forge gives maintainers one source of truth. Write or generate a `skillpack.yaml`, then compile it into the files the agents already know how to read.

```bash
npx skillpack-forge init .
npx skillpack-forge compile . --dry-run
npx skillpack-forge compile .
npx skillpack-forge doctor .
npx skillpack-forge diff .
```

The new `diff` command is the CI guardrail: if generated agent instructions drift from the manifest, it exits non-zero. The new `--dry-run` mode makes it safe to preview generated files before anything is written.

The combo with Agentic Workflow Guard is the clearest demo:

```bash
npx agentic-workflow-guard skillpack > skillpack.yaml
npx skillpack-forge compile . --dry-run
npx skillpack-forge compile .
npx skillpack-forge doctor .
npx skillpack-forge diff .
```

That turns an AI workflow safety scanner into portable agent instructions for Claude, Codex, Cursor, Copilot, and AGENTS.md-aware tools.

Repo: https://github.com/guorunjie/skillpack-forge

Related scanner: https://github.com/guorunjie/agentic-workflow-guard
