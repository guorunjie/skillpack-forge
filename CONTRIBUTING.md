# Contributing to Skillpack Forge

Thanks for helping make repo context portable across AI coding agents.

## Good First Contributions

- Add or improve automation templates in `src/templates.js`.
- Improve import support for existing `AGENTS.md`, `CLAUDE.md`, Cursor, Claude, Codex, or Copilot files.
- Add generated examples under `examples/generated`.
- Improve docs for real workflows such as release, docs, ops, data, and browser automation.

## Local Setup

```bash
npm install
npm test
npm run check
```

The CLI is dependency-free at runtime. Please keep new runtime dependencies out of the core package unless there is a strong reason.

## Before Opening a Pull Request

Run:

```bash
npm test
npm run check
npm run demo
npm pack --dry-run
```

If you change generated output, also run the relevant compile command and commit the generated files.

## Design Principles

- Keep generated files readable and boring.
- Prefer deterministic output over LLM-generated output.
- Preserve user-written files unless the command is explicitly regenerating Skillpack Forge output.
- Make multi-agent support clearer without turning the CLI into a hosted platform.
