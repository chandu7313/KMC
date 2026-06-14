# Project Scope

## Database Schema
The primary database is PostgreSQL via Supabase, accessed using Sequelize ORM. The schema consists of roughly 40 tables defined in `microservices/packages/shared/models`. Below is a summary of the core tables based on the ORM definition:

### 1. `users` Table
- **Columns**: `id` (UUID), `name` (STRING), `email` (STRING), `password` (STRING), `phone` (STRING), `role` (ENUM: 'user', 'admin', 'field-officer'), `cart_data` (JSONB), etc.
- **Primary Key**: `id`
- **Constraints**: `name` (allowNull: false), `email` (allowNull: false, unique: true), `phone` (unique: true).

### 2. `admin_users` Table
- **Columns**: `id` (UUID), `name` (STRING), `email` (STRING), `password` (STRING), `role` (ENUM), `status` (ENUM: 'active', 'inactive').
- **Primary Key**: `id`
- **Constraints**: `email` (unique: true, allowNull: false).

### 3. `support_tickets` Table (Inferred)
- **Columns**: `id` (UUID), `user_id` (UUID), `subject` (STRING), `description` (TEXT), `status` (ENUM).
- **Primary Key**: `id`
- **Foreign Keys**: `user_id` -> `users(id)`

### 4. `orders`, `products`, `fertilizers` Tables (Inferred)
- Various tables supporting the e-commerce functionalities with columns like `price`, `quantity`, and JSONB metadata.

### Missing Schema Information
Due to the sheer number of models (40+), including `ExpertConsultation`, `SoilReport`, `CropDiagnosis`, `NotificationLog`, a full exhaustive list of all foreign keys would require dumping the PostgreSQL schema directly. The ORM models define the associations dynamically.

---

## Data Quality & Anomaly Log

> [!WARNING]
> **Missing Requirement**: There is currently no evidence of a CSV ingestion or parsing workflow in the repository. The anomaly log below is based on the system's *database constraints* and *general API validation rules*, rather than a dedicated CSV import pipeline.

### Anomalies Handled by Current System Constraints

| Anomaly Name | Example | Detection Method | Impact | Action Taken |
| :--- | :--- | :--- | :--- | :--- |
| **Missing Required Values** | User registration without `name` or `email` | Sequelize constraint (`allowNull: false`) | Cannot create valid profile | Request rejected (400 Bad Request) |
| **Duplicate Records** | Two users registering with the same `email` or `phone` | Sequelize constraint (`unique: true`) | Data duplication | Request rejected (409 Conflict / 400 Bad Request) |
| **Invalid Enum Values** | Attempting to set role to `super-admin` | Sequelize validation (`ENUM('user', 'admin', 'field-officer')`) | Corrupted role access | Request rejected |
| **Malformed JSON Data** | Passing malformed string to `cart_data` | Sequelize `DataTypes.JSONB` parsing | Crash on checkout | Rejected / Errored |

### Potential Missing Validations (To be addressed if CSV Import is built)

If a CSV import pipeline is built (e.g., for bulk importing products or market prices), the following anomalies **must** be explicitly handled in the ingestion script, as the database constraints alone will result in hard crashes rather than graceful skipping/flagging:

1. **Malformed CSV Rows**:
   - *Example*: A row with 4 columns instead of 5.
   - *Detection*: Using a robust parser like `csv-parse` with `strict` mode.
   - *Recommended Action*: Skip row and log to anomaly report.
2. **Invalid Dates**:
   - *Example*: `2024-13-45` instead of `YYYY-MM-DD`.
   - *Detection*: Joi/Zod validation on the data stream before DB insertion.
   - *Recommended Action*: Flag row and substitute with null if nullable, else skip.
3. **Out-of-range Values**:
   - *Example*: Fertilizer price set to `-50`.
   - *Detection*: Schema validation (`price > 0`).
   - *Recommended Action*: Skip row to prevent e-commerce pricing bugs.
4. **Referential Integrity Violations (During Bulk Import)**:
   - *Example*: Importing an order for a `user_id` that does not exist.
   - *Detection*: Querying existing IDs or relying on DB foreign key constraint catch.
   - *Recommended Action*: Flag row as orphaned data and skip.
