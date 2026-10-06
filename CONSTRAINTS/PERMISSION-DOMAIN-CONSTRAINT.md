# Permission Table — Constraints

The `PERMISSION` table stores the permissions available in the system.

The constraints are designed to protect the integrity of the data while avoiding unnecessary restrictions that could make the system difficult to maintain or extend in the future.

---

## 1. PermissionId

`PermissionId` is the primary identifier for each permission.

### Constraints

```sql
PermissionId SMALLINT IDENTITY(1,1) NOT NULL
```

```sql
CONSTRAINT Permission_PermissionId_PK
PRIMARY KEY (PermissionId)
```

### Why?

The `PermissionId` is the **Primary Key**, which means:

* Every permission must have a unique identifier.
* Two permissions cannot have the same `PermissionId`.
* The column cannot contain `NULL`.
* It provides a reliable way to reference a specific permission from other tables.

The `PRIMARY KEY` constraint automatically enforces **uniqueness** and **NOT NULL** behavior.

### Identity

```sql
IDENTITY(1,1)
```

is used to automatically generate the `PermissionId`.

* `1` = starting value.
* `1` = increment by one for every new row.

This means we do not need to manually provide an ID every time a new permission is inserted.

---

## 2. PermissionName

`PermissionName` represents the name of the permission.

Example:

```text
CREATE_USER
DELETE_USER
UPDATE_USER
VIEW_USERS
```

### Constraints

```sql
PermissionName VARCHAR(100) NOT NULL
```

```sql
CONSTRAINT Permission_PermissionName_UQ
UNIQUE (PermissionName)
```

```sql
CONSTRAINT Permission_PermissionName_Check
CHECK (LEN(TRIM(PermissionName)) > 0)
```

### Why?

`PermissionName` must:

* Have a value.
* Not be an empty string.
* Not contain only whitespace.
* Be unique.

We intentionally **do not restrict the permission name to a fixed list of values**.

For example, this would be a bad design:

```sql
CHECK (
    PermissionName IN (
        'CREATE_USER',
        'DELETE_USER',
        'UPDATE_USER'
    )
)
```

The reason is that permissions are expected to grow over time.

If a new permission is introduced, the database constraint would have to be modified before the new permission could be inserted.

That creates unnecessary maintenance and couples the database schema to a specific list of business values.

Instead, the database should enforce the properties that must always be true:

> The permission must have a valid name, and that name must be unique.

The actual list of permissions can grow without modifying the constraint.

---

## 3. PermissionStatus

`PermissionStatus` represents the current state of a permission.

Supported statuses are:

```text
PENDING
ACTIVE
SUSPENDED
DEACTIVATED
DELETED
```

### Constraints

```sql
PermissionStatus VARCHAR(20) NOT NULL
```

```sql
CONSTRAINT Permission_PermissionStatus_Check
CHECK (
    PermissionStatus = UPPER(TRIM(PermissionStatus))
    AND PermissionStatus IN (
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED'
    )
)
```

### Why?

`NOT NULL` ensures that every permission always has a status.

The `CHECK` constraint ensures that:

1. The value is stored using uppercase letters.
2. Leading and trailing spaces are not accepted.
3. Only valid permission statuses can be stored.

For example:

```text
ACTIVE       → Valid
PENDING      → Valid
SUSPENDED    → Valid
DEACTIVATED  → Valid
DELETED      → Valid
```

While values such as:

```text
active
Active
UNKNOWN
TEST
```

will not satisfy the constraint.

---

## 4. PermissionCreatedAt

`PermissionCreatedAt` stores the date and time when the permission was created.

### Constraint

```sql
PermissionCreatedAt DATETIME2 NOT NULL
    DEFAULT SYSDATETIME()
```

### Why?

`NOT NULL` guarantees that every permission has a creation timestamp.

The `DEFAULT` constraint automatically assigns the current database server date and time when a new permission is inserted without explicitly providing `PermissionCreatedAt`.

This removes the need to manually provide the creation time for every new permission.

---

