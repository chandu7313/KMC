# 📦 order-service — Orders & Checkout

> Manages orders for marketplace products, fertilizers, and farm equipment with Razorpay payment integration.

## What This Service Does

- Marketplace product orders (place, list, cancel, status update)
- Fertilizer orders (place, list, admin view, status update)
- Farm equipment rental/purchase orders (place, list, cancel, status update)
- Razorpay payment verification and order linking
- Publishes order lifecycle events via RabbitMQ

## Port: 3008

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| MarketplaceOrder | marketplace_orders | Standard e-commerce product orders |
| MarketplaceOrderItem | marketplace_order_items | Line items for product orders |
| FertilizerOrder | fertilizer_orders | Bulk and retail fertilizer orders |
| FertilizerOrderItem | fertilizer_order_items | Line items for fertilizer orders |
| EquipmentOrder | equipment_orders | Equipment rental and purchase orders |
| EquipmentOrderItem | equipment_order_items | Line items for equipment orders |

## API Endpoints

### Marketplace Orders (`/api/orders/*`)

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/orders/place` | JWT | Place a marketplace product order |
| POST | `/api/orders/userorders` | JWT | Get authenticated user's order history |
| POST | `/api/orders/cancel` | JWT | Cancel a pending marketplace order |
| POST | `/api/orders/razorpay` | JWT | Initialize Razorpay payment for order |
| POST | `/api/orders/verify-razorpay` | JWT | Verify Razorpay payment signature & confirm order |
| POST | `/api/orders/list` | JWT (`order:read`) | Admin: list all marketplace orders |
| POST | `/api/orders/status` | JWT (`order:write`) | Admin: update marketplace order status |

### Fertilizer Orders (`/api/orders/fertilizer/*`)

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/orders/fertilizer/place-order` | JWT | Place a fertilizer order |
| GET | `/api/orders/fertilizer/user-orders` | JWT | Get user's fertilizer order history |
| GET | `/api/orders/fertilizer/admin-orders` | JWT (`order:read`) | Admin: list all fertilizer orders |
| POST | `/api/orders/fertilizer/update-status` | JWT (`order:write`) | Admin: update fertilizer order status |

### Equipment Orders (`/api/orders/equipment/*`)

| Method | Path (via Nginx) | Auth | Description |
|--------|-----------------|------|-------------|
| POST | `/api/orders/equipment/place-order` | JWT | Place an equipment rental/purchase order |
| GET | `/api/orders/equipment/user-orders` | JWT | Get user's equipment orders |
| POST | `/api/orders/equipment/cancel-order` | JWT | Cancel equipment order |
| GET | `/api/orders/equipment/admin-orders` | JWT (`order:read`) | Admin: list all equipment orders |
| POST | `/api/orders/equipment/update-status` | JWT (`order:write`) | Admin: update equipment order status |

## Other Services Called

| Service | How | Why |
|---------|-----|-----|
| payment-service (:3009) | HTTP / RabbitMQ | Coordinate Razorpay payments & refunds |
| ecommerce-service (:3007) | Direct / Shared DB | Verify product stock and pricing |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.orders` | `order.created` | Order placed by farmer |
| `kissan.orders` | `order.status_updated` | Status changed (processing, shipped, etc.) |
| `kissan.orders` | `order.delivered` | Order marked as delivered |
| `kissan.orders` | `order.delayed` | Delivery delayed notification |
| `kissan.orders` | `return.requested` | Farmer requests a return |
| `kissan.orders` | `refund.initiated` | Refund initiated on cancellation |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3008) |
| `JWT_SECRET` | Yes | Token verification secret |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Database authentication key |
| `RABBITMQ_URL` | Yes | Message broker AMQP connection URL |
| `RAZORPAY_KEY_ID` | Yes | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay API secret key |

## Testing

```bash
# Health check
curl http://localhost:3008/health

# Prometheus metrics
curl http://localhost:3008/metrics

# Place order (requires JWT token)
curl -X POST http://localhost/api/orders/place \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"productId": "<UUID>", "quantity": 2}], "addressId": "<UUID>"}'
```
