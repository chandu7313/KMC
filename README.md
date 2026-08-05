# 🌿 Kissan Mithar Consultancy (KMC)

> AI-powered agriculture platform helping Indian farmers with crop disease detection, market intelligence, expert consultations, and agri e-commerce.

## What is this project?

Kissan Mithar is a full-stack agriculture technology platform built as **15 microservices**. It provides:

- 🔬 **AI-Powered Crop Disease Detection** — Upload a photo, get instant diagnosis via Google Gemini + Plant.id
- 📊 **Real-Time Mandi Prices** — Live market prices from data.gov.in with trend analysis
- 👨‍🌾 **Expert Consultations** — Book and consult with agriculture experts online
- 🛒 **Agri E-Commerce** — Buy fertilizers, equipment, and farm products with Razorpay payments
- 🌍 **Soil Analysis** — Upload soil reports for AI-powered analysis and recommendations
- 🎫 **Farmer Support System** — Ticket-based support with SLA management
- 📱 **Multi-Language Support** — Telugu, Hindi, and English (mobile-first design)

## Quick Start (New Developer)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/kissan-mithar.git
cd kissan-mithar/microservices

# 2. Copy environment variables
cp .env.example .env
# Fill in REQUIRED values (see .env.example comments)

# 3. Start everything with Docker
make up
# This starts all 15 services + Nginx + Redis + RabbitMQ + PostgreSQL

# 4. Seed test data (optional)
make seed

