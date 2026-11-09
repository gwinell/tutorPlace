#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

mkdir -p backups
chmod 700 backups
temporary="backups/.codetogether-latest-$$.sqlite"
trap 'rm -f "$temporary"' EXIT

ssh retail-olive sudo /run/current-system/sw/bin/codetogether-backup-export > "$temporary"
result="$(sqlite3 "$temporary" 'PRAGMA integrity_check;')"
[ "$result" = "ok" ] || { echo "Received database failed integrity_check: $result" >&2; exit 1; }
mv -f "$temporary" backups/codetogether-latest.sqlite
trap - EXIT
echo "Updated backups/codetogether-latest.sqlite"
