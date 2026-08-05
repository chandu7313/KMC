#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Kissan Mithar Consultancy — One-Command Setup Script
# ═══════════════════════════════════════════════════════════
# Usage: chmod +x scripts/setup.sh && ./scripts/setup.sh
# ═══════════════════════════════════════════════════════════

set -e

echo ""
echo "🌿 Kissan Mithar Consultancy — Setup Script"
echo "═══════════════════════════════════════════════"
echo ""

# ── Check Node.js ──
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found."
  echo "   Install from: https://nodejs.org (v20+ required)"
  exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"

# ── Check npm ──
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found. Install Node.js which includes npm."
  exit 1
fi
echo "✅ npm $(npm -v) found"

# ── Check Docker ──
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found."
  echo "   Install from: https://docker.com"
  exit 1
fi
echo "✅ Docker $(docker --version | awk '{print $3}' | tr -d ',') found"

# ── Check Docker Compose ──
if ! docker compose version &> /dev/null && ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose not found."
  echo "   Install Docker Desktop which includes Compose."
  exit 1
fi
echo "✅ Docker Compose found"

# ── Check Git ──
if ! command -v git &> /dev/null; then
  echo "❌ Git not found."
  echo "   Install from: https://git-scm.com"
  exit 1
fi
echo "✅ Git $(git --version | awk '{print $3}') found"

echo ""
echo "─── All prerequisites met! ───"
echo ""

# ── Navigate to microservices directory ──
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"
echo "📂 Working in: $PROJECT_DIR"
echo ""

# ── Check .env file ──
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
    echo ""
    echo "⚠️  IMPORTANT: Open .env and fill in REQUIRED values:"
    echo "   → SUPABASE_REST_URL          (from supabase.com)"
    echo "   → SUPABASE_SERVICE_ROLE_KEY   (from supabase.com)"
    echo "   → JWT_SECRET                  (generate random string)"
    echo "   → JWT_REFRESH_SECRET          (generate different string)"
    echo "   → MONGODB_URI                 (from MongoDB Atlas)"
    echo "   → RABBITMQ_URL               (from CloudAMQP or local)"
    echo ""
    echo "   Generate a secret:"
    echo '   node -e "console.log(require('"'"'crypto'"'"').randomBytes(32).toString('"'"'hex'"'"'))"'
    echo ""
    echo "   After filling in .env, run this script again."
    exit 0
  else
    echo "❌ No .env.example found. Is this the right directory?"
    exit 1
  fi
fi
echo "✅ .env file found"

# ── Install root dependencies ──
if [ -f package.json ]; then
  echo ""
  echo "📦 Installing root dependencies..."
  npm install --silent 2>/dev/null || npm install
  echo "✅ Root dependencies installed"
fi

# ── Install shared packages ──
echo ""
echo "📦 Installing shared packages..."

if [ -d packages/shared ]; then
  printf "  → %-30s" "packages/shared"
  (cd packages/shared && npm install --silent 2>/dev/null || npm install) && echo "✅" || echo "❌"
fi

if [ -d packages/events ]; then
  printf "  → %-30s" "packages/events"
  (cd packages/events && npm install --silent 2>/dev/null || npm install) && echo "✅" || echo "❌"
fi

echo "✅ Shared packages installed"

# ── Install service dependencies ──
echo ""
echo "📦 Installing service dependencies..."
for dir in services/*/; do
  if [ -f "$dir/package.json" ]; then
    service=$(basename "$dir")
    printf "  → %-30s" "$service"
    (cd "$dir" && npm install --silent 2>/dev/null || npm install) && echo "✅" || echo "❌"
  fi
done
echo "✅ All service dependencies installed"

# ── Install frontend ──
echo ""
if [ -d frontend/web ] && [ -f frontend/web/package.json ]; then
  echo "📦 Installing frontend dependencies..."
  (cd frontend/web && npm install --silent 2>/dev/null || npm install)
  echo "✅ Frontend installed"
fi

# ── Done ──
echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure .env has all required values filled in"
echo "  2. Start everything:   make up"
echo "  3. Seed test data:     make seed"
echo "  4. Open browser:       http://localhost:3000"
echo "  5. Check health:       make health"
echo ""
echo "Useful commands:"
echo "  make help              Show all available commands"
echo "  make logs              Stream logs from all services"
echo "  make status            Show container status"
echo ""
echo "Documentation:"
echo "  DEVELOPER_GUIDE.md     Full setup walkthrough"
echo "  ARCHITECTURE.md        How services connect"
echo "  docs/TROUBLESHOOTING.md  Common errors + fixes"
echo ""
