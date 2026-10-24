# USERS Table Documentation

## 1. Document Information

- **Domain:** `DATABASE-USER-DOMAIN`
- **Table:** `USERS`
- **Scope:** Table Purpose, Business Rules, and Attribute Descriptions

---

## 2. Table Overview

### 2.1. Purpose of the USERS Table

The `USERS` table is the central entity responsible for storing the common account information shared by all users across the system, regardless of their assigned roles.

Its primary purpose is to provide a centralized location for managing user accounts and their shared attributes.

User classification is determined by assigned roles rather than by maintaining separate user entities for different user types. This allows the system to manage common account information independently of the roles users perform within the system.

Business-specific information is maintained separately from the `USERS` table. Dedicated business profiles are associated only with roles that require business-specific information.

This design aims to reduce unnecessary duplication of shared account information, maintain a clear separation between account information and business information, and support the system's long-term scalability and maintainability.

### 2.2. Business Rules

The design of the `USERS` table is based on the following business rules:

#### BR-007
All users shall be represented within a single User entity.

#### BR-008
User classification shall be determined by assigned roles rather than separate user entities.

#### BR-009
The User entity shall contain only common account information shared by all users.

#### BR-010
Business information shall be maintained separately from the User entity.

### 2.3. Why a Single USERS Table Is Used

The decision to maintain a single `USERS` table is based on the following considerations:

1. **Centralized account management:** All users are represented in one place, allowing the system to manage their shared account information consistently.

2. **Role-based user classification:** Users are classified through their assigned roles rather than by creating separate user entities for different user types.

3. **Reduced data redundancy:** Different user types share many common attributes. Storing these attributes in separate role-specific tables could lead to unnecessary duplication of similar account information.

4. **Separation of account and business information:** Common account information remains in the `USERS` table, while business-specific information is maintained separately in business profiles.

5. **Maintainability and scalability:** A centralized account structure provides a consistent foundation for managing users and extending the system as new roles and business requirements are introduced.

6. **Simplified account lookup:** Keeping common account information centralized provides a consistent location for finding and managing user accounts.

These benefits are intended design goals. Actual performance and storage efficiency depend on the overall database design and the system's query patterns.

---

## 3. Attribute Documentation

This section describes the purpose and intended usage of each attribute in the `USERS` table, including its current nullability expectations and relevant business rules.

The attributes are documented according to the current design. Relationships, key definitions, data types, detailed constraints, and lifecycle rules are covered in separate documentation.

### 3.1. UserFirstName

**Purpose:** Stores the user's first name.

**Description:**

`UserFirstName` stores the first name of the person associated with the account.

It represents a fundamental part of the user's common account information and is shared across the system regardless of the user's assigned roles.

The first name is considered required information under the current design.

- **Nullability:** Required; must not be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.2. UserMiddleName

**Purpose:** Stores the user's middle name.

**Description:**

`UserMiddleName` stores the middle name of the person associated with the account.

It complements the user's first and last names when a middle name is available. Since not every person has or chooses to provide a middle name, this attribute is optional.

- **Nullability:** Optional; may be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.3. UserLastName

**Purpose:** Stores the user's last name.

**Description:**

`UserLastName` stores the last name of the person associated with the account.

Together with the first and middle names, when available, it represents the user's name. This is shared account information and does not depend on the user's assigned roles.

- **Nullability:** Optional; may be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.4. UserEmail

**Purpose:** Stores the primary email address associated with the user's account.

**Description:**

`UserEmail` stores the primary email address for the entire user account. It represents the account's main email address regardless of how many roles the user has or whether the user is associated with any business profiles.

The primary email address serves several purposes:

1. **Account identification:** Provides a primary identifier for locating the user's account.
2. **Authentication:** Serves as the intended login identifier for email-based authentication.
3. **Communication:** Provides a primary channel for contacting the user.
4. **Security notifications:** Can be used to communicate account-related security events, including notifications about potential unauthorized access.
5. **Account lookup:** Helps users and the system locate an account using its primary email address.

