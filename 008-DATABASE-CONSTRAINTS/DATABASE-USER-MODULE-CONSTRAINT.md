VERSION 0.0.2

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

# ROLE_CATEGORIES — Constraints Documentation

## 1. Primary Key (PK)

**Attribute:** `RoleCategoryName`

- `RoleCategoryName` is the Primary Key.
- The Primary Key inherently enforces `UNIQUE` and `NOT NULL`.

**Reason:** Each role category must have a unique identifier.

## 2. NOT NULL Constraints

The following attributes must not accept NULL values:

- `RoleCategoryName`
- `RoleCategoryStatus`
- `RoleCategoryCreatedAt`
- `RoleCategoryManager`

**Reason:** All four attributes are required to maintain a complete role category record.

## 3. UNIQUE Constraints

**Attribute:** `RoleCategoryManager`

- Each manager's full name must be unique across the `ROLE_CATEGORIES` table.
- Duplicate manager names are not allowed.

**Reason:** Each role category must have a distinct registered manager name.

`RoleCategoryName` is already unique through its Primary Key and does not require a separate UNIQUE constraint.

## 4. CHECK Constraints

### 4.1 RoleCategoryName

**Rule:** The value must contain only uppercase English letters (`A-Z`) and digits (`0-9`).

- Spaces are not allowed.
- Special characters are not allowed.
- Lowercase letters are not allowed.
- The value must not be empty.

```sql
CHECK (
    LEN(RoleCategoryName) > 0
    AND RoleCategoryName COLLATE Latin1_General_100_BIN2
        NOT LIKE '%[^A-Z0-9]%'
)
```

**Reason:** Role category names are system-defined identifiers that must follow a consistent naming convention.

The category name is dynamically defined and is not restricted to a predefined list of values.

### 4.2 RoleCategoryStatus

**Rule:** The value must be one of the following predefined uppercase values:

| Value | Description |
|---|---|
| `PENDING` | The role category has been created and is awaiting completion of registration or activation. |
| `UNDERREVIEW` | The role category is currently undergoing review. |
| `ACTIVE` | The role category is fully active and operating normally. |
| `DEACTIVATED` | The role category has been deactivated and is no longer active. |
| `DELETED` | The role category has been logically deleted and is no longer active. |

```sql
CHECK (
    RoleCategoryStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
)
```

### 4.3 RoleCategoryCreatedAt

**Rule:** The creation timestamp must not be later than the current server date and time.

```sql
CHECK (RoleCategoryCreatedAt <= SYSDATETIME())
```

### 4.4 RoleCategoryManager

**Rule:** The manager's full name must be stored in lowercase without leading or trailing spaces.

```sql
CHECK (
    RoleCategoryManager =
    TRIM(LOWER(RoleCategoryManager)) COLLATE Latin1_General_100_BIN2
)
```

## 5. DEFAULT Constraints

### 5.1 RoleCategoryStatus

```sql
DEFAULT 'PENDING'
```

**Reason:** Every newly created role category starts in the `PENDING` state.

### 5.2 RoleCategoryCreatedAt

```sql
DEFAULT SYSDATETIME()
```

**Reason:** Automatically records the creation date and time when no explicit value is provided.

## 6. Business Rule Constraints

- Role category names are system-defined values and must contain only uppercase English letters and digits.
- Manager names represent full names and must be unique across role categories.
- Role category statuses are restricted to the predefined lifecycle values.
- Newly created role categories start with `PENDING`.
- Role category records must retain their creation timestamp.

## 7. Referential Actions

The relationship between `ROLE_CATEGORIES` and `ROLES` uses:

- **ON UPDATE CASCADE:** Updates the corresponding `RoleCategoryName` values in related roles when the category name changes.
- **ON DELETE NO ACTION:** Prevents physically deleting a role category while related roles reference it.

Logical deletion is handled through `RoleCategoryStatus = 'DELETED'`.

## 8. Lifecycle and Decision Finalization

The constraints defined above enforce the required data integrity rules for `ROLE_CATEGORIES`.

Status transition rules and lifecycle restrictions are documented separately from the allowed status values and will be enforced through controlled database operations where required.

---

# ROLES — Constraints Documentation

## 1. Primary Key (PK)

**Attribute:** `RoleId`

- `RoleId` is the Primary Key.
- Uses `IDENTITY(1,1)` to automatically generate sequential identity values.
- The Primary Key inherently enforces `UNIQUE` and `NOT NULL`.

**Reason:** Each role must have a unique and stable identifier.

**Note:** IDENTITY generates values automatically but does not independently guarantee uniqueness. The Primary Key enforces uniqueness.

## 2. Foreign Key (FK)

**Attribute:** `RoleCategoryName`

- `RoleCategoryName` references `ROLE_CATEGORIES(RoleCategoryName)`.
- The attribute must be `NOT NULL`.

### Referential Actions

- **ON UPDATE CASCADE:** When a role category name changes, the corresponding values in related roles are updated automatically.
- **ON DELETE NO ACTION:** Prevents physically deleting a role category while roles still reference it.

**Reason:** Every role must belong to an existing role category, and category name changes must be reflected in related roles.

## 3. NOT NULL Constraints

The following attributes must not accept NULL values:

- `RoleId`
- `RoleCategoryName`
- `RoleName`
- `RoleStatus`
- `RoleCreatedAt`

**Reason:** These attributes are required to maintain complete and valid role records.

`RoleId` is already NOT NULL through its Primary Key.

