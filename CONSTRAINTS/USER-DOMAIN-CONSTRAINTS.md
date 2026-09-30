# Users Table Constraints

## 1. User ID

The `UserId` column has the following constraints:

* **Primary Key**

  ```sql
  CONSTRAINT Users_UserId_PK PRIMARY KEY (UserId)
  ```

  The `PRIMARY KEY` ensures that the `UserId` value is unique and cannot be duplicated.

* **Identity**

  ```sql
  IDENTITY(1,1)
  ```

  The `IDENTITY(1,1)` constraint is used to automatically increment the `UserId` value, so it does not need to be manually entered every time.

---

## 2. Account Status

The `AccountStatus` column:

* Must **not accept `NULL` values**.
* Must only contain one of the predefined account statuses.
* All status values must be stored in **uppercase**.
* Leading and trailing spaces must be removed using the `TRIM` function.

The allowed values are:

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

The constraint is based on:

```sql
CONSTRAINT Users_AccountStatus_Check
CHECK (AcoountStatus = UPPER(TRIM(AccountStatus)) AND 
    AccountStatus IN 
        ('pending', 'blocked', 'deleted', 'underreview',
        'limited', 'suspended', 'active', 'disactive'))
    )
)
```

---

## 3. Deleted At

The `DeletedAt` column:

* Can accept `NULL` values.
* Must not contain a future date.

```sql
CONSTRAINT Users_DeletedAt_Check
CHECK (DeletedAt <= SYSDATETIME())
```

---

## 4. Hash Password

The `HashPassword` column:

* Must not accept `NULL` values.
* Must not have a length of `0`.

```sql
CONSTRAINT Users_HashPassword_Check
CHECK (LEN(HashPassword) > 0)
```

---

## 5. Email

The `Email` column:

* Must not accept `NULL` values.
* Must contain a value.
* Must be unique.

```sql
CONSTRAINT Users_Email_Unique
UNIQUE (Email)
```

---

## 6. Email Verification

The `EmailVerification` column:

* Must not accept `NULL` values.
* Uses the `BIT` data type.
* `0` means **No**.
* `1` means **Yes**.

```sql
EmailVerification BIT NOT NULL DEFAULT 0
```

---

## 7. Recovery Email

The `RecoveryEmail` column:

* Can accept `NULL` values.
* Must be unique when a value exists.

```sql
CONSTRAINT Users_RecoveryEmail_Unique
UNIQUE (RecoveryEmail)
```

---

## 8. Birth Date

The `BirthDate` column has one constraint:

```sql
CONSTRAINT User_BirthDate_Check
CHECK (BirthDate < SYSDATETIME())
```

The `BirthDate` value must not be in the future.

---

## 9. Created At

The `CreatedAt` column:

* Must not accept `NULL` values.
* Uses `SYSDATETIME()` as the default value.
* The default value represents the date and time when the account was created.

```sql
CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
```

---

## 10. Updated At

The `UpdatedAt` column:

* Must not accept `NULL` values.
* Uses `SYSDATETIME()` as the default value.

```sql
UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
```

---

## Users Table

```sql
CREATE TABLE USERS
(
    UserId BIGINT IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    MiddleName NVARCHAR(50) NULL,
    LastName NVARCHAR(50) NULL,
    AccountStatus VARCHAR(20) NOT NULL,
    DeletedAt DATETIME2 NULL,
    HashPassword VARCHAR(255) NOT NULL,
    Email NVARCHAR(320) NOT NULL,
    EmailVerification BIT NOT NULL DEFAULT 0,
    RecoveryEmail NVARCHAR(320) NULL,
    BirthDate DATE NULL,
    Gender VARCHAR(10) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT Users_UserId_PK PRIMARY KEY (UserId),

    CONSTRAINT Users_AccountStatus_Check
    CHECK (AccountStatus= UPPER(TRIM(AccountStatus) AND AccountStatus IN ( 'pending','blocked','deleted','underreview','limited','suspended','activE','disactive')),

    CONSTRAINT Users_DeletedAt_Check
        CHECK (DeletedAt <= SYSDATETIME()),

    CONSTRAINT Users_HashPassword_Check
        CHECK (LEN(HashPassword) > 0),

    CONSTRAINT Users_Email_Unique
        UNIQUE (Email),

    CONSTRAINT Users_RecoveryEmail_Unique
        UNIQUE (RecoveryEmail),

    CONSTRAINT User_BirthDate_Check
        CHECK (BirthDate < SYSDATETIME()),

    CONSTRAINT User_Gender_Check
        CHECK (Gender = UPPER(TRIM(Gender)) AND Gender IN ('male', 'female')))
);
```

---

# UserRole Table Constraints

## 1. UserRole ID

The `UserRoleId` column is the **Primary Key** of the `UserRole` table.

* It must be unique and cannot be duplicated.
* It uses `IDENTITY(1,1)` to automatically generate and increment the value.

