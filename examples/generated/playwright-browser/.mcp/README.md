# Skillpack MCP Server: playwright-ops-demo

Generated from `skillpack.yaml` by Skillpack Forge.

This directory contains a zero-dependency local MCP stdio server generated from `skillpack.yaml`.

## Run

```bash
node .mcp/skillpack-server.mjs
```

## Client Configuration

Use this server as a local stdio MCP server:

```json
{
  "mcpServers": {
    "playwright-ops-demo-skillpack": {
      "command": "node",
      "args": ["/absolute/path/to/.mcp/skillpack-server.mjs"]
    }
  }
}
```

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
