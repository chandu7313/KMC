# 📰 content-service — Blogs, Success Stories & Govt Schemes

> Content Management System (CMS) providing agricultural blog posts, inspiring farmer success stories, and government subsidies/schemes.

## What This Service Does

- Blog posts creation, editing, slug-based fetching, and category filtering
- Farmer success story publications highlighting modern agricultural techniques
- Government scheme directory with eligibility criteria and application guides
- Admin curation tools for articles and educational resources

## Port: 3013

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| Blog | blogs | Agricultural blog articles, authors, tags, views, slug |
| SuccessStory | success_stories | Farmer testimonials, crop yields, income improvements |
| Scheme | schemes | Government agricultural schemes, subsidies, application links |

## API Endpoints

### Blog Posts (`/api/content/blog/*`)

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/content/blog/all` | None | List all published blog articles |
| GET | `/api/content/blog/get/:slug` | None | Fetch article by URL slug |
| GET | `/api/content/blog/:id` | None | Fetch article by database ID |
| POST | `/api/content/blog` | JWT | Admin: publish a new blog article |
| PATCH | `/api/content/blog/:id` | JWT | Admin: update blog article content |
| DELETE | `/api/content/blog/:id` | JWT | Admin: delete blog article |

### Success Stories (`/api/content/success/*`)

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/content/success/all` | None | List farmer success stories |
| GET | `/api/content/success/:id` | None | Fetch specific success story |
| POST | `/api/content/success` | JWT | Admin: create new success story |
| PATCH | `/api/content/success/:id` | JWT | Admin: update success story |
| DELETE | `/api/content/success/:id` | JWT | Admin: delete success story |

### Government Schemes (`/api/content/scheme/*`)

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| GET | `/api/content/scheme/all` | None | List active government schemes and subsidies |
| GET | `/api/content/scheme/:id` | None | Get specific scheme eligibility and details |
| POST | `/api/content/scheme` | JWT | Admin: add government scheme entry |
| PATCH | `/api/content/scheme/:id` | JWT | Admin: update government scheme entry |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.content` | `content.published` | New article or scheme published |
| `kissan.content` | `banner.activated` | Promo banner activated on mobile/web |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3013) |
| `JWT_SECRET` | Yes | Token verification secret |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Database authentication key |
| `RABBITMQ_URL` | Yes | RabbitMQ AMQP URI |

## Testing

```bash
# Health check
curl http://localhost:3013/health

# Prometheus metrics
curl http://localhost:3013/metrics

# List blogs
curl http://localhost/api/content/blog/all
```