## 4. UNIQUE Constraints

**Attribute:** `RoleName`

- Each role name must be unique across the entire `ROLES` table.
- Duplicate role names are not allowed, regardless of their associated role categories.

**Reason:** Role names identify system roles globally and must not be duplicated across different categories.

`RoleId` is already unique through its Primary Key and does not require a separate UNIQUE constraint.

## 5. CHECK Constraints

### 5.1 RoleName

**Rule:** The value must contain only uppercase English letters (`A-Z`) and digits (`0-9`).

- Spaces are not allowed.
- Special characters are not allowed.
- Lowercase letters are not allowed.
- The value must not be empty.

```sql
CHECK (
    LEN(RoleName) > 0
    AND RoleName COLLATE Latin1_General_100_BIN2
        NOT LIKE '%[^A-Z0-9]%'
)
```

**Reason:** Role names are system-defined identifiers that must follow a consistent naming convention.

### 5.2 RoleStatus

**Rule:** The value must be one of the following predefined uppercase values:

| Value | Description |
|---|---|
| `PENDING` | The role has been created and is awaiting completion of registration or activation. |
| `UNDERREVIEW` | The role is currently undergoing review. |
| `ACTIVE` | The role is fully active and operating normally. |
| `DEACTIVATED` | The role has been deactivated and is no longer active. |
| `DELETED` | The role has been logically deleted and is no longer active. |

```sql
CHECK (
    RoleStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
)
```

**Reason:** Restricts role status values to the predefined lifecycle states and enforces uppercase values.

### 5.3 RoleCreatedAt

**Rule:** The creation timestamp must not be later than the current server date and time.

```sql
CHECK (RoleCreatedAt <= SYSDATETIME())
```

**Reason:** Prevents inserting or updating a role with a future creation timestamp.

## 6. DEFAULT Constraints

### 6.1 RoleCreatedAt

```sql
DEFAULT SYSDATETIME()
```

**Reason:** Automatically records the creation date and time when no explicit value is provided.

## 7. Business Rule Constraints

### 7.1 Global Role Name Uniqueness

- A role name must be unique across the entire system's `ROLES` table.
- Different role categories cannot contain roles with the same name.

### 7.2 Role Category Deletion and Role Reassignment

When a role category is logically deleted:

1. All roles associated with that category must be reassigned to the `DeletedCategory` category.
2. The reassignment must take place within a controlled database transaction.
3. The original category must be marked as `DELETED` within the same transaction.
4. The roles being reassigned must retain their existing status, including `ACTIVE`.
5. Deleting a category must not automatically deactivate or logically delete its associated roles.
6. The `DeletedCategory` category must exist before the reassignment operation.
7. The transaction must roll back if any required operation fails.

**Reason:** Role categories organize roles, but deleting a category must not automatically change the lifecycle or availability of the roles associated with it.

### 7.3 DeletedCategory Protection

- `DeletedCategory` is a designated category used to hold roles reassigned from logically deleted categories.
- It must not be physically deleted while roles reference it.
- Its existence must be guaranteed before executing the reassignment transaction.

## 8. Referential Actions

The relationship between `ROLES` and `ROLE_CATEGORIES` uses:

- **ON UPDATE CASCADE:** Keeps role category references synchronized when a category name changes.
- **ON DELETE NO ACTION:** Prevents physical deletion of a referenced category.

Category reassignment is handled through a controlled transaction rather than an automatic cascading delete action.

## 9. Lifecycle and Decision Finalization

The constraints defined above enforce the required data integrity rules for `ROLES`.

The allowed status values are enforced through CHECK constraints. Status transition rules and additional lifecycle restrictions are handled separately through controlled database operations where required.

Role category deletion does not imply role deletion or deactivation. Roles are reassigned to `DeletedCategory` and retain their existing statuses.

---

# USERPHONENUMBER — Constraints Documentation

## 1. Primary Key (PK)

**Attribute:** `UserPhoneNumber`

- `UserPhoneNumber` is the Primary Key.
- The Primary Key inherently enforces `UNIQUE` and `NOT NULL`.

**Reason:** Each phone number uniquely identifies its record within the `USERPHONENUMBER` table.

The phone number is used as a natural primary key because it is unique and is not referenced by other tables.

## 2. Foreign Key (FK)

**Attribute:** `UserId`

- `UserId` references `USERS(UserId)`.
- `UserId` must be `NOT NULL`.

### Referential Actions

- **ON DELETE NO ACTION:** Prevents physically deleting a user while associated phone number records exist.
- **ON UPDATE NO ACTION:** Prevents updating a referenced user identifier while dependent phone number records exist.

**Reason:** Every phone number must belong to an existing user. The system uses soft deletion, so user records are retained rather than physically deleted.

## 3. NOT NULL Constraints

The following attributes must not accept NULL values:

- `UserId`
- `UserPhoneNumber`
- `UserPhoneNumberVerification`
- `UserPhoneNumberStatus`

**Reason:** All attributes are required to maintain complete and valid phone number records.

`UserPhoneNumber` is already NOT NULL through its Primary Key.

## 4. CHECK Constraints

### 4.1 UserPhoneNumber

**Rule:** Every phone number must begin with the international dialing prefix `+`.

```sql
CHECK (
    LEN(UserPhoneNumber) > 1
    AND LEFT(UserPhoneNumber, 1) = '+'
)
```

**Reason:** Ensures that every stored phone number follows the required international prefix convention.

