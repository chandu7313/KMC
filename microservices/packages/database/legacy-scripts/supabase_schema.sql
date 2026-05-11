-- =====================================================
-- KMC Supabase Schema — Full Migration from MongoDB
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

-- ===================== ENUM TYPES =====================

CREATE TYPE user_role AS ENUM ('user', 'admin', 'field-officer');
CREATE TYPE order_status AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');
CREATE TYPE payment_status AS ENUM ('Pending', 'Completed', 'Failed');
CREATE TYPE payment_method AS ENUM ('COD', 'Razorpay');
CREATE TYPE soil_status AS ENUM ('Good', 'Moderate', 'Critical', 'Acidic', 'Neutral', 'Alkaline');
CREATE TYPE report_status AS ENUM ('Pending', 'Completed');
CREATE TYPE publish_status AS ENUM ('draft', 'published');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled');
CREATE TYPE notification_target AS ENUM ('All', 'District', 'Crop');
CREATE TYPE alert_condition AS ENUM ('Above', 'Below');
CREATE TYPE alert_status AS ENUM ('Active', 'Triggered');
CREATE TYPE orchard_status AS ENUM ('pending', 'assigned', 'completed');
CREATE TYPE water_type AS ENUM ('Borewell', 'Canal / River', 'Rain-fed');
CREATE TYPE package_status AS ENUM ('Active', 'Expired', 'Cancelled');

-- ===================== TABLES =====================

-- ===== MODULE 1: User / Auth =====

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    phone TEXT UNIQUE,
    otp TEXT DEFAULT '',
    otp_expire_at BIGINT DEFAULT 0,
    verify_otp TEXT DEFAULT '',
    verify_otp_expire_at BIGINT DEFAULT 0,
    reset_otp TEXT DEFAULT '',
    reset_otp_expire_at BIGINT DEFAULT 0,
    is_account_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'user',
    district TEXT DEFAULT 'Other',
    crops TEXT[] DEFAULT '{}',
    field_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    language TEXT DEFAULT 'en',
    preferred_language TEXT DEFAULT 'en',
    has_completed_tour BOOLEAN DEFAULT FALSE,
    simple_mode BOOLEAN DEFAULT FALSE,
    cart_data JSONB DEFAULT '{}',
    has_completed_survey BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_district ON users(district);
CREATE INDEX idx_users_field_officer ON users(field_officer_id);

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_addresses_user ON user_addresses(user_id);

CREATE TABLE farmer_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    language TEXT,
    farm_name TEXT,
    farm_size NUMERIC,
    farm_size_unit TEXT DEFAULT 'acres',
    land_ownership TEXT,
    soil_type TEXT,
    water_source TEXT,
    primary_crops TEXT[] DEFAULT '{}',
    farming_experience TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== MODULE 2: Soil Analysis =====

CREATE TABLE soil_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ph NUMERIC,
    nitrogen NUMERIC,
    phosphorus NUMERIC,
    potassium NUMERIC,
    organic_matter NUMERIC,
    micronutrients JSONB DEFAULT '{}',
    recommended_fertilizer TEXT,
    suitable_crops TEXT[] DEFAULT '{}',
    soil_status soil_status,
    suitability_pct NUMERIC,
    report_file TEXT,
    status report_status DEFAULT 'Pending',
    next_test_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_soil_reports_farmer ON soil_reports(farmer_id);
CREATE INDEX idx_soil_reports_status ON soil_reports(status);

CREATE TABLE soil_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_id UUID NOT NULL REFERENCES soil_reports(id) ON DELETE CASCADE,
    reminder_date TIMESTAMPTZ NOT NULL,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_soil_reminders_user ON soil_reminders(user_id);
CREATE INDEX idx_soil_reminders_pending ON soil_reminders(reminder_date, is_sent) WHERE is_sent = FALSE;

-- ===== MODULE 3: Market Intelligence =====

CREATE TABLE market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_name TEXT NOT NULL,
    district TEXT NOT NULL,
    mandi TEXT DEFAULT 'Local Mandi',
    min_price NUMERIC,
    max_price NUMERIC,
    modal_price NUMERIC NOT NULL,
    change NUMERIC DEFAULT 0,
    arrival_date TIMESTAMPTZ DEFAULT NOW(),
    variety TEXT DEFAULT 'Standard',
    source TEXT DEFAULT 'agmarknet',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_market_prices_crop ON market_prices(crop_name);
CREATE INDEX idx_market_prices_district ON market_prices(district);
CREATE INDEX idx_market_prices_arrival ON market_prices(arrival_date DESC);
CREATE INDEX idx_market_prices_compound ON market_prices(crop_name, district, arrival_date DESC);

