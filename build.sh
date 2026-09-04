#!/usr/bin/env bash
# Build an unsigned .xpi package for Regular Shorts.
#
# An .xpi is just a ZIP archive with the extension's files at its root.
# Note: the result is UNSIGNED. To install it in standard Firefox you must
# first get it signed via AMO (see README.md), or use Developer
# Edition / Nightly / ESR with xpinstall.signatures.required set to false.
set -euo pipefail

cd "$(dirname "$0")"

OUT_DIR="dist"
OUT_FILE="$OUT_DIR/regular-shorts.xpi"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

zip -r -FS "$OUT_FILE" \
  manifest.json \
  background.js \
  content.js

echo "Built $OUT_FILE"
