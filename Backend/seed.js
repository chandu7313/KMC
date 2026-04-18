/**
 * KMC Database Seeder
 * Run with: node seed.js
 * 
 * This script creates all tables (if missing) and populates them
 * with realistic demo data for the KMC agricultural platform.
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize } from './config/database.js';
import {
    User, UserAddress, FarmerSurvey,
    Product, Review, MarketplaceOrder, MarketplaceOrderItem,
    Equipment, EquipmentOrder, EquipmentOrderItem,
    Fertilizer, FertilizerOrder, FertilizerOrderItem,
    SoilReport, SoilReminder, MarketPrice, MarketHistory, PriceAlert,
    Blog, SuccessStory, Booking, Notification, OrchardRequest, Order
} from './models/index.js';

const seed = async () => {
    try {
        // 1. Connect and sync all tables
        await sequelize.authenticate();
        console.log('✅ Database connected.');
        // Drop all existing tables and recreate from model definitions
        // This ensures the schema perfectly matches our Sequelize models
        await sequelize.sync({ force: true });
        console.log('✅ All tables dropped and recreated.');

        // Common password hash for demo accounts
        const passwordHash = await bcrypt.hash('password123', 10);

        // ========================
        // USERS
        // ========================
        const users = await User.bulkCreate([
            { name: 'Admin User', email: 'admin@agridust.com', phone: '9999999999', role: 'admin', district: 'Hyderabad', crops: ['All'], isAccountVerified: true, password: passwordHash },
            { name: 'John Officer', email: 'john.fo@agridust.com', phone: '7777777777', role: 'field-officer', district: 'Warangal', crops: ['Rice', 'Cotton'], isAccountVerified: true, password: passwordHash },
            { name: 'Priya Officer', email: 'priya.fo@agridust.com', phone: '7777777778', role: 'field-officer', district: 'Karimnagar', crops: ['Turmeric', 'Chilli'], isAccountVerified: true, password: passwordHash },
            { name: 'Amit Kumar', email: 'amit@example.com', phone: '8888888801', role: 'user', district: 'Pune', crops: ['Wheat', 'Sugarcane'], isAccountVerified: true, password: passwordHash },
            { name: 'Rajesh Reddy', email: 'rajesh@example.com', phone: '8888888802', role: 'user', district: 'Warangal', crops: ['Rice', 'Cotton'], isAccountVerified: true, password: passwordHash },
            { name: 'Sunitha Devi', email: 'sunitha@example.com', phone: '8888888803', role: 'user', district: 'Karimnagar', crops: ['Turmeric', 'Chilli'], isAccountVerified: true, password: passwordHash },
            { name: 'Venkat Rao', email: 'venkat@example.com', phone: '8888888804', role: 'user', district: 'Nizamabad', crops: ['Soybean', 'Rice'], isAccountVerified: true, password: passwordHash },
            { name: 'Lakshmi Bai', email: 'lakshmi@example.com', phone: '8888888805', role: 'user', district: 'Adilabad', crops: ['Cotton', 'Jowar'], isAccountVerified: true, password: passwordHash },
            { name: 'Mahesh Patil', email: 'mahesh@example.com', phone: '8888888806', role: 'user', district: 'Nalgonda', crops: ['Rice', 'Groundnut'], isAccountVerified: true, password: passwordHash },
            { name: 'Anjali Sharma', email: 'anjali@example.com', phone: '8888888807', role: 'user', district: 'Medak', crops: ['Maize', 'Sunflower'], isAccountVerified: true, password: passwordHash },
            { name: 'Suresh Goud', email: 'suresh@example.com', phone: '8888888808', role: 'user', district: 'Khammam', crops: ['Rice', 'Mango'], isAccountVerified: true, password: passwordHash },
            { name: 'Padma Kumari', email: 'padma@example.com', phone: '8888888809', role: 'user', district: 'Rangareddy', crops: ['Vegetables', 'Flowers'], isAccountVerified: false, password: passwordHash },
        ], { ignoreDuplicates: true });

        console.log(`✅ Users seeded: ${users.length}`);

        // Fetch user IDs for relationships
        const admin = await User.findOne({ where: { email: 'admin@agridust.com' } });
        const amit = await User.findOne({ where: { email: 'amit@example.com' } });
        const rajesh = await User.findOne({ where: { email: 'rajesh@example.com' } });
        const sunitha = await User.findOne({ where: { email: 'sunitha@example.com' } });
        const venkat = await User.findOne({ where: { email: 'venkat@example.com' } });
        const john = await User.findOne({ where: { email: 'john.fo@agridust.com' } });

        // ========================
        // USER ADDRESSES
        // ========================
        await UserAddress.bulkCreate([
            { userId: amit.id, fullName: 'Amit Kumar', phone: '8888888801', address: 'H.No 12-4-5, Market Road, Pune, Maharashtra 411001' },
            { userId: amit.id, fullName: 'Amit Kumar (Farm)', phone: '8888888801', address: 'Survey No. 45, Kharadi Village, Pune Rural, Maharashtra 412207' },
            { userId: rajesh.id, fullName: 'Rajesh Reddy', phone: '8888888802', address: 'H.No 5-3-12, Main Bazar, Kesamudram, Warangal, Telangana 506142' },
        ]);
        console.log('✅ User addresses seeded.');

        // ========================
        // FARMER SURVEYS
        // ========================
        await FarmerSurvey.bulkCreate([
            { userId: amit.id, language: 'en', farmName: 'Kumar Farm', farmSize: 5.5, farmSizeUnit: 'acres', landOwnership: 'Self-owned', soilType: 'Black Cotton', waterSource: 'Borewell + Canal', primaryCrops: ['Wheat', 'Sugarcane'], farmingExperience: '10+ Years' },
            { userId: rajesh.id, language: 'te', farmName: 'Reddy Farm', farmSize: 8.0, farmSizeUnit: 'acres', landOwnership: 'Self-owned', soilType: 'Red Loamy', waterSource: 'Borewell', primaryCrops: ['Rice', 'Cotton'], farmingExperience: '15+ Years' },
        ]);
        await User.update({ hasCompletedSurvey: true }, { where: { id: [amit.id, rajesh.id] } });
        console.log('✅ Farmer surveys seeded.');

        // ========================
        // PRODUCTS (Marketplace)
        // ========================
        const products = await Product.bulkCreate([
            { name: 'Hybrid Tomato Seeds (F1)', description: 'Premium F1 hybrid tomato seeds with high yield potential. Disease resistant variety suitable for Telangana climate.', shortDescription: 'High-yield F1 hybrid, disease resistant', category: 'Seeds', subCategory: 'Vegetable Seeds', price: 450, discountedPrice: 399, stock: 200, isFeatured: true, images: ['https://res.cloudinary.com/demo/image/upload/v1/seeds/tomato1.jpg'], specifications: { weight: '50g', variety: 'Arka Rakshak', season: 'Rabi/Kharif', germination: '85%' } },
            { name: 'Organic Neem Oil (1L)', description: 'Cold-pressed organic neem oil for natural pest control. Effective against aphids, whitefly, and mealybugs.', shortDescription: '100% organic pest control', category: 'Pesticides', subCategory: 'Organic', price: 380, discountedPrice: 340, stock: 150, isFeatured: true, images: ['https://res.cloudinary.com/demo/image/upload/v1/pesticides/neem_oil.jpg'], specifications: { volume: '1 Litre', type: 'Cold Pressed', certification: 'NPOP' } },
            { name: 'Drip Irrigation Kit (1 Acre)', description: 'Complete drip irrigation system for 1 acre. Includes main line, sub-main, laterals, drippers, filter, and fittings.', shortDescription: 'Complete 1-acre drip system', category: 'Equipment', subCategory: 'Irrigation', price: 28500, discountedPrice: 24999, stock: 30, isFeatured: true, images: ['https://res.cloudinary.com/demo/image/upload/v1/equipment/drip_kit.jpg'], specifications: { coverage: '1 Acre', dripper_spacing: '30cm', flow_rate: '2 LPH' } },
            { name: 'DAP Fertilizer (50kg)', description: 'Di-Ammonium Phosphate (DAP) — 18% Nitrogen, 46% Phosphorus. Essential basal fertilizer for all crops.', shortDescription: 'Essential NPK basal fertilizer', category: 'Fertilizers', subCategory: 'Chemical', price: 1350, discountedPrice: null, stock: 500, isFeatured: false, images: ['https://res.cloudinary.com/demo/image/upload/v1/fertilizers/dap.jpg'], specifications: { weight: '50 kg', N: '18%', P: '46%', grade: '18-46-0' } },
            { name: 'Vermicompost (40kg)', description: 'Premium quality vermicompost rich in humic acid and beneficial microbes. Improves soil structure and water retention.', shortDescription: 'Organic soil conditioner', category: 'Fertilizers', subCategory: 'Organic', price: 650, discountedPrice: 580, stock: 300, isFeatured: true, images: ['https://res.cloudinary.com/demo/image/upload/v1/fertilizers/vermicompost.jpg'], specifications: { weight: '40 kg', organic_matter: '>30%', pH: '6.5-7.5' } },
            { name: 'Knapsack Sprayer (16L)', description: 'Manual knapsack sprayer with brass nozzle. Robust plastic tank with adjustable spray pattern.', shortDescription: 'Manual pest spraying', category: 'Equipment', subCategory: 'Spraying', price: 1800, discountedPrice: 1599, stock: 80, isFeatured: false, images: ['https://res.cloudinary.com/demo/image/upload/v1/equipment/sprayer.jpg'], specifications: { capacity: '16 Litres', material: 'HDPE', nozzle: 'Brass (4-pattern)' } },
            { name: 'BT Cotton Seeds (450g)', description: 'Bollgard-II BT cotton seeds. High boll retention, bollworm resistant. Suitable for rainfed and irrigated conditions.', shortDescription: 'Bollworm resistant hybrid', category: 'Seeds', subCategory: 'Cash Crop Seeds', price: 930, discountedPrice: 880, stock: 120, isFeatured: false, images: ['https://res.cloudinary.com/demo/image/upload/v1/seeds/bt_cotton.jpg'], specifications: { weight: '450g', variety: 'BGII', maturity: '150-160 days' } },
            { name: 'Soil pH Meter (Digital)', description: 'Digital soil pH and moisture meter. No batteries needed for moisture. Instant readings. 3-in-1 functionality.', shortDescription: 'pH + Moisture + Light', category: 'Equipment', subCategory: 'Testing', price: 750, discountedPrice: 649, stock: 60, isFeatured: true, images: ['https://res.cloudinary.com/demo/image/upload/v1/equipment/ph_meter.jpg'], specifications: { range_pH: '3.5-8.0', probe_length: '20cm' } },
            { name: 'Paddy Seeds IR-64 (5kg)', description: 'High-yielding medium-duration paddy variety. Excellent grain quality, resistant to blast and BPH.', shortDescription: 'Medium-duration, blast resistant', category: 'Seeds', subCategory: 'Cereal Seeds', price: 280, discountedPrice: 250, stock: 400, isFeatured: false, images: ['https://res.cloudinary.com/demo/image/upload/v1/seeds/paddy_ir64.jpg'], specifications: { weight: '5 kg', duration: '120-125 days', yield: '6-7 t/ha' } },
            { name: 'Humic Acid Granules (5kg)', description: 'High-quality humic acid granules to improve soil CEC and nutrient uptake.', shortDescription: 'Soil health booster', category: 'Fertilizers', subCategory: 'Organic', price: 890, discountedPrice: 799, stock: 200, isFeatured: false, images: ['https://res.cloudinary.com/demo/image/upload/v1/fertilizers/humic_acid.jpg'], specifications: { weight: '5 kg', humic_acid: '>60%', application: '5-10 kg/acre' } },
        ]);
        console.log(`✅ Products seeded: ${products.length}`);

        // ========================
        // EQUIPMENTS
        // ========================
        const equipments = await Equipment.bulkCreate([
            { name: 'Mini Tiller (5HP)', description: 'Compact 5HP mini tiller for small and medium farms. Petrol engine, 4-stroke.', price: 45000, image: 'https://res.cloudinary.com/demo/image/upload/v1/equipment/mini_tiller.jpg', category: 'Tillage', stock: 15, specifications: { engine: '5 HP Petrol', width: '60cm', weight: '45kg' } },
            { name: 'Solar Water Pump (2HP)', description: 'Solar-powered submersible pump. Includes 8 solar panels (330W each). No electricity cost.', price: 185000, image: 'https://res.cloudinary.com/demo/image/upload/v1/equipment/solar_pump.jpg', category: 'Irrigation', stock: 8, specifications: { power: '2 HP', panels: '8 x 330W', discharge: '40,000 L/day' } },
            { name: 'Battery Sprayer (12V, 16L)', description: 'Rechargeable battery-operated sprayer. 6-8 hours runtime. Includes 4 nozzle types.', price: 3500, image: 'https://res.cloudinary.com/demo/image/upload/v1/equipment/battery_sprayer.jpg', category: 'Spraying', stock: 50, specifications: { capacity: '16L', battery: '12V 8Ah', runtime: '6-8 hrs' } },
            { name: 'Seed Drill (9 Row)', description: 'Tractor-mounted 9-row seed drill for precise sowing. Adjustable row spacing and seed rate.', price: 65000, image: 'https://res.cloudinary.com/demo/image/upload/v1/equipment/seed_drill.jpg', category: 'Sowing', stock: 5, specifications: { rows: 9, spacing: '20-30cm adjustable', weight: '180kg' } },
            { name: 'Chaff Cutter (Electric)', description: 'Electric chaff cutter for fodder preparation. Cuts straw, hay, and green fodder. 2HP motor.', price: 18000, image: 'https://res.cloudinary.com/demo/image/upload/v1/equipment/chaff_cutter.jpg', category: 'Processing', stock: 20, specifications: { motor: '2 HP', capacity: '500 kg/hr', blades: '3 (HSS)' } },
        ]);
        console.log(`✅ Equipments seeded: ${equipments.length}`);

        // ========================
        // FERTILIZERS
        // ========================
        const fertilizers = await Fertilizer.bulkCreate([
            { name: 'Urea (50kg)', description: 'Government-grade urea fertilizer — 46% Nitrogen. Essential top-dressing fertilizer.', price: 267, image: 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/urea.jpg', category: 'Nitrogen', stock: 1000 },
            { name: 'MOP (50kg)', description: 'Muriate of Potash — 60% Potassium (K2O). Improves crop quality and drought tolerance.', price: 1700, image: 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/mop.jpg', category: 'Potassium', stock: 400 },
            { name: 'SSP (50kg)', description: 'Single Super Phosphate — 16% P2O5 + 11% Sulphur. Suitable for oilseeds and pulses.', price: 450, image: 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/ssp.jpg', category: 'Phosphorus', stock: 600 },
            { name: 'NPK 20-20-0 (50kg)', description: 'Complex fertilizer with balanced N and P for basal application.', price: 1450, image: 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/npk_2020.jpg', category: 'Complex', stock: 350 },
            { name: 'Zinc Sulphate (25kg)', description: 'Zinc sulphate heptahydrate — 21% Zn. Corrects zinc deficiency in rice, wheat, and maize.', price: 750, image: 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/zinc.jpg', category: 'Micronutrient', stock: 250 },
            { name: 'Bio NPK (1L)', description: 'Liquid bio-fertilizer consortium — Azotobacter + PSB + KMB.', price: 320, image: 'https://res.cloudinary.com/demo/image/upload/v1/fertilizers/bio_npk.jpg', category: 'Biological', stock: 500 },
        ]);
        console.log(`✅ Fertilizers seeded: ${fertilizers.length}`);

        // ========================
        // MARKET PRICES
        // ========================
        const now = new Date();
        await MarketPrice.bulkCreate([
            { cropName: 'Rice', district: 'Warangal', mandi: 'Warangal Mandi', minPrice: 1800, maxPrice: 2200, modalPrice: 2050, variety: 'Sona Masuri', arrivalDate: now },
            { cropName: 'Rice', district: 'Karimnagar', mandi: 'Karimnagar APMC', minPrice: 1750, maxPrice: 2150, modalPrice: 1980, variety: 'BPT 5204', arrivalDate: now },
            { cropName: 'Cotton', district: 'Adilabad', mandi: 'Adilabad Mandi', minPrice: 6200, maxPrice: 7100, modalPrice: 6800, variety: 'Medium Staple', arrivalDate: now },
            { cropName: 'Cotton', district: 'Warangal', mandi: 'Hanamkonda Yard', minPrice: 6000, maxPrice: 6900, modalPrice: 6500, variety: 'Long Staple', arrivalDate: now },
            { cropName: 'Turmeric', district: 'Nizamabad', mandi: 'Nizamabad Turmeric Yard', minPrice: 8500, maxPrice: 12000, modalPrice: 10200, variety: 'Finger', arrivalDate: now },
            { cropName: 'Turmeric', district: 'Karimnagar', mandi: 'Jagtial Mandi', minPrice: 8000, maxPrice: 11500, modalPrice: 9800, variety: 'Bulb', arrivalDate: now },
            { cropName: 'Chilli', district: 'Khammam', mandi: 'Khammam Mirchi Yard', minPrice: 14000, maxPrice: 22000, modalPrice: 18500, variety: 'Teja', arrivalDate: now },
            { cropName: 'Chilli', district: 'Warangal', mandi: 'Warangal APMC', minPrice: 13500, maxPrice: 20000, modalPrice: 17200, variety: 'Wonder Hot', arrivalDate: now },
            { cropName: 'Wheat', district: 'Pune', mandi: 'Pune APMC', minPrice: 2200, maxPrice: 2600, modalPrice: 2400, variety: 'Lokwan', arrivalDate: now },
            { cropName: 'Maize', district: 'Medak', mandi: 'Medak Mandi', minPrice: 1600, maxPrice: 2000, modalPrice: 1850, variety: 'Yellow', arrivalDate: now },
            { cropName: 'Soybean', district: 'Nizamabad', mandi: 'Nizamabad Mandi', minPrice: 4200, maxPrice: 5000, modalPrice: 4650, variety: 'JS-335', arrivalDate: now },
            { cropName: 'Groundnut', district: 'Nalgonda', mandi: 'Nalgonda APMC', minPrice: 5200, maxPrice: 6200, modalPrice: 5800, variety: 'Bold', arrivalDate: now },
            { cropName: 'Jowar', district: 'Adilabad', mandi: 'Adilabad Mandi', minPrice: 2800, maxPrice: 3400, modalPrice: 3100, variety: 'Maldandi', arrivalDate: now },
            { cropName: 'Sugarcane', district: 'Pune', mandi: 'Pune Sugar Federation', minPrice: 2950, maxPrice: 3200, modalPrice: 3050, variety: 'CO-86032', arrivalDate: now },
            { cropName: 'Mango', district: 'Khammam', mandi: 'Khammam Fruit Market', minPrice: 35000, maxPrice: 55000, modalPrice: 45000, variety: 'Banganapalli', arrivalDate: now },
            { cropName: 'Sunflower', district: 'Medak', mandi: 'Medak APMC', minPrice: 5500, maxPrice: 6300, modalPrice: 5900, variety: 'KBSH-44', arrivalDate: now },
        ]);
        console.log('✅ Market prices seeded: 16');

        // ========================
        // MARKET HISTORY (for trends)
        // ========================
        const daysAgo = (d) => { const dt = new Date(); dt.setDate(dt.getDate() - d); return dt; };
        await MarketHistory.bulkCreate([
            { crop: 'Rice', district: 'Warangal', price: 1800, date: daysAgo(90) },
            { crop: 'Rice', district: 'Warangal', price: 1850, date: daysAgo(75) },
            { crop: 'Rice', district: 'Warangal', price: 1920, date: daysAgo(60) },
            { crop: 'Rice', district: 'Warangal', price: 1980, date: daysAgo(45) },
            { crop: 'Rice', district: 'Warangal', price: 2000, date: daysAgo(30) },
            { crop: 'Rice', district: 'Warangal', price: 2050, date: daysAgo(15) },
            { crop: 'Rice', district: 'Warangal', price: 2050, date: now },
            { crop: 'Cotton', district: 'Adilabad', price: 5800, date: daysAgo(90) },
            { crop: 'Cotton', district: 'Adilabad', price: 6000, date: daysAgo(75) },
            { crop: 'Cotton', district: 'Adilabad', price: 6200, date: daysAgo(60) },
            { crop: 'Cotton', district: 'Adilabad', price: 6500, date: daysAgo(45) },
            { crop: 'Cotton', district: 'Adilabad', price: 6700, date: daysAgo(30) },
            { crop: 'Cotton', district: 'Adilabad', price: 6800, date: daysAgo(15) },
            { crop: 'Cotton', district: 'Adilabad', price: 6800, date: now },
            { crop: 'Turmeric', district: 'Nizamabad', price: 7500, date: daysAgo(90) },
            { crop: 'Turmeric', district: 'Nizamabad', price: 8200, date: daysAgo(75) },
            { crop: 'Turmeric', district: 'Nizamabad', price: 9000, date: daysAgo(60) },
            { crop: 'Turmeric', district: 'Nizamabad', price: 9500, date: daysAgo(45) },
            { crop: 'Turmeric', district: 'Nizamabad', price: 10000, date: daysAgo(30) },
            { crop: 'Turmeric', district: 'Nizamabad', price: 10200, date: daysAgo(15) },
            { crop: 'Turmeric', district: 'Nizamabad', price: 10200, date: now },
            { crop: 'Chilli', district: 'Khammam', price: 12000, date: daysAgo(90) },
            { crop: 'Chilli', district: 'Khammam', price: 14000, date: daysAgo(60) },
            { crop: 'Chilli', district: 'Khammam', price: 16500, date: daysAgo(30) },
            { crop: 'Chilli', district: 'Khammam', price: 18500, date: now },
        ]);
        console.log('✅ Market history seeded: 25 data points');

        // ========================
        // BLOGS
        // ========================
        await Blog.bulkCreate([
            { title: '5 Organic Farming Techniques Every Farmer Should Know', slug: '5-organic-farming-techniques', excerpt: 'Discover proven organic farming methods that boost yield while maintaining soil health.', content: '## Introduction\n\nOrganic farming is more than just avoiding chemicals.\n\n## 1. Crop Rotation\nRotating crops prevents soil nutrient depletion.\n\n## 2. Green Manuring\nGrowing leguminous cover crops adds 20-30 kg N/acre.\n\n## 3. Vermicomposting\nConvert farm waste into nutrient-rich vermicompost.\n\n## 4. Neem-based Pest Management\nNeem oil is effective against 200+ insect species.\n\n## 5. Mulching\nApply 4-6 inch mulch layer to conserve moisture.', author: 'Dr. Ramesh Agri', status: 'published', tags: ['organic', 'farming', 'soil-health'], featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/blogs/organic_farming.jpg', views: 245 },
            { title: 'Understanding Soil pH: A Complete Guide', slug: 'understanding-soil-ph-guide', excerpt: 'Learn how soil pH affects nutrient availability and how to correct it.', content: '## What is Soil pH?\n\nSoil pH measures acidity or alkalinity on a scale of 0-14. Most crops thrive in pH 6.0-7.5.\n\n## Why It Matters\n- Below 5.5: Aluminum toxicity\n- 6.0-7.0: Optimal availability\n- Above 8.0: Iron/zinc deficiency\n\n## How to Correct\n- Acidic soil: Apply lime (2-4 t/ha)\n- Alkaline soil: Apply gypsum (2-5 t/ha)', author: 'Prof. Sunil Reddy', status: 'published', tags: ['soil', 'pH', 'guide'], featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/blogs/soil_ph.jpg', views: 189 },
            { title: 'Government Subsidies for Farm Equipment in 2026', slug: 'govt-subsidies-farm-equipment-2026', excerpt: 'Complete guide to central and state government subsidy schemes for farm machinery.', content: '## Available Schemes\n\n### 1. SMAM\n- Subsidy: 40-50% for SC/ST, 25-40% for others\n\n### 2. PM-KUSUM\n- 60% subsidy on solar pumps up to 10HP\n\n### 3. Telangana State\n- Rythu Bandhu: ₹10,000/acre/season\n- Drip: 90% subsidy for small farmers', author: 'KMC Team', status: 'published', tags: ['subsidy', 'government', 'equipment'], featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/blogs/subsidies.jpg', views: 512 },
            { title: 'Water Management in Drought-Prone Areas', slug: 'water-management-drought-areas', excerpt: 'Practical water harvesting techniques for areas with less than 700mm rainfall.', content: '## Techniques\n\n### 1. Farm Ponds\n- Size: 10m x 10m x 3m stores 300,000 litres\n- Cost: ₹50,000-80,000 (subsidy available)\n\n### 2. Rainwater Harvesting\n- Recharges groundwater by 20-30%\n\n### 3. Deficit Irrigation\n- Apply 60-80% of crop water requirement\n\n### 4. Mulching\n- Reduces evaporation by 25-30%', author: 'Dr. Lakshmi Narayan', status: 'published', tags: ['water', 'drought', 'irrigation'], featuredImage: 'https://res.cloudinary.com/demo/image/upload/v1/blogs/water_management.jpg', views: 156 },
        ]);
        console.log('✅ Blogs seeded: 4');

        // ========================
        // SUCCESS STORIES
        // ========================
        await SuccessStory.bulkCreate([
            { farmerName: 'Rajesh Reddy', district: 'Warangal', crop: 'Rice', beforeYield: 3.5, afterYield: 6.2, description: 'Rajesh adopted SRI (System of Rice Intensification) after attending a KMC training workshop. He nearly doubled his rice yield and saved 30% water.', status: 'published', image: 'https://res.cloudinary.com/demo/image/upload/v1/success/rajesh_rice.jpg' },
            { farmerName: 'Sunitha Devi', district: 'Karimnagar', crop: 'Turmeric', beforeYield: 18, afterYield: 32, description: 'Sunitha switched to the KMC-recommended Pragati variety and raised bed cultivation. Her turmeric yield increased from 18 to 32 quintals/acre with an additional ₹2.8 lakh per season.', status: 'published', image: 'https://res.cloudinary.com/demo/image/upload/v1/success/sunitha_turmeric.jpg' },
            { farmerName: 'Venkat Rao', district: 'Nizamabad', crop: 'Soybean', beforeYield: 6, afterYield: 10.5, description: 'Venkat adopted integrated pest management after his KMC soil test report. Soybean yield improved by 75% while input costs reduced by 20%.', status: 'published', image: 'https://res.cloudinary.com/demo/image/upload/v1/success/venkat_soybean.jpg' },
            { farmerName: 'Mahesh Patil', district: 'Nalgonda', crop: 'Groundnut', beforeYield: 8, afterYield: 14.5, description: 'After installing a drip irrigation system (with 90% subsidy processed through KMC), his groundnut yield jumped from 8 to 14.5 quintals and he added a second vegetable crop.', status: 'published', image: 'https://res.cloudinary.com/demo/image/upload/v1/success/mahesh_groundnut.jpg' },
        ]);
        console.log('✅ Success stories seeded: 4');

        // ========================
        // SOIL REPORTS
        // ========================
        const sixMonths = new Date(); sixMonths.setMonth(sixMonths.getMonth() + 6);
        const threeMonths = new Date(); threeMonths.setMonth(threeMonths.getMonth() + 3);
        const fourMonths = new Date(); fourMonths.setMonth(fourMonths.getMonth() + 4);
        const fiveMonths = new Date(); fiveMonths.setMonth(fiveMonths.getMonth() + 5);

        const soilReports = await SoilReport.bulkCreate([
            { farmerId: amit.id, ph: 6.5, nitrogen: 280, phosphorus: 22, potassium: 180, organicMatter: 2.1, recommendedFertilizer: 'DAP + Vermicompost', suitableCrops: ['Wheat', 'Sugarcane', 'Vegetables'], soilStatus: 'Good', suitabilityPct: 82, status: 'Completed', nextTestDate: sixMonths },
            { farmerId: amit.id, ph: 6.8, nitrogen: 250, phosphorus: 18, potassium: 160, organicMatter: 1.8, recommendedFertilizer: 'Urea + SSP + Zinc', suitableCrops: ['Wheat', 'Maize'], soilStatus: 'Moderate', suitabilityPct: 68, status: 'Completed', nextTestDate: threeMonths },
            { farmerId: rajesh.id, ph: 5.8, nitrogen: 310, phosphorus: 28, potassium: 200, organicMatter: 2.4, recommendedFertilizer: 'NPK 20-20-0 + Lime', suitableCrops: ['Rice', 'Cotton', 'Pulses'], soilStatus: 'Acidic', suitabilityPct: 65, status: 'Completed', nextTestDate: fourMonths },
            { farmerId: sunitha.id, ph: 7.2, nitrogen: 220, phosphorus: 15, potassium: 140, organicMatter: 1.5, recommendedFertilizer: 'Urea + MOP + Humic Acid', suitableCrops: ['Turmeric', 'Chilli', 'Maize'], soilStatus: 'Neutral', suitabilityPct: 72, status: 'Completed', nextTestDate: fiveMonths },
        ]);
        console.log(`✅ Soil reports seeded: ${soilReports.length}`);

        // ========================
        // SOIL REMINDERS
        // ========================
        await SoilReminder.bulkCreate([
            { userId: amit.id, reportId: soilReports[0].id, reminderDate: sixMonths, isSent: false },
            { userId: rajesh.id, reportId: soilReports[2].id, reminderDate: fourMonths, isSent: false },
            { userId: sunitha.id, reportId: soilReports[3].id, reminderDate: fiveMonths, isSent: false },
        ]);
        console.log('✅ Soil reminders seeded: 3');

        // ========================
        // BOOKINGS (Farm Visits)
        // ========================
        const fiveDays = new Date(); fiveDays.setDate(fiveDays.getDate() + 5);
        const tenDays = new Date(); tenDays.setDate(tenDays.getDate() + 10);

        await Booking.bulkCreate([
            { farmerId: rajesh.id, fullName: 'Rajesh Reddy', phone: '8888888802', village: 'Kesamudram', district: 'Warangal', visitDate: fiveDays, purpose: 'Soil testing and crop planning for Rabi season', assignedOfficerId: john.id, status: 'Confirmed' },
            { farmerId: venkat.id, fullName: 'Venkat Rao', phone: '8888888804', village: 'Bodhan', district: 'Nizamabad', visitDate: tenDays, purpose: 'Drip irrigation installation guidance', status: 'Pending' },
        ]);
        console.log('✅ Bookings seeded: 2');

        // ========================
        // NOTIFICATIONS
        // ========================
        await Notification.bulkCreate([
            { title: 'Rabi Season Advisory', message: 'Dear Farmers, Rabi sowing window is open. Visit your nearest KMC center for free soil testing and seed recommendations.', targetType: 'All', targetValue: 'Global', recipientCount: 150, sentBy: admin.id },
            { title: 'Cotton MSP Update', message: 'Good news! Cotton MSP for 2026-27 has been increased to ₹7,121/quintal for medium staple.', targetType: 'Crop', targetValue: 'Cotton', recipientCount: 45, sentBy: admin.id },
            { title: 'Farm Pond Subsidy', message: 'Telangana State Govt is accepting applications for farm pond subsidy under Mission Kakatiya. 90% subsidy for SC/ST farmers.', targetType: 'District', targetValue: 'Warangal', recipientCount: 32, sentBy: admin.id },
        ]);
        console.log('✅ Notifications seeded: 3');

        // ========================
        // PRICE ALERTS
        // ========================
        await PriceAlert.bulkCreate([
            { userId: amit.id, crop: 'Wheat', targetPrice: 2500, condition: 'Above', status: 'Active' },
            { userId: rajesh.id, crop: 'Rice', targetPrice: 2200, condition: 'Above', status: 'Active' },
            { userId: sunitha.id, crop: 'Turmeric', targetPrice: 9000, condition: 'Below', status: 'Active' },
        ]);
        console.log('✅ Price alerts seeded: 3');

        // ========================
        // ORCHARD REQUESTS
        // ========================
        await OrchardRequest.bulkCreate([
            { farmerId: venkat.id, acres: 5, location: 'Bodhan, Nizamabad', waterType: 'Borewell', goal: 'Mango Orchard', skillLevel: 'Intermediate', marketPreference: 'Local + Export', images: [], status: 'pending' },
            { farmerId: rajesh.id, acres: 3, location: 'Kesamudram, Warangal', waterType: 'Canal', goal: 'Mixed Fruit Orchard', skillLevel: 'Beginner', marketPreference: 'Local Market', images: [], status: 'assigned', assignedExpert: 'Dr. Ramesh Agri' },
        ]);
        console.log('✅ Orchard requests seeded: 2');

        // ========================
        // REVIEWS (Product Reviews)
        // ========================
        await Review.bulkCreate([
            { userId: amit.id, productId: products[0].id, rating: 5, comment: 'Excellent germination rate! Got 90% seedlings. Highly recommended for Rabi season.', userName: 'Amit Kumar' },
            { userId: rajesh.id, productId: products[0].id, rating: 4, comment: 'Good quality seeds. Slightly slow germination but healthy plants overall.', userName: 'Rajesh Reddy' },
            { userId: sunitha.id, productId: products[1].id, rating: 5, comment: 'Best organic neem oil. Completely eliminated aphids from my chilli crop within a week.', userName: 'Sunitha Devi' },
            { userId: venkat.id, productId: products[4].id, rating: 4, comment: 'Good quality vermicompost. Soil texture improved noticeably after one application.', userName: 'Venkat Rao' },
            { userId: amit.id, productId: products[7].id, rating: 5, comment: 'Very accurate pH meter. Easy to use, no batteries needed for moisture reading.', userName: 'Amit Kumar' },
        ]);
        console.log('✅ Product reviews seeded: 5');

        // ========================
        // SAMPLE MARKETPLACE ORDER
        // ========================
        const sampleOrder = await MarketplaceOrder.create({
            userId: amit.id,
            totalAmount: 1629,
            address: 'H.No 12-4-5, Market Road, Pune, Maharashtra 411001',
            status: 'Delivered',
            paymentMethod: 'COD',
            paymentStatus: 'Completed',
        });
        await MarketplaceOrderItem.bulkCreate([
            { orderId: sampleOrder.id, productId: products[0].id, quantity: 2, price: 399 },
            { orderId: sampleOrder.id, productId: products[4].id, quantity: 1, price: 580 },
        ]);
        console.log('✅ Sample marketplace order seeded.');

        console.log('\n🎉 ========================================');
        console.log('   ALL SEED DATA INSERTED SUCCESSFULLY!');
        console.log('   ========================================');
        console.log('\n📋 Login Credentials:');
        console.log('   Admin:   admin@kmc.com / password123');
        console.log('   Officer: john.fo@kmc.com / password123');
        console.log('   Farmer:  amit@example.com / password123');
        console.log('   Farmer:  rajesh@example.com / password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seed();
