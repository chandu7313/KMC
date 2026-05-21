import { Sequelize } from 'sequelize';
import createLogger from '../logger/winston.js';

const logger = createLogger('shared-database');

let sequelizeInstance = null;

/**
 * Get or create a Sequelize singleton.
 * @param {object} [options] - Override connection options
 * @returns {import('sequelize').Sequelize}
 */
const getSequelize = (options = {}) => {
  if (sequelizeInstance) return sequelizeInstance;

  const url = options.url || process.env.DATABASE_URL || process.env.SUPABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL or SUPABASE_URL must be set');
  }

  // Parse the URL since Sequelize handles postgres:// properly
  sequelizeInstance = new Sequelize(url, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
    // Required for Supabase pooling to work well
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For supabase connection
      }
    },
    // We already use underscored names in Supabase schema (created_at, updated_at)
    define: {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  });

  return sequelizeInstance;
};

/**
 * Health check for Sequelize connection.
 * @returns {Promise<{connected: boolean, latency: number}>}
 */
const checkSequelizeHealth = async () => {
  const start = Date.now();
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    const latency = Date.now() - start;
    return { connected: true, latency };
  } catch (err) {
    return { connected: false, latency: Date.now() - start, error: err.message };
  }
};

/**
 * Disconnect Sequelize gracefully.
 */
const disconnectSequelize = async () => {
  if (sequelizeInstance) {
    await sequelizeInstance.close();
    sequelizeInstance = null;
    logger.info('Sequelize connection closed');
  }
};

export { getSequelize, checkSequelizeHealth, disconnectSequelize };