**Note:** This CHECK validates the presence of the `+` prefix only. Full international phone number validation, including country codes and valid number formats, must be handled by the application layer or a dedicated phone number validation library.

### 4.2 UserPhoneNumberStatus

**Rule:** The value must be one of the following predefined uppercase values:

| Value | Description |
|---|---|
| `PENDING` | The phone number has been added and is awaiting completion of verification or activation. |
| `UNDERREVIEW` | The phone number is currently undergoing review. |
| `ACTIVE` | The phone number is verified and operating normally. |
| `DEACTIVATED` | The phone number has been deactivated and is no longer active. |
| `DELETED` | The phone number has been logically deleted and is no longer active. |

```sql
CHECK (
    UserPhoneNumberStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
)
```

**Reason:** Restricts phone number status values to the predefined lifecycle states and enforces uppercase values.

## 5. DEFAULT Constraints

No DEFAULT constraints have been defined for this table at this stage.

## 6. Business Rule Constraints

- Each phone number must be unique across the entire `USERPHONENUMBER` table.
- A user may have multiple phone numbers.
- Every phone number must belong to an existing user.
- Every phone number must follow the required international prefix convention.
- Phone number verification is represented by `UserPhoneNumberVerification`.
- Phone number lifecycle is represented by `UserPhoneNumberStatus`.

## 7. Referential Actions

The relationship between `USERPHONENUMBER` and `USERS` uses:

- **ON UPDATE NO ACTION:** Prevents updating a referenced user identifier.
- **ON DELETE NO ACTION:** Prevents physically deleting a user while dependent phone number records exist.

User deletion is handled through the soft deletion lifecycle defined in `USERS`.

## 8. Lifecycle and Decision Finalization

The constraints defined above enforce the required data integrity rules for `USERPHONENUMBER`.

Phone number verification and status transitions are handled through controlled application or database operations where required.

Phone number changes must account for the Primary Key nature of `UserPhoneNumber`, since changing this value means changing the record's primary identifier.

---

# USER_ROLE — Constraints Documentation

## 1. Primary Key (PK)

**Attribute:** `UserRoleId`

- `UserRoleId` is the Primary Key.
- Uses `IDENTITY(1,1)` to automatically generate identity values.
- The Primary Key inherently enforces `UNIQUE` and `NOT NULL`.

**Reason:** Each user-role assignment must have a unique and stable identifier.

**Note:** IDENTITY generates values automatically but does not independently guarantee uniqueness. The Primary Key enforces uniqueness.

## 2. Foreign Keys (FK)

### 2.1 UserId

- `UserId` references `USERS(UserId)`.
- `UserId` must be `NOT NULL`.

**Referential Actions:**
- `ON DELETE NO ACTION`
- `ON UPDATE NO ACTION`

**Reason:** Every role assignment must belong to an existing user. User records are retained through soft deletion rather than physically deleted.

### 2.2 RoleId

- `RoleId` references `ROLES(RoleId)`.
- `RoleId` must be `NOT NULL`.

**Referential Actions:**
- `ON DELETE NO ACTION`
- `ON UPDATE NO ACTION`

**Reason:** Every role assignment must reference an existing role. Role records are retained through their lifecycle management rather than physically deleted.

## 3. NOT NULL Constraints

The following attributes must not accept NULL values:

- `UserRoleId`
- `UserId`
- `RoleId`
- `UserRoleStatus`
- `UserRoleActiveNow`

**Reason:** All attributes are required to maintain complete and valid user-role assignment records.

`UserRoleId` is already NOT NULL through its Primary Key.

## 4. UNIQUE Constraints

### 4.1 Composite UNIQUE Constraint

**Attributes:** `(UserId, RoleId)`

```sql
UNIQUE (UserId, RoleId)
```

**Rule:** The same user cannot be assigned the same role more than once.

**Reason:** Prevents duplicate role assignments while allowing a user to have multiple different roles.

## 5. CHECK Constraints

### 5.1 UserRoleStatus

**Rule:** The value must be one of the following predefined uppercase values:

| Value | Description |
|---|---|
| `PENDING` | The user-role assignment has been created and is awaiting completion of registration or activation. |
| `UNDERREVIEW` | The user-role assignment is currently undergoing review. |
| `ACTIVE` | The user-role assignment is active and available according to its permissions and business rules. |
| `DEACTIVATED` | The user-role assignment has been deactivated and is no longer active. |
| `DELETED` | The user-role assignment has been logically deleted and is no longer active. |

```sql
CHECK (
    UserRoleStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
)
```

**Reason:** Restricts assignment status values to the predefined lifecycle states and enforces uppercase values.

## 6. DEFAULT Constraints

### 6.1 UserRoleActiveNow

```sql
DEFAULT 0
```

**Rule:** Every newly created user-role assignment starts as not currently selected.

**Reason:** A newly assigned role must not automatically become the user's currently selected role.

## 7. Business Rule Constraints

### 7.1 Unique Role Assignment per User

- A user cannot have the same role assigned more than once.
- A user may have multiple different role assignments.
- The combination of `UserId` and `RoleId` must remain unique.

### 7.2 Currently Selected Active Role

**Attribute:** `UserRoleActiveNow`

- Indicates whether a role assignment is currently selected as the user's active role context.
- A value of `1` means the role is currently selected.
- A value of `0` means the role is not currently selected.
- Newly created assignments default to `0`.

### 7.3 Maximum One Currently Selected Role per User

