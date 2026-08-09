#!/usr/bin/env bash
# Copy content + starters + hour pack into docs/ for GitHub Pages.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/docs/content" "$ROOT/docs/starters" "$ROOT/docs/packs"
rsync -a --delete \
  --exclude '.gitkeep' \
  --exclude 'denylist.txt' \
  --exclude 'site.json' \
  "$ROOT/content/" "$ROOT/docs/content/"
rsync -a --delete "$ROOT/starters/" "$ROOT/docs/starters/"
rsync -a --delete "$ROOT/packs/cursor-hour/" "$ROOT/docs/packs/cursor-hour/"
(
  cd "$ROOT/packs"
  rm -f "$ROOT/docs/packs/cursor-hour-starter.zip"
  zip -qr "$ROOT/docs/packs/cursor-hour-starter.zip" cursor-hour
)
echo "Synced content/ → docs/content/, starters/ → docs/starters/, packs/ → docs/packs/ (+ zip)"
