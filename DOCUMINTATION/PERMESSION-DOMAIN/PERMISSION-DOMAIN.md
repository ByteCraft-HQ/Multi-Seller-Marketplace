# Roles, Permissions, and Role Permissions

## 1. Permissions Table

The `permissions` table is responsible for defining the actions that can be performed within the system.

Its main purpose is to provide the backend with a clear and centralized definition of **what each permission allows a user to do**.

For example, a system may contain permissions such as:

* `CREATE_STORE`
* `UPDATE_STORE`
* `DELETE_STORE`
* `VIEW_STORE`
* `MANAGE_USERS`
* `VIEW_ORDERS`

Permissions can be shared across multiple roles, partially shared between roles, or highly specialized for a specific role.

The main reason for introducing permissions is to prevent every user or role from having unrestricted access to the entire system.

For example, a `CUSTOMER` should not automatically be able to manage stores, create stores, update stores, or perform administrative operations.

Therefore, the system needs a mechanism that explicitly defines which actions are allowed for each role.

---

## 2. Why Not Store Permissions Directly Inside the Role Table?

A common but incorrect approach would be to store permissions directly inside the `roles` table.

For example:

```text
roles
------------------------------------------------
role_id | role_name | permission_1 | permission_2
```

This approach creates several problems.

### Different Roles Have Different Numbers of Permissions

One role might have:

```text
CREATE_STORE
UPDATE_STORE
VIEW_STORE
DELETE_STORE
```

while another role might only have:

```text
VIEW_STORE
```

If permissions were stored as columns, adding another permission would require modifying the table structure.

This violates the purpose of a flexible relational design.

### Repeating the Role

Another possible approach would be to repeat the same role for every permission:

```text
role_id | role_name       | permission
--------|-----------------|----------------
1       | Store Manager   | CREATE_STORE
1       | Store Manager   | UPDATE_STORE
1       | Store Manager   | VIEW_STORE
```

Although this appears closer to a relational solution, storing role information repeatedly introduces unnecessary redundancy.

The same role data would be duplicated across multiple records.

This can lead to:

* Data redundancy
* Larger amounts of repeated data
* Update anomalies
* More difficult maintenance
* Potential inconsistencies

The database should instead separate the concepts and represent their relationship explicitly.

---

# 3. Role–Permission Relationship

The relationship between `Role` and `Permission` is **many-to-many**.

A single role can have multiple permissions.

At the same time, a single permission can be assigned to multiple roles.

For example:

```text
ADMIN
 ├── CREATE_STORE
 ├── UPDATE_STORE
 ├── DELETE_STORE
 └── VIEW_STORE

STORE_MANAGER
 ├── CREATE_STORE
 ├── UPDATE_STORE
 └── VIEW_STORE

CUSTOMER
 └── VIEW_STORE
```

This means that neither `roles` nor `permissions` should directly contain the other entity's data.

Instead, the relationship is represented through a junction table.

---

# 4. Optionality of the Relationship

The relationship between `Role` and `Permission` is **optional from both sides**.

### Role → Permission

A role may have zero or many permissions.

```text
Role 0..* ───── 0..* Permission
```

For example, a newly created role may exist before any permissions are assigned to it.

```text
NEW_ROLE
    └── No permissions yet
```

This is a valid state.

### Permission → Role

A permission may also exist without being assigned to any role.

For example, a new permission may be created and defined in the system before it is assigned to a role.

```text
EXPORT_REPORT
    └── Not assigned to any role yet
```

This is also a valid state.

Therefore, the relationship is:

```text
Role 0..* <────> 0..* Permission
```

Both sides are optional.

---

# 5. Why Use a Junction Table?

Because the relationship is many-to-many, a junction table is required to represent it correctly in a relational database.

The junction table is:

```text
role_permissions
```

Its responsibility is to define which permissions belong to which roles.

Conceptually:

```text
ROLES
   │
   │
   ▼
ROLE_PERMISSIONS
   ▲
   │
   │
PERMISSIONS
```

For example:

```text
role_permissions
-----------------------------
role_id | permission_id
--------|----------------
1       | 1
1       | 2
1       | 3
2       | 1
2       | 2
3       | 4
```

This means:

* Role `1` has permissions `1`, `2`, and `3`
* Role `2` has permissions `1` and `2`
* Role `3` has permission `4`

The major advantage is that new permissions can be added without modifying the structure of the `roles` table.

Likewise, permissions can be assigned or removed from roles simply by inserting or removing rows from the junction table.

---

# 6. Why This Design Is Better

This separation provides a normalized and scalable structure.

Instead of repeating role information:

```text
Store Manager → CREATE_STORE
Store Manager → UPDATE_STORE
Store Manager → VIEW_STORE
```

the database stores the role once and represents its relationships through `role_permissions`.

This reduces redundancy and makes the system easier to maintain.

It also allows the system to:

* Add new permissions without changing table structures
* Assign multiple permissions to a role
* Assign one permission to multiple roles
* Remove a permission from a role
* Add new roles without duplicating permission definitions
* Keep permission definitions independent from role definitions

---

# 7. How Roles and Permissions Are Used by the Backend

The main purpose of this design is authorization.

A user can have one or more roles.

The roles determine which permissions the user receives.

Conceptually:

```text
USER
  ↓
USER_ROLES
  ↓
ROLES
  ↓
ROLE_PERMISSIONS
  ↓
PERMISSIONS
  ↓
AUTHORIZED ACTIONS
```

