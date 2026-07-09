import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createLogger, requestId, metrics } from '@kissan/shared';
import userRoutes from './routes/user.routes.js';
import adminUserRoutes from './routes/admin-user.routes.js';
import addressRoutes from './routes/address.routes.js';
import surveyRoutes from './routes/survey.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const logger = createLogger('user-service');
const PORT = process.env.PORT || 3002;

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestId);
app.use(metrics.metricsMiddleware);
app.use(morgan('combined', { stream: logger.stream }));

// ── Health ──
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'user-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });

});

// ── Prometheus Metrics ──
app.get('/metrics', metrics.metricsRoute);

// ── Routes ──
app.use('/profile', userRoutes);
app.use('/admin', adminUserRoutes);
app.use('/addresses', addressRoutes);
app.use('/survey', surveyRoutes);

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
});

app.use(errorHandler);

// ── Server ──
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`User service running on 0.0.0.0:${PORT}`);
});

const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
