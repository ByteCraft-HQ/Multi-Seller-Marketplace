# Database Normalization – First Normal Form (1NF)

## 1. Introduction

In this stage of database design, we will start applying the **Normalization Process**, beginning with the **First Normal Form (1NF)**.

We will start with the first domain:

- **User Domain**

Within this domain, we will analyze the following table:

- `Users`

Our goal is to identify attributes that violate the First Normal Form and restructure the database to satisfy its requirements.

---

## 2. Why Do We Need First Normal Form (1NF)?

Before discussing the tables, we need to understand why we apply 1NF in the first place.

The main purpose of First Normal Form is to ensure that:

1. Every column contains atomic values.
2. Each cell contains a single value rather than multiple values.
3. There are no repeating groups of attributes.
4. Each record can be uniquely identified.

### What Are Atomic Values?

An **Atomic Value** is a value that is stored as a single, indivisible value within a specific column, according to the database design.

For example, consider a user who has multiple phone numbers.

A table might initially look like this:

| UserEmail | UserName | UserPhoneNumber |
|---|---|---|
| user@example.com | Ahmed | 01012345678, 01112345678 |
| another@example.com | Mohamed | 01212345678 |

The problem is that the `UserPhoneNumber` column contains multiple values in the same cell.

This violates the atomicity requirement of 1NF.

### Why Should We Separate Multi-Valued Attributes?

Imagine that a user has three phone numbers.

If we want to store each phone number separately while keeping all user information in the same table, we may end up with something like this:

| UserEmail | UserName | UserPhoneNumber |
|---|---|---|
| user@example.com | Ahmed | 01012345678 |
| user@example.com | Ahmed | 01112345678 |
| user@example.com | Ahmed | 01212345678 |

Notice that the user's information is repeated in multiple rows.

This introduces unnecessary redundancy because the user's name and other information are repeated just to store different phone numbers.

The solution is to separate the multi-valued attribute into another table.

This allows us to:

- Store each phone number independently.
- Avoid repeating the user's other information.
- Maintain a clear relationship between users and their phone numbers.
- Add or remove phone numbers without modifying the main user record.

**Important Note:**

The foreign key in the new table will repeat for every phone number belonging to the same user.

This is not considered unnecessary duplication of user information. It is a reference that establishes the relationship between the two tables.

---

# 3. Users Table

Let's start analyzing the `Users` table.

## 3.1 UserPhoneNumber

### Identifying the Problem

The `UserPhoneNumber` attribute is a **Multi-Valued Attribute**.

This means that a single user can have more than one phone number.

Since 1NF requires atomic values, storing multiple phone numbers in the same cell is not acceptable.

### The Solution

We will separate `UserPhoneNumber` into a new table.

The new table will reference the `Users` table using a Foreign Key (FK).

### Original Table

`Users`

| UserEmail (Proposed PK) | UserName | UserPhoneNumber |
|---|---|---|
| user@example.com | Ahmed | 01012345678, 01112345678 |

### New Structure

**Table 1: Users**

| UserEmail (Proposed PK) | UserName |
|---|---|
| user@example.com | Ahmed |

**Table 2: UserPhoneNumbers**

| UserEmail (FK) | PhoneNumber |
|---|---|
| user@example.com | 01012345678 |
| user@example.com | 01112345678 |

### Understanding the Relationship

- `UserEmail` in the `Users` table is our proposed Primary Key.
- `UserEmail` in the `UserPhoneNumbers` table is a Foreign Key referencing `Users.UserEmail`.
- `PhoneNumber` stores one phone number per record.

This creates a **One-to-Many Relationship (1:N)**.

One user can have multiple phone numbers, while each phone number record belongs to one user.

---

# 4. BusinessInformation Table

After finishing the `Users` table, we will apply the same concept to the `BusinessInformation` table.

We identified two multi-valued attributes:

1. `BusinessInformationPhoneNumber`
2. `BusinessInformationEmails`

Both attributes need to be separated into independent tables.

## 4.1 BusinessInformationPhoneNumber

### Identifying the Problem

`BusinessInformationPhoneNumber` is a Multi-Valued Attribute because one business can have multiple phone numbers.

Storing multiple phone numbers inside one column violates the atomicity requirement of 1NF.

### The Solution

We will create a separate table called:

`BusinessInformationPhoneNumbers`

### New Structure

**Table 1: BusinessInformation**

| BusinessInformationNationalId (Proposed PK) | BusinessName |
|---|---|
| 123456789 | Example Business |

**Table 2: BusinessInformationPhoneNumbers**

| BusinessInformationNationalId (FK) | PhoneNumber |
|---|---|
| 123456789 | 01012345678 |
| 123456789 | 01112345678 |

### Understanding the Relationship

- `BusinessInformationNationalId` in the main table is our proposed Primary Key.
- `BusinessInformationNationalId` in the new table is a Foreign Key referencing the main table.
- `PhoneNumber` stores one phone number per record.

The relationship is One-to-Many (1:N).

One business can have multiple phone numbers.

---

## 4.2 BusinessInformationEmails

### Identifying the Problem

`BusinessInformationEmails` is another Multi-Valued Attribute.

A business may have multiple email addresses, such as:

- General contact email.
- Customer support email.
- Sales email.
- Administrative email.

Storing all these email addresses in a single column violates the atomicity requirement of 1NF.

### The Solution

We will create a separate table called:

`BusinessInformationEmails`

### New Structure

| BusinessInformationNationalId (FK) | Email |
|---|---|
| 123456789 | info@example.com |
| 123456789 | support@example.com |
| 123456789 | sales@example.com |

