#!/usr/bin/env bash
# Runs every build's headless kernel smoke test (no browser, no deps beyond node >= 18).
# usage: tools/kernel_tests.sh [SUBSTR]   e.g. tools/kernel_tests.sh v1_3_3
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fail=0
for dir in "$ROOT"/eukaryotic_eucharist_mobile_v*/; do
  name="$(basename "$dir")"
  [[ -n "${1:-}" && "$name" != *"$1"* ]] && continue
  if grep -q '"smoke"' "$dir/package.json" 2>/dev/null; then
    cmd=(npm run --silent smoke --prefix "$dir")
  else
    test_file="$(ls "$dir"/tests/smoke*.mjs "$dir"/test/smoke*.mjs 2>/dev/null | head -1)"
    [[ -z "$test_file" ]] && { echo "skip $name (no smoke test)"; continue; }
    cmd=(node "$test_file")
  fi
  start=$SECONDS
  if out="$(cd "$dir" && "${cmd[@]}" 2>&1)"; then
    echo "ok   $name ($((SECONDS - start))s) $(echo "$out" | grep -E '_OK' | tail -1)"
  else
    echo "FAIL $name"; echo "$out" | tail -15 | sed 's/^/     /'; fail=1
  fi
done
if [[ -d "$ROOT/immune_incursion" ]]; then
  if out="$(cd "$ROOT" && python3 -m unittest immune_incursion.test_kernel 2>&1)"; then
    echo "ok   immune_incursion ($(echo "$out" | tail -1))"
  else
    echo "FAIL immune_incursion"; echo "$out" | tail -15 | sed 's/^/     /'; fail=1
  fi
fi
exit $fail
