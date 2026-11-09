import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const build = spawnSync(npm, ["run", "build:framework"], { stdio: "inherit" });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const runtime = spawnSync(process.execPath, [fileURLToPath(new URL("./build-maintenance.mjs", import.meta.url))], { stdio: "inherit" });
if (runtime.error) throw runtime.error;
process.exit(runtime.status ?? 1);
