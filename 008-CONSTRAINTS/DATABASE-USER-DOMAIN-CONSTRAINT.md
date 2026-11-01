# Database Constraints Documentation

This document defines the constraints applied to the `USERS`, `ROLES`, `USERPHONENUMBER`, and `ROLE_CATEGORIES` tables to enforce data integrity and business rules.

---

## 1. USERS Table

### 1.1 UserId
- **PRIMARY KEY**
- **NOT NULL**
- **IDENTITY(1,1)**

Ensures that every user has a unique, automatically generated identifier.

### 1.2 UserFirstName
- **NOT NULL**

Every user must have a first name.

### 1.3 UserLastName
- NULL is allowed.

### 1.4 UserMiddleName
- NULL is allowed.

### 1.5 UserAccountStatus
- **NOT NULL**
- **CHECK CONSTRAINT**

The value must belong to the predefined list of allowed account statuses.

### 1.6 UserDeletedAt
- **NOT NULL conditionally**

This attribute must contain a value when `UserAccountStatus = 'DELETED'`.

It must be NULL when the account is not deleted.

### 1.7 UserDeletedAtReason
- **NOT NULL conditionally**
- **CHECK CONSTRAINT**

The attribute must contain one of the predefined deletion reasons when the account is deleted.

It must be NULL when the account is not deleted.

### 1.8 UserDeletedTextReason
- **NOT NULL conditionally**
- **CHECK CONSTRAINT**

A text reason must be provided when `UserDeletedAtReason = 'OTHER'`.

The text must contain more than one character and must not consist only of whitespace.

It must be NULL for all other deletion reasons.

### 1.9 UserPasswordHash
- **NOT NULL**

Every user must have a stored password hash.

### 1.10 UserEmail
- **NOT NULL**
- **UNIQUE**

Every user must have an email address, and the same email address cannot be assigned to multiple users.

### 1.11 UserEmailVerification
- **NOT NULL**

Every user must have an email verification status.

### 1.12 UserGender
- NULL is allowed.

### 1.13 UserCreatedAt
- **NOT NULL**
- **DEFAULT: SYSDATETIME()**

Automatically assigns the current database server date and time when a user is created, unless a value is explicitly provided.

### 1.14 UserBirthDate
- NULL is allowed.
- A future birth date must not be accepted.

### 1.15 UserRecoveryEmail
- NULL is allowed.
- If provided, the recovery email must follow the defined email validation rules.

### 1.16 UserRecoveryEmailVerification
- **NOT NULL conditionally**

The verification status must be provided when `UserRecoveryEmail` has a value.

It must be NULL when `UserRecoveryEmail` is NULL.

---

## 2. ROLES Table

### 2.1 RoleId
- **PRIMARY KEY**
- **NOT NULL**
- **IDENTITY(1,1)**

Ensures that every role has a unique, automatically generated identifier.

### 2.2 RoleCategoryName
- **NOT NULL**
- **FOREIGN KEY** referencing `ROLE_CATEGORIES(RoleCategoryName)`.
- **ON UPDATE CASCADE**
- **ON DELETE NO ACTION**

Business rules:

- A role must belong to an existing role category.
- When a category name is updated, the corresponding foreign key values in `ROLES` are updated automatically.
- A category cannot be physically deleted while roles reference it.

### 2.3 RoleName
- **NOT NULL**
- **UNIQUE**

Every role must have a name.

Role names must be unique across the entire `ROLES` table, regardless of their associated categories.

### 2.4 RoleStatus
- **NOT NULL**
- **CHECK CONSTRAINT**

The value must belong to the predefined list of allowed role statuses.

### 2.5 RoleCreatedAt
- **NOT NULL**
- **DEFAULT: SYSDATETIME()**

Automatically assigns the current database server date and time when a role is created.

---

## 3. USERPHONENUMBER Table

### 3.1 UserId
- **NOT NULL**
- **FOREIGN KEY** referencing `USERS(UserId)`.
- **ON UPDATE NO ACTION**
- **ON DELETE NO ACTION**

Business rules:

- Every phone number must belong to an existing user.
- A user cannot be physically deleted while associated phone number records exist.
- Users are managed through the soft-delete mechanism rather than physical deletion.

### 3.2 UserPhoneNumber
- **NOT NULL**
- **UNIQUE**
- **CHECK CONSTRAINT**

Business rules:

- Every phone number must be unique across the system.
- Phone numbers must use the international format.
- The first character must be the `+` operator.

### 3.3 UserPhoneNumberVerification
- **NOT NULL**
- **BIT**

Stores whether the phone number has been verified.

