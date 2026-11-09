#!/bin/bash
set -euo pipefail

case "$(uname -s)" in
  Darwin) ;;
  *) echo "This installer is for macOS launchd." >&2; exit 1 ;;
esac

script="$(cd "$(dirname "$0")" && pwd)/pull-backup.sh"
agent="$HOME/Library/LaunchAgents/com.codetogether.backup.plist"
uid="$(id -u)"
mkdir -p "$(dirname "$agent")"

cat > "$agent" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.codetogether.backup</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$script</string></array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>6</integer><key>Minute</key><integer>0</integer></dict>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>/tmp/codetogether-backup.log</string>
  <key>StandardErrorPath</key><string>/tmp/codetogether-backup.log</string>
</dict>
</plist>
PLIST
chmod 600 "$agent"

launchctl bootout "gui/$uid/com.codetogether.backup" 2>/dev/null || true
launchctl bootstrap "gui/$uid" "$agent"
launchctl enable "gui/$uid/com.codetogether.backup"
echo "Installed daily 06:00 backup pull: $agent"