```sql
UserRoleId BIGINT IDENTITY(1,1),

CONSTRAINT UserRole_UserRoleId_PK
PRIMARY KEY (UserRoleId)
```

---

## 2. Role ID

The `RoleId` column is a **Foreign Key** referencing the `Role` table.

Its purpose is to ensure that every `UserRole` record has a corresponding role in the `Role` table.

The `UserRole` table acts as a **junction table** between the `Users` and `Role` tables.

The `RoleId` column:

* Must not accept `NULL` values.
* Uses `ON DELETE NO ACTION`.
* Uses `ON UPDATE NO ACTION`.

### Delete Behavior

```sql
ON DELETE NO ACTION
```

`NO ACTION` is used to preserve the historical data.

### Update Behavior

```sql
ON UPDATE NO ACTION
```

`NO ACTION` is used for two reasons:

1. A Primary Key should not normally be updated.
2. No action such as `CASCADE` or `SET NULL` should be performed because the role must remain identifiable, and the source of the role must not become unknown.

```sql
RoleId TINYINT NOT NULL,

CONSTRAINT UserRole_RoleId_FK
FOREIGN KEY (RoleId)
REFERENCES ROLE(RoleId)
ON DELETE NO ACTION
ON UPDATE NO ACTION
```

---

## 3. User ID

The `UserId` column is a **Foreign Key** referencing `Users(UserId)`.

Its purpose is to identify which user the `UserRole` record belongs to.

The `UserId` column:

* Must not accept `NULL` values.
* Uses `ON DELETE NO ACTION`.
* Uses `ON UPDATE NO ACTION`.

### Delete Behavior

```sql
ON DELETE NO ACTION
```

`NO ACTION` is used because deleting the referenced user could affect historical data.

### Update Behavior

```sql
ON UPDATE NO ACTION
```

`NO ACTION` is used because updating or changing the referenced value could affect the historical data.

Since `UserId` is used to identify which user owns the role, it must not become `NULL`.

```sql
UserId BIGINT NOT NULL,

CONSTRAINT UserRole_UserId_FK
FOREIGN KEY (UserId)
REFERENCES USERS(UserId)
ON DELETE NO ACTION
ON UPDATE NO ACTION
```

---

## 4. User Role Status

The `UserRoleStatus` column:

* Must not accept `NULL` values.
* Must contain one of the predefined status values.

The allowed values are:

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

The status values are intended to be stored in uppercase after trimming leading and trailing spaces.

```sql
UserRoleStatus VARCHAR(20) NOT NULL,

CONSTRAINT UserRole_UserRoleStatus_Check
CHECK (
    UserRoleStatus = UPPER(TRIM(AccountStatus))
    AND UserRoleStatus IN (
        'pending',
        'blocked',
        'deleted',
        'underreview',
        'limited',
        'suspended',
        'active',
        'disactive'
    )
)
```

---

## 5. Active Now

The `ActiveNow` column:

* Must not accept `NULL` values.
* Uses the `BIT` data type.
* Its value can only represent:

  * `0` = No
  * `1` = Yes

```sql
ActiveNow BIT NOT NULL
```

---

# UserRole Table

```sql
CREATE TABLE USERROLE
(
    UserRoleId BIGINT IDENTITY(1,1),
    RoleId TINYINT NOT NULL,
    UserId BIGINT NOT NULL,
    UserRoleStatus VARCHAR(20) NOT NULL,
    ActiveNow BIT NOT NULL,

    CONSTRAINT UserRole_UserRoleId_PK PRIMARY KEY (UserRoleId),

    CONSTRAINT UserRole_RoleId_FK FOREIGN KEY (RoleId) REFERENCES ROLE(RoleId)
        ON DELETE NO ACTION ON UPDATE NO ACTION,

    CONSTRAINT UserRole_UserId_FK FOREIGN KEY (UserId) REFERENCES USERS(UserId)
        ON DELETE NO ACTION ON UPDATE NO ACTION,

    CONSTRAINT UserRole_UserRoleStatus_Check
        CHECK (UserRoleStatus = UPPER(TRIM(UserRoleStatus)) AND UserRoleStatus               IN('pending','blocked','deleted','underreview','limited','suspended','active','disactive')));
```
---

# RoleCategory Table Constraints

## 1. Role Category ID

The `RoleCategoryId` column is the **Primary Key** of the `RoleCategory` table.

* It uses the `TINYINT` data type.
* It must not accept `NULL` values.
* It uses `IDENTITY(1,1)` to automatically generate and increment the value.

```sql
RoleCategoryId TINYINT IDENTITY(1,1),

CONSTRAINT RoleCategory_RoleCategoryId_PK
PRIMARY KEY (RoleCategoryId)
```

---

## 2. Role Category Name

The `RoleCategoryName` column:

* Represents the name of the role category.
* Must not accept `NULL` values.
* Must contain one of the predefined role categories.
* The value must be stored in **uppercase**.
* Leading and trailing spaces must be removed using the `TRIM` function.

The allowed values are:

* `CUSTOMER`
* `SELLER`
* `STORE OPERATION`
* `CATELOGE PRODUCT`
* `ORDER-FULFILLMENT`
* `WAREHOUSE INVENTORY`
* `CUSTOMER SERVICES`
* `MODERATION`
* `FINANCE HR`
* `PLATFORM ADMIN`

```sql
RoleCategoryName VARCHAR(30) NOT NULL,

CONSTRAINT RoleCategory_RoleCategoryName_Check
CHECK (
    RoleCategoryName = UPPER(TRIM(RoleCategoryName))
    AND RoleCategoryName IN (
        'CUSTOMER',
        'SELLER',
        'STORE OPERATION',
        'CATELOGE PRODUCT',
        'ORDER-FULFILLMENT',
        'WAREHOUSE INVENTORY',
        'CUSTOMER SERVICES',
        'MODERATION',
        'FINANCE HR',
        'PLATFORM ADMIN'
    )
)
```

---

## 3. Role Category Status

The `RoleCategoryStatus` column:

* Must not accept `NULL` values.
* Must contain one of the predefined status values.
* The value must be stored in **uppercase**.
* Leading and trailing spaces must be removed using the `TRIM` function.

The allowed values are:

* `PENDING`
* `ACTIVE`
* `SUSPENDED`
* `DEACTIVATED`
* `DELETED`

```sql
RoleCategoryStatus VARCHAR(20) NOT NULL,

CONSTRAINT RoleCategory_RoleCategoryStatus_Check
CHECK (
    RoleCategoryStatus = UPPER(TRIM(RoleCategoryStatus))
    AND RoleCategoryStatus IN (
        'PENDING',
        'ACTIVE',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED'
    )
)
```

---

# RoleCategory Table

```sql
CREATE TABLE ROLECATEGORY
(
    RoleCategoryId TINYINT IDENTITY(1,1),
    RoleCategoryName VARCHAR(30) NOT NULL,
    RoleCategoryStatus VARCHAR(20) NOT NULL,

    CONSTRAINT RoleCategory_RoleCategoryId_PK
        PRIMARY KEY (RoleCategoryId),

    CONSTRAINT RoleCategory_RoleCategoryName_Check
        CHECK (
            RoleCategoryName = UPPER(TRIM(RoleCategoryName))
            AND RoleCategoryName IN (
                'CUSTOMER',
                'SELLER',
                'STORE OPERATION',
                'CATELOGE PRODUCT',
                'ORDER-FULFILLMENT',
                'WAREHOUSE INVENTORY',
                'CUSTOMER SERVICES',
                'MODERATION',
                'FINANCE HR',
                'PLATFORM ADMIN'
            )
        ),

    CONSTRAINT RoleCategory_RoleCategoryStatus_Check
        CHECK (
            RoleCategoryStatus = UPPER(TRIM(RoleCategoryStatus))
            AND RoleCategoryStatus IN (
                'PENDING',
                'ACTIVE',
                'SUSPENDED',
                'DEACTIVATED',
                'DELETED'
            )
        )
);
```
---

# Role Table Constraints

## 1. Role ID

The `RoleId` column is the **Primary Key** of the `Role` table.

* It uses the `TINYINT` data type.
* It must not accept `NULL` values.
* It uses `IDENTITY(1,1)` to automatically generate and increment the value.
* The value does not need to be manually entered.

```sql
RoleId TINYINT IDENTITY(1,1) NOT NULL,

CONSTRAINT Role_RoleId_PK
    PRIMARY KEY (RoleId)
```

---

## 2. Role Category ID

The `RoleCategoryId` column:

* Uses the `TINYINT` data type.
* Is a **Foreign Key** referencing `RoleCategory(RoleCategoryId)`.
* Must not accept `NULL` values.
* Uses `ON DELETE NO ACTION`.
* Uses `ON UPDATE NO ACTION`.

`NO ACTION` is used because the referenced Primary Key should not be changed, and changes to the referenced role category should not automatically affect the role.

```sql
RoleCategoryId TINYINT NOT NULL,

CONSTRAINT Role_RoleCategoryId_FK
    FOREIGN KEY (RoleCategoryId)
    REFERENCES ROLECATEGORY(RoleCategoryId)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
```

---

## 3. Role Name

The `RoleName` column:

* Must not accept `NULL` values.
* Must contain one of the predefined role names.
* The value must be stored in **uppercase**.
* Leading and trailing spaces must be removed using the `TRIM` function.

### Customer / Buyer

