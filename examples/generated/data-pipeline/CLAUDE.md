# Claude Instructions for data-pipeline-demo

Generated from `skillpack.yaml` by Skillpack Forge.

Data pipeline workflows for extraction, validation, transformation, and reporting.

## Principles
- Preserve raw inputs and keep derived outputs separate
- Validate schemas, row counts, checksums, and representative samples
- Run transformations on a narrow sample before full pipeline execution
- Record data assumptions, freshness, and known quality gaps

## Commands
- install: `npm install`
- test: `npm test`
- data:validate: `npm run data:validate`
- data:transform: `npm run data:transform`
- data:report: `npm run data:report`

## Preferred Workflow
- Locate source data, schema contracts, and expected output destinations
- Run validation first, such as npm run data:validate, before transforming data
- Run extraction or transformation on a small sample or dry run
- Compare row counts, null rates, key fields, and generated report artifacts
- Document assumptions, skipped checks, and any remaining data quality risk
