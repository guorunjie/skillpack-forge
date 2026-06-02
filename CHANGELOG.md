# Changelog

## 1.1.0

- Added `skillpack-forge import` to create `skillpack.yaml` from existing agent files.
- Added `skillpack-forge new` templates for automation, browser automation, docs automation, release automation, ops automation, and data automation.
- Added `skillpack-forge check --strict` for combined CI checks and stale generated-file cleanup.
- Added a reusable GitHub Action that runs `check --strict`.
- Added docs for quick demos, GitHub Action setup, and competitive differentiation.
- Improved scanner coverage for CI and release-related scripts.

## 1.0.0

- First stable release.
- Generated `AGENTS.md`, Claude Skills, Codex Skills, Cursor rules, and GitHub Copilot instructions from one `skillpack.yaml`.
- Added `scan`, `init`, `compile`, `doctor`, and `diff`.
- Added JSON Schema, tests, examples, MIT license, and zero runtime dependencies.
