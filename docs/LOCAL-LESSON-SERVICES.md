# Локальные сервисы рабочего места урока

Страница урока TutorPlace встраивает видеовстречу Jitsi и доску Whitebophir. API приложения выдаёт короткоживущие данные только участнику соответствующего урока:

- `GET /api/lessons/:id/meeting` — `{ domain, roomName, jwt, displayName }`, with a required short-lived Jitsi JWT;
- `GET /api/lessons/:id/whiteboard-token` — `{ url, boardName }`, где `url` содержит JWT с правом только на доску этого урока.

Секреты подписи остаются только в backend-переменных окружения. Клиент не получает секреты сервисов. Запись видеовстреч отключена; если в Jitsi будет добавлена функция записи, её нельзя включать без отдельного продуктового решения и согласия участников.

## Whitebophir

Whitebophir распространяется под лицензией AGPL-3.0. В TutorPlace он запускается отдельным сервисом из официального контейнера и не копируется в исходники приложения. Если локальный образ или сервер Whitebophir будет изменён, сохраняйте уведомление о лицензии и публикуйте исходный код этих изменений в соответствии с AGPL-3.0: [репозиторий и лицензия](https://github.com/lovasoa/whitebophir).

1. Создайте локальный файл переменных:

   ```sh
   cp env.local.example .env.local
   ```

2. Сгенерируйте `WHITEBOPHIR_AUTH_SECRET` командой `openssl rand -hex 32` и внесите значение в `.env.local`. Для backend используйте то же значение как `WHITEBOPHIR_AUTH_SECRET`; не публикуйте файл и не используйте этот локальный секрет на общей среде.

3. Запустите сервис:

   ```sh
   docker compose -f compose.local.yml --env-file .env.local up -d whitebophir
   ```

   Доска будет доступна в браузере по `http://localhost:5001`. Данные досок хранятся в named volume `whitebophir-data`. Для остановки выполните `docker compose -f compose.local.yml --env-file .env.local down`; volume сохраняется.

## Jitsi Meet

Для локальной видеосвязи используйте официальный Docker Compose набор [jitsi/docker-jitsi-meet](https://github.com/jitsi/docker-jitsi-meet) и следуйте его актуальному [руководству по запуску](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/). Локальный профиль приложения ожидает браузерный адрес из `JITSI_DOMAIN` (например, `localhost:8000`) и серверные переменные `JITSI_APP_ID` и `JITSI_APP_SECRET` для выдачи ограниченных JWT. Секрет приложения Jitsi должен совпадать со значением в конфигурации Jitsi.

Для локального профиля оставьте запись отключённой (`ENABLE_RECORDING=0` в Compose-настройках Jitsi). Убедитесь, что служба доступна браузеру с того же компьютера. Browser API выдаёт камера/микрофон в secure context; для локальной разработки браузеры считают `localhost` доверенным origin. На общедоступной среде настройте HTTPS и доступ к медиапортам по официальной инструкции Jitsi.

Переменные адресов имеют клиентскую и серверную стороны: `JITSI_DOMAIN` и `WHITEBOPHIR_URL` должны указывать на адреса, доступные браузеру. API backend подписывает JWT, но не проксирует аудио, видео или события рисования.
