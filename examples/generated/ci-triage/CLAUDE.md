# Claude Instructions for ci-triage-demo

Generated from `skillpack.yaml` by Skillpack Forge.

CI triage workflows for inspecting failing runs, isolating causes, and documenting flaky versus real failures.

## Principles
- Read failing logs and changed files before rerunning jobs
- Reproduce the smallest failing command locally when possible
- Separate flaky infrastructure failures from real regressions with evidence
- Record the failing job, suspected cause, rerun decision, and final verification

## Commands
- install: `npm install`
- test: `npm test`
- lint: `npm run lint`
- ci:failed: `npm run ci:failed`

## Preferred Workflow
- Identify the failing workflow, job, commit, and relevant changed files
- Read the failed step logs before changing code or rerunning CI
- Map the failure to the narrowest local command, test, or package script
- Classify the failure as likely flaky, environment-related, or a real regression
- Apply the smallest fix or rerun decision, then document verification and remaining risk
