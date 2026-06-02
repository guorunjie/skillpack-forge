#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$(mktemp -d)}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_CLI="$SCRIPT_DIR/../bin/skillpack-forge.js"

if [ -f "$LOCAL_CLI" ]; then
  SKILLPACK_FORGE=(node "$LOCAL_CLI")
else
  SKILLPACK_FORGE=(npx --yes skillpack-forge@latest)
fi

mkdir -p "$ROOT"
cat > "$ROOT/package.json" <<'JSON'
{
  "name": "skillpack-demo",
  "description": "Demo project for Skillpack Forge.",
  "scripts": {
    "test": "node --test"
  }
}
JSON

echo "$ROOT"
"${SKILLPACK_FORGE[@]}" init "$ROOT" --force
"${SKILLPACK_FORGE[@]}" compile "$ROOT" --dry-run
"${SKILLPACK_FORGE[@]}" compile "$ROOT"
"${SKILLPACK_FORGE[@]}" check "$ROOT" --strict