| # | Role                     | Meaning                                                                                                             |
| - | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 1 | `CUSTOMER`               | The standard customer who purchases products and uses the platform's services.                                      |
| 2 | `BUSINESS CUSTOMER`      | A customer account associated with a company or organization rather than a standard individual customer.            |
| 3 | `BUSINESS ACCOUNT ADMIN` | The administrator responsible for managing the business account, including its users and business-related settings. |
| 4 | `BUSINESS BUYER`         | An employee who makes purchases on behalf of a company or organization.                                             |
| 5 | `BUSINESS APPROVER`      | An employee responsible for approving purchase operations that require approval within a business account.          |

### Seller / Merchant

| #  | Role                         | Meaning                                                                                                                      |
| -- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 6  | `SELLER OWNER`               | The owner of a seller account and the highest-level administrator within the seller account.                                 |
| 7  | `SELLER ADMIN`               | The administrator responsible for seller account users, settings, and day-to-day administration.                             |
| 8  | `SELLER OPERATIONS MANAGER`  | Manages the seller's daily operations, including orders, inventory, fulfillment, and operational issues.                     |
| 9  | `SELLER CATALOG MANAGER`     | Responsible for managing the seller's products, listings, and catalog.                                                       |
| 10 | `SELLER INVENTORY MANAGER`   | Responsible for inventory quantities, inventory movement, and restocking operations.                                         |
| 11 | `SELLER ORDER MANAGER`       | Responsible for managing the order lifecycle from receiving orders through processing and completion.                        |
| 12 | `SELLER FULFILLMENT MANAGER` | Responsible for order fulfillment, preparation, and handoff to shipping operations.                                          |
| 13 | `SELLER CUSTOMER SERVICE`    | Responsible for seller-side customer service, including customer questions, complaints, and order-related issues.            |
| 14 | `SELLER FINANCE MANAGER`     | Responsible for seller financial operations such as payments, settlements, and financial reporting.                          |
| 15 | `SELLER MARKETING MANAGER`   | Responsible for advertisements, campaigns, promotions, coupons, and seller product marketing.                                |
| 16 | `SELLER COMPLIANCE MANAGER`  | Responsible for ensuring that the seller follows platform policies, regulatory requirements, and documentation requirements. |
| 17 | `SELLER ANALYST`             | Responsible for analyzing seller sales, performance, inventory, and operational data and generating reports.                 |

### Store / Branch

| #  | Role               | Meaning                                                                                                     |
| -- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| 18 | `STORE MANAGER`    | The primary manager of a specific store, responsible for employees, sales, inventory, and store operations. |
| 19 | `STORE SUPERVISOR` | Supervises employees and daily operations within a store and operates under the Store Manager.              |
| 20 | `STORE EMPLOYEE`   | A standard store employee who performs the tasks permitted by their assigned permissions.                   |
| 21 | `STORE CASHIER`    | Responsible for payment processing, collection, and store-related invoicing operations.                     |
| 22 | `BRANCH MANAGER`   | Responsible for an entire branch. A branch may contain one or more stores depending on the system design.   |
| 23 | `REGIONAL MANAGER` | Responsible for a group of branches or stores located within a specific geographic region.                  |

### Product / Catalog

| #  | Role               | Meaning                                                                                                                       |
| -- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| 24 | `CATALOG ADMIN`    | An administrator responsible for the overall catalog system, including product structures, classifications, and catalog data. |
| 25 | `CATALOG EDITOR`   | Responsible for adding and modifying product and catalog information without having full administrative privileges.           |
| 26 | `CATALOG REVIEWER` | Reviews catalog additions and modifications before they are approved or published.                                            |
| 27 | `CATEGORY MANAGER` | Responsible for managing product categories and the overall category structure.                                               |
| 28 | `BRAND MANAGER`    | Responsible for managing brands and related brand information within the platform.                                            |
| 29 | `PRODUCT MANAGER`  | Responsible for managing the product lifecycle and core product information.                                                  |
| 30 | `PRODUCT REVIEWER` | Reviews products and related information to ensure accuracy before approval.                                                  |

### Orders / Fulfillment

| #  | Role                  | Meaning                                                                                          |
| -- | --------------------- | ------------------------------------------------------------------------------------------------ |
| 31 | `ORDER MANAGER`       | Responsible for managing the order lifecycle and handling order-related issues and exceptions.   |
| 32 | `ORDER PROCESSOR`     | Performs daily order operations such as processing, updating, and preparing orders.              |
| 33 | `FULFILLMENT MANAGER` | Responsible for the overall order fulfillment process.                                           |
| 34 | `SHIPPING MANAGER`    | Responsible for shipping operations, shipping providers, shipment tracking, and delivery issues. |
| 35 | `RETURNS MANAGER`     | Responsible for managing, reviewing, and processing product returns.                             |
| 36 | `REFUND MANAGER`      | Responsible for refund operations and amounts returned to customers.                             |

### Warehouse / Inventory

