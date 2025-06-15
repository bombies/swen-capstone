# Project: Jamaica’s Bridges in Business

## 1. Project Overview

[cite_start]**Problem:** Jamaican sole traders lack a centralized platform to promote goods and services, forcing them to use inefficient methods that limit market reach and growth. [cite_start]This especially affects the informal sector, where entrepreneurs struggle with regulatory compliance for business registration, e-commerce, and data protection.
[cite_start]**Purpose:** To develop "Jamaica’s Bridges in Business," an online marketplace that provides accessible digital commerce channels and streamlines legal compliance for Jamaican entrepreneurs.

## 2. Core Functionality

- [cite_start]**User Management:** Role-based registration and secure authentication.
- [cite_start]**Business Verification:** Document upload and yearly re-verification.
- [cite_start]**Vendor Tools:** Dashboards for profile management, inventory tracking, and review monitoring.
- [cite_start]**Customer Tools:** Search, filtering, shopping cart, and order management.
- [cite_start]**Admin Tools:** Moderation and analytics.
- [cite_start]**Compliance:** Built-in privacy and data protection features.

## 3. Requirements

### Regulatory Requirements

- **Req 1: Adherence to E-Commerce Regulations for Suppliers**

  - [cite_start]**Rationale:** To comply with Jamaica's Electronic Transactions Act (ETA) for suppliers.
  - **System Requirements:**
    - [cite_start]Allow suppliers to provide and update information as per the ETA's Second Schedule.
    - [cite_start]Allow suppliers to register as different business types.
    - [cite_start]Capture valid e-signatures from customers.
    - [cite_start]Interface with a secure 3rd party payment gateway.
  - [cite_start]**Acceptance Criteria:** Supplier information is displayable [cite: 19][cite_start], different supplier types can register [cite: 19][cite_start], customers can provide e-signatures [cite: 20][cite_start], and payments are processed via a secure payment gateway.

- **Req 2: Adherence to E-Commerce Regulations for Customers**

  - [cite_start]**Rationale:** To comply with consumer rights under the ETA.
  - **System Requirements:**
    - [cite_start]Allow consumers to review, edit, and withdraw from electronic transactions before purchase.
    - [cite_start]Provide access to order summaries, terms, and total costs.
    - [cite_start]Allow consumers to provide e-signatures.
    - [cite_start]Allow consumers to view business information per the ETA's Second Schedule.
    - [cite_start]Allow order cancellation within 7 days of receipt (goods) or agreement (services).
    - [cite_start]Interface with a secure payment gateway for payments and refunds.

- **Req 3: Adherence to the Registration of Business Names Act**
  - [cite_start]**Rationale:** Ensure all suppliers are registered businesses in Jamaica.
  - **System Requirements:**
    - [cite_start]Allow business owners to upload certified "Letters of Good Standing".
    - [cite_start]Track and suspend businesses with expired letters.
    - [cite_start]Notify business owners one month before their letter expires.

### E-Commerce Requirements

- **Req 4: Verify Business for Vendor Registration**

  - [cite_start]**Rationale:** Prevent non-registered businesses from selling.
  - **System Requirements:**
    - [cite_start]Allow users to create vendor profiles.
    - [cite_start]Confirm business registration with the Tax Office and Companies of Jamaica.
    - [cite_start]Track registration status and suspend vendors if unregistered.
    - [cite_start]Allow vendors to categorize their page as product or service.
    - [cite_start]Require yearly re-verification and business locations.
  - [cite_start]**Acceptance Criteria:** Registration requires a valid certificate of business and ID. [cite_start]Vendor pages are categorized.

- **Req 5: Manage Personal Product/Service Page**

  - [cite_start]**Rationale:** Allow vendors to manage their offerings.
  - **System Requirements:**
    - [cite_start]Provide an input screen for product/service details (name, picture, description, price, category, tags).
    - [cite_start]Allow entry of availability slots for services and product stock.
    - [cite_start]Allow vendors to select a deposit percentage for services.
  - [cite_start]**Acceptance Criteria:** A fully described product/service appears on the page. [cite_start]Changes reflect within 60 seconds.

- **Req 6: Inventory Management**

  - [cite_start]**Rationale:** Prevent overselling and overbooking.
  - **System Requirements:**
    - [cite_start]Automatically create a stock item when a product is created.
    - [cite_start]Allow stock updates, with a maximum of 100 units per product.
    - [cite_start]Notify vendors when stock is below five.
    - [cite_start]Mark products as 'Out Of Stock' at zero and prevent their sale.
    - [cite_start]Remove service slots as they are booked.
  - [cite_start]**Acceptance Criteria:** Stock levels update globally within 60 seconds of a sale. [cite_start]Service slots disappear immediately upon booking. [cite_start]Checkout fails with an "Insufficient Stock" error if inventory is zero. [cite_start]Overbooking attempts display "This slot is no longer available".

