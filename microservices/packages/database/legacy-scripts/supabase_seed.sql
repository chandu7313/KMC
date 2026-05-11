-- =====================================================
-- KMC Seed Data — Run AFTER supabase_schema.sql
-- Execute in Supabase Dashboard → SQL Editor
-- =====================================================

-- ===== USERS (Admin, Field Officers, Farmers) =====

-- Password hash for "password123" (bcrypt)
-- $2a$10$9jUYnIXZ5p5nqX3MXv9V3OYYiU8tZ5s0m.4Z1KpZ5j7e3Gj8a6X5W

INSERT INTO users (name, email, phone, role, district, crops, is_account_verified, password) VALUES
  ('Admin User', 'admin@agridust.com', '9999999999', 'admin', 'Hyderabad', ARRAY['All'], true, '$2a$10$9jUYnIXZ5p5nqX3MXv9V3OYYiU8tZ5s0m.4Z1KpZ5j7e3Gj8a6X5W'),
  ('John Officer', 'john.fo@agridust.com', '7777777777', 'field-officer', 'Warangal', ARRAY['Rice', 'Cotton'], true, '$2a$10$9jUYnIXZ5p5nqX3MXv9V3OYYiU8tZ5s0m.4Z1KpZ5j7e3Gj8a6X5W'),
  ('Priya Officer', 'priya.fo@agridust.com', '7777777778', 'field-officer', 'Karimnagar', ARRAY['Turmeric', 'Chilli'], true, '$2a$10$9jUYnIXZ5p5nqX3MXv9V3OYYiU8tZ5s0m.4Z1KpZ5j7e3Gj8a6X5W'),
  ('Amit Kumar', 'amit@example.com', '8888888888', 'user', 'Pune', ARRAY['Wheat', 'Sugarcane'], true, '$2a$10$9jUYnIXZ5p5nqX3MXv9V3OYYiU8tZ5s0m.4Z1KpZ5j7e3Gj8a6X5W'),
  ('Rajesh Reddy', 'rajesh@example.com', '8888888881', 'user', 'Warangal', ARRAY['Rice', 'Cotton'], true, NULL),
  ('Sunitha Devi', 'sunitha@example.com', '8888888882', 'user', 'Karimnagar', ARRAY['Turmeric', 'Chilli'], true, NULL),
  ('Venkat Rao', 'venkat@example.com', '8888888883', 'user', 'Nizamabad', ARRAY['Soybean', 'Rice'], true, NULL),
  ('Lakshmi Bai', 'lakshmi@example.com', '8888888884', 'user', 'Adilabad', ARRAY['Cotton', 'Jowar'], true, NULL),
  ('Mahesh Patil', 'mahesh@example.com', '8888888885', 'user', 'Nalgonda', ARRAY['Rice', 'Groundnut'], true, NULL),
  ('Anjali Sharma', 'anjali@example.com', '8888888886', 'user', 'Medak', ARRAY['Maize', 'Sunflower'], true, NULL),
  ('Suresh Goud', 'suresh@example.com', '8888888887', 'user', 'Khammam', ARRAY['Rice', 'Mango'], true, NULL),
  ('Padma Kumari', 'padma@example.com', '8888888888', 'user', 'Rangareddy', ARRAY['Vegetables', 'Flowers'], false, NULL);

-- Note: padma's phone conflicts with amit's, let's fix
UPDATE users SET phone = '8888888890' WHERE email = 'padma@example.com';

-- ===== PRODUCTS (Seeds, Tools, etc.) =====

