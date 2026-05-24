# ============================================================
# Kissan Mithar Consultancy — Developer Commands
# ============================================================
# Usage: make <target>
# ============================================================

.PHONY: all up up-logs down restart rebuild \
        auth disease support \
        logs logs-auth logs-error \
        seed test test-unit \
        prod-build prod-up prod-down \
        infra-up health status clean

# ─── Development ────────────────────────
up:
	docker-compose up -d

up-logs:
	docker-compose up

down:
	docker-compose down

restart:
	docker-compose restart

rebuild:
	docker-compose up -d --build

# ─── Individual Services ────────────────
auth:
	docker-compose up -d auth-service

disease:
	docker-compose up -d disease-service ai-service

support:
	docker-compose up -d support-service

# ─── Logs ───────────────────────────────
logs:
	docker-compose logs -f

logs-auth:
	docker-compose logs -f auth-service

logs-error:
	docker-compose logs -f | grep ERROR

# ─── Database ───────────────────────────
seed:
	docker-compose exec auth-service node scripts/seedDevAccounts.js

# ─── Testing ────────────────────────────
test:
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit

test-unit:
	npm test --workspaces

# ─── Production ─────────────────────────
prod-build:
	docker-compose -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down

# ─── Infrastructure ─────────────────────
infra-up:
	docker-compose up -d redis rabbitmq nginx

health:
	@curl -s http://localhost/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost/health

status:
	docker-compose ps

clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# ─── Monitoring Stack ───────────────────
monitoring-up:
	docker-compose -f monitoring/docker-compose.monitoring.yml up -d

monitoring-down:
	docker-compose -f monitoring/docker-compose.monitoring.yml down

monitoring-logs:
	docker-compose -f monitoring/docker-compose.monitoring.yml logs -f

monitoring-restart:
	docker-compose -f monitoring/docker-compose.monitoring.yml restart

monitoring-status:
	docker-compose -f monitoring/docker-compose.monitoring.yml ps

monitoring-rebuild:
	docker-compose -f monitoring/docker-compose.monitoring.yml up -d --build

monitoring-clean:
	docker-compose -f monitoring/docker-compose.monitoring.yml down -v --remove-orphans

monitoring-health:
	@echo "\n📊 Monitoring Stack Health:"
	@echo "─────────────────────────────"
	@printf "Prometheus:   " && (curl -sf http://localhost:9090/-/healthy && echo "✅ UP") || echo "❌ DOWN"
	@printf "Grafana:      " && (curl -sf http://localhost:3100/api/health > /dev/null && echo "✅ UP") || echo "❌ DOWN"
	@printf "AlertManager: " && (curl -sf http://localhost:9093/-/healthy > /dev/null && echo "✅ UP") || echo "❌ DOWN"
	@printf "Pushgateway:  " && (curl -sf http://localhost:9091/-/healthy > /dev/null && echo "✅ UP") || echo "❌ DOWN"
	@echo "─────────────────────────────"
	@echo "Grafana UI:   http://localhost:3100"
	@echo "Prometheus:   http://localhost:9090"
	@echo "AlertManager: http://localhost:9093"

prometheus-reload:
	curl -X POST http://localhost:9090/-/reload

# ─── Full Stack ─────────────────────────
all-up: up monitoring-up
	@echo "✅ All services + monitoring started"

all-down: monitoring-down down
	@echo "✅ All services + monitoring stopped"

all-status: status monitoring-status

