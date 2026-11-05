# Multi-Seller-Marketplace
A full-scale multi-seller marketplace integrating frontend, backend, database engineering, data engineering, CRM, and warehouse management into a unified platform.

# Database Engineering Documentation

## DataBase Modeling Documentation 

We will follow a structured, stage-by-stage methodology to design and document each database domain. Each stage will have its own dedicated section and documentation, following the order below.

> **Scope:** This documentation methodology applies specifically to the **Database Engineering** section of the project. It defines the workflow used for database modeling, design, analysis, and decision documentation for each database domain.

### 1. Documentation

- **Entity Discovery** — Identify the entities within the domain.
- **Attribute Definition** — Define and describe each entity's attributes.

### 2. Relationships

- **Relationships and Cardinality** — Identify relationships between entities and define their cardinalities.
- **Basic Keys** — Identify the initial keys based on the discovered entities and relationships.

### 3. Normalization — First Normal Form

- **1NF** — Identify and resolve repeating groups and multi-valued attributes to achieve First Normal Form.

### 4. Functional Dependencies and Keys

- **Functional Dependencies** — Identify the functional dependencies between attributes.
- **Keys** — Analyze superkeys and candidate keys, then identify the primary key and alternate keys.

### 5. Relationship Solution

- **Relationship Solution and Foreign Keys (FKs)** — Implement the identified relationships in the database structure and define the required foreign keys.

### 6. Normalization — Second Normal Form and Beyond

- **2NF** — Analyze and resolve partial dependencies.
- **3NF** — Analyze and resolve transitive dependencies.
- **BCNF and Higher Normal Forms** — Evaluate and apply additional normal forms when required.

### 7. Edge Cases and Edge Case Solutions

- **Edge Cases** — Identify exceptional scenarios and business-rule conflicts.
- **Edge Case Solutions** — Define how the database design and business rules will handle each identified case.

### 8. Data Types

- **Data Type Definition** — Select appropriate database data types for each attribute.

### 9. Constraints

- **Constraint Definition** — Define the required constraints to enforce data integrity and business rules.

### 10. Indexing

- **Basic Indexing** — Identify the basic indexing requirements based on keys, relationships, and expected query patterns.

### 11. Lifecycle and Decision Finalization

- **Lifecycle Definition** — Document the lifecycle of relevant entities and their state transitions.
- **Decision Finalization** — Review, document, and finalize the design decisions made throughout the process.

```text
DOCUMENTATION
    |
    |---- Entity Discovery
    |
    |---- Attribute Definition
    |
    v
RELATIONSHIPS
    |
    |---- Relationships and Cardinality
    |
    |---- Basic Keys
    |
    v
NORMALIZATION
    |
    |---- 1NF
    |
    v
FUNCTIONAL DEPENDENCIES AND KEYS
    |
    |---- Functional Dependencies
    |
    |---- Super Keys
    |
    |---- Candidate Keys
    |
    |---- Primary Key (PK) and Alternate Keys
    |
    v
RELATIONSHIP SOLUTION
    |
    |---- Relationship Solution
    |
    |---- Foreign Keys (FKs)
    |
    v
NORMALIZATION
    |
    |---- 2NF
    |
    |---- 3NF
    |
    |---- BCNF
    |
    |---- Higher Normal Forms, if applicable
    |
    v
EDGE CASES AND EDGE CASE SOLUTIONS
    |
    |---- Edge Cases
    |
    |---- Edge Case Solutions
    |
    v
DATA TYPES
    |
    |---- Data Type Definition
    |
    v
CONSTRAINTS
    |
    |---- Constraint Definition
    |
    v
INDEXING
    |
    |---- Basic Indexing
    |
    v
LIFECYCLE AND DECISION FINALIZATION
    |
    |---- Lifecycle Definition
    |
    |---- Decision Finalization
    |
    v
END
```
---

## Guiding Principle

Each domain will follow this methodology to maintain consistent, traceable, and well-structured database documentation. Decisions made in earlier stages will be reviewed when later analysis reveals a conflict or a need for revision.

