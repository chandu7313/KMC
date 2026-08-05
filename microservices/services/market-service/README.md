# 📊 market-service — Mandi Prices & Trends

> Real-time agricultural market prices from data.gov.in with trend analysis and recommendations.

## What This Service Does

- Fetches real-time mandi (market) prices from data.gov.in API
- Provides dashboard price summaries
- Price trend analysis over time
- Crop comparison across markets
- Market analytics and recommendations
- Admin: manual price management (add/update/delete)

## Port: 3006

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| MarketPrice | market_prices | Current commodity prices per market |
| MarketHistory | market_histories | Historical price data for trends |
| PriceAlert | price_alerts | Farmer price alert subscriptions |

## API Endpoints

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/market/dashboard-prices` | None | Dashboard price summary |
| GET | `/api/market/prices` | None | List prices (paginated) |
| GET | `/api/market/realtime` | None | Real-time price for commodity |
| GET | `/api/market/trend` | None | Price trend analysis |
| GET | `/api/market/recommendation` | None | Price-based recommendations |
| GET | `/api/market/analytics` | None | Market analytics data |
| GET | `/api/market/compare/:crop` | None | Compare crop across markets |
| POST | `/api/market/sync` | None | Trigger data.gov.in sync |
| POST | `/api/market/prices` | JWT | Admin: add price record |
| PUT | `/api/market/prices/:id` | JWT | Admin: update price |
| DELETE | `/api/market/prices/:id` | JWT | Admin: delete price |

## External APIs Used

| API | Purpose |
|-----|---------|
| data.gov.in | Real-time mandi market prices (free tier) |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.market` | `market.price_updated` | Prices synced from data.gov.in |
| `kissan.market` | `market.alert_triggered` | Price crosses farmer's alert threshold |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATA_GOV_API_KEY` | Yes | data.gov.in API key (free) |

## Key Files

```
src/
├── routes/market.routes.js
├── controllers/market.controller.js
├── services/
│   ├── market.service.js         ← Price queries + analytics
│   └── datagov.service.js        ← data.gov.in API integration
├── repositories/market.repository.js
└── index.js
```
