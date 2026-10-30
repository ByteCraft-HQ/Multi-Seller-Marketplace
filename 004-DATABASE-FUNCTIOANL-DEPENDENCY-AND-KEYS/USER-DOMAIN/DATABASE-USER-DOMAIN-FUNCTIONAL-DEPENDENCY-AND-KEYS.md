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

- `RoleID`
- `RoleName`

Both attributes uniquely identify a role record and determine all the remaining attributes.

### FD-001: RoleID

\[
RoleID \rightarrow All\ Role\ Attributes
\]

### FD-002: RoleName

\[
RoleName \rightarrow All\ Role\ Attributes
\]

### Dependent Attributes

Both determinants determine the following attributes:

- `RoleID`
- `RoleName`
- `RoleStatus`
- `RoleCreatedAt`
- `RoleCategoryName`

### Functional Dependency Rules

- `RoleID` is unique and identifies exactly one role record.
- `RoleName` is required and unique across all role records.
- Both determinants independently determine all remaining attributes.
- No additional functional dependencies between non-key attributes have been identified.

---

## 2. Super Keys

A Super Key is an attribute or combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.

Examples of Super Keys:

- `RoleID`
- `RoleName`
- `(RoleID, RoleName)`
- `(RoleID, RoleStatus)`
- `(RoleName, RoleCreatedAt)`
- Other combinations containing either `RoleID` or `RoleName`.

---

## 3. Candidate Keys

The Candidate Keys are:

- `RoleID`
- `RoleName`

Both attributes independently identify each role record and contain no unnecessary attributes.

A Candidate Key is a minimal Super Key.

---

## 4. Primary Key (PK)

**Selected Primary Key: `RoleID`**

`RoleID` is selected as the Primary Key because:

- It is unique for every role.
- It is stable and should not change over time.
- It is independent of the role's descriptive name.
- It provides a consistent identifier for each role.
- It simplifies database maintenance.

---

## 5. Alternate Key

`RoleName` is selected as the Alternate Key because:

- It is a Candidate Key.
- It is required and unique.
- It independently identifies a role record.
- It is not selected as the Primary Key because role names may change over time.

---

## 6. Surrogate Key

`RoleID` is classified as a Surrogate Key because it is an artificial identifier created specifically for database identification rather than derived from real-world information.

---

## 7. Natural Key

`RoleName` is classified as a Natural Key because it represents the actual name of the role within the system.

However, its value may change as the system evolves, making it less suitable as a permanent identifier.

---

## 8. Composite Super Keys

Any combination containing `RoleID` or `RoleName` with additional attributes is a Super Key because either attribute independently identifies the entire record.

However, these combinations are not Candidate Keys because they contain unnecessary attributes.

---

## 9. Final Key Classification

| Attribute | Classification |
|---|---|
| `RoleID` | Primary Key, Candidate Key, Surrogate Key, Super Key |
| `RoleName` | Candidate Key, Alternate Key, Natural Key, Super Key |
| `(RoleID, RoleName)` | Composite Super Key, Not a Candidate Key |

**Final Decision:** `RoleID` is selected as the Primary Key, while `RoleName` is retained as an Alternate Key. Both are Candidate Keys because each independently determines all attributes in the `Roles` table.

![002-DATABASE-ROLES-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEY](/004-DATABASE-FUNCTIOANL-DEPENDENCY-AND-KEYS/USER-DOMAIN/KEYS-IMAGES/002-DATABASE-ROLES-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS.svg)
