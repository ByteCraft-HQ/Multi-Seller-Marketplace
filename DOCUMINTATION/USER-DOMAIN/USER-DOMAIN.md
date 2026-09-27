# Users Domain — Logical Model Documentation

## 1. Domain Overview

The Users Domain is responsible for representing users across the system, their assigned roles, role categories, role-specific lifecycle and status, active role context, and business information associated with specific role assignments.

The main design principle is to keep common user information separate from role-specific information and to model user-role assignments independently.

The domain consists of the following main concepts:

* `User`
* `Role`
* `UserRole`
* `RoleCategory`
* `BusinessInformation`

---

# 2. User Entity

## 2.1 Purpose

The `User` entity represents all users across the entire system, regardless of their assigned role.

All users share a set of standard account attributes. These attributes are common across users and should therefore be maintained in a single `User` entity.

User classification is determined through assigned roles rather than through separate user entities.

## 2.2 Why All Users Are Represented in One Entity

The system may contain users with completely different roles, such as customers, sellers, system employees, and system visitors.

Despite their different classifications, they still share common account information.

Therefore, creating separate entities for each user type would unnecessarily separate users who share the same standard account information.

Instead, the system maintains one `User` entity and determines the user's classification through role assignments.

### Business Rules

#### BR-007

All users shall be represented within a single User entity.

#### BR-008

User classification shall be determined by assigned roles rather than separate user entities.

#### BR-009

The User entity shall contain only common account information shared by all users.

---

# 3. User and Role Separation

The role should not be stored directly inside the `User` entity.

A user may have one role, two roles, three roles, or potentially more roles.

Storing roles directly inside the `User` entity would create several problems.

## 3.1 Multiple Role Problem

If each role were represented by a separate column inside the `User` entity, adding more roles would require adding more columns.

For example, the structure could gradually become something similar to:

* `Role1`
* `Role2`
* `Role3`
* `Role4`
* etc.

This would result in unnecessary nullable values for users who do not have the corresponding number of roles.

It would also make the structure difficult to maintain as the number of available roles changes.

## 3.2 Repetition and Redundancy

Another possible approach would be to duplicate the user's information for every role assigned to that user.

This would result in repeated user information and unnecessary redundancy.

It could also introduce inconsistency because the same user's common information could be stored multiple times.

## 3.3 Normalized Solution

To avoid these problems, the `User` and `Role` concepts are separated.

The relationship between users and roles is then represented through a separate junction entity: `UserRole`.

This allows a user to have multiple roles without duplicating the user's common information.

It also allows new roles to be introduced without changing the structure of the `User` entity.

> **Relationship / Normalization Diagram**
>
> *Add the relationship image here.*

---

# 4. User–Role Relationship

The relationship between `User` and `Role` is many-to-many.

A user may have multiple roles.

A role may be assigned to multiple users.

A role may also exist without currently being assigned to any user.

Therefore:

* A `User` must have at least one role.
* A `Role` may have zero, one, or many users.

The relationship can therefore be described as:

**User: Mandatory Many — Role: Optional Many**

> **User–Role Relationship Diagram**
>
> ![001-User-Domain-Relationship](DOCUMINTATION/USER-DOMAIL/IMAGES/001-USER-DOMAIN-RELATION-SHIP.svg)

---

# 5. UserRole Junction Entity

## 5.1 Purpose

The `UserRole` entity resolves the many-to-many relationship between users and roles.

It provides a dedicated place to represent a specific role assignment for a specific user.

This separation provides several benefits.

A user can receive an additional role without duplicating the user's common information.

The system can also scale the number of available roles without requiring additional role columns inside the `User` entity.

The `UserRole` entity is also an important part of the domain because several other parts of the system will later depend on the specific user-role assignment.

For this reason, the `UserRole` entity is treated as an important central entity within the Users Domain.

---

# 6. Why Roles Must Be Independent From Users

Separating roles from users is also required because roles have their own independent behavior and lifecycle.

A single user may simultaneously have different roles, and those roles must remain independent from one another.

### Business Rules

#### BR-002

A user may simultaneously be classified as both a System Visitor and a System Employee.

