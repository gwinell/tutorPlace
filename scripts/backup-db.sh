#!/usr/bin/env bash
# Create a local SQLite copy. Set DATABASE_PATH to back up another file.
set -euo pipefail
cd "$(dirname "$0")/.."
DB_FILE="${DATABASE_PATH:-.data/tutorplace.sqlite}"
[ -f "$DB_FILE" ] || { echo "Database not found: $DB_FILE" >&2; exit 1; }
mkdir -p backups
OUT="backups/tutorplace-$(date +%Y%m%d-%H%M%S).sqlite"
cp "$DB_FILE" "$OUT"
if command -v sqlite3 >/dev/null 2>&1; then
  sqlite3 "$OUT" 'PRAGMA quick_check;'
fi
echo "Backup created: $OUT"