**Rule:** Each user may have no more than one role assignment with `UserRoleActiveNow = 1`.

**Enforcement:** A filtered unique index must enforce this rule:

```sql
CREATE UNIQUE INDEX UX_UserRole_ActiveNow
ON USER_ROLE (UserId)
WHERE UserRoleActiveNow = 1;
```

**Reason:** Prevents a user from having multiple simultaneously selected active roles.

**Important:** This index guarantees at most one selected role per user. It does not guarantee that every user must always have one selected role.

### 7.4 Role Selection Changes

When a user switches their currently selected role:

1. The previously selected role assignment must be updated to `UserRoleActiveNow = 0`.
2. The newly selected role assignment must be updated to `UserRoleActiveNow = 1`.
3. Both updates must take place within one controlled transaction.
4. The transaction must roll back if the selection change fails.

**Reason:** Ensures that role selection remains consistent and prevents partially completed selection changes.

## 8. Referential Actions

The relationships between `USER_ROLE`, `USERS`, and `ROLES` use:

- **ON DELETE NO ACTION:** Prevents physically deleting referenced users or roles while dependent assignments exist.
- **ON UPDATE NO ACTION:** Prevents updating referenced user or role identifiers while dependent assignments exist.

Soft deletion and lifecycle management are handled through the respective status attributes.

## 9. Lifecycle and Decision Finalization

The constraints defined above enforce the required data integrity rules for `USER_ROLE`.

The table distinguishes between:

- **UserRoleStatus:** Represents the lifecycle state of the role assignment.
- **UserRoleActiveNow:** Represents whether the role assignment is currently selected by the user.

These two attributes serve different purposes and must not be treated as interchangeable.

Status transitions and role selection changes must be handled through controlled database operations where required.

---



---

# BUSINESS_INFORMATION_PHONENUMBER

## 1. Table Overview

The `BUSINESS_INFORMATION_PHONENUMBER` table stores phone numbers associated with business information records.

Each phone number is uniquely identified across the entire table and is associated with one `BusinessInformationId`.

## 2. Attributes

| Attribute | Data Type | Nullability | Description |
|---|---|---|---|
| `BusinessInformationPhoneNumber` | `NVARCHAR(25)` | NOT NULL | Primary key representing the business phone number. |
| `BusinessInformationId` | `BIGINT` | NOT NULL | Foreign key referencing the associated business information record. |
| `BusinessInformationPhoneNumberVerification` | `BIT` | NOT NULL | Indicates whether the phone number has been verified. |
| `BusinessInformationPhoneNumberStatus` | `VARCHAR(20)` | NOT NULL | Represents the current lifecycle status of the phone number. |

## 3. Primary Key (PK)

**Column:** `BusinessInformationPhoneNumber`

- The phone number is the primary key of the table.
- The primary key guarantees uniqueness and NOT NULL.
- Each phone number can appear only once across the entire table.
- The phone number is treated as the unique identifier of its record.

## 4. Foreign Key (FK)

**Column:** `BusinessInformationId`

**References:** `BUSINESS_INFORMATION(BusinessInformationId)`

- `BusinessInformationId` must reference an existing business information record.
- The column cannot accept NULL values.

### Referential Actions

| Action | Behavior |
|---|---|
| `ON DELETE NO ACTION` | Prevents physical deletion of a referenced business information record while dependent phone number records exist. |
| `ON UPDATE NO ACTION` | Prevents updating the referenced key while dependent phone number records exist. |

The system relies on **Soft Delete** rather than physical deletion.

## 5. NOT NULL Constraints

All attributes in this table are NOT NULL:

- `BusinessInformationPhoneNumber`
- `BusinessInformationId`
- `BusinessInformationPhoneNumberVerification`
- `BusinessInformationPhoneNumberStatus`

The primary key already guarantees NOT NULL for `BusinessInformationPhoneNumber`.

## 6. CHECK Constraints

### 6.1 Phone Number Format

**Rule:** The phone number must start with the `+` character.

**Enforcement:**

```sql
CHECK (
    LEN(BusinessInformationPhoneNumber) > 1
    AND LEFT(BusinessInformationPhoneNumber, 1) = '+'
)
```

This constraint validates the required prefix only. Full international phone number validation must be handled by the application layer or a dedicated validation library.

### 6.2 Phone Number Status

**Rule:** The status must contain one of the following predefined uppercase values:

- `PENDING`
- `UNDERREVIEW`
- `ACTIVE`
- `DEACTIVATED`
- `DELETED`

**Enforcement:**

```sql
CHECK (
    BusinessInformationPhoneNumberStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
)
```

The application layer is responsible for transforming input using `TRIM()` and `UPPER()`. The database constraint validates the stored value without transforming it.

## 7. Business Rule Constraints

### 7.1 Phone Number Uniqueness

**Rule:** A phone number can be associated with only one `BusinessInformationId` across the entire table.

**Enforcement:** The primary key on `BusinessInformationPhoneNumber` guarantees this rule.

**Reason:** The phone number is the independent identifier of each record and cannot be shared across multiple business information records under the current design.

### 7.2 Phone Number Changes

**Rule:** A business phone number may be changed.

The application must handle the update while preserving the integrity of the record. Since the phone number is the primary key, any future foreign key referencing it would introduce additional update dependencies.

## 8. DEFAULT Constraints

No DEFAULT constraints have been finalized for this table.

## 9. UNIQUE Constraints

No additional UNIQUE constraints are required.

