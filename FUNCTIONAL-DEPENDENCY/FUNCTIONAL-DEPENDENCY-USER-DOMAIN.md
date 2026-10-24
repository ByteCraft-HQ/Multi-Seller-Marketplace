# Functional Dependency – USERS

## 1. Overview

Functional Dependency describes the relationship between attributes in a table, where one attribute or a set of attributes determines the value of another attribute or set of attributes.

It is represented as:

`X → Y`

Where:
- `X` is the determinant.
- `Y` is the dependent attribute or set of dependent attributes.

This stage identifies the functional dependencies within the `USERS` table based on its previously established keys and business rules.

## 2. Primary Functional Dependency

The `UserId` attribute is the Primary Key of the `USERS` table.

Since each `UserId` identifies exactly one user, it determines all remaining attributes belonging to that user.

**Functional Dependency:**

`UserId → All User Attributes`

This means that once the `UserId` is known, the values of the other attributes in the same user record can be determined.

## 3. Alternate Functional Dependency

The `UserEmail` attribute is unique and required for every user account. Based on the established business rules, the same email address cannot be assigned to more than one account.

Therefore, `UserEmail` also determines all attributes belonging to the corresponding user.

**Functional Dependency:**

`UserEmail → All User Attributes`

This dependency exists because `UserEmail` uniquely identifies a user record under the current business rules.

## 4. Functional Dependency Summary

The `USERS` table has two candidate keys identified during the Keys stage:

- `UserId` — selected as the Primary Key.
- `UserEmail` — retained as an alternate candidate key.

Both attributes independently determine all attributes in the `USERS` table.

| Determinant | Dependent Attributes |
|---|---|
| `UserId` | All remaining user attributes |
| `UserEmail` | All remaining user attributes |

The choice of `UserId` as the Primary Key is a previously established design decision. The functional dependencies document how the attributes depend on the selected and alternate keys; they do not determine which candidate key must be selected as the Primary Key.

## 5. Design Considerations

- `UserId` remains the stable internal identifier for a user account.
- `UserEmail` must remain unique and required to preserve its role as an alternate candidate key.
- Changes to `UserEmail` must not change the user's `UserId`.
- The uniqueness and requiredness of `UserEmail` must be enforced by the database constraints or an equivalent reliable mechanism.

## 6. Conclusion

The `USERS` table contains two primary functional dependencies:

`UserId → All User Attributes`

`UserEmail → All User Attributes`

These dependencies follow from the previously established key definitions and the business rule requiring a unique email address for every user account.

The identified dependencies will be used in subsequent normalization analysis where applicable.

---

# Functional Dependency – ROLE_CATEGORIES

## 1. Overview

This stage identifies the functional dependencies within the `ROLE_CATEGORIES` table based on the previously established keys and business rules.

The `RoleCategoryName` attribute was selected as the Primary Key because it represents the category's identity and is expected to remain stable over the long term.

In contrast, `RoleCategoryManager` represents the manager responsible for the category and may change according to the company's organizational structure and business needs.

## 2. Primary Functional Dependency

`RoleCategoryName` is the Primary Key of the `ROLE_CATEGORIES` table.

Each category name identifies one category record and determines the values of its remaining attributes.

**Functional Dependency:**

`RoleCategoryName → All Role Category Attributes`

This means that knowing the `RoleCategoryName` determines the corresponding values of the other attributes in the same category record.

## 3. Manager Attribute

`RoleCategoryManager` represents the manager responsible for a role category.

The manager may change over time, for example, when the company changes its organizational structure or assigns a different manager.

Therefore, `RoleCategoryManager` was not selected as the Primary Key.

The following dependency does not hold under the established business rules:

`RoleCategoryManager → All Role Category Attributes`

A manager may be responsible for multiple categories, so the manager's identity does not necessarily determine a single category record.

However, the manager attribute is determined by the category name in the current table design:

`RoleCategoryName → RoleCategoryManager`

## 4. Partial Functional Dependencies

A partial functional dependency occurs when a non-key attribute depends on only part of a composite candidate key.

The `ROLE_CATEGORIES` table uses `RoleCategoryName` as a single-attribute Primary Key.

Therefore, there is no proper subset of this Primary Key on which a partial functional dependency could be based.

**Conclusion:** No partial functional dependencies exist with respect to the selected Primary Key.

## 5. Design Considerations

- `RoleCategoryName` identifies the category and was selected as the Primary Key.
- `RoleCategoryManager` may change without changing the category's identity.
- A manager change does not require changing `RoleCategoryName`.
- The Primary Key selection is consistent with the established business rules and the expected stability of category names.

## 6. Conclusion

The primary functional dependency identified for the `ROLE_CATEGORIES` table is:

`RoleCategoryName → All Role Category Attributes`

The manager attribute does not determine a category record because the same manager may be responsible for multiple categories.

The table has no partial functional dependencies with respect to its single-attribute Primary Key.


---

# Functional Dependency – ROLES

## 1. Overview

This document identifies the functional dependencies within the `ROLES` table based on the previously established keys and business rules.

The two main attributes considered in this analysis are:

- `RoleId`
- `RoleName`

Both attributes can uniquely identify a role under the established business rules. However, `RoleId` was selected as the Primary Key.

## 2. Primary Functional Dependency

`RoleId` is the Primary Key of the `ROLES` table.

Each `RoleId` identifies exactly one role and determines the values of all remaining attributes belonging to that role.

**Functional Dependency:**

`RoleId → All Role Attributes`

