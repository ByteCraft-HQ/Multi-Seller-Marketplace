# User Domain — Table 1: Users

## 1. Super Keys

The following attributes are considered Super Keys:

- `UserID`
- `Email`
- `PhoneNumber` (assuming it is unique and each user has exactly one phone number in this table)

A Super Key is an attribute or combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.

## 2. Candidate Keys

The Candidate Keys are:

- `UserID`
- `Email`
- `PhoneNumber` (if it satisfies the uniqueness and non-null requirements)

Each Candidate Key uniquely identifies a user independently and contains no unnecessary attributes.

A Candidate Key is a minimal Super Key.

## 3. Primary Key (PK)

**Selected Primary Key: `UserID`**

`UserID` is selected as the Primary Key because:

- It is unique for every user.
- It is stable and should not change over time.
- It is simple and independent of personal information.
- It provides a consistent identifier for the user within the system.

## 4. Surrogate Key

`UserID` is a Surrogate Key because it is an artificial identifier created specifically for the database rather than derived from real-world information.

It can be represented by a numeric identifier or a UUID.

## 5. Natural Key

`Email` and `PhoneNumber` can be considered Natural Keys when they are used as real-world identifiers and satisfy the required uniqueness constraints.

However, both may change over time, which makes them less suitable as permanent identifiers.

## 6. Alternate Keys

`Email` is an Alternate Key because it is a Candidate Key that was not selected as the Primary Key.

`PhoneNumber` can also be an Alternate Key if it qualifies as a Candidate Key under the table's constraints.

## 7. Why Email Is Not Selected as the Primary Key

Although `Email` can technically serve as a Primary Key if it is unique and non-null, `UserID` is preferred because:

- Email addresses can change over time.
- Changes to a Primary Key can affect tables that reference it through Foreign Keys.
- Email addresses are generally longer than compact numeric identifiers, potentially increasing index storage costs.
- A system-generated identifier separates the user's internal identity from changeable contact information.

Using email as a Primary Key does not automatically make database operations inefficient. Performance depends on indexing, query design, data volume, and the database engine.

## 8. Why PhoneNumber Is Not Selected as the Primary Key

`PhoneNumber` may change over time and may not always be a permanent identifier for a user.

Even if it is unique, uniqueness alone does not make it the best Primary Key. `UserID` provides a more stable and independent identifier.

## 9. Foreign Key (FK)

Foreign Keys will be identified when defining the relationships between the tables in the User Domain.

A Foreign Key references a key in another table, or a suitable key in the same table, to maintain referential integrity.

## 10. Final Key Classification

| Attribute | Classification |
|---|---|
| `UserID` | Primary Key, Candidate Key, Surrogate Key |
| `Email` | Candidate Key, Alternate Key, Natural Key |
| `PhoneNumber` | Potential Candidate Key, Alternate Key, Natural Key, subject to the table's constraints |

**Final Decision:** `UserID` is selected as the Primary Key because it is a stable, simple, system-generated identifier. `Email` is retained as an Alternate Key, while `PhoneNumber` is classified according to its uniqueness and the constraints of the table.

![001-DATABASE-USERS-USER-DOMAIN-RELATIONSHIP-AND-KEYS](/RELATIONS-AND-KEYS/DATABASE-USER-DOMAIN/KEYS-IMAGES/001-DATABASE-USERS-USER-DOMAIN-RELATIONSHIP-AND-KEYS.svg)

---

# User Domain — Table 2: Roles

## 1. Super Keys

The following attributes are considered Super Keys:

- `RoleID`
- `RoleName`

Both attributes can uniquely identify a role, assuming each is unique and non-null.

A Super Key is an attribute or a combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.

## 2. Candidate Keys

The Candidate Keys are:

- `RoleID`
- `RoleName`

Both attributes independently identify each role and contain no unnecessary attributes.

A Candidate Key is a minimal Super Key, meaning that no attribute can be removed without losing the ability to uniquely identify a record.

## 3. Primary Key (PK)

**Selected Primary Key: `RoleID`**