The primary key on `BusinessInformationPhoneNumber` already guarantees uniqueness across the table.

## 10. Indexing

The primary key creates a unique index to enforce uniqueness and support lookups by `BusinessInformationPhoneNumber`.

Additional indexes have not yet been finalized.

## 11. Lifecycle and Decision Finalization

- Phone numbers are associated with business information records through `BusinessInformationId`.
- Each phone number can belong to only one business information record.
- Phone number records follow the Soft Delete policy.
- Physical deletion is restricted through `ON DELETE NO ACTION`.
- The phone number can be changed, but its primary key role must be considered when designing future dependencies.
- The phone number status follows the predefined lifecycle values.
- No additional phone-sharing limit is required because the primary key already prevents a phone number from appearing more than once in this table.

---

# BUSINESS_INFORMATION_EMAIL

## 1. Table Overview

The `BUSINESS_INFORMATION_EMAIL` table stores email addresses associated with business information records.

Each email address is associated with a business information record through `BusinessInformationId`. The same email address can be shared across multiple business information records, subject to a maximum sharing limit of three records.

## 2. Attributes

| Attribute | Data Type | Nullability | Description |
|---|---|---|---|
| `BusinessInformationId` | `BIGINT` | NOT NULL | Foreign key referencing the associated business information record. |
| `BusinessInformationEmail` | `NVARCHAR(320)` | NOT NULL | Email address associated with the business information record. |
| `BusinessInformationEmailVerification` | `BIT` | NOT NULL | Indicates whether the email address has been verified. |
| `BusinessInformationEmailStatus` | `VARCHAR(20)` | NOT NULL | Represents the current lifecycle status of the email address. |

## 3. Primary Key (PK)

**Columns:** `BusinessInformationId`, `BusinessInformationEmail`

The table uses a Composite Primary Key:

```sql
PRIMARY KEY (
    BusinessInformationId,
    BusinessInformationEmail
)
```

- Both columns are part of the primary key.
- The composite primary key guarantees uniqueness of each `BusinessInformationId` and `BusinessInformationEmail` combination.
- The same email address can be associated with different `BusinessInformationId` values.
- The same email address cannot be duplicated within the same business information record.
- Both columns are implicitly NOT NULL because they are part of the primary key.

## 4. Foreign Key (FK)

**Column:** `BusinessInformationId`

**References:** `BUSINESS_INFORMATION(BusinessInformationId)`

- `BusinessInformationId` must reference an existing business information record.
- The column cannot accept NULL values.

### Referential Actions

| Action | Behavior |
|---|---|
| `ON DELETE NO ACTION` | Prevents physical deletion of a referenced business information record while dependent email records exist. |
| `ON UPDATE NO ACTION` | Prevents updating the referenced key while dependent email records exist. |

The system relies on **Soft Delete** rather than physical deletion.

## 5. NOT NULL Constraints

All attributes in this table are NOT NULL:

- `BusinessInformationId`
- `BusinessInformationEmail`
- `BusinessInformationEmailVerification`
- `BusinessInformationEmailStatus`

The Composite Primary Key already guarantees NOT NULL for `BusinessInformationId` and `BusinessInformationEmail`.

## 6. CHECK Constraints

### 6.1 Email Address

No complete email-format CHECK constraint has been finalized.

Email format validation should be handled by the application layer or a dedicated validation mechanism.

### 6.2 Email Status

**Rule:** The status must contain one of the following predefined uppercase values:

- `PENDING`
- `UNDERREVIEW`
- `ACTIVE`
- `DEACTIVATED`
- `DELETED`

**Enforcement:**

```sql
CHECK (
    BusinessInformationEmailStatus COLLATE Latin1_General_100_BIN2
    IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'DEACTIVATED',
        'DELETED'
    )
)
```

The application layer is responsible for transforming input using `TRIM()` and `UPPER()`. The database constraint validates the stored value without transforming it.

## 7. Business Rule Constraints

### 7.1 Maximum Email Sharing Limit

**Rule:** The same email address can be associated with a maximum of three different `BusinessInformationId` records.

- The first three distinct business information records may use the same email address.
- A fourth business information record using that email address must be rejected.
- Duplicate use of the same email within one business information record is already prevented by the Composite Primary Key.

**Enforcement:**

The Composite Primary Key does not enforce the maximum sharing limit.

This rule requires a concurrency-safe enforcement mechanism, such as a controlled transaction with appropriate locking or a carefully implemented trigger.

**Reason:**

To allow limited email sharing while preventing an email address from being associated with more than three business information records.

### 7.2 Email Verification

`BusinessInformationEmailVerification` indicates whether the associated email address has been successfully verified.

The verification lifecycle and allowed transitions will be defined in the lifecycle documentation.

## 8. DEFAULT Constraints

No DEFAULT constraints have been finalized for this table.

## 9. UNIQUE Constraints

No additional UNIQUE constraints are required.

The Composite Primary Key already guarantees uniqueness of the combination:

`(BusinessInformationId, BusinessInformationEmail)`.

`BusinessInformationEmail` alone is intentionally not UNIQUE because the same email address is allowed across different business information records.

## 10. Indexing

The Composite Primary Key creates a unique index to enforce uniqueness of the column combination.

Additional indexes have not yet been finalized.

An additional index on `BusinessInformationEmail` may be considered to support email-sharing checks and email-based lookups.

## 11. Lifecycle and Decision Finalization

