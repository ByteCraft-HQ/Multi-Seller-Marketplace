# Role-Permission Relationship and Keys

The core relationship in this part of the database is the relationship between `ROLES` and `PERMISSION`.

A role can have multiple permissions, and a permission can be assigned to multiple roles.

Therefore, the relationship between them is:

```text
ROLES
  |
  | Many
  |
ROLEPERMISSION
  |
  | Many
  |
PERMISSION
```

This is a **Many-to-Many relationship**.

---

# 1. Why Do We Need a Junction Table?

A relational database cannot directly represent a many-to-many relationship between two tables without introducing an intermediate table.

For example:

```text
ROLE
RoleId = 1 → ADMIN
```

The `ADMIN` role may have:

```text
CREATE_USER
DELETE_USER
UPDATE_USER
VIEW_USERS
```

At the same time, the `DELETE_USER` permission may belong to:

```text
ADMIN
MANAGER
MODERATOR
```

Therefore:

* One role can have many permissions.
* One permission can belong to many roles.

This creates a **Many-to-Many relationship**.

The solution is to introduce a **Junction Table**:

```text
ROLES
   |
   | 1
   |
   | N
ROLEPERMISSION
   |
   | N
   |
   | 1
PERMISSION
```

The `ROLEPERMISSION` table stores the relationship between the two entities.

---

# 2. The Primary Keys of the Main Tables

Before looking at the junction table, we need to understand the keys of the two main tables.

### ROLES

```sql
RoleId
```

is the Primary Key of the `ROLES` table.

It uniquely identifies every role.

### PERMISSION

```sql
PermissionId
```

is the Primary Key of the `PERMISSION` table.

It uniquely identifies every permission.

Therefore:

```text
ROLES.RoleId
        ↓
     Primary Key

PERMISSION.PermissionId
        ↓
     Primary Key
```

---

# 3. Foreign Keys in the Junction Table

The two Primary Keys from the main tables are brought into the junction table as Foreign Keys.

```text
ROLES.RoleId
     ↓
ROLEPERMISSION.RoleId

PERMISSION.PermissionId
     ↓
ROLEPERMISSION.PermissionId
```

Therefore:

```text
ROLEPERMISSION
---------------------------
RoleId
PermissionId
RolePermissionStatus
```

Both `RoleId` and `PermissionId` are Foreign Keys.

They establish the relationship between the junction table and the two parent tables.

---

# 4. RoleId — PK + FK

Inside `ROLEPERMISSION`, `RoleId` has two roles.

### First: Foreign Key

It is a Foreign Key because it references:

```text
ROLES.RoleId
```

This guarantees that every relationship points to an existing role.

For example:

```text
ROLE
RoleId
------
1
2
3
```

Then this is valid:

```text
ROLEPERMISSION

RoleId = 1
```

But if `RoleId = 99` does not exist in `ROLES`, the Foreign Key prevents the relationship from being inserted.

---

### Second: Part of the Composite Primary Key

`RoleId` is also part of the Composite Primary Key:

```sql
PRIMARY KEY (RoleId, PermissionId)
```

However, an important distinction must be made:

> `RoleId` is **not** the Primary Key by itself in `ROLEPERMISSION`.

It is only **one part** of the Composite Primary Key.

For example:

```text
RoleId    PermissionId
-------   ------------
1         1
1         2
1         3
```

The same `RoleId` can appear multiple times.

This is necessary because one role can have multiple permissions.

---

# 5. PermissionId — PK + FK

The same concept applies to `PermissionId`.

### First: Foreign Key

`PermissionId` references:

```text
PERMISSION.PermissionId
```

This guarantees that the relationship points to an existing permission.

For example:

```text
PERMISSION
PermissionId
------------
1
2
3
```

Then:

```text
ROLEPERMISSION

PermissionId = 2
```

is valid.

But if permission `99` does not exist, the Foreign Key prevents the relationship from being inserted.

---

### Second: Part of the Composite Primary Key

`PermissionId` is also part of:

```sql
PRIMARY KEY (RoleId, PermissionId)
```

Again, it is **not a Primary Key by itself**.

The same permission can belong to multiple roles:

