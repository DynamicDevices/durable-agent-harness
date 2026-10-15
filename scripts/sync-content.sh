#!/usr/bin/env bash
# Copy content + starters + hour pack into docs/ for GitHub Pages.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/docs/content" "$ROOT/docs/starters" "$ROOT/docs/packs"
rsync -a --delete \
  --exclude '.gitkeep' \
  --exclude 'denylist.txt' \
  --exclude 'site.json' \
  --exclude 'review-drafts/' \
  "$ROOT/content/" "$ROOT/docs/content/"
rsync -a --delete "$ROOT/starters/" "$ROOT/docs/starters/"
rsync -a --delete "$ROOT/packs/cursor-hour/" "$ROOT/docs/packs/cursor-hour/"
rsync -a --delete "$ROOT/packs/codex-hour/" "$ROOT/docs/packs/codex-hour/"
mkdir -p "$ROOT/docs/examples/array-limit"
rsync -a --delete "$ROOT/examples/array-limit/" "$ROOT/docs/examples/array-limit/"
"$ROOT/scripts/render_notes.py"
"$ROOT/scripts/render_review_drafts.py"
python3 "$ROOT/scripts/build_downloads.py"
echo "Synced content + rendered notes/reviews/feed/sitemap; synced starters and Codex/Cursor packs (+ zip)"