- Email records are associated with business information records through `BusinessInformationId`.
- The Composite Primary Key prevents duplicate email entries within the same business information record.
- The same email address may be shared across a maximum of three different business information records.
- The fourth association must be rejected.
- Email records follow the Soft Delete policy.
- Physical deletion of referenced business information records is restricted through `ON DELETE NO ACTION`.
- Email verification and status transitions will be defined in the lifecycle documentation.
- Whether email associations belonging to soft-deleted business information records count toward the maximum sharing limit remains unresolved and must be finalized in the lifecycle documentation.

---

# BUSINESS_INFORMATION — Constraints Documentation

## 1. Primary Key (PK)

### BusinessInformationId

- **Constraint:** `PRIMARY KEY`
- **Data Type:** `BIGINT`
- **Identity:** `IDENTITY(1,1)`
- **Nullability:** `NOT NULL`

**Rule:**

Each business information record must have a unique identifier.

**Enforcement:**

SQL Server automatically generates the identifier using `IDENTITY(1,1)`, while the primary key guarantees uniqueness and prevents NULL values.

**Reason:**

Provides a stable identifier for each business information record.

---

## 2. Foreign Key (FK)

### 2.1 UserRoleId

- **Constraint:** `FOREIGN KEY`
- **Nullability:** `NOT NULL`
- **Referenced Table:** `USER_ROLE`
- **Referenced Column:** `UserRoleId`

**Rule:**

Every business information record must belong to an existing user-role assignment.

**Enforcement:**

```sql
FOREIGN KEY (UserRoleId)
REFERENCES USER_ROLE(UserRoleId)
ON UPDATE NO ACTION
ON DELETE NO ACTION
```

**Reason:**

Prevents business information records from referencing non-existing user-role assignments.

### 2.2 CountryCode

- **Constraint:** `FOREIGN KEY`
- **Data Type:** `CHAR(2)`
- **Nullability:** `NOT NULL`
- **Referenced Table:** `BUSINESS_INFORMATION_COUNTRY`
- **Referenced Column:** `CountryCode`

**Rule:**

Every business information record must reference an existing country through `CountryCode`.

`CountryCode` cannot accept NULL values.

**Enforcement:**

```sql
FOREIGN KEY (CountryCode)
REFERENCES BUSINESS_INFORMATION_COUNTRY(CountryCode)
ON UPDATE NO ACTION
ON DELETE NO ACTION
```

**Referential Actions:**

| Action | Behavior |
|---|---|
| `ON DELETE NO ACTION` | Prevents physically deleting a country record while business information records reference it. |
| `ON UPDATE NO ACTION` | Prevents changing a country code while business information records reference it. |

**Reason:**

- Ensures that every business information record is associated with an existing country.
- Prevents invalid country references.
- Country codes are treated as stable identifiers and are not expected to change.
- The system uses Soft Delete rather than physical deletion. Therefore, country records must be retained instead of physically deleted while they are referenced.

**Implementation Note:**

`CountryCode` in `BUSINESS_INFORMATION_COUNTRY` must be a Primary Key or have a UNIQUE constraint to serve as the referenced key. Its key definition will be documented separately in the Keys document.

---

## 3. NOT NULL Constraints

The following attributes must always contain a value:

| Attribute | Rule |
|---|---|
| `BusinessInformationId` | NOT NULL (implied by PK) |
| `UserRoleId` | NOT NULL |
| `CountryCode` | NOT NULL |
| `BusinessInformationBusinessPostalCode` | NOT NULL |
| `BusinessInformationBusinessType` | NOT NULL |
| `BusinessInformationBusinessLegalName` | NOT NULL |
| `BusinessInformationBirthCertificateImage` | NOT NULL |
| `BusinessInformationNationalId` | NOT NULL |
| `BusinessInformationNationalIdCardImage` | NOT NULL |
| `CompanyRegistrationNumber` | NOT NULL |
| `BusinessInformationBusinessRegister` | NOT NULL |

**Rule:**

A business information record cannot be created without the required attributes listed above.

**Reason:**

These attributes are required according to the current business requirements.

---

## 4. UNIQUE Constraints

### 4.1 UserRoleId

- **Constraint:** `UNIQUE`

**Rule:**

Each `UserRoleId` can be associated with only one business information record.

**Enforcement:**

```sql
UNIQUE (UserRoleId)
```

**Reason:**

Enforces the currently established one-to-one relationship between `USER_ROLE` and `BUSINESS_INFORMATION`.

### 4.2 CountryCode and BusinessInformationNationalId

- **Constraint:** Composite `UNIQUE`

**Rule:**

A National ID must be unique within its issuing country.

The same National ID value may exist in another country.

**Enforcement:**

```sql
UNIQUE (
    CountryCode,
    BusinessInformationNationalId
)
```

**Reason:**

National ID numbering systems are generally managed independently by individual countries. Global uniqueness cannot be assumed.

### 4.3 CountryCode and CompanyRegistrationNumber

- **Constraint:** Composite `UNIQUE`

**Rule:**

A company registration number must be unique within its country.

The same registration number may exist in another country.

**Enforcement:**

```sql
UNIQUE (
    CountryCode,
    CompanyRegistrationNumber
)
```

**Reason:**

Company registration numbers are issued under country-specific registration systems.

**Design Note:**

If different registration authorities within the same country can issue overlapping numbers, the uniqueness scope may need to include the issuing authority.

### 4.4 Attributes Without UNIQUE Constraints

The following attributes do not have independent UNIQUE constraints under the current design:

