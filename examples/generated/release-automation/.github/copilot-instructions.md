# Copilot Instructions for release-ops-demo

Generated from `skillpack.yaml` by Skillpack Forge.

Release automation workflows for changelogs, tags, packages, and CI checks.

## Principles
- Verify a clean worktree and passing checks before release steps
- Keep version, tag, package, and release notes aligned
- Treat publish credentials and tokens as sensitive

## Commands
- install: `npm install`
- test: `npm test`
- build: `npm run build`
- release: `npm run release`
- check: `npm run check`

## Preferred Workflow
- Inspect git status, recent commits, package metadata, and release history
- Run tests and package dry-run checks
- Prepare release notes from concrete changes
- Publish only after verifying the target registry or GitHub release state
