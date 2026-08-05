# 👨‍💻 Developer Setup Guide

> Everything you need to go from zero to running KMC locally in 10 minutes.

## Prerequisites

Install these before you start:

| Tool | Version | Install Link |
|------|---------|-------------|
| **Node.js** | 20+ | https://nodejs.org |
| **Docker Desktop** | Latest | https://docker.com |
| **Git** | Latest | https://git-scm.com |
| **VS Code** | Latest | https://code.visualstudio.com |

### Recommended VS Code Extensions

- **ESLint** — Code linting
- **Prettier** — Code formatting
- **GitLens** — Git blame + history
- **Thunder Client** — Test APIs (like Postman in VS Code)
- **Docker** — Container management
- **DotENV** — `.env` file syntax highlighting

## Step-by-Step Setup

### Step 1: Get the Code

```bash
git clone https://github.com/your-org/kissan-mithar.git
cd kissan-mithar/microservices
```

### Step 2: Set Up Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in these **REQUIRED** values:

| Variable | Where to get it |
|----------|----------------|
| `SUPABASE_REST_URL` | Supabase Dashboard → Settings → API → URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | Generate another random string (different from JWT_SECRET) |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `RABBITMQ_URL` | CloudAMQP or local RabbitMQ URL |

These can be left as-is for local development:
```
ENABLE_SMS=false          # OTP appears in API response (no real SMS)
NODE_ENV=production       # All services run in production mode in Docker
REDIS_PASSWORD=kmc_redis_secret   # Local Redis password
```

### Step 3: Start Everything

```bash
make up
# or: docker-compose up -d
```

This starts in Docker:
- All 15 microservices (ports 3001-3015)
- Nginx API gateway (port 80)
- Redis (port 6379)
- RabbitMQ (port 5672, management UI on 15672)
- PostgreSQL (port 5432)
- Frontend (port 3000)

### Step 4: Verify Services Are Running

```bash
make status
# or: docker-compose ps
```

You should see all containers as "Up". Check gateway health:
```bash
curl http://localhost/health
# → {"status":"ok","service":"kissan-gateway","timestamp":"..."}
```

### Step 5: Seed Test Data (Optional)

```bash
make seed
```

This creates test accounts for all admin roles and a test farmer.

### Step 6: Open the App

| URL | What |
|-----|------|
| http://localhost:3000 | Frontend (React app) |
| http://localhost:80 | API Gateway (Nginx) |
| http://localhost:15672 | RabbitMQ Management UI |
| http://localhost:3100 | Grafana (monitoring) |

## Daily Development Workflow

```bash
# ── Start your day ──
make up                         # Start all services

# ── Working on a specific service ──
make logs-auth                  # Watch auth-service logs
docker-compose logs -f disease-service   # Watch any service

# ── Made a change? ──
docker-compose restart auth-service      # Restart only that service

# ── Rebuild after dependency changes ──
make rebuild                    # docker-compose up -d --build

# ── Stop everything ──
make down
```

## How to Work on a Feature

### Example: Adding a new endpoint to disease-service

Every service follows the same **4-file pattern**. Here's how to add a `GET /stats` endpoint:

```
1. Open the service folder:
   services/disease-service/src/

2. Add your route:
   routes/disease.routes.js
   → Add: router.get('/stats', authenticate, diseaseCtrl.getStats);

3. Add your controller:
   controllers/disease.controller.js
   → Add:
   export const getStats = async (req, res, next) => {
     try {
       const data = await diseaseService.getStats(req.user.id);
       return successResponse(res, data, 'Stats fetched');
     } catch (err) { next(err); }
   };

4. Add your business logic:
   services/disease.service.js
   → Add:
   export const getStats = async (userId) => {
     const reports = await diagnosisRepo.getStatsByUser(userId);
     return { total: reports.length, ... };
   };

5. Add your DB query:
   repositories/diagnosis.repository.js
   → Add:
   export const getStatsByUser = async (userId) => {
     return models.CropDiagnosis.findAll({ where: { userId } });
   };

6. Test it:
   curl http://localhost/api/disease/stats \
     -H "Authorization: Bearer YOUR_TOKEN"
```

## The 4-File Pattern

Every feature in every service has exactly 4 layers:

```
routes.js
  → Defines URL paths
  → Applies middleware (authenticate, authorize, validate)
  → Calls controller functions
  → ONLY routing logic here

controller.js
  → Receives HTTP request (req, res, next)
  → Extracts data from req.body, req.params, req.query, req.user
  → Calls service functions
  → Sends HTTP response via successResponse() / errorResponse()
  → NO business logic, NO database queries

service.js
  → Contains ALL business logic
  → Makes decisions (if/else, calculations, validations)
  → Calls repository functions for DB access
  → Calls other services via HTTP if needed
  → Publishes events to RabbitMQ
  → NO HTTP req/res objects, NO direct DB queries

repository.js
  → ONLY database queries (Sequelize model calls)
  → No business logic
  → Returns raw data
  → Handles DB-level error messages
```

**Rule: Never skip layers.**
```
✅  Controller → Service → Repository → Database
❌  Controller → Repository (skipping service layer)
❌  Controller → Database (skipping everything)
```

## Getting a JWT Token for Testing