- **Req 7: Respond to Customer Queries**

  - [cite_start]**Rationale:** Improve buyer-seller communication.
  - **System Requirements:**
    - [cite_start]Provide an in-app chat with text and image support.
    - [cite_start]Alert vendors via email/SMS for new queries.
    - [cite_start]Show read receipts.
    - [cite_start]Auto-remind vendors of unresolved chats after 24 hours.
  - [cite_start]**Acceptance Criteria:** Messages are delivered within 5 seconds. [cite_start]Alerts are received within 1 minute.

- **Req 8: Track Order Status**

  - [cite_start]**Rationale:** Ensure transparency in the order lifecycle.
  - [cite_start]**System Requirements:** Trigger email/SMS alerts for order confirmation and service date confirmation.
  - [cite_start]**Acceptance Criteria:** Notifications are sent ≤2 minutes after a status change.

- **Req 9: Submit Review**

  - [cite_start]**Rationale:** Build marketplace trust.
  - **System Requirements:**
    - [cite_start]Enable review submission with a 5-star rating only after an order is "Delivered".
    - [cite_start]Allow photo/video attachments (max 3 files, 20MB total).
    - [cite_start]Allow anonymous display and public vendor responses.
    - [cite_start]Calculate and display aggregate ratings.
    - [cite_start]Allow only one review per customer.
  - [cite_start]**Acceptance Criteria:** Customers cannot submit reviews before delivery or for canceled orders. [cite_start]Reviews appear on pages within 5 minutes of submission.

- **Req 10: Product Discovery**

  - [cite_start]**Rationale:** Allow customers to efficiently find products.
  - **System Requirements:**
    - [cite_start]Provide a search bar with semantic search capabilities.
    - [cite_start]Allow filtering by price, category, rating, and location.
    - [cite_start]Display products/services with descriptions and reviews.
  - [cite_start]**Acceptance Criteria:** Search results load in <5 seconds with 95% accuracy[cite: 79]. [cite_start]Filters work for categories [cite: 80][cite_start], ratings [cite: 81][cite_start], and location (prioritizing vendors within 50km).

- **Req 11: Manage Cart**

  - [cite_start]**Rationale:** Enable customers to manage selections before checkout.
  - **System Requirements:**
    - [cite_start]Allow adding items to a persistent cart.
    - [cite_start]Enable quantity modification and display real-time totals.
    - [cite_start]Allow users to select specific items for checkout.
    - [cite_start]Automatically remove services from the cart after 24 hours.
    - [cite_start]Prevent checkout with unavailable items.
  - [cite_start]**Acceptance Criteria:** Cart persists for 60 days of inactivity. [cite_start]Total calculation error is < 0.1%.

- **Req 12: Add To Cart (Save for Later)**

  - [cite_start]**Rationale:** Help customers save items for future consideration.
  - **System Requirements:**
    - [cite_start]Provide "Save for Later" functionality.
    - [cite_start]Notify users when saved items have low stock (<10%).
  - [cite_start]**Acceptance Criteria:** The saved list has a maximum of 100 items.

- **Req 13: Order Management**

  - [cite_start]**Rationale:** Allow customers to manage their orders.
  - **System Requirements:**
    - [cite_start]Generate a unique order ID for each purchase.
    - [cite_start]Allow customers to view their order history.
    - [cite_start]Allow customers to cancel an order and request a refund per the ETA.
    - [cite_start]Send an order confirmation email after each purchase.

- **Req 14: Refund and Return**
  - [cite_start]**Rationale:** Allow customers to request refunds or returns.
  - **System Requirements:**
    - [cite_start]Provide a return/refund button for 7 days after purchase confirmation.
    - [cite_start]Notify the merchant of a request within 5 minutes.
    - [cite_start]Prompt communication between merchant and customer.
    - [cite_start]Allow the customer to mark the issue as resolved or request further action.
  - [cite_start]**Acceptance Criteria:** The button is available for 7 days post-purchase. [cite_start]The merchant is notified. [cite_start]The issue can be marked as resolved by the customer.

### Privacy & Security Requirements