#### BR-003

Each assigned role shall maintain its own independent lifecycle and status.

#### BR-004

Administrative actions performed on one role shall not automatically affect the user's other assigned roles unless explicitly required by business policy.

#### BR-005

A registered user account may simultaneously be assigned both the Customer role and the Seller role.

#### BR-006

Each assigned role shall expose its own permissions, operations, and user interface independently.

These rules require the role assignment to be treated independently rather than treating the user's roles as a single combined classification.

---

# 7. Role Categories

Roles are classified under role categories.

Examples of role categories include:

* System Employee
* System Visitor

Each role belongs to one category.

## 7.1 Why Role Category Must Be Separate

The role category should not be stored directly inside the `Role` entity.

The system may evolve over time, and roles may be reclassified under different categories.

A role that belongs to one category today may belong to another category later.

Embedding the category directly into the role structure would make the category tightly coupled to the role entity and would not provide the desired normalized structure.

Therefore, role categories are represented by a separate `RoleCategory` entity.

The `RoleCategory` entity contains the available role categories that roles may belong to.

---

# 8. Role–RoleCategory Relationship

Each role must belong to exactly one role category.

A role category does not necessarily need to have any roles assigned to it and may contain multiple roles.

Therefore, the relationship is:

**Role: Mandatory Many — RoleCategory: Optional One**

In other words:

* Every `Role` must have one `RoleCategory`.
* A `RoleCategory` may have zero, one, or many `Role` records.

> **Role–RoleCategory Relationship Diagram**
>
> *Add the relationship image here.*

## 8.1 Relationship Independence

Separating `RoleCategory` from `Role` also supports the independent lifecycle and status of individual roles.

The category represents classification, while the role itself maintains its own role-specific state.

These concepts should therefore remain separate.

---

# 9. Role Lifecycle

Roles and role assignments are subject to lifecycle changes.

Roles may be changed or removed over time, but historical business records must remain preserved.

### Business Rules

#### BR-012

Changing or removing a role shall not affect existing historical business records.

#### BR-013

Historical business records shall remain preserved regardless of the role's current status.

#### BR-014

Role assignments shall support Soft Delete instead of physical deletion.

#### BR-015

Each role assignment shall maintain its own activity status.

#### BR-016

Inactive roles shall not perform new business operations while preserving historical records.

## 9.1 Historical Data Preservation

Historical business data must remain available even when a role is no longer active.

For this reason, physical deletion is not appropriate for role assignments.

Instead, role assignments support Soft Delete so that the historical relationship and its associated records remain preserved.

This also supports changes in the role structure over time without destroying historical business data.

Roles may change over time, including cases where roles are merged or separated.

The system therefore needs to preserve the historical state rather than physically deleting the associated data.

---

# 10. User Status vs. UserRole Status

The system maintains different levels of status.

The `User` has its own status.

Each `UserRole` also has its own status.

These statuses represent different scopes and must not be treated as the same concept.

## 10.1 User Status

The user status applies to the user's entire account.

If the user account becomes blocked, the effect applies to the user's account as a whole and therefore affects the user's assigned roles.

## 10.2 UserRole Status

The `UserRole` status applies only to that specific role assignment.

If one role assignment becomes blocked or inactive, the other role assignments belonging to the same user are not automatically affected.

For example, a user may have both Customer and Seller roles.

If the Seller role assignment becomes blocked, the Customer role assignment remains unaffected.

This separation is another important reason why role assignments must be represented independently from the user itself.

> **User Status vs. UserRole Status Example**
>
> *Add the example image here.*

---

# 11. Active Role Context

A user may have multiple assigned roles, but the system must control which role the user is currently operating under.

The user must explicitly select the role under which they want to operate.

Only one role context may be active for a user at a time.

### Business Rules

#### BR-017

A user shall operate under only one active role context at a time.

#### BR-018

A user shall explicitly select the role under which they wish to operate.

#### BR-019

A user may switch between assigned roles without logging out.

#### BR-020

Activating a new role shall terminate the current active role session.

#### BR-021

The system shall prevent multiple active role contexts for the same user across all devices.