### 3.4 UserPhoneNumberStatus
- **NOT NULL**
- **CHECK CONSTRAINT**

The value must belong to the predefined list of allowed phone number statuses.

---

## 4. ROLE_CATEGORIES Table

### 4.1 RoleCategoryName
- **PRIMARY KEY**
- **NOT NULL**
- **UNIQUE**

Every role category must have a unique name.

### 4.2 RoleCategoryStatus
- **NOT NULL**
- **CHECK CONSTRAINT**

The value must belong to the predefined list of allowed role category statuses.

### 4.3 RoleCategoryCreatedAt
- **NOT NULL**
- **DEFAULT: SYSDATETIME()**

Automatically assigns the current database server date and time when a role category is created.

### 4.4 RoleCategoryManager
- **NOT NULL**
- **NVARCHAR(50)**

Stores the role category manager's name as manually entered text.

This attribute does not reference the `USERS` table because the manager's name is maintained as descriptive information rather than as a database relationship.

---

## 5. General Business Rules

The following rules apply across the documented tables:

1. Users are managed through soft deletion rather than physical deletion.
2. A deleted user must have a deletion timestamp and a deletion reason.
3. A textual deletion reason is mandatory only when the deletion reason is `OTHER`.
4. Role names must be unique across the entire `ROLES` table.
5. Every role must reference an existing role category.
6. Role category names can be updated, and the change cascades to referencing roles.
7. A role category cannot be physically deleted while referenced by existing roles.
8. User phone numbers must be globally unique and stored in international format.
9. Created-at attributes receive their default values through `SYSDATETIME()`.

---

## 6. Implementation Notes

- Conditional requirements must be enforced using appropriate `CHECK` constraints.
- `DEFAULT` constraints do not replace `NOT NULL` constraints.
- `CHECK` constraints must be designed to handle SQL Server's NULL behavior correctly.
- String validation must account for whitespace-only values.
- Phone number validation based only on the first character does not guarantee that the entire international phone number is valid.
- Allowed status values and deletion reasons must be explicitly defined during SQL implementation.
- Physical deletion policies must be enforced through appropriate database permissions and application logic in addition to foreign key constraints.

---

# USER_ROLE Table — Constraints Documentation

This document defines the constraints applied to the `USER_ROLE` table to enforce referential integrity, data integrity, and business rules governing user-role assignments.

---

## 1. UserRoleId

- **PRIMARY KEY**
- **NOT NULL**
- **IDENTITY(1,1)**

Ensures that every user-role assignment has a unique, automatically generated identifier.

## 2. UserId

- **NOT NULL**
- **FOREIGN KEY** referencing `USERS(UserId)`.
- **ON UPDATE NO ACTION**
- **ON DELETE NO ACTION**

Business Rules:

- Every user-role assignment must belong to an existing user.
- A user cannot be physically deleted while dependent user-role records exist.
- Users are managed through the soft-delete mechanism rather than physical deletion.

## 3. RoleId

- **NOT NULL**
- **FOREIGN KEY** referencing `ROLES(RoleId)`.
- **ON UPDATE NO ACTION**
- **ON DELETE NO ACTION**

Business Rules:

- Every user-role assignment must reference an existing role.
- A role cannot be physically deleted while dependent user-role records exist.

## 4. UserRoleStatus

- **NOT NULL**
- **CHECK CONSTRAINT**

The value must belong to the predefined list of allowed user-role assignment statuses.

The allowed values will be explicitly defined during SQL implementation.

## 5. UserRoleActiveNow

- **NOT NULL**
- **DEFAULT: 0**
- **BIT**

Indicates whether the assigned role is currently selected as the user's active role.

### Business Rules

1. A new user-role assignment must have `UserRoleActiveNow = 0` by default.
2. A user can have multiple assigned roles.
3. A user can have only one currently selected active role at a time.
4. When a user switches to another role, the previously selected role must be deactivated (`0`), and the newly selected role must be activated (`1`).
5. The selected role must have an eligible assignment status.
6. The active role selection must follow the system's role-selection rules.

### Database-Level Enforcement

A **UNIQUE FILTERED INDEX** is used to enforce the rule that each user can have no more than one currently selected active role.

```sql
CREATE UNIQUE INDEX UX_UserRole_ActiveNow
ON USER_ROLE (UserId)
WHERE UserRoleActiveNow = 1;
```

This index:

- Applies only to rows where `UserRoleActiveNow = 1`.
- Ensures that each user has no more than one selected active role.
- Prevents multiple rows belonging to the same user from having `UserRoleActiveNow = 1` simultaneously.
- Allows users to have multiple assigned roles as long as only one is currently selected.

