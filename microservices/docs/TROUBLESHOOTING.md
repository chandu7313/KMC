# 🔧 Troubleshooting Guide

> Common errors and how to fix them. Search for your error message below.

---

## 🐳 Docker / Startup Issues

### Container keeps restarting

```
Symptom:  docker-compose ps shows "Restarting" state
```

```bash
# Step 1: Check which container is failing
docker-compose ps

# Step 2: Read the error
docker-compose logs auth-service    # Replace with failing service
# or
docker logs kmc-auth

# Step 3: Common causes:
#   → Missing .env variable → check .env file
#   → Port already in use → kill conflicting process
#   → Node module missing → rebuild: make rebuild
```

### "Cannot find module '@kissan/shared'"

```
Cause:   Shared package not properly linked during Docker build
Fix:     Rebuild the failing service:
         docker-compose build auth-service
         docker-compose up -d auth-service
```

### "ECONNREFUSED" to Redis / RabbitMQ

```
Cause:   Infrastructure services not started yet
Fix:     Wait for health checks, or start infra first:
         make infra-up
         # Wait 10 seconds, then:
         make up
```

### "Port 80 already in use"

```bash
# Find what's using port 80
lsof -i :80
# Kill it or change NGINX_PORT in .env
```

---

## 🔐 Authentication Issues

### "401 Unauthorized" on every request

```
Cause 1: No token in request header
Fix:     Add: Authorization: Bearer YOUR_TOKEN

Cause 2: Token expired (24-hour expiry)
Fix:     Get a new token:
         curl -X POST http://localhost/api/auth/auto-login \
           -H "Content-Type: application/json" \
           -d '{"role": "super_admin"}'

Cause 3: JWT_SECRET changed after token was issued
Fix:     Get a new token (old ones are invalid after secret change)
```

### "403 Forbidden" (Permission Denied)

```
Cause:   User role doesn't have the required permission
Fix:     Check packages/shared/auth/rbac.js for role→permission mapping
         Use auto-login with a role that has the permission:
         curl -X POST http://localhost/api/auth/auto-login \
           -d '{"role": "super_admin"}'
```

### "JWT_SECRET is not defined"

```
Cause:   Missing environment variable
Fix:     Check .env file has JWT_SECRET set
         Generate one: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### OTP not received on phone

```
In development (ENABLE_SMS=false):
  → OTP appears in API response body
  → Look for "otp" or "devOtp" field in the response JSON
  → Use that OTP to verify

In production (ENABLE_SMS=true):
  → Check FAST2SMS_API_KEY is valid and has credits
  → Check phone number format (10-digit Indian number)
  → Check: docker-compose logs notification-service
```

---

## 🌐 Nginx / API Gateway Issues

### "502 Bad Gateway"

```
Cause:   Nginx can't reach the backend service

Step 1:  Check which service is down
         docker-compose ps

Step 2:  Restart the down service
         docker-compose restart auth-service

Step 3:  Check Nginx logs
         docker-compose logs nginx

Step 4:  Check service logs
         docker-compose logs auth-service
```

### "429 Too Many Requests"

```
Cause:   Hit the Nginx rate limit

Rate limits:
  OTP endpoints:     3 requests/minute
  Auth endpoints:    10 requests/minute
  Upload endpoints:  1 request/minute
  General API:       100 requests/minute

Fix:     Wait 1 minute, or restart Nginx to reset:
         docker-compose restart nginx
```

### CORS errors in browser console

```
Cause:   Frontend URL not in Nginx CORS whitelist

Fix:     Add your URL to nginx/conf.d/kissan-mithar.conf:
         In the map $http_origin $cors_origin block (line 1-12)
         Add: "http://localhost:YOUR_PORT" $http_origin;
         Then: docker-compose restart nginx
```

### "404 Not Found" for an API endpoint

```
Cause 1: Wrong URL path
Fix:     Check docs/API_REFERENCE.md for correct path

Cause 2: Nginx not routing to service
Fix:     Check nginx/conf.d/kissan-mithar.conf has a location block

