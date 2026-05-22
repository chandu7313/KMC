# 🌾 Kissan Mithar Consultancy (KMC) — Enterprise Platform

Welcome to the **KMC (Kissan Mithar Consultancy)** project repository. KMC is a state-of-the-art, production-grade agricultural platform designed to bridge the "Knowledge-Action Gap" for farmers. 

The platform connects farmers with scientific crop diagnostics, real-time market prices, on-demand field-officer bookings, and a direct-to-farmer agricultural marketplace.

> [!NOTE]
> This project has evolved from a monolithic backend into a fully containerized **15-Microservices Architecture** leveraging **RabbitMQ** event routing, **Redis** caching, **PostgreSQL (Sequelize ORM)**, **MongoDB (Mongoose)**, and **Nginx** API Gateway.

---

## 📖 Table of Contents
1. [Project Overview & Business Impact](#-project-overview--business-impact)
2. [Technology Stack](#-technology-stack)
3. [System Architecture](#-system-architecture)
4. [Detailed Microservices Registry](#-detailed-microservices-registry)
5. [Database & Data Architecture](#-database--data-architecture)
6. [Repository & Project Structure](#-repository--project-structure)
7. [Running the Platform Locally](#-running-the-platform-locally)
8. [Monitoring & Observability](#-monitoring--observability)
9. [CI/CD & Deployment](#-cicd--deployment)
10. [References & Supplementary Docs](#-references--supplementary-docs)

---

## 💡 Project Overview & Business Impact

Farmers face massive information asymmetry, inefficient supply chains, and limited access to agronomy experts. KMC solves these core problems:
* **Information Asymmetry:** Combated via automated soil health assessments, crop selection advisory, and real-time disease detection (powered by Gemini & Plant.id APIs).
* **Supply Chain Inefficiencies:** Addressed by a decentralized marketplace for fertilizers and farming equipment, cutting out exploitative middle-men.
* **Advisory Accessibility:** Integrated booking system allowing farmers to schedule physical/virtual farm visits with qualified Field Officers.

---

## 🛠 Technology Stack

### Frontend Applications
* **Web Client:** React.js (Vite), Tailwind CSS, React Router DOM, Recharts, React Toastify, Axios


### Backend Microservices
* **Core Environment:** Node.js, Express.js
* **Event Broker:** RabbitMQ (AMQP) for asynchronous, message-driven service communication
* **Caching & Rate-Limiting:** Redis (in-memory caching and session validation)
* **API Gateway:** Nginx for unified routing, CORS, and SSL termination

### Databases
* **Relational Database:** PostgreSQL (hosted on Supabase) utilizing **Sequelize ORM** with 36 custom-mapped models
* **Document Database:** MongoDB Atlas using **Mongoose ODM** for unstructured documents, logs, and telemetry

---

## 📐 System Architecture

All traffic from the Web client targets the **Nginx API Gateway** on ports `80` (HTTP) or `443` (HTTPS). Nginx acts as a reverse proxy, routing requests to the appropriate backend microservice based on paths (e.g. `/api/v1/auth` -> Auth Service).

```mermaid
graph TD
    %% Define Styles
    classDef client fill:#e1f5fe,stroke:#0288d1,stroke-width:2px;
    classDef gateway fill:#fff3e0,stroke:#f57c00,stroke-width:2px;
    classDef service fill:#e8f5e9,stroke:#388e3c,stroke-width:2px;
    classDef infra fill:#fce4ec,stroke:#c2185b,stroke-width:2px;
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,stroke-dasharray: 5 5;

    %% Client Layer
    subgraph Clients["Client Layer"]
        Web("Frontend Web App<br>(React/Vite)<br>Port: 3000"):::client

    end

    %% Gateway Layer
    Gateway{"Nginx API Gateway<br>Port: 80 / 443"}:::gateway

    %% Microservices Layer
    subgraph Microservices["Microservices Layer (Ports: 3001-3015)"]
        direction LR
        subgraph Core
            Auth("Auth Service<br>:3001"):::service
            User("User Service<br>:3002"):::service
            Notif("Notification Service<br>:3010"):::service
        end
        subgraph AI_Agronomy["AI & Agronomy"]
            AI("AI Service<br>:3003"):::service
            Disease("Disease Service<br>:3004"):::service
            Soil("Soil Service<br>:3005"):::service
            Field("Field Service<br>:3015"):::service
        end
        subgraph Commerce["E-Commerce"]
            Market("Market Service<br>:3006"):::service
            Ecom("Ecommerce Service<br>:3007"):::service
            Order("Order Service<br>:3008"):::service
            Payment("Payment Service<br>:3009"):::service
        end
        subgraph Content_Support["Content & Support"]
            Support("Support Service<br>:3011"):::service
            Expert("Expert Service<br>:3012"):::service
            Content("Content Service<br>:3013"):::service
            Analytics("Analytics Service<br>:3014"):::service
        end
    end

    %% Infrastructure Layer
    subgraph Infrastructure["Infrastructure Layer"]
        Redis[("Redis<br>Cache & Session<br>Port: 6379")]:::infra
        RMQ[("RabbitMQ<br>Message Broker<br>Port: 5672/15672")]:::infra
    end

    %% External Services
    subgraph External["External Services / Databases"]
        Postgres[("PostgreSQL DB<br>(Sequelize ORM)")]:::external
        Mongo[("MongoDB Atlas<br>(Mongoose ODM)")]:::external
        Cloudinary("Cloudinary<br>(Image Hosting)"):::external
        Gemini("Google Gemini / Plant.id<br>(AI APIs)"):::external
        Razorpay("Razorpay API<br>(Payments)"):::external
        SMS("Fast2SMS / SMTP<br>(Notifications)"):::external
    end

    %% Connections
    Web -->|HTTP/REST| Gateway

    
    Gateway -->|Reverse Proxy| Microservices
    
    %% Service to Infra
    Microservices <-->|Cache/Session| Redis
    Microservices <-->|Async Events| RMQ

    %% Service to External
    Microservices -->|Read/Write| Postgres
    Microservices -->|Read/Write| Mongo
    Disease --> Cloudinary
    Soil --> Cloudinary
    Ecom --> Cloudinary
    Content --> Cloudinary
    AI --> Gemini
    Payment --> Razorpay
    Notif --> SMS
```

---

## 📦 Detailed Microservices Registry

The backend contains **15 microservices** located in the `services/` directory. Each microservice is an independent Node.js process:

| Service | Port | Primary Responsibilities | Main Dependencies / Integrations |
| :--- | :--- | :--- | :--- |
| **Auth Service** | `3001` | User signup/login, MFA, SMS/Email OTP generation, JWT token issuance. | Redis, [Auth Shared Module](file:///Volumes/My%20Files/Projects/KMC/microservices/packages/shared/auth) |
| **User Service** | `3002` | User profiles, address book, role assignment, registration verification. | PostgreSQL (Sequelize) |
| **AI Service** | `3003` | Contextual AI chat, prompt generation, LLM tuning. | Google Gemini AI SDK |
| **Disease Service** | `3004` | Crop disease identification from image uploads, treatment recommendations. | Plant.id API, Cloudinary |
| **Soil Service** | `3005` | Processing soil quality metrics (NPK values) to recommend appropriate crops/fertilizers. | Cloudinary, AI Service |
| **Market Service** | `3006` | Fetching commodity prices, mandi rates, historical trends. | Data.gov.in API |
| **Ecommerce Service** | `3007` | Managing agricultural inputs (fertilizers, equipment, seeds) catalog and inventory. | Cloudinary, PostgreSQL |
| **Order Service** | `3008` | Cart management, order creation, tracking checkout workflows, inventory reservation. | RabbitMQ, PostgreSQL |
| **Payment Service** | `3009` | Processing checkout payments, creating orders, validating transaction signatures. | Razorpay Gateway |
| **Notification Service** | `3010` | Sending SMS and SMTP emails asynchronously based on event queues. | Fast2SMS, Brevo/Nodemailer, RabbitMQ |
| **Support Service** | `3011` | Customer support ticketing, FAQs management, feedback submission. | MongoDB (telemetry) |
| **Expert Service** | `3012` | Managing consultation bookings between farmers and Field Officers/Advisors. | PostgreSQL, RabbitMQ |
| **Content Service** | `3013` | Publishing blogs, agricultural newsletters, successful farming stories. | Cloudinary, MongoDB |
| **Analytics Service** | `3014` | Compiling platform metrics, revenue tracking, and order data for the Admin Dashboard. | PostgreSQL & MongoDB |
| **Field Service** | `3015` | Tracking individual farm boundaries, crop calendars, and field-level tasks. | MongoDB |

---

## 🗄 Database & Data Architecture

KMC implements a dual-database architecture to match document-based logs with strictly structured, relational transactional data.

### 1. PostgreSQL (Sequelize ORM)
All transactional data is stored in PostgreSQL and mapped using **Sequelize**. 36 distinct tables/models are defined in the shared package:
* Core models like `User`, `Product`, `Order`, `OrderItem`, `Booking`, `Address`, `PaymentTransaction`, etc.
* Eager loading is configured (`include`) to resolve complex relationships like joining `Order -> OrderItem -> Product` in a single query, eliminating legacy API round-trip issues.
* Database initialization, models, and shared utilities are packaged under [packages/shared/database/](file:///Volumes/My%20Files/Projects/KMC/microservices/packages/shared/database/) and [packages/shared/models/](file:///Volumes/My%20Files/Projects/KMC/microservices/packages/shared/models/).

### 2. MongoDB (Mongoose ODM)
Unstructured data (like AI chats, weather insights, field mappings, support tickets, and system logs) is stored in MongoDB via Mongoose schemas.

---

## 📁 Repository & Project Structure

The project is structured as a monorepo under the `microservices` folder:

```
KMC/
├── Jenkinsfile                      # Jenkins CD Pipeline script
├── architecture_overview.md         # Detailed architectural design doc
├── deployment_guide.md              # Docker-compose local launch reference
├── deployment_guide_aws.md          # Comprehensive AWS EC2, Jenkins, GHA deployment guide
├── render.yaml                      # Backup deployment file
└── microservices/                   # Root Monorepo
    ├── .env                         # Centralized local environment configuration
    ├── docker-compose.yml           # Local Orchestrator (Development Mode)
    ├── docker-compose.prod.yml      # Local Orchestrator (Production Mode)
    ├── Makefile                     # Build & orchestration shortcuts
    ├── nginx/                       # Nginx gateway setup and reverse proxy configs
    ├── monitoring/                  # Prometheus and Grafana setup
    ├── frontend/                    # Client Applications
    │   ├── web/                     # React/Vite Frontend

    ├── packages/                    # Shared internal NPM packages
    │   ├── shared/                  # Logger, Sequelize models, Auth middleware, Custom errors
    │   ├── database/                # Legacy SQL generation & migration scripts
    │   └── events/                  # RabbitMQ channel helpers
    └── services/                    # Microservices
        ├── auth-service/
        ├── user-service/
        └── ... (all 15 services)
```

---

## 🚀 Running the Platform Locally

To spin up the entire platform, you must have **Docker Desktop** installed. 

### 1. Configure the Environment Variables
Create a `.env` file inside the `microservices/` directory. Use [microservices/.env.example](file:///Volumes/My%20Files/Projects/KMC/microservices/.env.example) as a reference:

```ini
# App Config
NODE_ENV="development"
LOG_LEVEL=debug

# Databases
DATABASE_URL="postgresql://user:pass@host:port/database"
MONGODB_URI="mongodb+srv://..."
REDIS_URL="redis://localhost:6379"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# API Gateways & Credentials
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_gemini_key"
RAZORPAY_KEY_ID="your_razorpay_key"
```
> [!IMPORTANT]
> The deprecated `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` have been completely removed. The system connects directly to your SQL database using standard connection pools via `DATABASE_URL` / `SUPABASE_URL`.

### 2. Orchestration using Make (Recommended)
Navigate to the `microservices/` directory:

```bash
# Start all 15 microservices, databases, gateways, and the Web frontend
make up

# Rebuild all docker images (run this if you update package.json dependencies)
make rebuild

# Follow combined logs of all running services
make logs

# View logs for a specific service (e.g. auth-service)
make logs-auth

# Stop the entire stack and tear down the containers
make down

# Clean up all containers, system volumes, and dangling resources
make clean
```

### 3. Run with raw Docker-Compose
If `make` is not installed on your system, execute the following from `microservices/`:
```bash
# Run in background
docker-compose up -d

# Stop containers
docker-compose down
```

---

## 📊 Monitoring & Observability

KMC includes full monitoring support via **Prometheus** and **Grafana** (configured under [microservices/monitoring/](file:///Volumes/My%20Files/Projects/KMC/microservices/monitoring/)).

* **Prometheus:** Pulls application performance metrics, CPU utilization, request throughput, and active connection volumes from each microservice's `/metrics` endpoint.
* **Grafana:** Visualizes metrics on live dashboards.
* **Ports:**
  * **Prometheus UI:** `http://localhost:9090`
  * **Grafana Dashboard:** `http://localhost:3100` (Default credentials configured in `.env`).

---

## 🔄 CI/CD & Deployment

Deployments are fully automated for enterprise scaling:
* **Continuous Integration (CI):** Triggered on GitHub pull requests. Runs code linting, tests, and formatting checks using GitHub Actions.
* **Continuous Deployment (CD):** Managed by **Jenkins** (orchestrated via [Jenkinsfile](file:///Volumes/My%20Files/Projects/KMC/Jenkinsfile)). On pushes to the `main` branch, Jenkins compiles Docker containers and deploys them to AWS EC2 instances behind security group firewalls.

---

## 🔗 References & Supplementary Docs

For deeper dives into individual layers, refer to:
* 📐 **System Topology:** Detailed port registry, API reverse proxies, and asynchronous events routing are documented in [architecture_overview.md](file:///Volumes/My%20Files/Projects/KMC/architecture_overview.md).
* 🐳 **Local Deployment Guide:** Specific command variations and troubleshooting tips are available in [deployment_guide.md](file:///Volumes/My%20Files/Projects/KMC/deployment_guide.md).
* ☁️ **AWS Cloud & DevOps Guide:** Jenkins workflows, Webhook setups, EC2 Ubuntu configurations, and GHA pipelines are structured step-by-step in [deployment_guide_aws.md](file:///Volumes/My%20Files/Projects/KMC/deployment_guide_aws.md).