#### BR-022

Each role assignment shall contain an `ActiveNow` attribute indicating whether it is currently active.

#### BR-023

At most one assigned role may have `ActiveNow = 1` at any time.

## 11.1 Why `ActiveNow` Exists

A user may have multiple `UserRole` records.

Without explicitly tracking the currently active role, the system would not have a clear way to determine which role the user is currently operating under.

The `ActiveNow` attribute identifies the role assignment that is currently active.

Only one role assignment can have `ActiveNow = 1` for the same user at any given time.

This also prevents a user from simultaneously operating under different roles across multiple devices.

For example, a user should not be able to operate as a Seller on one device while simultaneously operating as a Customer on another device under the same account.

---

# 12. Business Information

Business information is maintained separately from the `User` entity.

The reason is that business information is not common to every user and is dependent on the user's assigned role.

Different users may have different business information depending on their assigned roles.

For example:

* A Customer does not necessarily require business information.
* A Seller does require business information.

Therefore, business information should not be stored directly inside the `User` entity.

### Business Rules

#### BR-010

Business information shall be maintained separately from the User entity.

#### BR-011

Only roles requiring business information shall be associated with business profiles.

## 12.1 Important Edge Case

Business information cannot be added directly to the `User` entity because users may have different roles, and the business information associated with each role may differ.

A user may have multiple roles, while only some of those roles require business information.

Therefore, associating business information directly with the user would not clearly identify which role the business information belongs to.

This leads to the need for associating business information with the user's specific role assignment instead.

---

# 13. Business Information and UserRole

Business information is associated with the `UserRole` rather than directly with either the `User` or the `Role`.

The reason is that not every role requires business information.

Associating business information directly with the `User` entity would not identify which role the information belongs to when the user has multiple roles.

Associating it directly with the `Role` entity would also be insufficient because the same role may be assigned to multiple users, and each user's business information is different.

The `UserRole` entity represents the specific combination of:

* A particular user
* A particular assigned role

Therefore, it provides the appropriate context for business information.

---

# 14. UserRole–Business Information Relationship

Not every `UserRole` requires business information.

However, every `BusinessInformation` record must belong to a `UserRole`.

Therefore, the relationship is:

**UserRole: Optional One — Business Information: Mandatory One**

In other words:

* A `UserRole` may have no business information.
* A `UserRole` may have one business information record.
* Every `BusinessInformation` record must be associated with a `UserRole`.

This ensures that business information is associated with a specific user's specific role rather than being ambiguously attached to the user or the role itself.

> **UserRole–BusinessInformation Relationship Diagram**
>
> *Add the relationship image here.*

---

# 15. User Entity — Attributes

## 15.1 Primary Key

### `UserId`

`UserId` is the primary identifier of the `User` entity.

* It is the **Primary Key** of the `User` table.
* It is the **only Primary Key** in the `User` table.

The data type and constraints will be documented separately.

---

## 15.2 User Name

### `FirstName`

Stores the user's first name in the system.

### `LastName`

Stores the user's last name in the system.

Together, `FirstName` and `LastName` represent the user's name within the system.

---

## 15.3 Account Status

### `Status`

Represents the status of the user's entire account.

The `User` status operates at the account level and is different from the status of an individual `UserRole`.

If the user's account is blocked or otherwise affected by an account-level status change, the effect applies to the user's account as a whole and therefore affects all of the user's assigned roles.

This is different from `UserRole` status, which applies only to a specific role assignment.

---

## 15.4 Soft Delete

### `DeletedAt`

`DeletedAt` records when the user account was deleted.

The user account is not physically deleted from the system. Instead, the system uses **Soft Delete**.

Therefore, `DeletedAt` provides the information required to identify when the account was marked as deleted.

---

## 15.5 Authentication Information

### `Email`

The user's email address used for the account.

The email must be unique and there must be only one email associated with the account.

The email is also the account identifier through which the user can access the system regardless of the role they are operating under.

### `HashedPassword`

Stores the hashed password associated with the user's account.

The password must be stored as a **hashed password** rather than as the original password.

---

## 15.6 Email Verification