- **Req 15: Collect User Data Collection Consent**

  - [cite_start]**Rationale:** Comply with the Data Protection Act (2020).
  - **System Requirements:**
    - [cite_start]Display a clear privacy policy at sign-up.
    - [cite_start]Use an unchecked checkbox for active consent, disallowing account creation without it.
    - [cite_start]Record a timestamp and e-signature for consent.
  - [cite_start]**Acceptance Criteria:** Registration is prevented without consent. [cite_start]Consent status and timestamp are logged for audit.

- **Req 16: Define Data Retention Periods**

  - [cite_start]**Rationale:** Comply with the Data Protection Act (2020) by not keeping data longer than necessary.
  - **System Requirements:**
    - [cite_start]Define retention periods for different data types.
    - [cite_start]Automatically and permanently purge data that exceeds its retention period, unless required by law.
  - [cite_start]**Acceptance Criteria:** Inactive accounts are flagged and personal data deleted after user notification. [cite_start]Old logs are successfully deleted by the purge process.

- **Req 17: Authenticate User**

  - [cite_start]**Rationale:** Prevent unauthorized access through strong authentication.
  - **System Requirements:**
    - [cite_start]Enforce a password policy.
    - [cite_start]Store passwords using secure hashing.
    - [cite_start]Implement rate-limiting on login attempts and use authenticated sessions.
  - [cite_start]**Acceptance Criteria:** Weak passwords are rejected. [cite_start]No plaintext passwords are in the database. [cite_start]Multiple failed login attempts trigger a delay.

- **Req 18: Manage User Session**

  - [cite_start]**Rationale:** Protect user accounts from hijacking with secure sessions and timeouts.
  - **System Requirements:**
    - [cite_start]Require re-authentication after a period of inactivity.
    - [cite_start]Manage session tokens securely (e.g., JWT).
  - [cite_start]**Acceptance Criteria:** Idle sessions time out and require re-authentication. [cite_start]Manual logout terminates the server-side session.

- **Req 19: Process Payments**

  - [cite_start]**Rationale:** Securely process payments for goods and services.
  - **System Requirements:**
    - [cite_start]Integrate with PCI DSS Level 1 compliant payment gateways.
    - [cite_start]Do not transmit unencrypted card numbers or store full payment credentials.
    - [cite_start]Use tokenization for payment credential recall.
    - [cite_start]Communicate over secure channels (TLS 1.2/1.3).
    - [cite_start]Handle payment errors securely.
    - [cite_start]Store a record of all transactions.
  - [cite_start]**Acceptance Criteria:** Payments are directed through the gateway's secure interface. [cite_start]No credit card details are found in logs or the database. [cite_start]A transaction record is created upon successful payment.

- **Req 20: Export User Data**

  - [cite_start]**Rationale:** Comply with the Data Protection Act (2020) right to data portability.
  - **System Requirements:**
    - [cite_start]Provide a self-service data download feature with authentication.
    - [cite_start]Exported data must include all personal information in a structured format.
    - [cite_start]Provide a secure, time-limited download link.
  - [cite_start]**Acceptance Criteria:** The system verifies user identity before export. [cite_start]The generated file contains all relevant personal data in a readable format.

- **Req 21: Update Customer Details**

  - [cite_start]**Rationale:** Comply with the Data Protection Act (2020) right to rectification.
  - **System Requirements:**
    - [cite_start]Provide profile pages for users to view and edit their information.
    - [cite_start]Require re-authentication for sensitive changes (e.g., email).
    - [cite_start]Propagate updates throughout the system and log all changes.
  - [cite_start]**Acceptance Criteria:** Changing sensitive details requires password re-entry. [cite_start]Updates are reflected across the application.

- **Req 22: Delete Account**
  - [cite_start]**Rationale:** Comply with the Data Protection Act (2020) right to erasure.
  - **System Requirements:**
    - [cite_start]Provide a self-service account deletion option with re-authentication.
    - [cite_start]Remove all personal information, excluding data needed for legal purposes.
  - [cite_start]**Acceptance Criteria:** Upon user confirmation, the account is deleted, and personal data is no longer retrievable via the app or APIs.

### Non-Functional Requirements

- **Req 23: Handle User Traffic**

  - [cite_start]**Rationale:** Ensure smooth operation during peak usage.
  - [cite_start]**System Requirements:** Support at least 5,000 concurrent users. [cite_start]Handle simultaneous database queries without significant delay.
  - [cite_start]**Acceptance Criteria:** System latency stays under 3 seconds for 95% of requests under load. [cite_start]No critical service crashes occur during testing.

