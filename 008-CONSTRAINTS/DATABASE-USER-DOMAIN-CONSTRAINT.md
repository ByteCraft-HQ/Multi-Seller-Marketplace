

# USERS — Constraints Documentation

## 1. Primary Key Constraints (PK)

### 1.1 UserId

- **Attribute:** `UserId`
- **Data Type:** `BIGINT`
- **Identity:** `IDENTITY(1,1)`
- **Constraint:** `PRIMARY KEY`
- **Nullability:** `NOT NULL` (inherently enforced by the Primary Key).

**Rule:**
- Each user must have a unique `UserId`.
- SQL Server automatically generates the value when a new user record is inserted.
- The initial value is `1`, with an increment of `1` for each subsequent value.

**Enforcement:**
- `PRIMARY KEY` ensures uniqueness and prevents NULL values.
- `IDENTITY(1,1)` automatically generates sequential values.

**Reason:**
- Provides a unique numeric identifier for each user.
- Serves as the primary reference for relationships with other database tables.

## 2. NOT NULL Constraints

The following attributes are mandatory:

| Attribute | Rule |
|---|---|
| `UserFirstName` | Must not be NULL. |
| `UserAccountStatus` | Must not be NULL. |
| `UserPasswordHash` | Must not be NULL. |
| `UserEmail` | Must not be NULL. |
| `UserEmailVerification` | Must not be NULL. |
| `UserCreatedAt` | Must not be NULL. |

### 2.1 Nullable Attributes

The following attributes allow NULL values:

| Attribute | Rule |
|---|---|
| `UserMiddleName` | NULL is allowed. |
| `UserLastName` | NULL is allowed. |
| `UserRecoveryEmail` | NULL is allowed. |
| `UserBirthDate` | NULL is allowed. |
| `UserGender` | NULL is allowed. |

### 2.2 Conditional Nullability

The following attributes have conditional nullability:

- `UserDeletedAt`
- `UserDeletedAtReason`
- `UserDeletedAtTextReason`
- `UserRecoveryEmailVerification`

Their conditions are documented in the relevant sections below and in Lifecycle and Decision Finalization.

## 3. UNIQUE Constraints

### 3.1 UserEmail

- **Attribute:** `UserEmail`
- **Rule:** Each user email address must be unique across the entire `USERS` table.
- **Enforcement:** `UNIQUE` constraint.
- **Nullability:** `NOT NULL`.

Duplicate email addresses are not allowed.

## 4. CHECK Constraints

### 4.1 UserFirstName

- **Rule:** The first name must be stored in lowercase.
- **Rule:** Leading and trailing spaces are not allowed.
- **Nullability:** `NOT NULL`.
- **Application Responsibility:** Convert the input using `LOWER()` and `TRIM()` before inserting or updating.
- **Database Enforcement:** `CHECK` constraint verifies the stored value.

```sql
CHECK (
    UserFirstName COLLATE Latin1_General_100_BIN2 =
    LOWER(TRIM(UserFirstName)) COLLATE Latin1_General_100_BIN2
)
```

### 4.2 UserMiddleName

- **Rule:** The middle name must be stored in lowercase.
- **Rule:** Leading and trailing spaces are not allowed.
- **Nullability:** NULL is allowed.
- **Application Responsibility:** Convert the input using `LOWER()` and `TRIM()`.
- **Database Enforcement:** `CHECK` constraint.

```sql
CHECK (
    UserMiddleName IS NULL
    OR UserMiddleName COLLATE Latin1_General_100_BIN2 =
       LOWER(TRIM(UserMiddleName)) COLLATE Latin1_General_100_BIN2
)
```

### 4.3 UserLastName

- **Rule:** The last name must be stored in lowercase.
- **Rule:** Leading and trailing spaces are not allowed.
- **Nullability:** NULL is allowed.
- **Application Responsibility:** Convert the input using `LOWER()` and `TRIM()`.
- **Database Enforcement:** `CHECK` constraint.

```sql
CHECK (
    UserLastName IS NULL
    OR UserLastName COLLATE Latin1_General_100_BIN2 =
       LOWER(TRIM(UserLastName)) COLLATE Latin1_General_100_BIN2
)
```

### 4.4 UserAccountStatus

- **Rule:** The account status must match one of the predefined values.
- **Rule:** The stored value must be uppercase.
- **Rule:** Leading and trailing spaces are not allowed.
- **Nullability:** `NOT NULL`.
- **Application Responsibility:** Convert the value using `UPPER()` and `TRIM()`.
- **Database Enforcement:** `CHECK` constraint.

**Allowed Values:**

| Value | Description |
|---|---|
| `PENDING` | The account has been created and is awaiting completion of registration or activation. |
| `UNDERREVIEW` | The account is currently undergoing review. |
| `ACTIVE` | The account is fully active and operating normally. |
| `LIMITED` | The account is active but subject to certain restrictions. |
| `SUSPENDED` | The account has been temporarily suspended. |
| `DEACTIVATED` | The account has been deactivated and is no longer active. |
| `DELETED` | The account has been logically deleted and is no longer active. |
| `BLOCKED` | The account has been permanently blocked by the system according to its policies. |

```sql
CHECK (
    UserAccountStatus COLLATE Latin1_General_100_BIN2 =
    UPPER(TRIM(UserAccountStatus)) COLLATE Latin1_General_100_BIN2
    AND
    UserAccountStatus COLLATE Latin1_General_100_BIN2 IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'LIMITED',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED',
        'BLOCKED'
    )
)
```

