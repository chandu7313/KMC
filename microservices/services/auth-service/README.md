# 🔐 auth-service — Authentication & Identity

> Handles all authentication: login, registration, OTP, JWT tokens, password reset.

## What This Service Does

- Email + password registration and login
- Mobile OTP-based authentication (via Fast2SMS)
- JWT access token + refresh token issuance
- Email verification with OTP
- Password reset flow
- Developer auto-login (for testing all roles)

## Port: 3001

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| User | users | All user accounts (farmers + admins) |
| AdminUser | admin_users | Admin staff with specific roles |

**Redis keys used:**
- `auth:otp:{phone}` — Hashed OTP (5 min TTL)
- `auth:session:{userId}` — Active session data

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/auth/register` | None | Register with email + password |
| POST | `/api/auth/login` | None | Login with email + password |
| POST | `/api/auth/logout` | None | Logout |
| POST | `/api/auth/send-otp` | None | Send OTP to phone |
| POST | `/api/auth/verify-otp` | None | Verify OTP → get tokens |
| POST | `/api/auth/send-verify-otp` | JWT | Send email verification OTP |
| POST | `/api/auth/verify-account` | JWT | Verify email |
| GET | `/api/auth/is-auth` | JWT | Check if token valid |
| POST | `/api/auth/send-reset-otp` | None | Send password reset OTP |
| POST | `/api/auth/reset-password` | None | Reset password |
| POST | `/api/auth/auto-login` | None | Dev-only quick login by role |

## External Dependencies

| API | Purpose |
|-----|---------|
| Fast2SMS | Send OTP SMS (disabled in dev: `ENABLE_SMS=false`) |

## Other Services Called

| Service | Why |
|---------|-----|
| (none — auth is standalone) | Other services call auth for token validation |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.auth` | `user.registered` | New user registers |
| `kissan.auth` | `user.logged_in` | Successful login |
| `kissan.auth` | `otp.sent` | OTP dispatched |
| `kissan.auth` | `otp.verified` | OTP verified |
| `kissan.auth` | `password.reset` | Password changed |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_REST_URL` | Yes | PostgreSQL via Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | DB admin access |
| `MONGODB_URI` | Yes | MongoDB connection |
| `REDIS_URL` | Yes | OTP + session storage |
| `RABBITMQ_URL` | Yes | Event publishing |
| `JWT_SECRET` | Yes | Sign access tokens |
| `JWT_REFRESH_SECRET` | Yes | Sign refresh tokens |
| `FAST2SMS_API_KEY` | Prod only | Send OTP via SMS |
| `ENABLE_SMS` | No | `false` = OTP in response |

## Testing

```bash
# Health check
curl http://localhost:3001/health

# Auto-login as super_admin
curl -X POST http://localhost/api/auth/auto-login \
  -H "Content-Type: application/json" \
  -d '{"role": "super_admin"}'

# OTP flow (dev mode — OTP in response)
curl -X POST http://localhost/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'

# Verify OTP (use OTP from previous response)
curl -X POST http://localhost/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'
```

## Common Issues

| Problem | Solution |
|---------|----------|
| `JWT_SECRET is not defined` | Check `.env` has JWT_SECRET set |
| OTP not received on phone | Set `ENABLE_SMS=false` in dev; OTP appears in response |
| `Invalid token` after restart | Old tokens invalid; get new token via auto-login |
| `ECONNREFUSED` Redis | Make sure Redis container is running: `docker-compose ps redis` |

## Key Files

```
src/
├── routes/auth.routes.js           ← URL routes + middleware
├── controllers/auth.controller.js  ← Request handling
├── services/
│   ├── auth.service.js             ← Registration, login logic
│   ├── otp.service.js              ← OTP generation, send, verify
│   └── token.service.js            ← JWT sign, verify, refresh
├── repositories/
│   ├── user.repository.js          ← User DB queries
│   └── session.repository.js       ← Session DB queries
├── validators/auth.validator.js    ← Joi schemas
├── events/
│   ├── publishers/auth.publisher.js ← Publish auth events
│   └── consumers/auth.consumer.js   ← Consume events
├── scripts/seedDevAccounts.js      ← Seed test accounts
└── index.js                        ← Service entry point
```
