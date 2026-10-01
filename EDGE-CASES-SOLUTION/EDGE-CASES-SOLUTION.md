# EC-001 — User Deletion with Dependent Records

### Problem

A user requests account deletion while there are existing records that depend on the account, such as:

* Orders
* Payments
* Reviews
* Products
* Messages
* Audit Logs

Physically deleting the account would cause problems because these records are still important and may need to remain available for historical, financial, or auditing purposes.

### Solution

We will use **Soft Delete** instead of physically deleting the account.

The account record will remain in the database, but its status will be changed to indicate that the account has been deleted.

For example:

```text
account_status = "DELETED"
```

This means the account is considered deleted from the application's perspective, while the actual database record and all related data remain intact.

### Why Soft Delete?

Soft delete is important here because permanently deleting the account could:

* Break relationships with existing orders and payments.
* Remove important historical data.
* Cause foreign key or data integrity issues.
* Make audit records incomplete.
* Make it difficult to trace past transactions and activities.

Keeping the account record allows all dependent data to remain consistent and accessible when required.

### Implementation

When the user requests account deletion:

1. Verify that the deletion request is valid.
2. Do **not** physically delete the account from the database.
3. Update the account status to:

```text
DELETED
```

4. Keep all related records, including orders, payments, reviews, products, messages, and audit logs.
5. The application should treat accounts with `DELETED` status as inactive and prevent normal account access.

### Expected Result

The user is effectively deleted from the application's perspective, while the underlying database records remain preserved.

This approach protects important business and financial data and prevents accidental data loss or broken relationships between the account and its dependent records.

![Soft Delete Flow](./path/to/image.png)

---

# EC-002 — Role-Level Suspension

### Problem

A user may have more than one role i n the system.

For example, a single user could have:

* `CUSTOMER`
* `SELLER`
* `ADMIN`

If one of these roles needs to be suspended, suspending the entire user would also affect all of the user's other roles.

This is not the desired behavior.

For example, if the `SELLER` role is suspended, the user should still be able to use their `CUSTOMER` role normally.

### Decision

We will **suspend only the affected role**, not the entire user account.

Each `User-Role` assignment must have its own independent status.

To support this behavior, we introduced:

```text
UserRoleStatus
```

The status is stored for each `User-Role` assignment, allowing every role assigned to a user to have its own lifecycle and status.

### User Role Status

| Status        | Description                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `PENDING`     | The User-Role assignment has been created and is still going through registration or activation. |
| `UNDERREVIEW` | The User-Role assignment is currently under review.                                              |
| `ACTIVE`      | The User-Role assignment is fully active.                                                        |
| `LIMITED`     | The User-Role assignment is active but has certain restrictions.                                 |
| `SUSPENDED`   | The User-Role assignment is temporarily suspended.                                               |
| `DEACTIVATED` | The User-Role assignment has been deactivated.                                                   |
| `DELETED`     | The User-Role assignment has been logically deleted.                                             |
| `BLOCKED`     | The User-Role assignment has been blocked.                                                       |

### How It Works

Each role assigned to a user has an independent `UserRoleStatus`.

For example:

| User   | Role       | Status      |
| ------ | ---------- | ----------- |
| User A | `CUSTOMER` | `ACTIVE`    |
| User A | `SELLER`   | `SUSPENDED` |
| User A | `ADMIN`    | `ACTIVE`    |

In this case, the user can still use the `CUSTOMER` and `ADMIN` roles, while the `SELLER` role is suspended.

The suspension of one role does **not** affect the status of the user's other roles.

### Why This Approach?

Managing the status at the `User-Role` level provides proper isolation between roles.

It prevents a role-level action from unintentionally affecting the entire user account.

This also allows the system to support different states for different roles assigned to the same user.

### Expected Result

The system should treat each `User-Role` assignment independently.

If a specific role is suspended:

* Only that role becomes unavailable.
* Other active roles remain available.
* The user's account itself is not suspended.
* Each `UserRoleStatus` remains independent from the others.

Therefore, **role suspension is handled at the `User-Role` level rather than the `User` level.**

---

# EC-096 — Customer Account Deletion with Existing Records

### Problem

A customer requests account deletion while existing records are associated with the account, including:

* Orders
* Payments
* Reviews
* Messages
* Audit Records

Physically deleting the customer account could affect the integrity and traceability of these records.

### Decision

We will use **Soft Delete** instead of physically deleting the customer account.

The customer record will remain in the database, but its account status will be changed to:

```text
DELETED
```

The related records will remain preserved in the database.

### Behavior

When a customer requests account deletion:

1. The account is not physically deleted.
2. The account status is updated to `DELETED`.
3. Existing orders remain preserved.
4. Existing payment records remain preserved.
5. Existing reviews remain preserved.
6. Existing messages remain preserved.
7. Audit records remain preserved.
8. The deleted account is treated as inactive by the application.

### Rationale

Soft delete ensures that deleting a customer account does not cause data loss or break relationships with existing records.

It also preserves historical and audit information that may be required for business, financial, or operational purposes.

### Expected Result

The customer account is considered deleted from the application's perspective, while the underlying account record and all associated data remain intact.

> **Note:** The specific behavior of existing orders and payments during account deletion will be defined separately based on the finalized Order and Payment state machines.
