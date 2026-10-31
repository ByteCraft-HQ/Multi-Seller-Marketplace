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
![001-DATABASE-USER-DOMAIN-USERS-AND-ROLES-RELATIONSHIP-AND-KEYS](/005-RELATIONSHIP-SOLUTION/USER-DOMAIN/KEYS-IMAGES/001-DATABASE-USER-DOMAIN-USERS-AND-ROLES-RELATIONSHIP-AND-KEYS.svg)
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

The relationship will be implemented by adding `RoleCategoryName` to the `ROLES` table as a Foreign Key.

`ROLES.RoleCategoryName` shall reference the primary key of `ROLECATEGORIES`.

This design allows multiple roles to reference the same category without duplicating the category's attributes in each role record.

## 4. Mandatory Category Assignment

Every role must belong to a category.

Therefore, `ROLES.RoleCategoryName` must be mandatory and must not accept `NULL`.

The foreign-key relationship ensures that each assigned category identifier references an existing record in `ROLE_CATEGORIES`.

Together, the mandatory attribute and foreign-key reference ensure that a role cannot exist without a valid category assignment.

## 5. Why Is the Foreign Key Stored in ROLES?

The foreign key is stored in `ROLES` because each role belongs to one category, while one category may contain multiple roles.

Placing `RoleCategoryName` in `ROLES` allows multiple role records to reference the same category record.

Storing role identifiers in `ROLECATEGORIES` would not represent the One-to-Many relationship as naturally and would introduce unnecessary complexity when a category contains multiple roles.

## 6. Final Relationship Structure

- `ROLE_CATEGORIES` (1) → (N) `ROLES`
- Foreign Key: `ROLES.CategoryName`
- References: `ROLE_CATEGORIES` primary key
- Nullability: `NOT NULL`
- Junction Table: Not required
![002-DATABASE-USER-DOMAIN-ROLE-ROLECATEGORY-RELATIONSHIP-AND-KEYS-SOLUTION](/005-RELATIONSHIP-SOLUTION/USER-DOMAIN/KEYS-IMAGES/002-DATABASE-USER-DOMAIN-ROLE-ROLECATEGORY-RELATIONSHIP-AND-KEYS-SOLUTION.svg)
---

# USER_ROLE – BUSINESS_INFORMATION Relationship Solution

## 1. Relationship Overview

The relationship between `USER_ROLE` and `BUSINESS_INFORMATION` is **One-to-One (1:1)**, with optional participation from the `USER_ROLE` side and mandatory participation from the `BUSINESS_INFORMATION` side.

- A `USER_ROLE` may have zero or one associated `BUSINESS_INFORMATION` record.
- Every `BUSINESS_INFORMATION` record must belong to exactly one `USER_ROLE`.
- A role assignment that requires business information must have exactly one associated `BUSINESS_INFORMATION` record.
- A role assignment that does not require business information may exist without an associated `BUSINESS_INFORMATION` record.

## 2. Why Did the Relationship Change?

Initially, the relationship was modeled between `USERS` and `BUSINESS_INFORMATION` as One-to-Many (1:N).

However, introducing the `USER_ROLE` junction table allows each role assignment to be represented independently for a particular user.

A single user may have multiple roles, and some of those roles may require separate business information records.

For example, a user may have the following roles:

| User | Role | Business Information Requirement |
|---|---|---|
| User 1 | Seller | Required |
| User 1 | StoreManager | Required |
| User 1 | SystemAdmin | Not required |

In this example, User 1 requires two separate `BUSINESS_INFORMATION` records: one associated with the Seller assignment and another associated with the StoreManager assignment.

The SystemAdmin assignment does not require a business information record.

Therefore, associating business information with `USER_ROLE` rather than directly with `USERS` allows each business profile to correspond to the specific role assignment that requires it.

## 3. Relationship Solution

The relationship will be implemented by adding `UserRoleId` to the `BUSINESS_INFORMATION` table as a Foreign Key.

- **Foreign Key:** `BUSINESS_INFORMATION.UserRoleId`
- **Referenced Attribute:** `USER_ROLE.UserRoleId`
- **Nullability:** `NOT NULL`
- **Uniqueness:** `UNIQUE`

The foreign key must reference an existing `USER_ROLE` record.

The `NOT NULL` requirement ensures that every business information record is associated with a role assignment.

The `UNIQUE` requirement ensures that a single role assignment cannot be associated with multiple business information records.

Together, these constraints establish the One-to-One relationship at the database level, with optional participation from the `USER_ROLE` side.

## 4. Participation and Cardinality

### USER_ROLE Side

A role assignment may have zero or one associated business information record.

- Minimum cardinality: 0
- Maximum cardinality: 1
- Participation: Optional

However, when the assigned role requires business information, the role assignment must have exactly one associated business information record.

### BUSINESS_INFORMATION Side

Every business information record must be associated with exactly one role assignment.

- Minimum cardinality: 1
- Maximum cardinality: 1
- Participation: Mandatory

## 5. Business Rules

1. Each business information record must belong to exactly one role assignment.
2. A role assignment must not be associated with more than one business information record.
3. Role assignments that require business information must have exactly one associated business information record.
4. Role assignments that do not require business information may exist without an associated business information record.
5. Business information records must remain associated with the specific role assignment for which they were created.

## 6. Enforcement Considerations

The following database constraints support the relationship:

- A Foreign Key on `BUSINESS_INFORMATION.UserRoleId` referencing `USER_ROLE.UserRoleId`.
- A `NOT NULL` constraint on `BUSINESS_INFORMATION.UserRoleId`.
- A `UNIQUE` constraint on `BUSINESS_INFORMATION.UserRoleId`.

These constraints ensure that every business information record references one existing role assignment and that each role assignment has at most one associated business information record.

However, these constraints alone cannot guarantee that every role assignment requiring business information already has an associated record. That requirement must be enforced through an appropriate system-level mechanism.

The exact enforcement mechanism will be addressed in the relevant implementation and constraints stages.
![003-DATABASE-USER-DOMAIN-USERROLE-BUSINESSINFORMATION-RELATIONSHIP-AND-KEYS-SOLUTION](/005-RELATIONSHIP-SOLUTION/USER-DOMAIN/KEYS-IMAGES/003-DATABASE-USER-DOMAIN-USERROLE-BUSINESSINFORMATION-RELATIONSHIP-AND-KEYS-SOLUTION.svg)

![000-DATABASE-USER-DOMAIN-RELATIONSHIP-SOLUTION](/005-RELATIONSHIP-SOLUTION/USER-DOMAIN/KEYS-IMAGES/000-DATABASE-USER-DOMAIN-RELATIONSHIP-SOLUTION.svg)
