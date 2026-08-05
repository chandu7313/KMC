# 🏗️ Architecture Guide

> How all 15 microservices connect, communicate, and share data.

## Overview

KMC uses an **event-driven microservices** architecture. Each service owns ONE business domain and communicates through:

1. **Nginx** — API gateway for all external requests from frontend
2. **RabbitMQ** — Async event-driven messaging between services (exchanges + queues)
3. **Direct HTTP** — Service-to-service calls when synchronous response is needed
4. **Shared Database** — All services share PostgreSQL via Sequelize ORM (`@kissan/shared` models)

## Request Flow: Farmer Login (OTP)

```
Farmer taps "Login" on phone/web
         │
         ▼
    React Frontend
    (http://localhost:3000)
         │
         │  POST /api/auth/send-otp  { phone: "9876543210" }
         ▼
    Nginx Gateway (:80)
    ┌─────────────────────────────┐
    │ location /api/auth/         │
    │   rate limit: auth zone     │
    │   rewrite: strip /api/auth  │
    │   proxy → auth-service:3001 │
    └─────────────────────────────┘
         │
         ▼
    auth-service (:3001)
    ┌─────────────────────────────┐
    │ 1. Validate phone number    │
    │ 2. Generate 6-digit OTP     │
    │ 3. Hash + store in Redis    │
    │    (5 min TTL)              │
    │ 4. If ENABLE_SMS=true:      │
    │    → send via Fast2SMS      │
    │    If ENABLE_SMS=false:     │
    │    → return OTP in response │
    │ 5. Publish AUTH.OTP_SENT    │
    │    event to RabbitMQ        │
    └─────────────────────────────┘
         │
         ▼
    Farmer enters OTP
    POST /api/auth/verify-otp  { phone, otp }
         │
         ▼
    auth-service (:3001)
    ┌─────────────────────────────┐
    │ 1. Get hashed OTP from Redis│
    │ 2. Compare with bcrypt      │
    │ 3. Find/create user in      │
    │    PostgreSQL (Sequelize)   │
    │ 4. Sign JWT access token    │
    │    + refresh token          │
    │ 5. Return tokens to frontend│
    └─────────────────────────────┘
         │
         ▼
    Frontend stores tokens
    Navigates to /farmer/home
```

## Request Flow: Disease Scan

```
Farmer uploads crop photo
         │
         ▼
    Frontend → POST /api/disease/diagnose
    (multipart/form-data with cropImage)
         │
         ▼
    Nginx Gateway (:80)
    ┌─────────────────────────────────┐
    │ location /api/disease/          │
    │   rate limit: upload zone       │
    │   client_max_body_size: 10M     │
    │   proxy → disease-service:3004  │
    └─────────────────────────────────┘
         │
         ▼
    disease-service (:3004)
    ┌─────────────────────────────────┐
    │ 1. Upload image to Cloudinary   │
    │ 2. Call ai-service:3003         │
    │    (direct HTTP, internal)      │
    │    → Gemini Vision analysis     │
    │    → Plant.id fallback          │
    │ 3. Save CropDiagnosis record    │
    │    in PostgreSQL                │
    │ 4. Publish DISEASE.REPORT_SAVED │
    │    to RabbitMQ                  │
    │ 5. Return diagnosis to farmer   │
    └─────────────────────────────────┘
```

## Nginx Routing Map

Every frontend request hits Nginx first. Nginx strips the `/api/<prefix>` and forwards to the right service.

```
FRONTEND (localhost:3000)
   │
   │ All /api/* requests
   ▼
NGINX GATEWAY (:80 / :443)
   │
   ├── /api/auth/*             → auth-service:3001         (rate: auth zone, 10r/m)
   │   └── /api/auth/send-otp  → auth-service:3001         (rate: otp zone, 3r/m)
   │
   ├── /api/users/*            → user-service:3002          (rate: global, 100r/m)
   ├── /api/survey/*           → user-service:3002
   │
   ├── /api/ai/*               → ai-service:3003            ⛔ BLOCKED (internal only)
   │                              (allow: 172.25.0.0/16 + 127.0.0.1)
   │
   ├── /api/disease/*          → disease-service:3004       (rate: upload, 1r/m)
   ├── /api/soil/*             → soil-service:3005          (rate: upload, 1r/m)
   ├── /api/market/*           → market-service:3006        (rate: global)
   │
   ├── /api/products/*         → ecommerce-service:3007     (rate: global)
   ├── /api/cart/*             → ecommerce-service:3007
   ├── /api/vendors/*          → ecommerce-service:3007
   ├── /api/fertilizer/*       → ecommerce-service:3007
   ├── /api/equipment/*        → ecommerce-service:3007
   ├── /api/inventory/*        → ecommerce-service:3007
   │
   ├── /api/orders/*           → order-service:3008         (rate: global)
   │
   ├── /api/payments/*         → payment-service:3009       (rate: global)
   │   └── /api/payments/webhook → payment-service:3009     (NO rate limit, NO CORS)
   │
   ├── /api/notify/*           → notification-service:3010  (rate: global)
   │
   ├── /api/support/*          → support-service:3011       (rate: global)
   │
   ├── /api/experts/*          → expert-service:3012        (rate: global)
   ├── /api/booking/*          → expert-service:3012        (rewrite → /bookings/*)
   │
   ├── /api/content/*          → content-service:3013       (rate: global)
   ├── /api/blog/*             → content-service:3013
   ├── /api/success/*          → content-service:3013
   ├── /api/success-story/*    → content-service:3013       (rewrite → /success/*)
   ├── /api/scheme/*           → content-service:3013
   │
   ├── /api/analytics/*        → analytics-service:3014     (rate: global)
   ├── /api/field/*            → field-service:3015         (rate: global)
   │
   └── /*                      → frontend:80                (SPA fallback)
```

