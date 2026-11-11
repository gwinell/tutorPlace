{ config, lib, pkgs, ... }:

let
  appRoot = "/var/lib/codetogether";
  deployUser = "codetogether-deploy";
  nixosSigningPublicKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINTLLVS6qw75xySwdVgnNinUbt5Dg7TGd/OjsNyj2ZuH codetogether-nixos-config-signing";
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
    restore_previous() {
      if [ -n "$old" ]; then
        ln -sfn "$old" "$root/current.next"
        mv -Tf "$root/current.next" "$root/current"
        systemctl restart codetogether-qumir-compiler.service || true
        systemctl restart codetogether.service || true
      fi
    }
    if ! systemctl restart codetogether-qumir-compiler.service; then
      echo "Kumir compiler service failed to restart; rolling back" >&2
      restore_previous
      exit 1
    fi
    compiler_ready=0
    for attempt in $(seq 1 20); do
      if ${pkgs.curl}/bin/curl --fail --silent --max-time 10 http://127.0.0.1:3101/health >/dev/null; then
        compiler_ready=1
        break
      fi
      sleep 1
    done
    if [ "$compiler_ready" -ne 1 ]; then
      echo "Kumir compiler health check failed; rolling back" >&2
      restore_previous
      exit 1
    fi
    if ! systemctl restart codetogether.service; then
      restore_previous
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
    restore_previous
    exit 1
  '';
  configDeployScript = pkgs.writeShellScriptBin "codetogether-config-deploy" ''
    set -euo pipefail
    if [ "$#" -ne 1 ] || ! [[ "$1" =~ ^[0-9a-f]{40}$ ]]; then
      echo "usage: codetogether-config-deploy <40-character-git-sha>" >&2
      exit 64
    fi
    release="$1"
    archive="/tmp/codetogether-nixos-$release.tar.gz"
    signature="$archive.sig"
    [ -f "$archive" ] && [ -f "$signature" ] || { echo "signed NixOS config bundle missing" >&2; exit 66; }
    root="${appRoot}/nixos-backups"
    install -d -m 0700 "$root"
    backup="$root/$release"
    stage="$(${pkgs.coreutils}/bin/mktemp -d /tmp/codetogether-nixos.XXXXXX)"
    install -d -m 0700 "$backup"
    cleanup() {
      rm -rf "$stage"
      rmdir "$backup" 2>/dev/null || true
    }
    trap cleanup EXIT
    printf 'codetogether-nixos %s\n' "${nixosSigningPublicKey}" > "$stage/allowed_signers"
    ${pkgs.openssh}/bin/ssh-keygen -Y verify -f "$stage/allowed_signers" -I codetogether-nixos -n codetogether-nixos -s "$signature" < "$archive"
    tar --no-same-owner --no-same-permissions -xzf "$archive" -C "$stage"
    [ "$(cat "$stage/RELEASE_SHA")" = "$release" ] || { echo "release SHA does not match signed config bundle" >&2; exit 65; }
    for name in codetogether.nix qumir.nix; do
      candidate="$stage/infra/nixos/$name"
      [ -f "$candidate" ] && [ ! -L "$candidate" ] || { echo "missing or invalid $name in signed config bundle" >&2; exit 65; }
      cp "$candidate" "$stage/$name"
    done
    if cmp -s "$stage/codetogether.nix" /etc/nixos/codetogether.nix && cmp -s "$stage/qumir.nix" /etc/nixos/qumir.nix; then
      echo "NixOS configuration unchanged"
      exit 0
    fi
    cp -a /etc/nixos/codetogether.nix "$backup/codetogether.nix"
    cp -a /etc/nixos/qumir.nix "$backup/qumir.nix"
    installed=0
    rollback() {
      status="$?"
      trap - EXIT
      if [ "$status" -ne 0 ] && [ "$installed" -eq 1 ]; then
        install -m 0644 -o root -g root "$backup/codetogether.nix" /etc/nixos/codetogether.nix
        install -m 0644 -o root -g root "$backup/qumir.nix" /etc/nixos/qumir.nix
        nixos-rebuild switch || echo "NixOS config rollback needs manual recovery" >&2
      fi
      rm -rf "$stage"
      rmdir "$backup" 2>/dev/null || true
      exit "$status"
    }
    trap rollback EXIT
    install -m 0644 -o root -g root "$stage/codetogether.nix" /etc/nixos/codetogether.nix.next
    install -m 0644 -o root -g root "$stage/qumir.nix" /etc/nixos/qumir.nix.next
    installed=1
    mv -f /etc/nixos/codetogether.nix.next /etc/nixos/codetogether.nix
    mv -f /etc/nixos/qumir.nix.next /etc/nixos/qumir.nix
    nixos-rebuild switch
    systemctl is-active --quiet codetogether-qumir-compiler.service
    ${pkgs.curl}/bin/curl --fail --silent http://127.0.0.1:3101/health >/dev/null
    rm -f "$archive" "$signature"
    echo "activated NixOS configuration for $release"
  '';
  backupExport = pkgs.writeShellScriptBin "codetogether-backup-export" ''
    set -euo pipefail
    exec ${pkgs.coreutils}/bin/cat ${appRoot}/backups/latest.sqlite
  '';
  r2SecretsDeploy = pkgs.writeShellScriptBin "codetogether-r2-secrets-deploy" ''
    set -euo pipefail
    IFS= read -r account_id
    IFS= read -r access_key_id
    IFS= read -r secret_access_key
    IFS= read -r bucket_name
    if IFS= read -r extra || [ -n "''${extra:-}" ]; then
      echo "expected exactly four R2 secret lines" >&2
      exit 65
    fi
    [[ "$account_id" =~ ^[A-Fa-f0-9]{32}$ ]] || { echo "invalid R2 account ID" >&2; exit 65; }
    [[ "$access_key_id" =~ ^[A-Za-z0-9_-]{8,128}$ ]] || { echo "invalid R2 access key ID" >&2; exit 65; }
    [[ "$secret_access_key" =~ ^[A-Za-z0-9_./+=-]{16,256}$ ]] || { echo "invalid R2 secret access key" >&2; exit 65; }
    [[ "$bucket_name" =~ ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$ ]] || { echo "invalid R2 bucket name" >&2; exit 65; }
    file="$(mktemp /etc/codetogether/r2.env.XXXXXX)"
    trap 'rm -f "$file"' EXIT
    printf 'R2_ACCOUNT_ID=%s\nR2_ACCESS_KEY_ID=%s\nR2_SECRET_ACCESS_KEY=%s\nR2_BUCKET_NAME=%s\n' \
      "$account_id" "$access_key_id" "$secret_access_key" "$bucket_name" > "$file"
    chown root:root "$file"
    chmod 0600 "$file"
    mv -f "$file" /etc/codetogether/r2.env
    trap - EXIT
    systemctl restart codetogether.service
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
      EnvironmentFile = [ "-/etc/codetogether/secrets.env" "-/etc/codetogether/r2.env" ];
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
        "PATH=${pkgs.llvmPackages_20.lld}/bin"
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
      EnvironmentFile = [ "-/etc/codetogether/secrets.env" "-/etc/codetogether/r2.env" ];
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
    { users = [ deployUser ]; commands = [ { command = "${configDeployScript}/bin/codetogether-config-deploy"; options = [ "NOPASSWD" ]; } ]; }
    { users = [ deployUser ]; commands = [ { command = "${deployScript}/bin/codetogether-deploy"; options = [ "NOPASSWD" ]; } ]; }
    { users = [ deployUser ]; commands = [ { command = "${backupExport}/bin/codetogether-backup-export"; options = [ "NOPASSWD" ]; } ]; }
    { users = [ deployUser ]; commands = [ { command = "${r2SecretsDeploy}/bin/codetogether-r2-secrets-deploy"; options = [ "NOPASSWD" ]; } ]; }
  ];
  environment.systemPackages = [ configDeployScript deployScript backupExport r2SecretsDeploy pkgs.nodejs_22 pkgs.curl pkgs.sqlite ];
}
