# USER-DOMAIN — Relationship Documentation

## 1. Overview

**Domain:** `USER-DOMAIN`  
**Stage:** Relationships  
**Scope:** Relationship Identification, Cardinality, Participation, and Business Rationale

This document defines the relationships between the `USERS`, `ROLES`, `ROLE_CATEGORIES`, and `BUSINESS_INFORMATION` tables.

The relationships are documented according to the current business rules and design decisions. Their physical implementation, key selection, and detailed resolution will be addressed in the relevant design stages.

## 2. Relationship 1: USERS and ROLES

### 2.1 Relationship Purpose

This relationship represents the roles assigned to users within the system.

A registered user may hold multiple roles simultaneously, and the system may contain multiple users assigned to the same role.

For example, a user may be classified as both a `System Visitor` and a `System Employee`, while a particular role may be assigned to many different users.

### 2.2 Business Rules

**BR-001:** A registered user may be assigned multiple roles simultaneously.

### 2.3 Cardinality

This relationship is **Many-to-Many (M:N)**.

- One user may be assigned multiple roles.
- One role may be assigned to multiple users.

### 2.4 Participation

**From the USERS side: Mandatory**

Every user must be assigned at least one role, even if that role is the only role assigned to the user. The customer classification is an example of a role that can satisfy this requirement.

**From the ROLES side: Optional**

A role may exist without being assigned to any users. For example, a newly created role may not yet have any assigned users, or a role may be defined before the system launches.

### 2.5 Relationship Summary

| Entity | Minimum Participation | Maximum Participation |
|---|---:|---:|
| `USERS` | 1 | Many |
| `ROLES` | 0 | Many |

### 2.6 Expected Impact

This relationship supports users with multiple roles and roles shared by multiple users.

It also establishes that every user must have at least one role, while allowing role definitions to exist before any users are assigned to them.

The implementation of this many-to-many relationship will be addressed in the `Relationship Solution` stage.

![001-DATABASE-USERS-ROLES-USER-DOMAIN-RELATIONSHIP-AND-KEYS](/002-DATABASE-RELATIONS-AND-KEYS/DATABASE-USER-DOMAIN/RELATIONSHIP-IMAGE/001-DATABASE-USERS-ROLES-USER-DOMAIN-RELATIONSHIP-AND-KEYS.svg)

---

## 3. Relationship 2: ROLES and ROLE_CATEGORIES

### 3.1 Relationship Purpose

This relationship classifies each role under a role category.

Role categories provide a way to organize related roles into meaningful groups. A category may contain multiple roles, while each role must belong to exactly one category.

### 3.2 Cardinality

This relationship is **One-to-Many (1:N)** from `ROLE_CATEGORIES` to `ROLES`.

- One role category may contain multiple roles.
- One role must belong to exactly one role category.
- A role cannot belong to multiple categories simultaneously under the current business rules.

### 3.3 Participation

**From the ROLES side: Mandatory**

Every role must be associated with exactly one category, including newly created roles.

A role cannot exist without a category.

**From the ROLE_CATEGORIES side: Optional**

A category may exist without containing any roles. For example, a newly created category may not yet have any roles assigned to it.

### 3.4 Relationship Summary

| Entity | Minimum Participation | Maximum Participation |
|---|---:|---:|
| `ROLES` | 1 | 1 |
| `ROLE_CATEGORIES` | 0 | Many |

### 3.5 Expected Impact

This relationship ensures that roles are organized under defined categories while allowing categories to be created before roles are assigned to them.

It also establishes that each role has one specific category, preventing a role from being classified under multiple categories simultaneously.

The implementation of this relationship will be addressed in the `Relationship Solution` stage.

![002-DATABASE-ROLES-ROLECATEGORY-USER-DOMAIN-RELATIONSHIP-AND-KEYS](/002-DATABASE-RELATIONS-AND-KEYS/DATABASE-USER-DOMAIN/RELATIONSHIP-IMAGE/002-DATABASE-ROLES-ROLECATEGORY-USER-DOMAIN-RELATIONSHIP-AND-KEYS.svg)