When the backend receives a request, it can determine whether the current user has the required permission.

For example:

```text
User
 ↓
CUSTOMER
 ↓
CUSTOMER permissions
 ↓
VIEW_STORE
```

If the user attempts:

```text
DELETE_STORE
```

and the user does not have that permission, the backend should reject the operation.

Therefore, permissions provide a centralized authorization mechanism instead of relying on hard-coded assumptions about what each user can do.

---

# 8. Permissions Table Attributes

The `permissions` table contains the definition and current state of each permission.

## 8.1 `permission_id`

The `permission_id` is the **Primary Key (PK)** of the `permissions` table.

It uniquely identifies each permission.

Example:

```text
permission_id
-------------
1
2
3
4
```

The ID is also referenced by the `role_permissions` junction table.

---

## 8.2 `permission_name`

The `permission_name` stores the name of the permission.

Examples:

```text
CREATE_STORE
UPDATE_STORE
DELETE_STORE
VIEW_STORE
MANAGE_USERS
```

The name should clearly describe the action represented by the permission.

---

## 8.3 `permission_status`

The `permission_status` represents the current state of the permission.

Possible states include:

```text
PENDING
ACTIVE
SUSPENDED
DEACTIVATED
DELETED
```

For example:

```text
permission_id | permission_name | permission_status
--------------|-----------------|------------------
1             | CREATE_STORE     | ACTIVE
2             | DELETE_STORE     | SUSPENDED
3             | VIEW_STORE       | ACTIVE
```

The status allows the system to determine the current lifecycle state of a permission.

---

## 8.4 `created_at`

The `created_at` attribute records when the permission was created.

Example:

```text
created_at
-------------------
2026-10-05 01:30:00
```

This field provides creation metadata and should **not be confused with an audit log**.

`created_at` answers:

> When was this permission created?

An audit log answers questions such as:

> Who changed this permission?

> What was its previous status?

> When was it changed?

> What action was performed?

These are different responsibilities.

---

# 9. Permissions Table Summary

The `permissions` table exists to provide a centralized definition of the permissions available within the system.

Its main attributes are:

| Attribute           | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `permission_id`     | Unique identifier and Primary Key           |
| `permission_name`   | Defines the permission/action               |
| `permission_status` | Defines the current state of the permission |
| `created_at`        | Records when the permission was created     |

The table represents **what actions exist in the system**, not which roles can use them.

The role-to-permission assignment is handled separately by the junction table.

---

# 10. Role Permissions Table

The `role_permissions` table is the **junction table** between `roles` and `permissions`.

Its primary responsibility is to represent the many-to-many relationship between them.

It answers the question:

> Which permissions are assigned to this role?

And the inverse:

> Which roles have this permission?

---

# 11. Role Permissions Attributes

## 11.1 `role_id`

The `role_id` is a **Foreign Key (FK)** referencing the `roles` table.

It identifies the role involved in the relationship.

Example:

```text
role_id = 2
```

means that this relationship belongs to role `2`.

---

## 11.2 `permission_id`

The `permission_id` is a **Foreign Key (FK)** referencing the `permissions` table.

It identifies the permission assigned to the role.

For example:

```text
role_id = 2
permission_id = 5
```

means:

> Role `2` has Permission `5`.

---

# 12. Composite Primary Key

The `role_permissions` table uses a **Composite Primary Key** consisting of:

```text
(role_id, permission_id)
```

This combination uniquely identifies a role-permission relationship.

Example:

```text
role_id | permission_id
--------|---------------
1       | 1
1       | 2
1       | 3
```

The following duplicate relationship would not be allowed:

```text
1 | 1
1 | 1
```

because the combination:

```text
(role_id = 1, permission_id = 1)
```

already exists.

This guarantees that the same permission cannot be assigned to the same role more than once.

The composite key also provides an efficient and natural way to identify the relationship between a role and a permission.

---

# 13. `role_permission_status`

The `role_permission_status` represents the current state of the relationship between a role and a permission.

This is different from `permission_status`.

For example:

```text
Permission:
DELETE_STORE → ACTIVE
```

does not necessarily mean every role currently has an active assignment to it.

The permission itself can be active while a specific role-permission relationship is inactive.

Example:

```text
role_id | permission_id | role_permission_status
--------|---------------|----------------------
1       | 3             | ACTIVE
2       | 3             | DEACTIVATED
```

In this case:

* `DELETE_STORE` exists and is active globally.
* Role `1` currently has the permission.
* Role `2` does not currently have an active assignment.

This allows the system to control the state of the assignment independently from the permission definition itself.

---
>** LOGICAL MODEL UPDATTE **
>
>![PERMISSION-DOMAIL-LOGICAL-DOMAIL](/DOCUMINTATION/PERMESSIONS-DOMAIN/IMAGES/PERMESSION-DOMAIN-LOGICAL-MODEL.svg)
---

```

The responsibility of each table is clear:

### `users`ٍٍ

Defines **who the user is**.

### `roles`

Defines **what role the user has**.

### `permissions`

Defines **what actions exist in the system**.

### `user_roles`

Defines **which roles belong to each user**.

### `role_permissions`

Defines **which permissions belong to each role**.

This separation keeps the authorization model normalized, flexible, and scalable.

Most importantly, adding a new permission does not require adding a new column to the `roles` table.

Instead, the new permission is simply inserted into `permissions` and can then be assigned to any required role through `role_permissions`.

That is the core reason for separating `roles`, `permissions`, and their relationship into independent tables.
