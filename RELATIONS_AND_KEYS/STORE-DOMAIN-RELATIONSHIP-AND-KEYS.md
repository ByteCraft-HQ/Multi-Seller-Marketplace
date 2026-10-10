# Store Domain

## 1. Overview

The Store Domain is responsible for defining Stores and their relationships with other entities in the system.

This document focuses on:

- Relationships between Stores and other entities.
- Primary Keys (PKs) and Foreign Keys (FKs).
- Composite Primary Keys.
- Junction tables used to resolve many-to-many relationships.
- Multivalued attributes and their database design.
- Business rules directly related to the Store Domain.

---

## 2. Relevant Business Rules

### BR-032 — Store Management Authorization

Only users assigned the `Store Manager` role may manage Stores.

### BR-033 — Multiple Store Assignments

A Store Manager may be assigned to multiple Stores.

### BR-034 — Multiple Store Managers

A Store may be managed by multiple Store Managers simultaneously.

### BR-035 — Minimum Store Manager Requirement

Every Store shall have at least one active Store Manager.

### BR-037 — Store Inactivation

A Store that no longer satisfies the minimum operational requirements shall be marked as `Inactive`.

### BR-038 — Inactive Store Restrictions

An inactive Store shall not perform business operations until the required active users are assigned again.

> **Scope Note:** BR-036, which concerns Seller assignments, is excluded from this document.

---

## 3. Stores and UserRoles Relationship

### 3.1. Relationship Type

The relationship between `Stores` and `UserRoles` is conceptually **Many-to-Many (M:N)**.

Why?

- According to BR-033, one Store Manager can manage multiple Stores.
- According to BR-034, one Store can be managed by multiple Store Managers.

However, the `UserRoles` entity contains different user-role assignments, not only Store Managers. Therefore, the relationship must specifically represent Store Manager assignments rather than unrestricted assignments of any role.

### 3.2. Relationship Cardinality

```text
UserRoles (0..N)
       |
       | M:N
       |
Stores (1..N)
```

- A `UserRoles` record may be associated with zero or many Stores.
- A Store must have one or many Store Manager assignments according to the business requirements.

### 3.3. Resolving the Relationship

A many-to-many relationship is resolved through a junction table named `StoreManagers`.

The relationship becomes:

```text
UserRoles
    |
    | 1:N
    |
StoreManagers
    |
    | N:1
    |
Stores
```

The `StoreManagers` table identifies which Store Manager is responsible for which Store.

It allows the system to determine:

- Which Store Managers manage a specific Store.
- Which Stores are managed by a specific Store Manager.
- Which Store Manager assignments exist between the two entities.

### 3.4. Keys

**Stores**

- `StoreID` → Primary Key (PK).

**UserRoles**

- `UserRoleID` → Primary Key (PK).

**StoreManagers**

- `StoreID` → Foreign Key (FK) referencing `Stores.StoreID`.
- `UserRoleID` → Foreign Key (FK) referencing `UserRoles.UserRoleID`.
- `(StoreID, UserRoleID)` → Composite Primary Key (PK).

Both foreign keys form the composite primary key of `StoreManagers`.

This prevents the same Store Manager assignment from being recorded more than once for the same Store.

**Important:** Because `UserRoles` contains multiple role types, the relationship must be restricted to records representing the `Store Manager` role.

---

## 4. Stores and StoreEmails Relationship

### 4.1. Why Is a Separate Table Required?

A Store may have multiple email addresses, such as:

- Contact emails.
- Support emails.
- Other business-related email addresses.

Storing multiple email addresses directly in the `Stores` table would introduce repeating attributes and unnecessary schema complexity.

For example, creating columns such as `Email1`, `Email2`, and `Email3` would impose an arbitrary limit on the number of email addresses a Store could have.

Therefore, multivalued email attributes are stored in a separate table named `StoreEmails`.

### 4.2. Relationship

```text
Stores (1)
    |
    | 1:N
    |
StoreEmails (N)
```

- One Store can have multiple email addresses.
- Each email record belongs to one Store.

### 4.3. Keys

- `StoreID` → Foreign Key (FK) referencing `Stores.StoreID`.
- `Email` → Stores the email address.
- `(StoreID, Email)` → Composite Primary Key (PK).

The composite primary key ensures that the same email address cannot be recorded more than once for the same Store.