- **Req 24: Long-Term System Evolution**

  - [cite_start]**Rationale:** Ensure new features can be added with minimal impact.
  - [cite_start]**System Requirements:** Use a component-based architecture. [cite_start]Modules must be documented and isolated. [cite_start]Adhere to a clean code standard.
  - [cite_start]**Acceptance Criteria:** New features can be added without affecting unrelated modules. [cite_start]Module updates require changes to ≤ 2 existing components.

- **Req 25: Ensure System Availability**

  - [cite_start]**Rationale:** Provide high availability for the platform.
  - [cite_start]**System Requirements:** Host on highly available cloud infrastructure with automatic failover and redundancy.
  - [cite_start]**Acceptance Criteria:** Failover activates within 60 seconds of a simulated failure.

- **Req 26: System Performance**

  - [cite_start]**Rationale:** Ensure fast response times to enhance user experience.
  - **System Requirements:**
    - [cite_start]Respond to 95% of requests within 2 seconds.
    - [cite_start]Process at least 500 transactions per minute during peak periods.
    - [cite_start]Maintain average request latency below 1.5 seconds.
    - [cite_start]Support horizontal and vertical scaling.
  - [cite_start]**Acceptance Criteria:** Load tests confirm <2s response times at 80% load. [cite_start]Stress tests confirm throughput ≥500 transactions/minute.

- **Req 27: User Experience**

  - [cite_start]**Rationale:** An intuitive interface ensures users can complete tasks easily.
  - **System Requirements:**
    - [cite_start]UI must include keyboard navigation and form labels.
    - [cite_start]Error messages must be clear and helpful.
    - [cite_start]Support multilingual interfaces (English at launch).
    - [cite_start]Allow users to switch seamlessly between merchant and customer profiles.

- **Req 28: Platforms and Devices**

  - [cite_start]**Rationale:** Users should access the platform with minimal setup on any device.
  - **System Requirements:**
    - [cite_start]Run on all major OS platforms and browsers.
    - [cite_start]Require minimal configuration between environments.
    - [cite_start]Offer integration hooks for third-party systems.
  - [cite_start]**Acceptance Criteria:** App renders correctly on Chrome, Firefox, Safari, Edge, and mobile browsers.

- **Req 29: Auditability**
  - [cite_start]**Rationale:** Logs and audit trails help with compliance and debugging.
  - **System Requirements:**
    - [cite_start]Log user actions (login, edits, purchases) for up to 5 years.
    - [cite_start]Logs must include timestamp, user ID, and action details.
    - [cite_start]Provide audit trail access for compliance reports.
  - [cite_start]**Acceptance Criteria:** Admins can retrieve a full history of user activity. [cite_start]Log integrity is protected from tampering.

## 4. Use Cases

- **UC-1: Create Merchant Account**

  - [cite_start]**Goal:** A merchant creates an account to sell on the platform.
  - **Actors:** User, Admin
  - **Preconditions:** The merchant is not already registered on the system.
  - **Success:** A new merchant account is created (pending verification).
  - **Failure:** The account is not created.
  - **Flow:**
    1. [cite_start]User fills in the merchant registration form with business details required by ETA.
    2. User uploads their "Letter of Good Standing".
    3. [cite_start]User provides an e-signature to accept terms and policies.
    4. System validates data and creates a new merchant account pending admin verification.

- **UC-2: Verify Merchant Records**

  - [cite_start]**Goal:** Ensure merchants are compliant by validating official documentation.
  - **Actors:** Admin, Merchant
  - [cite_start]**Preconditions:** Merchant has uploaded documents for verification.
  - **Success:** Records are validated, and the merchant is authorized.
  - **Failure:** Verification fails due to invalid/missing documents.
  - **Flow:**
    1. Admin reviews the submitted "Letter of Good Standing".
    2. Admin cross-references the document with the Companies Office of Jamaica's records.
    3. If valid, Admin marks the merchant as "Verified", and the system updates the status and notifies the merchant.
    4. [cite_start]If invalid, Admin rejects the application and the merchant is notified.

- **UC-3: Suspend Merchant**

  - [cite_start]**Goal:** Suspend a merchant's account for expired documentation or policy violations.
  - **Actors:** Admin
  - [cite_start]**Preconditions:** A reason for suspension exists (e.g., expired letter, fraud).
  - **Success:** Merchant status is changed to "Suspended," and listings are hidden.
  - **Failure:** The account remains active.
  - **Flow:**
    1. [cite_start]Admin identifies a violation or expired document and initiates suspension.
    2. System updates the merchant's status to "Suspended," disabling and hiding all listings.
    3. System notifies the merchant of the suspension and the reason.

