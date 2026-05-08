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
