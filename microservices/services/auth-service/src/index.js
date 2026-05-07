import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createLogger, requestId } from '@kissan/shared';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const logger = createLogger('auth-service');
const PORT = process.env.PORT || 3001;

// ── Trust proxy (behind Nginx) ──
app.set('trust proxy', 1);

// ── Global Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestId);
app.use(morgan('combined', { stream: logger.stream }));

// ── Health Check ──
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'auth-service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ──
app.use('/', authRoutes);

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
});

// ── Global Error Handler ──
app.use(errorHandler);

// ── Graceful Shutdown ──
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

const server = app.listen(PORT, () => {
  logger.info(`Auth service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
