#!/usr/bin/env bash
# Copy content + starters into docs/ for GitHub Pages.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/docs/content" "$ROOT/docs/starters"
rsync -a --delete \
  --exclude '.gitkeep' \
  --exclude 'denylist.txt' \
  --exclude 'site.json' \
  "$ROOT/content/" "$ROOT/docs/content/"
rsync -a --delete "$ROOT/starters/" "$ROOT/docs/starters/"
rm -f "$ROOT/docs/content/denylist.txt" 2>/dev/null || true
echo "Synced content/ → docs/content/ and starters/ → docs/starters/"
