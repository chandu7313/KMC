# Architectural & Implementation Decision Log

This document outlines the significant technical and architectural decisions made during the development of the Kissan Mithar Consultancy (KMC) project, based on evidence from the repository structure, configuration files, and Git history.

---

### 1. API Architecture: Event-Driven Microservices
- **Decision**: Architect the backend as 15 distinct microservices (auth, user, ai, disease, soil, market, etc.) communicating asynchronously via RabbitMQ, with a synchronous API Gateway (Nginx).
- **Context**: The KMC platform encompasses diverse domains (e-commerce, AI diagnosis, expert consulting, soil analysis). A monolith would likely become a bottleneck for team collaboration and independent scaling.
- **Options considered**: 
  - Single Node.js Monolith.
  - Serverless Functions (AWS Lambda).
  - Event-Driven Microservices.
- **Chosen option**: Event-Driven Microservices.
- **Trade-offs**: 
  - *Pros*: Independent scalability (e.g., AI service can scale independently of the User service), separation of concerns, fault isolation.
  - *Cons*: High operational complexity, challenging local development setup (requires running 15 containers + Redis + RabbitMQ), difficult to maintain data consistency across services.
- **Evidence**: The presence of `microservices/services/*` containing 15 discrete folders, each with its own `Dockerfile`, and the extensive `docker-compose.yml` orchestrating them behind Nginx.

### 2. Shared Code Strategy
- **Decision**: Create private npm packages (`@kissan/shared`, `@kissan/events`) via npm workspaces to share logic.
- **Context**: 15 microservices will naturally duplicate a massive amount of code (error handling, DB models, logging, response formatting).
- **Options considered**: 
  - Copy-pasting boilerplate into each service.
  - Git submodules.
  - Monorepo with npm workspaces/Lerna.
- **Chosen option**: Monorepo with npm workspaces.
- **Trade-offs**: 
  - *Pros*: Ensures consistency across all services (e.g., a single `HttpError` class), reduces boilerplate.
  - *Cons*: Updating a shared model requires rebuilding and redeploying all services that depend on it.
- **Evidence**: The `microservices/packages/shared` directory and `package.json` utilizing local `file:../../packages/shared` references.

### 3. Database Selection & ORM
- **Decision**: Use Supabase (PostgreSQL) managed via Sequelize ORM as the primary datastore, while also connecting to MongoDB.
- **Context**: The platform needs to store structured relational data (users, orders, payments) and potentially unstructured/document data.
- **Options considered**: 
  - Pure NoSQL (MongoDB/Mongoose).
  - Pure SQL (PostgreSQL/Prisma).
  - Polyglot Persistence (SQL + NoSQL).
- **Chosen option**: Polyglot Persistence utilizing Supabase/Sequelize for relational logic and MongoDB for flexible data.
- **Trade-offs**: 
  - *Pros*: Best tool for the job depending on the service.
  - *Cons*: Fragmented data models, increased infrastructure overhead, lack of cross-database transactions.
- **Evidence**: `.env.example` contains both `SUPABASE_URL` and `MONGODB_URI`. `microservices/packages/shared/models` exports `sequelize.define` schemas.

### 4. Deployment Platform & CI/CD
- **Decision**: Use Jenkins for CI/CD, deploying Docker Compose directly to an AWS EC2 instance.
- **Context**: Need a reliable, automated way to get the 15 microservices from GitHub to a server.
- **Options considered**: 
  - GitHub Actions to AWS ECS/EKS.
  - Vercel/Render (PaaS).
  - Jenkins SSH deployment to raw EC2.
- **Chosen option**: Jenkins SSH deployment to EC2 using `docker-compose.prod.yml`.
- **Trade-offs**: 
  - *Pros*: Complete control over infrastructure, predictable costs (single EC2 instance).
  - *Cons*: "Pets vs Cattle" problem (managing a single EC2 instance manually), no zero-downtime rolling updates natively supported by basic Docker Compose on a single node.
- **Evidence**: The comprehensive `Jenkinsfile` at the root of the repository executing `ssh -o StrictHostKeyChecking=no ... 'docker compose up -d'`.

### 5. CSV Ingestion Strategy
- **Decision**: Defer implementation.
- **Context**: The system handles large datasets (e.g., Data.gov.in market prices), which typically require CSV bulk imports.
- **Chosen option**: No CSV parsing logic implemented natively in the codebase yet.
- **Trade-offs**: 
  - *Pros*: Saved development time for MVP.
  - *Cons*: Admins must manually input data or rely entirely on external API syncing, limiting the ability to bootstrap the database quickly.
- **Evidence**: `find` and `grep` commands across the repository revealed zero dependencies on `csv-parse`, `fast-csv`, or any native CSV parsing utility within the active Node.js services.

### 6. Validation Strategy
- **Decision**: Schema-based validation using Joi (Inferred).
- **Context**: Microservices must reject malformed data before hitting the database to prevent crashes and ensure data integrity.
- **Evidence**: The `user-service/package.json` explicitly lists `joi: ^17.13.3` as a dependency, and there are `validators/` folders in the service directories.
