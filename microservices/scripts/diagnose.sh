#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Kissan Mithar Consultancy — Full System Diagnostic
# ═══════════════════════════════════════════════════════════
# Usage: bash scripts/diagnose.sh
# Run from the microservices/ directory
# ═══════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo ""
echo "═══════════════════════════════════════════════════════"
echo " 🌾 Kissan Mithar — Full System Diagnostic"
echo "═══════════════════════════════════════════════════════"
echo ""

# ─── 1. Container Status ──────────────────────────────────
echo "${BOLD}1️⃣  Container Status:${NC}"
echo "───────────────────────────────────────────────────────"
docker-compose ps 2>/dev/null || docker compose ps 2>/dev/null
echo ""

# ─── 2. Nginx Config Test ─────────────────────────────────
echo "${BOLD}2️⃣  Nginx Configuration Test:${NC}"
echo "───────────────────────────────────────────────────────"
result=$(docker-compose exec -T nginx nginx -t 2>&1 || docker compose exec -T nginx nginx -t 2>&1)
if echo "$result" | grep -q "successful"; then
  echo -e "  ${GREEN}✅ Nginx config syntax is valid${NC}"
else
  echo -e "  ${RED}❌ Nginx config has errors:${NC}"
  echo "$result" | sed 's/^/     /'
fi
echo ""

# ─── 3. Gateway Health ────────────────────────────────────
echo "${BOLD}3️⃣  Gateway Health Check:${NC}"
echo "───────────────────────────────────────────────────────"
gw_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health 2>/dev/null)
if [ "$gw_code" = "200" ]; then
  echo -e "  ${GREEN}✅ Gateway responding — HTTP $gw_code${NC}"
  curl -s http://localhost/health 2>/dev/null | python3 -m json.tool 2>/dev/null | sed 's/^/     /' || true
else
  echo -e "  ${RED}❌ Gateway NOT responding — HTTP $gw_code${NC}"
fi
echo ""

# ─── 4. Direct Service Health ─────────────────────────────
echo "${BOLD}4️⃣  Direct Service Health (bypassing Nginx):${NC}"
echo "───────────────────────────────────────────────────────"

healthy_count=0
total_count=0

# Define services as space-separated "port:name" pairs
SERVICES="3001:auth-service 3002:user-service 3003:ai-service 3004:disease-service 3005:soil-service 3006:market-service 3007:ecommerce-service 3008:order-service 3009:payment-service 3010:notification-service 3011:support-service 3012:expert-service 3013:content-service 3014:analytics-service 3015:field-service"

for pair in $SERVICES; do
  total_count=$((total_count + 1))
  port="${pair%%:*}"
  name="${pair#*:}"
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$port/health" --connect-timeout 3 2>/dev/null)
  if [ "$code" = "200" ]; then
    echo -e "  ${GREEN}✅ :$port ($name) — HTTP $code${NC}"
    healthy_count=$((healthy_count + 1))
  else
    echo -e "  ${RED}❌ :$port ($name) — HTTP $code${NC}"
  fi
done
echo ""
echo -e "  Summary: ${BOLD}$healthy_count/$total_count services healthy${NC}"
echo ""

# ─── 5. Service Reachability via Nginx Gateway ─────────────
echo "${BOLD}5️⃣  Service Reachability (via Nginx Gateway):${NC}"
echo "───────────────────────────────────────────────────────"

# Define API paths as "service:/api/path" pairs
API_ENDPOINTS="auth:/api/auth/farmer/send-otp users:/api/users/profile disease:/api/disease/history soil:/api/soil/history market:/api/market/prices products:/api/products cart:/api/cart orders:/api/orders payments:/api/payments notify:/api/notify support:/api/support/tickets experts:/api/experts content:/api/content analytics:/api/analytics field:/api/field"

for pair in $API_ENDPOINTS; do
  svc="${pair%%:*}"
  path="${pair#*:}"
  code=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Origin: http://localhost:3000" \
    "http://localhost${path}" --connect-timeout 3 2>/dev/null)
  # 200, 401, 404 all mean nginx is routing correctly
  if [[ "$code" == "200" || "$code" == "401" || "$code" == "404" ]]; then
    echo -e "  ${GREEN}✅ $svc → HTTP $code (routed correctly)${NC}"
  elif [[ "$code" == "502" ]]; then
    echo -e "  ${RED}❌ $svc → HTTP $code (upstream unreachable!)${NC}"
  elif [[ "$code" == "429" ]]; then
    echo -e "  ${YELLOW}⚠️  $svc → HTTP $code (rate limited)${NC}"
  else
    echo -e "  ${RED}❌ $svc → HTTP $code${NC}"
  fi
done
echo ""

# ─── 6. CORS Preflight Check ─────────────────────────────
echo "${BOLD}6️⃣  CORS Preflight Check:${NC}"
echo "───────────────────────────────────────────────────────"
cors_response=$(curl -s -I -X OPTIONS \
  http://localhost/api/auth/farmer/send-otp \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization,Content-Type" \
  --connect-timeout 3 2>/dev/null)

