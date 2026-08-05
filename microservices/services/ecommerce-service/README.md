# 🛒 ecommerce-service — Products, Cart & Catalog

> Manages the product marketplace, fertilizer catalog, equipment catalog, and shopping cart.

## What This Service Does

- Product catalog (CRUD, listing, search)
- Fertilizer catalog (CRUD, listing)
- Equipment catalog (CRUD, listing)
- Shopping cart management (add, update, clear)
- Inventory tracking
- Vendor management

## Port: 3007

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| Product | products | Marketplace product catalog |
| Equipment | equipment | Farm equipment catalog |
| Fertilizer | fertilizers | Fertilizer catalog |
| Review | reviews | Product reviews and ratings |

**Note:** Cart data is stored in Redis (DB 1), not PostgreSQL.

## API Endpoints

### Products (`/api/products/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products/list` | None | List all products |
| POST | `/api/products/single` | None | Get product (ID in body) |
| GET | `/api/products/:id` | None | Get product by ID |
| POST | `/api/products/add` | JWT | Admin: add product |
| POST | `/api/products/remove` | JWT | Admin: remove product |
| DELETE | `/api/products/:id` | JWT | Admin: delete product |

### Cart (`/api/cart/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/cart/` | JWT | Get user's cart |
| POST | `/api/cart/add` | JWT | Add item to cart |
| POST | `/api/cart/update` | JWT | Update cart item |
| POST | `/api/cart/clear` | JWT | Clear entire cart |

### Fertilizers (`/api/fertilizer/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/fertilizer/list` | None | List fertilizers |
| GET | `/api/fertilizer/:id` | None | Get fertilizer details |
| POST | `/api/fertilizer/add` | JWT | Admin: add fertilizer |
| PUT | `/api/fertilizer/update/:id` | JWT | Admin: update |
| DELETE | `/api/fertilizer/delete/:id` | JWT | Admin: delete |

### Equipment (`/api/equipment/*`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/equipment/list` | None | List equipment |
| GET | `/api/equipment/:id` | None | Get equipment details |
| POST | `/api/equipment/add` | JWT | Admin: add equipment |
| PUT | `/api/equipment/update/:id` | JWT | Admin: update |
| DELETE | `/api/equipment/delete/:id` | JWT | Admin: delete |

## Nginx Routes (Multiple Prefixes)

This service handles 6 Nginx location blocks:
- `/api/products/*`, `/api/cart/*`, `/api/vendors/*`
- `/api/fertilizer/*`, `/api/equipment/*`, `/api/inventory/*`

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.ecommerce` | `product.added` | New product created |
| `kissan.ecommerce` | `product.updated` | Product modified |
| `kissan.ecommerce` | `product.low_stock` | Stock below threshold |
| `kissan.ecommerce` | `cart.updated` | Cart modified |
| `kissan.ecommerce` | `inventory.updated` | Stock level changed |

## Key Files

```
src/
├── routes/
│   ├── product.routes.js       ← Product CRUD
│   ├── cart.routes.js          ← Cart operations
│   ├── fertilizer.routes.js    ← Fertilizer catalog
│   └── equipment.routes.js     ← Equipment catalog
├── controllers/
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── fertilizer.controller.js
│   └── equipment.controller.js
├── services/
│   ├── product.service.js
│   ├── cart.service.js         ← Redis-backed cart
│   ├── fertilizer.service.js
│   └── equipment.service.js
├── repositories/
│   ├── product.repository.js
│   ├── fertilizer.repository.js
│   └── equipment.repository.js
└── index.js
```