# Complete Table Definition

```sql
CREATE TABLE PERMISSION
(
    PermissionId SMALLINT IDENTITY(1,1) NOT NULL,
    PermissionName VARCHAR(100) NOT NULL,
    PermissionStatus VARCHAR(20) NOT NULL,
    PermissionCreatedAt DATETIME2 NOT NULL
        DEFAULT SYSDATETIME(),

    CONSTRAINT Permission_PermissionId_PK
        PRIMARY KEY (PermissionId),

    CONSTRAINT Permission_PermissionName_UQ
        UNIQUE (PermissionName),

    CONSTRAINT Permission_PermissionName_Check
        CHECK (LEN(TRIM(PermissionName)) > 0),

    CONSTRAINT Permission_PermissionStatus_Check
        CHECK (
            PermissionStatus = UPPER(TRIM(PermissionStatus))
            AND PermissionStatus IN (
                'PENDING',
                'ACTIVE',
                'SUSPENDED',
                'DEACTIVATED',
                'DELETED'
            )
        )
);
```

---

# Constraint Summary

| Column                | Constraint      | Purpose                                             |
| --------------------- | --------------- | --------------------------------------------------- |
| `PermissionId`        | `PRIMARY KEY`   | Guarantees a unique identifier for every permission |
| `PermissionId`        | `IDENTITY(1,1)` | Automatically generates IDs                         |
| `PermissionId`        | `NOT NULL`      | Prevents missing IDs                                |
| `PermissionName`      | `UNIQUE`        | Prevents duplicate permission names                 |
| `PermissionName`      | `NOT NULL`      | Requires every permission to have a name            |
| `PermissionName`      | `CHECK`         | Prevents empty or whitespace-only names             |
| `PermissionStatus`    | `NOT NULL`      | Requires every permission to have a status          |
| `PermissionStatus`    | `CHECK`         | Allows only predefined valid statuses               |
| `PermissionCreatedAt` | `NOT NULL`      | Requires a creation timestamp                       |
| `PermissionCreatedAt` | `DEFAULT`       | Automatically sets the creation timestamp           |

---

## Design Principle

The goal of these constraints is not to restrict the data unnecessarily.

The database should enforce **rules that must always be true**, such as:

* IDs must be unique.
* Required values cannot be `NULL`.
* Permission names cannot be duplicated.
* Permission names cannot be empty.
* Permission statuses must be valid.

At the same time, the schema should remain flexible enough to allow the permission system to grow without requiring constant changes to the table constraints.

---

# RolePermission Table — Constraints

The `ROLEPERMISSION` table is a **Junction Table** that represents the many-to-many relationship between `ROLES` and `PERMISSION`.

A role can have multiple permissions, and a permission can belong to multiple roles.

For example:

```text
ADMIN  → CREATE_USER
ADMIN  → DELETE_USER
ADMIN  → UPDATE_USER

EDITOR → UPDATE_USER
EDITOR → VIEW_USERS
```

Instead of storing multiple values in either table, the relationship is represented using the `ROLEPERMISSION` table.

---

# 1. Composite Primary Key

The combination of `RoleId` and `PermissionId` forms the Primary Key.

```sql
CONSTRAINT RolePermission_RoleId_PermissionId_PK
    PRIMARY KEY (RoleId, PermissionId)
```

### Why?

Neither `RoleId` nor `PermissionId` is enough by itself to uniquely identify a relationship.

For example:

```text
RoleId = 1
PermissionId = 5
```

represents:

> Role 1 has Permission 5.

The same role can have many permissions:

```text
RoleId  PermissionId
1       1
1       2
1       5
```

And the same permission can belong to many roles:

```text
RoleId  PermissionId
1       5
2       5
3       5
```

Therefore, the combination of both columns is what uniquely identifies the relationship.

### What does this prevent?

It prevents duplicate relationships.

For example, this would not be allowed:

```text
RoleId  PermissionId
1       5
1       5
```

Because `(1, 5)` already exists as a composite primary key.

