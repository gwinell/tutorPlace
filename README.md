# TutorPlace

TutorPlace is a local first online school platform for independent tutors. It includes a public tutor directory, tutor and student accounts, booking, a local payment simulator, private chats, consent controlled support access, and a shared lesson workspace.

Programming courses remain available as an optional subject module. Video lessons use a locally hosted Jitsi Meet service; collaborative whiteboards use Whitebophir.

## Run locally

Requirements: Node.js 22.13 or newer. SQLite is provided by Node. Docker is optional and needed only for the local Whitebophir service.

```sh
npm install
npm run db:migrate:sqlite
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database defaults to `.data/tutorplace.sqlite`; set `DATABASE_PATH` to use another location. Configure `ADMIN_LOGIN` and `ADMIN_PASSWORD` before the first sign in to create the initial platform administrator.

Copy `env.local.example` to `.env.local` to configure lesson services and file storage. Read [docs/SETUP.md](docs/SETUP.md) for local configuration, data migration, and the MVP account flows.

## Lesson services

Whitebophir has a local Docker Compose definition in `compose.local.yml`. Jitsi Meet is run separately using the upstream Docker Compose setup. TutorPlace issues short lived access tokens and embeds each service in the lesson room.

## MVP scope

Payments are simulated and do not move money. Tutor applications need administrator approval before appearing publicly. Support staff can request access to a specific tutor or student conversation; a participant must approve it, access expires after 24 hours, and each access action is audited.
