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

The generated `manifest.json` follows the MCPB manifest format and can be validated or packed with the official MCPB CLI:

```bash
npm install -g @anthropic-ai/mcpb
mcpb validate .mcp
mcpb pack .mcp data-pipeline-demo-skillpack.mcpb
```

The server is read-only by default and does not require runtime dependencies beyond Node.js.

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
