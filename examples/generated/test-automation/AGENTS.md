# Agent Guide: test-automation-demo

Generated from `skillpack.yaml` by Skillpack Forge.

## Project
Test automation workflows for reproducing failures, running focused checks, and documenting verification.

## Working Principles
- Reproduce failures with the smallest reliable command before changing code
- Prefer focused tests and minimal fixtures over broad test runs during diagnosis
- Keep verification output, failing inputs, and skipped coverage easy to review
- Broaden to the full relevant test suite before reporting completion

## Commands
- install: `npm install`
- test: `npm test`

## Agent Workflows
### test-automation-demo-test-automation
Use when running test automation workflows for test-automation-demo.

- Identify the failing behavior, expected outcome, and narrowest reproducible test command
- Run the focused test first and capture the exact failure output
- Inspect nearby code, fixtures, and assertions before changing test expectations
- Add or update the smallest fixture that proves the behavior
- Rerun the focused test, then the broader relevant suite, and document any remaining risk
