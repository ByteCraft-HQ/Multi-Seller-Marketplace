# Backend Engineering Documentation

## Backend Architecture & Request Pipeline Methodology

We follow a structured, stage-by-stage layered architecture to design, implement, and document the backend system. Each layer has its own dedicated responsibility, following the pipeline order below.

> **Scope:** This documentation methodology applies specifically to the **Backend Engineering** section of the project (`backend/`). It defines the directory structure, file hierarchy, request lifecycle, and execution flow for all incoming HTTP requests.

---

### 1. Server Bootstrap & Environment Configuration
- **Environment Injection** — Load and inject runtime configuration parameters from `.env`.
- **Port Listener** — Initialize the HTTP server and bind it to the designated network port (`src/server.js`).

### 2. Application Assembly & Global Interceptors
- **Core Assembly** — Instantiate the Express application (`src/app.js`).
- **Global Middlewares** — Register cross-origin resource sharing (`cors`), body parsers (`express.json`), and database serialization polyfills (`BigInt.prototype.toJSON`).

### 3. Database Layer & Client Connection
- **ORM Schema Definition** — Map the 8 physical tables of the `USER-DOMAIN` with relationships and indexes (`prisma/schema.prisma`).
- **Client Singleton** — Instantiate and export a single, reusable Prisma client instance across the application lifecycle (`src/config/db.js`).
- **Data Seeding** — Execute seed scripts to populate baseline role categories and system roles (`prisma/seed.js`).

### 4. Input Validation & Schema Enforcement
- **Constraint Definition** — Translate database-level business constraints into strict validation schemas using Zod (`src/validations/authValidation.js`).
- **Validation Interceptor** — A higher-order middleware factory that parses incoming request bodies (`safeParse`) and halts malformed requests before they reach controllers (`src/middlewares/validate.js`).

### 5. Routing & Pipeline Binding
- **Endpoint Declaration** — Declare RESTful API paths and HTTP verbs (`src/routes/authRoutes.js`).
- **Middleware Pipeline Binding** — Chain validation guards and authentication handlers in sequential execution order.

### 6. Controller & Orchestration Layer
- **Request Orchestration** — Extract sanitized payloads from `req.body`, execute application logic, and dispatch standardized HTTP response contracts (`src/controllers/authController.js`).

### 7. Centralized Error Handling Pipeline
- **Operational Error Representation** — Encapsulate predictable client and business exceptions with HTTP status codes and operational flags (`src/utils/AppError.js`).
- **Terminal Error Middleware** — A 4-parameter error handler placed at the end of the Express pipeline to catch all delegated exceptions and output unified JSON responses (`src/middlewares/errorMiddleware.js`).

---

## Request Execution Flow

```text
CLIENT REQUEST
    |
    v
SERVER BOOTSTRAP (src/server.js)
    |
    |---- Environment Configuration (.env)
    |---- Port Listener Initialization
    |
    v
APPLICATION ASSEMBLY (src/app.js)
    |
    |---- CORS & Body Parsing (express.json)
    |---- BigInt Serialization Polyfill
    |
    v
ROUTING TABLE (src/routes/authRoutes.js)
    |
    |---- Route Path Matching (/api/auth/register)
    |
    v
VALIDATION GATEWAY (src/middlewares/validate.js)
    |
    |---- Schema Enforcement (src/validations/authValidation.js)
    |
    +---- [FAIL] ----> OPERATIONAL ERROR (src/utils/AppError.js)
    |                       |
    |                       v
    |                  GLOBAL ERROR HANDLER (src/middlewares/errorMiddleware.js)
    |                       |
    |                       v
    |                  HTTP 400 JSON RESPONSE
    |
    +---- [PASS]
    |
    v
CONTROLLER LAYER (src/controllers/authController.js)
    |
    |---- Business Logic Execution
    |---- HTTP 201 JSON Response Delivery
    |
    v
DATABASE LAYER (src/config/db.js + prisma/)
    |
    |---- Prisma ORM Transactions
    |---- Microsoft SQL Server Persistence
    |
    v
END
```

---

## Directory Structure & Reading Order

To review or onboard into the backend codebase, inspect the files in the following sequential order:

| Stage | Path | Purpose | Key Responsibilities |
|---|---|---|---|
| **1** | `prisma/schema.prisma` | Data Modeling | 8 `USER-DOMAIN` tables, relations, and filtered unique index |
| **2** | `src/config/db.js` | Database Client | Prisma Client singleton instance |
| **3** | `prisma/seed.js` | Baseline Data | Initial role categories and core role definitions |
| **4** | `src/utils/AppError.js` | Error Modeling | Operational error wrapper inheriting from native `Error` |
| **5** | `src/middlewares/errorMiddleware.js` | Error Handling | Global 4-parameter terminal error response handler |
| **6** | `src/validations/authValidation.js` | Input Validation | Zod schemas enforcing field-level business constraints |
| **7** | `src/middlewares/validate.js` | Gateway Guard | Higher-order middleware running `safeParse` on `req.body` |
| **8** | `src/controllers/authController.js` | Orchestration | Controller functions handling incoming requests |
| **9** | `src/routes/authRoutes.js` | API Routing | Route definitions binding validation middleware to controllers |
| **10** | `src/app.js` | App Assembly | Express configuration, global middleware, and route mounting |
| **11** | `src/server.js` | Server Entry | Environment loading and HTTP port listener |

---

## Guiding Principles

1. **Separation of Concerns:** Each layer handles a single responsibility. Routing does not contain business logic; controllers do not contain validation schemas; errors are never handled in ad-hoc try/catch blocks.
2. **Fail-Fast Gateway:** Malformed or invalid requests are intercepted and rejected at the validation layer before consuming database or business-logic resources.
3. **Centralized Error Propagation:** All errors throughout the system are wrapped in operational representations and delegated to a single terminal error handler for uniform API contracts.
4. **Strict Schema Parity:** Application-level validation rules directly mirror the database-level constraints defined in `008-CONSTRAINTS`.