### Role Switching

When a user selects another role, the active role must be switched within a database transaction.

The transaction must:

1. Deactivate the previously selected role by setting `UserRoleActiveNow = 0`.
2. Activate the newly selected role by setting `UserRoleActiveNow = 1`.
3. Commit both operations together if they succeed.
4. Roll back the transaction if an error occurs.

This ensures that the role-switching operation is handled atomically and prevents inconsistent intermediate states from being committed.

### Important Notes

- The unique filtered index guarantees that a user cannot have more than one selected active role.
- It does not guarantee that every user must have an active role.
- It does not replace the need for transaction management during role switching.
- The index is a database-level integrity mechanism, not a traditional `CHECK CONSTRAINT`.

---

## 6. Composite Uniqueness

- **UNIQUE (UserId, RoleId)**

Prevents assigning the same role to the same user more than once.

### Business Rules

1. A user cannot have duplicate assignments for the same role.
2. Each user-role combination must be unique.
3. This constraint also means that a soft-deleted assignment cannot be recreated for the same user-role pair unless the uniqueness policy is revised.

---

## 7. General Business Rules

1. Every user-role assignment must reference an existing user and an existing role.
2. Physical deletion of users and roles is restricted while dependent records exist.
3. Users and role assignments are managed through their respective status and soft-delete mechanisms.
4. Every user-role assignment must have a valid status.
5. New assignments are not automatically selected as the user's active role.
6. A user can have multiple assigned roles but no more than one currently selected active role.
7. Switching the active role must be performed as an atomic database transaction.
8. The database must prevent duplicate user-role assignments.

---

## 8. Implementation Notes

- Conditional requirements must be enforced using appropriate database constraints or additional database-level mechanisms.
- `DEFAULT` constraints do not replace `NOT NULL` constraints.
- `CHECK` constraints must be designed to handle SQL Server's NULL behavior correctly.
- Unique filtered indexes are used when uniqueness must apply only to rows satisfying a specific filter condition.
- Transaction management is required for operations that modify multiple related rows as one logical operation.
- Soft deletion must be distinguished from physical deletion.
- The unique filtered index enforces a maximum of one active role per user, not a minimum of one.

---

# BUSINESS_INFORMATION_PHONENUMBER

## 1. Entity Description

The `BUSINESS_INFORMATION_PHONENUMBER` entity stores phone numbers associated with business information profiles.

Each record represents one phone number belonging to a specific business information profile.

## 2. Attributes

| Attribute | Description |
|---|---|
| `BusinessInformationPhoneNumber` | The phone number itself and the primary identifier of the record. |
| `BusinessInformationId` | Identifies the business information profile associated with the phone number. |
| `BusinessInformationPhoneNumberVerification` | Indicates whether the phone number has been verified. |
| `BusinessInformationPhoneNumberStatus` | Represents the current status of the phone number. |

## 3. Relationships and Cardinality

### BUSINESS_INFORMATION — BUSINESS_INFORMATION_PHONENUMBER

- One `BUSINESS_INFORMATION` record can have multiple phone numbers.
- Each `BUSINESS_INFORMATION_PHONENUMBER` record must belong to exactly one `BUSINESS_INFORMATION` record.

**Cardinality:** One-to-Many (1:N).

## 4. Keys

### Primary Key (PK)

`BusinessInformationPhoneNumber`

- The phone number itself is used as the primary key.
- It uniquely identifies each record.
- It cannot contain NULL values.
- Its uniqueness and non-nullability are enforced automatically by the primary key constraint.

### Foreign Key (FK)

`BusinessInformationId`

- References `BUSINESS_INFORMATION(BusinessInformationId)`.
- Ensures that every phone number belongs to an existing business information record.

## 5. Functional Dependencies

The primary functional dependency is:

`BusinessInformationPhoneNumber → BusinessInformationId, BusinessInformationPhoneNumberVerification, BusinessInformationPhoneNumberStatus`

The phone number determines the remaining attributes of its record because it uniquely identifies that record.

## 6. Relationship Implementation and Foreign Key Rules

### Foreign Key

`BusinessInformationId` references:

`BUSINESS_INFORMATION(BusinessInformationId)`

**Referential Actions:**

- `ON UPDATE NO ACTION`
- `ON DELETE NO ACTION`

These actions prevent changes to or physical deletion of a referenced parent record while dependent phone number records exist.

The design follows a soft-delete approach rather than relying on physical deletion.

## 7. Normalization

### First Normal Form (1NF)

- Each attribute contains a single value.
- Each record represents one phone number.
- No repeating groups or multi-valued attributes are stored within a single record.

