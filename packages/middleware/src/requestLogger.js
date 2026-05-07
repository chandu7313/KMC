const { httpLogger, logger } = require('@kissan-mithar/shared');
const morgan = require('morgan');

/**
 * Advanced HTTP request logger middleware combining Morgan and Winston.
 */
const requestLogger = () => {
  // Define custom morgan token for user ID if authenticated
  morgan.token('userId', (req) => {
    return req.user ? req.user.id : 'guest';
  });

  // Define custom morgan token for user role if authenticated
  morgan.token('userRole', (req) => {
    return req.user ? req.user.role : 'none';
  });

  // Define custom morgan token for request ID
  morgan.token('reqId', (req) => {
    return req.id || '-';
  });

  // Custom log format string
  const format = ':remote-addr - :reqId - :userId (:userRole) ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms';

  return morgan(format, {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
    // Exclude health check endpoints from cluttering the logs
    skip: (req, res) => req.originalUrl === '/health' || req.originalUrl === '/ready',
  });
};

module.exports = requestLogger;
