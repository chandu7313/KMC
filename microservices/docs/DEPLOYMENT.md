# 🚀 Deployment Guide

> How to deploy KMC to production on AWS EC2.

## Architecture (Production)

```
Internet
   │
   ▼
kissanmithar.com (:443 SSL)
   │
   ▼
Nginx (API Gateway + static frontend)
   │
   ├── /api/*     → Docker services (:3001-3015)
   └── /*         → React build (served by frontend container)
   │
   ├── Redis      → Docker (local)
   ├── RabbitMQ   → CloudAMQP (managed) or Docker (local)
   ├── PostgreSQL → Supabase (managed cloud)
   └── MongoDB    → MongoDB Atlas (managed cloud)
```

## Prerequisites

- AWS EC2 instance (Ubuntu 22.04, t3.medium or larger)
- Docker & Docker Compose installed on EC2
- Domain name pointing to EC2 IP (kissanmithar.com)
- Supabase project created
- MongoDB Atlas cluster created
- RabbitMQ instance (CloudAMQP or self-hosted)

## Step 1: Prepare the Server

```bash
# SSH into your EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Verify
docker --version
docker compose version
```

## Step 2: Clone & Configure

```bash
git clone https://github.com/your-org/kissan-mithar.git
cd kissan-mithar/microservices

# Copy and configure production env
cp .env.example .env
nano .env
# Set NODE_ENV=production
# Set all real API keys, database URLs, etc.
# Set ENABLE_SMS=true for real SMS
# Set real Razorpay production keys
```

## Step 3: SSL Certificate (Let's Encrypt)

```bash
# First, start Nginx without SSL to get certificate
docker compose up -d nginx

# Run Certbot
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d kissanmithar.com \
  -d www.kissanmithar.com

# Enable SSL in Nginx config
# Rename nginx/conf.d/ssl.conf.disabled to ssl.conf
mv nginx/conf.d/ssl.conf.disabled nginx/conf.d/ssl.conf

# Restart Nginx
docker compose restart nginx
```

## Step 4: Build & Deploy

```bash
# Build all images
docker compose -f docker-compose.prod.yml build

# Start everything
docker compose -f docker-compose.prod.yml up -d

# Verify
docker compose ps
curl https://kissanmithar.com/health
```

## Step 5: Seed Production Data (First Deploy Only)

```bash
docker compose exec auth-service node scripts/seedDevAccounts.js
```

## Jenkins CI/CD Pipeline

The project uses Jenkins for automated deployments:

```
Developer pushes to 'main' branch
         │
         ▼
Jenkins detects push (webhook)
         │
         ▼
Pipeline stages:
  1. Checkout code
  2. Run tests (docker-compose -f docker-compose.test.yml)
  3. SSH into EC2 (65.1.198.122)
  4. Pull latest code
  5. Copy .env file
  6. docker compose -f docker-compose.prod.yml up -d --build
  7. Health check verification
```

### Jenkinsfile Location

The Jenkinsfile should be at the repository root. It SSHs into the target EC2 and runs:

```bash
cd /home/ubuntu/kissan-mithar/microservices
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

## Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Development (all services + infra) |
| `docker-compose.prod.yml` | Production (optimized, prod settings) |
| `docker-compose.test.yml` | Test runner |
| `monitoring/docker-compose.monitoring.yml` | Prometheus + Grafana + AlertManager |

## Monitoring Stack

```bash
# Start monitoring
make monitoring-up
# or: docker compose -f monitoring/docker-compose.monitoring.yml up -d

# Access dashboards
# Grafana:       http://your-server:3100
# Prometheus:    http://your-server:9090
# AlertManager:  http://your-server:9093

# Check monitoring health
make monitoring-health
```

### Grafana Default Credentials

```
Username: admin
Password: (set in .env as GRAFANA_ADMIN_PASSWORD)
```

## Environment Variables (Production Checklist)

| Variable | Production Value |
|----------|-----------------|
| `NODE_ENV` | `production` |
| `ENABLE_SMS` | `true` |
| `SUPABASE_REST_URL` | Your production Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Production service role key |
| `MONGODB_URI` | Production MongoDB Atlas URI |
| `RABBITMQ_URL` | Production RabbitMQ URL |
| `JWT_SECRET` | Strong random 64-char string |
| `RAZORPAY_KEY_ID` | Live key (not test key!) |
| `RAZORPAY_KEY_SECRET` | Live secret |
| `FAST2SMS_API_KEY` | Production API key |
| `GEMINI_API_KEY` | Production API key |
| `REACT_APP_API_URL` | `https://kissanmithar.com` |
| `REACT_APP_SHOW_DEV_LOGIN` | `false` |
| `ALLOWED_ORIGINS` | `https://kissanmithar.com` |

## Rollback Procedure

```bash
# If deployment fails:

# 1. Check which service crashed
docker compose ps
docker compose logs failing-service

# 2. Rollback to previous version
git log --oneline -5          # Find the last good commit
git checkout <good-commit>
docker compose -f docker-compose.prod.yml up -d --build

# 3. Or restart specific service
docker compose restart auth-service
```

## Backup Strategy

- **PostgreSQL**: Supabase handles automated backups
- **MongoDB**: Atlas handles automated backups
- **Redis**: Data is ephemeral (cache + sessions), no backup needed
- **RabbitMQ**: If CloudAMQP, managed backups; if self-hosted, export definitions

## Health Monitoring

All services expose `/health` and `/metrics` endpoints:

```bash
# Quick health check of all services
for port in $(seq 3001 3015); do
  status=$(curl -sf http://localhost:$port/health | jq -r '.status' 2>/dev/null)
  echo "Port $port: ${status:-DOWN}"
done
```

## Common Deployment Issues

| Issue | Solution |
|-------|---------|
| Container keeps restarting | Check `docker logs kmc-auth` for startup errors |
| SSL certificate expired | Run `docker compose run --rm certbot renew` |
| Out of disk space | `docker system prune -f` to clean unused images |
| Port already in use | `lsof -i :80` to find conflicting process |
| RabbitMQ connection refused | Check RABBITMQ_URL, ensure RabbitMQ is running |
| Supabase connection timeout | Check SUPABASE_REST_URL, verify network access |
