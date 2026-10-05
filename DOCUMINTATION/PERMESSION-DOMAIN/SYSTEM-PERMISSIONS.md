# Roles & Permissions

This document defines the permissions assigned to each role in the platform.

---

## Customer / Buyer

### `CUSTOMER`

* `products.view`
* `categories.view`
* `orders.create`
* `orders.view_own`
* `orders.cancel_own`
* `returns.create`
* `returns.view_own`
* `refunds.view_own`
* `reviews.create`
* `profile.manage`

### `BUSINESS CUSTOMER`

* `products.view`
* `categories.view`
* `business_orders.view`
* `orders.view_own`
* `returns.create`
* `returns.view_own`
* `reviews.create`
* `profile.manage`

### `BUSINESS ACCOUNT ADMIN`

* `products.view`
* `business_orders.view`
* `business_users.manage`
* `business_settings.manage`
* `purchase_rules.manage`
* `reports.view`

### `BUSINESS BUYER`

* `products.view`
* `categories.view`
* `business_orders.create`
* `business_orders.view`
* `returns.create`
* `returns.view_own`
* `profile.manage`

### `BUSINESS APPROVER`

* `business_orders.view`
* `purchase_requests.view`
* `purchase_requests.approve`
* `purchase_requests.reject`
* `reports.view`

---

## Seller / Merchant

### `SELLER OWNER`

* `seller.view`
* `seller.manage`
* `seller_settings.manage`
* `seller_users.manage`
* `products.view`
* `products.create`
* `products.update`
* `orders.view`
* `inventory.view`
* `finance.view`
* `reports.view`

### `SELLER ADMIN`

* `seller.view`
* `seller_settings.manage`
* `seller_users.manage`
* `products.view`
* `orders.view`
* `inventory.view`
* `reports.view`

### `SELLER OPERATIONS MANAGER`

* `orders.view`
* `orders.update`
* `orders.process`
* `inventory.view`
* `inventory.update`
* `fulfillment.view`
* `returns.view`
* `reports.view`

### `SELLER CATALOG MANAGER`

* `products.view`
* `products.create`
* `products.update`
* `categories.view`
* `brands.view`
* `catalog.manage`
* `products.publish`

### `SELLER INVENTORY MANAGER`

* `inventory.view`
* `inventory.update`
* `inventory.adjust`
* `inventory.transfer`
* `inventory.restock`
* `inventory.reports.view`

### `SELLER ORDER MANAGER`

* `orders.view`
* `orders.update`
* `orders.process`
* `orders.cancel`
* `orders.exception.manage`
* `orders.assign`
* `returns.view`
* `reports.view`

### `SELLER FULFILLMENT MANAGER`

* `orders.view`
* `fulfillment.view`
* `fulfillment.manage`
* `orders.prepare`
* `shipping.create`
* `shipping.view`
* `reports.view`

### `SELLER CUSTOMER SERVICE`

* `customers.view`
* `orders.view`
* `orders.update`
* `tickets.view`
* `tickets.manage`
* `complaints.view`
* `returns.view`
* `refunds.view`

### `SELLER FINANCE MANAGER`

* `finance.view`
* `settlements.view`
* `settlements.manage`
* `payments.view`
* `payouts.view`
* `seller_finance.manage`
* `financial_reports.view`

### `SELLER MARKETING MANAGER`

* `products.view`
* `campaigns.create`
* `campaigns.update`
* `campaigns.manage`
* `coupons.create`
* `coupons.manage`
* `marketing_reports.view`

### `SELLER COMPLIANCE MANAGER`

* `products.view`
* `seller.view`
* `compliance.view`
* `compliance.manage`
* `documents.manage`
* `compliance_reports.view`

### `SELLER ANALYST`

* `orders.view`
* `products.view`
* `inventory.view`
* `customers.view`
* `reports.view`
* `analytics.view`
* `data.export`

---

## Store / Branch

### `STORE MANAGER`

* `store.view`
* `store.manage`
* `employees.view`
* `employees.manage`
* `orders.view`
* `orders.process`
* `inventory.view`
* `inventory.update`
* `sales.view`
* `reports.view`

