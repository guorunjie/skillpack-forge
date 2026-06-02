# Skillpack MCP Server: browser-ops-agent

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
    "browser-ops-agent-skillpack": {
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
