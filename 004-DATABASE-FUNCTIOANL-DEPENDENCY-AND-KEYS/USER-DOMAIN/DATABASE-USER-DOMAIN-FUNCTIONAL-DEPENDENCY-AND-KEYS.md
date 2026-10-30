\# User Domain — Table 1: Users



\## 1. Functional Dependencies



The `Users` table has two independent determinants:



\- `UserId`

\- `UserEmail`



Both attributes uniquely identify a user record and determine all the remaining attributes in the table.



\### FD-001: UserId



\\\[

UserId \\rightarrow All\\ User\\ Attributes

\\]



`UserId` determines the following attributes:



\- `UserEmail`

\- `UserFirstName`

\- `UserMiddleName`

\- `UserLastName`

\- `UserEmailVerification`

\- `UserHashPassword`

\- `UserAccountStatus`

\- `UserDeletedAt`

\- `UserDeletedReason`

\- `UserDeletedTextReason`

\- `UserRecoveryEmail`

\- `UserRecoveryEmailVerification`

\- `UserBirthDate`

\- `UserCreatedAt`

\- `UserGender`



\### FD-002: UserEmail



\\\[

UserEmail \\rightarrow All\\ User\\ Attributes

\\]



`UserEmail` determines the following attributes:



\- `UserId`

\- `UserFirstName`

\- `UserMiddleName`

\- `UserLastName`

\- `UserEmailVerification`

\- `UserHashPassword`

\- `UserAccountStatus`

\- `UserDeletedAt`

\- `UserDeletedReason`

\- `UserDeletedTextReason`

\- `UserRecoveryEmail`

\- `UserRecoveryEmailVerification`

\- `UserBirthDate`

\- `UserCreatedAt`

\- `UserGender`



\### Functional Dependency Rules



\- `UserId` is unique and identifies exactly one user record.

\- `UserEmail` is required and unique across all user records.

\- Both determinants independently determine all remaining attributes.

\- No additional functional dependencies between non-key attributes have been identified.

\- Phone numbers are excluded from this table because they are handled separately after applying First Normal Form (1NF).



\---



\## 2. Super Keys



A Super Key is an attribute or combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.



Based on the identified functional dependencies, the following are examples of Super Keys:



\- `UserId`

\- `UserEmail`

\- `(UserId, UserEmail)`

\- `(UserId, UserFirstName)`

\- `(UserEmail, UserLastName)`

\- Other combinations containing either `UserId` or `UserEmail`.



\*\*Important:\*\* A combination containing an existing Candidate Key is a Super Key, but it is not necessarily a Candidate Key because it may contain unnecessary attributes.



\---



\## 3. Candidate Keys



The identified Candidate Keys are:



\- `UserId`

\- `UserEmail`



Each Candidate Key independently identifies a user record and is minimal, meaning it contains no unnecessary attributes.



No additional Candidate Keys have been identified based on the current business rules and functional dependencies.



\---



\## 4. Primary Key (PK)



\*\*Selected Primary Key: `UserId`\*\*



`UserId` is selected as the Primary Key because:



\- It is unique for every user.

\- It is stable and should not change over time.

\- It is independent of personal information.

\- It provides a consistent identifier for the user within the system.



\---



\## 5. Alternate Key



`UserEmail` is selected as the Alternate Key because:



\- It is a Candidate Key.

\- It is required and unique.

\- It independently identifies a user record.

\- It is not selected as the Primary Key because email addresses can change over time.



\---



\## 6. Surrogate Key



`UserId` is classified as a Surrogate Key because it is a system-generated identifier created specifically for database identification rather than derived from real-world information.



\---



\## 7. Natural Key



`UserEmail` is classified as a Natural Key because it is a real-world attribute that can uniquely identify a user under the defined business rules.



However, it is changeable, which makes it less suitable as a permanent internal identifier.



\---



\## 8. Final Key Classification



| Attribute | Classification |

|---|---|

| `UserId` | Primary Key, Candidate Key, Surrogate Key |

