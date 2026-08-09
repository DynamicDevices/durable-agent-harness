#!/usr/bin/env bash
# Fail closed if denylisted strings appear in publishable paths.
# The denylist file is NOT shipped in this public repo (it would publish the
# sensitive strings). Prefer a local/private path or DENYLIST_FILE.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEFAULT_DENY="/home/ajlennon/data_drive/dd/personal/ai-tenure/public-site-denylist.txt"
DENY="${DENYLIST_FILE:-$DEFAULT_DENY}"
TARGETS=("$ROOT/docs" "$ROOT/content" "$ROOT/starters" "$ROOT/packs" "$ROOT/README.md" "$ROOT/BASELINE.md" "$ROOT/PRIVACY.md" "$ROOT/CONTRIBUTING.md")

# Ensure pages content matches SoT before scanning.
"$ROOT/scripts/sync-content.sh" >/dev/null

tmp="$(mktemp)"
trap 'rm -f "$tmp"' EXIT

mapfile -t files < <(
  find "${TARGETS[@]}" -type f \
    ! -name '*.png' ! -name '*.jpg' ! -name '*.jpeg' ! -name '*.webp' ! -name '*.gif' \
    ! -name '*.ico' ! -name '*.woff*' ! -name '*.pdf' ! -name '*.zip' \
    ! -name 'denylist.txt' ! -name 'denylist.hashes.json' 2>/dev/null | sort -u
)

fail=0

run_plain() {
  local pattern="$1"
  if grep -RInFi -- "$pattern" "${files[@]}" >"$tmp" 2>/dev/null; then
    echo "PRIVACY FAIL (plain): $pattern"
    cat "$tmp"
    fail=1
  fi
}

run_re() {
  local pattern="$1"
  if grep -RInE -- "$pattern" "${files[@]}" >"$tmp" 2>/dev/null; then
    echo "PRIVACY FAIL (re): $pattern"
    cat "$tmp"
    fail=1
  fi
}

# Always-on generic gates (safe to keep in the public repo).
GENERIC_PLAIN=(
  'BEGIN RSA PRIVATE'
  'BEGIN OPENSSH PRIVATE'
  'BEGIN EC PRIVATE'
  'BEGIN PRIVATE KEY'
)
GENERIC_RE=(
  '\b447[0-9]{9}\b'
  '\+[0-9]{10,15}\b'
  '\b192\.168\.[0-9]+\.[0-9]+\b'
  '\b10\.[0-9]+\.[0-9]+\.[0-9]+\b'
  'ghp_[A-Za-z0-9]{20,}'
  'AKIA[0-9A-Z]{16}'
)

for p in "${GENERIC_PLAIN[@]}"; do run_plain "$p"; done
for p in "${GENERIC_RE[@]}"; do run_re "$p"; done

if [[ -f "$DENY" ]]; then
  echo "Using private denylist: $DENY"
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    kind="${line%%:*}"
    pattern="${line#*:}"
    if [[ "$kind" == "plain" ]]; then
      run_plain "$pattern"
    elif [[ "$kind" == "re" ]]; then
      run_re "$pattern"
    else
      echo "Bad denylist line: $line" >&2
      fail=1
    fi
  done <"$DENY"
else
  echo "NOTE: private denylist not found at $DENY — generic gates only."
  if [[ "${REQUIRE_FULL_DENYLIST:-}" == "1" ]]; then
    echo "REQUIRE_FULL_DENYLIST=1 set; failing." >&2
    exit 2
  fi
fi

if [[ "$fail" -ne 0 ]]; then
  echo "Privacy check failed." >&2
  exit 1
fi
echo "Privacy check passed (${#files[@]} files)."
