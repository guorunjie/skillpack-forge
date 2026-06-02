# One manifest for every AI coding agent

AI coding agents all want the same project context, but each tool asks for a different file:

- `AGENTS.md`
- Claude Skills
- Codex Skills
- Cursor rules
- GitHub Copilot instructions

Skillpack Forge gives maintainers one source of truth. Write or generate a `skillpack.yaml`, then compile it into the files the agents already know how to read.

```bash
npx skillpack-forge@latest init .
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest doctor .
npx skillpack-forge@latest diff .
npx skillpack-forge@latest check . --strict
```

Use a template if you want a faster start:

```bash
npx skillpack-forge@latest new browser-automation .
npx skillpack-forge@latest new release-automation .
```

Use import if a repo already has agent files:

```bash
npx skillpack-forge@latest import . --force
```

The `check --strict` command and bundled GitHub Action are the CI guardrails: if generated agent instructions drift from the manifest or old generated files are left behind, they exit non-zero. The `--dry-run` mode makes it safe to preview generated files before anything is written.

The combo with Agentic Workflow Guard is the clearest demo:

```bash
npx agentic-workflow-guard skillpack > skillpack.yaml
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest doctor .
npx skillpack-forge@latest diff .
npx skillpack-forge@latest check . --strict
```

That turns an AI workflow safety scanner into portable agent instructions for Claude, Codex, Cursor, Copilot, and AGENTS.md-aware tools.

Repo: https://github.com/guorunjie/skillpack-forge

Related scanner: https://github.com/guorunjie/agentic-workflow-guard
