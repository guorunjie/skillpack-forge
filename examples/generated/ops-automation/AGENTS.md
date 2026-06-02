# Agent Guide: ops-runbook-demo

Generated from `skillpack.yaml` by Skillpack Forge.

## Project
Operations automation workflows for recurring checks, monitors, and runbooks.

## Working Principles
- Make every operational action observable and auditable
- Prefer idempotent commands with clear rollback paths
- Escalate destructive or credential-sensitive actions before execution

## Commands
- install: `npm install`
- test: `npm test`
- doctor: `npm run doctor`
- check: `npm run check`

## Agent Workflows
### ops-runbook-demo-ops-automation
Use when running ops automation workflows for ops-runbook-demo.

- Identify the service, environment, and operational objective
- Check current state before making changes
- Run the least invasive command that proves or fixes the issue
- Record verification output and any remaining risk
