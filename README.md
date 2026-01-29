# Internship-backend

Backend service built with NestJS.

---

## Requirements

For local development without Docker:

- Node.js (LTS)
- npm

For Docker usage:

- Docker
- Docker Compose

---

## Application URLs

- Application: http://localhost:3000
- Swagger API documentation: http://localhost:3000/api

---

## Install (local)

```bash
npm install
```

## Compile and run the project (local)

```bash
# development
npm run start
```

```bash
# watch mode
npm run start:dev
```

## Run tests (local)

```bash
# unit tests
npm run test
```

```bash
# e2e tests
npm run test:e2e
```

## Environment variables

Create a `.env` file in the project root.

- `PORT` — port where the HTTP server will run (default: 3000)

Example:

```env
PORT=3000
```

## Run with Docker

### Build image

```bash
docker build -t internship-backend .
```

### Run container

```bash
docker run -p 3000:3000 internship-backend
```

### Run with docker-compose (recommended for local development)

```bash
docker compose up --build
```

To stop containers:

```bash
docker compose down
```

### Run tests in Docker

```bash
# run unit tests inside container
docker run --rm internship-backend npm test
```

```bash
# if you use docker-compose (service name: api)
docker compose exec api npm test
```