| #  | Role                   | Meaning                                                                                                                              |
| -- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 37 | `WAREHOUSE MANAGER`    | The primary manager of a specific warehouse and its receiving, storage, preparation, and shipping operations.                        |
| 38 | `WAREHOUSE SUPERVISOR` | Supervises warehouse employees and daily warehouse operations.                                                                       |
| 39 | `WAREHOUSE EMPLOYEE`   | Performs warehouse operations such as picking, packing, and receiving.                                                               |
| 40 | `INVENTORY MANAGER`    | Responsible for inventory management at the system level or across a group of warehouses or stores, depending on the assigned scope. |
| 41 | `INVENTORY AUDITOR`    | Reviews inventory and compares physical quantities with recorded quantities to identify discrepancies.                               |

### Customer Service / Communication

| #  | Role                       | Meaning                                                                                                  |
| -- | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| 42 | `CUSTOMER SERVICE MANAGER` | Manages the customer service team and oversees tickets, complaints, and escalations.                     |
| 43 | `CUSTOMER SERVICE AGENT`   | A customer service employee who directly handles customers, orders, and customer issues.                 |
| 44 | `CONTACT ADMIN`            | Responsible for the contact center system, its configuration, and contact center employees.              |
| 45 | `CONTACT AGENT`            | Handles customer communication through channels such as Chat, Email, or Phone.                           |
| 46 | `COMPLAINT MANAGER`        | Responsible for managing complaints, tracking them, handling escalations, and resolving complaint cases. |
| 47 | `DISPUTE MANAGER`          | Responsible for managing disputes between parties, such as disputes between customers and sellers.       |

### Reviews / Moderation

| #  | Role                | Meaning                                                                                                          |
| -- | ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 48 | `REVIEW ADMIN`      | An administrator responsible for the Review system and its configuration.                                        |
| 49 | `REVIEW MODERATOR`  | Reviews user-generated reviews and handles content that violates platform policies.                              |
| 50 | `CONTENT MODERATOR` | Responsible for broader content moderation, including text, images, product content, and user-generated content. |

### Finance

| #  | Role                         | Meaning                                                                                         |
| -- | ---------------------------- | ----------------------------------------------------------------------------------------------- |
| 51 | `FINANCE MANAGER`            | Responsible for financial operations, financial reporting, settlements, and financial accounts. |
| 52 | `ACCOUNTANT`                 | Handles accounting operations, financial records, invoices, and settlements.                    |
| 53 | `BILLING MANAGER`            | Responsible for billing, invoices, fees, and outstanding amounts.                               |
| 54 | `PAYMENT OPERATIONS MANAGER` | Responsible for payment processing, collections, payouts, and operational payment issues.       |
| 55 | `TAX MANAGER`                | Responsible for tax operations, tax rules, tax reporting, and tax compliance.                   |

### HR

| #  | Role         | Meaning                                                                                                              |
| -- | ------------ | -------------------------------------------------------------------------------------------------------------------- |
| 56 | `HR MANAGER` | Responsible for employee management, HR operations, organizational structure, recruitment, and internal policies.    |
| 57 | `HR STAFF`   | HR employee responsible for daily operations such as employee data, leave management, attendance, and documentation. |

### IT / Security / Platform

| #  | Role             | Meaning                                                                                                          |
| -- | ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| 58 | `IT SUPPORT`     | Responsible for assisting employees and internal users with technical issues and technical support.              |
| 59 | `SYSTEM ADMIN`   | Responsible for system administration, internal infrastructure, system settings, users, and technical services.  |
| 60 | `SECURITY ADMIN` | Responsible for security operations, permissions, security policies, audit logs, and monitoring security events. |

