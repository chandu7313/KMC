import mongoose from 'mongoose';
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const { Client } = pkg;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, unique: true, sparse: true },
    otp: { type: String, default: '' },
    otpExpireAt: { type: Number, default: 0 },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'field-officer'], default: 'user' },
    district: { type: String, default: 'Other' },
    crops: { type: [String], default: [] },
    fieldOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    language: { type: String, default: 'en' },
    preferredLanguage: { type: String, default: 'en' },
    hasCompletedTour: { type: Boolean, default: false },
    simpleMode: { type: Boolean, default: false },
    cartData: { type: Object, default: {} },
    addresses: [{
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    }]
}, { timestamps: true });

const User = mongoose.models.user || mongoose.model('user', userSchema);

async function migrateFarmers() {
    console.log("Starting migration process...");
    
    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB.");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        return;
    }

    // Connect to Supabase Postgres
    const pgClient = new Client({
        connectionString: process.env.SUPABASE_URL,
    });
    
    try {
        await pgClient.connect();
        console.log("Connected to Supabase PostgreSQL.");
    } catch (err) {
        console.error("Supabase PostgreSQL connection error:", err);
        await mongoose.disconnect();
        return;
    }

    // Create table in Supabase
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS farmers (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                phone VARCHAR(50),
                role VARCHAR(50),
                district VARCHAR(255),
                crops TEXT[],
                language VARCHAR(50),
                preferred_language VARCHAR(50),
                is_account_verified BOOLEAN,
                has_completed_tour BOOLEAN,
                simple_mode BOOLEAN,
                addresses JSONB,
                created_at TIMESTAMP,
                updated_at TIMESTAMP
            );
        `;
        await pgClient.query(createTableQuery);
        console.log("Checked/created 'farmers' table in Supabase.");
    } catch (err) {
        console.error("Error creating table:", err);
        return;
    }

    // Fetch farmers
    try {
        const farmers = await User.find({ role: 'user' }).lean();
        console.log(`Found ${farmers.length} farmers in MongoDB. Migrating data...`);

        let insertedCount = 0;
        for (const farmer of farmers) {
            const insertQuery = `
                INSERT INTO farmers (
                    id, name, email, phone, role, district, crops, language, preferred_language, 
                    is_account_verified, has_completed_tour, simple_mode, addresses, created_at, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    district = EXCLUDED.district,
                    crops = EXCLUDED.crops,
                    language = EXCLUDED.language,
                    preferred_language = EXCLUDED.preferred_language,
                    addresses = EXCLUDED.addresses,
                    updated_at = EXCLUDED.updated_at;
            `;
            
            const values = [
                farmer._id.toString(),
                farmer.name || '',
                farmer.email || '',
                farmer.phone || null,
                farmer.role || 'user',
                farmer.district || 'Other',
                farmer.crops || [],
                farmer.language || 'en',
                farmer.preferredLanguage || 'en',
                farmer.isAccountVerified || false,
                farmer.hasCompletedTour || false,
                farmer.simpleMode || false,
                JSON.stringify(farmer.addresses || []),
                farmer.createdAt ? new Date(farmer.createdAt) : new Date(),
                farmer.updatedAt ? new Date(farmer.updatedAt) : new Date()
            ];

            await pgClient.query(insertQuery, values);
            insertedCount++;
        }
        
        console.log(`Successfully migrated ${insertedCount} farmers to Supabase.`);
    } catch (err) {
        console.error("Migration error:", err);
    } finally {
        await mongoose.disconnect();
        await pgClient.end();
        console.log("Connections closed.");
    }
}

migrateFarmers();