`RoleID` is selected as the Primary Key because it provides a stable, system-generated identifier for each role.

Reasons for this choice:

- **Uniqueness:** Each role has its own unique identifier.
- **Stability:** The identifier remains unchanged when the role name changes.
- **Simplicity:** It provides a straightforward identifier for database operations.
- **Independence:** It is not tied to a descriptive name that may change over time.
- **Maintainability:** It simplifies references to roles from other tables through Foreign Keys.

## 4. Surrogate Key

`RoleID` is a Surrogate Key because it is an artificial identifier created specifically for the database rather than derived from real-world information.

It is preferred because the identity of a role does not depend on its name.

For example, if a role changes its name from `Editor` to `ContentEditor`, its `RoleID` remains unchanged.

## 5. Natural Key

`RoleName` is considered a Natural Key because it represents the actual name of the role within the system.

However, it qualifies as a Candidate Key only if role names are guaranteed to be unique and non-null.

Although `RoleName` can identify a role, its value may change as the system evolves, making it less suitable as the Primary Key.

## 6. Alternate Key

`RoleName` is an Alternate Key because it is a Candidate Key that was not selected as the Primary Key.

It can still have a `UNIQUE` constraint to prevent duplicate role names.

## 7. Why RoleName Is Not Selected as the Primary Key

Although `RoleName` can uniquely identify a role, using it as the Primary Key may introduce unnecessary maintenance complexity.

### 7.1 Role Name Changes

Role names may change over time as the system evolves.

If `RoleName` is used as the Primary Key, changing its value may affect related Foreign Keys in other tables, depending on the database constraints and update rules.

Using `RoleID` avoids this dependency because the role's identity remains stable even when its name changes.

### 7.2 Role Deactivation or Removal

A role may become inactive or obsolete.

Using `RoleID` allows the role to retain its identity even when it is deactivated. The system can preserve the existing record and its references rather than relying on the role name as its identifier.

However, `RoleID` alone does not prevent deletion-related issues. The database's Foreign Key constraints and deletion rules determine how referenced records are handled.

### 7.3 Adding or Splitting Roles

If an existing role is replaced by multiple new roles, each new role can receive its own `RoleID`.

For example, an existing `Admin` role may be replaced by `ContentAdmin` and `SystemAdmin`.

Each new role receives a distinct identifier, while the existing role retains its original identity if its record is preserved.

Any reassignment of users or permissions must follow the system's business rules.

### 7.4 Maintenance and Performance

`RoleID` provides a stable and compact identifier, which can simplify references and reduce index storage compared with longer role names.

However, using a surrogate key does not automatically guarantee faster `SELECT`, `INSERT`, `UPDATE`, or `DELETE` operations. Actual performance depends on indexing, query design, data volume, and the database engine.

## 8. Foreign Key (FK)

Foreign Keys will be identified when defining the relationships between the tables in the User Domain.

Tables that reference a role should generally use `RoleID` rather than `RoleName`, because `RoleID` remains stable when the role name changes.

## 9. Final Key Classification

| Attribute | Classification |
|---|---|
| `RoleID` | Primary Key, Candidate Key, Surrogate Key, Super Key |
| `RoleName` | Candidate Key, Alternate Key, Natural Key, Super Key |

## 10. Final Design Decision

`RoleID` is selected as the Primary Key because it provides a stable, system-generated identifier that is independent of the role's descriptive name.

`RoleName` remains an Alternate Key and a Natural Key, provided that role names are required to be unique and non-null.

This design makes role-name changes easier to manage, preserves a stable identifier for each role, and simplifies references from other tables.

**Assumptions:** `RoleID` and `RoleName` are unique and non-null. The database enforces these constraints, and `RoleID` remains unchanged throughout the lifetime of a role record.

![002-DATABASE-ROLES-USER-DOMAIN-RELATIONSHIP-AND-KEYS](/RELATIONS-AND-KEYS/DATABASE-USER-DOMAIN/KEYS-IMAGES/002-DATABASE-ROLES-USER-DOMAIN-RELATIONSHIP-AND-KEYS.drawio.svg)
