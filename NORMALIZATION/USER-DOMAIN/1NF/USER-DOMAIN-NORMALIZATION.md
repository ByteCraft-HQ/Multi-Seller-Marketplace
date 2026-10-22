# 1NF Normalization – Users Phone Numbers

## 1. What Is 1NF?

First Normal Form (1NF) is the first normalization technique used to organize database tables by removing multi-valued attributes and ensuring that each attribute contains a single, atomic value.

In our domain, we will apply 1NF to the tables that contain multi-valued attributes.

## 2. The First Table: Users

The `Users` table contains a multi-valued attribute called `UserPhoneNumber`.

A user may have more than one phone number. If we store multiple phone numbers in the same cell, this violates 1NF.

Also, if we store each phone number in a separate row in the original `Users` table, we may need to repeat the user's information for every phone number.

For example:

| UserID (PK) | UserName | UserPhoneNumber |
|---|---|---|
| 1 | Ahmed | 01011111111 |
| 1 | Ahmed | 01122222222 |
| 1 | Ahmed | 01233333333 |

Here, the user's information is repeated because only the phone number changes.

This creates unnecessary data duplication and may lead to update anomalies.

## 3. The Solution: Separate the Tables

To achieve 1NF, we separate the multi-valued `UserPhoneNumber` attribute into a new table called `UsersPhoneNumbers`.

### Users Table

| UserID (PK) | UserName |
|---|---|
| 1 | Ahmed |
| 2 | Ali |

### UsersPhoneNumbers Table

| UserID (FK) | UserPhoneNumber | UserPhoneNumberVerification | UserPhoneNumberStatus |
|---|---|---|---|
| 1 | 01011111111 | Verified | Active |
| 1 | 01122222222 | Not Verified | Active |
| 2 | 01233333333 | Verified | Inactive |

The `UserID` in `UsersPhoneNumbers` is a Foreign Key that references the Primary Key in the `Users` table.

This allows each user to have multiple phone numbers without repeating the user's basic information in the phone number table.

## 4. Keys in the UsersPhoneNumbers Table

### A. Super Keys

A Super Key is an attribute or combination of attributes that uniquely identifies each row in a table.

Assuming that phone numbers are unique only within each user's records, the Super Keys include:

- `UserID + UserPhoneNumber`
- `UserID + UserPhoneNumber + UserPhoneNumberVerification`
- `UserID + UserPhoneNumber + UserPhoneNumberStatus`
- Any larger combination containing `UserID + UserPhoneNumber`

**Important correction:** `UserID` alone is not a Super Key because one user can have multiple phone numbers. `UserPhoneNumber` alone is not necessarily a Super Key because different users may share the same phone number.

### B. Candidate Key

A Candidate Key is a minimal Super Key, meaning that no attribute can be removed without losing uniqueness.

Under our assumptions, the Candidate Key is:

`(UserID, UserPhoneNumber)`

### C. Composite Primary Key

We choose the following Composite Primary Key:

`PRIMARY KEY (UserID, UserPhoneNumber)`

This combination uniquely identifies each phone number belonging to a specific user.

It is a suitable choice when the same phone number may be associated with different users and each user cannot register the same phone number more than once.

## 5. Additional Attributes

The `UsersPhoneNumbers` table contains two additional attributes:

### UserPhoneNumberVerification

This attribute indicates whether the phone number has been verified.

Examples:
- `Verified`
- `Not Verified`
- `Pending`

### UserPhoneNumberStatus

This attribute indicates the current status of the phone number.

Examples:
- `Active`
- `Inactive`
- `Suspended`
- `Deleted`

These attributes belong in the phone number table because they describe the individual phone number rather than the user as a whole.

The Functional Dependency is:

`(UserID, UserPhoneNumber) → UserPhoneNumberVerification, UserPhoneNumberStatus`

This means that the combination of `UserID` and `UserPhoneNumber` determines the verification and status of that phone number.

## 6. Final Result

After applying 1NF, we have two tables:

1. `Users`: Stores the basic information of each user.
2. `UsersPhoneNumbers`: Stores each phone number separately, along with its verification and status.

The Composite Primary Key of `UsersPhoneNumbers` is:

`(UserID, UserPhoneNumber)`

The `UserID` also acts as a Foreign Key referencing `Users(UserID)`.

**Conclusion:** We have separated the multi-valued phone number attribute, ensured atomic values, and reduced unnecessary repetition of user information. This is our first 1NF normalization step in the domain.

**Technical note:** 1NF requires atomic attribute values; it does not, by itself, guarantee that all data duplication or update anomalies are eliminated. Those issues may require further normalization and appropriate functional dependency analysis.

---


First Normal Form (1NF) is the first normalization technique used to organize database tables by removing multi-valued attributes and ensuring that each attribute contains a single, atomic value.

In the `BusinessInformation` table, we have two multi-valued attributes:

1. `BusinessInformationPhoneNumber`
2. `BusinessInformationEmail`

We will separate each attribute into its own table to achieve 1NF and avoid unnecessary repetition of business information.

---

# 1. BusinessInformationPhoneNumber

## A. The Problem

The `BusinessInformation` table contains a multi-valued attribute called `BusinessInformationPhoneNumber`, because one business can have multiple phone numbers.

If we store multiple phone numbers in the same cell, this violates 1NF.

If we store each phone number in a separate row in the original table, we may have to repeat the business information for every phone number.

For example:

| UserID (PK) | BusinessName | BusinessInformationPhoneNumber |
|---|---|---|
| 1 | Ahmed Store | 01011111111 |
| 1 | Ahmed Store | 01122222222 |
| 1 | Ahmed Store | 01233333333 |

Here, the business information is repeated because only the phone number changes.

This creates unnecessary data duplication and may lead to update anomalies.

## B. The Solution: Separate the Tables

To achieve 1NF, we separate `BusinessInformationPhoneNumber` into a new table called `BusinessInformationPhoneNumbers`.

### BusinessInformation Table

| UserID (PK) | BusinessName |
|---|---|
| 1 | Ahmed Store |
| 2 | Ali Company |

### BusinessInformationPhoneNumbers Table

| UserID (FK) | BusinessInformationPhoneNumber | BusinessInformationPhoneVerification | BusinessInformationPhoneStatus |
|---|---|---|---|
| 1 | 01011111111 | Verified | Active |
| 1 | 01122222222 | Not Verified | Active |
| 2 | 01233333333 | Verified | Inactive |

The `UserID` in `BusinessInformationPhoneNumbers` is a Foreign Key that references the Primary Key in the `BusinessInformation` table.

This allows each business to have multiple phone numbers without repeating its basic information.

## C. Keys

### Super Keys

Assuming that a phone number is unique only within each user's records, the Super Keys include:

- `UserID + BusinessInformationPhoneNumber`
- `UserID + BusinessInformationPhoneNumber + BusinessInformationPhoneVerification`
- `UserID + BusinessInformationPhoneNumber + BusinessInformationPhoneStatus`
- Any larger combination containing `UserID + BusinessInformationPhoneNumber`

`UserID` alone is not a Super Key because one business can have multiple phone numbers.

`BusinessInformationPhoneNumber` alone is not necessarily a Super Key because different users may share the same phone number.

### Candidate Key

A Candidate Key is a minimal Super Key.

Under our assumptions, the Candidate Key is:

`(UserID, BusinessInformationPhoneNumber)`

### Composite Primary Key

We choose the following Composite Primary Key:

`PRIMARY KEY (UserID, BusinessInformationPhoneNumber)`

This combination uniquely identifies each phone number belonging to a specific user, provided the same user cannot register the same phone number more than once.

## D. Additional Attributes

The new table contains two additional attributes:

- `BusinessInformationPhoneVerification`: Indicates whether the phone number has been verified.
- `BusinessInformationPhoneStatus`: Indicates the current status of the phone number, such as Active, Inactive, Suspended, or Deleted.

These attributes belong in the phone number table because they describe the individual phone number rather than the business as a whole.

### Functional Dependency

`(UserID, BusinessInformationPhoneNumber) → BusinessInformationPhoneVerification, BusinessInformationPhoneStatus`

This means that the combination of `UserID` and `BusinessInformationPhoneNumber` determines the verification and status of that phone number.

---

# 2. BusinessInformationEmail

