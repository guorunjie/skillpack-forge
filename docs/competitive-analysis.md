# Competitive Analysis and Originality Review

Date: 2026-05-27

## Executive Summary

No mature GitHub project found in this scan provides the same combination as Skillpack Forge:

- one repo-local manifest named `skillpack.yaml`;
- deterministic compilation into `AGENTS.md`, Claude Skill, Codex Skill, Cursor rule, and GitHub Copilot instructions;
- a small zero-dependency Node CLI with `scan`, `init`, `compile`, and `doctor`;
- explicit positioning around preventing multi-agent instruction drift.

The closest overlaps are `sno-ai/mda`, `Sanmu-27/repo2agent`, `joventuraz/skillpack`, and `tecnomanu/agent-rules-kit`. They validate the market but do not make Skillpack Forge a copy. The main risk is naming confusion with `joventuraz/skillpack`, not code/content plagiarism.

## Search Evidence

GitHub searches performed:

| Query | Result |
| --- | --- |
| `skillpack-forge in:name,description,readme` | Found this repository plus unrelated low-star "forge/skill" projects. No prior exact project. |
| `"skillpack.yaml" "AGENTS.md"` | No repository result from GitHub repository search. Code search found `joventuraz/skillpack`, which uses `skillpack.yaml` for installing skills, not generating agent instruction files. |
| `"one manifest" "AGENTS.md" "Claude" "Cursor"` | Only this repository matched repository search. |
| `"compile" "AGENTS.md" "SKILL.md" "CLAUDE.md"` | Found `sno-ai/mda`, a Markdown spec/compiler for agent-facing documents. |
| `"generate AGENTS.md" "copilot instructions" "cursor rules"` | Found `Sanmu-27/repo2agent` and this repository. |

Important adjacent repositories:

| Repository | Observed stars | Relationship | Risk |
| --- | ---: | --- | --- |
| [`sno-ai/mda`](https://github.com/sno-ai/mda) | 563 | Closest conceptual overlap: one source compiles to agent-facing docs such as `SKILL.md`, `AGENTS.md`, `MCP-SERVER.md`, and `CLAUDE.md`. | Medium concept overlap, low implementation risk. Skillpack Forge should avoid copying MDA's spec language around signatures, graph relationships, and `.mda` terminology. |
| [`Sanmu-27/repo2agent`](https://github.com/Sanmu-27/repo2agent) | 1 | Generates `AGENTS.md`, `CLAUDE.md`, Cursor rules, and Copilot instructions; adds agent-readiness scoring. | Medium product overlap. Skillpack Forge differentiates by manifest-first authoring, Claude/Codex skill targets, and not being a score/linter product. |
| [`joventuraz/skillpack`](https://github.com/joventuraz/skillpack) | 6 | Uses a `skillpack.yaml` file, but as a package manager that installs existing skills into agent folders. | Naming/config-file confusion risk. Skillpack Forge should clearly say it compiles repo instructions, not installs third-party skills. |
| [`tecnomanu/agent-rules-kit`](https://github.com/tecnomanu/agent-rules-kit) | 32 | Interactive CLI that bootstraps IDE/framework/MCP rules for multiple assistants. | Low-to-medium category overlap. It is stack-rule installation; Skillpack Forge is repo-manifest compilation. |
| [`agentsmd/agents.md`](https://github.com/agentsmd/agents.md) | 21,736 | Open format for repo-level agent guidance. | No plagiarism risk if referenced as an output target/standard. |
| [`github/awesome-copilot`](https://github.com/github/awesome-copilot) | 33,907 | Curated Copilot instructions, agents, skills, and configs. | No plagiarism risk; useful distribution target. |
| [`anthropics/skills`](https://github.com/anthropics/skills) | 141,587 | Public repository for Agent Skills. | No plagiarism risk; validates Skill target demand. |
| [`addyosmani/agent-skills`](https://github.com/addyosmani/agent-skills) | 46,269 | Production-grade engineering skills collection. | No plagiarism risk; content library, not compiler. |

Star counts are a point-in-time scan and will change.

## Plagiarism and Confusion Risk

### Low code plagiarism risk

Skillpack Forge was implemented as a small local Node CLI with its own scanner, manifest serializer/parser, compiler, and tests. It does not vendor source code from the adjacent projects above. The generated file shapes are ordinary Markdown files, which is expected for compatibility with existing agent tools.

### Medium concept overlap with MDA and repo2agent

The overlap is at the market-problem level: multiple agent tools need similar instruction files. That problem is common and not itself protectable. To keep originality clear, Skillpack Forge should avoid:

- claiming to be an open spec like MDA;
- copying MDA's tamper-evidence, signature, dependency-graph, or `.mda` vocabulary;
- copying repo2agent's "ESLint for AI coding agents" positioning or readiness-score model;
- using `skillpack` without the `forge` suffix in package/repo branding.

### Main naming risk: `skillpack.yaml`

`joventuraz/skillpack` also uses `skillpack.yaml`, but for a different purpose: installing skills from repositories into agent skill folders. Skillpack Forge uses `skillpack.yaml` as a source manifest for compiling project instruction files. This should be explained in README to reduce confusion.

## Differentiation

Skillpack Forge should keep these as the primary claims:

1. **Manifest-first repo context compiler**  
   It turns one repo-local manifest into multiple agent instruction targets. It is not a skill marketplace, skill installer, or full agent framework.

2. **Targets both instruction files and skill runtimes**  
   It generates `AGENTS.md`, Cursor rules, Copilot instructions, plus Claude/Codex `SKILL.md` outputs. `repo2agent` currently targets instruction files but not `.claude/skills/<skill>/SKILL.md` and `.codex/skills/<skill>/SKILL.md`.

3. **Small, deterministic, zero-dependency CLI**  
   No LLM calls, no hosted service, no registry dependency, no API keys.

4. **Designed for drift prevention**  
   `doctor` verifies generated outputs exist and are not placeholder files. Future `diff`/fingerprint checks can turn this into a strong CI story.

5. **Automation-skill wedge**  
   The example focuses on browser/ops automation skillpacks, which connects the project to high-interest categories like browser automation, MCP, and agent workflows.

## Optimization Points

Highest-impact improvements:

- Add a README section named "How this differs from MDA, repo2agent, and skillpack" to preempt confusion.
- Add `skillpack-forge diff` so CI can detect generated files that drift from `skillpack.yaml`.
- Add JSON Schema for `skillpack.yaml` to make the manifest explicit and editor-friendly.
- Add a GitHub Action wrapper around `doctor`.
- Add importers for existing `AGENTS.md`, `.github/copilot-instructions.md`, and `.cursor/rules`.
- Add `targets` for `CLAUDE.md` and MCP resources while keeping Claude/Codex Skill output.
- Add template presets for browser automation, release automation, documentation automation, and data/ops automation.

## Selling Points

Short pitch:

> One manifest for every AI coding agent.

README pitch:

> Skillpack Forge prevents agent-instruction drift by compiling one `skillpack.yaml` into `AGENTS.md`, Claude/Codex Skills, Cursor rules, and GitHub Copilot instructions.

Differentiated bullets:

- Generates both repo instructions and installable skill files.
- Uses one plain YAML source instead of hand-maintaining five Markdown formats.
- Runs fully offline and requires no LLM/API key.
- Provides `doctor` checks for CI and maintainers.
- Starts small enough to understand, fork, and trust.

## Recommended Positioning Guardrail

Use this sentence in public materials:

> Skillpack Forge is a compiler for repo-specific agent instructions, not a skill registry, skill installer, readiness-score linter, or agent runtime.

This makes the originality boundary clear while still connecting the project to the fast-growing agent skills ecosystem.