Cause 3: Service routes not matching
Fix:     Check services/<service>/src/index.js for app.use() mount paths
         and services/<service>/src/routes/*.routes.js for router paths
```

---

## 🔬 Disease Scan Issues

### "Disease scan returned empty result"

```
Check 1: Is GEMINI_API_KEY set in .env?
Check 2: Is the image format supported? (jpg, png, webp)
Check 3: Is the image size under 10MB?
Check 4: docker-compose logs disease-service → look for API errors
Check 5: docker-compose logs ai-service → check Gemini response
```

### "AI Service unreachable"

```
Cause:   ai-service is down or not connected
Fix:     docker-compose restart ai-service
         The AI_SERVICE_URL should be: http://ai-service:3003
         (Docker internal hostname, NOT localhost)
```

---

## 💳 Payment Issues

### Razorpay webhook not working

```
Local testing:
  1. Install ngrok: brew install ngrok
  2. Expose localhost: ngrok http 80
  3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
  4. Set webhook URL in Razorpay dashboard:
     https://your-ngrok-url.ngrok.io/api/payments/webhook
  5. Set RAZORPAY_WEBHOOK_SECRET in .env (must match dashboard)

Common errors:
  "Invalid signature" → RAZORPAY_WEBHOOK_SECRET doesn't match
  "Connection refused" → Nginx/service not running
```

### "Payment verification failed"

```
Cause:   Razorpay signature mismatch
Check:   RAZORPAY_KEY_SECRET in .env matches Razorpay dashboard
         docker-compose logs payment-service
```

---

## 📧 Notification Issues

### Emails not sending

```
Check 1: EMAIL_HOST, EMAIL_USER, EMAIL_PASS in .env
Check 2: If using Gmail, you need an App Password
         (not your regular password)
         myaccount.google.com → Security → App passwords
Check 3: If using Brevo: EMAIL_HOST=smtp-brevo.com
Check 4: docker-compose logs notification-service
```

### SMS not sending

```
In development:
  ENABLE_SMS should be false → OTP in API response

In production:
  Check FAST2SMS_API_KEY has credits
  Check phone number is valid Indian number (10 digits)
  docker-compose logs notification-service
```

---

## 🐰 RabbitMQ Issues

### "Connection to RabbitMQ failed"

```
Check 1: Is RabbitMQ running?
         docker-compose ps rabbitmq

Check 2: Check RABBITMQ_URL in .env
         Local Docker: amqp://user:pass@rabbitmq:5672/kissan
         CloudAMQP: amqps://user:pass@host/vhost

Check 3: RabbitMQ management UI
         http://localhost:15672
         Login: RABBITMQ_USER / RABBITMQ_PASS from .env

Check 4: Restart RabbitMQ
         docker-compose restart rabbitmq
```

### Events not being processed

```
Check 1: RabbitMQ management UI → Queues tab
         Are messages accumulating? (consumer might be down)

Check 2: Check consumer service logs
         docker-compose logs analytics-service  # or relevant service

Check 3: Check Dead Letter Queues
         RabbitMQ UI → Queues → dlq.failed_*
```

---

## 🗄️ Database Issues

### "Sequelize connection timeout"

```
Cause 1: Supabase project is paused (free tier)
Fix:     Go to supabase.com, unpause your project

Cause 2: Wrong SUPABASE_REST_URL
Fix:     Check the URL in .env matches your Supabase dashboard

Cause 3: Service role key expired or wrong
Fix:     Get fresh key from Supabase → Settings → API
```

### "MongoDB connection failed"

```
Check 1: MONGODB_URI in .env is correct
Check 2: MongoDB Atlas IP whitelist includes your IP
         (Atlas → Network Access → Add 0.0.0.0/0 for dev)
Check 3: Username/password in the connection string
```

### "relation does not exist" (table not found)

```
Cause:   Sequelize model table not created in database
Fix:     Models auto-sync on service startup (if configured)
         Or run seed script: make seed
         Check packages/shared/models/ for model definition
```

---

## 🖥️ Frontend Issues

### "Failed to fetch" / "Network Error"

```
Check 1: Is Nginx running?
         curl http://localhost/health

Check 2: Check REACT_APP_API_URL in frontend config
         Should be: http://localhost (goes through Nginx)
         NOT http://localhost:3001 (direct to service)

Check 3: Check browser console for CORS errors
         → See CORS section above
```

### "REACT_APP_SHOW_DEV_LOGIN" not working

```
Cause:   React env vars are baked at build time
Fix:     Rebuild frontend after changing env vars:
         docker-compose build frontend
         docker-compose up -d frontend
```

---

## 📊 Monitoring Issues

### Grafana not loading

```
Check:   make monitoring-status
Fix:     make monitoring-restart
URL:     http://localhost:3100
Login:   admin / (GRAFANA_ADMIN_PASSWORD from .env)
```

### Prometheus not scraping metrics

```
Check:   http://localhost:9090/targets
         All targets should show "UP"
Fix:     make prometheus-reload
```

---

## 🔄 General Reset

When nothing else works:

```bash
# Nuclear option — stop everything, clean up, start fresh
make down
make clean                    # WARNING: deletes volumes
make up
make seed
```

```bash
# Less destructive — just rebuild
make rebuild                  # docker-compose up -d --build
```