INSERT INTO products (name, description, short_description, category, sub_category, price, discounted_price, stock, is_featured, images, specifications) VALUES
  ('Hybrid Tomato Seeds (F1)', 'Premium F1 hybrid tomato seeds with high yield potential. Disease resistant variety suitable for Telangana climate. Expected yield: 25-30 tons/acre.', 'High-yield F1 hybrid, disease resistant', 'Seeds', 'Vegetable Seeds', 450, 399, 200, true,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/seeds/tomato1.jpg'],
   '{"weight": "50g", "variety": "Arka Rakshak", "season": "Rabi/Kharif", "germination": "85%"}'::jsonb),
  
  ('Organic Neem Oil (1L)', 'Cold-pressed organic neem oil for natural pest control. Effective against aphids, whitefly, and mealybugs. NPOP certified.', '100% organic pest control', 'Pesticides', 'Organic', 380, 340, 150, true,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/pesticides/neem_oil.jpg'],
   '{"volume": "1 Litre", "type": "Cold Pressed", "certification": "NPOP"}'::jsonb),
  
  ('Drip Irrigation Kit (1 Acre)', 'Complete drip irrigation system for 1 acre. Includes main line, sub-main, laterals, drippers, filter, and fittings.', 'Complete 1-acre drip system', 'Equipment', 'Irrigation', 28500, 24999, 30, true,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/equipment/drip_kit.jpg'],
   '{"coverage": "1 Acre", "dripper_spacing": "30cm", "flow_rate": "2 LPH", "pipe_size": "16mm"}'::jsonb),
  
  ('DAP Fertilizer (50kg)', 'Di-Ammonium Phosphate (DAP) — 18% Nitrogen, 46% Phosphorus. Essential basal fertilizer for all crops.', 'Essential NPK basal fertilizer', 'Fertilizers', 'Chemical', 1350, NULL, 500, false,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/fertilizers/dap.jpg'],
   '{"weight": "50 kg", "N": "18%", "P": "46%", "grade": "18-46-0"}'::jsonb),
  
  ('Vermicompost (40kg)', 'Premium quality vermicompost rich in humic acid and beneficial microbes. Improves soil structure and water retention.', 'Organic soil conditioner', 'Fertilizers', 'Organic', 650, 580, 300, true,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/fertilizers/vermicompost.jpg'],
   '{"weight": "40 kg", "organic_matter": ">30%", "pH": "6.5-7.5", "C:N": "15:1"}'::jsonb),
  
  ('Knapsack Sprayer (16L)', 'Manual knapsack sprayer with brass nozzle. Robust plastic tank with adjustable spray pattern.', 'Manual pest spraying', 'Equipment', 'Spraying', 1800, 1599, 80, false,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/equipment/sprayer.jpg'],
   '{"capacity": "16 Litres", "material": "HDPE", "nozzle": "Brass (4-pattern)", "warranty": "1 Year"}'::jsonb),
  
  ('BT Cotton Seeds (450g)', 'Bollgard-II BT cotton seeds. High boll retention, bollworm resistant. Suitable for rainfed and irrigated conditions.', 'Bollworm resistant hybrid', 'Seeds', 'Cash Crop Seeds', 930, 880, 120, false,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/seeds/bt_cotton.jpg'],
   '{"weight": "450g", "variety": "BGII", "boll_size": "Medium-Large", "maturity": "150-160 days"}'::jsonb),
  
  ('Soil pH Meter (Digital)', 'Digital soil pH and moisture meter. No batteries needed for moisture. Instant readings. 3-in-1 functionality.', 'pH + Moisture + Light', 'Equipment', 'Testing', 750, 649, 60, true,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/equipment/ph_meter.jpg'],
   '{"range_pH": "3.5-8.0", "range_moisture": "1-10", "probe_length": "20cm", "battery": "Not required"}'::jsonb),

  ('Paddy Seeds IR-64 (5kg)', 'High-yielding medium-duration paddy variety. Excellent grain quality, resistant to blast and BPH. Ideal for wet and semi-dry conditions.', 'Medium-duration, blast resistant', 'Seeds', 'Cereal Seeds', 280, 250, 400, false,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/seeds/paddy_ir64.jpg'],
   '{"weight": "5 kg", "duration": "120-125 days", "yield": "6-7 t/ha", "grain": "Long slender"}'::jsonb),

  ('Humic Acid Granules (5kg)', 'High-quality humic acid granules to improve soil CEC and nutrient uptake. Apply during land preparation or with irrigation.', 'Soil health booster', 'Fertilizers', 'Organic', 890, 799, 200, false,
   ARRAY['https://res.cloudinary.com/demo/image/upload/v1/fertilizers/humic_acid.jpg'],
   '{"weight": "5 kg", "humic_acid": ">60%", "fulvic_acid": ">10%", "application": "5-10 kg/acre"}'::jsonb);

-- ===== EQUIPMENTS =====

