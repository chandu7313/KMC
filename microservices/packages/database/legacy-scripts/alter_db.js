import { sequelize } from './config/database.js';

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query('ALTER TABLE crop_diagnoses ADD COLUMN IF NOT EXISTS recommended_products TEXT;');
        console.log('Successfully added recommended_products column');
        process.exit(0);
    } catch (e) {
        console.error('Error:', e);
        process.exit(1);
    }
})();
