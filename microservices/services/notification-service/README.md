# 🔔 notification-service — Multi-Channel Alerts (Email, SMS, Push)

> Dispatches notifications via Email (Brevo SMTP), SMS (Fast2SMS), and Web Push, driven by RabbitMQ event consumers.

## What This Service Does

- Listens to RabbitMQ events across the platform (user registered, order placed, disease detected, market alert)
- Renders responsive email templates using template engines
- Sends emails via Brevo (formerly Sendinblue) SMTP
- Dispatches transactional SMS via Fast2SMS API
- Maintains notification delivery logs and retry mechanisms
- Exposes internal HTTP endpoints and admin testing endpoints

## Port: 3010

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| NotificationLog | notification_logs | Audit trail of sent notifications, channels, delivery status, and payload |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/notify/send` | JWT | Internal service endpoint to dispatch notifications |
| GET | `/api/notify/history/:userId` | JWT (`notification:read`) | Admin: fetch notification history for a user |
| POST | `/api/notify/test` | JWT (`notification:write`) | Admin: trigger test notification to specified email/phone |

## External Dependencies

| Service | Purpose |
|---------|---------|
| Brevo (SMTP) | Transactional and alert email delivery |
| Fast2SMS | SMS alerts (toggled via `ENABLE_SMS` config) |

## RabbitMQ Consumers (Events Subscribed)

| Exchange | Queue | Event | Action Taken |
|----------|-------|-------|--------------|
| `kissan.auth` | `notification.email` | `user.registered` | Send welcome email + verification OTP |
| `kissan.orders` | `notification.email` | `order.created` | Send order confirmation email |
| `kissan.orders` | `notification.sms` | `order.status_updated` | Send order status SMS update |
| `kissan.disease` | `notification.push` | `recommendation.generated` | Send crop advisory push notification |
| `kissan.market` | `notification.sms` | `market.alert_triggered` | Send mandi price alert SMS |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.notifications` | `notification.email_sent` | Email delivered successfully |
| `kissan.notifications` | `notification.sms_sent` | SMS dispatched successfully |
| `kissan.notifications` | `notification.push_sent` | Push notification dispatched |
| `kissan.notifications` | `notification.delivery_failed` | Delivery failed (routed to DLQ) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3010) |
| `EMAIL_HOST` | Yes | SMTP server host (`smtp-brevo.com`) |
| `EMAIL_PORT` | Yes | SMTP port (`587`) |
| `EMAIL_USER` | Yes | SMTP authentication username |
| `EMAIL_PASS` | Yes | SMTP authentication password |
| `ADMIN_EMAIL` | Yes | Sender default email address |
| `FAST2SMS_API_KEY` | Yes | Fast2SMS API key |
| `ENABLE_SMS` | Yes | Toggle live SMS delivery (`true` / `false`) |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Database authentication key |
| `RABBITMQ_URL` | Yes | RabbitMQ AMQP URI |

## Testing

```bash
# Health check
curl http://localhost:3010/health

# Prometheus metrics
curl http://localhost:3010/metrics

# Send test notification
curl -X POST http://localhost/api/notify/test \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"channel": "email", "to": "farmer@example.com", "subject": "Test Alert", "message": "Hello from KMC"}'
```
