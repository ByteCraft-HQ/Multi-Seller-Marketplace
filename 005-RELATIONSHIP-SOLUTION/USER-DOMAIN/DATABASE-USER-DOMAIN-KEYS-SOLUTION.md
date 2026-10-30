# USER_ROLE — Keys Identification and Description

## 1. Super Keys

A Super Key is an attribute or a combination of attributes that uniquely identifies each row in a table.

Based on the proposed `USER_ROLE` design, the following four attribute combinations are identified as Super Keys:

| Super Key | Attributes |
|---|---|
| Super Key 1 | `UserId`, `RoleId` |
| Super Key 2 | `UserRoleId` |
| Super Key 3 | `UserRoleId`, `UserId` |
| Super Key 4 | `UserRoleId`, `RoleId` |

These combinations can uniquely identify a row, assuming the uniqueness requirements of the proposed design are enforced.

The combinations containing `UserRoleId` remain unique because `UserRoleId` itself uniquely identifies each assignment.

## 2. Candidate Keys

A Candidate Key is a minimal Super Key. It uniquely identifies a row, and removing any attribute from it would cause it to lose that property.

The proposed Candidate Keys are:

| Candidate Key | Attributes | Description |
|---|---|---|
| Candidate Key 1 | `UserId`, `RoleId` | A composite candidate key that uniquely identifies each user-role assignment. |
| Candidate Key 2 | `UserRoleId` | A single-attribute candidate key that uniquely identifies each assignment. |

Both candidates uniquely identify a row under the proposed design. However, they differ in structure and suitability for use as the table's Primary Key.

## 3. Primary Key Selection

### Selected Primary Key: `UserRoleId`

`UserRoleId` is selected as the Primary Key of `USER_ROLE`.

It is a **Surrogate Key**, meaning that it is an identifier introduced for database identification purposes rather than a key derived from the business meaning of the record.

### Why Choose `UserRoleId`?

The main reasons are:

- **Simplicity:** A single-column key is easier to reference than a composite key.
- **Relationship management:** Other tables can reference a single identifier when they need to refer to a particular user-role assignment.
- **Maintainability:** The design avoids requiring other tables to carry multiple key columns whenever they reference a user-role assignment.
- **Scalability:** A single-column identifier provides a straightforward reference as the system and its relationships grow.

These benefits make `UserRoleId` the preferred Primary Key for the proposed design.

## 4. Alternative Candidate Key

The alternative Candidate Key is the composite key:

`(UserId, RoleId)`

This combination is unique because the same role must not be assigned to the same user more than once.

Although it is not selected as the Primary Key, the combination must remain unique to prevent duplicate assignments.

Therefore, the proposed design requires a uniqueness rule on `(UserId, RoleId)` independently of the selected Primary Key.

## 5. Natural Key

No Natural Key has been identified for `USER_ROLE` in the current design.

The selected `UserRoleId` is a Surrogate Key. Meanwhile, `UserId` and `RoleId` are identifiers originating from other entities and form a composite Candidate Key for the assignment.

The composite key represents the business uniqueness of the assignment, but its components are foreign-key identifiers rather than a naturally occurring business attribute.

## 6. Final Key Summary

| Key Type | Selected Attributes |
|---|---|
| Primary Key | `UserRoleId` |
| Surrogate Key | `UserRoleId` |
| Alternative Candidate Key | `(UserId, RoleId)` |
| Uniqueness Requirement | `(UserId, RoleId)` must be unique |
| Natural Key | None identified |

---

# ROLE_CATEGORIES – ROLES Keys Solution

## 1. Primary Key

The `ROLES` table retains its existing Primary Key:

- **Attribute:** `RoleId`
- **Key Type:** Primary Key (PK)

The existing Primary Key remains unchanged.

## 2. Foreign Key

The `ROLES` table will include the following Foreign Key:

- **Attribute:** `RoleCategoryName`
- **Key Type:** Foreign Key (FK)
- **References:** `ROLE_CATEGORIES.RoleCategoryName`

The foreign key references the Primary Key of the `ROLE_CATEGORIES` table.

## 3. Mandatory Foreign Key

`RoleCategoryName` must be `NOT NULL`.

This requirement is necessary because every role must belong to exactly one role category according to the established business rules.

Allowing `NULL` would permit a role to exist without an assigned category, violating the mandatory participation requirement of the relationship.

The foreign key also ensures that the assigned category exists in `ROLE_CATEGORIES`.

## 4. Final Key Summary

| Attribute | Key Type | Requirement |
|---|---|---|
| `RoleId` | Primary Key (PK) | Retained as the existing Primary Key |
| `RoleCategoryName` | Foreign Key (FK) | Mandatory; `NOT NULL` |

No junction table is required for this relationship because each role belongs to exactly one category, while a category may contain multiple roles.

---

# USER_ROLE – BUSINESS_INFORMATION Keys Solution

## 1. Primary Key

The `BUSINESS_INFORMATION` table retains its existing Primary Key.

The existing Primary Key remains unchanged.

## 2. Foreign Key

The `BUSINESS_INFORMATION` table will include `UserRoleId` as a Foreign Key.

- **Attribute:** `UserRoleId`
- **Key Type:** Foreign Key (FK)
- **Referenced Table:** `USER_ROLE`
- **Referenced Attribute:** `USER_ROLE.UserRoleId`

This foreign key establishes the relationship between each business information record and the specific user-role assignment to which it belongs.

## 3. Mandatory and Unique Foreign Key

The `UserRoleId` attribute in `BUSINESS_INFORMATION` must satisfy the following requirements:

- **NOT NULL:** Every business information record must be associated with an existing user-role assignment.
- **UNIQUE:** A single user-role assignment cannot be associated with more than one business information record.

These requirements reflect the established One-to-One relationship, with optional participation from the `USER_ROLE` side and mandatory participation from the `BUSINESS_INFORMATION` side.

## 4. Final Key Summary

| Attribute | Key Type | Requirements |
|---|---|---|
| Existing Primary Key | Primary Key (PK) | Retained without change |
| `UserRoleId` | Foreign Key (FK) | `NOT NULL` and `UNIQUE` |

The existing Primary Key of `BUSINESS_INFORMATION` remains unchanged. `UserRoleId` is added as a Foreign Key to reference `USER_ROLE.UserRoleId`.