### `EmailVerification`

Used to determine whether the user's email/account has been properly verified before allowing the user to enter the system.

Email verification is an important part of validating the account before access.

---

## 15.7 Personal Information

### `Gender`

Stores the user's gender information.

### `BirthDate`

Stores the user's date of birth.

`BirthDate` can be used to derive the user's age and other information based on the date of birth.

---

## 15.8 Account Timestamps

### `CreatedAt`

Records when the user account was created.

This information can be used for analysis, including identifying older and newer accounts and other time-based analysis.

### `UpdatedAt`

Records the latest time at which a change occurred to the user account.

`UpdatedAt` is **not intended for auditing**.

It only represents the latest update time and does not identify what specifically changed.

---

# 16. User Phone Numbers

## 16.1 Multi-Valued Attribute

### `PhoneNumber`

A user may have multiple phone numbers.

Therefore, `PhoneNumber` is a **multi-valued attribute** and should not be stored directly inside the main `User` table.

To properly represent this attribute, phone numbers are separated into a dedicated table.

## 16.2 User Phone Number Entity

The phone number information is maintained in a separate table.

### Primary Key

The phone number table uses a **Composite Primary Key** consisting of:

* `UserId`
* `PhoneNumber`

Therefore, the combination of `UserId` and `PhoneNumber` uniquely identifies a phone number record.

### Foreign Key

`UserId` is also a **Foreign Key** referencing the `User` table.

Therefore, `UserId` has two roles within the phone number table:

1. It is part of the **Composite Primary Key**.
2. It is a **Foreign Key** referencing `UserId` in the `User` table.

This allows multiple phone numbers to be associated with the same user while maintaining the relationship with the corresponding user account.

---

# 17. UserRole Entity — Attributes

## 17.1 Primary Key

### `UserRoleId`

`UserRoleId` is the primary identifier of the `UserRole` entity.

It is implemented as a **Surrogate Key**.

The reason for using a surrogate key is that the `UserRole` table contains two Foreign Keys:

* `UserId`
* `RoleId`

These two Foreign Keys should not be used together as the Primary Key of the `UserRole` table.

Since `UserRole` is a junction table that will be referenced by multiple other tables, using a dedicated surrogate key provides a single identifier for each specific user-role assignment.

This avoids requiring other tables that reference `UserRole` to repeatedly carry both `UserId` and `RoleId` as a composite identifier.

---

## 17.2 Foreign Keys

### `UserId`

`UserId` is a **Foreign Key** referencing the `User` table.

It identifies the user to whom the role assignment belongs.

### `RoleId`

`RoleId` is a **Foreign Key** referencing the `Role` table.

It identifies the role assigned to the user.

Together, `UserId` and `RoleId` represent the specific relationship between a user and a role.

However, they are not used as a Composite Primary Key because `UserRole` is intended to serve as a central junction entity that will be referenced by multiple other tables.

---

## 17.3 Role Assignment Status

### `Status`

`Status` represents the status of the specific role assignment belonging to the user.

This status is independent from the user's overall account status.

A user may have multiple roles, and each role assignment can maintain its own status without automatically affecting the other role assignments.

For example, if one role assignment becomes blocked or inactive, the status of the user's other role assignments is not automatically affected.

---

## 17.4 Active Role Context

### `ActiveNow`

`ActiveNow` identifies which role the user is currently operating under.

A user may have multiple assigned roles, but the user must operate under only one active role at a time.

Therefore, `ActiveNow` is used to identify the currently active role assignment.

The system must prevent the same user from simultaneously operating under multiple roles across different devices.

For example, a user should not be able to operate under one role from one device while simultaneously operating under another role from another device.

Only one assigned role can be active for the user at a time.

---

# 18. Role Entity — Attributes

## 18.1 Primary Key

### `RoleId`

`RoleId` is the primary identifier of the `Role` entity.

It is the **Primary Key** of the `Role` table.

---

## 18.2 Role Category

### `RoleCategoryId`

`RoleCategoryId` is a **Foreign Key** referencing the `RoleCategory` table.

