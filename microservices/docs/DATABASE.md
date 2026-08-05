# 🗄️ Database Schema

> All Sequelize models used across the platform.
>
> **ORM:** Sequelize v6 over PostgreSQL (Supabase-hosted)
> **Secondary DB:** MongoDB (for flexible document storage)
> **Models location:** `packages/shared/models/`

## Model Summary (39 tables)

| # | Model | Table | Owner Service | Purpose |
|---|-------|-------|--------------|---------|
| 1 | User | users | auth / user | Farmer and user accounts |
| 2 | AdminUser | admin_users | auth / user | Admin staff accounts with roles |
| 3 | UserAddress | user_addresses | user | Farmer delivery addresses |
| 4 | FarmerSurvey | farmer_surveys | user | Onboarding survey responses |
| 5 | CropDiagnosis | crop_diagnoses | disease | AI crop disease scan results |
| 6 | SoilReport | soil_reports | soil | Soil analysis reports |
| 7 | SoilReminder | soil_reminders | soil | Scheduled soil test reminders |
| 8 | MarketPrice | market_prices | market | Current mandi prices |
| 9 | MarketHistory | market_histories | market | Historical price data |
| 10 | PriceAlert | price_alerts | market | Farmer price alert subscriptions |
| 11 | Product | products | ecommerce | Marketplace product catalog |
| 12 | Equipment | equipment | ecommerce | Farm equipment catalog |
| 13 | Fertilizer | fertilizers | ecommerce | Fertilizer catalog |
| 14 | Review | reviews | ecommerce | Product reviews and ratings |
| 15 | MarketplaceOrder | marketplace_orders | order | Product orders |
| 16 | MarketplaceOrderItem | marketplace_order_items | order | Line items in product orders |
| 17 | EquipmentOrder | equipment_orders | order | Equipment rental/purchase orders |
| 18 | EquipmentOrderItem | equipment_order_items | order | Line items in equipment orders |
| 19 | FertilizerOrder | fertilizer_orders | order | Fertilizer orders |
| 20 | FertilizerOrderItem | fertilizer_order_items | order | Line items in fertilizer orders |
| 21 | Payment | payments | payment | Razorpay payment records |
| 22 | NotificationLog | notification_logs | notification | Email/SMS/push delivery log |
| 23 | SupportTicket | support_tickets | support | Customer support tickets |
| 24 | TicketMessage | ticket_messages | support | Messages within a ticket |
| 25 | TicketActivity | ticket_activities | support | Ticket audit trail |
| 26 | ReplyTemplate | reply_templates | support | Canned response templates |
| 27 | SLAConfig | sla_configs | support | SLA rules and thresholds |
| 28 | AgentPerformance | agent_performances | support | Support agent metrics |
| 29 | ExpertV2 | experts_v2 | expert | Expert profiles (current version) |
| 30 | ExpertSlot | expert_slots | expert | Available booking time slots |
| 31 | ExpertConsultation | expert_consultations | expert | Booked consultations |
| 32 | Blog | blogs | content | Blog posts |
| 33 | SuccessStory | success_stories | content | Farmer success stories |
| 34 | Scheme | schemes | content | Government agriculture schemes |
| 35-39 | _(Legacy)_ | — | — | Booking, Expert, ExpertBooking, ExpertReview, Order (superseded) |

## Associations (Relationships)

```
User (1) ──────► (N) UserAddress          User has many addresses
User (1) ──────► (1) FarmerSurvey         User has one survey
User (1) ──────► (N) SoilReport           User has many soil reports

MarketplaceOrder (N) ◄──── (1) User       Order belongs to User
MarketplaceOrder (1) ──────► (N) MarketplaceOrderItem
MarketplaceOrderItem (N) ◄──── (1) Product

EquipmentOrder (N) ◄──── (1) User
EquipmentOrder (1) ──────► (N) EquipmentOrderItem
EquipmentOrderItem (N) ◄──── (1) Equipment

FertilizerOrder (N) ◄──── (1) User
FertilizerOrder (1) ──────► (N) FertilizerOrderItem
FertilizerOrderItem (N) ◄──── (1) Fertilizer

SupportTicket (1) ──────► (N) TicketMessage
SupportTicket (1) ──────► (N) TicketActivity

ExpertV2 (1) ──────► (N) ExpertSlot
ExpertV2 (1) ──────► (N) ExpertConsultation
```

## Key Models Explained

### User

```
The core user model representing farmers and platform users.
Primary keys: UUID
Used by: auth-service (login), user-service (profile)

Fields:
  id            UUID (PK)
  name          String
  email         String (unique, nullable)
  phone         String (unique)
  password      String (hashed with bcrypt)
  role          Enum: 'user', 'super_admin', 'tech_admin', etc.
  language      String (default: 'en')
  isVerified    Boolean
  profileImage  String (Cloudinary URL)
  district      String
  state         String
  createdAt     DateTime
  updatedAt     DateTime
```

### AdminUser