The database therefore guarantees that the same permission cannot be assigned to the same role more than once.

---

# 2. RoleId

`RoleId` is a Foreign Key referencing the `ROLES` table.

```sql
RoleId TINYINT NOT NULL
```

```sql
CONSTRAINT RolePermission_RoleId_FK
    FOREIGN KEY (RoleId)
    REFERENCES ROLES(RoleId)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
```

### Why `NOT NULL`?

Every record in `ROLEPERMISSION` must belong to a role.

A row such as:

```text
RoleId = NULL
PermissionId = 5
```

would not make sense.

The purpose of this table is to answer:

> Which permission belongs to which role?

If there is no `RoleId`, the relationship is incomplete.

---

# 3. RoleId as a Foreign Key

The Foreign Key guarantees **referential integrity**.

The value stored in `ROLEPERMISSION.RoleId` must already exist in:

```text
ROLES.RoleId
```

For example, if the existing roles are:

```text
1 → ADMIN
2 → EDITOR
3 → VIEWER
```

then this is valid:

```text
RoleId = 1
```

But this is invalid if role `99` does not exist:

```text
RoleId = 99
```

The database will reject it because the referenced role does not exist.

---

# 4. ON DELETE NO ACTION

The relationship uses:

```sql
ON DELETE NO ACTION
```

This means that the database will **not automatically delete related `ROLEPERMISSION` records** when a referenced role is deleted.

For example:

```text
ROLES
RoleId = 1

ROLEPERMISSION
RoleId = 1
PermissionId = 5
```

If the system attempts to physically delete Role `1`, the database will reject the operation while related records still exist.

### Why?

Because automatically deleting relationship data can cause unintended data loss.

In this design, roles are expected to use **soft deletion** rather than physical deletion.

Instead of removing the role from the database, its status can be changed:

```text
ACTIVE
    ↓
DELETED
```

The historical relationship can therefore remain available for auditing and historical purposes.

> Important: `NO ACTION` does **not** perform a soft delete automatically.
> The application must implement the soft-delete behavior by changing the relevant status.

---

# 5. ON UPDATE NO ACTION

The Foreign Key also uses:

```sql
ON UPDATE NO ACTION
```

This means that updating the referenced `RoleId` in the `ROLES` table will not automatically update the corresponding `RoleId` values in `ROLEPERMISSION`.

This is intentional.

`RoleId` is an identifier and should normally remain stable throughout the lifetime of the role.

Therefore, changing the primary identifier of an existing role should not be treated as a normal operation.

---

# 6. PermissionId

`PermissionId` is the second Foreign Key.

```sql
PermissionId SMALLINT NOT NULL
```

```sql
CONSTRAINT RolePermission_PermissionId_FK
    FOREIGN KEY (PermissionId)
    REFERENCES PERMISSION(PermissionId)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
```

### Why `NOT NULL`?

Every relationship must reference an actual permission.

A row like:

```text
RoleId      PermissionId
1           NULL
```

does not represent a meaningful relationship.

The whole purpose of `ROLEPERMISSION` is to answer:

> Which permission is assigned to this role?

Therefore, both sides of the relationship are required.

---

# 7. PermissionId as a Foreign Key

`PermissionId` must reference an existing permission in:

```text
PERMISSION.PermissionId
```

For example:

```text
PERMISSION

1 → CREATE_USER
2 → DELETE_USER
3 → UPDATE_USER
```

Then:

```text
RoleId = 1
PermissionId = 2
```

means:

> Role 1 has the DELETE_USER permission.

But:

```text
RoleId = 1
PermissionId = 99
```

is invalid if permission `99` does not exist.

The Foreign Key prevents this invalid relationship from being stored.

---

# 8. ON DELETE NO ACTION for Permission

The `PermissionId` Foreign Key also uses:

```sql
ON DELETE NO ACTION
```

This prevents a permission from being physically deleted while it is still referenced by `ROLEPERMISSION`.

Again, the expected approach is to use **soft deletion**.

For example:

```text
ACTIVE
    ↓
DELETED
```