The same primary email address must not be associated with multiple accounts.

- **Nullability:** Required; must not be `NULL`.
- **Uniqueness:** Must be unique across accounts.
- **Attribute classification:** Simple attribute.

### 3.5. UserEmailVerification

**Purpose:** Records the verification status of the primary email address.

**Description:**

`UserEmailVerification` indicates whether the user has completed the verification process for the primary email address.

The intended values are:

| Value | Meaning |
|---|---|
| `0` | The email address has not been verified. |
| `1` | The email address has been verified. |

Email verification is intended to establish that the user has demonstrated access to the email address. A successful verification does not guarantee that the address will remain accessible indefinitely.

This attribute allows the system to distinguish between verified and unverified primary email addresses.

- **Nullability:** Required; must not be `NULL`.
- **Expected values:** `0` or `1`.
- **Attribute classification:** Simple attribute.

### 3.6. UserHashPassword

**Purpose:** Stores the hashed password used for password-based authentication.

**Description:**

`UserHashPassword` stores the password hash associated with the user's account.

The system must not store the user's raw password in this attribute. Instead, it stores the result of an appropriate password-hashing process.

This attribute supports the authentication process by allowing the system to verify submitted credentials against the stored password hash without storing the original password.

The user's password may change over time. When it changes, the stored hash must be updated accordingly.

Under the current design, this attribute is considered required.

- **Nullability:** Required; must not be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.7. UserAccountStatus

**Purpose:** Represents the overall status of the user account.

**Description:**

`UserAccountStatus` indicates the current overall state of the user's account, independently of the roles assigned to that user.

It describes the account's general status rather than the user's business role or activity type.

The currently defined account statuses are:

| Status | Meaning |
|---|---|
| `PENDING` | The account has been created and is awaiting completion of registration or activation. |
| `UNDERREVIEW` | The account is currently undergoing review. |
| `ACTIVE` | The account is fully active and operating normally. |
| `LIMITED` | The account is active but subject to certain restrictions. |
| `SUSPENDED` | The account has been temporarily suspended. |
| `DEACTIVATED` | The account has been deactivated and is no longer active. |
| `DELETED` | The account has been logically deleted and is no longer active. |
| `BLOCKED` | The account has been permanently blocked by the system according to its policies. |

These statuses apply to the account as a whole, regardless of the number or type of roles associated with it.

The effects of each status on authentication, access permissions, and permitted operations, as well as the rules governing transitions between statuses, will be documented in the separate account lifecycle documentation.

- **Nullability:** Required; must not be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.8. UserDeletedAt

**Purpose:** Records when the account is marked as deleted.

**Description:**

`UserDeletedAt` stores the timestamp at which the user's account transitions to the `DELETED` status.

When `UserAccountStatus` changes to `DELETED`, the deletion timestamp is recorded at the same time.

This attribute supports tracking account deletion events and determining when an account was logically deleted.

Logical deletion marks the account as deleted; it does not, by itself, mean that the account's data has been physically removed from the database.

- **Expected value before deletion:** `NULL`.
- **Expected value when the account is marked as deleted:** The timestamp of that transition.
- **Attribute classification:** Simple attribute.

The complete deletion workflow will be documented separately in the account lifecycle documentation.

### 3.9. UserDeletedReason

**Purpose:** Records the reason provided for deleting the account.

**Description:**

`UserDeletedReason` stores the selected reason for the user's account deletion.

The purpose of this attribute is to help the system understand why users choose to delete their accounts. This information may support analysis of user behavior, recurring issues, and potential areas for improvement.

The user selects a reason from a predefined list. The current options are:

| Value | Meaning |
|---|---|
| `NO_LONGER_USING_ACCOUNT` | The user no longer uses the account. |
| `FOUND_BETTER_ALTERNATIVE` | The user found a better alternative. |
| `HIGH_PRICES` | The user considers the prices too high. |
| `DELIVERY_ISSUES` | The user experienced delivery issues. |
| `PRODUCT_QUALITY_ISSUES` | The user experienced issues with product quality. |
| `POOR_CUSTOMER_SERVICE` | The user had a poor customer service experience. |
| `PRIVACY_CONCERNS` | The user has concerns about privacy. |
| `HAS_ANOTHER_ACCOUNT` | The user already has another account. |
| `OTHER` | The user's reason is not represented by the other available options. |

