# Weaver

E-commerce platform for traditional Indian textiles — sarees, lehengas, and more.

## Architecture

- **weaver-api** — Spring Boot REST API (Java 21, PostgreSQL, Flyway, MinIO for images)
- **weaver-web** — Next.js frontend (TypeScript, Tailwind CSS)

## Quick Start

### Infrastructure

```bash
docker compose up -d   # PostgreSQL + MinIO
```

### API

```bash
cd weaver-api
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

API available at `http://localhost:18080`

### Web

```bash
cd weaver-web
npm install
npm run dev
```

Frontend available at `http://localhost:3000`

## Docker (Full Stack)

```bash
./run.sh start     # Build & start all containers
./run.sh stop      # Stop all containers
```

## API Collection

Import `weaver-api/weaver-api.postman_collection.json` into Postman for API testing.