The permission remains in the database, while its status indicates that it is no longer active.

This preserves historical data and prevents existing relationships from becoming invalid.

---

# 9. RolePermissionStatus

The junction table itself has a status:

```sql
RolePermissionStatus VARCHAR(20) NOT NULL
```

This represents the current state of the relationship between a role and a permission.

The allowed values are:

```text
PENDING
ACTIVE
SUSPENDED
DEACTIVATED
DELETED
```

### Constraint

```sql
CONSTRAINT RolePermission_RolePermissionStatus_Check
    CHECK (
        RolePermissionStatus = UPPER(TRIM(RolePermissionStatus))
        AND RolePermissionStatus IN (
            'PENDING',
            'ACTIVE',
            'SUSPENDED',
            'DEACTIVATED',
            'DELETED'
        )
    )
```

### Why?

The relationship itself may have a lifecycle.

For example:

```text
Role: ADMIN
Permission: DELETE_USER
Status: ACTIVE
```

Later, the relationship may become:

```text
Status: SUSPENDED
```

without deleting the actual role, permission, or relationship record.

This is useful when the system needs to preserve historical information.

---

# Complete Table Definition

```sql
CREATE TABLE ROLEPERMISSION
(
    RoleId TINYINT NOT NULL,
    PermissionId SMALLINT NOT NULL,
    RolePermissionStatus VARCHAR(20) NOT NULL,

    CONSTRAINT RolePermission_RoleId_PermissionId_PK
        PRIMARY KEY (RoleId, PermissionId),

    CONSTRAINT RolePermission_RoleId_FK
        FOREIGN KEY (RoleId)
        REFERENCES ROLES(RoleId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT RolePermission_PermissionId_FK
        FOREIGN KEY (PermissionId)
        REFERENCES PERMISSION(PermissionId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT RolePermission_RolePermissionStatus_Check
        CHECK (
            RolePermissionStatus = UPPER(TRIM(RolePermissionStatus))
            AND RolePermissionStatus IN (
                'PENDING',
                'ACTIVE',
                'SUSPENDED',
                'DEACTIVATED',
                'DELETED'
            )
        )
);
```

---

# Constraint Summary

| Column                  | Constraint              | Purpose                                                |
| ----------------------- | ----------------------- | ------------------------------------------------------ |
| `RoleId`                | `NOT NULL`              | Every relationship must belong to a role               |
| `RoleId`                | `FOREIGN KEY`           | Ensures the role exists in `ROLES`                     |
| `RoleId`                | `ON DELETE NO ACTION`   | Prevents accidental cascading deletion                 |
| `RoleId`                | `ON UPDATE NO ACTION`   | Prevents automatic identifier changes                  |
| `PermissionId`          | `NOT NULL`              | Every relationship must reference a permission         |
| `PermissionId`          | `FOREIGN KEY`           | Ensures the permission exists in `PERMISSION`          |
| `PermissionId`          | `ON DELETE NO ACTION`   | Prevents accidental cascading deletion                 |
| `PermissionId`          | `ON UPDATE NO ACTION`   | Prevents automatic identifier changes                  |
| `RoleId + PermissionId` | `COMPOSITE PRIMARY KEY` | Guarantees each role-permission relationship is unique |
| `RolePermissionStatus`  | `NOT NULL`              | Every relationship must have a status                  |
| `RolePermissionStatus`  | `CHECK`                 | Allows only valid relationship statuses                |

---

# Design Principle

The `ROLEPERMISSION` table is responsible for maintaining the integrity of the many-to-many relationship.

The database guarantees that:

1. Every relationship references an existing role.
2. Every relationship references an existing permission.
3. Neither `RoleId` nor `PermissionId` can be `NULL`.
4. The same role cannot receive the same permission more than once.
5. Roles and permissions are not physically removed through cascading deletes.
6. The relationship itself has a controlled lifecycle through `RolePermissionStatus`.

The key idea is:

> **The junction table represents the relationship, while the composite primary key guarantees that the same relationship cannot exist more than once.**