### Second Normal Form (2NF)

The primary key consists of a single attribute. Therefore, partial functional dependencies cannot exist.

### Third Normal Form (3NF)

The non-key attributes depend directly on the primary key. No transitive dependencies have been identified.

## 8. Edge Cases and Business Rules

- A phone number must be globally unique within this table.
- A phone number cannot be associated with more than one record.
- A phone number must be stored in international format and begin with `+`.
- The phone number is the record's primary identifier.
- Changing a phone number changes the primary key value of its record.
- The phone number is not referenced by other tables, and no dependent records rely on it as a foreign key.
- A phone number must belong to an existing business information profile.
- Phone number verification and status are maintained independently.

## 9. Data Types

| Attribute | Data Type | Nullability |
|---|---|---|
| `BusinessInformationPhoneNumber` | `NVARCHAR(25)` | NOT NULL |
| `BusinessInformationId` | `BIGINT` | NOT NULL |
| `BusinessInformationPhoneNumberVerification` | `BIT` | NOT NULL |
| `BusinessInformationPhoneNumberStatus` | `VARCHAR(20)` | NOT NULL |

## 10. Constraints

### Primary Key Constraint

- `BusinessInformationPhoneNumber` is the primary key.
- The primary key automatically enforces uniqueness and non-nullability.

### Foreign Key Constraint

- `BusinessInformationId` references `BUSINESS_INFORMATION(BusinessInformationId)`.
- `ON UPDATE NO ACTION`.
- `ON DELETE NO ACTION`.

### Phone Number Format Constraint

- The phone number must begin with the `+` character.
- This basic format rule can be enforced using a `CHECK` constraint.
- Full international phone number validation should be handled by application-level validation or a dedicated phone-number validation library.

### Verification Constraint

- `BusinessInformationPhoneNumberVerification` must not be NULL.

### Status Constraint

- `BusinessInformationPhoneNumberStatus` must not be NULL.
- Its allowed values must be explicitly defined through a `CHECK` constraint based on the agreed business statuses.

## 11. Indexing

- The primary key automatically creates a unique index on `BusinessInformationPhoneNumber` in SQL Server, unless the index configuration specifies otherwise.
- An additional index on `BusinessInformationId` should be considered to support queries that retrieve all phone numbers belonging to a specific business information profile.

## 12. Lifecycle and Decision Finalization

### Lifecycle

A phone number record is created and associated with a business information profile. Its verification state and status can change throughout its lifecycle.

If the phone number changes, the primary key value of the record is updated.

### Final Design Decision

The phone number itself is intentionally selected as the primary key instead of introducing a separate surrogate identifier.

This decision is based on the following business assumptions:

1. Phone numbers are globally unique within this entity.
2. No other table references the phone number.
3. No dependent records rely on the phone number as a foreign key.
4. Changing the phone number does not require updating references in other tables.
5. A separate, stable identifier independent of the phone number is not required by the current business rules.

If any of these assumptions changes in the future, the primary key decision must be reviewed.

---

# BUSINESS_INFORMATION_EMAIL

## 1. Entity Description

The `BUSINESS_INFORMATION_EMAIL` entity stores email addresses associated with business information profiles.

Each record represents one email address associated with one business information profile.

## 2. Attributes

| Attribute | Description |
|---|---|
| `BusinessInformationId` | Identifies the business information profile associated with the email address. |
| `BusinessInformationEmail` | Stores the email address associated with the business information profile. |
| `BusinessInformationEmailVerification` | Indicates whether the email address has been verified. |
| `BusinessInformationEmailStatus` | Represents the current status of the email address. |

## 3. Relationships and Cardinality

### BUSINESS_INFORMATION — BUSINESS_INFORMATION_EMAIL

- One `BUSINESS_INFORMATION` record can have multiple email addresses.
- Each `BUSINESS_INFORMATION_EMAIL` record must belong to exactly one `BUSINESS_INFORMATION` record.
- The same email address may be associated with multiple business information profiles.

**Cardinality:** One-to-Many (1:N).

## 4. Keys

### Composite Primary Key (PK)

The primary key consists of:

`(BusinessInformationId, BusinessInformationEmail)`

- Both attributes are NOT NULL.
- The combination uniquely identifies each record.
- The same email address cannot be repeated within the same business information profile.
- The same email address may be associated with different business information profiles.
- `BusinessInformationEmail` does not have an independent UNIQUE constraint.

### Foreign Key (FK)

`BusinessInformationId`

- References `BUSINESS_INFORMATION(BusinessInformationId)`.
- Ensures that every email record belongs to an existing business information profile.