This means that knowing the `RoleId` determines the corresponding values of the other attributes in the same role record.

## 3. Alternate Functional Dependency

`RoleName` is required and unique according to the established business rules.

Therefore, each `RoleName` identifies a single role record and determines its remaining attributes.

**Functional Dependency:**

`RoleName → All Role Attributes`

Since both `RoleId` and `RoleName` independently identify a role, they are candidate keys under the current business rules.

`RoleId` was selected as the Primary Key, while `RoleName` remains an alternate candidate key.

## 4. Why RoleId Was Selected as the Primary Key

Although `RoleName` is unique, `RoleId` was selected as the Primary Key for the following reasons:

- **Stability:** A role name may change as business terminology or organizational requirements evolve, whereas the internal identifier can remain unchanged.
- **Relationship Management:** Other tables can reference a stable identifier instead of relying on a descriptive name.
- **Maintainability:** Renaming a role does not require changing its identifier in related records.
- **Storage and Processing:** A compact numeric identifier can be more efficient for indexing and joins than a longer text-based key, depending on the chosen data types and schema.
- **Scalability:** Using a stable internal identifier reduces the impact of changes to descriptive attributes as the system evolves.

These considerations support the previously established decision to use `RoleId` as the Primary Key.

## 5. Functional Dependency Summary

| Determinant | Dependent Attributes |
|---|---|
| `RoleId` | All remaining role attributes |
| `RoleName` | All remaining role attributes |

The following dependencies are identified:

`RoleId → All Role Attributes`

`RoleName → All Role Attributes`

Because `RoleId` and `RoleName` each determine all remaining attributes, the two attributes also determine each other under the established uniqueness rules:

`RoleId → RoleName`

`RoleName → RoleId`

## 6. Partial Functional Dependencies

A partial functional dependency occurs when a non-key attribute depends on only part of a composite candidate key.

The `ROLES` table uses single-attribute candidate keys: `RoleId` and `RoleName`.

Therefore, no partial functional dependencies exist with respect to these candidate keys.

## 7. Conclusion

The `ROLES` table has two candidate keys identified in this analysis:

- `RoleId` — selected as the Primary Key.
- `RoleName` — retained as an alternate candidate key.

Both attributes uniquely determine the complete role record. `RoleId` was preferred because it provides a stable internal identifier and reduces the impact of changes to the role's descriptive name.

The identified functional dependencies will be used in subsequent normalization analysis where applicable.

---

# Functional Dependency – UsersPhoneNumbers

## 1. Overview

The `UsersPhoneNumbers` table stores the phone numbers associated with user accounts, along with their verification and status information.

The table contains the following attributes:

- `UserId`
- `UserPhoneNumber`
- `UserPhoneNumberVerification`
- `UserPhoneNumberStatus`

Each phone number must be unique across the system and can belong to only one user.

## 2. Primary Functional Dependency

The Composite Primary Key consists of:

`(UserId, UserPhoneNumber)`

The combination identifies a phone number record associated with a specific user and determines all attributes in that record.

**Functional Dependency:**

`(UserId, UserPhoneNumber) → All UsersPhoneNumbers Attributes`

More specifically:

`(UserId, UserPhoneNumber) → UserPhoneNumberVerification, UserPhoneNumberStatus`

## 3. Phone Number Functional Dependency

`UserPhoneNumber` is unique across the system and is associated with only one user.

Therefore, the phone number independently determines all attributes in the corresponding record.

**Functional Dependency:**

`UserPhoneNumber → All UsersPhoneNumbers Attributes`

This also establishes the following dependency:

`UserPhoneNumber → UserId`

Although `UserPhoneNumber` is unique, the Composite Primary Key remains the selected design decision.

## 4. Key Design Considerations

The Composite Primary Key was selected to represent the association between a user and their phone number using both `UserId` and `UserPhoneNumber`.

The design also considers that a phone number may change in the future, while `UserId` remains stable.

However, because `UserPhoneNumber` is part of the Composite Primary Key, changing the phone number changes the complete key value.

The stable `UserId` component does not prevent the Composite Primary Key itself from changing.

To enforce system-wide phone number uniqueness, `UserPhoneNumber` must also have a `UNIQUE` constraint.

## 5. Functional Dependency Summary

| Determinant | Dependent Attributes |
|---|---|
| `(UserId, UserPhoneNumber)` | All attributes in the record |
| `UserPhoneNumber` | All attributes in the record |
| `UserPhoneNumber` | `UserId` |

`UserId` alone does not determine a single phone number record because one user may have multiple phone numbers.

## 6. Normalization Consideration

Because `UserPhoneNumber` alone determines all attributes in the record, it is a candidate key under the established uniqueness rule.

The combination `(UserId, UserPhoneNumber)` is not a minimal candidate key because `UserPhoneNumber` alone is sufficient to identify the record.

Therefore, although the Composite Primary Key is retained as the chosen design decision, this functional dependency should be considered during subsequent normalization analysis.

## 7. Conclusion

The `UsersPhoneNumbers` table uses `(UserId, UserPhoneNumber)` as its selected Composite Primary Key and enforces system-wide uniqueness on `UserPhoneNumber`.

The principal functional dependencies are:

`(UserId, UserPhoneNumber) → All UsersPhoneNumbers Attributes`

`UserPhoneNumber → All UsersPhoneNumbers Attributes`

`UserPhoneNumber → UserId`

These dependencies document the current business rules and will be considered in the subsequent normalization stages.

---

