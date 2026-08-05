# 🤖 ai-service — AI Engine (Internal Only)

> Central AI gateway for Google Gemini Vision and Plant.id APIs. **Internal service only** — blocked from external access by Nginx.

## What This Service Does

- Provides a unified AI interface for other services
- Routes image analysis to Google Gemini Vision API
- Falls back to Plant.id API when Gemini is unavailable
- Used by disease-service (crop diagnosis) and soil-service (soil analysis)

## Port: 3003

> ⛔ **Not accessible externally.** Nginx blocks all requests to `/api/ai/*` from outside the Docker network (only allows 172.25.0.0/16 and 127.0.0.1).

## Database Tables Owned

None — this is a stateless AI proxy service.

## API Endpoints (Internal Only)

| Method | Internal Path | Called By | Description |
|--------|--------------|-----------|-------------|
| POST | `http://ai-service:3003/analyze` | disease-service, soil-service | Gemini Vision analysis |
| POST | `http://ai-service:3003/plantid` | disease-service | Plant.id identification |

## External APIs Used

| API | Purpose | Fallback |
|-----|---------|----------|
| Google Gemini Vision | Primary AI for disease/soil analysis | Falls back to Plant.id |
| Plant.id | Plant disease identification | Used when Gemini fails |
| Groq | Optional AI fallback | When both Gemini and Plant.id fail |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.ai` | `disease.detected` | Disease identified |
| `kissan.ai` | `soil.analyzed` | Soil analysis complete |
| `kissan.ai` | `ai.request_failed` | AI API call failed |
| `kissan.ai` | `ai.model_fallback` | Primary model failed, using fallback |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini Vision API key |
| `PLANT_ID_API_KEY` | Yes | Plant.id API key |
| `PLANT_ID_API_URL` | Yes | Plant.id base URL |
| `GROQ_API_KEY` | No | Optional Groq AI fallback key |

## Testing

```bash
# Health check
curl http://localhost:3003/health

# Test internally (from within Docker network only)
docker-compose exec ai-service curl http://localhost:3003/health
```

## Common Issues

| Problem | Solution |
|---------|----------|
| `GEMINI_API_KEY not set` | Add key to `.env` from makersuite.google.com |
| Rate limited by Gemini | Free tier has limits; wait or use Plant.id fallback |
| `502` when disease-service calls ai-service | Restart: `docker-compose restart ai-service` |

## Key Files

```
src/
├── routes/gemini.routes.js       ← AI analysis routes
├── controllers/ai.controller.js  ← Request handling
├── services/
│   ├── gemini.service.js         ← Google Gemini integration
│   └── plantid.service.js        ← Plant.id integration
├── middleware/errorHandler.js    ← Error handling
└── index.js                     ← Service entry point
```
