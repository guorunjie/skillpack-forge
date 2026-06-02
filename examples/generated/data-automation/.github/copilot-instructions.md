# Copilot Instructions for data-automation-demo

Generated from `skillpack.yaml` by Skillpack Forge.

Data automation workflows for repeatable extraction, validation, and reporting.

## Principles
- Preserve raw inputs before transforming data
- Validate schemas, row counts, and representative samples
- Separate generated reports from source data

## Commands
- install: `npm install`
- test: `npm test`
- data:validate: `npm run data:validate`
- data:extract: `npm run data:extract`
- data:report: `npm run data:report`

## Preferred Workflow
- Locate source data, expected schema, and output format
- Run extraction or transformation on a small sample first
- Validate counts, types, and important edge cases
- Generate the report and document assumptions
