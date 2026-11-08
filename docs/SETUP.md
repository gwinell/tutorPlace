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
- `JUDGE0_URL`, `JUDGE0_TOKEN`, `JUDGE0_PYTHON_LANGUAGE_ID` — если включаешь автопроверку кода.

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

В Google Cloud включить Calendar API, создать OAuth client, получить согласие своего аккаунта с access_type=offline на scopes https://www.googleapis.com/auth/calendar.events и https://www.googleapis.com/auth/calendar.events.freebusy. Сохранить refresh token только на сервере. Настроить статус и доступ OAuth-приложения, чтобы токен не истёк после тестового периода.

[Официальный OAuth offline flow](https://developers.google.com/identity/protocols/oauth2/web-server#offline), [Calendar freeBusy](https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query), [Calendar events](https://developers.google.com/workspace/calendar/api/v3/reference/events).

В кабинете репетитора выбрать рабочие дни и часы по Москве, добавить ссылку на созвоны. Пока календарь или рабочие часы не настроены, реальные окна не показываются. Демонстрационные окна отделены от реальных.

Бронирование проверяет рабочие часы, Google freeBusy и внутренние записи; атомарно резервирует в D1 все 5-минутные участки урока; создаёт событие Google с детерминированным ID, затем подтверждает запись. При однозначной ошибке резерв снимается. При неопределённом результате внешнего запроса время удерживается до проверки репетитором, чтобы не допустить двойную запись.

Пробная запись приводит телефон к единому формату и проверяет дубли при резервировании слота. На один IP допускается до трёх попыток с корректно заполненными полями за час.

Перенос проверяет исходный урок (минимум 2 часа до начала), исключает его событие при проверке нового окна и резервирует новое время. После тайм-аута сервер сверяет событие по ID. Если сверка недоступна, оба окна остаются зарезервированными и в расписании появляется кнопка «Проверить перенос». Отмена удаляет событие и освобождает окно.

Первые 3 отмены оплаченных уроков за календарный месяц Москвы не списываются, четвёртая и следующие списывают занятие. Пробные уроки не входят в счётчик. Перед подтверждением видно списание, сервер проверяет условие повторно. Параллельные отмены одного ученика сериализуются.

Обычный урок списывается при отметке репетитора «Завершить урок». Будущие уроки резервируют доступный баланс. Онлайн-платежей нет.

Google Calendar и D1 не имеют общей транзакции. После аварийного прерывания между внешним запросом и записью в D1 нужна сверка по ID события; фоновый reconciler пока не настроен. Прямые правки в Google учитываются в занятости новых окон, но не импортируются автоматически в существующие карточки уроков.

Настоящие события при разработке не создавались: доступ к календарю и ваше рабочее расписание не настроены.

## Скрытые автотесты

Текстовые работы принимает репетитор, квизы проверяются сервером. Для кода нужен отдельный изолированный Judge0 CE:

- JUDGE0_URL — HTTPS-адрес доверенного экземпляра;
- JUDGE0_TOKEN — токен, если требуется;
- JUDGE0_PYTHON_LANGUAGE_ID — ID Python из /languages этого экземпляра.

[Официальный контракт Judge0](https://ce.judge0.com/). Нужна поддержка wait=true; при её отключении следует добавить polling submissions на сервере.

Скрытые тесты задаются JSON-массивом объектов stdin и expected. Например:

    [{"stdin":"2\n","expected":"4\n"},{"stdin":"-3\n","expected":"9\n"}]

Решение читает stdin и печатает ответ. Сервис запускает его с отключённой сетью, ограничением времени и памяти. Ученик получает только номера тестов и passed; stdout, stderr, вход и ожидаемый ответ не включаются в ответ браузеру. Без сервиса интерфейс показывает недоступность проверки, а запуск кода в терминале остаётся доступен. Демоверсия не имитирует прохождение скрытых тестов.

## Комнаты и материалы

Yjs объединяет одновременные правки; D1 синхронизируется примерно раз в 1,2 секунды. Файл ученика редактируют оба участника, файл репетитора — только репетитор. Сервер проверяет права отдельно от интерфейса.

Python 0.27.7 Pyodide и Lua 0.1.5 Fengari выполняются в Web Worker внутри iframe с непрозрачным origin; allow-same-origin не используется. Есть вывод, ввод, остановка, лимит 10 секунд выполнения и 100 000 символов вывода. Первая загрузка Python требует доступа к cdn.jsdelivr.net. Это учебная консоль, не графическое окно Pygame. Ввод возобновляет программу повторным выполнением с накопленными строками; программы с внешними побочными эффектами могут повторить их.

После 30 минут бездействия комната недоступна, физическая очистка выполняется при следующем запросе комнат или кабинета. Фоновый опрос не продлевает срок; правка, запуск и ввод продлевают.

Markdown не исполняет HTML. Jupyter показывает Markdown, код и текстовые результаты; HTML и JavaScript блокнота не исполняются. Кнопка Google Colab использует заданную прямую ссылку; если её нет — скачивает .ipynb и открывает Colab, где файл нужно загрузить.

## Проверки

    npx tsc --noEmit
    node --experimental-strip-types --test tests/domain.test.ts tests/collaboration.test.ts
    node scripts/test-integration.mjs
    npm run build

Интеграционные тесты требуют работающего localhost и применённых миграций; создают временные записи в локальной D1 и удаляют только свои фикстуры в finally. Проверяют авторизацию, CSRF, права, материалы, скрытие тестов, квиз, уведомления, конкурентное объединение кода, TTL комнат. Не используют реальный Google Календарь и платный runner.

## Портрет

Исходник ../photoOfTutor.JPG не изменён. Фон удалён встроенным imagegen с сохранением внешности и позы. Подготовленные варианты: public/tutor.png и public/tutor.webp. WebP перекодирован через Sharp без дополнительной ретуши. Промпт — docs/portrait-prompt.txt. MIT-лицензия Fengari — public/fengari.LICENSE.

## Перед открытием для учеников

Перед приглашением учеников настрой секреты Worker, Google OAuth, рабочие часы, домен, реальные материалы и учётные записи. Не запускай production deploy до создания D1, применения миграций и проверки переменных окружения.

Локальную сборку Fengari можно воспроизвести командой node scripts/build-lua.mjs. Автоматическая проверка реального Lua worker, включая ввод, — tests/runtime.test.mjs.