## RabbitMQ Event System

Services communicate asynchronously via RabbitMQ. Each service domain has its own exchange.

### Exchanges (Topic-based)

| Exchange | Publisher | Events |
|----------|-----------|--------|
| `kissan.auth` | auth-service | user.registered, user.logged_in, otp.sent, otp.verified, password.reset |
| `kissan.user` | user-service | user.profile_updated, user.role_changed, farmer.onboarded |
| `kissan.ai` | ai-service | disease.detected, soil.analyzed, ai.request_failed, ai.model_fallback |
| `kissan.disease` | disease-service | disease.report_saved, recommendation.generated |
| `kissan.soil` | soil-service | soil.report_saved, soil.kit_ordered |
| `kissan.market` | market-service | market.price_updated, market.alert_triggered |
| `kissan.ecommerce` | ecommerce-service | product.added, product.updated, product.low_stock, cart.updated |
| `kissan.orders` | order-service | order.created, order.status_updated, order.delivered, order.delayed |
| `kissan.payments` | payment-service | payment.confirmed, payment.failed, refund.processed |
| `kissan.notifications` | notification-service | notification.email_sent, sms_sent, push_sent, delivery_failed |
| `kissan.support` | support-service | ticket.created, ticket.assigned, ticket.resolved, sla.breached |
| `kissan.experts` | expert-service | booking.confirmed, consultation.completed |
| `kissan.content` | content-service | content.published, banner.activated |
| `kissan.field` | field-service | farmer.onboarded, kit.delivered, visit.completed |

### Queues (Consumers)

| Queue | Consumer | Purpose |
|-------|----------|---------|
| `notification.email` | notification-service | Process email sending |
| `notification.sms` | notification-service | Process SMS sending |
| `notification.push` | notification-service | Process push notifications |
| `analytics.events` | analytics-service | Track all platform events |
| `inventory.updates` | ecommerce-service | Update stock counts |
| `support.auto_tickets` | support-service | Auto-create tickets |

### Dead Letter Queues

| DLQ | Purpose |
|-----|---------|
| `dlq.failed_notifications` | Failed email/SMS/push retries |
| `dlq.failed_payments` | Failed payment processing |
| `dlq.failed_events` | Failed event processing |

## Service-to-Service HTTP Calls

Some operations need synchronous responses, so services call each other directly over Docker network:

```
disease-service  ──HTTP──►  ai-service:3003     (Gemini/Plant.id analysis)
soil-service     ──HTTP──►  ai-service:3003     (Soil AI analysis)
```

> All other cross-service communication is async via RabbitMQ.

## Data Layer

All services share **one PostgreSQL database** via Sequelize ORM. Models are defined in `@kissan/shared` package. Each service owns specific models:

```
auth-service        → User, AdminUser
                      (+ Redis for OTP/sessions)

user-service        → User, UserAddress, FarmerSurvey

disease-service     → CropDiagnosis

soil-service        → SoilReport, SoilReminder

market-service      → MarketPrice, MarketHistory, PriceAlert

ecommerce-service   → Product, Equipment, Fertilizer, Review

order-service       → MarketplaceOrder, MarketplaceOrderItem,
                      EquipmentOrder, EquipmentOrderItem,
                      FertilizerOrder, FertilizerOrderItem

payment-service     → Payment

notification-service → NotificationLog

support-service     → SupportTicket, TicketMessage, TicketActivity,
                      ReplyTemplate, SLAConfig, AgentPerformance

expert-service      → ExpertV2, ExpertSlot, ExpertConsultation

content-service     → Blog, SuccessStory, Scheme

analytics-service   → (reads from all, event consumer)

field-service       → (field visits via RabbitMQ events)
```

> **MongoDB** is also connected as a secondary database for specific services requiring flexible document storage.

## Shared Packages

