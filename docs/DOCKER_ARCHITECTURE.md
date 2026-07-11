# KMC Docker Architecture

KMC relies heavily on Docker and Docker Compose to containerize 15 distinct microservices, a frontend application, and robust infrastructure dependencies.

## Key Principles Implemented
1. **Multi-Stage Builds:** Every microservice Dockerfile uses a multi-stage approach (`dependencies` -> `development` -> `builder` -> `production`). This minimizes the final image size by discarding compilers, dev tools, and dev dependencies.
2. **Non-Root Execution:** Production containers drop privileges to a `nodeuser` to mitigate container breakout attacks.
3. **No Dev Volumes:** In production, code is baked into the image. We removed local volume mounts (`./src:/app/src`) that were present in the development `docker-compose.yml`.
4. **Health Checks:** Native Docker Healthchecks (`HEALTHCHECK CMD curl -f http://localhost:$PORT/health || exit 1`) ensure containers are marked "healthy" before Nginx starts routing traffic.
5. **Restart Policies:** Every service utilizes `restart: unless-stopped`. If the EC2 server reboots, Docker automatically restarts all containers.

## Compose Structure
```yaml
kmc-postgres       # Database layer
kmc-redis          # Caching & Rate limiting store
kmc-rabbitmq       # Async messaging broker
kmc-gateway        # Nginx reverse proxy (Port 80/443)
kmc-certbot        # Let's Encrypt automated renewal
kmc-frontend       # React static build
kmc-auth           # Microservice
kmc-user           # Microservice
... (13 more)
```
