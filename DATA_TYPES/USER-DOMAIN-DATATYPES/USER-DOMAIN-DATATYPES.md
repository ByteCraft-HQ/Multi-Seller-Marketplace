# Users Table

The `Users` table is the main table responsible for storing the core information related to users and their accounts.

The table is designed with the following principles in mind:

* Scalability
* Internationalization
* Data integrity
* Security
* Account history
* Future extensibility

---

## 1. UserId

**Data Type:** `BIGINT`
**Key:** `PRIMARY KEY`

### Why `BIGINT`?

`BIGINT` is used as the Primary Key for the user because the system may grow to a very large number of users over time.

Compared to `INT`, `BIGINT` provides a significantly larger range of values, reducing the possibility of reaching the maximum available ID range as the system grows.

The `UserId` must be:

* Unique for every user.
* Stable throughout the lifetime of the record.
* Suitable for use as a Foreign Key in other tables.

### Scalability

Using `BIGINT` provides a very large ID range and allows the system to grow without requiring a change to the Primary Key type later.

It also provides flexibility if large-scale database techniques such as Partitioning are introduced in the future.

> **Note:** Choosing `BIGINT` alone does not make the table scalable, and Partitioning does not depend solely on the ID type. The Partitioning strategy should be based on data volume, query patterns, and access patterns.

---

# 2. FirstName

**Data Type:** `NVARCHAR(50)`

`FirstName` uses `NVARCHAR` because users may enter their names using different languages and writing systems.

For example, a user's name may be written in:

* Arabic
* English
* Russian
* Or any other Unicode-supported language

The system should not force users to write their names in English.

### Why `NVARCHAR`?

`NVARCHAR` supports Unicode characters, allowing the system to store names from different languages without restricting users to a specific character set.

### Why 50 Characters?

`50` characters is a business-defined limit for the first name.

Most names will be significantly shorter than this limit, while 50 characters still provides enough room for unusually long names.

The limit provides a practical balance between business requirements and unnecessary column size.

---

# 3. MiddleName - LastName

**Data Type:** `NVARCHAR(50)`

