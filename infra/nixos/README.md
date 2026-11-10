# NixOS deployment

`codetogether.nix` is imported by `/etc/nixos/configuration.nix`. The web process runs as `codetogether` on loopback port 3000; Caddy serves `code-together.ru` and redirects `www` to the apex. SQLite and daily server snapshots live under `/var/lib/codetogether`.

Create `/etc/codetogether/secrets.env` as root with mode `0600`. Supported keys are `ADMIN_LOGIN`, `ADMIN_PASSWORD`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`, and `SALUTEJAZZ_SDK_KEY`. Do not place secret values in Nix expressions or Git.

The deployment account is `codetogether-deploy`; root SSH remains key-only as a recovery path. GitHub Actions requires repository secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`, and `NIXOS_CONFIG_SIGNING_KEY` (an unencrypted OpenSSH Ed25519 key used only to sign the NixOS bundle). Its public key is pinned in `codetogether.nix`. The privileged config deploy command verifies that signature before installing modules and rebuilding NixOS; on failure it restores the previous files and generation.

For the initial setup, import `codetogether.nix` from `/etc/nixos/configuration.nix`, place `qumir.nix` beside it, then run `nixos-rebuild switch` as root. After that, GitHub Actions signs and uploads NixOS module bundles and checks the compiler health endpoint before activating the application release.

Cloudflare Workers Builds may run a preview build for pull requests, but this app's production build is the Node standalone artifact and is deployed to this VPS. The preview trigger therefore builds the app without issuing a second Worker deployment; GitHub Actions is the production deploy path.

The backup timer creates `/var/lib/codetogether/backups/latest.sqlite` daily at 02:00 UTC. The macOS LaunchAgent runs `scripts/pull-backup.sh` at 06:00 local time, checks SQLite integrity, and only then replaces the previous local copy.

Before the DNS move, update the old Cloudflare apex and `www` records to DNS-only A records for `193.111.204.167`. Then change the domain's nameservers to the registrar's DNS and add the same A records there. Keep the old Cloudflare records pointing to the VPS while cached nameserver delegations expire.