| `UserEmail` | Alternate Key, Candidate Key, Natural Key |

| `(UserId, UserEmail)` | Super Key, Not a Candidate Key |



\*\*Final Decision:\*\* `UserId` is selected as the Primary Key, while `UserEmail` is retained as an Alternate Key. Both are Candidate Keys because each independently determines all attributes in the `Users` table.

![001-DATABASE-USERS-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS](/004-DATABASE-FUNCTIOANL-DEPENDENCY-AND-KEYS/USER-DOMAIN/KEYS-IMAGES/001-DATABASE-USERS-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS.svg)

---

# User Domain — Table 2: Roles

## 1. Functional Dependencies

The `Roles` table has two independent determinants:

- `RoleId`
- `RoleName`

Both attributes uniquely identify a role record and determine all the remaining attributes in the table.

### FD-001: RoleId

\[
RoleId \rightarrow All\ Role\ Attributes
\]

### FD-002: RoleName

\[
RoleName \rightarrow All\ Role\ Attributes
\]

The attributes determined by both determinants are:

- `RoleId`
- `RoleName`
- `RoleStatus`
- `RoleCreatedAt`
- `RoleCategoryName`

### Functional Dependency Rules

- `RoleId` uniquely identifies each role record.
- `RoleName` is required and unique across all role records.
- Duplicate role names are not allowed.
- Both determinants independently determine all attributes in the `Roles` table.
- No additional functional dependencies between non-key attributes have been identified.

---

## 2. Super Keys

A Super Key is an attribute or combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.

Examples of Super Keys in the `Roles` table:

- `RoleId`
- `RoleName`
- `(RoleId, RoleName)`
- `(RoleId, RoleStatus)`
- `(RoleName, RoleCreatedAt)`
- Other combinations containing either `RoleId` or `RoleName`.

**Important:** A combination containing an existing Candidate Key is a Super Key, but it is not necessarily a Candidate Key because it may contain unnecessary attributes.

---

## 3. Candidate Keys

The Candidate Keys are:

- `RoleId`
- `RoleName`

Each Candidate Key independently identifies a role record and contains no unnecessary attributes.

A Candidate Key is a minimal Super Key.

---

## 4. Primary Key (PK)

**Selected Primary Key: `RoleId`**

`RoleId` is selected as the Primary Key because:

- **Uniqueness:** Each role has its own unique identifier.
- **Stability:** The identifier remains unchanged when the role name changes.
- **Simplicity:** It provides a straightforward identifier for database operations.
- **Independence:** It is not tied to a descriptive name that may change over time.
- **Maintainability:** It simplifies references to roles from other tables through Foreign Keys.

---

## 5. Surrogate Key

`RoleId` is a Surrogate Key because it is an artificial identifier created specifically for the database rather than derived from real-world information.

It is preferred because the identity of a role does not depend on its name.

For example, if a role changes its name from `Editor` to `ContentEditor`, its `RoleId` remains unchanged.

---

## 6. Natural Key

`RoleName` is considered a Natural Key because it represents the actual name of the role within the system.

It qualifies as a Candidate Key because it is required and unique.

However, it may change over time, making it less suitable as the Primary Key.

---

## 7. Alternate Key

`RoleName` is an Alternate Key because it is a Candidate Key that was not selected as the Primary Key.

It must remain unique to prevent duplicate role names.

---

## 8. Final Key Classification

| Attribute | Classification |
|---|---|
| `RoleId` | Primary Key, Candidate Key, Surrogate Key |
| `RoleName` | Alternate Key, Candidate Key, Natural Key |
| `(RoleId, RoleName)` | Super Key, Not a Candidate Key |

**Final Decision:** `RoleId` is selected as the Primary Key, while `RoleName` is retained as an Alternate Key. Both are Candidate Keys because each independently determines all attributes in the `Roles` table.

**Note:** Rules concerning role name reuse, deletion, and lifecycle behavior will be documented separately in the Lifecycle and Decision Finalization stage.