The same principle used for `FirstName` applies to `LastName` and `MiddleName.

`NVARCHAR` is used because family names may contain characters from different languages and writing systems.

The system should not require users to translate or rewrite their names into English.

### Why 50 Characters?

`50` characters is a business-defined limit that should accommodate normal and unusually long family names without unnecessarily increasing the column size.

---

# 4. AccountStatus

**Data Type:** `VARCHAR(20)`

`AccountStatus` represents the current state of the user's account.

`VARCHAR` is used because the status values are predefined short string codes and do not require Unicode support.

### Why 20 Characters?

The current business requirements define statuses that are shorter than 20 characters.

The additional space provides reasonable flexibility if new account statuses are introduced in the future.

### Account Status Values

| Status        | Meaning                                                                              |
| ------------- | ------------------------------------------------------------------------------------ |
| `PENDING`     | The account has been created and is still going through registration or activation.  |
| `UNDERREVIEW` | The account is currently under review.                                               |
| `ACTIVE`      | The account is fully active and operating normally.                                  |
| `LIMITED`     | The account is active but has certain restrictions.                                  |
| `SUSPENDED`   | The account is temporarily suspended.                                                |
| `DEACTIVATED` | The account has been deactivated and is no longer active.                            |
| `DELETED`     | The account has been logically deleted and is no longer active.                      |
| `BLOCKED`     | The account has been permanently blocked by the system according to system policies. |

> The specific Constraints for `AccountStatus` will be documented separately in the `Constraints` documentation.

---

# 5. DeletedAt

**Data Type:** `DATETIME2`

`DeletedAt` stores the date and time when the account was logically deleted.

The system uses **Soft Delete**, meaning that the user record is not physically removed from the database.

Instead, the record is retained to preserve historical information and maintain relationships with other data.

### Why `DATETIME2`?

`DATETIME2` provides accurate date and time information, allowing the system to determine exactly when the account was marked as deleted.

The related rules and Constraints will be documented separately in the `Constraints` documentation.

---

# 6. HashPassword

**Data Type:** `VARCHAR(255)`

`HashPassword` stores the hashed representation of the user's password instead of storing the original password.

> **Important:** Plain-text passwords must never be stored in the database.

### Why Hash the Password?

The user's original password should never be stored directly.

Instead, the password is processed using an appropriate password-hashing algorithm, and only the resulting hash is stored.

During authentication, the provided password is verified against the stored hash.

### Why `VARCHAR`?

The stored password hash is represented as a string containing a limited set of characters.

Therefore, Unicode support is not required for the stored hash itself.

The fact that the original password may contain Unicode characters does not mean that the resulting hash column must use `NVARCHAR`.

### Why 255 Characters?

`255` characters is a **business-defined limit** for this system.

This limit is part of the current database design requirements.

> **Important:** The 50-character limit must be compatible with the exact password-hashing algorithm and encoding format used by the application. The database column must always be large enough to store the complete generated hash.
>**Note:** Changing the hashing algorithm we use in the project in the future could cause issues if the column length is less than 255 characters. Therefore, we should take this into consideration when defining the database schema.
>
> For this reason, we set the `PasswordHash` column length to `255`, as a different hashing algorithm may require a longer hash string. This gives us enough flexibility in case we decide to switch to a different algorithm in the future.

---

# 7. Email

**Data Type:** `NVARCHAR(320)`

`Email` stores the user's primary email address.

### Why `NVARCHAR`?

The system is designed to support users from different countries and languages.

The business requirements allow the possibility of Unicode characters in email addresses. Therefore, `NVARCHAR` is used to ensure that the database can store Unicode characters without restricting users to ASCII or English-only input.

This allows the system to support a broader range of international email addresses when they are valid according to the application's email validation rules.

### Why 320 Characters?

`320` characters is used as a commonly referenced maximum length for an email address.

This provides sufficient capacity for long email addresses while maintaining a clear business-defined boundary for the column.

Therefore, the column is defined as:

```sql
Email NVARCHAR(320)
```

> **Important:** Using `NVARCHAR` only determines how the value is stored in the database. It does not mean that every Unicode string is automatically a valid email address. The application must still validate the email according to the email-address rules supported by the system.

Email normalization, validation, uniqueness, and case-sensitivity rules will be documented separately.

---

# 8. EmailVerification

**Data Type:** `BIT`

`EmailVerification` indicates whether the user's primary email address has been successfully verified.

| Value | Meaning                              |
| ----- | ------------------------------------ |
| `0`   | Email address has not been verified. |
| `1`   | Email address has been verified.     |

### Why `BIT`?

There are only two possible states:

* Verified
* Not Verified

Therefore, `BIT` is an appropriate data type for representing this boolean state.

> **Note:** `EmailVerification` represents email verification status only. It does not determine whether the account itself is approved or active. Account state is handled separately by `AccountStatus`.

---

# 9. RecoveryEmail

**Data Type:** `NVARCHAR(320)`

`RecoveryEmail` stores an optional secondary email address that can be used to help recover access to the user's primary account.

It may be used in situations such as:

* Losing access to the primary email.
* Account recovery.
* Problems with the primary account email.
* Additional account recovery procedures.

The field is nullable because providing a recovery email is not necessarily mandatory.

### Why `NVARCHAR`?

The same internationalization requirements applied to the primary `Email` field also apply to `RecoveryEmail`.

Therefore, `NVARCHAR(320)` is used to support Unicode email addresses when they are accepted by the application's validation rules.

---

# 10. BirthDate

**Data Type:** `DATE`

`BirthDate` stores the user's date of birth.

### Why `DATE` Instead of `DATETIME2`?

The system only needs to know **the date on which the user was born**.

For example:

```text
2000-05-10
```

The exact time of birth is not required by the current business requirements.

Using `DATETIME2` would store additional information such as:

```text
2000-05-10 03:42:17
```

That information provides no additional value if the system only needs the user's birth date.

Therefore, `DATE` is a more accurate representation of the actual business data.

### Age Calculation

The user's age should not be stored as a separate column because age changes over time.

Instead, it should be calculated dynamically using:

```text
BirthDate
```

and the current date.

---

# 11. Gender

**Data Type:** `VARCHAR(10)`

`Gender` stores the gender value defined by the system's business requirements.

`VARCHAR` is used because the values are short predefined string values.

For example:

```text
MALE
FEMALE
```

Additional values can be supported in the future if required by the business requirements.

The allowed values should be explicitly defined through the appropriate database Constraints.

---

# 12. CreatedAt

**Data Type:** `DATETIME2`

`CreatedAt` stores the date and time when the user record was created.

It can be used for:

* Determining when an account was created.
* Sorting users by creation date.
* Analyzing user growth.
* Auditing and historical tracking.

---

# 13. UpdatedAt

**Data Type:** `DATETIME2`

`UpdatedAt` stores the date and time of the latest modification to the user record.

It can be updated when information such as the following changes:

* First name.
* Last name.
* Email.
* Account status.
* Other user-related information.

The exact rules for updating `UpdatedAt` will be documented separately in the `Constraints` documentation.

---

# UserRole Table

The `UserRole` table is responsible for managing the relationship between users and their assigned roles.

A single user may have multiple roles at the same time.

For example, one user could have:

```text
UserId = 1000000000

Roles:
- ADMIN
- MODERATOR
- SUPPORT
```

Therefore, the `UserRole` table represents a **many-to-many relationship** between users and roles.

---

# 1. UserRoleId

**Data Type:** `BIGINT`
**Key:** `PRIMARY KEY`
**Type:** `Surrogate Key`

`UserRoleId` is a surrogate key used to uniquely identify each User-Role assignment.

It does not represent the `UserId` or the `RoleId` itself.

Instead, every row in the `UserRole` table receives its own unique identifier.

### Why a Surrogate Key?

A single user can have multiple roles.

For example:

| UserRoleId | UserId | RoleId |
| ---------: | -----: | -----: |
|          1 |    100 |      1 |
|          2 |    100 |      2 |
|          3 |    100 |      5 |

The `UserRoleId` uniquely identifies each assignment.

This makes the row itself independently identifiable and allows other tables to reference a specific User-Role assignment if required in the future.

### Why `BIGINT`?

The `UserRole` table can become significantly larger than the `Users` table because one user can have multiple role assignments.

For example:

```text
1 User
   ↓
