# CSV Ingestion Import Report

> [!WARNING]
> **Missing Requirement**: Comprehensive searches through the repository utilizing `find` and `grep` revealed no dependencies (like `csv-parse` or `fast-csv`) and no logic files dedicated to parsing CSVs. As explicitly mandated, I am not inventing facts. **The following report is the recommended production-grade structure to be used once the CSV ingestion pipeline is actually implemented.**

---

## 1. Example Report Based on (Theoretical) Code Behavior

If a CSV containing 10,000 market prices was uploaded to the `market-service`, an import report should be generated and returned to the admin user.

### Import Summary

* **Total rows processed**: 10,000
* **Successful imports**: 9,985
* **Failed imports**: 5
* **Warnings**: 10
* **Processing duration**: 12.4 seconds

### Anomaly Report

| Row Number | Column | Issue | Severity | Resolution Action |
| :--- | :--- | :--- | :--- | :--- |
| 45 | `price_min` | Negative value `-50` provided. | FATAL | Row skipped. Cannot import negative pricing. |
| 892 | `arrival_date` | Invalid date format `2024-13-45`. | FATAL | Row skipped. Date parsing failed. |
| 1024 | `market_id` | Foreign key `abc-123` not found. | FATAL | Row skipped. Referential integrity violation. |
| 4050 | `commodity_name` | Empty string provided. | WARNING | Fallback to "Unknown Commodity". Row imported. |
| 8890 | `price_max` | `price_max` is less than `price_min`. | WARNING | Row flagged for manual review. Row imported. |
| 9901-9902 | `id` | Duplicate record IDs found. | FATAL | First row imported, second row skipped. |

---

## 2. Recommended Production-Grade Report Format

To implement this natively in the current microservices architecture, the following workflow is recommended:

1. **Upload**: Admin uploads a `.csv` via the API Gateway to a service (e.g., `market-service`).
2. **Queueing**: The file is stored in an S3 bucket (or Supabase Storage), and an event `csv.upload.started` is published to **RabbitMQ**.
3. **Processing**: A worker consumes the event, streams the file from storage using `fast-csv`, and processes it in chunks (e.g., 500 rows at a time) to prevent memory crashes.
4. **Validation**: Each row is passed through a **Joi** validation schema. Valid rows are bulk-inserted via Sequelize.
5. **Reporting**: The worker aggregates the results into a JSON object matching the structure above and saves it to an `import_reports` PostgreSQL table.
6. **Notification**: An event `csv.import.completed` is fired to the `notification-service`, which emails the admin the final report.
