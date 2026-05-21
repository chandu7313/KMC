import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createLogger, requestId, metrics } from '@kissan/shared';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startNotificationConsumers } from './events/consumers/notification.consumer.js';

const app = express();
const logger = createLogger('notification-service');
const PORT = process.env.PORT || 3010;

app.set('trust proxy', 1);

// ── Middleware ──
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(requestId);
app.use(metrics.metricsMiddleware);
app.use(morgan('combined', { stream: logger.stream }));

// ── Health Check ──
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'notification-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

});

// ── Prometheus Metrics ──
app.get('/metrics', metrics.metricsRoute);

// ── Routes ──
app.use('/', notificationRoutes);

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Start Event Consumers ──
const startConsumers = async () => {
  try {
    await startNotificationConsumers();
    logger.info('RabbitMQ consumers started successfully');
  } catch (error) {
    logger.error('Failed to start consumers. Will retry in 10s...', { error: error.message });
    setTimeout(startConsumers, 10000);
  }
};

// ── Server ──
const server = app.listen(PORT, '0.0.0.0', async () => {
  logger.info(`Notification service running on 0.0.0.0:${PORT}`);
  await startConsumers();
});

// ── Graceful Shutdown ──
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
