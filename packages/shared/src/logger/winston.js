const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const morgan = require('morgan');
const { AsyncLocalStorage } = require('async_hooks');

// Initialize AsyncLocalStorage to trace request IDs across asynchronous boundaries
const asyncLocalStorage = new AsyncLocalStorage();

/**
 * Winston format to inject contextual information.
 * Extracts requestId from AsyncLocalStorage if available.
 */
const appendContext = winston.format((info) => {
  const store = asyncLocalStorage.getStore();
  if (store && store.requestId) {
    info.requestId = store.requestId;
  }
  
  info.service = process.env.SERVICE_NAME || 'unknown-service';
  info.environment = process.env.NODE_ENV || 'development';
  return info;
});

// Custom log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'http'; // Default to http in prod to capture requests
};

// Define colors for each log level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Development console format
const devFormat = winston.format.combine(
  appendContext(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level} [${info.service}]${info.requestId ? ` [req:${info.requestId}]` : ''}: ${info.message}`,
  )
);

// Production JSON format
const prodFormat = winston.format.combine(
  appendContext(),
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transport for all logs with daily rotation (retention: 14 days)
const combinedTransport = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Transport for error logs with daily rotation (retention: 14 days)
const errorTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
});

// Always include the console transport
const consoleTransport = new winston.transports.Console({
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
});

/**
 * Global application logger instance.
 */
const logger = winston.createLogger({
  level: level(),
  levels,
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    consoleTransport,
    combinedTransport,
    errorTransport,
  ],
});

/**
 * Morgan stream to pipe HTTP requests into Winston
 */
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Use different morgan formats based on the environment
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

/**
 * Morgan HTTP logger middleware wrapper.
 */
const httpLogger = morgan(morganFormat, { stream });

module.exports = {
  logger,
  httpLogger,
  asyncLocalStorage, // Exported to be used by the requestId middleware
};
