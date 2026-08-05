# 🌱 soil-service — Soil Testing & Analysis

> Upload soil reports for manual or AI-powered analysis. Includes admin tools for reviewing farmer soil data.

## What This Service Does

- Farmer soil report upload (PDF/image via Cloudinary)
- Standalone soil analysis (rule-based)
- AI-powered soil analysis (calls ai-service for Gemini analysis)
- Admin review and manual analysis of soil reports
- Soil test reminders

## Port: 3005

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| SoilReport | soil_reports | Soil analysis reports + AI results |
| SoilReminder | soil_reminders | Scheduled test reminders for farmers |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/soil/upload` | JWT | Upload soil report file |
| GET | `/api/soil/history` | JWT | Get user's soil report history |
| POST | `/api/soil/analyze` | JWT | Standalone analysis (rule-based) |
| POST | `/api/soil/analyze-ai` | JWT | AI-powered analysis (Gemini) |
| GET | `/api/soil/admin/reports` | JWT | Admin: list all reports |
| PUT | `/api/soil/admin/reports/:id/analyze` | JWT | Admin: analyze specific report |
| POST | `/api/soil/admin/reports` | JWT | Admin: create soil report |
| GET | `/api/soil/admin/farmer/:farmerId/history` | JWT | Admin: farmer's soil history |

## Other Services Called

| Service | How | Why |
|---------|-----|-----|
| ai-service (:3003) | Direct HTTP (`AI_SERVICE_URL`) | AI soil analysis |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.soil` | `soil.report_saved` | Report uploaded/created |
| `kissan.soil` | `soil.kit_ordered` | Soil testing kit ordered |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_SERVICE_URL` | Yes | `http://ai-service:3003` |
| `CLOUDINARY_CLOUD_NAME` | Yes | File upload storage |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary secret |

## Key Files

```
src/
├── routes/soil.routes.js
├── controllers/soil.controller.js    ← Handles upload + admin routes
├── services/soil.service.js          ← Analysis logic + AI call
├── repositories/soil.repository.js
└── index.js
```
