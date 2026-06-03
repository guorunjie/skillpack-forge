# MCP Packaging Design Note

Skillpack Forge generates a local read-only MCP stdio server from `skillpack.yaml`. The packaging question is how that server should become installable or shareable without making the core CLI heavier.

## Current Decision

Generate `.mcp/manifest.json` next to `.mcp/skillpack-server.mjs`, then provide a built-in zero-dependency pack helper:

```bash
skillpack-forge mcpb . project-skillpack.mcpb
```

This gives every `mcp` target an MCPB-ready directory:

```text
.mcp/
  manifest.json
  skillpack-server.mjs
  README.md
```

## Copy-Paste Local Setup

Generate MCP output:

```bash
npx skillpack-forge@latest compile .
```

Run the generated stdio server directly:

```bash
node .mcp/skillpack-server.mjs
```

Wire the server into a local MCP client with an absolute path:

```json
{
  "mcpServers": {
    "my-project-skillpack": {
      "command": "node",
      "args": ["/absolute/path/to/my-project/.mcp/skillpack-server.mjs"]
    }
  }
}
```

Pack the same generated server into an `.mcpb` bundle:

```bash
npx skillpack-forge@latest mcpb . my-project-skillpack.mcpb
```

Or omit the output path to use the default bundle name from `.mcp/manifest.json`:

```bash
npx skillpack-forge@latest mcpb .
```

The local stdio server and `.mcpb` bundle expose the same read-only project context: manifest, summary, commands, and workflows.

For client-specific install examples built on top of this generated output, see [MCP client setup examples](mcp-client-setup.md).

Users can still run the official MCPB CLI for additional schema validation:

```bash
npx -y @anthropic-ai/mcpb validate .mcp
```

## Options Compared

| Option | Pros | Cons | Decision |
| --- | --- | --- | --- |
| Generate MCPB `manifest.json` | Zero new dependencies, deterministic output, easy to validate, works with official MCPB CLI | User still needs a pack step | Shipped in v1.5.0 |
| Add `skillpack-forge mcpb` | One-command bundle creation, no global MCPB install, can stay dependency-free with a small ZIP writer | Maintains ZIP packaging logic in Skillpack Forge | Shipped in v1.7.0 |
| Shell out to official `mcpb pack` | Delegates all packaging behavior to the official CLI | Requires global install or networked `npx`, weaker offline story | Keep as optional external path |
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
5. Update `.mcp/README.md` with `skillpack-forge mcpb` packing and optional official validation commands.
6. Include the manifest in strict generated-file checks.
7. Add `skillpack-forge mcpb [path] [output]` with a deterministic built-in ZIP writer and no runtime dependencies.
8. Keep signing and installer-specific flows out of scope until user feedback justifies them.

## Why This Fits Skillpack Forge

Skillpack Forge should stay a small compiler, not become a package manager. Generating the manifest and packing the local MCPB archive are compiler-shaped tasks because they are deterministic file transformations. Signing and installer-specific workflows remain distribution actions that are better handled by dedicated tooling.
