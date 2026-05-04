import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Initialize Sequelize with the PostgreSQL URL from the .env file
const dbUrl = process.env.SUPABASE_URL;

const sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    logging: false, // Set to console.log to see raw SQL queries
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        schema: 'public',
    },
    searchPath: 'public',
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL (via Sequelize) connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