```sql
RoleName VARCHAR(30) NOT NULL,

CONSTRAINT Role_RoleName_Check
CHECK (
    RoleName = UPPER(TRIM(RoleName))
    AND RoleName IN (
        'CUSTOMER',
        'BUSINESS CUSTOMER',
        'BUSINESS ACCOUNT ADMIN',
        'BUSINESS BUYER',
        'BUSINESS APPROVER',
        'SELLER OWNER',
        'SELLER ADMIN',
        'SELLER OPERATIONS MANAGER',
        'SELLER CATALOG MANAGER',
        'SELLER INVENTORY MANAGER',
        'SELLER ORDER MANAGER',
        'SELLER FULFILLMENT MANAGER',
        'SELLER CUSTOMER SERVICE',
        'SELLER FINANCE MANAGER',
        'SELLER MARKETING MANAGER',
        'SELLER COMPLIANCE MANAGER',
        'SELLER ANALYST',
        'STORE MANAGER',
        'STORE SUPERVISOR',
        'STORE EMPLOYEE',
        'STORE CASHIER',
        'BRANCH MANAGER',
        'REGIONAL MANAGER',
        'CATALOG ADMIN',
        'CATALOG EDITOR',
        'CATALOG REVIEWER',
        'CATEGORY MANAGER',
        'BRAND MANAGER',
        'PRODUCT MANAGER',
        'PRODUCT REVIEWER',
        'ORDER MANAGER',
        'ORDER PROCESSOR',
        'FULFILLMENT MANAGER',
        'SHIPPING MANAGER',
        'RETURNS MANAGER',
        'REFUND MANAGER',
        'WAREHOUSE MANAGER',
        'WAREHOUSE SUPERVISOR',
        'WAREHOUSE EMPLOYEE',
        'INVENTORY MANAGER',
        'INVENTORY AUDITOR',
        'CUSTOMER SERVICE MANAGER',
        'CUSTOMER SERVICE AGENT',
        'CONTACT ADMIN',
        'CONTACT AGENT',
        'COMPLAINT MANAGER',
        'DISPUTE MANAGER',
        'REVIEW ADMIN',
        'REVIEW MODERATOR',
        'CONTENT MODERATOR',
        'FINANCE MANAGER',
        'ACCOUNTANT',
        'BILLING MANAGER',
        'PAYMENT OPERATIONS MANAGER',
        'TAX MANAGER',
        'HR MANAGER',
        'HR STAFF',
        'IT SUPPORT',
        'SYSTEM ADMIN',
        'SECURITY ADMIN'
    )
)
```

---

## 4. Role Status

The `RoleStatus` column:

* Must not accept `NULL` values.
* Must contain one of the predefined status values.
* The value must be stored in **uppercase**.
* Leading and trailing spaces must be removed using the `TRIM` function.

The allowed values are:

| Status        | Meaning                                                                        |
| ------------- | ------------------------------------------------------------------------------ |
| `PENDING`     | The role has been created and is waiting for activation or further processing. |
| `UNDERREVIEW` | The role is currently under review.                                            |
| `ACTIVE`      | The role is currently available for assignment and use.                        |
| `LIMITED`     | The role is available but has certain restrictions.                            |
| `SUSPENDED`   | The role is temporarily suspended.                                             |
| `DEACTIVATED` | The role has been deactivated and is no longer available for normal use.       |
| `DELETED`     | The role has been logically deleted.                                           |
| `BLOCKED`     | The role has been blocked.                                                     |

```sql
RoleStatus VARCHAR(20) NOT NULL,

CONSTRAINT Role_RoleStatus_Check
CHECK (
    RoleStatus = UPPER(TRIM(RoleStatus))
    AND RoleStatus IN (
        'PENDING',
        'UNDERREVIEW',
        'ACTIVE',
        'LIMITED',
        'SUSPENDED',
        'DEACTIVATED',
        'DELETED',
        'BLOCKED'
    )
)
```

---

# Role Table

```sql
CREATE TABLE ROLE
(
    RoleId TINYINT IDENTITY(1,1) NOT NULL,
    RoleCategoryId TINYINT NOT NULL,
    RoleName VARCHAR(30) NOT NULL,
    RoleStatus VARCHAR(20) NOT NULL,

    CONSTRAINT Role_RoleId_PK
        PRIMARY KEY (RoleId),

    CONSTRAINT Role_RoleCategoryId_FK
        FOREIGN KEY (RoleCategoryId)
        REFERENCES ROLECATEGORY(RoleCategoryId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT Role_RoleName_Check
        CHECK (
            RoleName = UPPER(TRIM(RoleName))
            AND RoleName IN (
                'CUSTOMER',
                'BUSINESS CUSTOMER',
                'BUSINESS ACCOUNT ADMIN',
                'BUSINESS BUYER',
                'BUSINESS APPROVER',
                'SELLER OWNER',
                'SELLER ADMIN',
                'SELLER OPERATIONS MANAGER',
                'SELLER CATALOG MANAGER',
                'SELLER INVENTORY MANAGER',
                'SELLER ORDER MANAGER',
                'SELLER FULFILLMENT MANAGER',
                'SELLER CUSTOMER SERVICE',
                'SELLER FINANCE MANAGER',
                'SELLER MARKETING MANAGER',
                'SELLER COMPLIANCE MANAGER',
                'SELLER ANALYST',
                'STORE MANAGER',
                'STORE SUPERVISOR',
                'STORE EMPLOYEE',
                'STORE CASHIER',
                'BRANCH MANAGER',
                'REGIONAL MANAGER',
                'CATALOG ADMIN',
                'CATALOG EDITOR',
                'CATALOG REVIEWER',
                'CATEGORY MANAGER',
                'BRAND MANAGER',
                'PRODUCT MANAGER',
                'PRODUCT REVIEWER',
                'ORDER MANAGER',
                'ORDER PROCESSOR',
                'FULFILLMENT MANAGER',
                'SHIPPING MANAGER',
                'RETURNS MANAGER',
                'REFUND MANAGER',
                'WAREHOUSE MANAGER',
                'WAREHOUSE SUPERVISOR',
                'WAREHOUSE EMPLOYEE',
                'INVENTORY MANAGER',
                'INVENTORY AUDITOR',
                'CUSTOMER SERVICE MANAGER',
                'CUSTOMER SERVICE AGENT',
                'CONTACT ADMIN',
                'CONTACT AGENT',
                'COMPLAINT MANAGER',
                'DISPUTE MANAGER',
                'REVIEW ADMIN',
                'REVIEW MODERATOR',
                'CONTENT MODERATOR',
                'FINANCE MANAGER',
                'ACCOUNTANT',
                'BILLING MANAGER',
                'PAYMENT OPERATIONS MANAGER',
                'TAX MANAGER',
                'HR MANAGER',
                'HR STAFF',
                'IT SUPPORT',
                'SYSTEM ADMIN',
                'SECURITY ADMIN'
            )
        ),

    CONSTRAINT Role_RoleStatus_Check
        CHECK (
            RoleStatus = UPPER(TRIM(RoleStatus))
            AND RoleStatus IN (
                'PENDING',
                'UNDERREVIEW',
                'ACTIVE',
                'LIMITED',
                'SUSPENDED',
                'DEACTIVATED',
                'DELETED',
                'BLOCKED'
            )
        )
);
```
---

