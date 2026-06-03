# MCP Client Setup Examples

Use this page when you want to move from the generated local MCP server to a real client install flow.

Start by compiling MCP output:

```bash
npx skillpack-forge@latest compile .
```

That generates:

- `.mcp/manifest.json`
- `.mcp/skillpack-server.mjs`
- `.mcp/README.md`

The generated [`.mcp/README.md`](../.mcp/README.md) is the source-of-truth for the repo-local server path and the generic stdio wiring snippet. This page adds client-specific patterns on top of that generated output.

See also the [MCP packaging design note](mcp-packaging.md) for the reasoning behind the generated server and `.mcpb` bundle flow.

## Generic Local Stdio Fallback

If your MCP client accepts a local stdio server config, use the generated `.mcp/README.md` snippet and replace the server path with an absolute path on your machine:

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

Keep secrets, tokens, and machine-specific paths out of checked-in examples. Only add the real absolute path in your local client config.

## Claude Desktop Via MCPB Bundle

Claude Desktop supports installing local MCP integrations as packaged extensions. Skillpack Forge already generates the MCPB manifest inputs and can pack them into a bundle.

Build the bundle:

```bash
npx skillpack-forge@latest mcpb .
```

That writes the default bundle name from `.mcp/manifest.json` in your project root.

Install it in Claude Desktop:

1. Open `Settings`.
2. Go to `Extensions`.
3. Open `Advanced settings`.
4. In the extension developer section, choose `Install Extension...`.
5. Select the generated `.mcpb` file.

Verify the install:

1. Restart Claude Desktop if the tools do not appear immediately.
2. Open the `+` menu in the chat composer and choose `Connectors`.
3. Confirm the Skillpack Forge tools are listed.

This flow is useful when you want a client-specific install path without manually wiring a JSON stdio config.
