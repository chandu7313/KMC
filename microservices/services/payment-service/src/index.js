import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createLogger, requestId } from '@kissan/shared';
import paymentRoutes from './routes/payment.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const logger = createLogger('payment-service');
const PORT = process.env.PORT || 3009;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestId);
app.use(morgan('combined', { stream: logger.stream }));

app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', service: 'payment-service', uptime: process.uptime() }));
app.use('/', paymentRoutes);
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` } }));
app.use(errorHandler);

const server = app.listen(PORT, () => logger.info(`Payment service running on port ${PORT}`));
const gracefulShutdown = (signal) => { logger.info(`${signal}`); server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000); };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
export default app;
