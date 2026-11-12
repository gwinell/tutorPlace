#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p backups
chmod 700 backups

snapshot_id="$(ssh retail-olive sudo /run/current-system/sw/bin/codetogether-backup-id-export)"
[[ "$snapshot_id" =~ ^snapshot-[0-9]{17}-[0-9]+$ ]] || { echo "Remote backup snapshot ID is invalid" >&2; exit 1; }
snapshot_path="backups/$snapshot_id"
temporary_directory="$(mktemp -d "backups/.${snapshot_id}.XXXXXX")"
latest_temporary="backups/.latest-$$"
trap 'rm -rf "$temporary_directory"; rm -f "$latest_temporary"' EXIT

if [ ! -d "$snapshot_path" ]; then
  ssh retail-olive sudo /run/current-system/sw/bin/codetogether-backup-export "$snapshot_id" > "$temporary_directory/database.sqlite"
  ssh retail-olive sudo /run/current-system/sw/bin/codetogether-backup-images-export "$snapshot_id" > "$temporary_directory/assignment-images.tar.gz"
  ssh retail-olive sudo /run/current-system/sw/bin/codetogether-backup-manifest-export "$snapshot_id" > "$temporary_directory/manifest.json"
  node scripts/verify-backup-snapshot.mjs "$temporary_directory" "$snapshot_id"
  mv "$temporary_directory" "$snapshot_path"
else
  node scripts/verify-backup-snapshot.mjs "$snapshot_path" "$snapshot_id"
fi

printf '%s\n' "$snapshot_id" > "$latest_temporary"
mv -f "$latest_temporary" backups/latest
index=0
while IFS= read -r old_snapshot; do
  if (( index >= 2 )) && [ -n "$old_snapshot" ] && [ -d "$old_snapshot" ]; then
    rm -rf -- "$old_snapshot"
  fi
  ((index += 1))
done < <(printf '%s\n' backups/snapshot-*/ | sort -r)
trap - EXIT
rm -rf "$temporary_directory"
echo "Updated the verified database and assignment image snapshot: $snapshot_id"