The attribute may remain `NULL` before account deletion. A deletion reason is expected to be provided as part of the account deletion process.

- **Nullability:** May be `NULL` before deletion.
- **Attribute classification:** Simple attribute.

The precise validation requirements and timing of reason selection will be defined in the separate lifecycle documentation.

### 3.10. UserDeletedTextReason

**Purpose:** Stores a custom explanation when the user selects `OTHER` as the deletion reason.

**Description:**
 
`UserDeletedTextReason` allows the user to provide a short, free-text explanation when none of the predefined deletion reasons adequately represents their situation.

It supplements `UserDeletedReason` by providing additional context that cannot be captured by the predefined options alone.

The custom explanation must not exceed **150 characters**.

- **Intended usage:** When `UserDeletedReason` is `OTHER`.
- **Nullability:** Optional.
- **Attribute classification:** Simple attribute.

The detailed validation and submission rules will be documented in the appropriate design stage.

### 3.11. UserRecoveryEmail

**Purpose:** Stores an alternative email address for account recovery.

**Description:**

`UserRecoveryEmail` stores an optional email address that can be used as an alternative recovery channel for the user's account.

It may help users recover access to their accounts when they cannot access their primary email address or encounter other account-recovery difficulties.

Unlike `UserEmail`, the recovery email address is not required to be unique across accounts. Multiple accounts may be associated with the same recovery email address, subject to a separate business rule governing the permitted number of accounts associated with one recovery email.

- **Nullability:** Optional; may be `NULL`.
- **Uniqueness:** Not required to be unique across accounts.
- **Attribute classification:** Simple attribute.

### 3.12. UserRecoveryEmailVerification

**Purpose:** Records the verification status of the recovery email address.

**Description:**

`UserRecoveryEmailVerification` indicates whether the recovery email address has completed the verification process.

Its intended behavior is similar to `UserEmailVerification`, but it applies specifically to the recovery email address.

The intended values are:

| Value | Meaning |
|---|---|
| `0` | The recovery email address has not been verified. |
| `1` | The recovery email address has been verified. |

If `UserRecoveryEmail` is `NULL`, `UserRecoveryEmailVerification` must also be `NULL`, because there is no recovery email address to verify.

If a recovery email address is provided, its verification status must have a value.

Successful verification indicates that access to the address was demonstrated at the time of verification; it does not guarantee continued accessibility indefinitely.

- **Nullability:** `NULL` when no recovery email address is provided; otherwise, a verification value is required.
- **Expected values when present:** `0` or `1`.
- **Attribute classification:** Simple attribute.

### 3.13. UserBirthDate

**Purpose:** Stores the user's date of birth.

**Description:**

`UserBirthDate` stores the date on which the user was born.

The system can use this information to calculate the user's age when needed. Age is derived from the date of birth rather than stored as a separate attribute.

Providing a date of birth is optional, allowing users who do not wish to provide this information to leave it unspecified.

- **Nullability:** Optional; may be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.14. UserCreatedAt

**Purpose:** Records when the user account was originally created.

**Description:**

`UserCreatedAt` stores the account's creation timestamp.

This attribute supports account tracking, reporting, and analysis. For example, it can help the team identify newly created accounts, compare account age across user groups, and analyze account creation activity over specific periods.

The timestamp represents the original creation of the account. If an account is logically deleted and later restored, its original creation timestamp remains unchanged. Restoring an existing account does not, by itself, mean that a new account has been created.

- **Nullability:** Required; must not be `NULL`.
- **Attribute classification:** Simple attribute.

### 3.15. UserGender

**Purpose:** Stores the user's gender selection.

**Description:**

`UserGender` records the gender value provided by the user.

This information may support relevant system features, the presentation of applicable offers, and analytical activities.