Different Stores may share the same email address because uniqueness is enforced within each Store.

---

## 5. Stores and StorePhoneNumbers Relationship

### 5.1. Why Is a Separate Table Required?

A Store may have multiple phone numbers.

Storing multiple phone numbers directly in the `Stores` table would introduce repeating attributes and make the schema difficult to maintain.

Therefore, phone numbers are stored in a separate table named `StorePhoneNumbers`.

### 5.2. Relationship

```text
Stores (1)
    |
    | 1:N
    |
StorePhoneNumbers (N)
```

- One Store can have multiple phone numbers.
- Each phone number record belongs to one Store.

### 5.3. Keys

- `StoreID` → Foreign Key (FK) referencing `Stores.StoreID`.
- `PhoneNumber` → Stores the phone number.
- `(StoreID, PhoneNumber)` → Composite Primary Key (PK).

The composite primary key prevents the same phone number from being recorded more than once for the same Store.

---

## 6. Days Entity

### 6.1. Purpose

Stores may operate on different days of the week.

For example, one Store may operate from Saturday to Thursday, while another Store may operate only on weekdays.

Creating separate columns for every day inside the `Stores` table would introduce unnecessary complexity and make operating schedules difficult to maintain.

Therefore, the days of the week are represented by a separate entity named `Days`.

### 6.2. Keys

- `DayID` → Primary Key (PK).
- `DayName` → The name of the day, such as Saturday or Sunday.

Each day is represented by a unique `DayID`.

---

## 7. Stores and Days Relationship

### 7.1. Relationship Type

The relationship between `Stores` and `Days` is **Many-to-Many (M:N)**.

Why?

- One Store may operate on multiple days.
- One day may be associated with multiple Stores.

Each Store can have its own operating schedule, independently of other Stores.

### 7.2. Resolving the Relationship

A junction table named `StoreDays` resolves the many-to-many relationship.

The relationship becomes:

```text
Stores
   |
   | 1:N
   |
StoreDays
   |
   | N:1
   |
Days
```

### 7.3. Keys

**Stores**

- `StoreID` → Primary Key (PK).

**Days**

- `DayID` → Primary Key (PK).

**StoreDays**

- `StoreID` → Foreign Key (FK) referencing `Stores.StoreID`.
- `DayID` → Foreign Key (FK) referencing `Days.DayID`.
- `(StoreID, DayID)` → Composite Primary Key (PK).

Both foreign keys form the composite primary key of `StoreDays`.

This prevents the same day from being assigned to the same Store more than once.

### 7.4. Operating Hours

The `StoreDays` table also contains the Store-specific operating hours:

- `OpeningTime`
- `ClosingTime`

These attributes belong to `StoreDays` because opening and closing times depend on both the Store and the day.

For example, two Stores may have different opening times on Sunday, even though they reference the same record in `Days`.

Keeping these attributes in `StoreDays` allows each Store to maintain its own schedule without duplicating day definitions.

**Design limitation:** This structure supports one opening and closing interval per Store per day. Multiple operating intervals on the same day would require an extension to the design.

---

## 9. Relationship Summary

```text
UserRoles
    |
    | 1:N
    |
StoreManagers
    |
    | N:1
    |
Stores
    |
    | 1:N
    |
StoreEmails
```

```text
Stores
    |
    | 1:N
    |
StorePhoneNumbers
```

```text
Stores
    |
    | 1:N
    |
StoreDays
    |
    | N:1
    |
Days
```

The junction tables resolve the many-to-many relationships, while the separate email and phone tables support multivalued attributes.

---

## 10. Final Design Notes

- `StoreID` is the primary key of `Stores`.
- `UserRoleID` is the primary key of `UserRoles`.
- `StoreManagers` resolves the many-to-many relationship between `Stores` and `UserRoles`.
- `StoreEmails` stores multiple email addresses per Store.
- `StorePhoneNumbers` stores multiple phone numbers per Store.
- `Days` defines the reusable days of the week.
- `StoreDays` resolves the many-to-many relationship between `Stores` and `Days` and stores Store-specific opening and closing times.
- Composite primary keys prevent duplicate Store Manager assignments, duplicate email or phone entries per Store, and duplicate Store-day assignments.

The Store Domain establishes the core relationships and key structure required to represent Stores and their associated information within the system.