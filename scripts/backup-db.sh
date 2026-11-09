#!/bin/bash
# Бэкап базы codeTogether в папку backups/ (она исключена из git).
#
#   npm run backup          — локальная база разработки (работает сразу)
#   npm run backup:remote   — облачная D1 (сначала один раз: npx wrangler login)
#
# Для облачной базы имя можно переопределить: DB_NAME=моя-база npm run backup:remote
set -euo pipefail
cd "$(dirname "$0")/.."

MODE="${1:-local}"
DB_NAME="${DB_NAME:-codetogether}"
mkdir -p backups
WRANGLER=(node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js)

if [ "$MODE" = "remote" ]; then
  OUT="backups/codetogether-remote-$(date +%Y%m%d-%H%M).sql"
  "${WRANGLER[@]}" d1 export "$DB_NAME" --remote --output "$OUT" --skip-confirmation
else
  # Локальная база miniflare — просто копируем файл SQLite.
  DB_FILE=$(ls -t .wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite 2>/dev/null | head -1)
  [ -n "$DB_FILE" ] || { echo "Локальная база не найдена: сначала запустите npm run dev один раз"; exit 1; }
  OUT="backups/codetogether-local-$(date +%Y%m%d-%H%M).sqlite"
  cp "$DB_FILE" "$OUT"
  # Проверка: файл должен быть читаемой базой с таблицами.
  if command -v sqlite3 >/dev/null 2>&1; then
    TABLES=$(sqlite3 "$OUT" "SELECT count(*) FROM sqlite_master WHERE type='table'")
    echo "Таблиц в копии: $TABLES"
  fi
fi

echo "Готово: $OUT ($(du -h "$OUT" | cut -f1))"
