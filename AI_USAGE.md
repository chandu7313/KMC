# AI Usage Disclosure

## AI Tools Used

Based on the structure, commit history, and rapid scaffolding of massive configuration files, there is strong evidence of heavy AI tooling usage during development. 

* **ChatGPT / Claude**: Likely used for architectural design and complex DevOps scripting. The 200+ line declarative `Jenkinsfile` and the 700+ line `docker-compose.yml` orchestrating 15 services + Nginx are classic outputs of zero-shot LLM prompts asking for "a complete microservices docker-compose architecture."
* **Cursor / GitHub Copilot**: Evident from the highly repetitive but structurally sound scaffolding of the 15 microservices (`ai-service`, `disease-service`, `soil-service`, etc.), which all share identical internal directory structures (`src/config`, `src/events`, `src/utils`).

## Likely Development Prompts

Inferred prompts used to generate major portions of the code:
1. *"Write a declarative Jenkins pipeline to deploy a docker-compose stack to an AWS EC2 instance via SSH. Pull the code from GitHub, copy an environment file from Jenkins secrets, and run docker compose up."*
2. *"Generate a docker-compose.yml for a Node.js microservices architecture. It should include Nginx as an API gateway, Redis, RabbitMQ, and 15 distinct services (auth, user, ai, disease, etc.) passing the same environment variables to all of them."*
3. *"Create a Sequelize schema for an agricultural platform. Include models for Users, SupportTickets, ExpertConsultations, SoilReports, and E-commerce products."*

## AI Mistakes Review

Below are 3 realistic cases where AI-generated code was likely incorrect in this project context, based on actual Git commit history and common LLM hallucinations.

### 1. Tailwind / Node Native Bindings in Docker
- **Generated Suggestion**: AI typically suggests a standard `npm install` or `npm ci` within a Dockerfile without accounting for OS architecture differences between the host machine and the Linux container.
- **Why it was incorrect**: The host machine (likely a Mac) built `package-lock.json` with Mac-specific native bindings for Tailwind CSS (`@tailwindcss/oxide`). When `npm ci` was run inside the Linux Docker container, it crashed looking for Mac binaries.
- **How it could be detected**: The CI pipeline fails during the Docker build stage with a native binding error for `esbuild` or `tailwindcss`.
- **Correct Implementation**: Running `rm package-lock.json && npm install` inside the container (as seen in commit `c323951`) to force the resolution of Linux-native optional dependencies.
- **Risk if not fixed**: Completely broken deployment pipeline; frontend fails to build.

### 2. CORS and API Gateway Port Mapping
- **Generated Suggestion**: AI likely generated an Nginx config routing to `http://frontend:3000` but mapped the frontend container port incorrectly, or suggested absolute paths for API calls in the React app (e.g. `http://localhost:3001/api/auth`).
- **Why it was incorrect**: Inside a docker network, frontend API calls made from the user's *browser* must hit the public API Gateway (port 80), not the internal Docker DNS (`http://auth-service:3001`). 
- **How it could be detected**: Opening the React app in a browser results in `CORS error` or `ERR_CONNECTION_REFUSED` in the network tab.
- **Correct Implementation**: Changing API requests to use relative paths (`/api/auth`) so they hit the Nginx gateway naturally on the same origin (seen in commit `8106074`).
- **Risk if not fixed**: Frontend cannot communicate with the backend at all.

### 3. Non-existent Fields in Database Queries
- **Generated Suggestion**: An AI autocompleted a query like `Consultation.findAll({ order: [['scheduledAt', 'DESC']] })` because `scheduledAt` is a semantically logical column name for a consultation.
- **Why it was incorrect**: The Sequelize model defined the timestamp as `createdAt`, not `scheduledAt`. AI hallucinates column names if it loses context of the exact schema.
- **How it could be detected**: A 500 Internal Server Error when hitting the consultation API endpoint, with Sequelize throwing `Unknown column 'scheduledAt' in 'order clause'`.
- **Correct Implementation**: Replacing `scheduledAt` with the actual database field `createdAt` (seen in commit `457f0d9`).
- **Risk if not fixed**: Broken API endpoints leading to degraded user experience.

## Human Verification Process

To prevent AI-introduced bugs, the following review process is recommended:
1. **Schema Cross-Referencing**: Never trust AI-generated queries blindly. Always cross-reference generated `.findAll()` or `.findOne()` queries against the actual `shared/models/` definitions.
2. **Local Environment Parity**: Spin up the *entire* `docker-compose.yml` locally to test networking constraints (CORS, Nginx routing) before pushing to Jenkins.
3. **Dependency Audits**: Review AI-suggested `package.json` updates. Ensure versions match across the workspaces to prevent `node_modules` bloat.
