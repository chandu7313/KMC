# KMC SSL Configuration Guide

KMC uses Let's Encrypt with Certbot deployed via Docker to automatically manage SSL certificates.

## Initial Setup
To generate your first SSL certificate:
1. Ensure `kissanmithar.com` and `www.kissanmithar.com` point to your server IP.
2. Ensure port 80 is completely free and accessible.
3. Run the automated setup script from the repository root:
   ```bash
   chmod +x scripts/setup-ssl.sh
   ./scripts/setup-ssl.sh
   ```
This script will:
- Create required mounted volumes (`certbot/conf`, `certbot/www`)
- Start Nginx in HTTP-only mode to answer ACME challenges
- Run Certbot Docker container to request certificates
- Restart Nginx to pick up the certificates

## Automatic Renewals
Certificates are valid for 90 days. We have automated renewals using the `certbot` service in `docker-compose.yml`. 
The Certbot container runs an infinite loop checking for renewals every 12 hours. Since Nginx shares the `/etc/letsencrypt` volume, no manual intervention is needed. Nginx will hot-reload certificates.

## Security Hardening
The Nginx Gateway is configured to:
- Redirect all HTTP traffic to HTTPS (301)
- Allow only TLS 1.2 and TLS 1.3
- Implement Perfect Forward Secrecy and Strong Cipher Suites
- Enforce Strict-Transport-Security (HSTS)
- Implement HTTP Security Headers (CSP, X-Frame-Options)
