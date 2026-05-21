import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createLogger, requestId, metrics } from '@kissan/shared';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const logger = createLogger('analytics-service');
const PORT = process.env.PORT || 3014;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(requestId);
app.use(metrics.metricsMiddleware);
app.use(morgan('combined', { stream: logger.stream }));

app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', service: 'analytics-service', uptime: process.uptime() }));

// ── Prometheus Metrics ──
app.get('/metrics', metrics.metricsRoute);

// TODO: Add analytics routes
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` } }));
app.use(errorHandler);

const server = app.listen(PORT, '0.0.0.0', () => logger.info(`Analytics service running on 0.0.0.0:${PORT}`));
const gracefulShutdown = (signal) => { logger.info(`${signal}`); server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
export default app;
