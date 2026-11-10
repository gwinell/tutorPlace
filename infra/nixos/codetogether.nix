{ config, lib, pkgs, ... }:

let
  appRoot = "/var/lib/codetogether";
  deployUser = "codetogether-deploy";
  qumirCompiler = pkgs.callPackage ./qumir.nix { };
  deployScript = pkgs.writeShellScriptBin "codetogether-deploy" ''
    set -euo pipefail
    if [ "$#" -ne 1 ] || ! [[ "$1" =~ ^[0-9a-f]{40}$ ]]; then
      echo "usage: codetogether-deploy <40-character-git-sha>" >&2
      exit 64
    fi
    release="$1"
    archive="/tmp/codetogether-$release.tar.gz"
    [ -f "$archive" ] || { echo "release archive missing" >&2; exit 66; }
    root="${appRoot}"
    target="$root/releases/$release"
    install -d -m 0750 -o root -g codetogether "$target"
    tar --no-same-owner --no-same-permissions -xzf "$archive" -C "$target"
    chown -R root:codetogether "$target"
    chmod -R u=rwX,g=rX,o= "$target"
    old="$(readlink -f "$root/current" 2>/dev/null || true)"
    ln -sfn "$target" "$root/current.next"
    mv -Tf "$root/current.next" "$root/current"
    if ! systemctl restart codetogether.service; then
      if [ -n "$old" ]; then ln -sfn "$old" "$root/current.next"; mv -Tf "$root/current.next" "$root/current"; systemctl restart codetogether.service; fi
      exit 1
    fi
    for attempt in $(seq 1 20); do
      if ${pkgs.curl}/bin/curl --fail --silent http://127.0.0.1:3000/api/health >/dev/null; then
        find "$root/releases" -mindepth 1 -maxdepth 1 -type d ! -path "$target" ! -path "$old" -exec rm -rf -- {} +
        rm -f "$archive"
        echo "deployed $release"
        exit 0
      fi
      sleep 1
    done
    echo "health check failed; rolling back" >&2
    if [ -n "$old" ]; then ln -sfn "$old" "$root/current.next"; mv -Tf "$root/current.next" "$root/current"; systemctl restart codetogether.service; fi
    exit 1
  '';
  backupExport = pkgs.writeShellScriptBin "codetogether-backup-export" ''
    set -euo pipefail
    exec ${pkgs.coreutils}/bin/cat ${appRoot}/backups/latest.sqlite
  '';
