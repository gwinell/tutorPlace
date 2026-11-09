# codeTogether — запуск и подключение

React 19, TypeScript, Vinext, Cloudflare Worker/D1, Yjs, Pyodide и Fengari.

## Локальный запуск

Из каталога codetogether:

    npm install
    npm run build

Применить локальные миграции один раз:

    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_simple_sleepwalker.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_outgoing_quentin_quire.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_yummy_lockheed.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0003_booking_recovery.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0004_course_and_personal_assignments.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0005_recover_stale_operations.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0006_trial_privacy_consent.sql
    node --import ./scripts/sites-env.mjs node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0007_flimsy_gladiator.sql
    npm run dev -- --port 5173

Адрес: http://127.0.0.1:5173/. Локальная D1 хранится отдельно от production-базы.

## Публикация в Cloudflare

Приложение публикуется как **Cloudflare Worker**. Ему нужны серверные API и D1, поэтому Cloudflare Pages для статических файлов не подходит. Репозиторий подготовлен к [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) с GitHub.

### Подключить GitHub и домен

1. В Cloudflare добавь `code-together.ru` как активную зону. Если домен ещё не использует Cloudflare DNS, у регистратора укажи nameservers из панели Cloudflare. Перед подключением проверь записи домена: [Workers Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) не подключается поверх существующего CNAME на этом имени.
2. Создай в Cloudflare D1 базу данных с именем `codetogether` и скопируй её ID. База должна быть в том же аккаунте и активной зоне Cloudflare; для ученических данных выбери регион ЕС. До подключения автодеплоя войди локально через `npx wrangler login`, собери приложение с этими значениями и примени миграции:

       CLOUDFLARE_D1_DATABASE_ID=<ID-базы> CLOUDFLARE_D1_DATABASE_NAME=codetogether CLOUDFLARE_CUSTOM_DOMAIN=code-together.ru npm run build
       npm run db:migrate:remote
       npm run deploy:cloudflare

   [D1 migrations](https://developers.cloudflare.com/d1/reference/migrations/) создадут схему приложения и историю миграций в новой пустой базе. Повторно применять те же миграции вручную не нужно.

3. В Workers & Pages подключи приватный GitHub-репозиторий `gwinell/codeTogether`, ветка `main`, корневой каталог `/`. Разреши Cloudflare GitHub App читать репозиторий. Имя Worker должно быть `codetogether`. Custom Domain `code-together.ru` сначала создаётся единственным ручным Wrangler deploy из шага 2.
4. В настройках сборки укажи:

   - Build command: `npm run build`
   - Deploy command: `npm run deploy:cloudflare`
   - Node.js: 22 (`.nvmrc` уже закрепляет эту основную версию);
   - Build variable `CLOUDFLARE_D1_DATABASE_ID` — ID созданной D1 базы;
   - Build variable `CLOUDFLARE_D1_DATABASE_NAME` — `codetogether`;

   Эти значения нужны во время сборки, не добавляй их в GitHub. Не добавляй `CLOUDFLARE_CUSTOM_DOMAIN` в настройки Workers Builds: домен уже связан с Worker и управляется в его разделе **Settings → Domains & Routes**. Тогда автоматический deploy сможет обновлять код без повторного изменения привязки домена и прав на зону. ID D1 не является паролем, но задавай его в панели Cloudflare, чтобы конфигурация Worker всегда ссылалась на нужную базу.

5. До первого production deployment в настройках Worker открой **Settings → Variables and Secrets** и добавь серверные секреты из списка ниже. Затем запусти Cloudflare Build или выполни `npm run deploy:cloudflare` локально. Для локальной публикации сначала задай build variables и выполни `npm run build`.

Для публикации из GitHub Cloudflare Builds использует тот же Wrangler, что закреплён в `package.json`. Не включай Preview deployments с production D1. Для previews создай отдельную D1 базу и задай preview build variables отдельно.

### Секреты Worker

Добавь значения как **Secrets**, не как build variables и не в GitHub:

- `ADMIN_LOGIN` и `ADMIN_PASSWORD` — для первого входа репетитора; после первого успешного входа `ADMIN_PASSWORD` можно удалить;
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` — для пробной записи и синхронизации уроков;
- `SALUTEJAZZ_SDK_KEY` — если нужна отдельная автоматически создаваемая видеокомната для каждого нового урока;
   - Дополнительный сервис запуска кода не требуется: проверку кодовых заданий выполняет репетитор вручную.

Значения для локальной разработки можно скопировать из `.dev.vars.example` в `.dev.vars`. Настоящие `.dev.vars` и `.env` уже исключены из Git.

Демонстрации: /?demo=student и /?demo=teacher. Примеры явно помечены, сохраняются только в браузере, не создают настоящие аккаунты или события календаря. Две роли в двух вкладках одного браузера могут проверить общий код. Кнопка «Сбросить» восстанавливает примеры.

## Настоящие учётные записи

В исходниках нет встроенного пароля администратора. Задать серверные секреты ADMIN_LOGIN и ADMIN_PASSWORD (длинный уникальный пароль). При первом успешном входе создаётся репетитор. Далее проверяется хеш в базе; после этого ADMIN_PASSWORD можно удалить из окружения.

Локальные секреты — в неотслеживаемом файле .dev.vars; после изменения перезапустить сервер. Секреты Cloudflare Worker добавляются через Settings → Variables and Secrets. Не добавлять значения в исходники, build variables, GitHub или .openai/hosting.json.

Аккаунты учеников создаёт репетитор: обязательны имя, возраст и имя родителя; контакты необязательны. Пароли хешируются PBKDF2-SHA256 с солью. Сессии серверные, HttpOnly, SameSite=Strict; проверка роли и Origin на сервере, ограничение попыток входа. Изменение пароля отзывает сессии ученика.

## Google Календарь

Серверные секреты:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REFRESH_TOKEN
- GOOGLE_CALENDAR_ID (ID календаря или primary).

В Google Cloud включить Calendar API, создать OAuth client, получить согласие своего аккаунта с `access_type=offline` на минимальные scopes `https://www.googleapis.com/auth/calendar.events.owned` (создание и изменение событий в календаре, куда добавляются уроки), `https://www.googleapis.com/auth/calendar.events.freebusy` (проверка занятости выбранных календарей) и `https://www.googleapis.com/auth/calendar.calendarlist.readonly` (показ названий календарей в настройках). Если OAuth уже был подключён, повторно выдай согласие с этими разрешениями и замени серверный `GOOGLE_REFRESH_TOKEN`. Хранить refresh token только в секретах Worker. Для внешнего OAuth-приложения в статусе Testing refresh token истекает через 7 дней; перед постоянной работой проверь правила публикации приложения и срок действия токена.

[Официальный OAuth offline flow](https://developers.google.com/identity/protocols/oauth2/web-server#offline), [Calendar freeBusy](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query), [Calendar events](https://developers.google.com/workspace/calendar/api/v3/reference/events).

В кабинете репетитора задаются отдельные интервалы по каждому дню недели и разовые исключения по датам. В настройках выбирается календарь «Работа» (или другой доступный календарь); его занятые интервалы объединяются с календарём, куда сайт записывает уроки. Уроки создаются только при совпадении с расписанием и отсутствии конфликтов во всех выбранных календарях. Часовой пояс — Москва. Демонстрационные окна отделены от реальных.

### SaluteJazz

Чтобы новые бронирования автоматически получали видеокомнату, создай проект SaluteJazz SDK и выпусти SDK key в [SaluteJazz Studio](https://developers.sber.ru/docs/ru/jazz/sdk/sdk-key). Ключ содержит приватный ключ подписи: храни его только в серверных секретах.

- Локально добавь `SALUTEJAZZ_SDK_KEY` в `.dev.vars` и перезапусти Worker.
- В Cloudflare Workers открой **Settings → Variables and Secrets → Add → Secret** и задай `SALUTEJAZZ_SDK_KEY`. Через Wrangler после `npm run build` можно выполнить `npx wrangler secret put SALUTEJAZZ_SDK_KEY --config dist/server/wrangler.json`.

Worker подписывает краткоживущий транспортный JWT, получает access token и создаёт комнату SaluteJazz. Ссылка записывается в урок и в поле места события Google Calendar. Если секрет не задан, сохраняется прежняя общая ссылка из расписания. Комнаты отключаются при отмене или завершении урока; фоновая задача повторяет очистку после временных ошибок и закрывает комнаты завершившихся уроков.

Доступное число параллельных конференций зависит от лицензии и тарифа SaluteJazz; учитывай его при выборе SDK-проекта.

После добавления секрета проверь статус **SaluteJazz** во вкладке настроек кабинета репетитора и создай тестовую запись. Новая ссылка появится только у новых бронирований. Существующие уроки не меняются.

Официальные инструкции: [выпуск SDK key](https://developers.sber.ru/docs/ru/jazz/sdk/sdk-key), [авторизация API](https://developers.sber.ru/docs/ru/jazz/api/authorization), [создание комнаты](https://developers.sber.ru/docs/ru/jazz/api/reference/create-room), [отключение комнаты](https://developers.sber.ru/docs/ru/jazz/api/reference/disable-room).

Бронирование проверяет рабочие часы, Google freeBusy и внутренние записи; атомарно резервирует в D1 все 5-минутные участки урока; создаёт событие Google с детерминированным ID, затем подтверждает запись. При однозначной ошибке резерв снимается. При неопределённом результате внешнего запроса время удерживается до проверки репетитором, чтобы не допустить двойную запись.

Пробная запись приводит телефон к единому формату и проверяет дубли при резервировании слота. На один IP допускается до трёх попыток с корректно заполненными полями за час.

Перенос проверяет исходный урок (минимум 2 часа до начала), исключает его событие при проверке нового окна и резервирует новое время. После тайм-аута сервер сверяет событие по ID. Если сверка недоступна, оба окна остаются зарезервированными и в расписании появляется кнопка «Проверить перенос». Отмена удаляет событие и освобождает окно.

Первые 3 отмены оплаченных уроков за календарный месяц Москвы не списываются, четвёртая и следующие списывают занятие. Пробные уроки не входят в счётчик. Перед подтверждением видно списание, сервер проверяет условие повторно. Параллельные отмены одного ученика сериализуются.

Обычный урок списывается при отметке репетитора «Завершить урок». Будущие уроки резервируют доступный баланс. Онлайн-платежей нет.

Google Calendar и D1 не имеют общей транзакции. Фоновая задача сверяет незавершённые операции по ID события каждые пять минут. Прямые правки в Google учитываются в занятости новых окон, но не импортируются автоматически в существующие карточки уроков.

Настоящие события при разработке не создавались: доступ к календарю и ваше рабочее расписание не настроены.

## Курсы, домашние задания и проверка

Миграция переносит существующие темы в курс «Путь в Python», сохраняет их порядок и превращает старые доступы к темам в зачисление учеников на курс. Доступ к каждой теме при этом остаётся отдельным. Новые курсы и списки учеников управляются в кабинете репетитора; порядок тем можно менять кнопками перемещения.

Домашнее задание можно привязать к теме курса либо назначить одному ученику отдельно. У личного задания привязка к его уроку необязательна. Сервер отдаёт ученику только доступные темы и его собственные личные задания.

Код ученик запускает в браузере и отправляет репетитору. Каждая отправка получает статус «ожидает проверки» и появляется во вкладке «На проверку» с бейджем числа ожидающих работ. Репетитор принимает работу или возвращает её с комментарием; после доработки ученик отправляет новую версию. История отправок остаётся в результатах. Квиз проверяется автоматически, текстовый ответ проверяет репетитор. Judge0 и скрытые тесты сейчас не используются.

## Комнаты и материалы

Yjs объединяет одновременные правки; D1 синхронизируется примерно раз в 1,2 секунды. Файл ученика редактируют оба участника, файл репетитора — только репетитор. Сервер проверяет права отдельно от интерфейса.

Python 0.27.7 Pyodide и Lua 0.1.5 Fengari выполняются в Web Worker внутри iframe с непрозрачным origin; allow-same-origin не используется. Есть вывод, ввод, остановка, лимит 10 секунд выполнения и 100 000 символов вывода. Первая загрузка Python требует доступа к cdn.jsdelivr.net. Это учебная консоль, не графическое окно Pygame. Ввод возобновляет программу повторным выполнением с накопленными строками; программы с внешними побочными эффектами могут повторить их.

После 30 минут бездействия комната удаляется плановой задачей Worker (каждые пять минут); обращение к API также удаляет истёкшие комнаты. Истёкшие сессии удаляются той же задачей.

Markdown не исполняет HTML. Jupyter показывает Markdown, код и текстовые результаты; HTML и JavaScript блокнота не исполняются. Кнопка Google Colab использует заданную прямую ссылку; если её нет — скачивает .ipynb и открывает Colab, где файл нужно загрузить.

## Проверки

    npx tsc --noEmit
    node --experimental-strip-types --test tests/domain.test.ts tests/collaboration.test.ts
    node scripts/test-integration.mjs
    npm run build

Интеграционные тесты требуют работающего localhost и применённых миграций; создают временные записи в локальной D1 и удаляют только свои фикстуры в finally. Проверяют авторизацию, CSRF, курсы, доступы, порядок тем, личные задания, очередь ручной проверки, материалы, квизы, уведомления, совместное редактирование и TTL комнат. Не используют реальный Google Календарь или внешний сервис запуска кода.

## Портрет

Исходник ../photoOfTutor.JPG не изменён. Фон удалён встроенным imagegen с сохранением внешности и позы. Подготовленные варианты: public/tutor.png и public/tutor.webp. WebP перекодирован через Sharp без дополнительной ретуши. Промпт — docs/portrait-prompt.txt. MIT-лицензия Fengari — public/fengari.LICENSE.

## Перед открытием для учеников

Перед приглашением учеников проверь в Cloudflare, что production D1 создана в выбранном регионе ЕС; preview использует отдельную базу. Настрой секреты Worker, Google OAuth, рабочие часы, ссылки на созвоны и домен. Проверь запись/перенос/отмену реальными тестовыми событиями, включая правила списания, затем удали тестовые записи. Открой `/privacy` и добавь подходящий публичный канал связи для запросов об исправлении или удалении данных. Согласие на пробную запись сохраняется вместе с датой и версией политики. Создай резервную копию production D1 и проверь восстановление в отдельной тестовой базе до миграций или запуска учеников.

Плановая задача Worker запускается каждые пять минут. Она удаляет истёкшие комнаты и сессии и сверяет старые незавершённые бронирования, переносы, отмены и завершения уроков. При недоступности Google или неоднозначном состоянии урок остаётся удержанным для повторной сверки, а ошибка записывается в логи Worker. Перед открытием проверь триггер в конфигурации Worker и ошибки в логах.

Для миграций production сначала сделай `npm run backup:remote`, убедись, что копия создана, затем применяй миграции через `npm run db:migrate:remote`. Не направляй Preview на production D1.

Локальную сборку Fengari можно воспроизвести командой node scripts/build-lua.mjs. Автоматическая проверка реального Lua worker, включая ввод, — tests/runtime.test.mjs.
