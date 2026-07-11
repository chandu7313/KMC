#!/bin/bash
set -e

# Configuration
DOMAIN="kissanmithar.com"
EMAIL="admin@kissanmithar.com" # Replace with your real admin email
DATA_PATH="./microservices/certbot"

echo "=========================================="
echo "KMC SSL Certificate Setup"
echo "=========================================="

echo "[1/4] Preparing directories..."
mkdir -p "$DATA_PATH/conf"
mkdir -p "$DATA_PATH/www"

echo "[2/4] Starting Nginx to serve ACME challenge..."
# Start only Nginx so it can respond to Let's Encrypt
cd microservices
docker-compose up -d nginx

echo "[3/4] Requesting SSL Certificate from Let's Encrypt..."
docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    -d $DOMAIN -d www.$DOMAIN \
    --email $EMAIL \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

echo "[4/4] Restarting Nginx to load the new certificates..."
docker-compose restart nginx

echo "✅ SSL Setup complete! HTTPS should now be active."
