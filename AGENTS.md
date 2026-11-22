# Правила работы агентов

## Проверки и публикация через GitHub Actions

- Исходный код изменяй в отдельной ветке и отправляй через Pull Request. Проверки, сборку и публикацию выполняй workflow-ами GitHub Actions; не считай локальный запуск проверок подтверждением результата CI.
- Для Pull Request используй `.github/workflows/verify.yml`. Не добавляй в этот workflow production secrets, SSH-ключи, доступ к VPS или другие привилегированные операции.
- Production публикуется на VPS workflow-ом `.github/workflows/deploy-vps.yml` после push в `main` или ручного запуска на `main`. Не публикуй приложение напрямую с рабочей машины: не подключайся к VPS вручную, не запускай там `rsync`, `scp`, `systemctl`, NixOS rebuild или команды провайдера.
- Изменения только в `.github/workflows/**` намеренно не запускают автоматический production deploy. Не сообщай, что приложение опубликовано, пока Actions не подтвердит успешный деплой; проверяй, что workflow выполнился на актуальном commit `main`.
- После деплоя проверь в Actions результат проверки сайта снаружи и здоровье приложения. При недоступности сначала запусти `.github/workflows/diagnose-vps.yml` вручную на `main`; не перезапускай сервисы, пока результаты не показывают проблему внутри VPS.

## Секреты и привилегированные workflow

- Никогда не используй secrets в workflow, запущенном на `pull_request` или `pull_request_target`. Условия `if` не делают такой job безопасным: PR может изменить сам workflow и его условия. Оставляй PR-проверки в отдельном workflow без секретов.
- Jobs с доступом к VPS или production secrets запускай только из доверенного `main`. Для ручного workflow требуй одновременно `workflow_dispatch` и `github.ref == 'refs/heads/main'`; не запускай его с PR или произвольной ветки.
- Передавай workflow только необходимые secrets через `env`, не печатай их и не включай shell tracing (`set -x`). Сохраняй проверку SSH host key (`StrictHostKeyChecking=yes`).
- Диагностика должна только читать состояние. Не используй в ней `sudo`, перезапуск или изменение конфигурации. Избегай вывода персональных данных, содержимого env-файлов, токенов и полных журналов.
- Для новых Actions задай минимальные `permissions`. Не исполняй код или скачанные артефакты из PR в job, который имеет production secrets.

## Вывод об инцидентах

- Разделяй проверки на VPS и из внешней сети: локальные health endpoints, состояние сервисов и публичные HTTPS-проверки показывают разные части пути.
- Если сайт отвечает из GitHub Actions, но не из рабочей среды, не называй VPS неисправным без дополнительных данных. Укажи источник, время и конкретный этап сбоя (DNS, соединение, TLS или HTTP) и обозначь, что остаётся неподтверждённым.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