Providing a gender value is optional. Users who do not wish to provide this information may leave the attribute empty.

The permitted values under the current design are:

| Value | Meaning |
|---|---|
| `Male` | Male. |
| `Female` | Female. |

No other values are included in the current design.

- **Nullability:** Optional; may be `NULL`.
- **Permitted values:** `Male`, `Female`.
- **Attribute classification:** Simple attribute.

### 3.16. UserPhoneNumber

**Purpose:** Stores the phone number or numbers associated with the user account.

**Description:**

`UserPhoneNumber` represents the phone number information associated with the user's account.

At least one phone number is required for each account under the current design.

Phone numbers may support several purposes:

1. **Registration and verification:** Help the system verify the user's phone number during registration or other applicable authentication processes.
2. **Authentication support:** May be used as part of applicable login or verification workflows.
3. **Communication:** Provide an additional channel for contacting the user.
4. **Geographical analysis:** Country-specific dialing codes may help the system analyze the geographical distribution of its users.

Unlike the other attributes documented as simple attributes, `UserPhoneNumber` is classified as a **multi-valued attribute** because a user account may be associated with multiple phone numbers.

- **Requirement:** At least one phone number is required.
- **Attribute classification:** Multi-valued attribute.

The database structure used to represent multiple phone numbers, along with the associated relationships and constraints, will be documented in the relevant design stages.

---

## 4. Documentation Scope and Boundaries

This document defines the purpose of the `USERS` table, its governing business rules, and the intended purpose of each attribute.

The following topics are intentionally addressed in separate documentation stages:

- **Relationships:** How the `USERS` table relates to other entities.
- **Keys:** Primary keys, candidate keys, alternate keys, and other applicable key definitions.
- **Functional Dependencies:** Dependencies between attributes.
- **Normalization:** The normalization analysis and resulting design decisions.
- **Edge Cases:** Exceptional situations and their expected handling.
- **Data Types:** The appropriate database data type for each attribute.
- **Constraints:** The detailed database and business constraints.
- **Domain Lifecycle:** Account status transitions, registration and activation stages, email-change behavior, deletion timing, restoration behavior, and other applicable lifecycle rules.
- **Indexing:** Indexing decisions based on the system's query patterns and access requirements.

These topics will be documented in their respective stages rather than being fully specified here.

---

## 5. Summary

The `USERS` table provides a centralized structure for storing common account information for all users in the `USER-DOMAIN`.

Its design follows the principle that user classification is determined by assigned roles, while business-specific information is maintained separately in dedicated business profiles for roles that require it.

The documented attributes cover the user's name, primary email, email verification status, password hash, overall account status, deletion-related information, recovery email, date of birth, original account creation timestamp, gender, and phone number information.

This document establishes the intended purpose of the table and its attributes without replacing the separate documentation required for relationships, keys, functional dependencies, normalization, edge cases, data types, constraints, lifecycle rules, and indexing.

The complete account lifecycle, including the detailed behavior of account statuses and the deletion process, will be documented in a separate lifecycle document.

![001-DATABASE-USERS-USER-DOMAIN-MODEL](/DATABASE-DOCUMINTATION/DATABASE-USER-DOMAIN/IMAGES/001-DATABASE-USERS-USER-DOMAIN-MODEL.svg)

---

# ROLES Table Documentation

## 1. Table Overview

**Table:** `ROLES`  
**Scope:** Table Purpose, Business Rules, and Entity Discovery

### 1.1 Purpose

The `ROLES` table stores the definitions of the roles supported by the system.

The system supports multiple user categories, and a registered user may be assigned multiple roles simultaneously. Therefore, role definitions are maintained independently rather than being embedded directly within the `USERS` table.

Keeping role definitions in a separate table supports:

- **Centralized role definitions:** Role information is maintained in one dedicated location.
- **Reduced duplication and inconsistency:** Shared role definitions do not need to be repeated within individual user records.
- **Extensibility:** New roles can be introduced as the system supports additional user categories and business capabilities.
- **Future permission management:** Role-related permissions and additional role details can be addressed as the authorization model evolves.
- **Separation of responsibilities:** Defining a role is distinct from assigning a role to a user and managing that assignment's lifecycle.

