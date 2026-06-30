import { getSequelize, models } from '../index.js';
import createLogger from '../logger/winston.js';

const logger = createLogger('db-sync');

const syncDatabase = async () => {
  try {
    const sequelize = getSequelize();
    
    // Ensure connection is established
    await sequelize.authenticate();
    logger.info('Connection to local PostgreSQL has been established successfully.');

    // Sync all defined models to the DB
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized successfully.');

    process.exit(0);
  } catch (error) {
    logger.error('Error synchronizing database:', error);
    process.exit(1);
  }
};

syncDatabase();
