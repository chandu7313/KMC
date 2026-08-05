# 📈 analytics-service — Business Intelligence & Event Aggregation

> Consumes events from across the entire microservices ecosystem and aggregates metrics for farmer activity, crop health trends, sales, and platform growth.

## What This Service Does

- Listens to all domain events via RabbitMQ (`analytics.events` queue)
- Aggregates real-time farmer registration and retention rates
- Analyzes crop disease outbreak trends by geography and season
- Computes market transaction volumes and e-commerce GMV
- Provides data pipelines for administrative dashboards and Grafana

## Port: 3014

## Architecture

This is an event-driven processing service that primarily ingests data asynchronously via RabbitMQ rather than exposing heavy CRUD REST APIs.

## RabbitMQ Consumers (Events Subscribed)

| Exchange | Event | Insight Derived |
|----------|-------|-----------------|
| `kissan.auth` | `user.registered`, `user.logged_in` | User retention & daily active farmers |
| `kissan.disease` | `disease.detected`, `recommendation.generated` | Regional disease outbreak hotspots |
| `kissan.soil` | `soil.analyzed` | Soil health indicators by district |
| `kissan.orders` | `order.created`, `order.delivered` | Order volume & marketplace revenue |
| `kissan.payments` | `payment.confirmed` | Transaction volume and payment methods |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/analytics/summary` | JWT (`analytics:read`) | Overview dashboard metrics for administrators |
| GET | `/health` | None | Health check endpoint |
| GET | `/metrics` | None | Prometheus metrics scraper endpoint |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3014) |
| `JWT_SECRET` | Yes | Token verification secret |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Database authentication key |
| `MONGODB_URI` | No | Secondary time-series / document database |
| `RABBITMQ_URL` | Yes | RabbitMQ AMQP URI |

## Testing

```bash
# Health check
curl http://localhost:3014/health

# Prometheus metrics
curl http://localhost:3014/metrics
```