### 1.2 Business Rules

The `ROLES` entity is documented in the context of the following business rules:

- **BR-001:** A registered user may be assigned multiple roles simultaneously.
- **BR-012:** Changing or removing a role shall not affect existing historical business records.
- **BR-013:** Historical business records shall remain preserved regardless of the role's current status.
- **BR-014:** Role assignments shall support Soft Delete instead of physical deletion.
- **BR-016:** Inactive roles shall not perform new business operations while preserving historical records.

These rules establish the need to distinguish role definitions from role assignments and to preserve historical business records independently of current role activity.

### 1.3 Entity Identification

The `ROLES` table represents the role definitions available within the system.

Each role definition has a name, a status, and a creation timestamp. The role name identifies the defined role and is intended to be unique and mandatory.

The role's status represents its current state, while the creation timestamp records when the role was created.

### 1.4 Scope Boundaries

This document establishes the purpose and identity of the `ROLES` entity. Detailed decisions concerning relationships, keys, functional dependencies, normalization, edge cases, data types, constraints, lifecycle behavior, and indexing will be documented in their designated stages.

# ROLES Table Documentation

## 1. Table Overview

**Table:** `ROLES`  
**Scope:** Table Purpose, Business Rules, and Attribute Descriptions

### 1.1 Purpose

The `ROLES` table stores the definitions of the roles supported by the system.

Since a registered user may be assigned multiple roles simultaneously and the system supports multiple user categories, role definitions are maintained separately from the `USERS` table.

This separation supports centralized role management, reduces duplicated role information and potential inconsistencies, and allows new roles and role-related permissions to be introduced as the system evolves.

It also separates the definition of a role from its assignment to a user. These represent different responsibilities and will be documented accordingly in the relevant stages.

## 2. Attribute Descriptions

### 2.1 `RoleName`

**Purpose:** Identifies the name of a role defined within the system.

**Description:**

- The attribute stores the name associated with a role definition.
- It is required and shall not contain a `NULL` value.
- Each role must have a unique name so that different role definitions can be distinguished.
- If an existing role is divided into multiple distinct roles, each resulting role shall have its own distinct name.
- The role name provides a human-readable identifier for the role and can be used to identify the role when working with its associated permissions.

**Attribute Classification:** Simple Attribute

### 2.2 `RoleStatus`

**Purpose:** Represents the current status of a role definition.

**Description:**

- The attribute indicates the current state of the role.
- It is required and shall not contain a `NULL` value.
- Its value must belong to the set of predefined statuses specified for the system.
- The attribute describes the status of the role definition itself. The activity status of an individual role assignment is a separate concern and will be documented in the relevant stage.

#### Defined Status Values

| Status | Meaning |
|---|---|
| `PENDING` | The role has been created and is awaiting completion of registration or activation. |
| `UNDERREVIEW` | The role is currently undergoing review. |
| `ACTIVE` | The role is fully active and operating normally. |
| `DEACTIVATED` | The role has been deactivated and is no longer active. |
| `DELETED` | The role has been logically deleted and is no longer active. |

**Attribute Classification:** Simple Attribute

### 2.3 `RoleCreatedAt`

**Purpose:** Records when the role was created.

**Description:**

- The attribute stores the creation timestamp of the role.
- It is required and shall not contain a `NULL` value.
- It provides a record of when the role definition was initially created.
- Its detailed behavior in lifecycle scenarios will be addressed in the `Lifecycle and Decision Finalization` stage.

**Attribute Classification:** Simple Attribute

## 3. Summary

The `ROLES` table provides a centralized definition of the roles supported by the system. Its documented attributes identify each role, represent its current status, and record its creation timestamp.

The definition of a role remains distinct from the assignment of that role to a user, allowing role definitions and individual role assignments to be addressed separately throughout the database design process.

