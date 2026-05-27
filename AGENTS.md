# Agent Guide: skillpack-forge

Generated from `skillpack.yaml` by Skillpack Forge.

## Project
Compile one repo manifest into portable AGENTS.md, AI coding skills, and agent rules.

## Working Principles
- Preserve user changes and keep edits scoped
- Inspect the current repo state before changing files
- Run verification before claiming success

## Commands
- install: `npm install`
- test: `npm test`
- doctor: `npm run doctor`
- scan: `npm run scan`

## Agent Workflows
### skillpack-forge-developer
Use when changing, testing, or automating skillpack-forge.

- Inspect the current project context and nearby files
- Run npm test before completion
- Document any command that cannot be run
