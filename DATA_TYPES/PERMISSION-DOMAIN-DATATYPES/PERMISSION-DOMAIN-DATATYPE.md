# Permissions

## 1. Permission ID

**Data Type:** `SMALLINT`

**Why `SMALLINT`?**

`Permission ID` is the primary key (PK) of the `Permissions` table.

The number of permissions in the system is not expected to reach a very large number such as 30,000. However, `SMALLINT` provides enough range while still giving us room for future growth as the number of permissions changes depending on the system and its roles.

We do not use `INT` or `BIGINT` because they would allocate more storage than necessary for this use case. Since the expected number of permissions is relatively small, using a larger integer type would be unnecessary storage overhead.

---

## 2. Permission Name

**Data Type:** `VARCHAR(100)`

**Why `VARCHAR`?**

The permission name is an internal system value. It is not user-generated and is not expected to contain multilingual or Unicode characters.

Therefore, `VARCHAR` is sufficient for this field.

Using `NVARCHAR` would consume more storage without providing any real benefit in this case.

**Why `100` characters?**

The longest permission name is expected to be around 60 characters.

Using `VARCHAR(100)` gives us additional room for future changes. For example, if a new permission name reaches 80 characters, the database can still accommodate it without requiring a schema change.

The extra capacity is intentional and acts as a reasonable buffer for unusual or future cases.

---

## 3. Permission Status

**Data Type:** `VARCHAR(20)`

The `Permission Status` represents the current state of the permission.

Possible values are:

```text
PENDING
ACTIVE
SUSPENDED
DEACTIVATED
DELETED
```

**Why `VARCHAR`?**

The status values are controlled by the system rather than entered by users.

Therefore, `VARCHAR` is sufficient because we do not need Unicode support for these predefined system values.

**Why `20` characters?**

The longest status value is still below 20 characters.

Using `VARCHAR(20)` provides enough capacity for all current values while avoiding unnecessary storage allocation.

---

## 4. Permission Created At

**Data Type:** `DATETIME2`

The `Permission Created At` field stores the exact date and time when the permission was created.

This field is important for:

* Tracking when a permission was created.
* Auditing system changes.
* Understanding the history of permissions.
* Supporting future reporting and debugging requirements.

`DATETIME2` is preferred because it provides accurate date and time storage with better precision than the older `DATETIME` type.

---

# Role Permissions

The `Role Permissions` table is used to associate roles with their permissions.

## 1. Role ID

**Data Type:** `TINYINT`

**Constraint:** Foreign Key (FK) → `Roles.RoleID`

`Role ID` references the primary key of the `Roles` table.

The data type is `TINYINT` because the number of roles in the system is expected to remain relatively small.

Since the `Roles` table already uses `TINYINT` for its primary key, the foreign key should use the same data type.

Using `INT` or `BIGINT` here would provide a much larger range than the system actually needs and would result in unnecessary storage usage.

---

## 2. Permission ID

**Data Type:** `SMALLINT`

**Constraint:** Foreign Key (FK) → `Permissions.PermissionID`

`Permission ID` references the primary key of the `Permissions` table.

It uses the same `SMALLINT` data type as `Permissions.PermissionID` to maintain consistency between the primary key and its foreign key.

---

## 3. RolePermissionStatus

**Data Type:** `VARCHAR(20)`

The `Status` field follows the same rules and reasoning as the `Permission Status` field in the `Permissions` table.

It is used to represent the current state of the role-permission relationship and is controlled by the system.

Therefore, `VARCHAR(20)` is sufficient for the predefined status values.


>** PERMISSION DOMAIN MODEL **
>
>![001-PERMISSION-DOMAIN-DATATYPES](/DATAT_YPES/PERMISSION-DOMAIN-DATATYPE/001-PERMISSION-DOMAIN-DATATYPES.svg)