in
{
  users.groups.codetogether = {};
  users.groups.codetogether-backup = {};
  users.users.codetogether = {
    isSystemUser = true;
    group = "codetogether";
    home = appRoot;
    createHome = false;
    shell = pkgs.bash;
  };
  users.users.${deployUser} = {
    isNormalUser = true;
    group = "users";
    extraGroups = [ "codetogether-backup" ];
    home = "/var/lib/${deployUser}";
    createHome = true;
    openssh.authorizedKeys.keys = [
      "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGjNm/VQGgTsTMhahF+6VkM9vTeg3OtEUVVefH9SMj5j codetogether-github-actions"
    ];
  };

  systemd.tmpfiles.rules = [
    "d ${appRoot} 0750 root codetogether -"
    "d ${appRoot}/releases 0750 root codetogether -"
    "d ${appRoot}/data 0700 codetogether codetogether -"
    "d ${appRoot}/backups 2750 codetogether codetogether-backup -"
    "d /etc/codetogether 0700 root root -"
  ];

  services.caddy = {
    enable = true;
    virtualHosts."code-together.ru".extraConfig = ''
      encode zstd gzip
      reverse_proxy 127.0.0.1:3000
    '';
    virtualHosts."www.code-together.ru".extraConfig = ''
      redir https://code-together.ru{uri} permanent
    '';
  };

  networking.firewall.allowedTCPPorts = [ 80 443 ];
  services.openssh.settings = {
    PasswordAuthentication = lib.mkForce false;
    PermitRootLogin = lib.mkForce "prohibit-password";
  };

  systemd.services.codetogether = {
    description = "codeTogether Node.js web application";
    wantedBy = [ "multi-user.target" ];
    wants = [ "network-online.target" ];
    requires = [ "codetogether-qumir-compiler.service" ];
    after = [ "network-online.target" "codetogether-qumir-compiler.service" ];
    serviceConfig = {
      User = "codetogether";
      Group = "codetogether";
      WorkingDirectory = "${appRoot}/current";
      Environment = [
        "HOST=127.0.0.1"
        "PORT=3000"
        "DATABASE_PATH=${appRoot}/data/codetogether.sqlite"
        "BACKUP_DIRECTORY=${appRoot}/backups"
        "QUMIR_COMPILER_URL=http://127.0.0.1:3101"
        "NODE_OPTIONS=--disable-warning=ExperimentalWarning"
      ];
      EnvironmentFile = "-/etc/codetogether/secrets.env";
      ExecStartPre = "${pkgs.nodejs_22}/bin/node ${appRoot}/current/migrate-sqlite.mjs";
      ExecStart = "${pkgs.nodejs_22}/bin/node ${appRoot}/current/server.js";
      Restart = "always";
      RestartSec = 3;
      NoNewPrivileges = true;
      ProtectSystem = "strict";
      ProtectHome = true;
      ReadWritePaths = [ "${appRoot}/data" "${appRoot}/backups" ];
    };
  };

  systemd.services.codetogether-qumir-compiler = {
    description = "Isolated codeTogether Kumir compiler";
    wantedBy = [ "multi-user.target" ];
    serviceConfig = {
      User = "codetogether";
      Group = "codetogether";
      WorkingDirectory = "${appRoot}/current";
      Environment = [
        "QUMIR_COMPILER_HOST=127.0.0.1"
        "QUMIR_COMPILER_PORT=3101"
        "QUMIRC_PATH=${qumirCompiler}/bin/qumirc"
        "PRLIMIT_PATH=${pkgs.util-linux}/bin/prlimit"
      ];
      ExecStart = "${pkgs.nodejs_22}/bin/node ${appRoot}/current/qumir-compiler-service.mjs";
      Restart = "always";
      RestartSec = 3;
      NoNewPrivileges = true;
      PrivateTmp = true;
      PrivateDevices = true;
      ProtectSystem = "strict";
      ProtectHome = true;
      ReadWritePaths = [ "/tmp" ];
      MemoryMax = "1G";
      MemorySwapMax = 0;
      CPUQuota = "30%";
      TasksMax = 24;
      LimitNOFILE = 64;
      Nice = 10;
    };
  };

  systemd.services.codetogether-maintenance = {
    description = "Recover stale codeTogether booking operations";
    serviceConfig = {
      Type = "oneshot";
      User = "codetogether";
      Group = "codetogether";
      WorkingDirectory = "${appRoot}/current";
      Environment = [ "DATABASE_PATH=${appRoot}/data/codetogether.sqlite" ];
      EnvironmentFile = "-/etc/codetogether/secrets.env";
      ExecStart = "${pkgs.nodejs_22}/bin/node ${appRoot}/current/maintenance.mjs";
      NoNewPrivileges = true;
      ProtectSystem = "strict";
      ProtectHome = true;
      ReadWritePaths = [ "${appRoot}/data" ];
    };
  };
  systemd.timers.codetogether-maintenance = {
    wantedBy = [ "timers.target" ];
    timerConfig = { OnBootSec = "2min"; OnUnitActiveSec = "5min"; Unit = "codetogether-maintenance.service"; };
  };

  systemd.services.codetogether-backup = {
    description = "Create and verify the daily codeTogether SQLite snapshot";
    serviceConfig = {
      Type = "oneshot";
      User = "codetogether";
      Group = "codetogether";
      WorkingDirectory = "${appRoot}/current";
      Environment = [
        "DATABASE_PATH=${appRoot}/data/codetogether.sqlite"
        "BACKUP_DIRECTORY=${appRoot}/backups"
      ];
      ExecStart = "${pkgs.nodejs_22}/bin/node ${appRoot}/current/backup-sqlite.mjs";
      NoNewPrivileges = true;
      ProtectSystem = "strict";
      ProtectHome = true;
      ReadWritePaths = [ "${appRoot}/backups" ];
    };
  };
  systemd.timers.codetogether-backup = {
    wantedBy = [ "timers.target" ];
    timerConfig = { OnCalendar = "*-*-* 02:00:00 UTC"; Persistent = true; Unit = "codetogether-backup.service"; };
  };

  security.sudo.extraRules = [
    { users = [ deployUser ]; commands = [ { command = "${deployScript}/bin/codetogether-deploy"; options = [ "NOPASSWD" ]; } ]; }
    { users = [ deployUser ]; commands = [ { command = "${backupExport}/bin/codetogether-backup-export"; options = [ "NOPASSWD" ]; } ]; }
  ];
  environment.systemPackages = [ deployScript backupExport pkgs.nodejs_22 pkgs.curl pkgs.sqlite ];
}
