/**
 * Migration: Add new columns to crop_diagnoses table
 * for the enhanced Gemini Vision API structured response.
 * 
 * Run once: node migrations/addDiagnosisColumns.js
 */
import 'dotenv/config';
import { sequelize } from '../config/database.js';

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database.');

        const columns = [
            { name: 'scientific_name', type: 'VARCHAR(255)' },
            { name: 'cause', type: 'VARCHAR(255)' },
            { name: 'cause_classification', type: 'VARCHAR(255)' },
            { name: 'symptoms', type: 'TEXT' },
            { name: 'similar_diseases', type: 'TEXT' },
        ];

        for (const col of columns) {
            try {
                await sequelize.query(
                    `ALTER TABLE crop_diagnoses ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type};`
                );
                console.log(`  ✅ Column "${col.name}" ensured.`);
            } catch (err) {
                // Column might already exist in some PostgreSQL versions that don't support IF NOT EXISTS
                if (err.message.includes('already exists')) {
                    console.log(`  ⏭️  Column "${col.name}" already exists, skipping.`);
                } else {
                    throw err;
                }
            }
        }

        console.log('\n✅ Migration complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
};

run();
