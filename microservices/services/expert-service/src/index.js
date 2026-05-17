import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createLogger, requestId, metrics } from '@kissan/shared';
import expertRoutes from './routes/expert.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const logger = createLogger('expert-service');
const PORT = process.env.PORT || 3011;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(requestId);
app.use(metrics.metricsMiddleware);
app.use(morgan('combined', { stream: logger.stream }));

// ── Health ──
app.get('/health', (_req, res) =>
  res.status(200).json({ status: 'healthy', service: 'expert-service', uptime: process.uptime() })
);

// ── Prometheus Metrics ──
app.get('/metrics', metrics.metricsRoute);

// ── Routes ──
app.use('/', expertRoutes);

// ── 404 ──
app.use((req, res) =>
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` } })
);

app.use(errorHandler);

const server = app.listen(PORT, () => logger.info(`Expert service running on port ${PORT}`));

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
