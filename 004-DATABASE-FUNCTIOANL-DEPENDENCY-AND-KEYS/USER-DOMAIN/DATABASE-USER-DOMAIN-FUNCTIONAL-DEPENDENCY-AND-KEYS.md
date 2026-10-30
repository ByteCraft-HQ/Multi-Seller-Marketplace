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
