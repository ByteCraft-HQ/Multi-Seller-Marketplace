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

