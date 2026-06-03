# Skillpack MCP Server: skillpack-forge

Generated from `skillpack.yaml` by Skillpack Forge.

This directory contains a zero-dependency local MCP stdio server and MCPB manifest generated from `skillpack.yaml`.

## Local Run

```bash
node .mcp/skillpack-server.mjs
```

The server reads the compiled manifest context from this generated file. It is repo-local, read-only, and only requires Node.js.

## Client Configuration

Use this server as a local stdio MCP server. Replace the path with an absolute path from your machine:

```json
{
  "mcpServers": {
    "skillpack-forge-skillpack": {
      "command": "node",
      "args": ["/absolute/path/to/.mcp/skillpack-server.mjs"]
    }
  }
}
```

If your MCP client supports `skillpack-forge-skillpack.mcpb` installation, use the bundle path from the packaging step instead of wiring the stdio server manually.

## MCPB Packaging

Pack this generated MCP server into a local MCPB bundle with Skillpack Forge:

```bash
skillpack-forge mcpb . skillpack-forge-skillpack.mcpb
```

Omit the output path to use the default bundle name from `.mcp/manifest.json`:

```bash
skillpack-forge mcpb .
```

The built-in packer creates the bundle without adding runtime dependencies. The generated `manifest.json` follows the MCPB manifest format, and you can run an additional official schema validation check when desired:

```bash
npx -y @anthropic-ai/mcpb validate .mcp
```

The stdio server and bundle expose the same read-only Skillpack Forge context.

## Exposed Resources

- `skillpack://manifest`
- `skillpack://summary`
- `skillpack://commands`
- `skillpack://workflows`

## Exposed Tools

- `skillpack_summary`
- `skillpack_commands`
- `skillpack_workflows`
- `skillpack_manifest`
