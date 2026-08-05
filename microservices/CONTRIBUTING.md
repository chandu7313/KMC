# 🤝 Contributing Guide

> How to write code, name branches, format commits, and submit PRs for Kissan Mithar.

## Branch Naming

```
feature/KMC-123-add-crop-calendar
bugfix/KMC-456-fix-otp-timeout
hotfix/KMC-789-payment-webhook-crash
chore/KMC-101-update-dependencies
docs/KMC-102-add-api-docs
refactor/KMC-103-simplify-ticket-logic
```

Format: `type/KMC-{ticket}-short-description`

## Commit Message Format

```
type(scope): short description

Examples:
feat(auth): add biometric login support
fix(disease): handle timeout when Gemini API is slow
docs(readme): add setup guide for Windows users
chore(deps): update sequelize to v6.37
test(orders): add unit tests for order cancellation
refactor(support): simplify ticket assignment logic
perf(market): add Redis caching for mandi prices
style(frontend): fix button alignment on mobile
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `chore` | Build, CI, dependency updates |
| `test` | Adding or updating tests |
| `refactor` | Code restructure (no behavior change) |
| `perf` | Performance improvement |
| `style` | Formatting, missing semicolons, etc. |

### Scopes (use service name)

`auth`, `user`, `ai`, `disease`, `soil`, `market`, `ecommerce`, `orders`, `payments`, `notify`, `support`, `expert`, `content`, `analytics`, `field`, `frontend`, `nginx`, `shared`, `events`, `docker`, `deps`, `readme`

## Before Submitting a PR

```bash
# Run these checks:
make status             # Verify all services are running
docker-compose ps       # Check no containers crashed

# Test your specific service:
docker-compose logs -f auth-service    # Check for errors

# Test the endpoint you changed:
curl http://localhost/api/your-endpoint \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## PR Checklist

```
Code Quality:
  [ ] Follows the 4-file pattern (route → controller → service → repository)
  [ ] No business logic in controllers
  [ ] No database queries outside repositories
  [ ] No hardcoded secrets or magic numbers

Error Handling:
  [ ] Controllers use try/catch + next(err)
  [ ] Added Joi validation schema for new endpoints
  [ ] Error messages are user-friendly

Logging & Monitoring:
  [ ] Added Winston logging for new operations
  [ ] logger.info() for success, logger.error() for failures
  [ ] Prometheus metrics updated if new endpoint

Testing:
  [ ] Manually tested with curl/Thunder Client
  [ ] Tested error cases (invalid input, unauthorized)
  [ ] Tested with different user roles

Documentation:
  [ ] Updated service README.md if new endpoint added
  [ ] Updated API_REFERENCE.md if public API changed
  [ ] Added JSDoc comments to new functions

Security:
  [ ] Authentication middleware on protected routes
  [ ] Authorization middleware with correct permissions
  [ ] Input validation on all POST/PUT/PATCH endpoints
  [ ] No sensitive data in logs (passwords, tokens)
```

## Code Style Rules

### General

- Use `const` over `let` when value doesn't change
- Use `async/await` over `.then().catch()`
- Use destructuring: `const { id, name } = req.body`
- Write descriptive variable names (no single letters except `i`, `j` in loops)
- Keep functions small (max 30 lines per function)
- One responsibility per function

### Imports

```javascript
// ✅ Order: built-in → packages → relative
import express from 'express';
import { authenticate, validate, models } from '@kissan/shared';
import { AUTH_EVENTS } from '@kissan/events';
import * as authService from '../services/auth.service.js';
```

### Response Format

```javascript
// Always use shared response helpers:
import { successResponse, errorResponse } from '@kissan/shared';

// Success:
return successResponse(res, data, 'Operation successful');

// Error (let error handler catch it):
throw new AppError('Something went wrong', 400);
```

### Error Handling

```javascript
// In controllers — always forward errors:
export const doSomething = async (req, res, next) => {
  try {
    const result = await someService.doSomething(req.body);
    return successResponse(res, result, 'Done');
  } catch (err) {
    next(err);    // ← Let errorHandler middleware handle it
  }
};
```

## File Naming Conventions

### Backend (services)

```
Services:       auth.service.js        (lowercase.type.js)
Controllers:    auth.controller.js
Repositories:   user.repository.js
Routes:         auth.routes.js
Validators:     auth.validator.js
Tests:          auth.service.test.js
Event consumers: auth.consumer.js
Event publishers: auth.publisher.js
```

### Frontend (React)

```
Components:     DiseaseDetection.jsx   (PascalCase)
Pages:          HomePage.jsx           (PascalCase)
Hooks:          useDiseaseScan.js      (camelCase, prefix 'use')
Context:        AuthContext.jsx        (PascalCase)
Utilities:      formatDate.js          (camelCase)
Stores:         useAuthStore.js        (camelCase)
```

### Configuration

```
Docker:         Dockerfile, docker-compose.yml
Nginx:          kissan-mithar.conf
Environment:    .env, .env.example
```

## Adding a New Endpoint — Full Example

### 1. Define the route

```javascript
// services/market-service/src/routes/market.routes.js
router.get('/forecast/:crop', authenticate, mCtrl.getForecast);
```

### 2. Create the controller

```javascript
// services/market-service/src/controllers/market.controller.js
export const getForecast = async (req, res, next) => {
  try {
    const { crop } = req.params;
    const forecast = await marketService.getForecast(crop);
    return successResponse(res, forecast, 'Forecast generated');
  } catch (err) {
    next(err);
  }
};
```

### 3. Write the business logic

```javascript
// services/market-service/src/services/market.service.js
export const getForecast = async (crop) => {
  const prices = await marketRepo.getHistoricalPrices(crop, 30);
  if (prices.length < 7) {
    throw new AppError('Not enough data for forecast', 400);
  }
  const trend = calculateTrend(prices);
  return { crop, trend, confidence: 0.85 };
};
```

### 4. Write the DB query

```javascript
// services/market-service/src/repositories/market.repository.js
export const getHistoricalPrices = async (crop, days) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return models.MarketPrice.findAll({
    where: { crop, date: { [Op.gte]: cutoff } },
    order: [['date', 'ASC']],
  });
};
```

### 5. Test it

```bash
curl http://localhost/api/market/forecast/rice \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## RabbitMQ Events — Adding a New Event

### 1. Define the event type

```javascript
// packages/events/eventTypes.js
export const MARKET_EVENTS = {
  PRICE_UPDATED: 'market.price_updated',
  ALERT_TRIGGERED: 'market.alert_triggered',
  FORECAST_GENERATED: 'market.forecast_generated',  // ← New
};
```

### 2. Publish from your service

```javascript
// services/market-service/src/services/market.service.js
import { publisher } from '@kissan/events';
import { EXCHANGES, MARKET_EVENTS } from '@kissan/events';

export const getForecast = async (crop) => {
  const forecast = /* ... */;

  // Publish event
  await publisher.publish(EXCHANGES.MARKET, MARKET_EVENTS.FORECAST_GENERATED, {
    crop,
    forecast,
    timestamp: new Date().toISOString(),
  });

  return forecast;
};
```

### 3. Consume in another service

```javascript
// services/analytics-service/src/events/consumers/analytics.consumer.js
import { consumer } from '@kissan/events';
import { EXCHANGES, MARKET_EVENTS } from '@kissan/events';

consumer.subscribe(EXCHANGES.MARKET, MARKET_EVENTS.FORECAST_GENERATED, async (data) => {
  logger.info('Forecast event received', { crop: data.crop });
  // Track in analytics...
});
```
