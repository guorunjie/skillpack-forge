# Community Skillpack Submissions

Use this guide when you want Skillpack Forge to generate a reusable automation workflow for more than one repo.

## What Makes A Good Skillpack

A strong reusable skillpack has:

- a clear trigger, such as browser automation, dependency upgrades, CI triage, or release work;
- concrete commands that an agent can run or verify;
- principles that prevent unsafe or noisy automation;
- a short workflow that moves from inspection to action to verification;
- generated examples that users can inspect before running anything.

The best submissions feel practical, not generic. A maintainer should be able to read the generated `AGENTS.md`, Claude Skill, Codex Skill, Cursor rule, Copilot instructions, and MCP output and understand when to use them.

## Template Request Or Pull Request

Open a [template request](../.github/ISSUE_TEMPLATE/template_request.md) when:

- the workflow is still an idea;
- you are not sure which commands or targets should be generated;
- you want feedback before changing `src/templates.js`;
- the skillpack is useful, but you do not have a generated example ready yet.

Open a pull request when:

- the trigger, commands, principles, and workflow are already clear;
- you added or updated a template in `src/templates.js`;
- you generated the matching example under `examples/generated`;
- you updated the [automation skillpack gallery](skillpack-gallery.md);
- `npm test` and `npm run check` pass.

Use [GitHub Discussions](https://github.com/guorunjie/skillpack-forge/discussions) for broader ideas, examples from real repos, or questions that are not ready for an issue.

## Submission Checklist

For a new template, include:

- a template entry in `src/templates.js`;
- a test in `test/templates.test.js`;
- a generated example under `examples/generated/<template-name>`;
- a gallery entry in [docs/skillpack-gallery.md](skillpack-gallery.md);
- a note in [CHANGELOG.md](../CHANGELOG.md) when the change will ship in a release.

Before opening the PR, run:

```bash
npm test
npm run check
npm run demo
```

If generated outputs change, commit the source manifest and generated files together.

## Useful References

- [Automation skillpack gallery](skillpack-gallery.md)
- [Generated examples index](../examples/generated/README.md)
- [Live fixture demo](https://github.com/guorunjie/skillpack-forge-demo)
- [Community roadmap](community-roadmap.md)
- [Template request form](../.github/ISSUE_TEMPLATE/template_request.md)
