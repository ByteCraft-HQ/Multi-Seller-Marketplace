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

---

# User Domain — Table 3: RoleCategories

## 1. Functional Dependencies

The `RoleCategories` table has one identified determinant:

- `RoleCategoryName`

`RoleCategoryName` uniquely identifies each role category record and determines all the remaining attributes.

### FD-001: RoleCategoryName

\[
RoleCategoryName \rightarrow All\ RoleCategory\ Attributes
\]

### Dependent Attributes

`RoleCategoryName` determines the following attributes:

- `RoleCategoryName`
- `CategoryStatus`
- `RoleCategoryManager`
- `CategoryCreatedAt`

### Functional Dependency Rules

- `RoleCategoryName` is unique and required.
- `RoleCategoryName` independently determines all remaining attributes.
- `RoleCategoryManager` is a single-valued attribute, not a multi-valued attribute.
- `RoleCategoryManager` is not unique and does not independently identify a role category.
- No additional functional dependencies between non-key attributes have been identified.

---

## 2. Super Keys

A Super Key is an attribute or combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.

Examples of Super Keys:

- `RoleCategoryName`
- `(RoleCategoryName, CategoryStatus)`
- `(RoleCategoryName, RoleCategoryManager)`
- `(RoleCategoryName, CategoryCreatedAt)`
- Other combinations containing `RoleCategoryName`.

---

## 3. Candidate Key

The identified Candidate Key is:

- `RoleCategoryName`

It independently identifies each role category record and contains no unnecessary attributes.

A Candidate Key is a minimal Super Key.

---

## 4. Primary Key (PK)

**Selected Primary Key: `RoleCategoryName`**

`RoleCategoryName` is selected as the Primary Key because it uniquely identifies each category and is sufficient for the current design requirements.

Reasons for this choice:

- **Uniqueness:** Each category has a distinct name.
- **Simplicity:** No additional identifier is required for the current design.
- **Suitability:** The table is expected to contain a relatively small number of records.
- **Maintainability:** Changes are expected to be infrequent.

---

## 5. Natural Key

`RoleCategoryName` is classified as a Natural Key because it represents the actual name of the category within the system.

It has a meaningful business value rather than being an artificial identifier generated solely for database purposes.

---

## 6. Surrogate Key

No Surrogate Key is introduced in the current design.

A separate `RoleCategoryID` is not considered necessary because `RoleCategoryName` already satisfies the current identification requirements.

This decision can be reconsidered if the system requirements change.

---

## 7. Alternate Key

No Alternate Key is identified because `RoleCategoryName` is the only Candidate Key in the current design.

---

## 8. Composite Super Keys

Any combination containing `RoleCategoryName` with additional attributes is a Super Key because `RoleCategoryName` independently identifies the entire record.

However, these combinations are not Candidate Keys because they contain unnecessary attributes.

---

## 9. Final Key Classification

| Attribute | Classification |
|---|---|
| `RoleCategoryName` | Primary Key, Candidate Key, Natural Key, Super Key |
| `RoleCategoryManager` | Non-Key Attribute |

**Final Decision:** `RoleCategoryName` is selected as the Primary Key and is the only identified Candidate Key. No Surrogate Key or Alternate Key is introduced in the current design.

![003-DATABASE-ROLECATEGORY-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS](/004-DATABASE-FUNCTIOANL-DEPENDENCY-AND-KEYS/USER-DOMAIN/KEYS-IMAGES/003-DATABASE-ROLECATEGORY-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS.svg)

---

# User Domain — Table 4: UserPhoneNumbers

## 1. Functional Dependencies

The `UserPhoneNumbers` table contains a multi-valued attribute extracted from the `Users` table during First Normal Form (1NF).

Each user can have multiple phone numbers. However, each phone number can belong to only one user and must be unique across the entire system.

### FD-001: UserPhoneNumber

\[
UserPhoneNumber \rightarrow All\ UserPhoneNumber\ Attributes
\]

`UserPhoneNumber` determines the following attributes:

- `UserId`
- `UserPhoneNumberVerification`
- `UserPhoneNumberStatus`

### FD-002: Composite Determinant

\[
(UserId, UserPhoneNumber) \rightarrow All\ UserPhoneNumber\ Attributes
\]

The combination of `UserId` and `UserPhoneNumber` also determines the entire record.

However, this combination is not minimal because `UserPhoneNumber` independently determines all attributes.

### Functional Dependency Rules

- `UserPhoneNumber` is unique across the entire system.
- Each phone number belongs to exactly one user.
- A user can have multiple phone numbers.
- `UserId` alone cannot uniquely identify a phone number record.
- No additional functional dependencies between non-key attributes have been identified.

---

## 2. Super Keys

The identified Super Keys include:

- `UserPhoneNumber`
- `(UserId, UserPhoneNumber)`
- Other combinations containing `UserPhoneNumber`.

`UserId` alone is not a Super Key because one user can have multiple phone numbers.

---

## 3. Candidate Keys

The identified Candidate Key is:

- `UserPhoneNumber`

It independently identifies each record and contains no unnecessary attributes.

`(UserId, UserPhoneNumber)` is not a Candidate Key because it is not minimal.

---

## 4. Primary Key (PK)

**Selected Primary Key: `UserPhoneNumber`**

`UserPhoneNumber` is selected as the Primary Key because:

- It is unique across the entire system.
- It is required and cannot be NULL.
- It independently identifies each phone number record.
- It belongs to exactly one user.
- No additional identifier is required for the current design.

Although phone numbers can change, this does not prevent them from being used as Primary Keys.

---

## 5. Natural Key

`UserPhoneNumber` is classified as a Natural Key because it represents a real-world phone number rather than an artificial identifier generated specifically for database identification.

---

## 6. Alternate Keys

No Alternate Keys are identified in the current design because `UserPhoneNumber` is the only Candidate Key.

---

## 7. Surrogate Key

No Surrogate Key is introduced in the current design.

A separate `UserPhoneNumberId` is not considered necessary because `UserPhoneNumber` already uniquely identifies each record and satisfies the current requirements.

---

## 8. Composite Super Keys

The combination `(UserId, UserPhoneNumber)` is a Super Key because it uniquely identifies a phone number record.

However, it is not a Candidate Key because `UserPhoneNumber` alone is sufficient to identify the record.

---

## 9. Final Key Classification

| Attribute | Classification |
|---|---|
| `UserPhoneNumber` | Primary Key, Candidate Key, Natural Key, Super Key |
| `UserId` | Foreign Key, Non-Key Attribute |
| `(UserId, UserPhoneNumber)` | Composite Super Key, Not a Candidate Key |

---

## 10. Final Design Decision

`UserPhoneNumber` is selected as the Primary Key because it is globally unique and independently identifies each phone number record.

A separate Surrogate Key is not introduced.

The design currently has no other tables referencing `UserPhoneNumber`, so changing a phone number does not require updating Foreign Keys in other tables.

**Final Decision:** `UserPhoneNumber` is the sole Candidate Key and the selected Primary Key of the `UserPhoneNumbers` table.

![004-DATABASE-USERPHONENUMBER-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS](/004-DATABASE-FUNCTIOANL-DEPENDENCY-AND-KEYS/USER-DOMAIN/KEYS-IMAGES/004-DATABASE-USERPHONENUMBER-USER-DOMAIN-FUNCTIONAL-DEPENDENCY-AND-KEYS.svg)