### Understanding the Relationship

- `BusinessInformationNationalId` is a Foreign Key referencing the `BusinessInformation` table.
- `Email` stores one email address per record.
- Each row represents one email address belonging to a specific business.

The relationship is One-to-Many (1:N).

One business can have multiple email addresses.

---

# 5. Additional Attributes Introduced by Business Requirements

After separating the multi-valued attributes, we also need to introduce some additional attributes based on the business requirements.

These attributes help us manage the verification process and track the current status of phone numbers and email addresses.

An important design decision here is that verification information should belong to the individual phone number or email record, not to the entire user or business.

## 5.1 Users – Phone Number Verification

In the `UserPhoneNumbers` table, we will introduce the following attributes:

### PhoneNumberVerification

This attribute indicates whether the phone number has successfully passed the verification process.

For example:

- Verified
- Not Verified

### PhoneNumberStatus

This attribute represents the current operational status of the phone number.

For example:

- Active
- Inactive
- Blocked

These attributes allow us to distinguish between the verification state and the operational state of a phone number.

**Updated Table: UserPhoneNumbers**

| UserEmail (FK) | PhoneNumber | PhoneNumberVerification | PhoneNumberStatus |
|---|---|---|---|
| user@example.com | 01012345678 | Verified | Active |
| user@example.com | 01112345678 | Not Verified | Active |

---

## 5.2 BusinessInformation – Email Verification

In the `BusinessInformationEmails` table, we will introduce:

### BusinessInformationEmailVerification

This attribute indicates whether the business email address has successfully passed the verification process.

Possible values:

- Verified
- Not Verified

### EmailStatus

This attribute represents the current status of the email address.

Possible values:

- Active
- Inactive
- Blocked

**Updated Table: BusinessInformationEmails**

| BusinessInformationNationalId (FK) | Email | BusinessInformationEmailVerification | EmailStatus |
|---|---|---|---|
| 123456789 | info@example.com | Verified | Active |
| 123456789 | support@example.com | Not Verified | Active |

---

## 5.3 BusinessInformation – Phone Number Verification

We will apply the same concept to the business phone numbers.

The `BusinessInformationPhoneNumbers` table will contain:

### BusinessInformationPhoneNumberVerification

Indicates whether the business phone number has been successfully verified.

Possible values:

- Verified
- Not Verified

### PhoneNumberStatus

Represents the current operational status of the business phone number.

Possible values:

- Active
- Inactive
- Blocked

**Updated Table: BusinessInformationPhoneNumbers**

| BusinessInformationNationalId (FK) | PhoneNumber | BusinessInformationPhoneNumberVerification | PhoneNumberStatus |
|---|---|---|---|
| 123456789 | 01012345678 | Verified | Active |
| 123456789 | 01112345678 | Not Verified | Active |

---

# 6. Understanding Primary Keys and Foreign Keys at This Stage

Before moving forward, we need to clarify an important point about keys.

During this stage, we are using proposed keys to establish relationships between tables.

### Primary Key (PK)

A Primary Key is an attribute, or a combination of attributes, that uniquely identifies each record in a table.

A Primary Key must:

- Be unique.
- Never contain NULL values.
- Identify exactly one record.

### Foreign Key (FK)

A Foreign Key is an attribute, or a combination of attributes, that references a key in another table.

Its purpose is to maintain **Referential Integrity** between related tables.

For example:

`UserPhoneNumbers.UserEmail`

References:

`Users.UserEmail`

### Important Note About Key Selection

At this stage, the following attributes are proposed as identifiers:

- `Users.UserEmail`
- `BusinessInformation.BusinessInformationNationalId`

However, we will perform a detailed **Functional Dependency Analysis** in the next stage.

This analysis will help us identify:

- Functional Dependencies.
- Candidate Keys.
- Primary Keys.
- Alternate Keys.
- Partial Dependencies.
- Transitive Dependencies.

Therefore, the final key structure will be confirmed after completing the key analysis.

---

# 7. Final Database Structure After Applying 1NF

After separating all identified multi-valued attributes, our proposed structure becomes:

| Table Name | Main Attributes |
|---|---|
| Users | UserEmail (Proposed PK), UserName, ... |
| UserPhoneNumbers | UserEmail (FK), PhoneNumber, PhoneNumberVerification, PhoneNumberStatus |
| BusinessInformation | BusinessInformationNationalId (Proposed PK), BusinessName, ... |
| BusinessInformationPhoneNumbers | BusinessInformationNationalId (FK), PhoneNumber, BusinessInformationPhoneNumberVerification, PhoneNumberStatus |
| BusinessInformationEmails | BusinessInformationNationalId (FK), Email, BusinessInformationEmailVerification, EmailStatus |

---

# 8. Conclusion

In this stage, we applied the principles of First Normal Form (1NF) to the User Domain.

We identified the following multi-valued attributes:

1. `UserPhoneNumber`
2. `BusinessInformationPhoneNumber`
3. `BusinessInformationEmails`

We separated each attribute into its own table to ensure that every cell contains a single atomic value.

We also established relationships between the original tables and the newly created tables using Foreign Keys.

Finally, we introduced additional verification and status attributes to satisfy the business requirements.

**The result:** Our database structure is now designed to satisfy the identified 1NF requirements, subject to validating the remaining attributes and constraints across the complete schema.

**Next Step:** Functional Dependency Analysis, where we will examine the dependencies between attributes and determine the final candidate and primary keys.