- `BusinessInformationBusinessPostalCode`
- `BusinessInformationBusinessType`
- `BusinessInformationBusinessLegalName`
- `BusinessInformationBirthCertificateImage`
- `BusinessInformationNationalIdCardImage`
- `BusinessInformationBusinessRegister`

**Reason:**

Their values are not considered globally unique identifiers for business information records.

---

## 5. CHECK Constraints

### 5.1 Business Postal Code

**Attribute:** `BusinessInformationBusinessPostalCode`

**Rule:**

- Must not be empty or whitespace-only.
- Must not contain leading or trailing spaces.
- Internal spaces are allowed.

**Enforcement:**

```sql
CHECK (
    LEN(TRIM(BusinessInformationBusinessPostalCode)) > 0
)
```

```sql
CHECK (
    BusinessInformationBusinessPostalCode =
    TRIM(BusinessInformationBusinessPostalCode)
)
```

**Reason:**

Postal codes are alphanumeric identifiers and may contain internal spaces depending on the country's postal system.

**Validation Note:**

Country-specific postal code format validation is handled by the application layer.

### 5.2 Business Type

**Attribute:** `BusinessInformationBusinessType`

**Allowed Values:**

- `COMPANY`
- `ORGANIZATION`
- `INDIVIDUAL`

**Rule:**

The stored value must match one of the allowed uppercase values exactly.

**Application Layer:**

The application transforms input using:

```sql
TRIM(UPPER(value))
```

**Database Enforcement:**

```sql
CHECK (
    BusinessInformationBusinessType COLLATE Latin1_General_100_BIN2
    IN ('COMPANY', 'ORGANIZATION', 'INDIVIDUAL')
)
```

**Reason:**

Restricts business types to the predefined values and prevents invalid or differently cased values from being stored.

### 5.3 Business Legal Name

**Attribute:** `BusinessInformationBusinessLegalName`

**Rule:**

- Must not be empty.
- Must not contain only whitespace.
- Letters, numbers, spaces, and legal punctuation are allowed.
- Uppercase and lowercase letters are allowed.
- No UNIQUE constraint is applied.

**Enforcement:**

```sql
CHECK (
    LEN(TRIM(BusinessInformationBusinessLegalName)) > 0
)
```

**Reason:**

A legal business name is descriptive information and is not necessarily unique across different businesses or jurisdictions.

---

## 6. DEFAULT Constraints

No DEFAULT constraints have been finalized for this table.

All required values must be supplied through the approved application or database operations.

---

## 7. Business Rule Constraints

### 7.1 One Business Information Record Per User Role

**Rule:**

A single `UserRoleId` cannot have multiple business information records.

**Enforcement:**

A UNIQUE constraint on `UserRoleId`.

### 7.2 National ID Uniqueness Within a Country

**Rule:**

The same National ID cannot be assigned to two business information records within the same country.

**Enforcement:**

A composite UNIQUE constraint on:

- `CountryCode`
- `BusinessInformationNationalId`

### 7.3 Company Registration Number Uniqueness Within a Country

**Rule:**

The same Company Registration Number cannot be assigned to two business information records within the same country.

**Enforcement:**

A composite UNIQUE constraint on:

- `CountryCode`
- `CompanyRegistrationNumber`

### 7.4 Country-Specific Postal Code Validation

**Rule:**

Postal code format must comply with the relevant country's postal code system.

**Enforcement:**

Application-layer validation.

### 7.5 Business Type Validation

**Rule:**

Only the predefined business types are accepted.

**Enforcement:**

Application normalization and database CHECK constraint.

### 7.6 Country Reference Integrity

**Rule:**

Every business information record must reference a valid country through `CountryCode`.

**Enforcement:**

A NOT NULL foreign key referencing `BUSINESS_INFORMATION_COUNTRY(CountryCode)`.

The relationship uses `ON UPDATE NO ACTION` and `ON DELETE NO ACTION`.

---

## 8. Referential Actions

| Relationship | ON UPDATE | ON DELETE |
|---|---|---|
| `BUSINESS_INFORMATION.UserRoleId` → `USER_ROLE.UserRoleId` | NO ACTION | NO ACTION |
| `BUSINESS_INFORMATION.CountryCode` → `BUSINESS_INFORMATION_COUNTRY.CountryCode` | NO ACTION | NO ACTION |

**Rule:**

Referenced user-role assignments and country records cannot be physically updated or deleted while dependent business information records exist.

**Reason:**

Preserves referential integrity and prevents unintended changes to dependent records.

The system uses Soft Delete. Physical deletion is not part of the normal lifecycle.

---

## 9. Lifecycle and Decision Finalization

The following decisions are currently established:

1. `BusinessInformationId` is the primary key and uses `IDENTITY(1,1)`.
2. `UserRoleId` is NOT NULL, references `USER_ROLE`, and is UNIQUE.
3. `CountryCode` is NOT NULL and references `BUSINESS_INFORMATION_COUNTRY(CountryCode)`.
4. The country foreign key uses `ON UPDATE NO ACTION` and `ON DELETE NO ACTION`.
5. National ID is required and unique within its country through `(CountryCode, BusinessInformationNationalId)`.
6. Company Registration Number is required and unique within its country through `(CountryCode, CompanyRegistrationNumber)`.
7. Business Type is required and accepts only `COMPANY`, `ORGANIZATION`, or `INDIVIDUAL`.
8. Business Legal Name is required but not unique.
9. Business Postal Code is required and allows internal spaces.
10. The image and business register attributes are required.
11. No DEFAULT constraints have been finalized.
12. Country information is maintained in the separate `BUSINESS_INFORMATION_COUNTRY` table.

