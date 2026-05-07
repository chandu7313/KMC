const helmet = require('helmet');

/**
 * Helmet security headers configuration.
 */
const helmetMiddleware = () => {
  return helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: {
      action: 'deny',
    },
    noSniff: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
    hidePoweredBy: true,
  });
};

module.exports = helmetMiddleware;