### `STORE SUPERVISOR`

* `store.view`
* `employees.view`
* `orders.view`
* `orders.process`
* `inventory.view`
* `inventory.update`
* `sales.view`

### `STORE EMPLOYEE`

* `store.view`
* `orders.view`
* `orders.process`
* `inventory.view`
* `sales.view`

### `STORE CASHIER`

* `orders.view`
* `orders.create`
* `payments.process`
* `invoices.create`
* `sales.view`
* `returns.view`

### `BRANCH MANAGER`

* `branch.view`
* `stores.view`
* `employees.view`
* `employees.manage`
* `orders.view`
* `inventory.view`
* `sales.view`
* `reports.view`

### `REGIONAL MANAGER`

* `region.view`
* `branches.view`
* `stores.view`
* `employees.view`
* `orders.view`
* `inventory.view`
* `sales.view`
* `reports.view`
* `regional_reports.view`

---

## Product / Catalog

### `CATALOG ADMIN`

* `products.view`
* `products.create`
* `products.update`
* `products.delete`
* `products.approve`
* `products.publish`
* `categories.manage`
* `brands.manage`
* `catalog_settings.manage`

### `CATALOG EDITOR`

* `products.view`
* `products.create`
* `products.update`
* `categories.view`
* `brands.view`

### `CATALOG REVIEWER`

* `products.view`
* `products.review`
* `products.approve`
* `categories.view`
* `brands.view`

### `CATEGORY MANAGER`

* `categories.view`
* `categories.create`
* `categories.update`
* `categories.delete`
* `categories.manage`

### `BRAND MANAGER`

* `brands.view`
* `brands.create`
* `brands.update`
* `brands.delete`
* `brands.manage`

### `PRODUCT MANAGER`

* `products.view`
* `products.create`
* `products.update`
* `products.delete`
* `products.lifecycle.manage`
* `products.publish`

### `PRODUCT REVIEWER`

* `products.view`
* `products.review`
* `products.approve`
* `product_quality.view`

---

## Orders / Fulfillment

### `ORDER MANAGER`

* `orders.view`
* `orders.create`
* `orders.update`
* `orders.process`
* `orders.cancel`
* `orders.assign`
* `orders.exception.manage`
* `returns.view`

### `ORDER PROCESSOR`

* `orders.view`
* `orders.update`
* `orders.process`
* `orders.prepare`

### `FULFILLMENT MANAGER`

* `fulfillment.view`
* `fulfillment.manage`
* `orders.view`
* `orders.prepare`
* `shipping.create`
* `shipping.view`
* `fulfillment.reports.view`

### `SHIPPING MANAGER`

* `shipping.view`
* `shipping.manage`
* `shipping.providers.manage`
* `shipping.track`
* `shipping.exceptions.manage`
* `shipping.reports.view`

### `RETURNS MANAGER`

* `returns.view`
* `returns.review`
* `returns.approve`
* `returns.process`
* `refunds.view`
* `returns.reports.view`

### `REFUND MANAGER`

* `refunds.view`
* `refunds.create`
* `refunds.approve`
* `refunds.process`
* `payments.view`
* `refunds.reports.view`

---

## Warehouse / Inventory

### `WAREHOUSE MANAGER`

* `warehouse.view`
* `warehouse.manage`
* `warehouse.receive`
* `warehouse.pick`
* `warehouse.pack`
* `warehouse.ship`
* `inventory.view`
* `inventory.update`
* `inventory.adjust`

### `WAREHOUSE SUPERVISOR`

* `warehouse.view`
* `warehouse.receive`
* `warehouse.pick`
* `warehouse.pack`
* `warehouse.ship`
* `inventory.view`
* `warehouse.employees.manage`

### `WAREHOUSE EMPLOYEE`

* `warehouse.view`
* `warehouse.receive`
* `warehouse.pick`
* `warehouse.pack`

### `INVENTORY MANAGER`

