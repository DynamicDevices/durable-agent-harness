#!/usr/bin/env bash
# Copy root content/ into docs/content/ for GitHub Pages.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/docs/content"
rsync -a --delete --exclude '.gitkeep' "$ROOT/content/" "$ROOT/docs/content/"
echo "Synced content/ → docs/content/"
