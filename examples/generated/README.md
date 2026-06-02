# Generated Examples

These examples are created with the Skillpack Forge CLI so the checked-in files match real command output.

## Browser Automation

Source manifest:

- [`browser-automation/skillpack.yaml`](browser-automation/skillpack.yaml)

Generated files:

- [`browser-automation/AGENTS.md`](browser-automation/AGENTS.md)
- `browser-automation/.claude/skills/browser-ops-demo-browser-automation/SKILL.md`
- `browser-automation/.codex/skills/browser-ops-demo-browser-automation/SKILL.md`
- `browser-automation/.cursor/rules/browser-ops-demo.mdc`
- `browser-automation/.github/copilot-instructions.md`

Regenerate:

```bash
npx skillpack-forge@latest new browser-automation examples/generated/browser-automation --force
npx skillpack-forge@latest compile examples/generated/browser-automation
```
