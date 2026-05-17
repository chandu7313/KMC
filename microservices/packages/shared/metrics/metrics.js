/**
 * @kissan/shared — Prometheus Metrics Module
 * Centralized metrics for all Kissan Mithar microservices.
 *
 * Usage in each service's index.js:
 *   import { metrics } from '@kissan/shared';
 *   app.use(metrics.metricsMiddleware);
 *   app.get('/metrics', metrics.metricsRoute);
 */

import client from 'prom-client';

// ─── Default Metrics ────────────────────────────────────────
// Collect Node.js runtime metrics (CPU, memory, GC, event loop, etc.)
client.collectDefaultMetrics({
  prefix: 'kissan_',
  labels: {
    service: process.env.SERVICE_NAME || 'unknown',
    environment: process.env.NODE_ENV || 'development',
  },
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// ═══════════════════════════════════════════════════════════
// HTTP METRICS
// ═══════════════════════════════════════════════════════════

export const httpRequestDuration = new client.Histogram({
  name: 'kissan_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code', 'service'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

export const httpRequestTotal = new client.Counter({
  name: 'kissan_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service'],
});

export const httpRequestErrors = new client.Counter({
  name: 'kissan_http_errors_total',
  help: 'Total number of HTTP errors (4xx + 5xx)',
  labelNames: ['method', 'route', 'status_code', 'service', 'error_code'],
});

export const activeConnections = new client.Gauge({
  name: 'kissan_active_connections',
  help: 'Number of active HTTP connections',
  labelNames: ['service'],
});

// ═══════════════════════════════════════════════════════════
// AUTH / USER METRICS
// ═══════════════════════════════════════════════════════════

export const otpSentTotal = new client.Counter({
  name: 'kissan_otp_sent_total',
  help: 'Total OTP messages sent',
  labelNames: ['channel', 'status'], // channel: sms|disabled  status: success|failed
});

export const loginAttempts = new client.Counter({
  name: 'kissan_login_attempts_total',
  help: 'Total login attempts',
  labelNames: ['user_type', 'status'], // user_type: farmer|admin  status: success|failed
});

export const activeUsers = new client.Gauge({
  name: 'kissan_active_users',
  help: 'Currently active users',
  labelNames: ['user_type'],
});

// ═══════════════════════════════════════════════════════════
// DISEASE DETECTION / AI METRICS
// ═══════════════════════════════════════════════════════════

export const diseaseScansTotal = new client.Counter({
  name: 'kissan_disease_scans_total',
  help: 'Total crop disease scans',
  labelNames: ['result', 'severity', 'crop_type'],
  // result: disease_detected | healthy | failed
});

export const diseaseDetectionDuration = new client.Histogram({
  name: 'kissan_disease_detection_duration_seconds',
  help: 'Time taken for AI disease detection',
  labelNames: ['ai_provider', 'status'],
  buckets: [0.5, 1, 2, 5, 10, 20, 30],
});

export const aiApiCalls = new client.Counter({
  name: 'kissan_ai_api_calls_total',
  help: 'Total AI API calls',
  labelNames: ['provider', 'status'], // provider: gemini|plant_id
});

// ═══════════════════════════════════════════════════════════
// E-COMMERCE METRICS
// ═══════════════════════════════════════════════════════════

export const ordersTotal = new client.Counter({
  name: 'kissan_orders_total',
  help: 'Total orders placed',
  labelNames: ['status', 'payment_method'],
});

export const orderValue = new client.Histogram({
  name: 'kissan_order_value_rupees',
  help: 'Order value in Indian Rupees',
  labelNames: ['category'],
  buckets: [100, 250, 500, 1000, 2000, 5000, 10000, 25000, 50000],
});

export const revenueTotal = new client.Counter({
  name: 'kissan_revenue_total_rupees',
  help: 'Total revenue in Indian Rupees',
  labelNames: ['module', 'payment_method'],
  // module: ecommerce | consultation | soil_kit
});

export const cartAbandonments = new client.Counter({
  name: 'kissan_cart_abandonments_total',
  help: 'Total cart abandonments',
  labelNames: ['reason'],
});

// ═══════════════════════════════════════════════════════════
// PAYMENT METRICS
// ═══════════════════════════════════════════════════════════

export const paymentsTotal = new client.Counter({
  name: 'kissan_payments_total',
  help: 'Total payment transactions',
  labelNames: ['status', 'method', 'module'],
  // status: success | failed | pending
});

export const refundsTotal = new client.Counter({
  name: 'kissan_refunds_total',
  help: 'Total refund transactions',
  labelNames: ['status', 'reason'],
});

export const refundAmount = new client.Counter({
  name: 'kissan_refund_amount_total_rupees',
  help: 'Total refund amount in Rupees',
  labelNames: ['reason'],
});

// ═══════════════════════════════════════════════════════════
// SUPPORT METRICS
// ═══════════════════════════════════════════════════════════

export const ticketsTotal = new client.Counter({
  name: 'kissan_support_tickets_total',
  help: 'Total support tickets created',
  labelNames: ['category', 'priority', 'source'],
});

export const ticketResolutionTime = new client.Histogram({
  name: 'kissan_ticket_resolution_hours',
  help: 'Time to resolve support tickets in hours',
  labelNames: ['priority', 'category'],
  buckets: [0.5, 1, 2, 4, 8, 24, 48, 72, 168],
});

export const slaBreachesTotal = new client.Counter({
  name: 'kissan_sla_breaches_total',
  help: 'Total SLA breaches',
  labelNames: ['priority', 'type'], // type: first_response | resolution
});

// ═══════════════════════════════════════════════════════════
// EXPERT CONSULTATION METRICS
// ═══════════════════════════════════════════════════════════

export const consultationsTotal = new client.Counter({
  name: 'kissan_consultations_total',
  help: 'Total expert consultations booked',
  labelNames: ['status', 'expert_type'],
});

export const consultationRating = new client.Histogram({
  name: 'kissan_consultation_rating',
  help: 'Expert consultation ratings',
  labelNames: ['expert_id'],
  buckets: [1, 2, 3, 4, 5],
});

// ═══════════════════════════════════════════════════════════
// SOIL TESTING METRICS
// ═══════════════════════════════════════════════════════════

export const soilTestsTotal = new client.Counter({
  name: 'kissan_soil_tests_total',
  help: 'Total soil tests submitted',
  labelNames: ['method', 'health_category'],
  // method: upload | manual | kit
  // health_category: excellent | moderate | poor | critical
});

// ═══════════════════════════════════════════════════════════
// NOTIFICATION METRICS
// ═══════════════════════════════════════════════════════════

export const notificationsSentTotal = new client.Counter({
  name: 'kissan_notifications_sent_total',
  help: 'Total notifications sent',
  labelNames: ['channel', 'status', 'type'],
  // channel: email | sms | push
  // status: sent | failed | disabled
});

// ═══════════════════════════════════════════════════════════
// DATABASE METRICS
// ═══════════════════════════════════════════════════════════

export const dbQueryDuration = new client.Histogram({
  name: 'kissan_db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['database', 'operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export const dbConnectionPool = new client.Gauge({
  name: 'kissan_db_connections_active',
  help: 'Active database connections',
  labelNames: ['database'],
});

// ═══════════════════════════════════════════════════════════
// REDIS CACHE METRICS
// ═══════════════════════════════════════════════════════════

export const redisCacheHits = new client.Counter({
  name: 'kissan_redis_cache_hits_total',
  help: 'Redis cache hits',
  labelNames: ['key_pattern', 'service'],
});

export const redisCacheMisses = new client.Counter({
  name: 'kissan_redis_cache_misses_total',
  help: 'Redis cache misses',
  labelNames: ['key_pattern', 'service'],
});

// ═══════════════════════════════════════════════════════════
// RABBITMQ METRICS
// ═══════════════════════════════════════════════════════════

export const rabbitMQMessagesPublished = new client.Counter({
  name: 'kissan_rabbitmq_messages_published_total',
  help: 'Total RabbitMQ messages published',
  labelNames: ['exchange', 'event_type', 'service'],
});

export const rabbitMQMessagesConsumed = new client.Counter({
  name: 'kissan_rabbitmq_messages_consumed_total',
  help: 'Total RabbitMQ messages consumed',
  labelNames: ['queue', 'event_type', 'status', 'service'],
});

export const rabbitMQQueueDepth = new client.Gauge({
  name: 'kissan_rabbitmq_queue_depth',
  help: 'RabbitMQ queue message depth',
  labelNames: ['queue'],
});

// ═══════════════════════════════════════════════════════════
// EXPRESS MIDDLEWARE
// ═══════════════════════════════════════════════════════════

/**
 * Express middleware that automatically records HTTP metrics
 * for every request. Add BEFORE your routes.
 */
export const metricsMiddleware = (req, res, next) => {
  // Skip instrumenting the /metrics endpoint itself
  if (req.path === '/metrics') return next();

  const start = process.hrtime.bigint();
  const service = process.env.SERVICE_NAME || 'unknown';

  activeConnections.inc({ service });

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationSec = durationNs / 1e9;

    // Normalize route to avoid high-cardinality label explosion
    const route = req.route?.path || req.baseUrl + (req.route?.path || '') || req.path;

    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode,
      service,
    };

    httpRequestDuration.observe(labels, durationSec);
    httpRequestTotal.inc(labels);
    activeConnections.dec({ service });

    if (res.statusCode >= 400) {
      httpRequestErrors.inc({
        ...labels,
        error_code: res.locals?.errorCode || 'UNKNOWN',
      });
    }
  });

  next();
};

// ═══════════════════════════════════════════════════════════
// METRICS ENDPOINT
// ═══════════════════════════════════════════════════════════

/**
 * Express route handler for GET /metrics.
 * Returns Prometheus-formatted metrics.
 */
export const metricsRoute = async (_req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (err) {
    res.status(500).end(err.message);
  }
};

/** The prom-client registry (for advanced use) */
export const register = client.register;