![002-DATABASE-ROLES-USER-DOMAIN-MODEL](/DATABASE-DOCUMINTATION/DATABASE-USER-DOMAIN/IMAGES/002-DATABASE-ROLES-USER-DOMAIN-MODEL.svg)

---

# ROLE_CATEGORIES Table Documentation

## 1. Table Overview

**Domain:** `USER-DOMAIN`  
**Table:** `ROLE_CATEGORIES`  
**Scope:** Table Purpose, Business Rules, and Attribute Descriptions

### 1.1 Purpose

The `ROLE_CATEGORIES` table stores the categories used to classify roles within the system.

Each role belongs to a particular category, allowing the system to identify which roles fall under each classification. The system may contain numerous categories representing different groups, including `System Visitor`, `System Employee`, support-related categories, technical support categories, and other categories introduced as the system evolves.

Role categories are not limited to classification purposes. They also provide a place to maintain category-related information, such as the category's name, status, managers, and creation timestamp.

Maintaining role categories in a dedicated table supports centralized category management and provides a foundation for managing categories as the system grows.

Normalization and functional dependency considerations will be documented in their designated stages.

### 1.2 Related Business Rules

**BR-002:** A user may simultaneously be classified as both a System Visitor and a System Employee.

This rule establishes that a user may belong to multiple role categories simultaneously. These classifications are not necessarily mutually exclusive.

### 1.3 Table Responsibilities

The `ROLE_CATEGORIES` table is intended to support the following responsibilities:

- Identifying the category under which roles are classified.
- Maintaining the name of each category.
- Recording the current status of each category.
- Recording the manager or managers responsible for a category.
- Recording when a category was created.
- Providing a basis for managing category changes, including scenarios in which a category is divided into multiple categories.

The detailed behavior of category changes, category division, management responsibilities, and related relationships will be addressed in the appropriate design stages.

## 2. Attribute Descriptions

### 2.1 `CategoryName`

**Purpose:** Stores the name of the role category.

**Description:**

- Identifies the category under which roles are classified.
- The value is required and shall not be `NULL`.
- Each category name must be unique to distinguish one category from another and avoid duplicate category names.
- The name provides a human-readable identifier for the category.

**Attribute Classification:** Simple Attribute

### 2.2 `CategoryStatus`

**Purpose:** Represents the current status of the role category within the system.

**Description:**

- Indicates the current state of the category.
- The value is required and shall not be `NULL`.
- The attribute is intended to represent the category's status as its circumstances change over time.
- The permitted status values and their meanings will be specified in the appropriate design stage.

**Attribute Classification:** Simple Attribute

### 2.3 `CategoryManager`

**Purpose:** Identifies the manager or managers responsible for a role category.

**Description:**

- Stores the name or names of the manager or managers responsible for the category.
- Every category must have at least one manager; therefore, the attribute is required.
- A category may have multiple managers, making this a multi-valued attribute.
- This attribute describes management responsibility for the category without attempting to document the full organizational management structure.

**Attribute Classification:** Multi-Valued Attribute

### 2.4 `CategoryCreatedAt`

**Purpose:** Records when the role category was created.

**Description:**

- Stores the creation timestamp of the category.
- Records when the category was initially established in the system.
- Provides historical information that can support auditing, traceability, and operational review.
- The attribute's detailed behavior in category lifecycle scenarios will be addressed in the `Lifecycle and Decision Finalization` stage.

**Attribute Classification:** Simple Attribute

## 3. Summary

The `ROLE_CATEGORIES` table provides a centralized way to classify roles and maintain category-related information.

Its attributes identify each category, represent its current status, identify its manager or managers, and record its creation timestamp.

The table establishes the basis for category management while leaving relationship design, normalization, implementation details, and final lifecycle decisions to their designated stages.

![003-DATABASE-ROLECATEGORY-USER-DOMAIN-MODEL](/DATABASE-DOCUMINTATION/DATABASE-USER-DOMAIN/IMAGES/003-DATABASE-ROLECATEGORY-USER-DOMAIN-MODEL.svg)

---

# BUSINESS_INFORMATION Table Documentation

