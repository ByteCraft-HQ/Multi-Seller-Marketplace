# User Domain — Table 1: Users

## 1. Super Keys

The following attributes are considered Super Keys:

- `UserID`
- `Email`
- `PhoneNumber` (assuming it is unique and each user has exactly one phone number in this table)

A Super Key is an attribute or combination of attributes that uniquely identifies a record. It may contain unnecessary attributes.

## 2. Candidate Keys

The Candidate Keys are:

- `UserID`
- `Email`
- `PhoneNumber` (if it satisfies the uniqueness and non-null requirements)

Each Candidate Key uniquely identifies a user independently and contains no unnecessary attributes.

A Candidate Key is a minimal Super Key.

## 3. Primary Key (PK)

**Selected Primary Key: `UserID`**

`UserID` is selected as the Primary Key because:

- It is unique for every user.
- It is stable and should not change over time.
- It is simple and independent of personal information.
- It provides a consistent identifier for the user within the system.

## 4. Surrogate Key

`UserID` is a Surrogate Key because it is an artificial identifier created specifically for the database rather than derived from real-world information.

It can be represented by a numeric identifier or a UUID.

## 5. Natural Key

`Email` and `PhoneNumber` can be considered Natural Keys when they are used as real-world identifiers and satisfy the required uniqueness constraints.

However, both may change over time, which makes them less suitable as permanent identifiers.

## 6. Alternate Keys

`Email` is an Alternate Key because it is a Candidate Key that was not selected as the Primary Key.

`PhoneNumber` can also be an Alternate Key if it qualifies as a Candidate Key under the table's constraints.

## 7. Why Email Is Not Selected as the Primary Key

Although `Email` can technically serve as a Primary Key if it is unique and non-null, `UserID` is preferred because:

- Email addresses can change over time.
- Changes to a Primary Key can affect tables that reference it through Foreign Keys.
- Email addresses are generally longer than compact numeric identifiers, potentially increasing index storage costs.
- A system-generated identifier separates the user's internal identity from changeable contact information.

Using email as a Primary Key does not automatically make database operations inefficient. Performance depends on indexing, query design, data volume, and the database engine.

## 8. Why PhoneNumber Is Not Selected as the Primary Key

`PhoneNumber` may change over time and may not always be a permanent identifier for a user.

Even if it is unique, uniqueness alone does not make it the best Primary Key. `UserID` provides a more stable and independent identifier.

## 9. Foreign Key (FK)

Foreign Keys will be identified when defining the relationships between the tables in the User Domain.

A Foreign Key references a key in another table, or a suitable key in the same table, to maintain referential integrity.

## 10. Final Key Classification

| Attribute | Classification |
|---|---|
| `UserID` | Primary Key, Candidate Key, Surrogate Key |
| `Email` | Candidate Key, Alternate Key, Natural Key |
| `PhoneNumber` | Potential Candidate Key, Alternate Key, Natural Key, subject to the table's constraints |

**Final Decision:** `UserID` is selected as the Primary Key because it is a stable, simple, system-generated identifier. `Email` is retained as an Alternate Key, while `PhoneNumber` is classified according to its uniqueness and the constraints of the table.