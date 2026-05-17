# KMC Deployment Guide

Managing 15 microservices manually would be impossible. Fortunately, this project uses **Docker Compose** as an orchestrator. Docker Compose reads the `.yml` files and automatically builds, networks, and starts all the services, databases, and message brokers together in the correct order.

You have two main deployment environments configured in this repository: **Development** and **Production**.

> [!TIP]
> Make sure you have Docker Desktop installed and running on your machine before running any of these commands. Also, ensure your `.env` file is properly configured in the `microservices/` directory.

---

## 🚀 The Easiest Way: Using `Make`

The project includes a `Makefile` which acts as a shortcut for complex Docker commands. You must run these commands from inside the `/microservices` directory.

### Development Environment (Hot-reloading enabled)

Run this when you are writing code and want to see changes immediately.

```bash
# Start everything in the background
make up

# Rebuild all containers (run this if you add new npm packages)
make rebuild

# View logs for all services in real-time
make logs

# View logs for a specific service (e.g., auth-service)
make logs-auth

# Stop everything gracefully
make down

# Completely wipe everything (stops containers and deletes volumes/databases)
make clean
```

### Production Environment (Optimized, no hot-reloading)

Run this when you want to test how the app will behave on a real server, with resource limits and replicas enabled.

```bash
# Build production images
make prod-build

# Start production environment in the background
make prod-up

# Stop production environment
make prod-down
```

---

## 🐳 Manual Docker Compose Commands

If you prefer not to use `make` (or if you are on a system without `make` installed), you can use the raw Docker Compose commands directly from the `microservices/` directory.

### Start Development
```bash
docker-compose up -d
```
*(The `-d` flag means "detached mode", so it runs in the background and frees up your terminal).*

### Start Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```
*(The `-f` flag tells Docker to use the specific production file instead of the default development one).*

### Stop and Remove Containers
```bash
docker-compose down
```

### Rebuild and Restart a Single Service
If you only made changes to one service (e.g., `ai-service`) and want to restart *only* that service:
```bash
docker-compose up -d --build ai-service
```

---

## 🌐 Accessing the Application

Once you run `make up` or `docker-compose up -d`, you don't need to worry about the internal ports (3001, 3002, etc). 

Everything routes through the **Nginx Gateway**:
- **Frontend Web App**: Navigate to `http://localhost:3000`
- **Backend API Base URL**: Navigate to `http://localhost/api/v1/...` (The gateway automatically routes this to the correct microservice based on the URL path).
- **RabbitMQ Management UI**: Navigate to `http://localhost:15672` (Username/Password is in your `.env` file).

---

## 🛠️ Troubleshooting

> [!WARNING]
> **"Ports are already allocated" Error:**
> If you get an error saying a port is already in use, it means another application (or an old Docker container) is running on that port. Run `make down` or `docker-compose down` first, and ensure no local node servers are running.

> [!IMPORTANT]
> **Services Crashing:**
> If a service keeps restarting, it's usually a missing environment variable or a database connection issue. 
> Run `docker-compose logs -f <service-name>` (e.g., `docker-compose logs -f auth-service`) to see the exact error throwing inside the container.