## A. The Problem

The `BusinessInformation` table also contains a multi-valued attribute called `BusinessInformationEmail`, because one business can have multiple email addresses.

If we store multiple email addresses in the same cell, this violates 1NF.

If we store each email address in a separate row in the original table, the business information may be repeated for every email address.

For example:

| UserID (PK) | BusinessName | BusinessInformationEmail |
|---|---|---|
| 1 | Ahmed Store | ahmed@store.com |
| 1 | Ahmed Store | contact@store.com |
| 1 | Ahmed Store | support@store.com |

Here, the business information is repeated because only the email address changes.

This creates unnecessary data duplication and may lead to update anomalies.

## B. The Solution: Separate the Tables

To achieve 1NF, we separate `BusinessInformationEmail` into a new table called `BusinessInformationEmails`.

### BusinessInformation Table

| UserID (PK) | BusinessName |
|---|---|
| 1 | Ahmed Store |
| 2 | Ali Company |

### BusinessInformationEmails Table

| UserID (FK) | BusinessInformationEmail | BusinessInformationEmailVerification | BusinessInformationEmailStatus |
|---|---|---|---|
| 1 | ahmed@store.com | Verified | Active |
| 1 | contact@store.com | Not Verified | Active |
| 2 | info@alicompany.com | Verified | Active |

The `UserID` in `BusinessInformationEmails` is a Foreign Key that references the Primary Key in the `BusinessInformation` table.

This allows each business to have multiple email addresses without repeating its basic information.

## C. Keys

### Super Keys

Assuming that an email address is unique only within each user's records, the Super Keys include:

- `UserID + BusinessInformationEmail`
- `UserID + BusinessInformationEmail + BusinessInformationEmailVerification`
- `UserID + BusinessInformationEmail + BusinessInformationEmailStatus`
- Any larger combination containing `UserID + BusinessInformationEmail`

`UserID` alone is not a Super Key because one business can have multiple email addresses.

`BusinessInformationEmail` alone is not necessarily a Super Key unless email addresses are guaranteed to be globally unique.

### Candidate Key

A Candidate Key is a minimal Super Key.

Under our assumptions, the Candidate Key is:

`(UserID, BusinessInformationEmail)`

### Composite Primary Key

We choose the following Composite Primary Key:

`PRIMARY KEY (UserID, BusinessInformationEmail)`

This combination uniquely identifies each email address belonging to a specific user, provided the same user cannot register the same email address more than once.

## D. Additional Attributes

The new table contains two additional attributes:

- `BusinessInformationEmailVerification`: Indicates whether the email address has been verified.
- `BusinessInformationEmailStatus`: Indicates the current status of the email address, such as Active, Inactive, Suspended, or Deleted.

These attributes belong in the email table because they describe the individual email address rather than the business as a whole.

### Functional Dependency

`(UserID, BusinessInformationEmail) → BusinessInformationEmailVerification, BusinessInformationEmailStatus`

This means that the combination of `UserID` and `BusinessInformationEmail` determines the verification and status of that email address.

---

# 3. Final Result

After applying 1NF, we organize the business information into three tables:

1. **BusinessInformation:** Stores the basic information of each business.
2. **BusinessInformationPhoneNumbers:** Stores each phone number in a separate row, along with its verification and status.
3. **BusinessInformationEmails:** Stores each email address in a separate row, along with its verification and status.

The Composite Primary Keys are:

- `BusinessInformationPhoneNumbers`: `(UserID, BusinessInformationPhoneNumber)`
- `BusinessInformationEmails`: `(UserID, BusinessInformationEmail)`

In both tables, `UserID` is also a Foreign Key referencing `BusinessInformation(UserID)`.

**Conclusion:** We have separated both multi-valued attributes into independent tables, ensuring atomic values and reducing unnecessary repetition of business information.

**Technical note:** 1NF requires atomic attribute values. Separating these attributes does not automatically eliminate every form of data duplication or guarantee 2NF and 3NF. Those require further analysis of functional dependencies.

![USER-DOMAIN-NORMALIZATION](/NORMALIZATION/USER-DOMAIN/1NF/USER-DOMAIN-NORMALIZATION.svg)
