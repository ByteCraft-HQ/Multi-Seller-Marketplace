# Edge Case EC-BI-001: Country Separation into a Reference Table

**Status:** Accepted — Separate `COUNTRIES` Table

## 1. Problem

Storing country names directly in `BUSINESS_INFORMATION` may lead to inconsistent values representing the same country.

Examples:
- Egypt
- EGYPT
- Arab Republic of Egypt

This inconsistency can affect data consistency and composite uniqueness constraints.

## 2. Accepted Decision

Create a separate table named `COUNTRIES` to store country information.

`BUSINESS_INFORMATION` will reference the country through a Foreign Key instead of storing the country name directly.

## 3. Proposed COUNTRIES Table

| Attribute | Description |
|---|---|
| `CountryCode` | ISO 3166-1 Alpha-2 country code; Primary Key |
| `CountryName` | Official country name; NOT NULL |

Example records:

| CountryCode | CountryName |
|---|---|
| EG | Egypt |
| SA | Saudi Arabia |
| AE | United Arab Emirates |

## 4. BUSINESS_INFORMATION Changes

Replace:

`BusinessInformationBusinessCountry`

With:

`CountryCode`

The new attribute will be:

- `CHAR(2)`
- `NOT NULL`
- Foreign Key referencing `COUNTRIES(CountryCode)`

## 5. Updated Uniqueness Constraints

National ID must be unique within the country:

```sql
UNIQUE (CountryCode, BusinessInformationNationalId)
```

Company Registration Number must be unique within the country:

```sql
UNIQUE (CountryCode, CompanyRegistrationNumber)
```

## 6. Relationship

`COUNTRIES` (1) —— (Many) `BUSINESS_INFORMATION`

One country can be associated with multiple business information records, while each business information record must reference exactly one country.

## 7. Referential Actions

```sql
FOREIGN KEY (CountryCode)
REFERENCES COUNTRIES(CountryCode)
ON UPDATE NO ACTION
ON DELETE NO ACTION
```

A country cannot be physically deleted while business information records reference it.

## 8. Final Decision

Country information will be managed centrally through the `COUNTRIES` table.

The country name will not be duplicated in `BUSINESS_INFORMATION`.

The country code will be used as the stable identifier in country-related uniqueness constraints.

**Status:** Accepted for the current design.