3 Roles

1,000,000,000 Users
   ↓
Potentially billions of UserRole records
```

Therefore, `BIGINT` provides a large range of identifiers and prevents the surrogate key from becoming a limiting factor as the number of User-Role assignments grows.

> **Important:** The reason for using `BIGINT` is the potential total number of rows in the `UserRole` table, not simply the fact that a user can have multiple roles.

---

# 2. UserId

**Data Type:** `BIGINT`
**Key:** `FOREIGN KEY`

`UserId` is a Foreign Key referencing the `UserId` column in the `Users` table.

It identifies the user who owns the role assignment.

### Why `BIGINT`?

The `UserId` must use the same data type as the Primary Key it references in the `Users` table.

Since:

```text
Users.UserId = BIGINT
```

the corresponding Foreign Key must also be:

```text
UserRole.UserId = BIGINT
```

This ensures type consistency between the Primary Key and Foreign Key.

It also allows the `UserRole` table to reference users across the entire range supported by the `Users` table.

For example, if the system eventually has a user with:

```text
UserId = 1,000,000,000
```

the `UserRole` table can reference that user without requiring a different identifier type.

---

# 3. RoleId

**Data Type:** `TINYINT`
**Key:** `FOREIGN KEY`

`RoleId` identifies the role assigned to the user.

It references the `RoleId` column in the `Roles` table.

### Why `TINYINT`?

The current business requirements define a relatively small number of roles.

The expected number of roles in the system is not expected to exceed approximately 100 roles.

`TINYINT` supports values from:

```text
0 → 255
```

when using the SQL Server `TINYINT` data type.

Therefore, it provides enough capacity for the current business requirements without using a larger integer type unnecessarily.

Using `INT` or `BIGINT` for a value that is expected to remain below 100 would provide a much larger range than the business actually requires.

### Why Not `INT` or `BIGINT`?

The goal is to choose a data type based on the expected domain of the data.

If the system expects fewer than 100 roles, allocating a much larger numeric range provides no practical business benefit.

Therefore:

```text
RoleId = TINYINT
```

is an appropriate choice for the current requirements.

> If the role system is expected to grow beyond the `TINYINT` range in the future, the data type can be changed as part of a planned schema migration.

---

# 4. UserRoleStatus

**Data Type:** `VARCHAR(20)`

`UserRoleStatus` represents the current status of the relationship between the user and the assigned role.

It uses the same status values defined for the account status in the `Users` table.

### Why `VARCHAR`?

The status values are predefined short string codes and do not require Unicode support.

### Why 20 Characters?

The current business requirements define statuses that are shorter than 20 characters.

The additional space provides reasonable flexibility if new statuses are introduced in the future.

### User Role Status Values

| Status        | Meaning                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `PENDING`     | The User-Role assignment has been created and is still going through registration or activation.  |
| `UNDERREVIEW` | The User-Role assignment is currently under review.                                               |
| `ACTIVE`      | The User-Role assignment is fully active.                                                         |
| `LIMITED`     | The User-Role assignment is active but has certain restrictions.                                  |
| `SUSPENDED`   | The User-Role assignment is temporarily suspended.                                                |
| `DEACTIVATED` | The User-Role assignment has been deactivated.                                                    |
| `DELETED`     | The User-Role assignment has been logically deleted.                                              |
| `BLOCKED`     | The User-Role assignment has been permanently blocked by the system according to system policies. |

> The specific Constraints for `UserRoleStatus` will be documented separately in the `Constraints` documentation.

---

# 5. ActiveNow

**Data Type:** `BIT`

`ActiveNow` indicates whether the specific role assignment is currently active.

A user can have multiple roles, but not every role necessarily has to be active at the same time.

For example:

| UserId | RoleId | ActiveNow |
| -----: | -----: | --------: |
|    100 |      1 |         1 |
|    100 |      2 |         0 |
|    100 |      3 |         0 |

In this example, the user has three assigned roles, but only one of them is currently active.

### Why `BIT`?

The system only needs to know whether the specific role is currently active or not.

Therefore, only two states are required:

| Value | Meaning                           |
| ----- | --------------------------------- |
| `0`   | The role is not currently active. |
| `1`   | The role is currently active.     |

Using `BIT` is therefore sufficient and avoids storing unnecessary information.

---

# Design Principles

### 1. Scalability

`BIGINT` is used for `UserRoleId` and `UserId` to support a potentially very large number of users and User-Role assignments.

### 2. Referential Integrity

`UserId` references the `Users` table, while `RoleId` references the `Roles` table.

This ensures that User-Role assignments are associated with valid records.

### 3. Efficient Data Types

Each column uses a data type appropriate to the expected size and nature of its data.

For example:

* `BIGINT` for potentially very large identifiers.
* `TINYINT` for the relatively small Role ID domain.
* `VARCHAR(20)` for short status values.
* `BIT` for boolean state.

### 4. Multiple Roles per User

The design allows a single user to have multiple roles without duplicating the user's information.

### 5. Future Extensibility

The structure allows additional roles and User-Role assignments to be introduced as the system grows while keeping the existing relationship model intact.

---

# Roles Table

The `Roles` table is the main reference table responsible for defining the roles available within the system.

The `UserRole` table uses `RoleId` from this table to determine which role or roles are assigned to each user.

The `Roles` table defines the available roles, while the actual permissions associated with these roles will be documented separately.

> **Note:** Role Permissions will be covered later in a separate schema and documentation section.

---

# 1. RoleId

**Data Type:** `TINYINT`
**Key:** `PRIMARY KEY`

`RoleId` uniquely identifies each role in the system.

### Why `TINYINT`?

The current business requirements define a relatively limited number of roles.

The current role catalog contains 60 roles, and the system is not expected to exceed the range supported by `TINYINT`.

In SQL Server, `TINYINT` supports values from:

```
0 → 255
```

This provides enough capacity for the current role model and reasonable future expansion.

### Why Not `INT` or `BIGINT`?

Using `INT` or `BIGINT` would provide a significantly larger numeric range than the business domain currently requires.

Since the number of roles is expected to remain within the `TINYINT` range, using a smaller data type is a more appropriate choice for the current design.

It also avoids allocating a larger numeric range when it provides no practical benefit for this particular domain.

---

# 2. RoleCategoryId

**Data Type:** `TINYINT`
**Key:** `FOREIGN KEY`

`RoleCategoryId` identifies the category to which the role belongs.

The category provides a higher-level classification for the role.

For example, roles can belong to categories such as:

```
System Visitor
System Employee
```

Additional role categories may be introduced as the system evolves.

The complete Role Category model will be documented separately.

### Why `TINYINT`?

The number of Role Categories is expected to remain relatively small.

The current business requirements do not expect the number of categories to exceed the range supported by `TINYINT`.

Since SQL Server `TINYINT` supports:

```
0 → 255
```

it provides sufficient capacity for the expected number of Role Categories.

Using `INT` or `BIGINT` would provide significantly more capacity than required for this domain.

---

# 3. RoleName

**Data Type:** `VARCHAR(30)`

`RoleName` stores the system-defined name of the role.

Examples include:

```
Customer
Seller Owner
Seller Admin
Order Manager
Warehouse Manager
Finance Manager
System Admin
Security Admin
```

### Why `VARCHAR`?

The Role Name is a **system-defined value**, not user-generated content.

The system controls the available role names, and they are stored as predefined identifiers.

Therefore, Unicode support is not required for the current Role Name design.

The system's internal role identifiers remain consistent regardless of the user's language.

> If the system later requires displaying role names in multiple languages, localization should be handled through a dedicated translation/localization structure rather than changing the core role identifier itself.

### Why 30 Characters?

The current role catalog defines role names that fit within the 30-character business limit.

Therefore:

```
RoleName VARCHAR(30)
```

provides enough space for the current role definitions while maintaining a clear boundary for the field.

---

# 4. RoleStatus

**Data Type:** `VARCHAR(20)`

`RoleStatus` represents the current status of the role itself.

The role status follows the same general status model used by the `UserRole` table.

### Why `VARCHAR`?

The status values are predefined system values represented as short string codes.

Therefore, `VARCHAR` is sufficient and Unicode support is not required.

### Why 20 Characters?

The current status values fit within the 20-character limit.

The additional space provides reasonable flexibility if additional role states are introduced in the future.

### Role Status Values

| Status        | Meaning                                                                           |
| ------------- | --------------------------------------------------------------------------------- |
| `PENDING`     | The role has been created and is waiting for activation or further processing.    |
| `UNDERREVIEW` | The role is currently under review.                                               |
| `ACTIVE`      | The role is currently available for assignment and use.                           |
| `LIMITED`     | The role is available but has certain restrictions.                               |
| `SUSPENDED`   | The role is temporarily suspended.                                                |
| `DEACTIVATED` | The role has been deactivated and is no longer available for normal use.          |
| `DELETED`     | The role has been logically deleted.                                              |
| `BLOCKED`     | The role has been permanently blocked by the system according to system policies. |

> The exact Constraints and allowed values for `RoleStatus` will be documented separately in the `Constraints` documentation.

---

# Core Roles

The system currently defines the following core roles.

---

## Customer / Buyer

### 1. Customer

The standard customer who purchases products and uses the platform's services.

### 2. Business Customer

A customer account associated with a company or organization rather than a standard individual customer.

### 3. Business Account Admin

The administrator responsible for managing the business account, including its users and business-related settings.

### 4. Business Buyer

An employee who makes purchases on behalf of a company or organization.

### 5. Business Approver

An employee responsible for approving purchase operations that require approval within a business account.

---

## Seller / Merchant

### 6. Seller Owner

The owner of a seller account and the highest-level administrator within the seller account.

### 7. Seller Admin

The administrator responsible for seller account users, settings, and day-to-day administration.

### 8. Seller Operations Manager

Manages the seller's daily operations, including orders, inventory, fulfillment, and operational issues.

### 9. Seller Catalog Manager

Responsible for managing the seller's products, listings, and catalog.

### 10. Seller Inventory Manager

Responsible for inventory quantities, inventory movement, and restocking operations.

### 11. Seller Order Manager

Responsible for managing the order lifecycle from receiving orders through processing and completion.

### 12. Seller Fulfillment Manager

Responsible for order fulfillment, preparation, and handoff to shipping operations.

### 13. Seller Customer Service

Responsible for seller-side customer service, including customer questions, complaints, and order-related issues.

### 14. Seller Finance Manager

Responsible for seller financial operations such as payments, settlements, and financial reporting.

### 15. Seller Marketing Manager

Responsible for advertisements, campaigns, promotions, coupons, and seller product marketing.

### 16. Seller Compliance Manager

Responsible for ensuring that the seller follows platform policies, regulatory requirements, and documentation requirements.

### 17. Seller Analyst

Responsible for analyzing seller sales, performance, inventory, and operational data and generating reports.

---

## Store / Branch

### 18. Store Manager

The primary manager of a specific store, responsible for employees, sales, inventory, and store operations.

### 19. Store Supervisor

Supervises employees and daily operations within a store and operates under the Store Manager.

### 20. Store Employee

A standard store employee who performs the tasks permitted by their assigned permissions.

### 21. Store Cashier

Responsible for payment processing, collection, and store-related invoicing operations.

### 22. Branch Manager

Responsible for an entire branch. A branch may contain one or more stores depending on the system design.

### 23. Regional Manager

Responsible for a group of branches or stores located within a specific geographic region.

---

## Product / Catalog

### 24. Catalog Admin

An administrator responsible for the overall catalog system, including product structures, classifications, and catalog data.

### 25. Catalog Editor

Responsible for adding and modifying product and catalog information without having full administrative privileges.

### 26. Catalog Reviewer

Reviews catalog additions and modifications before they are approved or published.

### 27. Category Manager

Responsible for managing product categories and the overall category structure.

### 28. Brand Manager

Responsible for managing brands and related brand information within the platform.

### 29. Product Manager

Responsible for managing the product lifecycle and core product information.

### 30. Product Reviewer

Reviews products and related information to ensure accuracy before approval.

---

## Orders / Fulfillment

### 31. Order Manager

Responsible for managing the order lifecycle and handling order-related issues and exceptions.

### 32. Order Processor

Performs daily order operations such as processing, updating, and preparing orders.

### 33. Fulfillment Manager

Responsible for the overall order fulfillment process.

### 34. Shipping Manager

Responsible for shipping operations, shipping providers, shipment tracking, and delivery issues.

### 35. Returns Manager

Responsible for managing, reviewing, and processing product returns.

### 36. Refund Manager

Responsible for refund operations and amounts returned to customers.

---

## Warehouse / Inventory

### 37. Warehouse Manager

The primary manager of a specific warehouse and its receiving, storage, preparation, and shipping operations.

### 38. Warehouse Supervisor

Supervises warehouse employees and daily warehouse operations.

### 39. Warehouse Employee

Performs warehouse operations such as picking, packing, and receiving.

### 40. Inventory Manager

Responsible for inventory management at the system level or across a group of warehouses or stores, depending on the assigned scope.

### 41. Inventory Auditor

Reviews inventory and compares physical quantities with recorded quantities to identify discrepancies.

---

## Customer Service / Communication

### 42. Customer Service Manager

Manages the customer service team and oversees tickets, complaints, and escalations.

### 43. Customer Service Agent

A customer service employee who directly handles customers, orders, and customer issues.

### 44. Contact Admin

Responsible for the contact center system, its configuration, and contact center employees.

### 45. Contact Agent

Handles customer communication through channels such as Chat, Email, or Phone.

### 46. Complaint Manager

Responsible for managing complaints, tracking them, handling escalations, and resolving complaint cases.

### 47. Dispute Manager

Responsible for managing disputes between parties, such as disputes between customers and sellers.

---

## Reviews / Moderation

### 48. Review Admin

An administrator responsible for the Review system and its configuration.

### 49. Review Moderator

Reviews user-generated reviews and handles content that violates platform policies.

### 50. Content Moderator

Responsible for broader content moderation, including text, images, product content, and user-generated content.

---

## Finance

### 51. Finance Manager

Responsible for financial operations, financial reporting, settlements, and financial accounts.

### 52. Accountant

Handles accounting operations, financial records, invoices, and settlements.

### 53. Billing Manager

Responsible for billing, invoices, fees, and outstanding amounts.

### 54. Payment Operations Manager

Responsible for payment processing, collections, payouts, and operational payment issues.

### 55. Tax Manager

Responsible for tax operations, tax rules, tax reporting, and tax compliance.

---

## HR

### 56. HR Manager

Responsible for employee management, HR operations, organizational structure, recruitment, and internal policies.

### 57. HR Staff

HR employee responsible for daily operations such as employee data, leave management, attendance, and documentation.

---

## IT / Security / Platform

### 58. IT Support

Responsible for assisting employees and internal users with technical issues and technical support.

### 59. System Admin

Responsible for system administration, internal infrastructure, system settings, users, and technical services.

### 60. Security Admin

Responsible for security operations, permissions, security policies, audit logs, and monitoring security events.                    |

---

# Design Principles

### 1. Small and Appropriate Identifier Types

`TINYINT` is used for `RoleId` and `RoleCategoryId` because both domains are expected to remain relatively small.

### 2. Centralized Role Definition

The `Roles` table acts as the central source of truth for the roles available within the system.

### 3. Separation of Roles and Permissions

A Role defines a logical responsibility or function.

The actual permissions associated with each Role will be handled separately in the Role Permission schema.

This keeps the role definition separate from the detailed authorization model.

### 4. Role Categorization

`RoleCategoryId` provides a way to group roles into higher-level categories.

This allows the system to distinguish between different types of roles without duplicating category information inside every role record.

### 5. Controlled System Values

Role names and statuses are system-defined values rather than arbitrary user input.

This allows the application to maintain a controlled and consistent role catalog.

### 6. Future Extensibility

The design allows additional roles and categories to be introduced without changing the fundamental structure of the `Roles` table.

---

# User-PhoneNumber Table

The `User-PhoneNumber` table stores phone numbers associated with users.

Phone numbers are kept in a separate table instead of being stored directly in the `Users` table because a user may have more than one phone number. Separating phone numbers also allows each phone number to have its own verification status and lifecycle status.

---

# Column Details

---

## 1. `UserId BIGINT`

`UserId` is a foreign key referencing:

```
Users.UserId
```

We use `BIGINT` because the referenced primary key in the `Users` table is also `BIGINT`.

The data type of a foreign key should match the data type of the primary key it references.

This means one user can have multiple phone numbers.

---

## 2. `PhoneNumber NVARCHAR(20)`

The phone number is stored as `NVARCHAR(20)`.

### Why `NVARCHAR` instead of a numeric data type?

A phone number is **not a mathematical number**. It is an identifier represented as text.

Using `INT`, `BIGINT`, `NUMERIC`, or another numeric data type would create several problems.

### Leading zeros

A phone number may start with `0`.

For example:

```
01012345678
```

A numeric data type does not preserve the leading zero as part of the value.

---

### Plus sign

International phone numbers may contain a `+` prefix:

```
+201012345678
```

`+` is not a numeric character, so numeric data types cannot represent the complete phone number.

---

### Separators and formatting

Users may enter phone numbers using formatting characters such as:

```
+20 10 1234 5678
```

or:

```
010-1234-5678
```

These characters are not numeric values.

---

### Unicode support

`NVARCHAR` also allows the system to accept Unicode input.

The platform may receive phone-number input containing different numeral systems or Unicode characters depending on the user's input method, language, or formatting.

For example, users may enter numbers using Arabic-Indic or other Unicode digits.

Therefore, `NVARCHAR` gives the application enough flexibility to store the user's submitted representation.

> **Important:** Storing the value as `NVARCHAR` does not mean every Unicode character should be accepted as a valid phone number. Application-level validation should still determine which characters and formats are allowed.

---

### Why `NVARCHAR(20)`?

The `20` is a business-defined storage limit intended to provide enough space for a complete phone number, including an international country code and possible formatting characters.

For example:

```text
+201012345678
```

or:

```
+20 10 1234 5678
```

The exact validation rules should be handled by the application rather than relying only on the database data type.

---

## 4. `PhoneStatus VARCHAR(20)`

`PhoneStatus` represents the current lifecycle/status of the phone number.

The current business-defined statuses are:

| Status      | Meaning                                                        |
| ----------- | -------------------------------------------------------------- |
| `PENDING`   | The phone number is currently under review.                    |
| `REVIEWED`  | The phone number has been reviewed.                            |
| `APPROVED`  | The phone number has been accepted.                            |
| `REJECTED`  | The phone number was not accepted.                             |
| `SUSPENDED` | The phone number is temporarily stopped/inactive.              |
| `BLOCKED`   | The phone number has been blocked.                             |
| `DELETED`   | The phone-number record has been deleted or logically removed. |

We use `VARCHAR(20)` because these are system-defined status codes and do not require Unicode storage.

The `20` character limit provides enough space for the current status values while leaving room for future additions.

> The exact allowed values should eventually be enforced through a `CHECK` constraint or a dedicated reference table.

---

## 5. `PhoneVerification BIT`

`PhoneVerification` answers one simple question:

> **Has this phone number been verified?**

There are only two possible states:

```
0 = Not Verified
1 = Verified
```

We use `BIT` because the field represents a simple binary state.

Unlike `PhoneStatus`, this field does not need multiple lifecycle states. We only need to know whether the verification process has successfully verified the phone number or not.

For example:

| PhoneVerification | Meaning                       |
| ----------------: | ----------------------------- |
|               `0` | Phone number is not verified. |
|               `1` | Phone number is verified.     |

### Why keep `PhoneStatus` and `PhoneVerification` separately?

They represent two different concepts.

`PhoneStatus` describes the **lifecycle/status of the phone-number record**.

`PhoneVerification` describes only whether the **phone number has been successfully verified**.

For example, a phone number could be:

```text
PhoneStatus       = APPROVED
PhoneVerification = 1
```

Or:

```text
PhoneStatus       = PENDING
PhoneVerification = 0
```

Keeping these concepts separate prevents the verification flag from having to represent multiple unrelated states.

---

# Design Principles

### 1. Phone numbers are identifiers, not numbers

Phone numbers should be stored as strings because they can contain:

* Leading zeros
* `+`
* Spaces
* Hyphens
* Other formatting characters

Therefore, numeric data types such as `INT`, `BIGINT`, or `NUMERIC` are inappropriate.

### 2. Unicode input is supported

`NVARCHAR(20)` allows the system to store Unicode phone-number input when required.

### 3. Verification is binary

`PhoneVerification` uses `BIT` because only two states are required:

```
0 → Not Verified
1 → Verified
```

### 4. Status and verification are different concepts

`PhoneStatus` manages the phone-number lifecycle, while `PhoneVerification` answers only whether the phone number has been verified.

### 5. User and phone numbers are separated

Keeping phone numbers in their own table allows a user to have multiple phone numbers without adding multiple phone columns to the `Users` table.

---

# RoleCategory Table

The `RoleCategory` table defines the categories used to organize and classify system roles.

Each role belongs to a role category through `RoleCategoryId`.

For example, roles can be grouped into categories such as:

* Customer / Buyer
* Seller / Merchant
* Store / Branch
* Product / Catalog
* Orders / Fulfillment
* Warehouse / Inventory
* Finance
* HR
* IT / Security / Platform

The exact categories are business-defined and can grow as the system evolves.

---

# Column Details

## 1. `RoleCategoryId TINYINT`

`RoleCategoryId` is the primary key of the `RoleCategory` table.

We use `TINYINT` because the expected number of role categories is relatively small and is not expected to exceed 100.

In SQL Server:

```
TINYINT = 0 to 255
```

Since the expected business domain is well within this range, `TINYINT` is sufficient.

There is no need to use `INT` or `BIGINT` for a value whose expected domain is this small.

Choosing the smallest appropriate data type keeps the schema efficient and avoids allocating a much larger numeric range than the business actually requires.

---

## 2. `RoleCategoryName VARCHAR(30)`

`RoleCategoryName` stores the name of the role category.

For example:

```
Customer / Buyer
Seller / Merchant
Store / Branch
Product / Catalog
Finance
HR
```

We use `VARCHAR(30)` because role-category names are system-defined values and the current business requirements do not expect category names to exceed 30 characters.

The `30` character limit is a business-defined limit.

If the business requirements change in the future and longer category names become necessary, the column size can be increased.

---

## 3. `RoleCategoryStatus VARCHAR(20)`

`RoleCategoryStatus` represents the current state of the role category.

The status allows the system to know whether a category is currently available, restricted, suspended, deleted, or in another defined state.

The status model follows the same general status approach used by the role system.

Current business-defined status values can include:

```
PENDING
ACTIVE
SUSPENDED
DEACTIVATED
DELETED
```

We use `VARCHAR(20)` because role-category statuses are short, system-defined values and do not require Unicode storage.

The `20` character limit provides enough space for the current status values while leaving room for future additions.

> The final allowed values should be enforced later using a `CHECK` constraint or a dedicated reference table.

---

# Design Principles

### 1. Role categories provide classification

`RoleCategory` groups related roles into logical business areas.

### 2. Small numeric domain → small data type

`TINYINT` is sufficient because the expected number of role categories is below 100 and SQL Server `TINYINT` supports values from 0 to 255.

### 3. Category names are business-defined

`VARCHAR(30)` provides a reasonable current limit for system-defined category names.

### 4. Category status is separate from role status

`RoleCategoryStatus` represents the state of the category itself.

A category can therefore have its own lifecycle independent of the individual roles assigned to it.

### 5. Categories prevent repeated classification data

Instead of storing category information repeatedly in every role, the `Roles` table references the category through `RoleCategoryId`.

This keeps the relationship normalized and makes category management easier.

---

# Business Information Table

The `BusinessInformation` table stores business-related information associated with a specific user role.

This is an important table in the system and is expected to grow significantly as more business-related information is introduced in the future.

The table is designed to keep the core business information separate from multi-valued data such as business emails and business phone numbers.

---

# Column Details

## 1. `BusinessInformationId BIGINT`

`BusinessInformationId` is the primary key of the `BusinessInformation` table.

We use `BIGINT` because this table is expected to become a large table containing a potentially very large number of records.

Using `BIGINT` provides a very large identifier range and is appropriate for a high-volume table.

The identifier is a surrogate key used to uniquely identify each business-information record.

---

## 2. `UserRoleId BIGINT`

`UserRoleId` is a foreign key referencing:

```
UserRole.UserRoleId
```

Its purpose is to identify **which user-role owns or is associated with the business information**.

The relationship allows the system to answer questions such as:

> Which user's role does this business information belong to?

We use `BIGINT` because `UserRole.UserRoleId` is also defined as `BIGINT`.

The foreign key data type should match the referenced primary key data type.

This also supports the expected large scale of the `UserRole` table and its associated business-information records.

---

## 3. `OpeningAt TIME`

`OpeningAt` stores the time at which the business starts operating.

We use the SQL Server `TIME` data type because we only need the **time of day**, not a specific date.

For example:

```
09:00:00
```

The date is not part of this attribute because opening hours can apply repeatedly to the business's operating schedule.

---

## 4. `ClosedAt TIME`

`ClosedAt` stores the time at which the business stops operating.

It uses the `TIME` data type for the same reason as `OpeningAt`.

For example:

```
17:00:00
```

Together:

```
OpeningAt = 09:00:00
ClosedAt  = 17:00:00
```

This allows the system to represent the normal operating period of the business.

> If the system later needs different opening and closing times for different days of the week, this should be modeled separately rather than adding more time columns to this table.

---

# Business Information Email

Business emails are intentionally stored in a separate table because email is a **multi-valued attribute**.

A business may have more than one email address.

For example:

```
BusinessInformation
│
├── email1@example.com
├── sales@example.com
└── support@example.com
```

Instead of adding columns such as:

```
Email1
Email2
Email3
```

the system uses a dedicated `BusinessInformationEmail` table.

This provides a normalized and scalable design.

---

## `BusinessInformationId BIGINT`

This is a foreign key referencing:

```
BusinessInformation.BusinessInformationId
```

It identifies which business-information record owns the email address.

The data type is `BIGINT` because the referenced primary key is `BIGINT`.

---

## `Email NVARCHAR(320)`

The business email is stored as `NVARCHAR(320)`.

We use `NVARCHAR` to support Unicode email input.

The system may need to accept internationalized email addresses containing Unicode characters.

The `320` character limit follows the commonly used maximum email-address length.

Example:

```
sales@example.com
```

or an internationalized email address where supported.

> `NVARCHAR(320)` provides storage capacity; it does not by itself validate whether a value is a valid email address. Email validation should be handled by the application and appropriate database constraints.

---

# Business Information Phone

Business phone numbers are also stored separately because they are **multi-valued attributes**.

A business may have multiple phone numbers, such as:

```
Main Office
Sales
Customer Support
WhatsApp
```

Therefore, phone numbers should not be represented using multiple columns inside `BusinessInformation`.

Instead, they are stored in the `BusinessInformationPhone` table.

---

## `BusinessInformationId BIGINT`

This is a foreign key referencing:

```
BusinessInformation.BusinessInformationId
```

It identifies the business-information record associated with the phone number.

The data type is `BIGINT` because the referenced `BusinessInformationId` is `BIGINT`.

---

## `PhoneNumber NVARCHAR(20)`

The phone number is stored as `NVARCHAR(20)`.

A phone number should not be stored using `INT`, `BIGINT`, `NUMERIC`, or another numeric data type because a phone number is an **identifier**, not a mathematical value.

Phone numbers can contain characters such as:

```
+
-
spaces
```

They may also contain leading zeros:

```
01012345678
```

For example:

```
+20 10 1234 5678
```

A numeric data type cannot reliably preserve the complete user-entered representation.

We therefore use:

```
NVARCHAR(20)
```

The `20` character limit provides enough space for a complete phone number, including an international country code and reasonable formatting characters.

> As with user phone numbers, application-level validation should determine which characters and phone-number formats are actually allowed.

---

# Design Principles

### 1. Business information is separated from user-role data

`BusinessInformation` stores business-specific data instead of mixing it directly into `Users` or `UserRole`.

### 2. User roles identify the business context

`UserRoleId` identifies which user-role is associated with the business information.

### 3. Multi-valued attributes are normalized

Business emails and phone numbers are stored in separate tables because a business can have multiple values of each.

This avoids designs such as:

```
Email1
Email2
Email3
```

or:

```
Phone1
Phone2
Phone3
```

and allows the number of emails and phone numbers to grow naturally.

### 4. Phone numbers are stored as text

Phone numbers are identifiers, not numeric values.

`NVARCHAR(20)` preserves values such as:

```
01012345678
+201012345678
+20 10 1234 5678
```

without treating them as mathematical numbers.

### 5. Email addresses support Unicode

`NVARCHAR(320)` provides storage for internationalized email input while leaving actual email validation to the application and database rules.

### 6. Opening and closing times use `TIME`

`OpeningAt` and `ClosedAt` represent times of day, so `TIME` is more appropriate than `DATETIME` or `DATETIME2` when no date is part of the business rule.

>**Final Design**
>
>![001-USER-DOMAIL-FINAL-DESIGN-AND-DATATYPES](/DATA_TYPES/USER-DOMAIN-DATATYPES/001-USER-DOMAIN-DATATYPES.svg)