### 4.5 UserDeletedAtReason

- **Rule:** The deletion reason must match one of the predefined values.
- **Rule:** The stored value must be uppercase.
- **Rule:** Leading and trailing spaces are not allowed.
- **Nullability:** Conditional, according to the account lifecycle.
- **Application Responsibility:** Convert the value using `UPPER()` and `TRIM()`.
- **Database Enforcement:** `CHECK` constraint.

**Allowed Values:**

| Value | Description |
|---|---|
| `NO_LONGER_USING_ACCOUNT` | The user no longer uses the account. |
| `FOUND_BETTER_ALTERNATIVE` | The user found a better alternative. |
| `HIGH_PRICES` | The user considers the prices too high. |
| `DELIVERY_ISSUES` | The user experienced delivery issues. |
| `PRODUCT_QUALITY_ISSUES` | The user experienced issues with product quality. |
| `POOR_CUSTOMER_SERVICE` | The user had a poor customer service experience. |
| `PRIVACY_CONCERNS` | The user has concerns about privacy. |
| `HAS_ANOTHER_ACCOUNT` | The user already has another account. |
| `OTHER` | The reason does not match any of the predefined options. |

```sql
CHECK (
    UserDeletedAtReason IS NULL
    OR (
        UserDeletedAtReason COLLATE Latin1_General_100_BIN2 =
        UPPER(TRIM(UserDeletedAtReason)) COLLATE Latin1_General_100_BIN2
        AND
        UserDeletedAtReason COLLATE Latin1_General_100_BIN2 IN (
            'NO_LONGER_USING_ACCOUNT',
            'FOUND_BETTER_ALTERNATIVE',
            'HIGH_PRICES',
            'DELIVERY_ISSUES',
            'PRODUCT_QUALITY_ISSUES',
            'POOR_CUSTOMER_SERVICE',
            'PRIVACY_CONCERNS',
            'HAS_ANOTHER_ACCOUNT',
            'OTHER'
        )
    )
)
```

### 4.6 UserGender

- **Rule:** The gender must be either `MALE` or `FEMALE`.
- **Rule:** The stored value must be uppercase.
- **Rule:** Leading and trailing spaces are not allowed.
- **Nullability:** NULL is allowed.
- **Application Responsibility:** Convert the value using `UPPER()` and `TRIM()`.
- **Database Enforcement:** `CHECK` constraint.

```sql
CHECK (
    UserGender IS NULL
    OR (
        UserGender COLLATE Latin1_General_100_BIN2 =
        UPPER(TRIM(UserGender)) COLLATE Latin1_General_100_BIN2
        AND
        UserGender COLLATE Latin1_General_100_BIN2 IN (
            'MALE',
            'FEMALE'
        )
    )
)
```

## 5. DEFAULT Constraints

### 5.1 UserCreatedAt

- **Attribute:** `UserCreatedAt`
- **Rule:** The creation timestamp is generated automatically when a record is inserted without an explicitly supplied value.
- **Default Expression:** `SYSDATETIME()`.
- **Nullability:** `NOT NULL`.
- **Enforcement:** `DEFAULT` constraint and `NOT NULL` constraint.

```sql
DEFAULT SYSDATETIME()
```

## 6. Conditional Constraints

### 6.1 UserRecoveryEmailVerification

- **Rule:** If `UserRecoveryEmail` contains a value, `UserRecoveryEmailVerification` must contain a value.
- **Rule:** If `UserRecoveryEmail` is NULL, `UserRecoveryEmailVerification` must also be NULL.
- **Enforcement:** `CHECK` constraint.

```sql
CHECK (
    (UserRecoveryEmail IS NULL AND UserRecoveryEmailVerification IS NULL)
    OR
    (UserRecoveryEmail IS NOT NULL AND UserRecoveryEmailVerification IS NOT NULL)
)
```

### 6.2 Deleted Account Attributes

The following attributes are subject to conditional nullability:

- `UserDeletedAt`
- `UserDeletedAtReason`
- `UserDeletedAtTextReason`

Their exact conditions depend on the account lifecycle and are documented in Section 9.

## 7. Business Rule Constraints

### 7.1 Recovery Email Sharing Limit

- **Rule:** A recovery email address may be associated with a maximum of three users.
- **Rule:** The same recovery email address may be shared across different user records.
- **Limitation:** A regular `CHECK` constraint cannot enforce this cross-row limit.
- **Enforcement:** Additional database-level enforcement is required, such as a trigger or a controlled transaction-based implementation.

## 8. Referential Actions

No foreign key relationships are defined for this table at this stage.

## 9. Lifecycle and Decision Finalization

### 9.1 Account Deletion Lifecycle

The following attributes are associated with the logical deletion of a user account:

- `UserDeletedAt`
- `UserDeletedAtReason`
- `UserDeletedAtTextReason`

Their nullability depends on the account status and deletion reason.

The exact rules must ensure that deletion information is recorded consistently when the account transitions to `DELETED`.

### 9.2 Recovery Email Lifecycle

The recovery email verification state depends on whether a recovery email address exists:

- If a recovery email address exists, its verification state must also exist.
- If no recovery email address exists, its verification state must be NULL.

### 9.3 Finalization Notes

- The application is responsible for transforming name and status inputs into the required format before database operations.
- The database independently validates the stored values through `CHECK` constraints.
- Soft deletion is used instead of physical deletion.
- Business rules that cannot be enforced by ordinary constraints require a separately documented enforcement mechanism.
- Decisions involving conditional nullability and lifecycle transitions must be finalized before implementation.

---