```text
RoleId    PermissionId
-------   ------------
1         5
2         5
3         5
```

This is exactly what we expect from a many-to-many relationship.

---

# 6. Composite Primary Key

The two columns together form the Composite Primary Key:

```sql
PRIMARY KEY (RoleId, PermissionId)
```

The combination of:

```text
RoleId + PermissionId
```

uniquely identifies a relationship.

For example:

```text
RoleId    PermissionId
-------   ------------
1         5
1         6
2         5
```

All three records are valid because each combination is different.

But this is not allowed:

```text
RoleId    PermissionId
-------   ------------
1         5
1         5
```

because the combination:

```text
(1, 5)
```

already exists.

Therefore, the Composite Primary Key prevents the same permission from being assigned to the same role more than once.

---

# 7. The Complete Key Structure

The relationship can be represented as follows:

```text
┌────────────────────┐
│       ROLES        │
├────────────────────┤
│ PK: RoleId         │
└─────────┬──────────┘
          │
          │ FK
          ▼
┌──────────────────────────────┐
│       ROLEPERMISSION         │
├──────────────────────────────┤
│ PK, FK: RoleId               │
│ PK, FK: PermissionId         │
│ RolePermissionStatus         │
└──────────────┬───────────────┘
               │
               │ FK
               ▼
┌────────────────────────┐
│      PERMISSION        │
├────────────────────────┤
│ PK: PermissionId       │
└────────────────────────┘
```

The important point is:

```text
ROLES.RoleId
     ↓
ROLEPERMISSION.RoleId
     ↓
Part of Composite PK
```

and:

```text
PERMISSION.PermissionId
     ↓
ROLEPERMISSION.PermissionId
     ↓
Part of Composite PK
```

---

# 8. Relationship Cardinality

The original relationship is:

```text
ROLE ↔ PERMISSION
```

with:

```text
Many-to-Many
```

The junction table transforms this into two One-to-Many relationships:

```text
ROLES 1 ───────< ROLEPERMISSION >─────── 1 PERMISSION
```

From the `ROLES` perspective:

```text
One Role
   ↓
Many RolePermission records
```

From the `PERMISSION` perspective:

```text
One Permission
   ↓
Many RolePermission records
```

Together, these two relationships represent the original Many-to-Many relationship.

---

# 9. Optionality

If the business rules allow a role to exist without any permissions, then the relationship is optional from the role side.

Likewise, if a permission can exist without being assigned to any role, the relationship is optional from the permission side.

Conceptually:

```text
ROLE       0..*  ROLEPERMISSION  0..*       PERMISSION
```

This means:

* A role may have zero or many permissions.
* A permission may be assigned to zero or many roles.

The junction table contains only the relationships that actually exist.

---

# Final Key Summary

| Table            | Column                   | Key Type                   | Purpose                                                               |
| ---------------- | ------------------------ | -------------------------- | --------------------------------------------------------------------- |
| `ROLES`          | `RoleId`                 | Primary Key                | Uniquely identifies a role                                            |
| `PERMISSION`     | `PermissionId`           | Primary Key                | Uniquely identifies a permission                                      |
| `ROLEPERMISSION` | `RoleId`                 | Foreign Key + Composite PK | References the role and participates in relationship uniqueness       |
| `ROLEPERMISSION` | `PermissionId`           | Foreign Key + Composite PK | References the permission and participates in relationship uniqueness |
| `ROLEPERMISSION` | `(RoleId, PermissionId)` | Composite Primary Key      | Uniquely identifies each role-permission relationship                 |

## The Core Idea

The `ROLES` and `PERMISSION` tables contain the entities.

The `ROLEPERMISSION` table contains the **relationship between those entities**.

The two Foreign Keys establish the relationships:

```text
ROLEPERMISSION.RoleId
        ↓
ROLES.RoleId

ROLEPERMISSION.PermissionId
        ↓
PERMISSION.PermissionId
```

And the Composite Primary Key:

```text
(RoleId, PermissionId)
```

ensures that the same role cannot be assigned the same permission more than once.

> **The Foreign Keys establish the relationship; the Composite Primary Key guarantees that each relationship is unique.**
