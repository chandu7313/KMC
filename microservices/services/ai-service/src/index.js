import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createLogger, requestId, metrics } from '@kissan/shared';
import geminiRoutes from './routes/gemini.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const logger = createLogger('ai-service');
const PORT = process.env.PORT || 3003;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(requestId);
app.use(metrics.metricsMiddleware);
app.use(morgan('combined', { stream: logger.stream }));

app.get('/health', (req, res) => {

// ── Prometheus Metrics ──
app.get('/metrics', metrics.metricsRoute);
  res.status(200).json({ status: 'healthy', service: 'ai-service', uptime: process.uptime(), timestamp: new Date().toISOString() });

});

app.use('/', geminiRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } });
});
app.use(errorHandler);

const server = app.listen(PORT, '0.0.0.0', () => logger.info(`AI service running on 0.0.0.0:${PORT}`));
const gracefulShutdown = (signal) => { logger.info(`${signal} received`); server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
