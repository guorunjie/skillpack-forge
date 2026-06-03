# Community Roadmap

Skillpack Forge grows best when contributors can add practical agent workflows without learning the whole compiler first.

## Good First Issues

- [Template: add test-automation skillpack preset](https://github.com/guorunjie/skillpack-forge/issues/7)
- [Docs: add MCP client install snippets](https://github.com/guorunjie/skillpack-forge/issues/8)
- [Community: add reusable skillpack submission guide](https://github.com/guorunjie/skillpack-forge/issues/10)

Browse all current starter tasks with the [`good first issue`](https://github.com/guorunjie/skillpack-forge/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22) label.

## Deeper Roadmap Issues

- [Importer: preserve Cursor glob metadata when importing rules](https://github.com/guorunjie/skillpack-forge/issues/9)

## Contribution Lanes

### Templates

Add reusable automation presets in `src/templates.js`, generate examples under `examples/generated`, and update the gallery in `docs/skillpack-gallery.md`.

### Documentation

Improve copy-paste setup paths for real users, especially MCP, MCPB, Copilot, Cursor, Claude, and Codex workflows.

### Importers

Help existing projects migrate from hand-written agent files into one `skillpack.yaml` without losing useful metadata.

### Distribution

Submit Skillpack Forge to relevant directories, newsletters, and tool lists, then record the result in `docs/distribution.md`.

## Before A Pull Request

Run:

```bash
npm test
npm run check
npm run demo
```

If generated outputs change, commit the regenerated files with the source manifest or compiler change.
