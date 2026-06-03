# Awesome Claude Code Submission Packet

`hesreallyhim/awesome-claude-code` requires resource recommendations to be submitted by a human through the GitHub Web UI issue form. Do not submit this one with `gh` or any other API client.

Form:

https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml

## Fields

Display Name:

```text
Skillpack Forge
```

Category:

```text
Tooling
```

Sub-Category:

```text
Tooling: Config Managers
```

Primary Link:

```text
https://github.com/guorunjie/skillpack-forge
```

Author Name:

```text
guorunjie
```

Author Link:

```text
https://github.com/guorunjie
```

License:

```text
MIT
```

Description:

```text
Zero-dependency CLI that keeps Claude Code and other AI coding-agent context in sync from one skillpack.yaml. It generates AGENTS.md, CLAUDE.md, Claude/Codex Skills, Cursor rules, GitHub Copilot instructions, MCP resources, and MCPB bundles, with diff and check --strict for CI drift prevention.
```

Validate Claims:

```text
Run the published package in any small repository:

npx skillpack-forge@latest init .
npx skillpack-forge@latest compile . --dry-run
npx skillpack-forge@latest compile .
npx skillpack-forge@latest check . --strict

The commands should create skillpack.yaml plus generated agent context files, then report a clean strict check. The project README also includes a checked-in demo script and generated examples.
```

Specific Task(s):

```text
Use Skillpack Forge to create a portable Claude Code context setup for an existing repository, then verify that the generated files are synchronized.
```

Specific Prompt(s):

```text
In this repository, use Skillpack Forge to create one skillpack.yaml and generate AGENTS.md, CLAUDE.md, Claude Skill, Cursor rules, Copilot instructions, and MCP output. Preview changes first, then compile and run the strict check.
```

Additional Comments:

```text
The core CLI has no runtime dependencies and does not call LLM APIs. It runs locally, writes deterministic Markdown/JSON/JS files, and does not require bypass-permissions mode. Network access is only needed when using npx/npm to install or run the published package.
```

Checklist:

- Checked that this resource has not already been submitted.
- The repository has been public for over one week.
- All links are public and accessible.
- No other open issues in the target repository.
- Submitter is human.
