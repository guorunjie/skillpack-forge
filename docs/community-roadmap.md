# Community Roadmap

Skillpack Forge grows best when contributors can add practical agent workflows without learning the whole compiler first.

## Good First Issues

- [Community: add reusable skillpack submission guide](https://github.com/guorunjie/skillpack-forge/issues/10)
- [Docs: add client-specific MCP setup examples](https://github.com/guorunjie/skillpack-forge/issues/11)

Browse all current starter tasks with the [`good first issue`](https://github.com/guorunjie/skillpack-forge/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22) label.

Use [GitHub Discussions](https://github.com/guorunjie/skillpack-forge/discussions) for template ideas, workflow examples, and questions that are not yet ready to become issues.

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