## 5. Functional Dependencies

The primary functional dependency is:

`(BusinessInformationId, BusinessInformationEmail) → BusinessInformationEmailVerification, BusinessInformationEmailStatus`

The combination of `BusinessInformationId` and `BusinessInformationEmail` determines the remaining attributes.

## 6. Relationship Implementation and Foreign Key Rules

### Foreign Key

`BusinessInformationId` references:

`BUSINESS_INFORMATION(BusinessInformationId)`

**Referential Actions:**

- `ON UPDATE NO ACTION`
- `ON DELETE NO ACTION`

The design follows a soft-delete approach rather than relying on physical deletion.

## 7. Normalization

### First Normal Form (1NF)

- Each attribute contains a single value.
- Each record represents one email address associated with one business information profile.
- No repeating groups or multi-valued attributes are stored within a single record.

### Second Normal Form (2NF)

The non-key attributes depend on the entire composite primary key.

No partial dependencies have been identified.

### Third Normal Form (3NF)

The non-key attributes depend directly on the composite primary key.

No transitive dependencies have been identified.

## 8. Edge Cases and Business Rules

- An email address cannot be repeated within the same business information profile.
- An email address may be shared across different business information profiles.
- An email address can be associated with a maximum of three different business information profiles.
- Every email record must belong to an existing business information profile.
- Verification state and email status are maintained independently.
- Soft deletion is used instead of physical deletion.

**Important:** The composite primary key prevents duplicate email associations within the same profile. However, it does not enforce the maximum limit of three different profiles per email address. This rule requires additional database-level enforcement.

## 9. Data Types

| Attribute | Data Type | Nullability |
|---|---|---|
| `BusinessInformationId` | `BIGINT` | NOT NULL |
| `BusinessInformationEmail` | `NVARCHAR(320)` | NOT NULL |
| `BusinessInformationEmailVerification` | `BIT`

---

# BUSINESS_INFORMATION — Constraints

## 1. Primary Key Constraint (PK)

- `BusinessInformationId` must be NOT NULL.
- `BusinessInformationId` is the Primary Key.
- `BusinessInformationId` uses `IDENTITY(1,1)` to generate values automatically.
- The primary key guarantees uniqueness and non-nullability.

## 2. Foreign Key Constraint (FK)

- `UserRoleId` must be NOT NULL.
- `UserRoleId` references `USER_ROLE(UserRoleId)`.
- `ON UPDATE NO ACTION`.
- `ON DELETE NO ACTION`.

**Reason:** The database follows a soft-delete approach, so physical deletion and cascading deletion are not intended.

## 3. Business Country Constraint

- `BusinessInformationBusinessCountry` must be NOT NULL.
- Its length must be greater than one character.
- A `CHECK` constraint must enforce this rule.

```sql
CHECK (LEN(BusinessInformationBusinessCountry) > 1)
```

## 4. Business Postal Code Constraint

- `BusinessInformationBusinessPostalCode` must be NOT NULL.

No additional format restriction is defined at this stage.

## 5. Business Type Constraint

- `BusinessInformationBusinessType` must be NOT NULL.
- Its value must be one of the following:

```sql
CHECK (
    BusinessInformationBusinessType IN (
        'COMPANY',
        'INDIVIDUAL',
        'STORE'
    )
)
```

## 6. Remaining NOT NULL Constraints

The following attributes must be NOT NULL:

- `CompanyRegistrationNumber`
- `BusinessInformationBusinessLegalName`
- `BusinessInformationBirthCertificateImage`
- `BusinessInformationNationalId`
- `BusinessInformationNationalIdCardImage`
- `BusinessInformationBusinessRegister`

## 7. Final Constraint Summary

| Attribute | Constraint |
|---|---|
| `BusinessInformationId` | PK, NOT NULL, IDENTITY(1,1) |
| `UserRoleId` | NOT NULL, FK, ON UPDATE NO ACTION, ON DELETE NO ACTION |
| `CompanyRegistrationNumber` | NOT NULL |
| `BusinessInformationBusinessCountry` | NOT NULL, CHECK LEN > 1 |
| `BusinessInformationBusinessPostalCode` | NOT NULL |
| `BusinessInformationBusinessType` | NOT NULL, CHECK allowed values |
| `BusinessInformationBusinessLegalName` | NOT NULL |
| `BusinessInformationBirthCertificateImage` | NOT NULL |
| `BusinessInformationNationalId` | NOT NULL |
| `BusinessInformationNationalIdCardImage` | NOT NULL |
| `BusinessInformationBusinessRegister` | NOT NULL |



