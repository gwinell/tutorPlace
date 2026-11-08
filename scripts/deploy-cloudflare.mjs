import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { outputConfigPath, projectRoot, readCloudflareConfig } from "./cloudflare-config.mjs";

readCloudflareConfig();

const wrangler = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
const result = spawnSync(
  process.execPath,
  [wrangler, "deploy", "--config", path.relative(projectRoot, outputConfigPath)],
  { cwd: projectRoot, env: process.env, stdio: "inherit" },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
