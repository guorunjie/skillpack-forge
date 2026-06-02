# MCP Packaging Design Note

Skillpack Forge already generates a local read-only MCP stdio server from `skillpack.yaml`. The packaging question is how that server should become installable or shareable without making the core CLI heavier.

## Current Decision

Generate `.mcp/manifest.json` next to `.mcp/skillpack-server.mjs`.

This gives every `mcp` target an MCPB-ready directory:

```text
.mcp/
  manifest.json
  skillpack-server.mjs
  README.md
```

Users can run the official MCPB CLI when they want a bundle:

```bash
npm install -g @anthropic-ai/mcpb
mcpb validate .mcp
mcpb pack .mcp project-skillpack.mcpb
```

## Options Compared

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Generate MCPB `manifest.json` | Zero new dependencies, deterministic output, easy to validate, works with official MCPB CLI | User still runs the final pack command | Ship now |
| Add `skillpack-forge mcpb pack` | One-command bundle creation | Requires zip packaging logic or an added dependency; duplicates official CLI behavior | Future helper only |
| Generate client-specific install snippets | Simple and useful for local setup | Does not create a portable bundle artifact | Keep in `.mcp/README.md` |
| Remote MCP transport | Better for hosted public connectors | More operational complexity and not repo-local | Separate future product path |

## Implementation Plan

1. Keep the generated server read-only and dependency-free.
2. Emit `.mcp/manifest.json` with MCPB manifest version `0.3`.
3. Point the manifest server config to `${__dirname}/skillpack-server.mjs`.
4. List the generated tools in the manifest:
   - `skillpack_summary`
   - `skillpack_commands`
   - `skillpack_workflows`
   - `skillpack_manifest`
5. Update `.mcp/README.md` with `mcpb validate` and `mcpb pack` commands.
6. Include the manifest in strict generated-file checks.
7. Defer a built-in pack command until users ask for it or MCPB packaging becomes stable enough to justify the extra command surface.

## Why This Fits Skillpack Forge

Skillpack Forge should stay a small compiler, not become a package manager. Generating the manifest is the compiler-shaped part of the problem. Packing, signing, and installer-specific workflows are distribution actions that the official MCPB CLI already handles.