# User Phone Number Table Constraints

## 1. User ID

The `UserId` column:

* Must not accept `NULL` values.
* Is a **Foreign Key** referencing the `Users(UserId)` table.
* Is part of the **Composite Primary Key** together with `PhoneNumber`.
* Uses `ON DELETE NO ACTION`.
* Uses `ON UPDATE NO ACTION`.

### Delete Behavior

```sql
ON DELETE NO ACTION
```

`NO ACTION` is used because a user with associated phone numbers should not be deleted directly.

If the user needs to be deleted, the associated phone numbers must be deleted first, provided that there are no other constraints preventing the user from being deleted.

### Update Behavior

```sql
ON UPDATE NO ACTION
```

`NO ACTION` is used to prevent changes to the referenced `UserId`.

```sql
UserId BIGINT NOT NULL,

CONSTRAINT User_PhoneNumber_UserId_FK
    FOREIGN KEY (UserId)
    REFERENCES USERS(UserId)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
```

---

## 2. Phone Number

The `PhoneNumber` column:

* Must not accept `NULL` values.
* Is part of the **Composite Primary Key** together with `UserId`.
* Must start with the `+` operator.

### Composite Primary Key

```sql
CONSTRAINT User_PhoneNumber_UserId_PhoneNumber_PK
PRIMARY KEY (UserId, PhoneNumber)
```

### Phone Number Format

The phone number must start with the `+` operator.

```sql
CONSTRAINT User_PhoneNumber_PhoneNumber_Check
CHECK (PhoneNumber LIKE '+%')
```

---

## 3. Phone Verification

The `PhoneVerification` column:

* Must not accept `NULL` values.
* Uses the `BIT` data type.
* `0` represents **No**.
* `1` represents **Yes**.

```sql
PhoneVerification BIT NOT NULL
```

---

## 4. Phone Status

The `PhoneStatus` column:

* Must not accept `NULL` values.
* Must contain one of the predefined status values.
* The value must be stored in **uppercase**.
* Leading and trailing spaces must be removed using the `TRIM` function.

The allowed values are:

| Status      | Meaning                                           |
| ----------- | ------------------------------------------------- |
| `PENDING`   | The phone number is currently under review.       |
| `REVIEWED`  | The phone number has been reviewed.               |
| `APPROVED`  | The phone number has been accepted.               |
| `REJECTED`  | The phone number was not accepted.                |
| `SUSPENDED` | The phone number is temporarily stopped/inactive. |
| `BLOCKED`   | The phone number has been blocked.                |
| `DELETED`   | The phone number has been deleted.                |

```sql
CONSTRAINT User_PhoneNumber_PhoneStatus_Check
CHECK (
    PhoneStatus = UPPER(TRIM(PhoneStatus))
    AND PhoneStatus IN (
        'PENDING',
        'REVIEWED',
        'APPROVED',
        'REJECTED',
        'SUSPENDED',
        'BLOCKED',
        'DELETED'
    )
)
```

---

# User-PhoneNumber Table

```sql
CREATE TABLE USER_PHONENUMBER
(
    UserId BIGINT NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    PhoneVerification BIT NOT NULL,
    PhoneStatus VARCHAR(20) NOT NULL,

    CONSTRAINT User_PhoneNumber_UserId_PhoneNumber_PK
        PRIMARY KEY (UserId, PhoneNumber),

    CONSTRAINT User_PhoneNumber_UserId_FK
        FOREIGN KEY (UserId)
        REFERENCES USERS(UserId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT User_PhoneNumber_PhoneNumber_Check
        CHECK (PhoneNumber LIKE '+%'),

    CONSTRAINT User_PhoneNumber_PhoneStatus_Check
        CHECK (
            PhoneStatus = UPPER(TRIM(PhoneStatus))
            AND PhoneStatus IN (
                'PENDING',
                'REVIEWED',
                'APPROVED',
                'REJECTED',
                'SUSPENDED',
                'BLOCKED',
                'DELETED'
            )
        )
);
```
---
# BUSINESS INFORMATION

