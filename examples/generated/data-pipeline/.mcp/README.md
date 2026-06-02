# Skillpack MCP Server: data-pipeline-demo

Generated from `skillpack.yaml` by Skillpack Forge.

This directory contains a zero-dependency local MCP stdio server and MCPB manifest generated from `skillpack.yaml`.

## Run

```bash
node .mcp/skillpack-server.mjs
```

## Client Configuration

Use this server as a local stdio MCP server:

```json
{
  "mcpServers": {
    "data-pipeline-demo-skillpack": {
      "command": "node",
      "args": ["/absolute/path/to/.mcp/skillpack-server.mjs"]
    }
  }
}
```

## MCPB Packaging

Pack this generated MCP server into a local MCPB bundle with Skillpack Forge:

```bash
skillpack-forge mcpb . data-pipeline-demo-skillpack.mcpb
```

The generated `manifest.json` follows the MCPB manifest format. To run an additional official schema validation check:

```bash
npx -y @anthropic-ai/mcpb validate .mcp
```

The server and bundle are read-only by default and do not require runtime dependencies beyond Node.js.

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
