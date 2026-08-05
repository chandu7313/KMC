# 🔬 disease-service — Crop Disease Detection

> AI-powered crop disease detection via image upload. Farmers upload a photo, get instant diagnosis.

## What This Service Does

- Accepts crop image uploads (multipart/form-data)
- Uploads images to Cloudinary for storage
- Calls ai-service for Gemini Vision / Plant.id analysis
- Stores diagnosis results in PostgreSQL
- Returns disease name, confidence, and treatment recommendations

## Port: 3004

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| CropDiagnosis | crop_diagnoses | AI scan results (disease, confidence, recommendations) |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/disease/diagnose` | JWT (via multer) | Upload crop image for diagnosis |
| GET | `/api/disease/history` | JWT | Get user's diagnosis history |
| GET | `/api/disease/detail/:id` | JWT | Get specific diagnosis details |

> `POST /diagnose` expects `multipart/form-data` with field name `cropImage`. Max size: 10MB. Formats: jpg, png, webp.

## Other Services Called

| Service | How | Why |
|---------|-----|-----|
| ai-service (:3003) | Direct HTTP (`AI_SERVICE_URL`) | Send image for AI analysis |

## External Dependencies

| Service | Purpose |
|---------|---------|
| Cloudinary | Store uploaded crop images |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.disease` | `disease.report_saved` | Diagnosis saved to DB |
| `kissan.disease` | `recommendation.generated` | Treatment recommendations ready |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_SERVICE_URL` | Yes | `http://ai-service:3003` (Docker internal) |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary account |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary secret |

## Testing

```bash
# Health check
curl http://localhost:3004/health

# Upload a crop image for diagnosis (replace TOKEN and image path)
curl -X POST http://localhost/api/disease/diagnose \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "cropImage=@/path/to/crop-photo.jpg"

# Get diagnosis history
curl http://localhost/api/disease/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Key Files

```
src/
├── routes/disease.routes.js            ← Routes + multer upload
├── controllers/disease.controller.js   ← Request handling
├── services/disease.service.js         ← AI call + save logic
├── repositories/diagnosis.repository.js ← DB queries
├── middleware/errorHandler.js
└── index.js
```
