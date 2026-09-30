# Database Relationships and Schema Design

## 1. User ↔ Role

### Relationship

The relationship between **User** and **Role** is **Many-to-Many (M:N)**:

* A **User** can have multiple Roles.
* A **Role** can belong to multiple Users.
* A Role is **not required to have Users**.
* However, every User **must have at least one Role**.

Therefore:

```text
User (1..*) ↔ Role (0..*)
```

Because this is a many-to-many relationship, we need a **Junction Table**.

### Junction Table: `UserRole`

The `UserRole` table is the intermediate table between `User` and `Role`.

| Column       | Description                                      | Key                    |
| ------------ | ------------------------------------------------ | ---------------------- |
| `UserRoleId` | Unique identifier for the user-role relationship | **PK**                 |
| `UserId`     | References the user                              | **FK** → `User.UserId` |
| `RoleId`     | References the role                              | **FK** → `Role.RoleId` |

`UserRoleId` is a **surrogate key** and is used as the primary key.

### Structure

```text
User
  |
  | 1
  |
  | 0..*
UserRole
  |
  | 0..*
  |
  | 1
Role
```

> **Important:** The `UserRole` table guarantees the many-to-many relationship while allowing each User to have multiple Roles.

---

# 2. Role ↔ Role Category

### Relationship

A **Role Category** can contain multiple Roles, while each Role belongs to exactly one Role Category.

Therefore, the relationship is:

```text
RoleCategory (1) → (0..*) Role
```

### `Role` Table

The `Role` table contains:

| Column           | Description                    | Key                                    |
| ---------------- | ------------------------------ | -------------------------------------- |
| `RoleId`         | Unique identifier for the role | **PK**                                 |
| `RoleCategoryId` | References the role category   | **FK** → `RoleCategory.RoleCategoryId` |

### Structure

```text
RoleCategory
     |
     | 1
     |
     | 0..*
Role
```

Each Role must have one `RoleCategory`, while a Role Category may have zero or many Roles.

---

# 3. Role Category

The `RoleCategory` table has a relationship with the `Role` table.

### `RoleCategory` Table

| Column           | Description                             | Key    |
| ---------------- | --------------------------------------- | ------ |
| `RoleCategoryId` | Unique identifier for the role category | **PK** |

The `RoleCategoryId` is the primary key of the table.

---

# 4. User Phone Number

A User can have multiple phone numbers.

Since phone number is a **Multi-Valued Attribute**, it should not be stored directly as multiple columns in the `User` table.

Instead, we create a separate table.

### `UserPhoneNumber` Table

| Column            | Description                          | Key                    |
| ----------------- | ------------------------------------ | ---------------------- |
| `UserId`          | References the user                  | **FK** → `User.UserId` |
| `UserPhoneNumber` | A phone number belonging to the user | **PK**                 |

The primary key is a **Composite Primary Key**:

```text
(UserId, UserPhoneNumber)
```

### Structure

```text
User
 |
 | 1
 |
 | 0..*
UserPhoneNumber
```

This allows one User to have multiple phone numbers while preventing duplicate phone numbers for the same User.

---

# 5. Business Information ↔ User Role

The `BusinessInformation` table is related to the `UserRole` table.

The relationship is:

```text
UserRole (0..1) ↔ (1) BusinessInformation
```

### Meaning

* A `UserRole` may have **zero or one** `BusinessInformation`.
* Every `BusinessInformation` record must belong to **exactly one** `UserRole`.

Therefore:

* `UserRole` side → **Optional, One**
* `BusinessInformation` side → **Mandatory, One**

### `BusinessInformation` Table

| Column                  | Description                                   | Key                            |
| ----------------------- | --------------------------------------------- | ------------------------------ |
| `BusinessInformationId` | Unique identifier for business information    | **PK**                         |
| `UserRoleId`            | References the related user-role relationship | **FK** → `UserRole.UserRoleId` |

### Important Constraint

Because each `UserRole` can have at most one `BusinessInformation`, the `UserRoleId` should also be **UNIQUE** in the `BusinessInformation` table.

Conceptually:

```text
BusinessInformation
-------------------
BusinessInformationId  PK
UserRoleId             FK + UNIQUE
```

The `UNIQUE` constraint ensures that the same `UserRole` cannot have multiple Business Information records.

---

# 6. Business Information Phone

Business phone numbers are also a **Multi-Valued Attribute**.

Therefore, they should be stored in a separate table rather than having multiple phone columns inside `BusinessInformation`.

### `BusinessInformationPhone` Table

| Column                     | Description                              | Key                                                  |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| `BusinessInformationId`    | References the business information      | **FK** → `BusinessInformation.BusinessInformationId` |
| `BusinessInformationPhone` | A phone number belonging to the business | **PK**                                               |