# 5. Open in browser
# Frontend:      http://localhost:3000
# API Gateway:   http://localhost:80
# RabbitMQ UI:   http://localhost:15672
# Grafana:       http://localhost:3100
```

> **First time?** Read the full [Developer Setup Guide](./microservices/DEVELOPER_GUIDE.md) for step-by-step instructions.

## Project Structure

```
kissan-mithar/
├── microservices/
│   ├── services/              ← 15 backend microservices
│   │   ├── auth-service/      ← Authentication & OTP
│   │   ├── user-service/      ← User profiles & dashboard
│   │   ├── ai-service/        ← Gemini + Plant.id (internal)
│   │   ├── disease-service/   ← Crop disease detection
│   │   ├── soil-service/      ← Soil report analysis
│   │   ├── market-service/    ← Mandi prices & trends
│   │   ├── ecommerce-service/ ← Products, cart, catalog
│   │   ├── order-service/     ← Order lifecycle
│   │   ├── payment-service/   ← Razorpay integration
│   │   ├── notification-service/ ← Email + SMS
│   │   ├── support-service/   ← Support tickets & SLA
│   │   ├── expert-service/    ← Expert consultations
│   │   ├── content-service/   ← Blogs, stories, schemes
│   │   ├── analytics-service/ ← Event tracking
│   │   └── field-service/     ← Field agent operations
│   ├── packages/              ← Shared code used by all services
│   │   ├── shared/            ← @kissan/shared (auth, DB, middleware, models)
│   │   ├── events/            ← @kissan/events (RabbitMQ event types)
│   │   └── database/          ← Legacy database scripts
│   ├── frontend/
│   │   ├── web/               ← React.js web application
│   │   └── mobile/            ← Flutter/Dart mobile app
│   ├── nginx/                 ← API gateway configuration
│   ├── monitoring/            ← Prometheus + Grafana + AlertManager
│   ├── rabbitmq/              ← RabbitMQ config & definitions
│   ├── scripts/               ← Helper scripts (seed, diagnose)
│   ├── docker-compose.yml     ← Development orchestration
│   ├── docker-compose.prod.yml ← Production orchestration
│   ├── Makefile               ← All developer commands
│   └── .env.example           ← Environment variable template
└── README.md                  ← You are here
```

## Our 15 Services at a Glance

| # | Service | Port | What it does |
|---|---------|------|-------------|
| 1 | **auth-service** | 3001 | Login, registration, OTP, JWT tokens, password reset |
| 2 | **user-service** | 3002 | Farmer profiles, addresses, surveys, admin users, dashboard |
| 3 | **ai-service** | 3003 | Google Gemini + Plant.id AI (internal only, blocked by Nginx) |
| 4 | **disease-service** | 3004 | Crop disease detection via image upload |
| 5 | **soil-service** | 3005 | Soil report upload, AI analysis, reminders |
| 6 | **market-service** | 3006 | Mandi prices from data.gov.in, trends, alerts |
| 7 | **ecommerce-service** | 3007 | Products, fertilizers, equipment, cart |
| 8 | **order-service** | 3008 | Marketplace/fertilizer/equipment order lifecycle |
| 9 | **payment-service** | 3009 | Razorpay order creation, verification, refunds |
| 10 | **notification-service** | 3010 | Email (Brevo SMTP) + SMS (Fast2SMS) + push |
| 11 | **support-service** | 3011 | Support tickets, SLA monitoring, agent management |
| 12 | **expert-service** | 3012 | Expert profiles, slot booking, consultations |
| 13 | **content-service** | 3013 | Blog posts, success stories, government schemes |
| 14 | **analytics-service** | 3014 | Event tracking, dashboard reports |
| 15 | **field-service** | 3015 | Field agent visits, farmer assignments |

## Tech Stack

| Layer | Technology | Why we use it |
|-------|-----------|---------------|
| **Frontend** | React.js + Vite | Fast, component-based SPA |
| **Mobile** | Flutter / Dart | Cross-platform mobile app |
| **Backend** | Node.js + Express | JavaScript everywhere, fast I/O |
| **ORM** | Sequelize | Type-safe models, migrations, associations |
| **Primary DB** | PostgreSQL (via Supabase) | Managed relational database |
| **Secondary DB** | MongoDB | Flexible document storage |
| **Cache** | Redis 7 | Sessions, OTP storage, rate limiting |
| **Message Broker** | RabbitMQ | Async event-driven communication |
| **API Gateway** | Nginx | Routing, rate limiting, CORS, SSL |
| **Auth** | JWT (access + refresh tokens) | Stateless authentication |
| **AI** | Google Gemini + Plant.id | Disease detection, soil analysis |
| **Payments** | Razorpay | Indian payment gateway |
| **File Storage** | Cloudinary | Image and file uploads |
| **Email** | Brevo (Nodemailer) | Transactional emails |
| **SMS** | Fast2SMS | OTP delivery to farmers |
| **Logging** | Winston | Structured JSON logging |
| **Monitoring** | Prometheus + Grafana | Metrics, dashboards, alerting |
| **CI/CD** | Jenkins → AWS EC2 | Automated deployment pipeline |
| **Containers** | Docker + Docker Compose | Consistent dev/prod environments |

## Documentation Index

| Document | What's Inside |
|----------|--------------|
| [Architecture Guide](./microservices/ARCHITECTURE.md) | How services connect, request flows, data ownership |
| [Developer Setup Guide](./microservices/DEVELOPER_GUIDE.md) | Day 1 setup, daily workflow, coding patterns |
| [Contributing Guide](./microservices/CONTRIBUTING.md) | Branch names, commit format, PR checklist |
| [API Reference](./microservices/docs/API_REFERENCE.md) | Every endpoint from all 15 services |
| [Database Schema](./microservices/docs/DATABASE.md) | All 39 Sequelize models explained |
| [Deployment Guide](./microservices/docs/DEPLOYMENT.md) | Docker, Jenkins CI/CD, SSL setup |
| [Troubleshooting](./microservices/docs/TROUBLESHOOTING.md) | Common errors and how to fix them |

Each service also has its own README inside `services/<service-name>/README.md`.

## Key Contacts

| Topic | Ask |
|-------|-----|
| Architecture & backend | _[Tech Lead]_ |
| Frontend & UI | _[Frontend Lead]_ |
| Database & schema | _[Backend Lead]_ |
| Deployment & DevOps | _[DevOps Lead]_ |
| Farming domain | _[Agriculture Expert]_ |

---

_Built with ❤️ for Indian farmers_
