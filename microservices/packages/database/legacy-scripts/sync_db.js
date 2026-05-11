import { sequelize } from './config/database.js';
import './models/index.js'; // Import all models so they register

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync all defined models to the DB
        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database or sync:', error);
        process.exit(1);
    }
};

syncDatabase();
