#!/usr/bin/env bash

set -euo pipefail

if [[ -n "${LUME_BIN:-}" ]]; then
  LUME_COMMAND="$LUME_BIN"
else
  LUME_COMMAND="$(command -v lume || true)"
fi

if [[ -z "$LUME_COMMAND" || ! -x "$LUME_COMMAND" ]]; then
  echo "Lume interpreter not found on PATH." >&2
  echo "Install the global 'lume' command or set LUME_BIN to an executable." >&2
  exit 1
fi

exec "$LUME_COMMAND" "$@"

