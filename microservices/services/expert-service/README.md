# 🧑‍🌾 expert-service — Agronomist Consultations & Booking

> Connects farmers with certified agricultural experts and agronomists for personalized advice and 1-on-1 scheduled sessions.

## What This Service Does

- Expert profile directory with specializations, languages, and ratings
- Time slot scheduling and availability management
- Consultation booking lifecycle (book, view notes, cancel, review & rate)
- Razorpay fee processing linkage for paid consultations

## Port: 3012

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| ExpertV2 | experts_v2 | Certified agronomist profiles, specializations, hourly rates |
| ExpertSlot | expert_slots | Available calendar booking slots for experts |
| ExpertConsultation | expert_consultations | Booked consultations, meeting links, prescriptions, review ratings |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/experts/` | None | List all available certified experts |
| GET | `/api/experts/:id/profile` | None | Get detailed profile, bio, and review rating of an expert |
| POST | `/api/experts/book` | JWT | Book a consultation slot with an expert |
| GET | `/api/experts/consultations/my` | JWT | Fetch authenticated user's consultation bookings |
| GET | `/api/experts/consultations/:id/notes` | JWT | Retrieve consultation prescription and notes |
| PUT | `/api/experts/consultations/:id/cancel` | JWT | Cancel an upcoming booked consultation |
| POST | `/api/experts/consultations/:id/rate` | JWT | Submit rating (1-5 stars) and feedback for consultation |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.experts` | `booking.confirmed` | Farmer books a consultation |
| `kissan.experts` | `consultation.completed` | Expert marks session as completed |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3012) |
| `JWT_SECRET` | Yes | Authentication secret |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase database role key |
| `RABBITMQ_URL` | Yes | RabbitMQ AMQP URI |

## Testing

```bash
# Health check
curl http://localhost:3012/health

# Prometheus metrics
curl http://localhost:3012/metrics

# List experts
curl http://localhost/api/experts/
```