* `inventory.view`
* `inventory.update`
* `inventory.adjust`
* `inventory.transfer`
* `inventory.restock`
* `inventory.reports.view`

### `INVENTORY AUDITOR`

* `inventory.view`
* `inventory.audit`
* `inventory.discrepancy.view`
* `inventory.audit_reports.view`

---

## Customer Service / Communication

### `CUSTOMER SERVICE MANAGER`

* `customers.view`
* `orders.view`
* `tickets.view`
* `tickets.manage`
* `complaints.view`
* `complaints.manage`
* `agents.manage`
* `service.reports.view`

### `CUSTOMER SERVICE AGENT`

* `customers.view`
* `orders.view`
* `orders.update`
* `tickets.view`
* `tickets.create`
* `tickets.update`
* `complaints.view`
* `returns.view`

### `CONTACT ADMIN`

* `contact_center.manage`
* `contact_channels.manage`
* `contact_agents.manage`
* `tickets.view`
* `contact_reports.view`

### `CONTACT AGENT`

* `customers.view`
* `tickets.view`
* `tickets.create`
* `tickets.update`
* `contact.handle`

### `COMPLAINT MANAGER`

* `customers.view`
* `orders.view`
* `complaints.view`
* `complaints.manage`
* `complaints.escalate`
* `complaints.resolve`
* `complaints.reports.view`

### `DISPUTE MANAGER`

* `customers.view`
* `orders.view`
* `disputes.view`
* `disputes.manage`
* `disputes.resolve`
* `disputes.escalate`
* `disputes.reports.view`

---

## Reviews / Moderation

### `REVIEW ADMIN`

* `reviews.view`
* `reviews.manage`
* `review_settings.manage`
* `review_rules.manage`
* `review_reports.view`

### `REVIEW MODERATOR`

* `reviews.view`
* `reviews.moderate`
* `reviews.approve`
* `reviews.reject`
* `reviews.remove`

### `CONTENT MODERATOR`

* `content.view`
* `content.moderate`
* `content.remove`
* `content.escalate`
* `moderation.reports.view`

---

## Finance

### `FINANCE MANAGER`

* `finance.view`
* `finance.manage`
* `settlements.view`
* `settlements.manage`
* `payments.view`
* `payouts.view`
* `financial_reports.view`
* `finance_approval`

### `ACCOUNTANT`

* `finance.view`
* `accounting.manage`
* `invoices.view`
* `invoices.create`
* `settlements.view`
* `financial_reports.view`

### `BILLING MANAGER`

* `billing.view`
* `billing.manage`
* `invoices.view`
* `invoices.manage`
* `fees.view`
* `outstanding_amounts.manage`

### `PAYMENT OPERATIONS MANAGER`

* `payments.view`
* `payments.process`
* `payments.manage`
* `payouts.process`
* `collections.manage`
* `payment_exceptions.manage`

### `TAX MANAGER`

* `tax.view`
* `tax.manage`
* `tax_rules.manage`
* `tax_reports.manage`
* `tax_compliance.manage`

---

## HR

### `HR MANAGER`

* `employees.view`
* `employees.manage`
* `hr.manage`
* `organizational_structure.manage`
* `recruitment.manage`
* `hr_policies.manage`
* `hr_reports.view`

### `HR STAFF`

* `employees.view`
* `employee_data.manage`
* `leave.manage`
* `attendance.manage`
* `documents.manage`

---

## IT / Security / Platform

### `IT SUPPORT`

* `users.view`
* `support_tickets.view`
* `support_tickets.manage`
* `technical_support.manage`
* `devices.view`

### `SYSTEM ADMIN`

* `system.manage`
* `system_settings.manage`
* `platform_settings.manage`
* `users.manage`
* `roles.view`
* `roles.manage`
* `permissions.view`
* `audit_logs.view`
* `technical_services.manage`

### `SECURITY ADMIN`

* `security.manage`
* `permissions.view`
* `permissions.manage`
* `permissions.assign`
* `security_policies.manage`
* `audit_logs.view`
* `security_events.view`
* `access_control.manage`
* `security_reports.view`
