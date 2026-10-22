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

