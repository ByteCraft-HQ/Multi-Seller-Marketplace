# USERS – ROLES Relationship Solution

## 1. Relationship Overview

The relationship between `USERS` and `ROLES` is **Many-to-Many (M:N)**.

- A user must be assigned at least one role and may have multiple roles simultaneously.
- A role may be assigned to zero or many users.

A direct implementation of this relationship inside either entity would introduce unnecessary complexity and potential data anomalies. Therefore, the relationship will be resolved using an associative table, also known as a **junction table**, named `USER_ROLE`.

## 2. Why Do We Need a Junction Table?

Placing `RoleId` directly inside `USERS` would not adequately represent users who can have multiple roles. Supporting multiple roles through repeated columns or repeated user records would introduce problems such as:

- **Data duplication:** Repeating user information for each assigned role would duplicate account data unnecessarily.
- **Update anomalies:** Changes to shared user information could require updates to multiple records.
- **Data consistency problems:** Repeated user records could become inconsistent.
- **Poor relationship representation:** Role assignments would not be represented as independent records.

Similarly, storing `UserId` directly in `ROLES` would not adequately represent a role assigned to multiple users without introducing similar structural problems.

The junction table resolves this by representing each user-role assignment as a separate record, without duplicating the main user or role records.

## 3. Junction Table Structure

### Table: `USER_ROLE`

The junction table connects `USERS` and `ROLES` through two foreign keys.

| Attribute | Role | Description |
|---|---|---|
| `UserId` | Foreign Key | References the corresponding user in `USERS`. |
| `RoleId` | Foreign Key | References the corresponding role in `ROLES`. |

This produces two One-to-Many relationships:

- `USERS` (1) → (N) `USER_ROLE`
- `ROLES` (1) → (N) `USER_ROLE`

Together, these relationships implement the original Many-to-Many relationship.

## 4. Key Requirements

### 4.1 Foreign Keys

Both `UserId` and `RoleId` shall be foreign keys referencing their respective parent tables.

Both attributes shall be mandatory and shall not accept `NULL` values.

### 4.2 Preventing Duplicate Assignments

The combination of `UserId` and `RoleId` must be unique.

This prevents the same role from being assigned to the same user more than once in `USER_ROLE`.

For example, the following assignments must not coexist:

| `UserId` | `RoleId` |
|---|---|
| 101 | 3 |
| 101 | 3 |

The same user may have different roles, and the same role may be assigned to different users. Only a duplicate combination is prohibited.

**Primary Key decision:** The composite key `(UserId, RoleId)` is a possible candidate for the primary key, but the final primary-key strategy remains to be explicitly confirmed. Regardless of that decision, the pair must remain unique.

## 5. Role Assignment Attributes

Each user-role assignment requires its own lifecycle and activity information.

### 5.1 `UserRoleStatus`

**Purpose:** Represents the status of a specific role assignment for a particular user.

Each user-role assignment has an independent status. The assignment status must not be confused with the status of the role definition in `ROLES` or the account status in `USERS`.

- Attribute type: Simple attribute.
- Nullability: Required; `NULL` is not permitted.
- Allowed values and their detailed meanings: To be documented using the agreed business rules and supporting status reference.

The status model is illustrated below.

![DATABASE-USER-DOMAIN-USERSTATUS-VS-USERROLESTATUS.svg](/RELATIONS-AND-KEYS-SOLUTION/DATABASE-USER-DOMAIN/RELATIONSHIP-IMAGERS/DATABASE-USER-DOMAIN-USERSTATUS-VS-USERROLESTATUS.svg)

### 5.2 `UserRoleActiveNow`

**Purpose:** Indicates whether a particular role assignment represents the user's currently active role context.

- Attribute type: Simple attribute.
- Nullability: Required; `NULL` is not permitted.
- Intended meaning: Indicates whether the user is currently operating under this assigned role.

The system shall support the following business rules:

- A user operates under only one active role context at a time.
- A user explicitly selects the role under which they wish to operate.
- A user may switch between assigned roles without logging out.
- Activating a new role terminates the user's previous active role context.
- Multiple active role contexts for the same user must be prevented across devices.
- `UserRoleActiveNow` indicates the current active-role state of an assignment.

The backend authentication and authorization mechanisms are expected to manage role-context activation and switching. The attribute provides a data representation of that state; its presence alone does not guarantee that concurrent active contexts are prevented.

The enforcement mechanism and the consistency of this attribute will be addressed during the relevant implementation and constraints stages.

## 6. Role Lifecycle and Historical Records

The `USER_ROLE` design must support the following business rules:

- **BR-012:** Changing or removing a role shall not affect existing historical business records.
- **BR-013:** Historical business records shall remain preserved regardless of the role's current status.
- **BR-014:** Role assignments shall support soft deletion rather than physical deletion.
- **BR-015:** Each role assignment shall maintain its own activity status.
- **BR-016:** Inactive roles shall not perform new business operations while preserving historical records.

The assignment's lifecycle must remain independent of the lifecycle of the role definition itself. Detailed status transitions and historical-record handling will be addressed in the Lifecycle and Decision Finalization stage.

## 7. Active Role Context Business Rules

The following business rules define how the active role context behaves:

- **BR-017:** A user shall operate under only one active role context at a time.
- **BR-018:** A user shall explicitly select the role under which they wish to operate.
- **BR-019:** A user may switch between assigned roles without logging out.
- **BR-020:** Activating a new role shall terminate the current active role session.
- **BR-021:** The system shall prevent multiple active role contexts for the same user across all devices.
- **BR-022:** Each role assignment shall contain a `UserRoleActiveNow` attribute indicating whether it is currently active.
- **BR-023:** At most one assigned role may have `UserRoleActiveNow = 1` at any time.

These rules define the intended behavior. The mechanism for enforcing the single-active-role requirement across devices remains an implementation concern to be addressed in the appropriate design stages.

## 8. Initial Integrity Requirements

The following requirements have been identified at this stage:

1. `UserId` must reference an existing user.
2. `RoleId` must reference an existing role.
3. Neither foreign key may be `NULL`.
4. The `(UserId, RoleId)` combination must be unique.
5. `UserRoleStatus` must not be `NULL`.
6. `UserRoleActiveNow` must not be `NULL`.
7. The system must enforce the single-active-role business rule across devices.

These are initial integrity requirements, not the complete final constraint specification. Their implementation details will be documented in the Constraints stage.

## 9. Decisions Still to Be Finalized

The following matters must remain open until explicitly decided:

- Whether `(UserId, RoleId)` will serve as the composite primary key or whether the table will use a separate primary key.
- The exact allowed values and transition rules for `UserRoleStatus`.
- The precise enforcement mechanism for allowing at most one active role context per user across all devices.
- The handling of active-role state during role deactivation, soft deletion, and other lifecycle transitions.

![001-DATABASE-USER-DOMAIN-USERS-AND-ROLES-RELATIONSHIP-AND-KEYS-SOLUTION](/RELATIONS-AND-KEYS-SOLUTION/DATABASE-USER-DOMAIN/RELATIONSHIP-IMAGERS/001-DATABASE-USER-DOMAIN-USERS-AND-ROLES-RELATIONSHIP-AND-KEYS-SOLUTION.svg)

---

# ROLE_CATEGORIES – ROLES Relationship Solution

## 1. Relationship Overview

The relationship between `ROLE_CATEGORIES` and `ROLES` is **One-to-Many (1:N)**.

- A role category may contain zero or many roles.
- Each role must belong to exactly one role category.

This relationship is mandatory from the `ROLES` side and optional from the `ROLE_CATEGORIES` side.

## 2. Why Is a Junction Table Not Required?

A junction table is unnecessary because the relationship is One-to-Many rather than Many-to-Many.

Each role belongs to exactly one role category. A role cannot belong to multiple categories simultaneously under the current business rules.

Creating a junction table would introduce an additional table without being necessary to represent this relationship.

## 3. Relationship Solution

The relationship will be implemented by adding `CategoryId` to the `ROLES` table as a Foreign Key.

`ROLES.CategoryId` shall reference the primary key of `ROLE_CATEGORIES`.

This design allows multiple roles to reference the same category without duplicating the category's attributes in each role record.

## 4. Mandatory Category Assignment

Every role must belong to a category.

Therefore, `ROLES.CategoryId` must be mandatory and must not accept `NULL`.

The foreign-key relationship ensures that each assigned category identifier references an existing record in `ROLE_CATEGORIES`.

Together, the mandatory attribute and foreign-key reference ensure that a role cannot exist without a valid category assignment.

## 5. Why Is the Foreign Key Stored in ROLES?

The foreign key is stored in `ROLES` because each role belongs to one category, while one category may contain multiple roles.

Placing `CategoryId` in `ROLES` allows multiple role records to reference the same category record.

Storing role identifiers in `ROLE_CATEGORIES` would not represent the One-to-Many relationship as naturally and would introduce unnecessary complexity when a category contains multiple roles.

## 6. Final Relationship Structure

- `ROLE_CATEGORIES` (1) → (N) `ROLES`
- Foreign Key: `ROLES.CategoryId`
- References: `ROLE_CATEGORIES` primary key
- Nullability: `NOT NULL`
- Junction Table: Not required

![]
