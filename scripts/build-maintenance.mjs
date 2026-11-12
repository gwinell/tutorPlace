import { build } from "esbuild";
import { cp, mkdir } from "node:fs/promises";

await mkdir("dist/standalone", { recursive: true });
await build({
  entryPoints: ["scripts/maintenance.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: "dist/standalone/maintenance.mjs",
});

await cp("public", "dist/standalone/public", { recursive: true, force: true });
await cp("drizzle", "dist/standalone/drizzle", { recursive: true, force: true });
await build({
  entryPoints: ["scripts/migrate-sqlite.mjs"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: "dist/standalone/migrate-sqlite.mjs",
});
await cp("scripts/import-d1-export.mjs", "dist/standalone/import-d1-export.mjs");
await cp("scripts/backup-sqlite.mjs", "dist/standalone/backup-sqlite.mjs");
await cp("scripts/qumir-compiler-service.mjs", "dist/standalone/qumir-compiler-service.mjs");
