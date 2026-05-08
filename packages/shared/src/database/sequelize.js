const { Sequelize } = require('sequelize');
const config = require('../../config/src/env');
const { logger } = require('../logger/winston');

// Ensure SUPABASE_URL is treated as a PostgreSQL connection string
const connectionString = config.supabase.url;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(`[Sequelize] ${msg}`),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Sequelize PostgreSQL connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database via Sequelize:', { error: error.message });
  }
};

module.exports = { sequelize, connectDB };
