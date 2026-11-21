# 🏛️ Multi-Seller Marketplace — Backend Architecture & Engineering Documentation
**Domain:** `USER-DOMAIN (Backend Implementation)`  
**Version:** `1.0.0`  
**Status:** `Completed, Hardened & Production-Ready (Days 1–8)`  

---

## 1. Executive Summary & Tech Stack Overview

This document provides a comprehensive technical overview of the backend architecture built for the **Multi-Seller Marketplace**, directly reflecting and implementing the database design, functional dependencies, and business constraints documented in the `USER-DOMAIN`.

### Selected Core Technologies:
* **Runtime Environment:** `Node.js` (LTS v24.x)
* **API Framework:** `Express.js 5.3` (Native asynchronous error propagation pipeline)
* **Database Engine:** `Microsoft SQL Server` (Local instance on port 1433, database `MultiSellerMarketplaceDB`)
* **Object-Relational Mapping (ORM):** `Prisma ORM 6.19` (Type-safe client with schema migrations & query engine)
* **Schema Validation Engine:** `Zod 4.6` (Strict runtime schema enforcement for HTTP request payloads)
* **Cryptographic & Auth Security:** `bcryptjs 3.0` & `jsonwebtoken 9.0`
* **Network & Serialization Utilities:** `cors 2.8`, `dotenv 18.0`

---

## 2. Layered Architecture Design (Clean Separation of Concerns)

The backend strictly adheres to a **Separation of Concerns (SoC)** layered architecture to ensure modularity, maintainability, and horizontal scalability:

```
backend/
├── src/
│   ├── config/             # Database connection singletons (Prisma client instance)
│   ├── controllers/        # Request handling, orchestration, & HTTP response generation
│   ├── services/           # Core business logic, DB transactions, & status lifecycle transitions
│   ├── routes/             # RESTful route definitions & middleware pipeline binding
│   ├── middlewares/        # Interceptors: Authentication, Authorization, Validation, Error Handling
│   ├── validations/        # Strict input validation schemas (Zod)
│   ├── utils/              # Operational error wrappers, formatting helpers, and utilities
│   ├── app.js              # Express application assembly, global middlewares, & routing tables
│   └── server.js           # Server bootstrap, fail-fast env validation, & port listener
├── prisma/
│   ├── schema.prisma       # Physical database schema mapping (8 models)
│   └── seed.js             # Initial database seeding script (Roles & Categories)
├── test-roles.js           # Automated integration test suite for roles and lifecycle
├── test-business.js        # Automated integration test suite for seller onboarding & KYC
└── .env                    # Environment configuration (Ignored in Git)
```

---

## 3. Database Layer Implementation (`USER-DOMAIN`)

All 8 models defined in the database design pipeline were converted into physical tables on SQL Server via Prisma Client:

### Implemented Tables:
1. **`USERS`**: Central identity table holding common account attributes, soft-delete metadata, gender, birth date, recovery email, and account status flags.
2. **`USERPHONENUMBER`**: Multi-valued telephone numbers (1NF normalization) with verification states.
3. **`ROLE_CATEGORIES`**: Classification groups (`System Visitor`, `System Employee`, `Seller Operations`).
4. **`ROLES`**: Distinct system roles (`CUSTOMER`, `SELLER`, `STORE_MANAGER`, `SYSTEM_ADMIN`).
5. **`USER_ROLE`**: Surrogate-keyed junction table resolving the M:N relationship between `USERS` and `ROLES`.
6. **`BUSINESS_INFORMATION`**: 1:1 business profile attached specifically to a user's role assignment (`USER_ROLE`).
7. **`BUSINESS_INFORMATION_EMAIL`**: Multi-valued business contact emails with composite primary keys.
8. **`BUSINESS_INFORMATION_PHONENUMBER`**: Multi-valued business phone numbers.

### Key Database Level Enforcements:
* **Active Role Constraint:** Enforced via a **Filtered Unique Index** directly in SQL Server:
  ```sql
  CREATE UNIQUE INDEX UX_UserRole_ActiveNow 
  ON USER_ROLE (UserId) 
  WHERE UserRoleActiveNow = 1;
  ```
  *Guarantee:* A user can hold multiple roles simultaneously, but can NEVER have more than one active role session (`ActiveNow = 1`) across the database.