```
packages/
├── shared/  (@kissan/shared)       ← Used by ALL 15 services
│   ├── auth/
│   │   ├── jwtHelper.js            Sign/verify/decode JWT tokens
│   │   └── rbac.js                 Roles, permissions, access control
│   ├── database/
│   │   ├── sequelize.js            PostgreSQL connection (Sequelize)
│   │   ├── supabase.js             Supabase REST client
│   │   ├── mongodb.js              MongoDB connection
│   │   └── redis.js                Redis client (multi-DB: auth, cart, cache, ratelimit)
│   ├── models/                     All 39 Sequelize model definitions
│   │   ├── User.js, AdminUser.js, Product.js, ...
│   │   └── index.js                Model initialization + associations
│   ├── errors/
│   │   ├── AppError.js             Base error class
│   │   ├── HttpError.js            HTTP-specific errors
│   │   └── ValidationError.js      Request validation errors
│   ├── middleware/
│   │   ├── authenticate.js         JWT authentication middleware
│   │   ├── authorize.js            RBAC permission middleware
│   │   ├── rateLimiter.js          Redis-based rate limiting
│   │   ├── requestId.js            X-Request-ID propagation
│   │   └── validator.js            Joi schema validation
│   ├── response/
│   │   ├── success.js              successResponse, paginatedResponse, etc.
│   │   └── error.js                errorResponse helper
│   ├── logger/
│   │   └── winston.js              Structured JSON logger (createLogger)
│   └── metrics/
│       └── metrics.js              Prometheus metrics middleware
│
└── events/  (@kissan/events)       ← Event-driven messaging
    ├── eventTypes.js               All event constants + exchange/queue names
    ├── publisher.js                Publish events to RabbitMQ exchanges
    ├── consumer.js                 Subscribe to RabbitMQ queues
    └── index.js                    Barrel export
```

## User Roles & RBAC

Every API request is checked against the RBAC system defined in `@kissan/shared/auth/rbac.js`.

| Role | Code | Access Level |
|------|------|-------------|
| **Super Admin** | `super_admin` | ALL permissions (bypasses all checks) |
| **Tech Admin** | `tech_admin` | Read access to most services |
| **Admin** | `admin` | General admin access |
| **Agri Expert** | `agri_expert` | AI, disease, soil, market management |
| **E-Commerce Manager** | `ecommerce_manager` | Product catalog management |
| **Order Manager** | `order_manager` | Order processing and fulfillment |
| **Support Agent** | `support_agent` | Ticket handling |
| **Support Manager** | `support_manager` | Ticket handling + team management |
| **Content Manager** | `content_manager` | Blog, stories, schemes, notifications |
| **Finance Manager** | `finance_manager` | Payment and analytics access |
| **Field Agent** | `field_agent` | Field visits, farmer onboarding |
| **Field Officer** | `field-officer` | Field operations oversight |
| **Farmer (User)** | `user` | Own data only (farmer-facing features) |

### Permission Format

Permissions follow the pattern `{domain}:{action}`:
- `disease:read`, `disease:manage`, `disease:own`
- `orders:read`, `orders:manage`, `orders:own`
- `support:read`, `support:manage`, `support:own`

## Environment Diagram

```
LOCAL DEVELOPMENT:
  ┌──────────────────────────────────────────┐
  │          Docker Compose Network          │
  │        (kissan-net: 172.26.0.0/16)       │
  │                                          │
  │  Frontend ──► Nginx ──► Services (x15)   │
  │  :3000        :80       :3001-3015       │
  │                                          │
  │  Redis    RabbitMQ    PostgreSQL          │
  │  :6379    :5672/:15672  :5432             │
  │                                          │
  │  Database: Supabase Cloud (remote)       │
  │  + Local PostgreSQL (Docker)             │
  └──────────────────────────────────────────┘

PRODUCTION (AWS EC2):
  ┌──────────────────────────────────────────┐
  │  kissanmithar.com                        │
  │                                          │
  │  Nginx :80/:443 (SSL via Certbot)        │
  │    ├── Frontend (React build served)     │
  │    └── API → Services in Docker          │
  │                                          │
  │  Redis, RabbitMQ — Docker on same EC2    │
  │  Database — Supabase Cloud               │
  │                                          │
  │  CI/CD: Jenkins → SSH → docker-compose   │
  └──────────────────────────────────────────┘
```

## Rate Limiting (Nginx)

| Zone | Rate | Used For |
|------|------|----------|
| `otp` | 3 req/min per IP | OTP endpoints (strictest) |
| `auth` | 10 req/min per IP | Login, register, token refresh |
| `upload` | 1 req/min per IP | Disease scan, soil upload |
| `api` | 60 req/min per IP | General API endpoints |
| `global` | 100 req/min per IP | Default for all other routes |

## Security Headers (Nginx)

All responses include:
- `X-Frame-Options: DENY` — Prevents clickjacking
- `X-Content-Type-Options: nosniff` — Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` — XSS filter
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Request-ID` — Unique request tracking ID
- `Strict-Transport-Security` — HSTS (production only)
- `Content-Security-Policy` — CSP (production only)