INSERT INTO equipments (name, description, price, image, category, stock, specifications) VALUES
  ('Mini Tiller (5HP)', 'Compact 5HP mini tiller for small and medium farms. Petrol engine, 4-stroke. Ideal for inter-cultivation and seedbed preparation.', 45000, 'https://res.cloudinary.com/demo/image/upload/v1/equipment/mini_tiller.jpg', 'Tillage', 15,
   '{"engine": "5 HP Petrol", "width": "60cm", "depth": "15cm", "weight": "45kg"}'::jsonb),
  ('Solar Water Pump (2HP)', 'Solar-powered submersible pump. Includes 8 solar panels (330W each). No electricity cost. Govt subsidy available.', 185000, 'https://res.cloudinary.com/demo/image/upload/v1/equipment/solar_pump.jpg', 'Irrigation', 8,
   '{"power": "2 HP", "panels": "8 x 330W", "head": "50m", "discharge": "40,000 L/day"}'::jsonb),
  ('Battery Sprayer (12V, 16L)', 'Rechargeable battery-operated sprayer. 6-8 hours runtime. Includes 4 nozzle types.', 3500, 'https://res.cloudinary.com/demo/image/upload/v1/equipment/battery_sprayer.jpg', 'Spraying', 50,
   '{"capacity": "16L", "battery": "12V 8Ah", "runtime": "6-8 hrs", "charge_time": "8 hrs"}'::jsonb),
  ('Seed Drill (9 Row)', 'Tractor-mounted 9-row seed drill for precise sowing. Adjustable row spacing and seed rate.', 65000, 'https://res.cloudinary.com/demo/image/upload/v1/equipment/seed_drill.jpg', 'Sowing', 5,
   '{"rows": 9, "spacing": "20-30cm adjustable", "mounting": "Tractor 3-point", "weight": "180kg"}'::jsonb),
  ('Chaff Cutter (Electric)', 'Electric chaff cutter for fodder preparation. Cuts straw, hay, and green fodder. 2HP motor.', 18000, 'https://res.cloudinary.com/demo/image/upload/v1/equipment/chaff_cutter.jpg', 'Processing', 20,
   '{"motor": "2 HP", "capacity": "500 kg/hr", "blades": "3 (HSS)", "input_size": "Up to 3 inch"}'::jsonb);

-- ===== FERTILIZERS =====

