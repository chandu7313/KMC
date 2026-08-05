# 📡 API Reference

> Every endpoint from all 15 services, organized by service.
>
> **Base URL:** `http://localhost` (via Nginx gateway)
>
> **Authentication:** Most endpoints require a JWT token in the `Authorization: Bearer <token>` header.
> Get a token via `POST /api/auth/auto-login` (dev only).

---

## auth-service (:3001)

**Nginx prefix:** `/api/auth/` → strips to `/` on service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register with email + password |
| POST | `/api/auth/login` | None | Login with email + password |
| POST | `/api/auth/logout` | None | Logout (clears session) |
| POST | `/api/auth/send-otp` | None | Send OTP to phone number |
| POST | `/api/auth/verify-otp` | None | Verify OTP → get JWT tokens |
| POST | `/api/auth/send-verify-otp` | JWT | Send email verification OTP |
| POST | `/api/auth/verify-account` | JWT | Verify email with OTP |
| GET | `/api/auth/is-auth` | JWT | Check if token is valid |
| POST | `/api/auth/send-reset-otp` | None | Send password reset OTP |
| POST | `/api/auth/reset-password` | None | Reset password with OTP |
| POST | `/api/auth/auto-login` | None | Dev-only auto-login by role |

---

## user-service (:3002)

**Nginx prefix:** `/api/users/` → strips to `/` → mounts at `/profile`, `/admin`, `/addresses`, `/survey`, `/farmer`

### Profile Routes (`/api/users/profile/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/profile/data` | JWT | Get user profile + addresses |
| PUT | `/api/users/profile/update` | JWT | Update profile fields |
| POST | `/api/users/profile/language` | JWT | Update language preference |
| POST | `/api/users/profile/preferences` | JWT | Update user preferences |

### Address Routes (`/api/users/addresses/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/addresses/` | JWT | List user addresses |
| POST | `/api/users/addresses/` | JWT | Add new address |
| PUT | `/api/users/addresses/:id` | JWT | Update address |
| DELETE | `/api/users/addresses/:id` | JWT | Delete address |

### Survey Routes (`/api/survey/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/survey/status` | JWT | Get survey completion status |
| POST | `/api/survey/submit` | JWT | Submit/update farmer survey |

### Farmer Dashboard Routes (`/api/users/farmer/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/farmer/dashboard` | JWT | Get farmer dashboard data |
| POST | `/api/users/farmer/alerts/:id/read` | JWT | Mark alert as read |
| POST | `/api/users/farmer/alerts/read-all` | JWT | Mark all alerts as read |
| POST | `/api/users/farmer/farm-status` | JWT | Submit farm status update |

### Admin User Routes (`/api/users/admin/*`)

| Method | Endpoint | Auth | Permission |
|--------|----------|------|-----------|
| GET | `/api/users/admin/users` | JWT | `user:read` |
| GET | `/api/users/admin/districts` | JWT | `user:read` |
| PUT | `/api/users/admin/users/:id/role` | JWT | `user:write` |
| POST | `/api/users/admin/users/:id/deactivate` | JWT | `user:write` |
| GET | `/api/users/admin/staff` | JWT | `admin:read` |
| GET | `/api/users/admin/staff/:id` | JWT | `admin:read` |
| POST | `/api/users/admin/staff` | JWT | `admin:write` |
| PUT | `/api/users/admin/staff/:id/role` | JWT | `admin:write` |
| POST | `/api/users/admin/staff/:id/deactivate` | JWT | `admin:write` |
| DELETE | `/api/users/admin/staff/:id` | JWT | `admin:write` |

---

## ai-service (:3003)

