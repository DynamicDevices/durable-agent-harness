#!/usr/bin/env bash
# Fail closed if denylisted strings appear in publishable paths.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DENY="$ROOT/content/denylist.txt"
TARGETS=("$ROOT/docs" "$ROOT/content" "$ROOT/README.md" "$ROOT/PRIVACY.md" "$ROOT/CONTRIBUTING.md")

if [[ ! -f "$DENY" ]]; then
  echo "Missing denylist: $DENY" >&2
  exit 2
fi

# Ensure pages content matches SoT before scanning.
"$ROOT/scripts/sync-content.sh" >/dev/null

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

# Collect files (text-ish). Skip binary assets by extension.
mapfile -t files < <(
  find "${TARGETS[@]}" -type f \
    ! -name '*.png' ! -name '*.jpg' ! -name '*.jpeg' ! -name '*.webp' ! -name '*.gif' \
    ! -name '*.ico' ! -name '*.woff*' ! -name '*.pdf' \
    ! -path '*/denylist.txt' 2>/dev/null | sort -u
)

fail=0
while IFS= read -r line || [[ -n "$line" ]]; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  kind="${line%%:*}"
  pattern="${line#*:}"
  if [[ "$kind" == "plain" ]]; then
    if grep -RInFi -- "$pattern" "${files[@]}" >"$tmp" 2>/dev/null; then
      echo "PRIVACY FAIL (plain): $pattern"
      cat "$tmp"
      fail=1
    fi
  elif [[ "$kind" == "re" ]]; then
    if grep -RInE -- "$pattern" "${files[@]}" >"$tmp" 2>/dev/null; then
      echo "PRIVACY FAIL (re): $pattern"
      cat "$tmp"
      fail=1
    fi
  else
    echo "Bad denylist line: $line" >&2
    fail=1
  fi
done <"$DENY"

if [[ "$fail" -ne 0 ]]; then
  echo "Privacy check failed." >&2
  exit 1
fi
echo "Privacy check passed (${#files[@]} files)."