### Pending Naming and Validation Decisions

- The existing attribute name `BusinessInformationBirthCertificateImage` does not clearly describe the intended band image. Its final name must be corrected before implementation.
- The exact meaning and storage format of the band image must be confirmed.
- The registration authority may need to be included in the registration-number uniqueness scope if country-level uniqueness is insufficient.

**Status:** The country attribute has been replaced by `CountryCode`, and the country relationship is defined through a NOT NULL foreign key.

---

# BUSINESS_INFORMATION_COUNTRY — Constraints Documentation

## 1. Table Overview

The `BUSINESS_INFORMATION_COUNTRY` table stores country reference data used by `BUSINESS_INFORMATION`.

It maintains the country name and its corresponding country code. The `CountryCode` attribute is referenced by `BUSINESS_INFORMATION.CountryCode`.

## 2. Attributes

| Attribute | Data Type | Nullability | Description |
|---|---|---|---|
| `BusinessInformationBusinessCountry` | `NVARCHAR(100)` | NOT NULL | Stores the country name. |
| `CountryCode` | `CHAR(2)` | NOT NULL | Stores the country code used to identify the country and connect business information records to it. |

## 3. Primary Key (PK)

The Primary Key definition for `BUSINESS_INFORMATION_COUNTRY` will be documented separately in the Keys document.

`CountryCode` must be defined as a Primary Key or have a UNIQUE constraint before it can be referenced by the foreign key in `BUSINESS_INFORMATION`.

## 4. NOT NULL Constraints

The following attributes must not accept NULL values:

- `BusinessInformationBusinessCountry`
- `CountryCode`

**Rule:**

Every country reference record must contain both a country name and a country code.

**Reason:**

Both values are required to identify and reference a country consistently.

## 5. UNIQUE Constraints

No separate UNIQUE constraint is finalized in this document.

The key definition for `CountryCode`, including the uniqueness required for the foreign key relationship, will be documented in the separate Keys document.

## 6. CHECK Constraints

### 6.1 Business Country Name

**Rule:**

- The country name must not be empty.
- The country name must not contain only whitespace.
- Leading and trailing spaces are not allowed.

**Enforcement:**

```sql
CHECK (
    LEN(TRIM(BusinessInformationBusinessCountry)) > 0
)
```

```sql
CHECK (
    BusinessInformationBusinessCountry =
    TRIM(BusinessInformationBusinessCountry)
)
```
```
CHECK (
    CountryCode COLLATE Latin1_General_100_BIN2 IN (
        'EG',
        'US',
        'GB',
        'SA',
        'AE',
        'FR',
        'DE'
        -- Add the remaining approved country codes
    )
)
```

**Reason:**

Prevents empty country names and avoids inconsistent values caused by leading or trailing spaces.

### 6.2 CountryCode

**Rule:**

The country code must contain exactly two uppercase English letters.

**Enforcement:**

```sql
CHECK (
    CountryCode COLLATE Latin1_General_100_BIN2
    NOT LIKE '%[^A-Z]%'
)
```

**Reason:**

Ensures that the stored code follows the selected two-character uppercase format.

**Validation Note:**

The CHECK constraint validates the code's format only. It does not verify that the code represents an officially recognized country. The country reference records must be populated and maintained using the approved country list.

## 7. DEFAULT Constraints

No DEFAULT constraints have been finalized for this table.

Country names and country codes must be supplied when country reference records are created.

## 8. Business Rule Constraints

### 8.1 Country Reference Data

- Each record represents a country.
- Each country record must have a country name and a country code.
- `CountryCode` is used by `BUSINESS_INFORMATION` to reference the corresponding country.
- Country codes are treated as stable identifiers and are not expected to change.

### 8.2 Country Record Retention

- Country records must be retained while business information records reference them.
- Physical deletion of a referenced country is prevented by the foreign key's `ON DELETE NO ACTION` action.
- Country records are not physically deleted as part of the normal system lifecycle.

## 9. Referential Actions

The relationship is defined from:

`BUSINESS_INFORMATION.CountryCode`

to:

`BUSINESS_INFORMATION_COUNTRY.CountryCode`

| Action | Behavior |
|---|---|
| `ON UPDATE NO ACTION` | Prevents changing a referenced country code while business information records reference it. |
| `ON DELETE NO ACTION` | Prevents physically deleting a country record while business information records reference it. |

The foreign key is defined on the `BUSINESS_INFORMATION` table. This table is the referenced parent table.

## 10. Lifecycle and Decision Finalization

1. `BUSINESS_INFORMATION_COUNTRY` stores country names and country codes.
2. `BusinessInformationBusinessCountry` uses `NVARCHAR(100)`.
3. `CountryCode` uses `CHAR(2)` and must not accept NULL.
4. The key definition for `CountryCode` will be documented separately.
5. `BUSINESS_INFORMATION.CountryCode` is a NOT NULL foreign key referencing this table.
6. The foreign key uses `ON UPDATE NO ACTION` and `ON DELETE NO ACTION`.
7. Country codes are treated as stable and are not expected to change.
8. Physical deletion of referenced country records is prevented. The system relies on Soft Delete rather than physical deletion.

**Status:** Country reference table and its relationship with `BUSINESS_INFORMATION` are documented. Primary Key details remain in the separate Keys document.
