# GitHub Action

Use Skillpack Forge in CI to make sure generated agent files stay in sync with `skillpack.yaml`.

```yaml
name: skillpack

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: guorunjie/skillpack-forge@v1
        with:
          path: .
```

The action runs:

```bash
npx --yes skillpack-forge@latest check . --strict
```

Set `diff: "false"` if you only want to check that generated files exist and do not contain placeholder text. Set `strict: "false"` if you want freshness checks without failing on unexpected stale Skillpack Forge generated files.
