const cors = require('cors');

/**
 * Centralized CORS configuration middleware.
 */
const corsMiddleware = () => {
  // Domains that are allowed to access the API
  const whitelist = [
    'http://localhost:3000',      // React Dev
    'http://localhost:5173',      // Vite Dev
    process.env.FRONTEND_URL,     // Production Frontend
  ].filter(Boolean);

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || whitelist.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'X-Request-ID'],
    credentials: true,
    maxAge: 86400, // 24 hours
  };

  return cors(corsOptions);
};

module.exports = corsMiddleware;
