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
./gradlew :api:authentication:bootRun       # port 8080
./gradlew :api:authorization:bootRun        # port 8085
./gradlew :api:workflow:bootRun
./gradlew :workflow:workflow-administration:bootRun

# Build an executable JAR for a module
./gradlew :api:authentication:bootJar
```

## Architecture Overview

This is a **multi-module Gradle microservices backend** for a document management system. Each module is independently deployable as a Spring Boot 3.5.3 application targeting Java 21.

### Module Groups

- **`api/`** — REST API entry points: `authentication` (port 8080), `authorization` (port 8085), `customer-authentication`, `workflow`, `tenant`
- **`data/`** — Data access modules, each owning a specific database:
  - `data-user-information` — PostgreSQL (JPA/Hibernate), port 5433, db `users`
  - `data-workflow-cassandra` — Apache Cassandra, port 9042, keyspace `my_keyspace`
  - `data-workflow-mongo` — MongoDB, port 27020, db `admin`
  - `data-customer-user-information`, `data-user-authorization`, `data-tenant-information`, `data-workflow`, `data-workflow-activity`
- **`workflow/`** — `workflow-manager` (Activiti 6.0.0 + Dropwizard 2 + Maven — legacy, MySQL via Docker), `workflow-administration` (Spring Boot)
- **`utilities/`** — `util-model` (base classes), `util-authorization` (inter-service REST calls), `util-jwt` (JWT via Auth0), `util-crypto` (AES encryption via BouncyCastle)
- **Other** — `filesystem`, `signature`, `notification/notification-email`, `portal-administration`

### Layered Pattern Per Module

Each module follows a consistent layered pattern:
1. **Controller** (REST endpoint, extends `BaseController<S>`) — e.g., `CreateRoleController`
2. **Service** (business logic, implements `BaseService<Req, Res>`) — e.g., `CreateUserAuthenticationService`
3. **Repository** (Spring Data repository interface, often wrapped in a `*ServiceRepository` class)
4. **Model** (JPA/Cassandra/MongoDB entity classes)

Base classes in `utilities/util-model`:
- `BaseController<S extends BaseService<?,?>>` — holds injected service, calls `service.execute(request)`
- `BaseService<B extends BaseServiceRequest, R extends BaseServiceResponse>` — single-method interface: `R execute(B)`
- `BaseServiceRequest` — interface requiring `getTenant()` / `setTenant()` (multi-tenancy contract)
- `BaseServiceResponse` — marker interface for response DTOs
- `BasicObjectUtil` — utilities including `getTenant(HttpServletRequest)` which reads the `Tenant` HTTP header

### Authentication & Authorization

- JWT tokens are created and validated in `util-jwt` using **Auth0 JWT 4.5.1** with HMAC256
- JWT claims include `sub` (username), `scopes` (list of path patterns), `token_type` (`access` or `refresh`), and `extra` (AES-encrypted username)
- `util-crypto` provides `CryptoUtil` (AES/CBC/PKCS5Padding via BouncyCastle) used to encrypt the `extra` JWT claim
- `api:authentication` manages users, roles, and credentials; `api:authorization` issues tokens
- Authorization headers use the format: `user_authorization=<token>; app_authorization=<token>`
- Tenant is propagated via the `Tenant` HTTP request header; all `BaseServiceRequest` implementations carry a `tenant` field
- Inter-service HTTP calls use Spring 6 `RestClient` (no Feign, no message queues); `util-authorization` provides `UtilAuthorizationService` as a shared REST client

### Database Configuration

Each data module has its own `application-*.properties` file in `src/main/resources/`. Hibernate DDL is set to `update` for PostgreSQL. Cassandra schema is auto-created.

### Testing Pattern

Tests are **full Spring integration tests** (`@SpringBootTest`) with no mocking — they bootstrap the full context and hit real repositories. Use JUnit 5 (`@Test`).

### Key Dependencies Across Modules

- **Lombok** (`@Data`, `@Builder`, `@RequiredArgsConstructor`) — used extensively
- **Spring Data JPA / Cassandra / MongoDB** — repository abstractions
- **Auth0 JWT 4.5.1** — token creation and validation (in `util-jwt`)
- **BouncyCastle** — AES/CBC encryption (in `util-crypto`)
- **Gson 2.13.1** — JSON serialization (alongside Jackson)
- **Activiti 6.0.0** — BPMN workflow engine (only in `workflow-manager`)

### Docker

Several modules include `Dockerfile` and `docker-compose.yml`. The workflow module's compose file orchestrates MySQL (for Activiti), MongoDB, and Kafka networking.