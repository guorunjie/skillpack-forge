# Copilot Instructions for docs-ops-demo

Generated from `skillpack.yaml` by Skillpack Forge.

Documentation automation workflows for keeping project docs current.

## Principles
- Prefer source-of-truth files over stale summaries
- Keep generated documentation concise and easy to review
- Link commands, files, and examples that readers can verify

## Commands
- install: `npm install`
- test: `npm test`
- docs: `npm run docs`
- docs:check: `npm run docs:check`

## Preferred Workflow
- Scan README, docs, package metadata, and generated agent files
- Identify missing, stale, or duplicated documentation
- Update the smallest useful set of docs
- Run doc-related checks or explain why none exist
