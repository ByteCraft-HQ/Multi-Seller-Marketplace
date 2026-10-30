# Basic Keys for the Initial 1NF Stage

## 1. Purpose of Basic Keys

At this stage, we will use **Basic Keys** as temporary identifiers for the entities in our domain. These keys are intended to help us organize the tables and handle multivalued attributes while working toward First Normal Form (1NF).

**Important:** These are not the final primary keys of the database. They are temporary identifiers that may change once we analyze the functional dependencies and finalize the data model.

Our current approach is to establish 1NF before analyzing functional dependencies. Therefore, we need simple, unique identifiers to reference records and organize the data during this initial stage.

## 2. Basic Keys for Each Table

### 2.1. User Table

- **Basic Key:** `UserEmail`

We will temporarily use `UserEmail` as the basic identifier for the `User` table because it is expected to be unique for each user and can identify an individual record.

### 2.2. Roles Table

- **Basic Key:** `RoleName`

We will temporarily use `RoleName` as the basic identifier for the `Roles` table, assuming that each role has a unique name.

### 2.3. RoleCategory Table

- **Basic Key:** `RoleCategoryName`

We will temporarily use `RoleCategoryName` as the basic identifier for the `RoleCategory` table, assuming that each category name uniquely identifies a category.

### 2.4. BusinessInformation Table

- **Basic Key:** `BusinessInformationNationalId`

We will temporarily use `BusinessInformationNationalId` as the basic identifier for the `BusinessInformation` table, assuming that each national ID uniquely identifies a business information record.

## 3. Why Are We Using Basic Keys?

The main reason for introducing these keys is to maintain a clear structure while handling multivalued attributes during the initial normalization stage.

Since our current workflow prioritizes 1NF before functional dependency analysis, we need identifiers that allow us to reference the original records when separating multivalued attributes into different tables.

These basic keys help us:

- Identify records during the initial design stage.
- Maintain references between tables when separating multivalued attributes.
- Organize the schema before determining the final keys.
- Make it easier to revise the model as we proceed with normalization.

## 4. Why Did We Choose These Specific Attributes?

We selected these attributes because they are expected to be unique within their respective tables and can therefore serve as temporary record identifiers.

However, **uniqueness at this stage does not automatically make an attribute the final primary key**. Each attribute must be validated against the actual business rules and data constraints.

For example, `UserEmail` may be unique under the current requirements, but we may later decide to introduce a surrogate key such as `UserID`.

The same principle applies to the other tables.

## 5. Relationship Between Basic Keys and Functional Dependencies

Once we complete the initial 1NF stage, we will analyze the functional dependencies within each table.

This analysis will help us determine:

- The actual candidate keys.
- The appropriate primary key for each table.
- Whether any attributes should be replaced by surrogate keys.
- Whether additional decomposition is required to achieve higher normal forms.

The final key design must be based on the functional dependencies, candidate keys, and business rules rather than on our initial assumptions alone.

It is also important to note that functional dependencies do not necessarily produce a new key in every case. They help us identify the candidate keys and understand the relationships between attributes.

## 6. Can Basic Keys Change Later?

**Yes. These keys are temporary and can be changed.**

For example, we may replace a natural key such as `UserEmail` with a surrogate key such as `UserID` after completing the analysis.

This is an expected part of the design process. The purpose of the current keys is to support the initial table structure, not to lock us into a final database design.

We will finalize the keys only after reviewing the functional dependencies and validating the complete domain model.

## 7. Final Clarification

To avoid any misunderstanding, the attributes listed above are **Basic Keys for the initial 1NF stage, not the confirmed final primary keys**.

We are using them because they are expected to be unique and can temporarily identify records while we organize the tables and handle multivalued attributes.

After completing 1NF, we will analyze the functional dependencies and determine the appropriate candidate keys and final primary keys. If necessary, we will introduce surrogate keys or revise the existing identifiers.

**The objective is to establish a workable initial structure without making premature decisions about the final key design.**