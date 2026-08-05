# 💳 payment-service — Payment Processing & Razorpay Gateway

> Handles online transactions, Razorpay order generation, HMAC SHA256 signature verification, webhooks, and refunds.

## What This Service Does

- Creates Razorpay payment orders with currency configuration (INR)
- Verifies cryptographic payment signatures using HMAC SHA256
- Fetches payment histories for users and specific orders
- Handles admin refund processing
- Receives server-to-server Razorpay webhooks for real-time payment reconciliation

## Port: 3009

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| Payment | payments | Transaction logs, Razorpay order/payment IDs, status, method, amount |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/payments/create-order` | JWT | Create a new Razorpay payment order |
| POST | `/api/payments/verify` | JWT | Verify payment signature and capture payment |
| GET | `/api/payments/user/:userId` | JWT | Get all payments for a specific user |
| GET | `/api/payments/order/:orderId` | JWT | Get payment records associated with an order |
| POST | `/api/payments/refund` | JWT (`payment:write`) | Admin: process partial or full refund |
| POST | `/api/payments/webhook` | None | Razorpay server webhook (bypasses rate limit) |

> ⚠️ **Webhook Security:** The `/webhook` endpoint is verified using `RAZORPAY_WEBHOOK_SECRET` header validation.

## External Dependencies

| Service | Purpose |
|---------|---------|
| Razorpay Payments API | Payment gateway, checkout orders, refund processing |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.payments` | `payment.confirmed` | Payment successfully captured/verified |
| `kissan.payments` | `payment.failed` | Transaction failed or signature mismatch |
| `kissan.payments` | `refund.processed` | Refund successfully executed |
| `kissan.payments` | `settlement.received` | Razorpay settlement batch event received |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3009) |
| `JWT_SECRET` | Yes | Token validation secret |
| `RAZORPAY_KEY_ID` | Yes | Razorpay key ID (`rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Secret to verify webhook payloads |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase database role key |
| `RABBITMQ_URL` | Yes | AMQP connection string |

## Testing

```bash
# Health check
curl http://localhost:3009/health

# Prometheus metrics
curl http://localhost:3009/metrics

# Create order
curl -X POST http://localhost/api/payments/create-order \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "currency": "INR", "receipt": "receipt_123"}'
```