```
Admin staff accounts with specific roles.
Used by: auth-service, user-service

Fields:
  id            UUID (PK)
  name          String
  email         String (unique)
  password      String (hashed)
  role          String (one of ROLES from rbac.js)
  isActive      Boolean
  createdAt     DateTime
```

### CropDiagnosis

```
Results from AI-powered crop disease detection.
Used by: disease-service

Fields:
  id            UUID (PK)
  userId        UUID (FK → User)
  imageUrl      String (Cloudinary URL of uploaded crop photo)
  diagnosis     JSONB (AI analysis result — disease name, confidence, recommendations)
  source        String ('gemini' or 'plantid')
  createdAt     DateTime
```

### SoilReport

```
Soil analysis reports — uploaded or AI-analyzed.
Used by: soil-service

Fields:
  id            UUID (PK)
  farmerId      UUID (FK → User)
  reportFile    String (Cloudinary URL)
  analysis      JSONB (AI or manual analysis results)
  status        String ('pending', 'analyzed', 'reviewed')
  analyzedBy    UUID (nullable, FK → AdminUser)
  createdAt     DateTime
```

### Product

```
Marketplace product catalog.
Used by: ecommerce-service

Fields:
  id            UUID (PK)
  name          String
  description   Text
  price         Decimal
  category      String
  images        JSONB (array of Cloudinary URLs)
  stock         Integer
  vendorId      UUID
  isActive      Boolean
  createdAt     DateTime
```

### MarketplaceOrder

```
Product orders placed by farmers.
Used by: order-service

Fields:
  id              UUID (PK)
  userId          UUID (FK → User)
  status          Enum: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  totalAmount     Decimal
  shippingAddress JSONB
  paymentId       UUID (FK → Payment)
  razorpayOrderId String
  createdAt       DateTime
```

### Payment

```
Razorpay payment records.
Used by: payment-service

Fields:
  id                UUID (PK)
  orderId           String
  razorpayOrderId   String
  razorpayPaymentId String
  amount            Decimal
  currency          String (default: 'INR')
  status            Enum: 'created', 'captured', 'failed', 'refunded'
  method            String (card, upi, netbanking, etc.)
  createdAt         DateTime
```

### SupportTicket

```
Customer support tickets with SLA tracking.
Used by: support-service

Fields:
  id            UUID (PK)
  farmerId      UUID (FK → User)
  subject       String
  description   Text
  category      String
  priority      Enum: 'low', 'medium', 'high', 'critical'
  status        Enum: 'open', 'assigned', 'in_progress', 'resolved', 'closed'
  assignedTo    UUID (FK → AdminUser)
  slaDeadline   DateTime
  resolvedAt    DateTime
  closedAt      DateTime
  createdAt     DateTime
```

### ExpertV2

```
Agriculture expert profiles (v2 — current active version).
Used by: expert-service

Fields:
  id              UUID (PK)
  name            String
  specialization  String
  experience      Integer (years)
  qualifications  JSONB
  rating          Decimal
  totalConsultations Integer
  isActive        Boolean
  profileImage    String (Cloudinary URL)
  languages       JSONB (array)
  createdAt       DateTime
```

### ExpertConsultation

```
Booked consultations between farmers and experts.
Used by: expert-service

Fields:
  id            UUID (PK)
  farmerId      UUID (FK → User)
  expertId      UUID (FK → ExpertV2)
  slotId        UUID (FK → ExpertSlot)
  status        Enum: 'booked', 'completed', 'cancelled'
  notes         Text
  rating        Integer (1-5)
  feedback      Text
  bookedAt      DateTime
  completedAt   DateTime
```

### MarketPrice

```
Current mandi (market) prices from data.gov.in.
Used by: market-service

Fields:
  id            UUID (PK)
  commodity     String (crop name)
  market        String (mandi name)
  district      String
  state         String
  minPrice      Decimal
  maxPrice      Decimal
  modalPrice    Decimal
  date          Date
  source        String ('data.gov.in', 'manual')
  createdAt     DateTime
```

## Redis Usage

Redis is used with separate logical databases:

| DB | Purpose | TTL | Used By |
|----|---------|-----|---------|
| DB 0 | Auth (OTP codes, sessions) | 5 min (OTP), 24h (sessions) | auth-service |
| DB 1 | Cart data | No TTL | ecommerce-service |
| DB 2 | Cache (prices, products) | 5-30 min | market-service, ecommerce |
| DB 3 | Rate limiting | 1 min windows | All services |

## MongoDB Collections

MongoDB is connected as a secondary database. Specific use cases include:
- Flexible analytics event storage
- Document-heavy data that doesn't fit relational schema
- Legacy data from the pre-Sequelize phase

## Database Conventions

- **Primary Keys**: UUID v4 (not auto-increment integers)
- **Timestamps**: `createdAt` and `updatedAt` on every table (Sequelize default)
- **Soft Deletes**: Not used — hard deletes via `destroy()`
- **JSONB Fields**: Used for flexible data (diagnosis results, addresses, images)
- **Foreign Keys**: Named as `userId`, `farmerId`, `orderId`, etc.
- **Naming**: snake_case for table names, camelCase for JavaScript model fields