Since each role must belong to exactly one role category, the `RoleCategoryId` is stored within the `Role` table to represent this relationship.

This implements the previously defined relationship between `Role` and `RoleCategory`.

---

## 18.3 Role Name

### `RoleName`

`RoleName` stores the name of the role.

Each role has its own name that identifies the role within the system.

---

## 18.4 Role Status

### `Status`

`Status` represents the status of the role itself.

This status is independent from the other status attributes defined within the Users Domain.

It must not be confused with:

* `User.Status`, which represents the status of the entire user account.
* `UserRole.Status`, which represents the status of a specific role assignment for a user.
* `RoleCategory.Status`, which represents the status of the role category.

The role maintains its own independent status.

---

# 19. RoleCategory Entity — Attributes

## 19.1 Primary Key

### `RoleCategoryId`

`RoleCategoryId` is the primary identifier of the `RoleCategory` entity.

It is the **Primary Key** of the `RoleCategory` table.

---

## 19.2 Role Category Name

### `Name`

`Name` stores the name of the role category used to classify roles within the system.

A role category represents the classification under which roles are organized.

---

## 19.3 Role Category Status

### `Status`

`Status` represents the status of the role category itself.

This status belongs to the `RoleCategory` entity and is independent from the status of an individual role or a user's role assignment.

---

# 20. BusinessInformation Entity — Attributes

## 20.1 Business Information Identity

### `BusinessInformationId`

`BusinessInformationId` identifies the business information associated with the specific `UserRole`.

The detailed key and relationship constraints will be documented separately.

---

## 20.2 Business Information Email

### `Email`

Business information may contain multiple email addresses.

Because email is a **multi-valued attribute**, it is separated from the main `BusinessInformation` entity into a dedicated table.

The dedicated email table uses a Composite Primary Key consisting of:

* `BusinessInformationId`
* `Email`

---

## 20.3 Business Information Phone Number

### `PhoneNumber`

Business information may contain multiple phone numbers.

Because phone number is a **multi-valued attribute**, it is separated from the main `BusinessInformation` entity into a dedicated table.

The dedicated phone number table uses a Composite Primary Key consisting of:

* `BusinessInformationId`
* `PhoneNumber`

---

## 20.4 Opening Hours

### `OpeningHours`

`OpeningHours` represents the opening hours associated with the business information.

Workdays will be discussed separately in the future.

---

## 20.5 Workplace Name

### `WorkplaceName`

`WorkplaceName` represents the name of the workplace associated with the business information.

---

# 21. Relationships Summary

The Users Domain contains the following primary relationships:

1. `User` and `Role` have a many-to-many relationship resolved through `UserRole`.
2. `User` must have at least one assigned role.
3. `Role` may exist without being assigned to a user.
4. Each `Role` must belong to exactly one `RoleCategory`.
5. A `RoleCategory` may contain zero, one, or many roles.
6. A `UserRole` may have business information.
7. Every `BusinessInformation` record belongs to a `UserRole`.
8. `UserRole` is the central entity representing a specific user's specific role assignment.
9. User status applies to the entire account.
10. UserRole status applies only to the specific role assignment.
11. A user may have multiple assigned roles but only one active role context at a time.

> **Complete Users Domain Model**
>
> *Add the complete Users Domain logical model image here.*

---

# 22. Core Design Principles

The Users Domain follows the following principles:

1. All users are represented through a single `User` entity.
2. User classification is determined through roles.
3. Common account information remains inside the `User` entity.
4. Roles are separated from users.
5. The `UserRole` entity resolves the many-to-many relationship between users and roles.
6. Each role assignment maintains its own lifecycle and status.
7. Role categories are separated from roles.
8. Business information is separated from the `User` entity.
9. Business information is associated with the specific `UserRole` that requires it.
10. Historical business records are preserved through role-assignment lifecycle management and Soft Delete.
11. User status and UserRole status operate at different scopes.
12. A user can have multiple assigned roles but only one active role context at a time.
13. The `ActiveNow` attribute identifies the currently active role assignment.
14. Multi-valued attributes such as user phone numbers and business information emails and phone numbers are separated into dedicated entities.
