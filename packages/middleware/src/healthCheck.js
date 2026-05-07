const express = require('express');

/**
 * Factory to create health check endpoints.
 * 
 * @param {Object} dependencies 
 * @param {Object} [dependencies.db] - Database client with a healthCheck() method
 * @param {Object} [dependencies.redis] - Redis client with a healthCheck() method
 * @param {Object} [dependencies.rabbitmq] - RabbitMQ connection with active state
 * @returns {import('express').Router}
 */
const createHealthCheck = ({ db, redis, rabbitmq } = {}) => {
  const router = express.Router();

  // Basic Liveness Probe
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: process.env.SERVICE_NAME || 'unknown',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // Deep Readiness Probe
  router.get('/ready', async (req, res) => {
    const checks = {};
    let isReady = true;

    try {
      if (db) {
        checks.database = await db.healthCheck() ? 'ok' : 'error';
        if (checks.database === 'error') isReady = false;
      }

      if (redis) {
        checks.redis = await redis.healthCheck() ? 'ok' : 'error';
        if (checks.redis === 'error') isReady = false;
      }

      if (rabbitmq) {
        // Simple check if connection exists and is not closed
        checks.rabbitmq = (rabbitmq.connection && rabbitmq.connection.connection) ? 'ok' : 'error';
        if (checks.rabbitmq === 'error') isReady = false;
      }

      const status = isReady ? 200 : 503;
      
      res.status(status).json({
        status: isReady ? 'ready' : 'not_ready',
        checks,
        service: process.env.SERVICE_NAME || 'unknown',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        status: 'not_ready',
        checks,
        error: error.message,
      });
    }
  });

  return router;
};

module.exports = createHealthCheck;