The documentation will distinguish between identifying the conceptual design, analyzing dependencies and keys, implementing relationships, and applying normalization, constraints, and other physical design considerations.


---

# Backend Engineering Documentation

## Backend Architecture & Request Pipeline Documentation

We follow a structured, stage-by-stage layered methodology to design, implement, and document the backend system. Each layer has its own dedicated responsibility, following the order below.

> **Scope:** This documentation methodology applies specifically to the **Backend Engineering** section of the project (`backend/`). It defines the directory structure, file hierarchy, request lifecycle, and execution flow for all incoming HTTP requests.

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

```text
SERVER BOOTSTRAP
    |
    |---- Environment Configuration (.env)
    |---- Port Listener (src/server.js)
    |
    v
APPLICATION ASSEMBLY
    |
    |---- Core Express App (src/app.js)
    |---- Global Middlewares (CORS, Express JSON)
    |---- BigInt Serialization Polyfill
    |
    v
DATABASE ACCESS (ORM)
    |
    |---- Physical Schema Definition (prisma/schema.prisma)
    |---- Client Singleton (src/config/db.js)
    |---- Seed Engine (prisma/seed.js)
    |
    v
INPUT VALIDATION GATEWAY
    |
    |---- Zod Validation Schemas (src/validations/)
    |---- Higher-Order Validation Guard (src/middlewares/validate.js)
    |
    v
ROUTING & PIPELINE
    |
    |---- RESTful Route Definitions (src/routes/)
    |---- Middleware Pipeline Binding
    |
    v
CONTROLLER & ORCHESTRATION
    |
    |---- Request Extraction & Sanitization
    |---- HTTP Response Contract Delivery (src/controllers/)
    |
    v
CENTRALIZED ERROR HANDLING
    |
    |---- Operational Error Wrapper (src/utils/AppError.js)
    |---- Terminal Global Error Middleware (src/middlewares/errorMiddleware.js)
    |
    v
END
```
---

## Directory Structure & Reading Order

To review or onboard into the backend codebase, inspect the files in the following sequential order:

| Stage | Path | Purpose | Key Responsibilities |
|---|---|---|---|
| **1** | `backend/prisma/schema.prisma` | Data Modeling | 8 `USER-DOMAIN` tables, relations, and filtered unique index |
| **2** | `backend/src/config/db.js` | Database Client | Prisma Client singleton instance |
| **3** | `backend/prisma/seed.js` | Baseline Data | Initial role categories and core role definitions |
| **4** | `backend/src/utils/AppError.js` | Error Modeling | Operational error wrapper inheriting from native `Error` |
| **5** | `backend/src/middlewares/errorMiddleware.js` | Error Handling | Global 4-parameter terminal error response handler |
| **6** | `backend/src/validations/authValidation.js` | Input Validation | Zod schemas enforcing field-level business constraints |
| **7** | `backend/src/middlewares/validate.js` | Gateway Guard | Higher-order middleware running `safeParse` on `req.body` |
| **8** | `backend/src/controllers/authController.js` | Orchestration | Controller functions handling incoming requests |
| **9** | `backend/src/routes/authRoutes.js` | API Routing | Route definitions binding validation middleware to controllers |
| **10** | `backend/src/app.js` | App Assembly | Express configuration, global middleware, and route mounting |
| **11** | `backend/src/server.js` | Server Entry | Environment loading and HTTP port listener |

---

## Guiding Principles

Each backend component follows this methodology to maintain consistent, traceable, and production-grade software engineering:

1. **Separation of Concerns:** Each layer handles a single, well-defined responsibility. Routes never contain business logic, controllers never write direct SQL/queries, and validation is strictly isolated from controller execution.
2. **Fail-Fast Input Validation:** Invalid request payloads are intercepted and terminated at the gateway before consuming downstream application, transaction, or database resources.
3. **Centralized Error Propagation:** Ad-hoc try/catch error formatting is strictly prohibited. All operational exceptions are wrapped in `AppError` and funneled into the central 4-parameter error middleware.
4. **Strict Schema Parity:** Application-level validation rules directly mirror the database-level constraints defined in `008-CONSTRAINTS`.