```bash
# Auto-login as any role (development only)
curl -X POST http://localhost/api/auth/auto-login \
  -H "Content-Type: application/json" \
  -d '{"role": "super_admin"}'

# Copy the accessToken from the response
# Use it in all subsequent API calls:
curl http://localhost/api/users/profile/data \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

Available roles for auto-login:
`super_admin`, `tech_admin`, `admin`, `agri_expert`, `ecommerce_manager`, `order_manager`, `support_agent`, `support_manager`, `content_manager`, `finance_manager`, `field_agent`, `user` (farmer)

## Project Rules Every Developer Must Follow

### 1. Never hardcode secrets

```javascript
// ❌ WRONG
const key = 'my-secret-key-123';

// ✅ CORRECT
const key = process.env.JWT_SECRET;
```

### 2. Always use try/catch in controllers

```javascript
// ❌ WRONG — unhandled promise rejection
export const getProfile = async (req, res) => {
  const data = await service.getProfile(req.user.id);
  res.json({ data });
};

// ✅ CORRECT — errors caught and forwarded
export const getProfile = async (req, res, next) => {
  try {
    const data = await service.getProfile(req.user.id);
    return successResponse(res, data, 'Profile fetched');
  } catch (err) {
    next(err);
  }
};
```

### 3. Always use structured logging

```javascript
import { createLogger } from '@kissan/shared';
const logger = createLogger('disease-service');

// After important operations:
logger.info('Disease scan completed', {
  userId: req.user.id,
  disease: result.diseaseName,
  confidence: result.confidence,
});

// For errors:
logger.error('Scan failed', {
  userId: req.user.id,
  error: err.message,
});
```

### 4. Always validate request body

```javascript
// In routes file — always add validate() middleware:
import { validate } from '@kissan/shared';
import { scanSchema } from '../validators/disease.validator.js';

router.post('/diagnose',
  authenticate,
  validate(scanSchema),   // ← Always validate
  diseaseCtrl.diagnoseCrop
);
```

### 5. Use @kissan/shared imports

```javascript
// ❌ WRONG — importing from relative paths
import { signAccessToken } from '../../../packages/shared/auth/jwtHelper.js';

// ✅ CORRECT — import from package
import { signAccessToken, authenticate, successResponse } from '@kissan/shared';
```

## Where to Find Things

```
I need to...                          → Go to...
─────────────────────────────────────────────────────────────────

Change how login/OTP works            → services/auth-service/src/services/
Add a new product field                → packages/shared/models/Product.js
                                        + services/ecommerce-service/src/
Change email templates                 → services/notification-service/src/services/
Change how JWT tokens work             → packages/shared/auth/jwtHelper.js
Add a new user role                    → packages/shared/auth/rbac.js
Fix an Nginx routing issue             → nginx/conf.d/kissan-mithar.conf
Add a new RabbitMQ event               → packages/events/eventTypes.js
Change rate limiting                   → nginx/nginx.conf (zone definitions)
Add a new Sequelize model              → packages/shared/models/
                                        + packages/shared/models/index.js
Change database connection             → packages/shared/database/sequelize.js
Change the seed script                 → scripts/seed-database.js
Add a new service to Docker            → docker-compose.yml
Add monitoring dashboard               → monitoring/grafana/
Change CORS origins                    → nginx/conf.d/kissan-mithar.conf (line 1-12)
Change security headers                → nginx/nginx.conf (line 50-55)
```

## Understanding the Import System

All services import from two shared packages:

```javascript
// @kissan/shared — Auth, DB, middleware, models, logging
import {
  createLogger,          // Winston structured logger
  authenticate,          // JWT auth middleware
  authorize,             // RBAC permission middleware
  validate,              // Joi validation middleware
  successResponse,       // Standardized success response
  errorResponse,         // Standardized error response
  models,                // All Sequelize models
  AppError,              // Base error class
  getRedisClient,        // Redis connection
  ROLES,                 // Role constants
  hasPermission,         // Permission checker
} from '@kissan/shared';

// @kissan/events — RabbitMQ event system
import {
  AUTH_EVENTS,           // Event type constants
  EXCHANGES,             // Exchange name constants
  QUEUES,                // Queue name constants
} from '@kissan/events';
```

## Service Index (which port, which container)

| Service | Port | Container Name | Docker Service Name |
|---------|------|---------------|-------------------|
| auth-service | 3001 | kmc-auth | auth-service |
| user-service | 3002 | kmc-user | user-service |
| ai-service | 3003 | kmc-ai | ai-service |
| disease-service | 3004 | kmc-disease | disease-service |
| soil-service | 3005 | kmc-soil | soil-service |
| market-service | 3006 | kmc-market | market-service |
| ecommerce-service | 3007 | kmc-ecommerce | ecommerce-service |
| order-service | 3008 | kmc-order | order-service |
| payment-service | 3009 | kmc-payment | payment-service |
| notification-service | 3010 | kmc-notification | notification-service |
| support-service | 3011 | kmc-support | support-service |
| expert-service | 3012 | kmc-expert | expert-service |
| content-service | 3013 | kmc-content | content-service |
| analytics-service | 3014 | kmc-analytics | analytics-service |
| field-service | 3015 | kmc-field | field-service |
| **Frontend** | 3000 | kmc-frontend | frontend |
| **Nginx** | 80/443 | kmc-gateway | nginx |
| **Redis** | 6379 | kmc-redis | redis |
| **RabbitMQ** | 5672/15672 | kmc-rabbitmq | rabbitmq |
| **PostgreSQL** | 5432 | kmc-postgres | postgres |
