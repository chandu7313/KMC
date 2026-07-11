#!/bin/bash
set -e

echo "=========================================="
echo "KMC Production Deployment Script"
echo "=========================================="

echo "[1/5] Pulling latest code..."
git pull origin main

echo "[2/5] Building Docker images..."
cd microservices
docker-compose build

echo "[3/5] Starting containers..."
docker-compose up -d

echo "[4/5] Waiting for services to initialize..."
sleep 15

echo "[5/5] Performing Health Checks..."
# Basic gateway health check
STATUS_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" http://localhost/health)
if [ "$STATUS_CODE" -eq 200 ]; then
  echo "✅ Deployment Successful! Gateway is healthy."
else
  echo "❌ Deployment Failed! Gateway returned HTTP $STATUS_CODE."
  echo "⚠️ Rolling back is not fully automated yet. Check logs!"
  exit 1
fi
