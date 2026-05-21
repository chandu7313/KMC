import 'dotenv/config';
import { getSequelize } from './database/sequelize.js';

const test = async () => {
  try {
    const sequelize = getSequelize();
    await sequelize.authenticate();
    console.log('Sequelize connected successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect to Sequelize:', err);
    process.exit(1);
  }
};

test();