CREATE TABLE market_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop TEXT NOT NULL,
    district TEXT NOT NULL,
    price NUMERIC NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(crop, district, date)
);

CREATE INDEX idx_market_history_date ON market_history(date);
CREATE INDEX idx_market_history_lookup ON market_history(crop, district, date);

CREATE TABLE price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop TEXT NOT NULL,
    target_price NUMERIC NOT NULL,
    condition alert_condition NOT NULL,
    status alert_status DEFAULT 'Active',
    last_notified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(status) WHERE status = 'Active';

-- ===== MODULE 4: E-Commerce =====

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    category TEXT NOT NULL,
    sub_category TEXT,
    price NUMERIC NOT NULL,
    discounted_price NUMERIC,
    images TEXT[] DEFAULT '{}',
    stock INTEGER DEFAULT 0,
    specifications JSONB DEFAULT '{}',
    ratings NUMERIC DEFAULT 0,
    num_reviews INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE TABLE marketplace_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC NOT NULL,
    address TEXT NOT NULL,
    status order_status DEFAULT 'Pending',
    payment_method payment_method DEFAULT 'COD',
    payment_status payment_status DEFAULT 'Pending',
    razorpay_order_id TEXT DEFAULT '',
    payment_details JSONB DEFAULT '{}',
    cancellation_reason TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketplace_orders_user ON marketplace_orders(user_id);
CREATE INDEX idx_marketplace_orders_status ON marketplace_orders(status);

CREATE TABLE marketplace_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL
);

CREATE INDEX idx_marketplace_order_items_order ON marketplace_order_items(order_id);

CREATE TABLE equipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipments_category ON equipments(category);

CREATE TABLE equipment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC NOT NULL,
    address TEXT NOT NULL,
    status order_status DEFAULT 'Pending',
    payment_status payment_status DEFAULT 'Pending',
    cancellation_reason TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_equipment_orders_user ON equipment_orders(user_id);

CREATE TABLE equipment_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES equipment_orders(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipments(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL
);

CREATE INDEX idx_equipment_order_items_order ON equipment_order_items(order_id);

CREATE TABLE fertilizers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fertilizers_category ON fertilizers(category);

CREATE TABLE fertilizer_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC NOT NULL,
    address TEXT NOT NULL,
    status order_status DEFAULT 'Pending',
    payment_status payment_status DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fertilizer_orders_user ON fertilizer_orders(user_id);

CREATE TABLE fertilizer_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES fertilizer_orders(id) ON DELETE CASCADE,
    fertilizer_id UUID NOT NULL REFERENCES fertilizers(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL
);

CREATE INDEX idx_fertilizer_order_items_order ON fertilizer_order_items(order_id);

-- ===== MODULE 5: Admin Dashboard (Content) =====

CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    author TEXT,
    status publish_status DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_status ON blogs(status);

CREATE TABLE success_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_name TEXT,
    district TEXT,
    crop TEXT,
    before_yield NUMERIC,
    after_yield NUMERIC,
    description TEXT,
    image TEXT,
    status publish_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_success_stories_district ON success_stories(district);
CREATE INDEX idx_success_stories_crop ON success_stories(crop);
CREATE INDEX idx_success_stories_status ON success_stories(status);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    village TEXT NOT NULL,
    district TEXT NOT NULL,
    visit_date TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    assigned_officer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status booking_status DEFAULT 'Pending',
    payment_status payment_status DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX idx_bookings_officer ON bookings(assigned_officer_id);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_type notification_target NOT NULL,
    target_value TEXT DEFAULT 'Global',
    recipient_count INTEGER DEFAULT 0,
    sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    package TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW(),
    status package_status DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);

-- ===== MODULE 6: Orchard Requests =====

CREATE TABLE orchard_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    acres NUMERIC NOT NULL,
    location TEXT NOT NULL,
    water_type water_type NOT NULL,
    goal TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    market_preference TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    status orchard_status DEFAULT 'pending',
    assigned_expert TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orchard_requests_farmer ON orchard_requests(farmer_id);
CREATE INDEX idx_orchard_requests_status ON orchard_requests(status);

-- ===================== TRIGGERS =====================

-- Auto-update updated_at on all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON soil_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON soil_reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON market_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON market_history FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON price_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON marketplace_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON equipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON equipment_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON fertilizers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON fertilizer_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON success_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orchard_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON farmer_surveys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate blog slug from title
CREATE OR REPLACE FUNCTION generate_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.title IS NOT NULL AND (TG_OP = 'INSERT' OR NEW.title != OLD.title) THEN
        NEW.slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.title, '[^\w ]+', '', 'g'), ' +', '-', 'g'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_slug_trigger BEFORE INSERT OR UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION generate_blog_slug();