INSERT INTO fertilizers (name, description, price, image, category, stock) VALUES
  ('Urea (50kg)', 'Government-grade urea fertilizer — 46% Nitrogen. Essential top-dressing fertilizer for all crops. Apply as per soil test recommendation.', 267, 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/urea.jpg', 'Nitrogen', 1000),
  ('MOP (50kg)', 'Muriate of Potash — 60% Potassium (K2O). Improves crop quality, drought tolerance, and disease resistance.', 1700, 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/mop.jpg', 'Potassium', 400),
  ('SSP (50kg)', 'Single Super Phosphate — 16% P2O5 + 11% Sulphur. Suitable for oilseeds, pulses, and cash crops.', 450, 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/ssp.jpg', 'Phosphorus', 600),
  ('NPK 20-20-0 (50kg)', 'Complex fertilizer with balanced N and P. Ideal for basal application in cereals and vegetables.', 1450, 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/npk_2020.jpg', 'Complex', 350),
  ('Zinc Sulphate (25kg)', 'Zinc sulphate heptahydrate — 21% Zn. Corrects zinc deficiency in rice, wheat, and maize.', 750, 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/zinc.jpg', 'Micronutrient', 250),
  ('Bio NPK (1L)', 'Liquid bio-fertilizer consortium — Azotobacter + PSB + KMB. Fixes atmospheric nitrogen and solubilizes P & K.', 320, 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/bio_npk.jpg', 'Biological', 500);

-- ===== MARKET PRICES (Mandi Prices) =====

INSERT INTO market_prices (crop_name, district, mandi, min_price, max_price, modal_price, variety, arrival_date) VALUES
  ('Rice', 'Warangal', 'Warangal Mandi', 1800, 2200, 2050, 'Sona Masuri', NOW()),
  ('Rice', 'Karimnagar', 'Karimnagar APMC', 1750, 2150, 1980, 'BPT 5204', NOW()),
  ('Cotton', 'Adilabad', 'Adilabad Mandi', 6200, 7100, 6800, 'Medium Staple', NOW()),
  ('Cotton', 'Warangal', 'Hanamkonda Yard', 6000, 6900, 6500, 'Long Staple', NOW()),
  ('Turmeric', 'Nizamabad', 'Nizamabad Turmeric Yard', 8500, 12000, 10200, 'Finger', NOW()),
  ('Turmeric', 'Karimnagar', 'Jagtial Mandi', 8000, 11500, 9800, 'Bulb', NOW()),
  ('Chilli', 'Khammam', 'Khammam Mirchi Yard', 14000, 22000, 18500, 'Teja', NOW()),
  ('Chilli', 'Warangal', 'Warangal APMC', 13500, 20000, 17200, 'Wonder Hot', NOW()),
  ('Wheat', 'Pune', 'Pune APMC', 2200, 2600, 2400, 'Lokwan', NOW()),
  ('Maize', 'Medak', 'Medak Mandi', 1600, 2000, 1850, 'Yellow', NOW()),
  ('Soybean', 'Nizamabad', 'Nizamabad Mandi', 4200, 5000, 4650, 'JS-335', NOW()),
  ('Groundnut', 'Nalgonda', 'Nalgonda APMC', 5200, 6200, 5800, 'Bold', NOW()),
  ('Jowar', 'Adilabad', 'Adilabad Mandi', 2800, 3400, 3100, 'Maldandi', NOW()),
  ('Sugarcane', 'Pune', 'Pune Sugar Federation', 2950, 3200, 3050, 'CO-86032', NOW()),
  ('Mango', 'Khammam', 'Khammam Fruit Market', 35000, 55000, 45000, 'Banganapalli', NOW()),
  ('Sunflower', 'Medak', 'Medak APMC', 5500, 6300, 5900, 'KBSH-44', NOW());

-- ===== MARKET HISTORY (For Trends) =====

INSERT INTO market_history (crop, district, price, date) VALUES
  ('Rice', 'Warangal', 1800, NOW() - INTERVAL '90 days'),
  ('Rice', 'Warangal', 1850, NOW() - INTERVAL '75 days'),
  ('Rice', 'Warangal', 1920, NOW() - INTERVAL '60 days'),
  ('Rice', 'Warangal', 1980, NOW() - INTERVAL '45 days'),
  ('Rice', 'Warangal', 2000, NOW() - INTERVAL '30 days'),
  ('Rice', 'Warangal', 2050, NOW() - INTERVAL '15 days'),
  ('Rice', 'Warangal', 2050, NOW()),
  ('Cotton', 'Adilabad', 5800, NOW() - INTERVAL '90 days'),
  ('Cotton', 'Adilabad', 6000, NOW() - INTERVAL '75 days'),
  ('Cotton', 'Adilabad', 6200, NOW() - INTERVAL '60 days'),
  ('Cotton', 'Adilabad', 6500, NOW() - INTERVAL '45 days'),
  ('Cotton', 'Adilabad', 6700, NOW() - INTERVAL '30 days'),
  ('Cotton', 'Adilabad', 6800, NOW() - INTERVAL '15 days'),
  ('Cotton', 'Adilabad', 6800, NOW()),
  ('Turmeric', 'Nizamabad', 7500, NOW() - INTERVAL '90 days'),
  ('Turmeric', 'Nizamabad', 8200, NOW() - INTERVAL '75 days'),
  ('Turmeric', 'Nizamabad', 9000, NOW() - INTERVAL '60 days'),
  ('Turmeric', 'Nizamabad', 9500, NOW() - INTERVAL '45 days'),
  ('Turmeric', 'Nizamabad', 10000, NOW() - INTERVAL '30 days'),
  ('Turmeric', 'Nizamabad', 10200, NOW() - INTERVAL '15 days'),
  ('Turmeric', 'Nizamabad', 10200, NOW()),
  ('Chilli', 'Khammam', 12000, NOW() - INTERVAL '90 days'),
  ('Chilli', 'Khammam', 14000, NOW() - INTERVAL '60 days'),
  ('Chilli', 'Khammam', 16500, NOW() - INTERVAL '30 days'),
  ('Chilli', 'Khammam', 18500, NOW());

-- ===== BLOGS =====

INSERT INTO blogs (title, excerpt, content, author, status, tags, featured_image, views) VALUES
  ('5 Organic Farming Techniques Every Farmer Should Know', 'Discover proven organic farming methods that boost yield while maintaining soil health and sustainability.', 
   E'## Introduction\n\nOrganic farming is more than just avoiding chemicals — it''s about building a self-sustaining ecosystem on your farm.\n\n## 1. Crop Rotation\nRotating crops between seasons prevents soil nutrient depletion and breaks pest cycles.\n\n## 2. Green Manuring\nGrowing leguminous cover crops (dhaincha, sun hemp) and plowing them back adds 20-30 kg N/acre.\n\n## 3. Vermicomposting\nConvert farm waste into nutrient-rich vermicompost using Eisenia foetida earthworms.\n\n## 4. Neem-based Pest Management\nNeem oil and neem cake are effective against 200+ insect species.\n\n## 5. Mulching\nApply 4-6 inch mulch layer to conserve moisture, suppress weeds, and add organic matter.',
   'Dr. Ramesh Agri', 'published', ARRAY['organic', 'farming', 'soil-health'], 'https://res.cloudinary.com/demo/image/upload/v1/blogs/organic_farming.jpg', 245),
  
  ('Understanding Soil pH: A Complete Guide for Indian Farmers', 'Learn how soil pH affects nutrient availability and how to correct acidic or alkaline soils for optimal crop growth.',
   E'## What is Soil pH?\n\nSoil pH measures the acidity or alkalinity of soil on a scale of 0-14. Most crops thrive in pH 6.0-7.5.\n\n## Why It Matters\n- Below 5.5: Aluminum toxicity, phosphorus lockup\n- 6.0-7.0: Optimal nutrient availability\n- Above 8.0: Iron, zinc, manganese deficiency\n\n## How to Test\nUse a digital pH meter (₹650-800) or send samples to your nearest Krishi Vigyan Kendra.\n\n## Correction Methods\n- **Acidic soil**: Apply agricultural lime (2-4 t/ha)\n- **Alkaline soil**: Apply gypsum (2-5 t/ha) + organic matter\n\n## District-wise Soil Types in Telangana\n- Warangal: Red loamy (pH 6.0-6.8)\n- Nizamabad: Black cotton (pH 7.5-8.5)\n- Adilabad: Mixed red-black (pH 6.5-7.5)',
   'Prof. Sunil Reddy', 'published', ARRAY['soil', 'pH', 'guide'], 'https://res.cloudinary.com/demo/image/upload/v1/blogs/soil_ph.jpg', 189),
  
  ('Government Subsidies for Farm Equipment in 2026', 'Complete guide to central and state government subsidy schemes for farm machinery and equipment in 2026.',
   E'## Available Schemes\n\n### 1. Sub-Mission on Agricultural Mechanization (SMAM)\n- Subsidy: 40-50% for SC/ST, 25-40% for others\n- Covers: Tractors, power tillers, harvesters\n\n### 2. PM-KUSUM (Solar Pump)\n- Component A: 60% subsidy on solar pumps up to 10HP\n- Apply through state agriculture department\n\n### 3. State-specific (Telangana)\n- Rythu Bandhu: ₹10,000/acre/season\n- Sprinkler/Drip: 90% subsidy for small farmers\n\n## How to Apply\n1. Visit nearest agriculture office or Rythu Vedika\n2. Submit land documents + Aadhaar + bank details\n3. Online: agri-portal.telangana.gov.in',
   'KMC Team', 'published', ARRAY['subsidy', 'government', 'equipment'], 'https://res.cloudinary.com/demo/image/upload/v1/blogs/subsidies.jpg', 512),
  
  ('Water Management in Drought-Prone Areas', 'Practical water harvesting and conservation techniques for farming in areas with less than 700mm annual rainfall.',
   E'## Challenge\nOver 40% of Indian farmland is rainfed. Smart water management is critical.\n\n## Techniques\n\n### 1. Farm Ponds\n- Size: 10m x 10m x 3m stores 300,000 litres\n- Lined ponds prevent seepage\n- Cost: ₹50,000-80,000 (subsidy available)\n\n### 2. Rainwater Harvesting\n- Rooftop + field bunds + percolation pits\n- Recharges groundwater by 20-30%\n\n### 3. Deficit Irrigation\n- Apply 60-80% of crop water requirement\n- Use drip/sprinkler for 40% water saving\n\n### 4. Mulching\n- Plastic or organic mulch reduces evaporation by 25-30%',
   'Dr. Lakshmi Narayan', 'published', ARRAY['water', 'drought', 'irrigation'], 'https://res.cloudinary.com/demo/image/upload/v1/blogs/water_management.jpg', 156);

-- ===== SUCCESS STORIES =====

INSERT INTO success_stories (farmer_name, district, crop, before_yield, after_yield, description, status, image) VALUES
  ('Rajesh Reddy', 'Warangal', 'Rice', 3.5, 6.2, 'Rajesh adopted SRI (System of Rice Intensification) method after attending a KMC training workshop. By following proper spacing, single seedling transplanting, and alternate wetting-drying irrigation, he nearly doubled his rice yield. He also saved 30% on water usage.', 'published', 'https://res.cloudinary.com/demo/image/upload/v1/success/rajesh_rice.jpg'),
  ('Sunitha Devi', 'Karimnagar', 'Turmeric', 18, 32, 'Sunitha switched from traditional varieties to the KMC-recommended Pragati variety and adopted raised bed cultivation. With proper soil testing and targeted fertilization, her turmeric yield increased from 18 to 32 quintals per acre. She earned an additional ₹2.8 lakh per season.', 'published', 'https://res.cloudinary.com/demo/image/upload/v1/success/sunitha_turmeric.jpg'),
  ('Venkat Rao', 'Nizamabad', 'Soybean', 6, 10.5, 'Venkat adopted integrated pest management (IPM) and precision nutrient management after his soil test report from KMC. His soybean yield improved by 75% while his input costs reduced by 20% due to optimized fertilizer use.', 'published', 'https://res.cloudinary.com/demo/image/upload/v1/success/venkat_soybean.jpg'),
  ('Mahesh Patil', 'Nalgonda', 'Groundnut', 8, 14.5, 'After installing a drip irrigation system (with 90% government subsidy processed through KMC), Mahesh''s groundnut farm became drought-resistant. His yield jumped from 8 to 14.5 quintals, and he was able to take a second crop of vegetables using the same drip infrastructure.', 'published', 'https://res.cloudinary.com/demo/image/upload/v1/success/mahesh_groundnut.jpg');

-- ===== SOIL REPORTS (Sample reports for demo users) =====

-- Get farmer IDs for soil reports (using amit@example.com and rajesh@example.com)
DO $$
DECLARE
  v_amit_id UUID;
  v_rajesh_id UUID;
  v_sunitha_id UUID;
BEGIN
  SELECT id INTO v_amit_id FROM users WHERE email = 'amit@example.com';
  SELECT id INTO v_rajesh_id FROM users WHERE email = 'rajesh@example.com';
  SELECT id INTO v_sunitha_id FROM users WHERE email = 'sunitha@example.com';

  -- Amit's soil reports
  INSERT INTO soil_reports (farmer_id, ph, nitrogen, phosphorus, potassium, organic_matter, recommended_fertilizer, suitable_crops, soil_status, suitability_pct, status, next_test_date) VALUES
    (v_amit_id, 6.5, 280, 22, 180, 2.1, 'DAP + Vermicompost', ARRAY['Wheat', 'Sugarcane', 'Vegetables'], 'Good', 82, 'Completed', NOW() + INTERVAL '6 months'),
    (v_amit_id, 6.8, 250, 18, 160, 1.8, 'Urea + SSP + Zinc', ARRAY['Wheat', 'Maize'], 'Moderate', 68, 'Completed', NOW() + INTERVAL '3 months');

  -- Rajesh's soil reports
  INSERT INTO soil_reports (farmer_id, ph, nitrogen, phosphorus, potassium, organic_matter, recommended_fertilizer, suitable_crops, soil_status, suitability_pct, status, next_test_date) VALUES
    (v_rajesh_id, 5.8, 310, 28, 200, 2.4, 'NPK 20-20-0 + Lime', ARRAY['Rice', 'Cotton', 'Pulses'], 'Acidic', 65, 'Completed', NOW() + INTERVAL '4 months');

  -- Sunitha's soil reports
  INSERT INTO soil_reports (farmer_id, ph, nitrogen, phosphorus, potassium, organic_matter, recommended_fertilizer, suitable_crops, soil_status, suitability_pct, status, next_test_date) VALUES
    (v_sunitha_id, 7.2, 220, 15, 140, 1.5, 'Urea + MOP + Humic Acid', ARRAY['Turmeric', 'Chilli', 'Maize'], 'Neutral', 72, 'Completed', NOW() + INTERVAL '5 months');
END $$;

-- ===== BOOKINGS (Farm Visits) =====

DO $$
DECLARE
  v_rajesh_id UUID;
  v_venkat_id UUID;
  v_john_id UUID;
BEGIN
  SELECT id INTO v_rajesh_id FROM users WHERE email = 'rajesh@example.com';
  SELECT id INTO v_venkat_id FROM users WHERE email = 'venkat@example.com';
  SELECT id INTO v_john_id FROM users WHERE email = 'john.fo@agridust.com';

  INSERT INTO bookings (farmer_id, full_name, phone, village, district, visit_date, purpose, assigned_officer_id, status) VALUES
    (v_rajesh_id, 'Rajesh Reddy', '8888888881', 'Kesamudram', 'Warangal', NOW() + INTERVAL '5 days', 'Soil testing and crop planning for Rabi season', v_john_id, 'Confirmed'),
    (v_venkat_id, 'Venkat Rao', '8888888883', 'Bodhan', 'Nizamabad', NOW() + INTERVAL '10 days', 'Drip irrigation installation guidance', NULL, 'Pending');
END $$;

-- ===== NOTIFICATIONS (Sample) =====

DO $$
DECLARE
  v_admin_id UUID;
BEGIN
  SELECT id INTO v_admin_id FROM users WHERE email = 'admin@agridust.com';

  INSERT INTO notifications (title, message, target_type, target_value, recipient_count, sent_by) VALUES
    ('Rabi Season Advisory', 'Dear Farmers, Rabi sowing window is open. Visit your nearest KMC center for free soil testing and seed recommendations. Subsidized seeds available for wheat, gram, and mustard.', 'All', 'Global', 150, v_admin_id),
    ('Cotton MSP Update', 'Good news! Cotton MSP for 2026-27 has been increased to ₹7,121/quintal for medium staple. Sell only at APMC yards for MSP guarantee.', 'Crop', 'Cotton', 45, v_admin_id),
    ('Farm Pond Subsidy', 'Telangana State Govt is accepting applications for farm pond subsidy under Mission Kakatiya. 90% subsidy for SC/ST farmers. Apply before 30th April.', 'District', 'Warangal', 32, v_admin_id);
END $$;

-- ===== USER ADDRESSES =====

DO $$
DECLARE
  v_amit_id UUID;
  v_rajesh_id UUID;
BEGIN
  SELECT id INTO v_amit_id FROM users WHERE email = 'amit@example.com';
  SELECT id INTO v_rajesh_id FROM users WHERE email = 'rajesh@example.com';

  INSERT INTO user_addresses (user_id, full_name, phone, address) VALUES
    (v_amit_id, 'Amit Kumar', '8888888888', 'H.No 12-4-5, Market Road, Pune, Maharashtra 411001'),
    (v_amit_id, 'Amit Kumar (Farm)', '8888888888', 'Survey No. 45, Kharadi Village, Pune Rural, Maharashtra 412207'),
    (v_rajesh_id, 'Rajesh Reddy', '8888888881', 'H.No 5-3-12, Main Bazar, Kesamudram, Warangal, Telangana 506142');
END $$;

-- ===== FARMER SURVEYS =====

DO $$
DECLARE
  v_amit_id UUID;
  v_rajesh_id UUID;
BEGIN
  SELECT id INTO v_amit_id FROM users WHERE email = 'amit@example.com';
  SELECT id INTO v_rajesh_id FROM users WHERE email = 'rajesh@example.com';

  INSERT INTO farmer_surveys (user_id, language, farm_name, farm_size, farm_size_unit, land_ownership, soil_type, water_source, primary_crops, farming_experience) VALUES
    (v_amit_id, 'en', 'Kumar Farm', 5.5, 'acres', 'Self-owned', 'Black Cotton', 'Borewell + Canal', ARRAY['Wheat', 'Sugarcane'], '10+ Years'),
    (v_rajesh_id, 'te', 'Reddy Farm', 8.0, 'acres', 'Self-owned', 'Red Loamy', 'Borewell', ARRAY['Rice', 'Cotton'], '15+ Years');
  
  -- Mark surveys as completed
  UPDATE users SET has_completed_survey = true WHERE id IN (v_amit_id, v_rajesh_id);
END $$;

-- =====================================================
-- Done! All seed data inserted successfully.
-- =====================================================
