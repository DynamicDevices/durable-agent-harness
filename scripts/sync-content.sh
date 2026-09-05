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
rsync -a --delete "$ROOT/packs/codex-hour/" "$ROOT/docs/packs/codex-hour/"
"$ROOT/scripts/render_notes.py"
(
  cd "$ROOT/packs"
  rm -f "$ROOT/docs/packs/cursor-hour-starter.zip"
  rm -f "$ROOT/docs/packs/codex-hour-starter.zip"
  zip -qr "$ROOT/docs/packs/cursor-hour-starter.zip" cursor-hour
  zip -qr "$ROOT/docs/packs/codex-hour-starter.zip" codex-hour
)
echo "Synced content + rendered notes/feed/sitemap; synced starters and Codex/Cursor packs (+ zip)"
