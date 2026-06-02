# How Skillpack Forge Differs

Skillpack Forge is a repo-context compiler. It turns one `skillpack.yaml` into the files different AI coding agents expect.

It is not a skill marketplace, skill installer, prompt collection, readiness-score product, IDE extension, or agent runtime.

| Project type | Examples | What they do | How Skillpack Forge differs |
| --- | --- | --- | --- |
| Agent instruction standard | `agentsmd/agents.md` | Defines or collects repo-level guidance files. | Skillpack Forge generates `AGENTS.md` as one output target. |
| Skill library | `anthropics/skills`, `addyosmani/agent-skills`, Claude skill collections | Provides reusable skills or examples. | Skillpack Forge does not curate skills; it generates repo-specific skill files. |
| Skill manager | `skills`, `skillfish`, `skillpack` | Installs, updates, or syncs skills across tools. | Skillpack Forge compiles local project context instead of installing third-party skills. |
| Generator plus scoring | `repo2agent` | Generates agent files and scores agent readiness. | Skillpack Forge is manifest-first and also emits Claude/Codex `SKILL.md` targets. |
| Linter or IDE support | `agnix` | Validates or edits agent config files. | Skillpack Forge creates and checks generated files from one source of truth. |

## Core Position

Use Skillpack Forge when you want this workflow:

```bash
npx skillpack-forge@latest init .
npx skillpack-forge@latest compile .
npx skillpack-forge@latest check . --strict
```

That gives one repo manifest and portable output for:

- `AGENTS.md`
- `CLAUDE.md`
- Claude Skills
- Codex Skills
- Cursor rules
- GitHub Copilot instructions
- MCP resources and tools

## Best Fit

Skillpack Forge is strongest for projects that already use more than one AI coding assistant, or expect contributors to use different tools. It reduces copy-paste drift between agent instruction files.

If you only need a single ready-made Claude Skill, use a skill library. If you need to install third-party skills across machines, use a skill manager. If you need to lint hand-written agent files, use a linter. If you want one source manifest for a repo, use Skillpack Forge.
