import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { readExecutionProfile } from "./scripts/execution-profile.mjs";
import { configureToolEnvironment } from "./scripts/tool-environment.mjs";
import { sites } from "./scripts/vite/sites-vite-plugin";
import { connectorPreview } from "./scripts/vite/connector-preview-plugin.mjs";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";
const cloudflareDatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim();
const cloudflareDatabaseName =
  process.env.CLOUDFLARE_D1_DATABASE_NAME?.trim() || "codetogether";
const cloudflareCustomDomain = process.env.CLOUDFLARE_CUSTOM_DOMAIN?.trim();

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";
const managedLinux = readExecutionProfile() === "managed-linux";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  workers_dev: false,
  preview_urls: false,
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: cloudflareDatabaseName,
          database_id: cloudflareDatabaseId || SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
          migrations_dir: "../../drizzle",
        },
      ]
    : [],
  routes: cloudflareCustomDomain
    ? [{ pattern: cloudflareCustomDomain, custom_domain: true }]
    : [],
  triggers: { crons: ["*/5 * * * *"] },
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async ({ command }) => {
  configureToolEnvironment(process.cwd());

  // Keep the Workers adapter for local preview only. Production is a standalone
  // Node.js server and has no Cloudflare bindings.
  const cloudflare = command === "serve"
    ? (await import("@cloudflare/vite-plugin")).cloudflare
    : undefined;

  return {
    server: {
      ...(managedLinux
        ? { host: "0.0.0.0", allowedHosts: ["terminal.local"] }
        : {}),
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites({ mockAuth: !managedLinux }),
      ...(command === "serve" ? [connectorPreview()] : []),
      ...(cloudflare ? [cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: {
          ...localBindingConfig,
          ...(command === "serve"
            ? {
                services: [
                  {
                    binding: "CONNECTORS",
                    service: "sites-connector-preview",
                    entrypoint: "ConnectorPreview",
                  },
                ],
              }
            : {}),
        },
        ...(command === "serve"
          ? {
              auxiliaryWorkers: [
                {
                  config: {
                    name: "sites-connector-preview",
                    main: "./scripts/connector-preview/worker.mjs",
                    compatibility_date: "2026-05-15",
                  },
                },
              ],
            }
          : {}),
      })] : []),
    ],
  };
});
