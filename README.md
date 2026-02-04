# Internship-backend

Backend service built with NestJS, PostgreSQL and TypeORM.

---

## Tech Stack

- NestJS
- PostgreSQL
- TypeORM
- Docker & Docker Compose

---

## Requirements

### Local development (without Docker)

- Node.js (LTS)
- npm
- PostgreSQL (running locally)

### Docker development

- Docker
- Docker Compose

---

## Application URLs

- Application: http://localhost:3000
- Swagger API documentation: http://localhost:3000/api

---

# Local Development

## Install

```bash
npm install
```

## Run

```bash
# dev
npm run start:dev
```

## Tests

```bash
npm run test
npm run test:e2e
```

## Environment variables

Create `.env` in the project root (example values for local development).

```env
PORT=3000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=internship
```

# Docker Usage

### Start everything (API + PostgreSQL)

```bash
docker compose up --build
```

Stop

```bash
docker compose down
```

App will be available at: http://localhost:3000

### Run tests in Docker

```bash
docker compose exec api npm test
```

---

## Database

PostgreSQL runs in a Docker container.

Connection is configured via TypeORM using env variables.

## Migrations

Database schema changes are managed using TypeORM migrations.

Migrations are executed inside Docker containers to ensure the same environment for development.

### Generate migration

```bash
npm run migrate:generate -- src/migrations/<migration-name>
```

This command compares current entities with the database schema and generates a new migration file.

## Apply migrations

```bash
npm run migrate:run
```

Applies all pending migrations to the database.

### Revert last migration

```bash
npm run migrate:revert
```

Rolls back the last applied migration.
Migration files are stored in:

```bash
src/migrations
```

Applied migrations are tracked in the migrations table inside the database.

## Auto Rebuild on Code Changes

Docker Compose is configured with:

- volumes
- develop.watch

This allows automatic rebuild & container restart when files change.

### Run watch mode

```bash
docker compose up -d --build
docker compose watch
```