cors_origin=$(echo "$cors_response" | grep -i "access-control-allow-origin" | tr -d '\r')
cors_methods=$(echo "$cors_response" | grep -i "access-control-allow-methods" | tr -d '\r')
cors_creds=$(echo "$cors_response" | grep -i "access-control-allow-credentials" | tr -d '\r')
cors_status=$(echo "$cors_response" | head -1 | grep -o '[0-9]\{3\}')

if [[ "$cors_status" == "204" || "$cors_status" == "200" ]]; then
  echo -e "  ${GREEN}✅ Preflight returned HTTP $cors_status${NC}"
else
  echo -e "  ${RED}❌ Preflight returned HTTP $cors_status (expected 204)${NC}"
fi

if [ -n "$cors_origin" ]; then
  echo -e "  ${GREEN}✅ $cors_origin${NC}"
else
  echo -e "  ${RED}❌ Access-Control-Allow-Origin header MISSING${NC}"
fi

if [ -n "$cors_methods" ]; then
  echo -e "  ${GREEN}✅ $cors_methods${NC}"
else
  echo -e "  ${RED}❌ Access-Control-Allow-Methods header MISSING${NC}"
fi

if [ -n "$cors_creds" ]; then
  echo -e "  ${GREEN}✅ $cors_creds${NC}"
else
  echo -e "  ${RED}❌ Access-Control-Allow-Credentials header MISSING${NC}"
fi
echo ""

# ─── 7. Docker Network Connectivity ──────────────────────
echo "${BOLD}7️⃣  Docker Network (Nginx → Services):${NC}"
echo "───────────────────────────────────────────────────────"
for svc in auth-service:3001 user-service:3002 disease-service:3004 ecommerce-service:3007 support-service:3011 content-service:3013 field-service:3015; do
  result=$(docker-compose exec -T nginx wget -q -O- "http://$svc/health" --timeout=3 2>/dev/null || docker compose exec -T nginx wget -q -O- "http://$svc/health" --timeout=3 2>/dev/null)
  if [ -n "$result" ]; then
    echo -e "  ${GREEN}✅ $svc — reachable via Docker DNS${NC}"
  else
    echo -e "  ${RED}❌ $svc — NOT reachable!${NC}"
  fi
done
echo ""

# ─── 8. Frontend Environment ─────────────────────────────
echo "${BOLD}8️⃣  Frontend Environment:${NC}"
echo "───────────────────────────────────────────────────────"
for envfile in frontend/web/.env frontend/web/.env.development frontend/web/.env.production; do
  if [ -f "$envfile" ]; then
    echo -e "  ${GREEN}✅ $envfile exists${NC}"
    grep -i "BACKEND_URL\|API_URL" "$envfile" 2>/dev/null | sed 's/^/     /'
  else
    echo -e "  ${YELLOW}⚠️  $envfile not found${NC}"
  fi
done

# Check vite.config.js envPrefix
if grep -q "VITE_" frontend/web/vite.config.js 2>/dev/null; then
  echo -e "  ${GREEN}✅ vite.config.js supports VITE_ prefix${NC}"
else
  echo -e "  ${RED}❌ vite.config.js may not expose VITE_ variables!${NC}"
fi
echo ""

# ─── 9. Recent Errors ────────────────────────────────────
echo "${BOLD}9️⃣  Recent Error Logs:${NC}"
echo "───────────────────────────────────────────────────────"
echo -e "  ${BLUE}--- Nginx ---${NC}"
(docker-compose logs nginx --tail=10 2>&1 || docker compose logs nginx --tail=10 2>&1) | grep -i "error\|warn\|emerg" | head -5 | sed 's/^/     /' || echo "     (no errors)"
echo -e "  ${BLUE}--- Auth Service ---${NC}"
(docker-compose logs auth-service --tail=10 2>&1 || docker compose logs auth-service --tail=10 2>&1) | grep -i "error\|ERR\|fail" | head -5 | sed 's/^/     /' || echo "     (no errors)"
echo -e "  ${BLUE}--- Ecommerce Service ---${NC}"
(docker-compose logs ecommerce-service --tail=10 2>&1 || docker compose logs ecommerce-service --tail=10 2>&1) | grep -i "error\|ERR\|fail" | head -5 | sed 's/^/     /' || echo "     (no errors)"
echo ""

# ─── 10. Quick Test Commands ──────────────────────────────
echo "${BOLD}🧪 Quick Verification Commands:${NC}"
echo "───────────────────────────────────────────────────────"
echo "  # Test OTP endpoint through gateway:"
echo '  curl -X POST http://localhost/api/auth/farmer/send-otp \'
echo '    -H "Content-Type: application/json" \'
echo '    -H "Origin: http://localhost:3000" \'
echo "    -d '{\"phone\":\"9876543210\"}'"
echo ""
echo "  # Test dev-login:"
echo '  curl -X POST http://localhost/api/auth/dev-login \'
echo '    -H "Content-Type: application/json" \'
echo "    -d '{\"role\":\"super_admin\"}'"
echo ""
echo "  # Test products:"
echo '  curl http://localhost/api/products -H "Origin: http://localhost:3000"'
echo ""

echo "═══════════════════════════════════════════════════════"
echo " 🌾 Diagnostic Complete"
echo "═══════════════════════════════════════════════════════"
echo ""