---

## 4. Relationship 3: USERS and BUSINESS_INFORMATION

### 4.1 Relationship Purpose

This relationship connects users to their business information profiles.

According to the following business rules, business information is maintained separately from common user account information, and only roles requiring business information shall be associated with business profiles.

**BR-010:** Business information shall be maintained separately from the User entity.

**BR-011:** Only roles requiring business information shall be associated with business profiles.

A user may have multiple roles, and different roles may require business information. Consequently, a user may be associated with multiple business information profiles.

### 4.2 Cardinality

This relationship is **One-to-Many (1:N)** from `USERS` to `BUSINESS_INFORMATION`.

- One user may be associated with multiple business information profiles.
- Each business information profile must belong to exactly one user.

### 4.3 Participation

**From the USERS side: Optional**

A user may have no business information profile if none of their assigned roles requires one.

A user may also have multiple business information profiles when their assigned roles require business information.

**From the BUSINESS_INFORMATION side: Mandatory**

Every business information profile must be associated with exactly one user.

A business information profile cannot exist independently of its associated user.

### 4.4 Relationship Summary

| Entity | Minimum Participation | Maximum Participation |
|---|---:|---:|
| `USERS` | 0 | Many |
| `BUSINESS_INFORMATION` | 1 | 1 |

### 4.5 Expected Impact

This relationship separates common account information from business-specific information and allows business profiles to exist only where required.

It also supports users who have multiple roles requiring business information, without requiring every user to have a business profile.

The specific roles that require business information will be identified in a separate document, as determined by the current design plan.

The implementation of this relationship will be addressed in the `Relationship Solution` stage.

![003-DATABASE-USERS-BSUINESSINFORMATION-USER-DOMAIN-REATIONSHIP-AND-KEYS](/002-DATABASE-RELATIONS-AND-KEYS/DATABASE-USER-DOMAIN/RELATIONSHIP-IMAGE/003-DATABASE-USERS-BSUINESSINFORMATION-USER-DOMAIN-REATIONSHIP-AND-KEYS.svg)

---

## 5. Consolidated Relationship Summary

| Relationship | Cardinality | Participation Rule |
|---|---|---|
| `USERS` — `ROLES` | Many-to-Many | Every user must have at least one role; a role may have no users. |
| `ROLE_CATEGORIES` — `ROLES` | One-to-Many | Every role must belong to exactly one category; a category may have no roles. |
| `USERS` — `BUSINESS_INFORMATION` | One-to-Many | A user may have no business profiles or multiple profiles; every profile must belong to exactly one user. |

## 6. Scope and Future Decisions

This document records the current relationship requirements and their business rationale.

The following topics remain assigned to their designated stages:

- **Advanced Keys and Description:** Identification and documentation of the relevant keys.
- **Relationship Solution:** Determining how the relationships will be implemented.
- **Functional Dependency:** Analyzing the functional dependencies associated with the entities and relationships.
- **Normalization:** Evaluating the database structure and normalization requirements.
- **Edge Cases and Edge Cases Solution:** Examining exceptional scenarios and defining their solutions.
- **Data Types and Constraints:** Defining the appropriate implementation details and enforcement rules.
- **Lifecycle and Decision Finalization:** Finalizing lifecycle behavior and resolving outstanding design decisions.
- **Indexing Basics:** Documenting indexing decisions.

The relationships documented here represent the current design decisions. Any required changes will be reviewed in the appropriate stage rather than assumed in advance.

![000-USER-DOMAIN-RELATIONSHIP-AND-KEYS](/002-DATABASE-RELATIONSHIP-AND-BASIC-KEYS/USER-DOMAIN/RELATIONSHIP-IMAGES/000-USER-DOMAIN-RELATIONSHIP-AND-KEYS.svg)