## 1. Table Overview

**Domain:** `USER-DOMAIN`  
**Table:** `BUSINESS_INFORMATION`  
**Scope:** Table Purpose, Business Rules, and Attribute Descriptions

### 1.1 Purpose

The `BUSINESS_INFORMATION` table stores business-related information for users whose assigned roles require a business profile.

The table is maintained separately from the `USERS` entity in accordance with the following business rules:

- **BR-010:** Business information shall be maintained separately from the User entity.
- **BR-011:** Only roles requiring business information shall be associated with business profiles.

The table is intended to maintain business contact information, identity verification information, business location details, and business registration information.

Examples include sellers who require business-related contact details and identity verification to operate within the system.

Maintaining business information separately allows account information and business information to serve distinct purposes. For example, a user's account email is separate from the email addresses maintained for business communication.

### 1.2 Table Responsibilities

The `BUSINESS_INFORMATION` table is intended to support the following responsibilities:

- Maintaining business contact email addresses and phone numbers.
- Recording the verification status of business contact information.
- Storing national identification information and its supporting image.
- Maintaining birth certificate image information for identity documentation.
- Recording country of birth and country of citizenship.
- Maintaining business location and postal code information.
- Identifying the type of business and its legally registered name.
- Storing business registration documentation and the company registration number.

Detailed decisions concerning relationships, verification workflows, access permissions, document handling, and lifecycle behavior will be addressed in their designated stages.

## 2. Attribute Descriptions

### 2.1 `BusinessInformationEmail`

**Purpose:** Stores email addresses used for business-related communication.

**Description:**

- Stores email addresses associated with the business information profile.
- The attribute is multi-valued because a profile may contain multiple business email addresses.
- A business email address may be the same as the user's `UserEmail`.
- Business email addresses are not required to be unique across all business profiles.
- The same email address may be associated with a maximum of three people across the system.
- Business email addresses are intended to support communication with customers, system administrators, and other relevant parties.
- Business email addresses are maintained independently from the account's primary email address.

**Attribute Classification:** Multi-Valued Attribute

### 2.2 `BusinessInformationEmailVerification`

**Purpose:** Records the verification status of business email addresses.

**Description:**

- Indicates whether a business email address has been verified.
- Supports verification of business contact information before it is treated as verified by the system.
- The attribute is required and shall not contain a `NULL` value.
- The specific verification values and the relationship between individual email addresses and their verification statuses will be addressed in the relevant design stages.

**Attribute Classification:** To be finalized in the relevant attribute and relationship design stages.

### 2.3 `NationalId`

**Purpose:** Stores the national identification number associated with the individual represented by the business information profile.

**Description:**

- Stores the individual's national identification number.
- The attribute is required and shall not contain a `NULL` value.
- Each national identification number must be unique across the system.
- It supports identity verification and helps establish the identity of the individual associated with the business profile.
- It may also provide information relevant to identifying the issuing country's identification system, subject to the applicable identification format.

**Attribute Classification:** Simple Attribute

### 2.4 `NationalIdImage`

**Purpose:** Stores an image of the national identification document as supporting identity evidence.

**Description:**

- Contains the image associated with the individual's national identification document.
- Supports verification of the identification information provided for the business profile.
- The attribute is required and shall not contain a `NULL` value.

**Attribute Classification:** Simple Attribute

### 2.5 `BirthCertificateImage`

**Purpose:** Stores an image of the individual's birth certificate as supporting identity documentation.

**Description:**

- Contains the image of the individual's birth certificate.
- Provides additional documentary information to support identity verification.
- The attribute is required and shall not contain a `NULL` value.

**Attribute Classification:** Simple Attribute

### 2.6 `BusinessInformationPhoneNumber`

**Purpose:** Stores phone numbers used for business-related communication.

**Description:**

- Stores phone numbers associated with the business information profile.
- The attribute is multi-valued because a profile may contain multiple phone numbers.
- Phone numbers must be unique across the system and must not be associated with more than one person.
- The attribute is intended to support communication with customers and other relevant parties.