* **BigInt Serialization:** Implemented a global serialization polyfill in `src/app.js` (`BigInt.prototype.toJSON`) ensuring SQL Server `BIGINT` primary keys serialize cleanly to JSON responses without runtime exceptions.

---

## 4. Centralized Error Handling Architecture

Instead of handling errors in ad-hoc `try/catch` blocks across controllers, the system implements an enterprise-grade **Centralized Error Handling Pattern**:

### 1. `AppError` (`src/utils/AppError.js`)
An operational error wrapper extending the native JavaScript `Error` class:
* Encapsulates `statusCode` (e.g., 400, 401, 403, 404, 409).
* Dynamically infers `status`: `'fail'` for 4xx client errors, `'error'` for 5xx server bugs.
* Flags `this.isOperational = true` to differentiate expected business errors from unexpected runtime crashes.
* Captures a pristine stack trace while isolating the constructor to keep logs clean.

### 2. `errorMiddleware` (`src/middlewares/errorMiddleware.js`)
The terminal middleware in `app.js` with signature `(err, req, res, next)`:
* Acts as the single security perimeter preventing **Information Disclosure**.
* If `err.isOperational === true`: sends the sanitized operational message and HTTP status code directly to the client.
* If `err.isOperational !== true`: logs the raw stack trace internally (`console.error`), masking internal database/ORM details, and returns a safe generic 500 response (`'Something went wrong. Please try again later.'`).

---

## 5. Request Pipeline & Input Validation Layer

To enforce strict data constraints before any payload touches controllers or the database, a dedicated validation layer is placed at the HTTP gateway:

### 1. Generic Validation Middleware (`src/middlewares/validate.js`)
A Higher-Order Middleware Factory executing `schema.safeParse(req.body)`:
* **On Failure:** Intercepts the first validation issue and delegates immediately to `next(new AppError(issue.message, 400))`.
* **On Success:** Replaces `req.body` with sanitized, trimmed, and typed data before calling `next()`.

### 2. Validation Schemas (`src/validations/`)
* **`authValidation.js`**:
  * `registerSchema`: Required names (min 2 chars), strict email, min 8-character password, international phone number format (`+`).
  * `loginSchema`: Required email and password.
* **`userValidation.js`**:
  * `updateProfileSchema`: Optional profile fields, strict calendar date validation preventing day overflow (e.g. Feb 30), and past date check.
  * `addPhoneSchema`: International phone format validation (`+`).
  * `switchRoleSchema`: Positive integer role ID check (max 255).
  * `updateAccountStatusSchema`: Enums (`ACTIVE`, `DEACTIVATED`, `DELETED`) with conditional refinement requiring deletion reasons.
  * `createBusinessProfileSchema`: Required business KYC attributes, country code, commercial register, national ID, and non-empty arrays for business emails and phones.
  * `updateBusinessProfileSchema`: Partial KYC updates enforcing valid non-empty strings.

---

## 6. Endpoints Catalog & Complete Routing Table

| Method | Endpoint | Access | Middlewares | Description |
|---|---|---|---|---|
| `GET` | `/api/health` | Public | None | Database connectivity verification (`SELECT 1;`) |
| `POST` | `/api/auth/register` | Public | `validate(registerSchema)` | Atomic creation of User, Phone, and default CUSTOMER role |
| `POST` | `/api/auth/login` | Public | `validate(loginSchema)` | Anti-enumeration credentials check, status guards, and JWT issuance |
| `GET` | `/api/users/profile` | Protected | `protect` | Fetches current user profile, phone numbers, and active role |
| `PATCH` | `/api/users/profile` | Protected | `protect`, `validate(updateProfileSchema)` | Partial profile updates with lowercase normalization |
| `POST` | `/api/users/phone` | Protected | `protect`, `validate(addPhoneSchema)` | Registers a secondary phone number (status: PENDING) |
| `DELETE` | `/api/users/phone/:phoneNumber` | Protected | `protect` | Atomic deletion of a phone with minimum-one-phone guard |
| `GET` | `/api/users/roles` | Protected | `protect` | Lists all assigned roles, active status, and permissions |
| `PATCH` | `/api/users/switch-role` | Protected | `protect`, `validate(switchRoleSchema)` | Atomic role switching, deactivating previous role, issuing updated JWT |
| `PATCH` | `/api/users/account-status` | Protected | `protect`, `validate(updateAccountStatusSchema)` | Account lifecycle transitions (Deactivate, Soft Delete with reasons) |
| `POST` | `/api/users/business-profile` | Protected | `protect`, `validate(createBusinessProfileSchema)` | Atomic seller onboarding provisioning SELLER role as UNDERREVIEW |
| `GET` | `/api/users/business-profile` | Protected | `protect` | Retrieves business profile, emails, and phone numbers |
| `PATCH` | `/api/users/business-profile` | Protected | `protect`, `validate(updateBusinessProfileSchema)` | Partial business updates resetting role to UNDERREVIEW |

