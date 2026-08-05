# 🚜 field-service — Ground Operations & Field Agent Tracking

> Coordinates ground extension officers, farmer onboarding visits, soil test kit deliveries, and field inspections.

## What This Service Does

- Manages field agent schedules and geographic assignment zones
- Tracks ground visits to farms for hands-on inspection and soil sampling
- Handles physical soil testing kit deliveries to rural farms
- Publishes field lifecycle events to RabbitMQ

## Port: 3015

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| FieldAgent | field_agents | Field officer directory, assigned districts, active status |
| FieldVisit | field_visits | Scheduled and completed farm visits with notes and photos |
| KitDelivery | kit_deliveries | Status of physical soil kit shipments to farmers |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/field/visits` | JWT (`field:read`) | List scheduled field visits |
| POST | `/api/field/visits` | JWT (`field:write`) | Schedule a farm inspection visit |
| PUT | `/api/field/visits/:id/complete` | JWT (`field:write`) | Mark visit as completed with inspection report |
| GET | `/health` | None | Health check endpoint |
| GET | `/metrics` | None | Prometheus metrics scraper endpoint |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.field` | `farmer.onboarded` | Field officer assists and onboards farmer in person |
| `kissan.field` | `kit.delivered` | Physical soil testing kit delivered to farmer |
| `kissan.field` | `visit.completed` | Farm inspection visit finished |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3015) |
| `JWT_SECRET` | Yes | Token verification secret |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Database authentication key |
| `RABBITMQ_URL` | Yes | RabbitMQ AMQP URI |

## Testing

```bash
# Health check
curl http://localhost:3015/health

# Prometheus metrics
curl http://localhost:3015/metrics
```