- **UC-4: Create Order**

  - [cite_start]**Goal:** Enable customers to successfully place orders for products/services.
  - **Actors:** Customer, Payment Gateway
  - [cite_start]**Preconditions:** Customer is authenticated, cart contains items, payment gateway is operational.
  - [cite_start]**Success:** Order is created, payment processed, inventory updated, and confirmations sent.
  - [cite_start]**Failure:** Order fails (e.g., payment declined), and the customer is notified.
  - **Flow:**
    1. [cite_start]System validates cart items and redirects the customer to the payment gateway.
    2. [cite_start]Payment gateway processes the payment.
    3. [cite_start]On success, the system creates an order with status "Confirmed," deducts inventory, records order details, generates a unique order number, and creates an invoice.
    4. [cite_start]Order appears in the customer's and merchant's history.
    5. [cite_start]If payment fails, the system notifies the customer of the error.

- **UC-5: Cancel Order**

  - [cite_start]**Goal:** Allow a customer to cancel an order before fulfillment.
  - **Actors:** Customer
  - [cite_start]**Preconditions:** Customer is authenticated; order status is "Pending" or "Confirmed".
  - [cite_start]**Success:** Order status is updated to "Canceled," inventory is restocked, and notifications are sent.
  - [cite_start]**Failure:** The order cannot be cancelled (e.g., already fulfilled).
  - **Flow:**
    1. [cite_start]Customer selects an order to cancel from their order history.
    2. [cite_start]System verifies the order is in a cancellable state.
    3. [cite_start]Customer confirms cancellation.
    4. [cite_start]System updates the order status to "Canceled," restocks inventory, and sends email/SMS confirmations to the customer and merchant.
    5. [cite_start]If not cancellable, the system notifies the customer.

- **UC-6: Submit Review**

  - [cite_start]**Goal:** Enable customers to rate a product/service to guide future buyers.
  - **Actors:** Customer, Merchant
  - [cite_start]**Preconditions:** The user is a verified customer who has received the product/service.
  - [cite_start]**Success:** The review is submitted and displayed on the merchant's page.
  - [cite_start]**Failure:** The customer is unable to submit the review.
  - **Flow:**
    1. The customer selects the "Review" button for a purchased item.
    2. [cite_start]The system verifies the customer's eligibility (i.e., the order is complete).
    3. The system displays the review interface.
    4. The customer provides a rating and an optional comment and submits the review.
    5. The system saves the review and displays it publicly.

- **UC-7: Search and Filter**

  - [cite_start]**Goal:** Allow users to find products/services efficiently and refine results.
  - **Actors:** User
  - [cite_start]**Preconditions:** Products/services are indexed; filter options are available.
  - [cite_start]**Success:** The system displays relevant, filtered results quickly.
  - [cite_start]**Failure:** The system returns irrelevant or no results, or the function fails.
  - **Flow:**
    1. [cite_start]The user enters a query into the search bar and submits it.
    2. [cite_start]The system displays matching products/services with details and reviews.
    3. [cite_start]The user selects filter criteria (price, category, rating, location) and applies them.
    4. [cite_start]The system refines the displayed list based on the filters.
    5. [cite_start]If no results are found, a "No results found" message is displayed.

- **UC-8: Delete Account**

  - [cite_start]**Goal:** Allow a user to permanently delete their account and personal data.
  - **Actors:** User
  - [cite_start]**Preconditions:** The user has an account.
  - [cite_start]**Success:** The user's account and personal data are removed from the system.
  - [cite_start]**Failure:** Authentication fails, or the system fails to delete the account.
  - **Flow:**
    1. [cite_start]The user navigates to the account deletion option.
    2. [cite_start]The system requires the user to re-authenticate.
    3. [cite_start]The system informs the user of the consequences of deletion.
    4. [cite_start]The user confirms the deletion.
    5. [cite_start]The system removes all personal information (excluding data required for legal purposes) and confirms deletion to the user.

- **UC-9: Export User Data**
  - [cite_start]**Goal:** Allow a user to download their personal data.
  - **Actors:** User
  - [cite_start]**Preconditions:** The user has an account.
  - [cite_start]**Success:** The user downloads a secure, time-limited file with their data in a structured format.
  - [cite_start]**Failure:** Authentication or data generation fails.
  - **Flow:**
    1. [cite_start]The user navigates to the data export feature and re-authenticates.
    2. [cite_start]The user confirms the export request.
    3. [cite_start]The system generates an export of all the user's personal data.
    4. [cite_start]The system provides a secure, time-limited download link, potentially via email notification.
    5. [cite_start]The user downloads the file.