**Nginx prefix:** `/api/ai/` → ⛔ **BLOCKED externally** (internal service only, accessible only from Docker network 172.25.0.0/16)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/analyze` | Internal | Send image for Gemini Vision analysis |
| POST | `/plantid` | Internal | Send image for Plant.id analysis |

> Called internally by disease-service and soil-service only.

---

## disease-service (:3004)

**Nginx prefix:** `/api/disease/` → strips to `/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/disease/diagnose` | JWT (via multer) | Upload crop image for diagnosis |
| GET | `/api/disease/history` | JWT | Get user's diagnosis history |
| GET | `/api/disease/detail/:id` | JWT | Get specific diagnosis details |

> `POST /diagnose` expects `multipart/form-data` with field `cropImage` (max 10MB).

---

## soil-service (:3005)

**Nginx prefix:** `/api/soil/` → strips to `/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/soil/upload` | JWT | Upload soil report (multipart, field: `reportFile`) |
| GET | `/api/soil/history` | JWT | Get user's soil report history |
| POST | `/api/soil/analyze` | JWT | Standalone soil analysis |
| POST | `/api/soil/analyze-ai` | JWT | AI-powered soil analysis (calls ai-service) |
| GET | `/api/soil/admin/reports` | JWT | Admin: list all soil reports |
| PUT | `/api/soil/admin/reports/:id/analyze` | JWT | Admin: analyze specific report |
| POST | `/api/soil/admin/reports` | JWT | Admin: create soil report |
| GET | `/api/soil/admin/farmer/:farmerId/history` | JWT | Admin: get farmer's soil history |

---

## market-service (:3006)

**Nginx prefix:** `/api/market/` → strips to `/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/market/dashboard-prices` | None | Dashboard price summary |
| GET | `/api/market/prices` | None | List market prices (paginated) |
| GET | `/api/market/realtime` | None | Get real-time price for a commodity |
| GET | `/api/market/trend` | None | Price trend analysis |
| GET | `/api/market/recommendation` | None | Price-based recommendations |
| GET | `/api/market/analytics` | None | Market analytics data |
| GET | `/api/market/compare/:crop` | None | Compare crop prices across markets |
| POST | `/api/market/sync` | None | Trigger data.gov.in sync |
| POST | `/api/market/prices` | JWT | Admin: add price record |
| PUT | `/api/market/prices/:id` | JWT | Admin: update price record |
| DELETE | `/api/market/prices/:id` | JWT | Admin: delete price record |

---

## ecommerce-service (:3007)

**Nginx prefixes:** `/api/products/*`, `/api/cart/*`, `/api/vendors/*`, `/api/fertilizer/*`, `/api/equipment/*`, `/api/inventory/*`

### Products (`/api/products/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products/list` | None | List all products |
| POST | `/api/products/single` | None | Get single product (by ID in body) |
| GET | `/api/products/:id` | None | Get product by URL param |
| POST | `/api/products/add` | JWT | Admin: add product |
| POST | `/api/products/remove` | JWT | Admin: remove product |
| DELETE | `/api/products/:id` | JWT | Admin: delete product |

### Cart (`/api/cart/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart/` | JWT | Get user's cart |
| POST | `/api/cart/add` | JWT | Add item to cart |
| POST | `/api/cart/update` | JWT | Update cart item quantity |
| POST | `/api/cart/clear` | JWT | Clear entire cart |

### Fertilizers (`/api/fertilizer/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/fertilizer/list` | None | List all fertilizers |
| GET | `/api/fertilizer/:id` | None | Get fertilizer details |
| POST | `/api/fertilizer/add` | JWT | Admin: add fertilizer |
| PUT | `/api/fertilizer/update/:id` | JWT | Admin: update fertilizer |
| DELETE | `/api/fertilizer/delete/:id` | JWT | Admin: delete fertilizer |

### Equipment (`/api/equipment/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/equipment/list` | None | List all equipment |
| GET | `/api/equipment/:id` | None | Get equipment details |
| POST | `/api/equipment/add` | JWT | Admin: add equipment |
| PUT | `/api/equipment/update/:id` | JWT | Admin: update equipment |
| DELETE | `/api/equipment/delete/:id` | JWT | Admin: delete equipment |

---

## order-service (:3008)

**Nginx prefix:** `/api/orders/` → strips to `/` → mounts at `/`, `/fertilizer`, `/equipment`

### Marketplace Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/place` | JWT | Place a marketplace order |
| POST | `/api/orders/userorders` | JWT | Get user's orders |
| POST | `/api/orders/cancel` | JWT | Cancel an order |
| POST | `/api/orders/razorpay` | JWT | Create Razorpay order |
| POST | `/api/orders/verify-razorpay` | JWT | Verify Razorpay payment |
| POST | `/api/orders/list` | JWT | Admin: list all orders |
| POST | `/api/orders/status` | JWT | Admin: update order status |

### Fertilizer Orders (`/api/orders/fertilizer/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/fertilizer/place-order` | JWT | Place fertilizer order |
| GET | `/api/orders/fertilizer/user-orders` | JWT | Get user's fertilizer orders |
| GET | `/api/orders/fertilizer/admin-orders` | JWT | Admin: all fertilizer orders |
| POST | `/api/orders/fertilizer/update-status` | JWT | Admin: update status |

### Equipment Orders (`/api/orders/equipment/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders/equipment/place-order` | JWT | Place equipment order |
| GET | `/api/orders/equipment/user-orders` | JWT | Get user's equipment orders |
| POST | `/api/orders/equipment/cancel-order` | JWT | Cancel equipment order |
| GET | `/api/orders/equipment/admin-orders` | JWT | Admin: all equipment orders |
| POST | `/api/orders/equipment/update-status` | JWT | Admin: update status |

---

## payment-service (:3009)

**Nginx prefix:** `/api/payments/` → strips to `/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/payments/create-order` | JWT | Create Razorpay order |
| POST | `/api/payments/verify` | JWT | Verify payment signature |
| GET | `/api/payments/user/:userId` | JWT | Get user's payments |
| GET | `/api/payments/order/:orderId` | JWT | Get payments for an order |
| POST | `/api/payments/refund` | JWT | Admin: process refund |
| POST | `/api/payments/webhook` | None | Razorpay webhook (server-to-server) |

> **Note:** The `/webhook` endpoint has NO rate limiting and NO CORS — it's server-to-server from Razorpay.

---

## notification-service (:3010)

**Nginx prefix:** `/api/notify/` → strips to `/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/notify/send` | JWT | Send notification (internal) |
| GET | `/api/notify/history/:userId` | JWT | Get notification history |
| POST | `/api/notify/test` | JWT | Admin: send test notification |

> Most notifications are sent automatically via RabbitMQ consumers (email, SMS, push).

---

## support-service (:3011)

**Nginx prefix:** `/api/support/` → strips to `/` → mounts at `/tickets`, `/manage`

### Ticket Routes (`/api/support/tickets/*`)

| Method | Endpoint | Auth | Permission |
|--------|----------|------|-----------|
| GET | `/api/support/tickets/dashboard` | JWT | `support:read` |
| GET | `/api/support/tickets/` | JWT | `support:read` |
| POST | `/api/support/tickets/` | JWT | `support:write` |
| GET | `/api/support/tickets/:id` | JWT | `support:read` |
| PUT | `/api/support/tickets/:id` | JWT | `support:write` |
| DELETE | `/api/support/tickets/:id` | JWT | `support:admin` |
| POST | `/api/support/tickets/:id/assign` | JWT | `support:admin` |
| POST | `/api/support/tickets/:id/escalate` | JWT | `support:write` |
| POST | `/api/support/tickets/:id/resolve` | JWT | `support:write` |
| POST | `/api/support/tickets/:id/close` | JWT | `support:write` |
| GET | `/api/support/tickets/:id/messages` | JWT | `support:read` |
| POST | `/api/support/tickets/:id/messages` | JWT | `support:write` |
| POST | `/api/support/tickets/:id/notes` | JWT | `support:write` |
| GET | `/api/support/tickets/:id/activity` | JWT | `support:read` |

### Management Routes (`/api/support/manage/*`)

| Method | Endpoint | Auth | Permission |
|--------|----------|------|-----------|
| GET | `/api/support/manage/reports/dashboard` | JWT | `support:admin` |
| GET | `/api/support/manage/reports/agents` | JWT | `support:admin` |
| GET | `/api/support/manage/agents` | JWT | `support:admin` |
| POST | `/api/support/manage/agents` | JWT | `support:admin` |
| PUT | `/api/support/manage/agents/:id` | JWT | `support:admin` |
| PUT | `/api/support/manage/agents/:id/status` | JWT | `support:write` |
| GET | `/api/support/manage/settings/sla` | JWT | `support:admin` |
| PUT | `/api/support/manage/settings/sla` | JWT | `support:admin` |

---

## expert-service (:3012)

**Nginx prefixes:** `/api/experts/*`, `/api/booking/*` (→ rewrite to `/bookings/*`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/experts/` | None | List all experts |
| GET | `/api/experts/:id/profile` | None | Get expert profile |
| POST | `/api/experts/book` | JWT | Book a consultation |
| GET | `/api/experts/consultations/my` | JWT | Get my consultations |
| GET | `/api/experts/consultations/:id/notes` | JWT | Get consultation notes |
| PUT | `/api/experts/consultations/:id/cancel` | JWT | Cancel consultation |
| POST | `/api/experts/consultations/:id/rate` | JWT | Rate a consultation |

---

## content-service (:3013)

**Nginx prefixes:** `/api/content/*`, `/api/blog/*`, `/api/success/*`, `/api/success-story/*`, `/api/scheme/*`

### Blog Posts

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/content/blog/all` | None | List all blog posts |
| GET | `/api/content/blog/get/:slug` | None | Get blog by slug |
| GET | `/api/content/blog/:id` | None | Get blog by ID |
| POST | `/api/content/blog` | JWT | Admin: create blog post |
| PATCH | `/api/content/blog/:id` | JWT | Admin: update blog post |
| DELETE | `/api/content/blog/:id` | JWT | Admin: delete blog post |

### Success Stories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/content/success/all` | None | List success stories |
| GET | `/api/content/success/:id` | None | Get success story |
| POST | `/api/content/success` | JWT | Admin: create story |
| PATCH | `/api/content/success/:id` | JWT | Admin: update story |
| DELETE | `/api/content/success/:id` | JWT | Admin: delete story |

### Government Schemes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/content/scheme/all` | None | List government schemes |
| GET | `/api/content/scheme/:id` | None | Get scheme details |
| POST | `/api/content/scheme` | JWT | Admin: create scheme |
| PATCH | `/api/content/scheme/:id` | JWT | Admin: update scheme |

---

## analytics-service (:3014)

**Nginx prefix:** `/api/analytics/` → strips to `/`

> Analytics service primarily consumes RabbitMQ events. No public API routes currently defined. Dashboard data is served via internal consumption patterns.

---

## field-service (:3015)

**Nginx prefix:** `/api/field/` → strips to `/`

> Field service routes are placeholder. Field operations are driven by RabbitMQ events (farmer.onboarded, kit.delivered, visit.completed).

---

## Common Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data fetched",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Rate Limited (too many requests) |
| 500 | Internal Server Error |

---

## Health Check (All Services)

Every service exposes a health endpoint:

```bash
curl http://localhost:3001/health   # auth-service
curl http://localhost:3002/health   # user-service
# ... and so on for :3003-3015

# Or check via Nginx gateway:
curl http://localhost/health         # Nginx gateway health
```

Response format:
```json
{
  "status": "healthy",
  "service": "auth-service",
  "uptime": 12345.678,
  "timestamp": "2026-08-04T10:00:00.000Z"
}
```

## Prometheus Metrics (All Services)

Every service exposes metrics at:
```bash
curl http://localhost:3001/metrics   # auth-service metrics
```
