# Movies & TV Shows API

TypeScript/Express service that exposes authenticated endpoints to browse movies and TV show metadata stored in Postgres. Data is seeded from CSV exports through TypeORM migrations and the API is documented with Swagger UI.

## Features
- JWT-authenticated routes for movies and TV shows with refresh-token support
- TypeORM entities and migrations (including CSV-backed manual seeding)
- Swagger UI served from `swagger.json` at `/docs`
- Seed data stored in `apps/api/seed` for reproducible environments

## Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 13+ running locally or reachable via network

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the sample environment file and adjust values to match your database and auth secrets:
   ```bash
   cp .env.example .env
   ```
   | Variable | Purpose |
   | --- | --- |
   | `PORT` | HTTP port for the API (defaults to `3000`) |
   | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Postgres connection details |
   | `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Credentials for `/auth/login` (defaults: `admin` / `password`) |
   | `JWT_SECRET` | Secret used to sign access tokens |
   | `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |

## Database & Seeding
1. Ensure the target database exists (`DB_NAME`).
2. Apply migrations (this runs the schema creation plus the CSV-backed manual migration):
   ```bash
   npm run db:migration:run
   ```
   The manual migration reads the CSV files under `seed/` and inserts directors, actors, movies, TV shows, seasons, episodes, and their relations. Duplicate actor/movie links in the CSV are filtered automatically.
3. To roll back the latest migration (removes seeded data):
   ```bash
   npm run db:migration:revert
   ```

## Running the API
- Start in watch mode (uses `ts-node-dev`):
  ```bash
  npm run dev
  ```
- Build and run with compiled JavaScript:
  ```bash
  npm run build
  npm start
  ```

Once running, the service listens on `http://localhost:3000` by default (override with the `PORT` env variable).

### Authentication Flow
1. Call `POST /auth/login` with the configured credentials to receive `token` and `refreshToken`.
2. Use the bearer token on all `/movies` and `/tvshows` requests (`Authorization: Bearer <token>`).
3. Refresh expired tokens by calling `POST /auth/refresh` with the `refreshToken`.

## API Documentation
Swagger UI is served at `http://localhost:3000/docs` by default. The OpenAPI document lives at `src/config/swagger.json`. Update this file if the routes or schemas change, then restart the server; the UI will reflect the new spec automatically.

## Useful Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start API with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Serve the compiled build |
| `npm run db:migration:run` | Apply pending TypeORM migrations |
| `npm run db:migration:revert` | Roll back the most recent migration |
| `npm run db:migration:create` | Scaffold a new empty migration |
| `npm run db:migration:generate` | Generate a migration from entity changes |
| `npm run db:show` | Print SQL for schema sync (read-only) |

## Project Structure
```
apps/api/
|-- seed/                 # CSV files consumed by manual migration
|-- src/
|   |-- config/           # Database, passport, and swagger config
|   |-- controllers/      # Express handlers
|   |-- entities/         # TypeORM entity definitions
|   |-- migrations/       # TypeORM migrations (schema + manual seeding)
|   |-- routes/           # Express routers mounted in index.ts
|-- README.md             # This file
```

## Troubleshooting
- **Migration duplicate key errors**: the manual seeding migration now skips duplicate CSV entries; rerun `npm run db:migration:run` if you pulled recent changes.
- **Passport 401 responses**: verify you are sending the access token returned by `/auth/login`.
- **Swagger shows outdated routes**: confirm you edited `src/config/swagger.json` and restarted the dev server.
