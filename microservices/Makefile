# ============================================================
# Kissan Mithar Consultancy — Developer Commands
# ============================================================
# Usage: make <target>
# Run 'make help' to see all available commands
# ============================================================

.PHONY: all up up-logs down restart rebuild \
        auth disease support \
        logs logs-auth logs-error \
        seed test test-unit \
        prod-build prod-up prod-down \
        infra-up health status clean help install

# ─── Setup ──────────────────────────────
install: ## Install all npm dependencies across services and packages
	@echo "📦 Installing shared packages..."
	cd packages/shared && npm install
	cd packages/events && npm install
	@echo "📦 Installing all services..."
	@for dir in services/*/; do \
		echo "  → $$dir"; \
		(cd $$dir && npm install); \
	done
	@echo "📦 Installing frontend..."
	cd frontend/web && npm install
	@echo "✅ All dependencies installed!"

# ─── Development ────────────────────────
up: ## Start all services (docker-compose up -d)
	docker-compose up -d
	@echo ""
	@echo "✅ All services started!"
	@echo ""
	@echo "  Frontend:    http://localhost:3000"
	@echo "  API Gateway: http://localhost:80"
	@echo "  RabbitMQ:    http://localhost:15672"
	@echo ""

up-logs: ## Start all services with logs streaming
	docker-compose up

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

rebuild: ## Rebuild and restart all services (use after dependency changes)
	docker-compose up -d --build

# ─── Individual Services ────────────────
restart-auth: ## Restart auth-service only
	docker-compose restart auth-service

restart-user: ## Restart user-service only
	docker-compose restart user-service

restart-ai: ## Restart ai-service only
	docker-compose restart ai-service

restart-disease: ## Restart disease-service only
	docker-compose restart disease-service

restart-soil: ## Restart soil-service only
	docker-compose restart soil-service

restart-market: ## Restart market-service only
	docker-compose restart market-service

restart-ecommerce: ## Restart ecommerce-service only
	docker-compose restart ecommerce-service

restart-order: ## Restart order-service only
	docker-compose restart order-service

restart-payment: ## Restart payment-service only
	docker-compose restart payment-service

restart-notify: ## Restart notification-service only
	docker-compose restart notification-service

restart-support: ## Restart support-service only
	docker-compose restart support-service

restart-expert: ## Restart expert-service only
	docker-compose restart expert-service

restart-content: ## Restart content-service only
	docker-compose restart content-service

restart-analytics: ## Restart analytics-service only
	docker-compose restart analytics-service

restart-field: ## Restart field-service only
	docker-compose restart field-service

restart-nginx: ## Restart nginx gateway only
	docker-compose restart nginx

# ─── Shortcut: Start Specific Services ──
auth: ## Start auth-service only
	docker-compose up -d auth-service

disease: ## Start disease-service + ai-service
	docker-compose up -d disease-service ai-service

support: ## Start support-service only
	docker-compose up -d support-service

# ─── Logs ───────────────────────────────
logs: ## Show logs from all services (streaming)
	docker-compose logs -f

logs-auth: ## Show auth-service logs
	docker-compose logs -f auth-service

logs-user: ## Show user-service logs
	docker-compose logs -f user-service

logs-ai: ## Show ai-service logs
	docker-compose logs -f ai-service

logs-disease: ## Show disease-service logs
	docker-compose logs -f disease-service

logs-soil: ## Show soil-service logs
	docker-compose logs -f soil-service

logs-market: ## Show market-service logs
	docker-compose logs -f market-service

logs-ecommerce: ## Show ecommerce-service logs
	docker-compose logs -f ecommerce-service

logs-order: ## Show order-service logs
	docker-compose logs -f order-service

logs-payment: ## Show payment-service logs
	docker-compose logs -f payment-service

logs-notify: ## Show notification-service logs
	docker-compose logs -f notification-service

logs-support: ## Show support-service logs
	docker-compose logs -f support-service

logs-expert: ## Show expert-service logs
	docker-compose logs -f expert-service

logs-content: ## Show content-service logs
	docker-compose logs -f content-service

logs-analytics: ## Show analytics-service logs
	docker-compose logs -f analytics-service

logs-field: ## Show field-service logs
	docker-compose logs -f field-service

logs-nginx: ## Show nginx gateway logs
	docker-compose logs -f nginx

logs-error: ## Show ONLY error logs from all services
	docker-compose logs -f | grep -i "error\|ERROR\|fatal\|FATAL"

# ─── Database ───────────────────────────
seed: ## Seed database with test accounts (all roles)
	docker-compose exec auth-service node scripts/seedDevAccounts.js
	@echo ""
	@echo "✅ Database seeded!"
	@echo "  Test accounts created for all admin roles."

# ─── Health Checks ──────────────────────
health: ## Check gateway health
	@curl -s http://localhost/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost/health

health-all: ## Check health of ALL 15 services individually
	@echo ""
	@echo "🔍 Checking all services..."
	@echo "─────────────────────────────"
	@curl -sf http://localhost/health > /dev/null 2>&1 && \
		printf "  ✅ Nginx Gateway       :80\n" || \
		printf "  ❌ Nginx Gateway       :80  — DOWN!\n"
	@for port in 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014 3015; do \
		name=$$(curl -sf http://localhost:$$port/health 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin).get('service','unknown'))" 2>/dev/null || echo "service-$$port"); \
		curl -sf http://localhost:$$port/health > /dev/null 2>&1 && \
			printf "  ✅ %-20s :$$port\n" "$$name" || \
			printf "  ❌ %-20s :$$port — DOWN!\n" "$$name"; \
	done
	@echo "─────────────────────────────"
	@echo ""

# ─── Status ─────────────────────────────
status: ## Show status of all Docker containers
	docker-compose ps

# ─── Testing ────────────────────────────
test: ## Run test suite
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit

test-unit: ## Run unit tests across workspaces
	npm test --workspaces

# ─── Production ─────────────────────────
prod-build: ## Build production Docker images
	docker-compose -f docker-compose.prod.yml build

prod-up: ## Start production stack
	docker-compose -f docker-compose.prod.yml up -d

prod-down: ## Stop production stack
	docker-compose -f docker-compose.prod.yml down

# ─── Infrastructure ─────────────────────
infra-up: ## Start only infrastructure (Redis, RabbitMQ, Nginx)
	docker-compose up -d redis rabbitmq nginx

# ─── Nginx ──────────────────────────────
nginx-test: ## Test nginx config for syntax errors
	docker-compose exec nginx nginx -t

nginx-reload: ## Reload nginx config without downtime
	docker-compose exec nginx nginx -s reload

# ─── Monitoring Stack ───────────────────
monitoring-up: ## Start monitoring (Prometheus + Grafana + AlertManager)
	docker-compose -f monitoring/docker-compose.monitoring.yml up -d

monitoring-down: ## Stop monitoring stack
	docker-compose -f monitoring/docker-compose.monitoring.yml down

monitoring-logs: ## Show monitoring stack logs
	docker-compose -f monitoring/docker-compose.monitoring.yml logs -f

monitoring-restart: ## Restart monitoring stack
	docker-compose -f monitoring/docker-compose.monitoring.yml restart

monitoring-status: ## Show monitoring container status
	docker-compose -f monitoring/docker-compose.monitoring.yml ps

monitoring-rebuild: ## Rebuild monitoring stack
	docker-compose -f monitoring/docker-compose.monitoring.yml up -d --build

monitoring-clean: ## Stop and remove monitoring volumes
	docker-compose -f monitoring/docker-compose.monitoring.yml down -v --remove-orphans

monitoring-health: ## Check monitoring stack health
	@echo ""
	@echo "📊 Monitoring Stack Health:"
	@echo "─────────────────────────────"
	@printf "Prometheus:   " && (curl -sf http://localhost:9090/-/healthy && echo "✅ UP") || echo "❌ DOWN"
	@printf "Grafana:      " && (curl -sf http://localhost:3100/api/health > /dev/null && echo "✅ UP") || echo "❌ DOWN"
	@printf "AlertManager: " && (curl -sf http://localhost:9093/-/healthy > /dev/null && echo "✅ UP") || echo "❌ DOWN"
	@printf "Pushgateway:  " && (curl -sf http://localhost:9091/-/healthy > /dev/null && echo "✅ UP") || echo "❌ DOWN"
	@echo "─────────────────────────────"
	@echo "Grafana UI:   http://localhost:3100"
	@echo "Prometheus:   http://localhost:9090"
	@echo "AlertManager: http://localhost:9093"

prometheus-reload: ## Reload Prometheus configuration
	curl -X POST http://localhost:9090/-/reload

# ─── Full Stack ─────────────────────────
all-up: up monitoring-up ## Start ALL services + monitoring
	@echo "✅ All services + monitoring started"

all-down: monitoring-down down ## Stop ALL services + monitoring
	@echo "✅ All services + monitoring stopped"

all-status: status monitoring-status ## Show status of everything

# ─── Cleanup ────────────────────────────
clean: ## Remove all containers and volumes (⚠️ DELETES DATA!)
	@echo "⚠️  This will delete all containers, volumes, and cached data!"
	@read -p "Are you sure? (yes/no): " confirm && \
		[ "$$confirm" = "yes" ] && \
		(docker-compose down -v --remove-orphans && docker system prune -f && echo "✅ Cleaned!") || \
		echo "Cancelled."

# ─── Diagnostics ────────────────────────
diagnose: ## Run the diagnostic script to check system health
	bash scripts/diagnose.sh

# ─── Help ───────────────────────────────
help: ## Show all available commands
	@echo ""
	@echo "🌿 Kissan Mithar Consultancy — Available Commands"
	@echo "══════════════════════════════════════════════════"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		sort | \
		awk 'BEGIN {FS = ":.*?## "}; \
		{printf "  \033[36mmake %-22s\033[0m %s\n", $$1, $$2}'
	@echo ""

.DEFAULT_GOAL := help
