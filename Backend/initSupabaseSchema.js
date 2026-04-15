import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const { Client } = pkg;

async function setupSchema() {
    console.log("Connecting to Supabase to initialize schema...");
    
    // Connect to Supabase Postgres
    const pgClient = new Client({
        connectionString: process.env.SUPABASE_URL,
    });
    
    try {
        await pgClient.connect();
        console.log("Connected to Supabase PostgreSQL.");
    } catch (err) {
        console.error("Supabase PostgreSQL connection error:", err);
        console.log("Please ensure your SUPABASE_URL in the .env file is correct.");
        return;
    }

    const schemaQueries = `
        -- Drop existing tables to establish the exact schema provided by the user cleanly
        DROP TABLE IF EXISTS order_items CASCADE;
        DROP TABLE IF EXISTS orders CASCADE;
        DROP TABLE IF EXISTS products CASCADE;
        DROP TABLE IF EXISTS price_alerts CASCADE;
        DROP TABLE IF EXISTS market_prices CASCADE;
        DROP TABLE IF EXISTS soil_reports CASCADE;
        DROP TABLE IF EXISTS otp_sessions CASCADE;
        DROP TABLE IF EXISTS farmer_survey CASCADE;
        DROP TABLE IF EXISTS field_visit_bookings CASCADE;
        DROP TABLE IF EXISTS field_officers CASCADE;
        DROP TABLE IF EXISTS blogs CASCADE;
        DROP TABLE IF EXISTS notifications CASCADE;
        DROP TABLE IF EXISTS farmers CASCADE;

        -- 1. farmers (core user table)
        CREATE TABLE farmers (
            id uuid primary key default gen_random_uuid(),
            mobile text unique not null,
            name text,
            village text,
            district text,
            state text,
            age_group text,
            education_level text,
            preferred_language text default 'telugu',
            is_profile_complete boolean default false,
            survey_completed boolean default false,
            role text default 'farmer',
            created_at timestamptz default now(),
            updated_at timestamptz default now()
        );

        -- 2. farmer_survey (onboarding survey answers)
        CREATE TABLE IF NOT EXISTS farmer_survey (
            id uuid primary key default gen_random_uuid(),
            farmer_id uuid references farmers(id) on delete cascade,
            land_size text,
            land_ownership text,
            soil_type text,
            irrigation_source text,
            water_availability text,
            current_crops text[],
            previous_crops text[],
            season text[],
            crop_problems text[],
            soil_test_done boolean default false,
            fertilizers_used text[],
            pesticide_usage text,
            organic_farming boolean default false,
            biggest_problem text[],
            help_needed_when text[],
            selling_channel text,
            checks_price_before_selling boolean,
            selling_problem text,
            uses_smartphone boolean,
            comfortable_with text,
            created_at timestamptz default now()
        );

        -- 3. otp_sessions (mobile OTP login)
        CREATE TABLE IF NOT EXISTS otp_sessions (
            id uuid primary key default gen_random_uuid(),
            mobile text not null,
            otp text not null,
            expires_at timestamptz not null,
            verified boolean default false,
            created_at timestamptz default now()
        );

        -- 4. soil_reports
        CREATE TABLE IF NOT EXISTS soil_reports (
            id uuid primary key default gen_random_uuid(),
            farmer_id uuid references farmers(id) on delete cascade,
            ph numeric(4,2),
            nitrogen text,
            phosphorus text,
            potassium text,
            organic_matter text,
            soil_status text,
            fertilizer_recommendations text[],
            crop_suggestions text[],
            report_pdf_url text,
            entered_by uuid references farmers(id),
            next_test_due date,
            created_at timestamptz default now()
        );

        -- 5. market_prices (mandi data)
        CREATE TABLE IF NOT EXISTS market_prices (
            id uuid primary key default gen_random_uuid(),
            crop_name text not null,
            district text not null,
            state text not null,
            market_name text,
            min_price numeric(10,2),
            max_price numeric(10,2),
            modal_price numeric(10,2),
            price_date date not null,
            trend text,
            recommendation text,
            source text default 'agmarknet',
            created_at timestamptz default now()
        );

        -- 6. price_alerts (farmer sets target price)
        CREATE TABLE IF NOT EXISTS price_alerts (
            id uuid primary key default gen_random_uuid(),
            farmer_id uuid references farmers(id) on delete cascade,
            crop_name text not null,
            target_price numeric(10,2) not null,
            district text,
            is_active boolean default true,
            triggered_at timestamptz,
            created_at timestamptz default now()
        );

        -- 7. products (e-commerce)
        CREATE TABLE IF NOT EXISTS products (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            description text,
            category text,
            price numeric(10,2) not null,
            stock_qty integer default 0,
            image_url text,
            suitable_for_soils text[],
            suitable_for_crops text[],
            is_active boolean default true,
            created_at timestamptz default now()
        );

        -- 8. orders
        CREATE TABLE IF NOT EXISTS orders (
            id uuid primary key default gen_random_uuid(),
            farmer_id uuid references farmers(id) on delete cascade,
            total_amount numeric(10,2) not null,
            payment_method text,
            payment_status text default 'pending',
            order_status text default 'placed',
            razorpay_order_id text,
            delivery_address text,
            created_at timestamptz default now()
        );

        -- 9. order_items
        CREATE TABLE IF NOT EXISTS order_items (
            id uuid primary key default gen_random_uuid(),
            order_id uuid references orders(id) on delete cascade,
            product_id uuid references products(id),
            quantity integer not null,
            unit_price numeric(10,2) not null
        );

        -- 10. field_officers
        CREATE TABLE IF NOT EXISTS field_officers (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            mobile text unique not null,
            district text,
            specialization text[],
            is_available boolean default true,
            created_at timestamptz default now()
        );

        -- 11. field_visit_bookings
        CREATE TABLE IF NOT EXISTS field_visit_bookings (
            id uuid primary key default gen_random_uuid(),
            farmer_id uuid references farmers(id) on delete cascade,
            officer_id uuid references field_officers(id),
            service_type text not null,
            preferred_date date not null,
            preferred_time text,
            status text default 'pending',
            notes text,
            created_at timestamptz default now()
        );

        -- 12. blogs
        CREATE TABLE IF NOT EXISTS blogs (
            id uuid primary key default gen_random_uuid(),
            title text not null,
            content text not null,
            category text,
            image_url text,
            author_id uuid references farmers(id),
            is_published boolean default false,
            language text default 'english',
            created_at timestamptz default now()
        );

        -- 13. notifications
        CREATE TABLE IF NOT EXISTS notifications (
            id uuid primary key default gen_random_uuid(),
            farmer_id uuid references farmers(id) on delete cascade,
            type text,
            message text not null,
            is_read boolean default false,
            sent_via text,
            created_at timestamptz default now()
        );
    `;

    try {
        console.log("Executing schema queries...");
        await pgClient.query(schemaQueries);
        console.log("✅ Successfully created all 13 Supabase tables!");
    } catch (error) {
        console.error("❌ Error executing schema queries:", error);
    } finally {
        await pgClient.end();
        console.log("Database connection closed.");
    }
}

setupSchema();