---

## 7. Security Architecture & Hardening Perimeters

1. **Fail-Fast Startup Validation (`src/server.js`):**
   * Before binding to the network port, `server.js` validates that all critical environment variables (`JWT_SECRET`, `JWT_EXPIRES_IN`, `DATABASE_URL`) are present. If any variable is missing, the server terminates immediately with exit code `1`.
2. **Information Disclosure Perimeter (`src/middlewares/errorMiddleware.js` & `src/app.js`):**
   * Raw database exceptions (Prisma errors, SQL query text, table names) are strictly hidden from clients.
   * Operational errors (`AppError`) send clean user-facing messages.
   * Health check endpoint `/api/health` returns sanitized error statuses without leaking connection parameters.
3. **Account Status Lifecycle & Authentication Guards:**
   * **Self-Activation Prevention:** Users in `PENDING` status cannot self-transition to `ACTIVE` via the account status API; verification is strictly enforced.
   * **Inactive Session Interception:** Accounts in `BLOCKED`, `DELETED`, `SUSPENDED`, or `DEACTIVATED` statuses are denied access at `protect` middleware (HTTP 403).
   * **Reactivation on Login Pattern:** Deactivated users can voluntarily reactivate their accounts by authenticating with their correct credentials at `/api/auth/login`.
4. **Concurrency & Race Condition Mitigation:**
   * Multi-step check-then-act operations (role switching, seller onboarding, phone deletion) are encapsulated within `prisma.$transaction`.
   * Row-level locking during phone deletion prevents race conditions from deleting a user's final phone number under concurrent requests.
5. **Calendar Date Validation:**
   * Birth date validation parses individual year, month, and day components to ensure invalid calendar combinations (e.g. February 30) do not roll over silently to valid dates.

---

## 8. Business Rules Compliance Audit

| Rule ID | Architectural Requirement | How It Is Implemented |
|---|---|---|
| **BR-001** | Multi-Role assignment per user | `USER_ROLE` junction model mapped in Prisma |
| **BR-002** | Simultaneous visitor & employee roles | Categorized via `ROLE_CATEGORIES` seeded in DB |
| **BR-003** | Independent role lifecycles | `UserRoleStatus` column separated from `UserAccountStatus` |
| **BR-004** | Role Switching Session Sync | Atomic transaction updates `ActiveNow` and returns a fresh JWT |
| **BR-005** | Minimum Phone Retention | Guard prevents deleting the only phone number attached to an account |
| **BR-006** | Voluntary Account Lifecycle | Users can deactivate or soft delete their account with mandatory reason tracking |
| **BR-007** | Reason Tracking for Deletions | If reason is `OTHER`, custom text reason is mandatory (max 150 chars) |
| **BR-010** | Business Info linked to role (not user) | `BUSINESS_INFORMATION` has 1:1 foreign key to `USER_ROLE` |
| **BR-011** | Seller Onboarding KYC Isolation | Business registration sets role to `UNDERREVIEW` awaiting compliance verification |
| **Phone Constraint** | Phone numbers must start with `+` | Enforced at gateway via Zod schemas + DB schema |
| **Active Context** | Exactly one active role at a time | Enforced via SQL Server Filtered Unique Index (`UX_UserRole_ActiveNow`) |

---

## 9. Domain Completion & Handoff Summary

The **`USER-DOMAIN`** backend is officially complete, fully tested, hardened against OWASP vulnerabilities, and verified against all database constraints:
* **All 8 Database Tables Managed:** Complete CRUD, lifecycle, and transaction pipelines implemented.
* **Automated Test Suites:** Integration tests (`test-roles.js`, `test-business.js`) verify happy paths, boundary constraints, and concurrency guarantees.
* **Handoff Ready:** Clean Architecture foundation established for subsequent marketplace domains (`STORES`, `PRODUCTS`, `ORDERS`, `PAYMENTS`).
