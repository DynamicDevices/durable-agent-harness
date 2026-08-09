#!/usr/bin/env bash
# Copy root content/ into docs/content/ for GitHub Pages.
# Never publish the denylist itself (it contains the sensitive strings).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/docs/content"
rsync -a --delete \
  --exclude '.gitkeep' \
  --exclude 'denylist.txt' \
  --exclude 'site.json' \
  "$ROOT/content/" "$ROOT/docs/content/"
# Remove accidental denylist copies if present
rm -f "$ROOT/docs/content/denylist.txt" "$ROOT/docs/data/site.json" 2>/dev/null || true
echo "Synced content/ → docs/content/ (denylist excluded)"
