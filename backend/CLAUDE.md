# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

This project uses **Gradle 8.13 with Kotlin DSL**. Always use the wrapper (`./gradlew`).

```bash
# Build all modules
./gradlew build

# Build without running tests
./gradlew assemble

# Run all tests
./gradlew test

# Test a single module (replace with desired module path)
./gradlew :api:authentication:test
./gradlew :data:data-user-information:test
./gradlew :data:data-workflow-cassandra:test

# Run a specific service
./gradlew :api:authentication:bootRun
./gradlew :api:workflow:bootRun
./gradlew :data:data-user-information:bootRun
./gradlew :data:data-workflow-cassandra:bootRun
./gradlew :workflow:workflow-administration:bootRun

# Build an executable JAR for a module
./gradlew :api:authentication:bootJar
```

## Architecture Overview

This is a **multi-module Gradle microservices backend** for a document management system. Each module is independently deployable as a Spring Boot 3.5.3 application targeting Java 21.

### Module Groups

- **`api/`** — REST API entry points: `authentication`, `authorization`, `customer-authentication`, `workflow`, `tenant`
- **`data/`** — Data access modules, each owning a specific database:
  - `data-user-information` — PostgreSQL (JPA/Hibernate), port 5433, db `users`
  - `data-workflow-cassandra` — Apache Cassandra, port 9042, keyspace `my_keyspace`
  - `data-workflow-mongo` — MongoDB, port 27020, db `admin`
  - `data-customer-user-information`, `data-user-authorization`, `data-tenant-information`
- **`workflow/`** — `workflow-manager` (Activiti 6.0.0 + Dropwizard 2, MySQL via Docker), `workflow-administration` (Spring Boot)
- **`utilities/`** — `util-model` (base classes), `util-authorization` (JWT with JJWT 0.12.5)
- **Other** — `filesystem`, `signature`, `notification/notification-email`, `portal-administration`

### Layered Pattern Per Module

Each module follows a consistent layered pattern:
1. **Controller** (REST endpoint, extends `BaseController`) — e.g., `CreateRoleController`
2. **Service** (business logic, extends `BaseService`) — e.g., `CreateUserAuthenticationService`
3. **Repository** (Spring Data repository interface or a `*ServiceRepository` wrapper class)
4. **Model** (JPA/Cassandra/MongoDB entity classes)

Base classes in `utilities/util-model`:
- `BaseController` — abstract REST controller
- `BaseService` — abstract service
- `BaseServiceRequest` / `BaseServiceResponse` — DTO base classes
- `JwtUtils` — JWT token operations
- `BasicObjectUtil` — general utilities

### Authentication & Authorization

- JWT-based auth using JJWT 0.12.5 (in `util-authorization`)
- `api:authentication` issues tokens; `api:authorization` validates permissions
- Multi-tenant support via `data:data-tenant-information` and `api:tenant`

### Database Configuration

Each data module has its own `application-*.properties` profile file in `src/main/resources/`. Hibernate DDL is set to `update` for PostgreSQL. Cassandra schema is auto-created.

### Key Dependencies Across Modules

- **Lombok** (@Data, @Builder, @RequiredArgsConstructor) — used extensively across all modules
- **Spring Data JPA / Cassandra / MongoDB** — repository abstractions
- **Gson 2.13.1** — JSON serialization (alongside Jackson)
- **Activiti 6.0.0** — BPMN workflow engine (only in `workflow-manager`, which also uses Maven/Dropwizard as a legacy module)

### Docker

Several modules include `Dockerfile` and `docker-compose.yml` for containerized deployment. The workflow module's compose file orchestrates MySQL (for Activiti), MongoDB, and Kafka networking.