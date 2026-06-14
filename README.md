# Kissan Mithar Consultancy (KMC)

## Project Overview
Kissan Mithar Consultancy (KMC) is a comprehensive agricultural technology platform designed to support farmers and agricultural stakeholders. The project is structured as a robust microservices architecture comprising 15 specialized backend services, an API Gateway (Nginx), a React web frontend, and a Flutter/Dart mobile application.

## Problem Statement
Farmers often lack centralized access to critical agricultural data such as weather forecasts, soil reports, crop disease diagnosis, expert consultations, and direct marketplace access. KMC aims to solve this fragmentation by providing an all-in-one platform where users can seamlessly access AI-driven diagnoses, expert advice, and e-commerce functionalities through a single ecosystem.

## Features
- **AI-Powered Disease Diagnosis**: Users can upload images of crops for AI-driven disease detection (integrated with Plant.id and Gemini).
- **Expert Consultations**: Booking engine for consulting with agricultural experts.
- **E-Commerce & Orders**: Complete marketplace for buying and selling fertilizers, equipment, and crops.
- **Soil Analysis & Reminders**: Managing soil health reports and automated reminders.
- **Market Prices & History**: Integration with data.gov.in for real-time Mandi market prices.
- **Notifications**: Automated SMS (Fast2SMS) and Email notifications.

## Technology Stack
- **Backend Architecture**: Node.js microservices (15+ services).
- **Databases**: 
  - PostgreSQL (via Supabase) using Sequelize ORM for structured relational data.
  - MongoDB for flexible/document data.
  - Redis for caching.
- **Message Broker**: RabbitMQ for asynchronous event-driven communication between microservices.
- **Frontend**: React (Web) and Flutter (Mobile).
- **Infrastructure**: Docker & Docker Compose, Nginx (API Gateway).
- **CI/CD**: Jenkins pipeline deploying to AWS EC2.

## Architecture Overview
The application follows an Event-Driven Microservices pattern. All services share common logic through a `@kissan/shared` and `@kissan/events` private package system. Nginx acts as the API Gateway, routing incoming `/api/*` requests to the respective microservice. Asynchronous tasks (like sending emails after an order) are published to RabbitMQ to decouple services.

## Database Design Summary
The primary source of truth is PostgreSQL using Sequelize models (approx. 40 tables). The schema heavily uses UUID primary keys and JSONB fields for dynamic data (like cart data). Constraints such as `allowNull: false` and `unique: true` are enforced at the database level. MongoDB is also connected for specific services requiring schema-less document storage.

## Installation Instructions

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose
- Git

### Environment Variables
Create a `.env` file in the `microservices` directory using the provided `.env.example`. Key variables required:
- `SUPABASE_URL`, `SUPABASE_REST_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `MONGODB_URI`
- `RABBITMQ_USER`, `RABBITMQ_PASS`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- API Keys: `GEMINI_API_KEY`, `PLANT_ID_API_KEY`, `RAZORPAY_KEY_ID`, `DATA_GOV_API_KEY`

### Local Development Setup
1. Clone the repository: `git clone <repo_url>`
2. Navigate to the microservices folder: `cd microservices`
3. Install shared dependencies: `npm install` (this will install `@kissan/shared` across workspaces)
4. Start the infrastructure (Redis, RabbitMQ) and services: `docker compose up -d`
5. The API Gateway will be available at `http://localhost:80`.

### Build and Deployment Instructions
The project utilizes a `Jenkinsfile` for automated CI/CD. 
1. Merging to the `main` branch triggers the Jenkins pipeline.
2. The pipeline SSHs into the target AWS EC2 instance (`65.1.198.122`).
3. It pulls the latest code, copies the `.env` file, and executes `docker compose -f docker-compose.prod.yml up -d --build`.

### Testing Instructions
To run tests across all workspaces:
```bash
cd microservices
npm test --workspaces --if-present
```

### CSV Import Workflow
**Missing Requirement**: There is currently no evidence of a CSV ingestion or parsing workflow in the repository (e.g., using `csv-parser` or `fast-csv`). To implement this, a dedicated route in the relevant microservice (e.g., `market-service` or `ecommerce-service`) needs to be created to parse uploaded files, validate data streams, and bulk insert records.

## Assumptions
- It is assumed that the `mongodb` connection is used alongside Supabase, meaning the system is in a transitional polyglot persistence phase.
- It is assumed the frontend connects directly to `localhost:80` for local dev based on the Nginx configuration.

## AI Tools Used During Development
Evidence suggests the use of AI tools (like GitHub Copilot, Cursor, or ChatGPT) for scaffolding the 15 microservices rapidly and generating the comprehensive Docker/Jenkins configurations.

## Known Limitations
- The application relies heavily on 3rd-party APIs (Plant.id, Gemini). Rate limiting on these free tiers could break functionality.
- CSV bulk import is currently unsupported.
