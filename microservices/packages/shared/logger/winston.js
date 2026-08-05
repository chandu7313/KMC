import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(LOG_COLORS);

/**
 * Creates a configured Winston logger instance for a microservice.
 * @param {string} serviceName - Name of the microservice (e.g., 'auth-service')
 * @param {object} [options] - Optional overrides
 * @param {string} [options.level] - Log level (default: from env or 'info')
 * @param {string} [options.logDir] - Log directory (default: './logs')
 * @returns {winston.Logger}
 */
const createLogger = (serviceName, options = {}) => {
  const level = options.level || process.env.LOG_LEVEL || 'info';
  const logDir = options.logDir || path.join(process.cwd(), 'logs');
  const isProduction = process.env.NODE_ENV === 'production';

  const baseFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format((info) => {
      info.service = serviceName;
      return info;
    })()
  );

  const jsonFormat = winston.format.combine(
    baseFormat,
    winston.format.json()
  );

  const consoleFormat = winston.format.combine(
    baseFormat,
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, service, requestId, ...meta }) => {
      const reqId = requestId ? ` [${requestId}]` : '';
      const metaStr = Object.keys(meta).length && !meta.stack
        ? ` ${JSON.stringify(meta)}`
        : meta.stack ? `\n${meta.stack}` : '';
      return `${timestamp} [${service}]${reqId} ${level}: ${message}${metaStr}`;
    })
  );

  const transports = [];

  // Console transport — always enabled
  transports.push(
    new winston.transports.Console({
      level,
      format: isProduction ? jsonFormat : consoleFormat,
    })
  );

  // File transports — production only
  if (isProduction && process.env.ENABLE_FILE_LOGS !== 'false') {
    try {
      transports.push(
        new DailyRotateFile({
          level: 'info',
          dirname: logDir,
          filename: `${serviceName}-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          format: jsonFormat,
          zippedArchive: true,
        })
      );

      transports.push(
        new DailyRotateFile({
          level: 'error',
          dirname: logDir,
          filename: `${serviceName}-error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          format: jsonFormat,
          zippedArchive: true,
        })
      );
    } catch (err) {
      console.warn(`[${serviceName}] File logging disabled: ${err.message}`);
    }
  }

  const logger = winston.createLogger({
    levels: LOG_LEVELS,
    level,
    transports,
    exitOnError: false,
    defaultMeta: { service: serviceName },
  });

  // Stream for Morgan HTTP logging integration
  logger.stream = {
    write: (message) => logger.http(message.trim()),
  };

  return logger;
};

export default createLogger;
