# Agent Guide: docs-ops-demo

Generated from `skillpack.yaml` by Skillpack Forge.

## Project
Documentation automation workflows for keeping project docs current.

## Working Principles
- Prefer source-of-truth files over stale summaries
- Keep generated documentation concise and easy to review
- Link commands, files, and examples that readers can verify

## Commands
- install: `npm install`
- test: `npm test`
- docs: `check: "npm run docs:check"`

## Agent Workflows
### docs-ops-demo-docs-automation
Use when running docs automation workflows for docs-ops-demo.

- Scan README, docs, package metadata, and generated agent files
- Identify missing, stale, or duplicated documentation
- Update the smallest useful set of docs
- Run doc-related checks or explain why none exist