The primary key is a **Composite Primary Key**:

```text
(BusinessInformationId, BusinessInformationPhone)
```

### Structure

```text
BusinessInformation
        |
        | 1
        |
        | 0..*
BusinessInformationPhone
```

This allows one Business Information record to have multiple phone numbers.

---

# 7. Business Information Email

Business emails are also a **Multi-Valued Attribute**.

Therefore, they should be stored in a separate table.

### `BusinessInformationEmail` Table

| Column                     | Description                                | Key                                                  |
| -------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| `BusinessInformationId`    | References the business information        | **FK** → `BusinessInformation.BusinessInformationId` |
| `BusinessInformationEmail` | An email address belonging to the business | **PK**                                               |

The primary key is a **Composite Primary Key**:

```text
(BusinessInformationId, BusinessInformationEmail)
```

### Structure

```text
BusinessInformation
        |
        | 1
        |
        | 0..*
BusinessInformationEmail
```

This allows one Business Information record to have multiple email addresses.

---

# 8. Complete Relationship Overview

The complete database structure can be summarized as follows:

```text
                         RoleCategory
                              |
                              | 1
                              |
                              | 0..*
                             Role
                              |
                              | 1
                              |
                              | 0..*
User ────────< UserRole >─────┘
  |               |
  |               |
  |               | 0..1
  |               |
  |               | 1
  |        BusinessInformation
  |               |
  |               |
  |               ├──────< BusinessInformationPhone
  |               |
  |               └──────< BusinessInformationEmail
  |
  └──────< UserPhoneNumber
```

---

# 9. Final Tables and Keys

| Table                      | Primary Key                                        | Foreign Keys            |
| -------------------------- | -------------------------------------------------- | ----------------------- |
| `User`                     | `UserId`                                           | —                       |
| `Role`                     | `RoleId`                                           | `RoleCategoryId`        |
| `RoleCategory`             | `RoleCategoryId`                                   | —                       |
| `UserRole`                 | `UserRoleId`                                       | `UserId`, `RoleId`      |
| `UserPhoneNumber`          | `UserId + UserPhoneNumber`                         | `UserId`                |
| `BusinessInformation`      | `BusinessInformationId`                            | `UserRoleId`            |
| `BusinessInformationPhone` | `BusinessInformationId + BusinessInformationPhone` | `BusinessInformationId` |
| `BusinessInformationEmail` | `BusinessInformationId + BusinessInformationEmail` | `BusinessInformationId` |

---

# 10. Key Design Decisions

### Surrogate Key

The `UserRole` table uses:

```text
UserRoleId
```

as a **surrogate primary key**.

This means the primary key is an artificially generated identifier rather than a combination of the foreign keys.

---

### Composite Primary Keys

The following tables use composite primary keys because their records are uniquely identified by the combination of the parent ID and the multi-valued attribute:

```text
UserPhoneNumber
PK = (UserId, UserPhoneNumber)
```

```text
BusinessInformationPhone
PK = (BusinessInformationId, BusinessInformationPhone)
```

```text
BusinessInformationEmail
PK = (BusinessInformationId, BusinessInformationEmail)
```

---

### Foreign Key Summary

```text
Role.RoleCategoryId
        ↓
RoleCategory.RoleCategoryId
```

```text
UserRole.UserId
        ↓
User.UserId
```

```text
UserRole.RoleId
        ↓
Role.RoleId
```

```text
UserPhoneNumber.UserId
        ↓
User.UserId
```

```text
BusinessInformation.UserRoleId
        ↓
UserRole.UserRoleId
```

```text
BusinessInformationPhone.BusinessInformationId
        ↓
BusinessInformation.BusinessInformationId
```

```text
BusinessInformationEmail.BusinessInformationId
        ↓
BusinessInformation.BusinessInformationId
```

---

# 11. Relationship Summary

| Relationship                                   | Cardinality  |
| ---------------------------------------------- | ------------ |
| User ↔ Role                                    | Many-to-Many |
| User → UserRole                                | 1-to-Many    |
| Role → UserRole                                | 1-to-Many    |
| RoleCategory → Role                            | 1-to-Many    |
| User → UserPhoneNumber                         | 1-to-Many    |
| UserRole → BusinessInformation                 | 0..1-to-1    |
| BusinessInformation → BusinessInformationPhone | 1-to-Many    |
| BusinessInformation → BusinessInformationEmail | 1-to-Many    |

The main idea is that **many-to-many relationships are resolved using a junction table**, while **multi-valued attributes are moved into separate tables**, and **one-to-many relationships are represented using foreign keys on the many side**.
S