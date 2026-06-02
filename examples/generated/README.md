# Generated Examples

These examples are created with the Skillpack Forge CLI so the checked-in files match real command output.

## Browser Automation

Source manifest:

- [`browser-automation/skillpack.yaml`](browser-automation/skillpack.yaml)

Generated files:

- [`browser-automation/AGENTS.md`](browser-automation/AGENTS.md)
- [`browser-automation/CLAUDE.md`](browser-automation/CLAUDE.md)
- `browser-automation/.claude/skills/browser-ops-demo-browser-automation/SKILL.md`
- `browser-automation/.codex/skills/browser-ops-demo-browser-automation/SKILL.md`
- `browser-automation/.cursor/rules/browser-ops-demo.mdc`
- `browser-automation/.github/copilot-instructions.md`

Regenerate:

```bash
npx skillpack-forge@latest new browser-automation examples/generated/browser-automation --force
npx skillpack-forge@latest compile examples/generated/browser-automation
```

## Playwright Browser

Source manifest:

- [`playwright-browser/skillpack.yaml`](playwright-browser/skillpack.yaml)

Generated files:

- [`playwright-browser/AGENTS.md`](playwright-browser/AGENTS.md)
- [`playwright-browser/CLAUDE.md`](playwright-browser/CLAUDE.md)
- `playwright-browser/.claude/skills/playwright-ops-demo-playwright-browser/SKILL.md`
- `playwright-browser/.codex/skills/playwright-ops-demo-playwright-browser/SKILL.md`
- `playwright-browser/.cursor/rules/playwright-ops-demo.mdc`
- `playwright-browser/.github/copilot-instructions.md`

Regenerate:

```bash
npx skillpack-forge@latest new playwright-browser examples/generated/playwright-browser --force
npx skillpack-forge@latest compile examples/generated/playwright-browser
```