**Attribute Classification:** Multi-Valued Attribute

### 2.7 `BusinessInformationPhoneNumberVerification`

**Purpose:** Records the verification status of business phone numbers.

**Description:**

- Indicates whether a business phone number has been verified.
- Supports verification of business contact information.
- The attribute is required and shall not contain a `NULL` value.
- The specific verification values and the relationship between individual phone numbers and their verification statuses will be addressed in the relevant design stages.

**Attribute Classification:** To be finalized in the relevant attribute and relationship design stages.

### 2.8 `CountryOfBirth`

**Purpose:** Records the country in which the individual was born.

**Description:**

- Stores the individual's country of birth.
- The value is required and shall not be `NULL`.
- The information is intended to correspond to the individual's supporting identification documentation, including the national identification document and birth certificate.

**Attribute Classification:** Simple Attribute

### 2.9 `CountryOfCitizenship`

**Purpose:** Records the individual's country of citizenship.

**Description:**

- Identifies the country of which the individual is a citizen.
- The attribute is required and shall not contain a `NULL` value.

**Attribute Classification:** Simple Attribute

### 2.10 `BusinessCountry`

**Purpose:** Identifies the country in which the business operates or is located.

**Description:**

- Stores the country associated with the business location.
- The attribute is required and shall not contain a `NULL` value.
- Supports identification of the business's country for business-related documentation and location information.

**Attribute Classification:** Simple Attribute

### 2.11 `BusinessPostalCode`

**Purpose:** Stores the postal code associated with the business location.

**Description:**

- Records the postal code associated with the business.
- The attribute is required and shall not contain a `NULL` value.
- Supports business location identification and relevant administrative or registration processes.

**Attribute Classification:** Simple Attribute

### 2.12 `BusinessType`

**Purpose:** Identifies the type or structure of the business associated with the profile.

**Description:**

- Specifies the nature of the business arrangement.
- Distinguishes between different business types, such as an individual operating independently, an individual operating within a business, or a business operating through a store.
- The attribute is required and shall not contain a `NULL` value.
- The complete set of permitted business types will be specified in the relevant design stage.

**Attribute Classification:** Simple Attribute

### 2.13 `LegalBusinessName`

**Purpose:** Stores the legally registered name of the business.

**Description:**

- Records the business name recognized in official registration or governmental documentation.
- The legal business name may differ from the public-facing name of the business or store.
- The attribute is required and shall not contain a `NULL` value.

**Attribute Classification:** Simple Attribute

### 2.14 `BusinessRegistrationDocument`

**Purpose:** Stores the business registration document used to support verification of the business's registration information.

**Description:**

- Contains the document associated with the business's registration.
- Supports verification of the business information submitted to the system.
- The attribute is required and shall not contain a `NULL` value.

**Attribute Classification:** Simple Attribute

### 2.15 `CompanyRegistrationNumber`

**Purpose:** Stores the registration number associated with the company or registered business.

**Description:**

- Records the company's or registered business's registration number.
- Supports identification and verification of the business registration information.
- The attribute is required and shall not contain a `NULL` value.

**Attribute Classification:** Simple Attribute

## 4. Summary

The `BUSINESS_INFORMATION` table maintains business-related contact, identity, location, and registration information separately from the user's common account information.

It is intended for users whose assigned roles require business profiles, in accordance with BR-010 and BR-011.

The documented attributes establish the current scope of business information while leaving detailed relationships, implementation decisions, and lifecycle behavior to their designated design stages.

![004-DATABASE-BUSINESS-INFORMATION-USER-DOMAIN-MODEL](/DATABASE-DOCUMENTATION/DATABASE-USER-DOMAIN/IMAGES/004-DATABASE-BUSINESS-INFORMATION-USER-DOMAIN-MODEL.svg)


## 5. FINAL LOGICAL MODEL
![000-DATABASE-USER-DOMAIL-MODEL](/DATABASE-DOCUMENTATION/DATABASE-USER-DOMAIN/IMAGES/000-DATABASE-USER-DOMAIL-MODEL.svg)
