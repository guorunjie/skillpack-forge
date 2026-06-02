# Copilot Instructions for browser-ops-demo

Generated from `skillpack.yaml` by Skillpack Forge.

Browser automation workflows for testing, scraping, and operator tasks.

## Principles
- Prefer deterministic selectors and explicit waits
- Capture screenshots or traces when a browser flow fails
- Avoid storing secrets, cookies, or private page content in generated files

## Commands
- install: `npm install`
- test: `npm test`
- doctor: `npm run doctor`

## Preferred Workflow
- Identify the target URL, browser state, and expected user path
- Run the browser flow in a narrow, repeatable scenario
- Inspect visible page state before and after each important action
- Save failure evidence and rerun focused verification
