import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("../", import.meta.url));
export const outputConfigPath = path.join(projectRoot, "dist/server/wrangler.json");

export function readCloudflareConfig() {
  if (!existsSync(outputConfigPath)) {
    throw new Error("Сначала собери приложение командой npm run build.");
  }

  const config = JSON.parse(readFileSync(outputConfigPath, "utf8"));
  const database = config.d1_databases?.find((binding) => binding.binding === "DB");

  if (!database || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(database.database_id)) {
    throw new Error(
      "В сборке нет реального ID D1. Задай CLOUDFLARE_D1_DATABASE_ID при сборке и повтори npm run build.",
    );
  }

  const migrationsPath = path.resolve(path.dirname(outputConfigPath), database.migrations_dir);
  if (!existsSync(migrationsPath)) {
    throw new Error(`Не найдена папка миграций D1: ${migrationsPath}`);
  }

  return { config, database };
}