The `BUSINESSINFORMATION` section stores the main business information associated with a specific `UserRole`.

## General Constraints

* `BusinessInformationId` is the **Primary Key (PK)**.
* `BusinessInformationId` is `BIGINT IDENTITY(1,1)`, so it is automatically generated and incremented.
* `UserRoleId` is **NOT NULL** and is a **Foreign Key (FK)** referencing `USERROLE(UserRoleId)`.
* The relationship between `BUSINESSINFORMATION` and `USERROLE` uses:

  * `ON DELETE NO ACTION`
  * `ON UPDATE NO ACTION`
* `OpeningHours` is `TIME NOT NULL`.
* `CLOSEINGHOURE` is `TIME NOT NULL`.

## BUSINESSINFORMATION

```sql
CREATE TABLE BUSINESSINFORMATION
(
    BusinessInformationId BIGINT IDENTITY(1,1),
    UserRoleId BIGINT NOT NULL,
    OpeningHours TIME NOT NULL,
    CLOSEINGHOURE TIME NOT NULL,

    CONSTRAINT BusinessInformation_BusinessInformationId_PK
        PRIMARY KEY (BusinessInformationId),

    CONSTRAINT BusinessInformation_UserRoleId_FK
        FOREIGN KEY (UserRoleId)
        REFERENCES USERROLE(UserRoleId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);
```

---

# BUSINESSINFORMATIONEMAIL

This table stores email addresses associated with a specific business information record.

## Constraints

* `BusinessInformationId` is `BIGINT NOT NULL` and is part of the **Composite Primary Key**.
* `Email` is `NVARCHAR(320) NOT NULL` and is part of the **Composite Primary Key**.
* The composite primary key is:

  * `(BusinessInformationId, Email)`
* `BusinessInformationId` is a **Foreign Key** referencing `BUSINESSINFORMATION(BusinessInformationId)`.
* The relationship uses:

  * `ON DELETE NO ACTION`
  * `ON UPDATE NO ACTION`
* `Email` is **UNIQUE**, meaning the same email address cannot be stored more than once in this table.

## BUSINESSINFORMATIONEMAIL

```sql
CREATE TABLE BUSINESSINFORMATIONEMAIL
(
    BusinessInformationId BIGINT NOT NULL,
    Email NVARCHAR(320) NOT NULL,

    CONSTRAINT BusinessInformationEmail_Email_BusinessInformationId_PK
        PRIMARY KEY (BusinessInformationId, Email),

    CONSTRAINT BusinessInformationEmail_BusinessInformationId_FK
        FOREIGN KEY (BusinessInformationId)
        REFERENCES BUSINESSINFORMATION(BusinessInformationId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT BusinessInformation_Email_Unique
        UNIQUE (Email)
);
```

---

# BUSINESSINFORMATIONPHONENUMBER

This table stores phone numbers associated with a specific business information record.

## Constraints

* `BusinessInformationId` is `BIGINT NOT NULL` and is part of the **Composite Primary Key**.
* `PhoneNumber` is `NVARCHAR(20) NOT NULL` and is part of the **Composite Primary Key**.
* The composite primary key is:

  * `(BusinessInformationId, PhoneNumber)`
* `BusinessInformationId` is a **Foreign Key** referencing `BUSINESSINFORMATION(BusinessInformationId)`.
* The relationship uses:

  * `ON DELETE NO ACTION`
  * `ON UPDATE NO ACTION`
* `PhoneNumber` is **UNIQUE**, meaning the same phone number cannot be stored more than once in this table.
* `PhoneNumber` must start with the `+` symbol.

## BUSINESSINFORMATIONPHONENUMBER

```sql
CREATE TABLE BUSINESSINFORMATIONPHONENUMBER
(
    BusinessInformationId BIGINT NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,

    CONSTRAINT BusinessInformationPhoneNumber_BusinessInformationId_PhoneNumber_PK
        PRIMARY KEY (BusinessInformationId, PhoneNumber),

    CONSTRAINT BusinessInformationPhoneNumber_BusinessInformationId_FK
        FOREIGN KEY (BusinessInformationId)
        REFERENCES BUSINESSINFORMATION(BusinessInformationId)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT BusinessInformation_PhoneNumber_Unique
        UNIQUE (PhoneNumber),

    CONSTRAINT BusinessInformation_PhoneNumber_Check
        CHECK (PhoneNumber LIKE '+%')
);
```
