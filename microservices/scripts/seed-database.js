/**
 * KMC Comprehensive Database Seeder
 * ─────────────────────────────────────────────────
 * Populates ALL tables with realistic Indian agriculture data.
 * Idempotent — safe to run multiple times.
 *
 * Usage:  node scripts/seed-database.js
 * Env:    Reads SUPABASE_URL from parent .env
 */

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { models, getSequelize } from '@kissan/shared';

const BCRYPT_ROUNDS = 12;

// ── Helper ──
const ago = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};
const future = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

// ════════════════════════════════════════════
// 1. USERS (farmers)
// ════════════════════════════════════════════
const farmerAccounts = [
  { name: 'Rajesh Kumar',  phone: '9876543210', email: 'farmer@dev.kissanmithar.com',   district: 'Nizamabad',   crops: ['Wheat', 'Cotton'] },
  { name: 'Lakshmi Devi',  phone: '9876543211', email: 'lakshmi@dev.kissanmithar.com',  district: 'Karimnagar',  crops: ['Rice', 'Turmeric'] },
  { name: 'Venkat Reddy',  phone: '9876543212', email: 'venkat@dev.kissanmithar.com',   district: 'Warangal',    crops: ['Maize', 'Soybean'] },
  { name: 'Priya Sharma',  phone: '9876543213', email: 'priya@dev.kissanmithar.com',    district: 'Adilabad',    crops: ['Cotton', 'Sugarcane'] },
  { name: 'Suresh Patel',  phone: '9876543214', email: 'suresh@dev.kissanmithar.com',   district: 'Medak',       crops: ['Paddy', 'Chili'] },
];

// ════════════════════════════════════════════
// 2. ADMIN USERS (all dev roles)
// ════════════════════════════════════════════
const adminAccounts = [
  { role: 'field_officer',      name: 'Field Officer',       email: 'fieldofficer@dev.kissanmithar.com',     password: 'Dev@FieldOfficer123' },
  { role: 'super_admin',        name: 'Super Admin',         email: 'superadmin@dev.kissanmithar.com',       password: 'Dev@SuperAdmin123' },
  { role: 'admin',              name: 'Admin',               email: 'admin@dev.kissanmithar.com',            password: 'Dev@Admin123' },
  { role: 'tech_admin',         name: 'Tech Admin',          email: 'techadmin@dev.kissanmithar.com',        password: 'Dev@TechAdmin123' },
  { role: 'agri_expert',        name: 'Agri Expert',         email: 'agriexpert@dev.kissanmithar.com',       password: 'Dev@AgriExpert123' },
  { role: 'ecommerce_manager',  name: 'E-commerce Manager',  email: 'ecommerce@dev.kissanmithar.com',       password: 'Dev@Ecommerce123' },
  { role: 'order_manager',      name: 'Order Manager',       email: 'orders@dev.kissanmithar.com',           password: 'Dev@Orders123' },
  { role: 'support_agent',      name: 'Support Agent',       email: 'supportagent@dev.kissanmithar.com',     password: 'Dev@SupportAgent123' },
  { role: 'support_manager',    name: 'Support Manager',     email: 'supportmanager@dev.kissanmithar.com',   password: 'Dev@SupportManager123' },
  { role: 'content_manager',    name: 'Content Manager',     email: 'content@dev.kissanmithar.com',          password: 'Dev@Content123' },
  { role: 'finance_manager',    name: 'Finance Manager',     email: 'finance@dev.kissanmithar.com',          password: 'Dev@Finance123' },
  { role: 'field_agent',        name: 'Field Agent',         email: 'fieldagent@dev.kissanmithar.com',       password: 'Dev@FieldAgent123' },
];

// ════════════════════════════════════════════
// 3. MARKET PRICES
// ════════════════════════════════════════════
const crops = ['Wheat', 'Rice', 'Cotton', 'Turmeric', 'Maize', 'Soybean', 'Sugarcane', 'Chili'];
const districts = ['Nizamabad', 'Karimnagar', 'Warangal', 'Adilabad', 'Medak'];
const mandis = ['Nizamabad Mandi', 'Karimnagar APMC', 'Warangal Main Market', 'Adilabad Yard', 'Medak APMC'];

const basePrices = {
  Wheat:      { min: 2000, modal: 2250, max: 2500 },
  Rice:       { min: 1800, modal: 2100, max: 2400 },
  Cotton:     { min: 5500, modal: 6200, max: 6800 },
  Turmeric:   { min: 7000, modal: 8500, max: 10000 },
  Maize:      { min: 1600, modal: 1900, max: 2200 },
  Soybean:    { min: 3800, modal: 4200, max: 4600 },
  Sugarcane:  { min: 280,  modal: 320,  max: 360 },
  Chili:      { min: 8000, modal: 12000, max: 15000 },
};

function generateMarketPrices() {
  const prices = [];
  for (const crop of crops) {
    for (let di = 0; di < districts.length; di++) {
      const base = basePrices[crop];
      const jitter = () => Math.round((Math.random() - 0.5) * base.modal * 0.1);
      prices.push({
        cropName: crop,
        district: districts[di],
        mandi: mandis[di],
        min_price: base.min + jitter(),
        max_price: base.max + jitter(),
        modalPrice: base.modal + jitter(),
        variety: 'Standard',
        source: 'agmarknet',
        arrivalDate: ago(Math.floor(Math.random() * 28)),
      });
    }
  }
  return prices;
}

// ════════════════════════════════════════════
// 4. PRODUCTS
// ════════════════════════════════════════════
const productData = [
  { name: 'Premium Wheat Seeds (5kg)',   description: 'High-yield certified wheat seeds suitable for rabi season. Resistant to rust and smut diseases.',   short_description: 'Certified high-yield wheat seeds', category: 'Seeds',     sub_category: 'Grain Seeds',   price: 450,  discounted_price: 399, stock: 250, isFeatured: true,  images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'] },
  { name: 'Hybrid Rice Seeds (2kg)',      description: 'Premium hybrid rice seeds with 20% higher yield. Best suited for Kharif season in Telangana.',      short_description: 'Hybrid rice seeds - 20% more yield', category: 'Seeds',     sub_category: 'Grain Seeds',   price: 680,  discounted_price: 599, stock: 180, isFeatured: true,  images: ['https://images.unsplash.com/photo-1536304993881-460e4bba7ea3?w=400'] },
  { name: 'Neem Oil Organic Pesticide (1L)', description: 'Cold-pressed neem oil pesticide. Controls 200+ pest species. Safe for organic farming.',          short_description: 'Organic neem oil pest control',  category: 'Pesticides', sub_category: 'Organic',       price: 320,  discounted_price: 279, stock: 400, isFeatured: false, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'] },
  { name: 'Cotton BT Seeds (450g)',       description: 'Government approved BT cotton seeds. High germination rate of 95%. Bollworm resistant.',            short_description: 'BT cotton - bollworm resistant',  category: 'Seeds',     sub_category: 'Cash Crop Seeds', price: 930, discounted_price: null, stock: 120, isFeatured: true,  images: ['https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=400'] },
  { name: 'Trichoderma Bio-Fungicide (1kg)', description: 'Biological fungicide for soil-borne diseases. Improves root health and nutrient uptake.',         short_description: 'Bio-fungicide for soil health',   category: 'Pesticides', sub_category: 'Bio-Pesticides', price: 280, discounted_price: 245, stock: 300, isFeatured: false, images: ['https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400'] },
  { name: 'Drip Irrigation Starter Kit',  description: 'Complete drip irrigation kit for 1 acre. Includes pipes, emitters, filters, and connectors.',       short_description: '1 acre drip irrigation kit',      category: 'Tools',     sub_category: 'Irrigation',    price: 4500, discounted_price: 3999, stock: 45,  isFeatured: true,  images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'] },
  { name: 'Vermicompost Organic Manure (25kg)', description: 'Premium earthworm compost. Rich in NPK and beneficial microorganisms. 100% organic.',          short_description: 'Organic vermicompost manure',     category: 'Organic',   sub_category: 'Manure',        price: 350,  discounted_price: 299, stock: 500, isFeatured: false, images: ['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400'] },
  { name: 'Knapsack Sprayer (16L)',       description: 'Manual knapsack sprayer with brass nozzles. Adjustable spray pattern. Durable build.',               short_description: 'Manual sprayer - 16L capacity',   category: 'Tools',     sub_category: 'Spraying',      price: 1200, discounted_price: 999, stock: 90,  isFeatured: false, images: ['https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=400'] },
  { name: 'Turmeric Seeds Bulbs (10kg)',  description: 'Premium Nizamabad turmeric rhizomes. High curcumin content variety. Best for rainfed cultivation.',   short_description: 'High curcumin turmeric bulbs',    category: 'Seeds',     sub_category: 'Spice Seeds',   price: 1800, discounted_price: 1599, stock: 75,  isFeatured: true,  images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'] },
  { name: 'Soil pH Testing Kit',          description: 'Complete soil testing kit. Tests pH, NPK, and organic carbon. 50 tests per kit.',                     short_description: 'Complete soil pH & NPK test kit', category: 'Tools',     sub_category: 'Testing',       price: 650,  discounted_price: 549, stock: 200, isFeatured: false, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'] },
  { name: 'Maize Hybrid Seeds (4kg)',     description: 'Medium maturity hybrid maize. High starch content. Suitable for both food and feed production.',      short_description: 'Hybrid maize - high starch',      category: 'Seeds',     sub_category: 'Grain Seeds',   price: 520,  discounted_price: 475, stock: 160, isFeatured: false, images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400'] },
  { name: 'Garden Pruning Shears Set',    description: 'Professional grade pruning shears with bypass blades. Includes 3 sizes for different branches.',      short_description: 'Professional pruning shears set', category: 'Tools',     sub_category: 'Hand Tools',    price: 850,  discounted_price: 749, stock: 130, isFeatured: false, images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'] },
];

// ════════════════════════════════════════════
// 5. FERTILIZERS
// ════════════════════════════════════════════
const fertilizerData = [
  { name: 'DAP (Di-Ammonium Phosphate) 50kg', description: 'Essential phosphorus source for root development and flower/fruit formation. NPK 18-46-0.', price: 1350, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', category: 'NPK',           stock: 300 },
  { name: 'Urea 45kg Bag',                     description: 'High-nitrogen fertilizer (46% N). Best for vegetative growth stage. Apply with irrigation.',     price: 267,  image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', category: 'NPK',           stock: 500 },
  { name: 'MOP (Muriate of Potash) 50kg',      description: 'Potassium chloride fertilizer (60% K2O). Improves disease resistance and grain quality.',        price: 1700, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', category: 'NPK',           stock: 200 },
  { name: 'Vermicompost Premium 25kg',          description: 'Earthworm-processed organic manure. Rich in humic acid and beneficial microbes.',               price: 380,  image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400', category: 'Organic',       stock: 400 },
  { name: 'Neem Cake Powder 10kg',              description: 'Organic soil amendment and natural pest deterrent. Rich in azadirachtin.',                       price: 220,  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', category: 'Organic',       stock: 350 },
  { name: 'Zinc Sulphate 5kg',                  description: 'Micronutrient fertilizer for zinc deficiency. Critical for rice and wheat crops.',               price: 180,  image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', category: 'Micronutrient', stock: 250 },
  { name: 'Rhizobium Bio-Fertilizer 1kg',       description: 'Nitrogen-fixing bio-fertilizer for leguminous crops. Reduces chemical fertilizer need by 25%.', price: 120,  image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', category: 'Bio-Fertilizer', stock: 180 },
  { name: 'NPK 19-19-19 Water Soluble 1kg',    description: 'Balanced water-soluble fertilizer for fertigation. Quick nutrient uptake through drip systems.', price: 450,  image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400', category: 'NPK',           stock: 220 },
];

// ════════════════════════════════════════════
// 6. EQUIPMENT
// ════════════════════════════════════════════
const equipmentData = [
  { name: 'Battery Operated Sprayer 16L',       description: 'Rechargeable battery sprayer with 12V motor. 6 hours run time. Adjustable nozzle pressure.',     price: 2800,  image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=400', category: 'Spraying',    stock: 85,  specifications: { battery: '12V 8Ah', capacity: '16L', pressure: '2-4 bar', weight: '6.5 kg' } },
  { name: 'Mini Power Tiller',                  description: 'Compact 6.5 HP power tiller for small farms. Perfect for Telangana soil conditions.',             price: 35000, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', category: 'Ploughing',   stock: 12,  specifications: { hp: '6.5 HP', fuel: 'Petrol', width: '60 cm' } },
  { name: 'Portable Drip Irrigation Kit (1 acre)', description: 'Complete drip system with timer. Saves 40-60% water. Easy to install.',                      price: 5500,  image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', category: 'Irrigation',  stock: 40,  specifications: { coverage: '1 acre', emitters: '1200', pipe: '16mm LLDPE' } },
  { name: 'Solar Water Pump 3HP',               description: '3HP solar powered water pump. Includes 8 solar panels. Zero electricity cost.',                   price: 85000, image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400', category: 'Irrigation',  stock: 8,   specifications: { power: '3 HP', panels: '8x335W', flow: '45000 LPH', head: '30m' } },
  { name: 'Seed Drill Machine (Manual)',         description: 'Manual seed drill for precise row planting. Adjustable row spacing 15-30 cm.',                    price: 3200,  image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', category: 'Ploughing',   stock: 55,  specifications: { rows: '4', spacing: '15-30 cm', weight: '12 kg' } },
  { name: 'Brush Cutter 52cc',                  description: '52cc 2-stroke brush cutter with nylon head and blade. Ideal for field clearing.',                  price: 6500,  image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c10?w=400', category: 'Harvesting', stock: 30,  specifications: { engine: '52cc 2-stroke', rpm: '9500', shaft: 'Straight' } },
  { name: 'Grain Moisture Meter',               description: 'Digital grain moisture tester. Measures 12 grain types. Accuracy ±0.5%.',                          price: 1800,  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', category: 'Harvesting', stock: 100, specifications: { range: '3-35%', grains: 12, accuracy: '±0.5%' } },
  { name: 'Chaff Cutter Machine',               description: 'Electric chaff cutter for animal feed preparation. Cuts straw, grass, and corn stalks.',           price: 12000, image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400', category: 'Harvesting', stock: 20,  specifications: { motor: '2 HP', capacity: '500 kg/hr', blades: 3 } },
];

// ════════════════════════════════════════════
// 7. BLOGS
// ════════════════════════════════════════════
const blogData = [
  { title: 'How to Increase Wheat Yield by 30% Using Modern Techniques', slug: 'increase-wheat-yield-modern-techniques', excerpt: 'Learn proven strategies to boost your wheat production using seed treatment, precision irrigation, and nutrient management.', content: '<h2>Introduction</h2><p>Wheat is one of the most important rabi crops in Telangana. With the right techniques, farmers can significantly improve their yield.</p><h2>1. Seed Treatment</h2><p>Always treat seeds with fungicide before sowing. Use Carbendazim 2g/kg seed to prevent seed-borne diseases.</p><h2>2. Optimal Sowing Time</h2><p>November 15 to December 15 is the ideal window for wheat sowing in Telangana.</p><h2>3. Nutrient Management</h2><p>Apply 120 kg N, 60 kg P2O5, and 40 kg K2O per hectare. Split nitrogen application into 3 doses.</p><h2>4. Irrigation</h2><p>Critical irrigation stages: Crown Root Initiation (21 DAS), Tillering (45 DAS), Flowering (75 DAS), and Grain Filling (100 DAS).</p>', featured_image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800', author: 'Dr. Ramesh Agri Expert', status: 'published', tags: ['wheat', 'yield', 'techniques'], views: 1245 },
  { title: 'Complete Guide to Organic Turmeric Farming in Telangana', slug: 'organic-turmeric-farming-telangana', excerpt: 'Nizamabad turmeric is famous worldwide. Learn how to grow premium organic turmeric with high curcumin content.', content: '<h2>Why Organic Turmeric?</h2><p>Organic turmeric fetches 2-3x premium over conventional turmeric. Nizamabad district is the turmeric capital of India.</p><h2>Soil Preparation</h2><p>Turmeric prefers well-drained sandy loam with pH 5.5-7.5. Add 25 tonnes FYM per hectare 30 days before planting.</p><h2>Planting</h2><p>Plant mother rhizomes in June-July at 30x20 cm spacing. Each rhizome should weigh 25-30g with 2-3 buds.</p><h2>Organic Pest Management</h2><p>Use neem cake, Trichoderma, and Pseudomonas for disease control. Install pheromone traps for shoot borer.</p>', featured_image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800', author: 'Agri Expert Team', status: 'published', tags: ['turmeric', 'organic', 'telangana'], views: 892 },
  { title: 'Understanding Soil Health: A Farmer\'s Guide to Better Yields', slug: 'soil-health-farmers-guide', excerpt: 'Your soil is your most valuable asset. Learn how to test, improve, and maintain healthy soil for consistent high yields.', content: '<h2>Why Soil Health Matters</h2><p>Healthy soil is the foundation of productive farming. It determines water retention, nutrient availability, and crop resistance.</p><h2>Get Your Soil Tested</h2><p>Test soil every 2 years. KMC offers free soil testing. Collect samples from 15cm depth at 10 random spots.</p><h2>Key Parameters</h2><p>pH (ideal 6.5-7.5), Nitrogen (280+ kg/ha), Phosphorus (22+ kg/ha), Potassium (280+ kg/ha), Organic Carbon (0.75%+).</p><h2>Improving Soil</h2><p>Use green manuring with Dhaincha/Sunhemp. Apply vermicompost regularly. Practice crop rotation.</p>', featured_image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', author: 'KMC Soil Lab', status: 'published', tags: ['soil', 'health', 'testing'], views: 2103 },
  { title: 'Best Practices for Cotton Crop Protection in Kharif Season', slug: 'cotton-crop-protection-kharif', excerpt: 'Protect your cotton crop from bollworm, whitefly, and leaf curl virus with integrated pest management strategies.', content: '<h2>Major Cotton Pests</h2><p>American bollworm, pink bollworm, whitefly, and jassids are the primary threats to cotton in Telangana.</p><h2>IPM Strategy</h2><p>1. Use BT cotton varieties for bollworm resistance. 2. Install yellow sticky traps (25/acre) for whitefly monitoring. 3. Spray neem oil (5ml/L) at 30, 45, and 60 DAS. 4. Release Trichogramma egg parasitoids at flowering.</p><h2>Chemical Control</h2><p>Use chemicals only when pest population exceeds Economic Threshold Level (ETL). Rotate insecticide groups to prevent resistance.</p>', featured_image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800', author: 'Dr. Priya Entomologist', status: 'published', tags: ['cotton', 'pest-management', 'kharif'], views: 678 },
  { title: 'Government Subsidies for Farm Equipment: How to Apply', slug: 'government-subsidies-farm-equipment', excerpt: 'Learn about PM-KISAN, SMAM, and state subsidies available for purchasing farm equipment and inputs.', content: '<h2>Available Schemes</h2><p>Several central and state government schemes provide 50-80% subsidy on farm equipment.</p><h2>Sub-Mission on Agricultural Mechanization (SMAM)</h2><p>Provides 50-80% subsidy on tractors, tillers, sprayers, and other equipment. Small and marginal farmers get higher subsidy.</p><h2>How to Apply</h2><p>1. Visit the DBT Agriculture portal. 2. Register with Aadhaar and land records. 3. Select the equipment and submit application. 4. After approval, purchase from empanelled dealer.</p><h2>State Schemes</h2><p>Telangana offers additional 10% top-up on central subsidies for SC/ST farmers.</p>', featured_image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', author: 'KMC Advisory', status: 'published', tags: ['subsidies', 'government', 'equipment'], views: 3456 },
  { title: 'Water-Saving Irrigation Techniques for Small Farmers', slug: 'water-saving-irrigation-techniques', excerpt: 'Save 40-60% water with drip and sprinkler irrigation. Learn setup, maintenance, and government subsidy options.', content: '<h2>Water Crisis in Agriculture</h2><p>Agriculture consumes 80% of India\'s water. With declining groundwater, efficient irrigation is no longer optional.</p><h2>Drip Irrigation</h2><p>Delivers water directly to plant roots. Saves 40-60% water. Increases yield by 20-30%. Government subsidy: 55-75%.</p><h2>Sprinkler Irrigation</h2><p>Best for wheat, groundnut, and vegetables. Saves 30-40% water. Uniform coverage even on undulating land.</p><h2>Mulching</h2><p>Plastic or organic mulch reduces evaporation by 25-30%. Combine with drip irrigation for maximum water savings.</p>', featured_image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', author: 'Irrigation Expert', status: 'published', tags: ['irrigation', 'water', 'drip'], views: 1567 },
];

// ════════════════════════════════════════════
// 8. SUCCESS STORIES
// ════════════════════════════════════════════
const storyData = [
  { farmer_name: 'Ramaiah Goud',    district: 'Nizamabad',  crop: 'Turmeric',   before_yield: 18,  after_yield: 32, description: 'After getting soil analysis from KMC and following the recommended fertilizer schedule, Ramaiah increased his turmeric yield from 18 quintals to 32 quintals per acre. The KMC team provided personalized guidance on organic pest management that reduced his input costs by 40%.', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600', status: 'published' },
  { farmer_name: 'Srinivas Reddy',   district: 'Karimnagar', crop: 'Cotton',     before_yield: 8,   after_yield: 14, description: 'Srinivas was struggling with bollworm infestation. After consulting with KMC agri experts and switching to BT cotton with IPM practices, his yield jumped from 8 to 14 quintals per acre. His net income increased by ₹35,000 per acre.', image: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=600', status: 'published' },
  { farmer_name: 'Padma Bai',        district: 'Warangal',   crop: 'Rice',       before_yield: 22,  after_yield: 38, description: 'Padma Bai adopted SRI (System of Rice Intensification) method recommended by KMC experts. With proper water management and single seedling transplanting, she nearly doubled her rice yield while using 30% less water.', image: 'https://images.unsplash.com/photo-1536304993881-460e4bba7ea3?w=600', status: 'published' },
  { farmer_name: 'Mahesh Kumar',     district: 'Medak',      crop: 'Vegetables', before_yield: 5,   after_yield: 12, description: 'Mahesh switched from traditional flood irrigation to drip irrigation with KMC subsidy guidance. His vegetable farm now produces 12 tonnes per acre compared to 5 tonnes before. He also started using the KMC marketplace to sell directly to consumers.', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600', status: 'published' },
];

// ════════════════════════════════════════════
// 9. GOVERNMENT SCHEMES
// ════════════════════════════════════════════
const schemeData = [
  { title: 'PM-KISAN Samman Nidhi',                   description: 'Direct income support of ₹6,000 per year to all land-holding farmer families across India, paid in three equal installments of ₹2,000 each.',               eligibility: 'All land-holding farmer families with cultivable land. Excludes institutional landholders, former/present Ministers, income tax payers.', benefits: '₹6,000/year direct bank transfer in 3 installments. No middlemen involved.', is_active: true },
  { title: 'PM Fasal Bima Yojana (PMFBY)',             description: 'Crop insurance scheme covering yield losses due to natural calamities, pests, and diseases. Premium rates: 2% for Kharif, 1.5% for Rabi crops.',           eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops. Both loanee and non-loanee farmers.',                    benefits: 'Full insured sum for crop loss. Premium subsidy by govt. Covers sowing to post-harvest losses.', is_active: true },
  { title: 'Kisan Credit Card (KCC)',                  description: 'Provides farmers with affordable credit for crop production, maintenance, and allied activities at 4% interest rate (after subsidy).',                     eligibility: 'All farmers — individual/joint borrowers, tenant farmers, sharecroppers, SHGs, and JLGs.',                                             benefits: '4% interest rate (with subvention). ₹3 lakh limit. Crop insurance included. Flexible repayment.', is_active: true },
  { title: 'Soil Health Card Scheme',                  description: 'Government provides soil health cards with crop-wise fertilizer recommendations to improve soil productivity and reduce input costs.',                    eligibility: 'All farmers across India. Free soil testing every 2 years.',                                                                           benefits: 'Free soil testing. Crop-wise fertilizer recommendations. Reduces over-fertilization by 20-30%.', is_active: true },
  { title: 'e-NAM (National Agriculture Market)',      description: 'Online trading platform for agricultural commodities. Connects farmers to buyers across India for better price discovery.',                                eligibility: 'All farmers and traders registered at APMC mandis. Free registration.',                                                                 benefits: 'Better price discovery. Transparent auction. Reduced intermediary costs. Direct payment to bank.', is_active: true },
];

// ════════════════════════════════════════════
// 10. EXPERTS
// ════════════════════════════════════════════
const expertData = [
  { name: 'Dr. Ravi Shankar',     photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200', specialty: 'Crop Science',        description: 'PhD in Agronomy from PJTSAU. 15 years experience in cereal and pulse crop management. Published 30+ research papers.',           experienceYears: 15, rating: 4.8, tags: ['wheat', 'rice', 'pulses', 'agronomy'],           languages: ['English', 'Hindi', 'Telugu'], availabilityStatus: 'available' },
  { name: 'Dr. Anitha Kumari',    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200', specialty: 'Soil Health',          description: 'Soil scientist with expertise in nutrient management and organic farming. Former ICAR researcher.',                               experienceYears: 12, rating: 4.7, tags: ['soil', 'organic', 'nutrients', 'composting'],  languages: ['English', 'Telugu'],           availabilityStatus: 'available' },
  { name: 'Prof. Krishnamurthy',  photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', specialty: 'Pest Management',     description: 'Entomology professor specializing in IPM for cotton and vegetable crops. Expert in biological pest control methods.',              experienceYears: 20, rating: 4.9, tags: ['pest', 'IPM', 'cotton', 'biological-control'], languages: ['English', 'Hindi', 'Telugu'], availabilityStatus: 'available' },
  { name: 'Dr. Suresh Babu',      photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200', specialty: 'Irrigation & Water',  description: 'Water management specialist. Expert in drip irrigation, sprinkler systems, and rainwater harvesting for agriculture.',            experienceYears: 10, rating: 4.5, tags: ['irrigation', 'drip', 'water', 'rainwater'],    languages: ['English', 'Telugu'],           availabilityStatus: 'available' },
  { name: 'Dr. Lakshmi Narayana', photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200', specialty: 'Organic Farming',     description: 'Pioneer in natural farming methods. Trains farmers on zero-budget natural farming and vermicomposting.',                          experienceYears: 18, rating: 4.6, tags: ['organic', 'natural-farming', 'vermicompost'], languages: ['English', 'Hindi', 'Telugu'], availabilityStatus: 'busy' },
];

// ════════════════════════════════════════════
// MAIN SEED FUNCTION
// ════════════════════════════════════════════
async function seed() {
  console.log('🔌 Connecting to Supabase PostgreSQL...');
  const sequelize = getSequelize();
  await sequelize.authenticate();
  console.log('✅ Connected!\n');

  // Ensure tables exist for models that may not have been synced by services yet
  console.log('📐 Ensuring required tables exist...');
  const modelsToSync = [
    'Scheme', 'ExpertV2', 'ExpertSlot', 'ExpertConsultation',
    'ReplyTemplate', 'SLAConfig', 'TicketActivity', 'AgentPerformance',
    'FarmerSurvey', 'PriceAlert', 'NotificationLog', 'UserAddress',
    'SoilReport', 'SoilReminder', 'MarketHistory', 'CropDiagnosis',
    'MarketplaceOrder', 'MarketplaceOrderItem',
  ];
  // Tables that need ALTER to add newly-defined columns
  const modelsToAlter = ['SupportTicket', 'TicketMessage', 'NotificationLog', 'ReplyTemplate', 'SLAConfig'];

  for (const name of modelsToSync) {
    if (models[name]) {
      try {
        await models[name].sync();
      } catch (e) {
        console.log(`  ⚠️  ${name}: ${e.message.split('\n')[0]}`);
      }
    }
  }
  // Drop and recreate tricky tables that might have type casting issues (e.g. ARRAY to JSONB)
  console.log('📐 Recreating specific tables to fix schema mismatches...');
  for (const name of ['ReplyTemplate', 'SLAConfig']) {
    if (models[name]) {
      try {
        await models[name].drop({ cascade: true });
        await models[name].sync();
      } catch (e) {
        console.log(`  ⚠️  ${name} recreate: ${e.message.split('\n')[0]}`);
      }
    }
  }

  for (const name of modelsToAlter) {
    if (models[name] && name !== 'ReplyTemplate' && name !== 'SLAConfig') {
      try {
        await models[name].sync({ alter: true });
      } catch (e) {
        console.log(`  ⚠️  ${name} alter: ${e.message.split('\n')[0]}`);
      }
    }
  }
  console.log('✅ Tables ready!\n');

  const createdIds = {}; // Store created IDs for cross-references

  // ─── 1. Seed Farmers ───
  console.log('👨‍🌾 Seeding Farmers...');
  createdIds.farmers = [];
  for (const farmer of farmerAccounts) {
    const existing = await models.User.findOne({ where: { phone: farmer.phone } });
    if (existing) {
      console.log(`  ⏭  ${farmer.name.padEnd(20)} — exists`);
      createdIds.farmers.push(existing.id);
      continue;
    }
    const hashed = await bcrypt.hash('Dev@Farmer123', BCRYPT_ROUNDS);
    const user = await models.User.create({
      name: farmer.name, phone: farmer.phone, email: farmer.email,
      password: hashed, role: 'user', district: farmer.district,
      crops: farmer.crops, isAccountVerified: true, has_completed_survey: true,
    });
    createdIds.farmers.push(user.id);
    console.log(`  ✅ ${farmer.name.padEnd(20)} — created`);
  }

  // ─── 2. Seed Admin Users ───
  console.log('\n👔 Seeding Admin Users...');
  createdIds.admins = {};
  for (const admin of adminAccounts) {
    const existing = await models.AdminUser.findOne({ where: { email: admin.email } });
    if (existing) {
      console.log(`  ⏭  ${admin.role.padEnd(22)} — exists`);
      createdIds.admins[admin.role] = existing.id;
      continue;
    }
    const hashed = await bcrypt.hash(admin.password, BCRYPT_ROUNDS);
    const created = await models.AdminUser.create({
      name: admin.name, email: admin.email, password: hashed,
      role: admin.role, status: 'active', isActive: true,
      phone: `98765${String(Math.floor(10000 + Math.random() * 89999))}`,
      languagesSpoken: ['en', 'hi', 'te'],
    });
    createdIds.admins[admin.role] = created.id;
    console.log(`  ✅ ${admin.role.padEnd(22)} — created (${admin.email})`);
  }

  // ─── 3. Seed Market Prices ───
  console.log('\n📊 Seeding Market Prices...');
  const existingPrices = await models.MarketPrice.count();
  if (existingPrices > 10) {
    console.log(`  ⏭  Already ${existingPrices} prices — skipping`);
  } else {
    const pricesData = generateMarketPrices();
    await models.MarketPrice.bulkCreate(pricesData);
    console.log(`  ✅ Created ${pricesData.length} market price records`);
  }

  // ─── 4. Seed Products ───
  console.log('\n🛒 Seeding Products...');
  createdIds.products = [];
  const existingProducts = await models.Product.count();
  if (existingProducts > 5) {
    console.log(`  ⏭  Already ${existingProducts} products — skipping`);
    const prods = await models.Product.findAll({ attributes: ['id'], limit: 12, raw: true });
    createdIds.products = prods.map(p => p.id);
  } else {
    for (const p of productData) {
      const product = await models.Product.create(p);
      createdIds.products.push(product.id);
    }
    console.log(`  ✅ Created ${productData.length} products`);
  }

  // ─── 5. Seed Fertilizers ───
  console.log('\n🧪 Seeding Fertilizers...');
  const existingFertilizers = await models.Fertilizer.count();
  if (existingFertilizers > 3) {
    console.log(`  ⏭  Already ${existingFertilizers} fertilizers — skipping`);
  } else {
    await models.Fertilizer.bulkCreate(fertilizerData);
    console.log(`  ✅ Created ${fertilizerData.length} fertilizers`);
  }

  // ─── 6. Seed Equipment ───
  console.log('\n🚜 Seeding Equipment...');
  const existingEquipment = await models.Equipment.count();
  if (existingEquipment > 3) {
    console.log(`  ⏭  Already ${existingEquipment} equipment — skipping`);
  } else {
    await models.Equipment.bulkCreate(equipmentData);
    console.log(`  ✅ Created ${equipmentData.length} equipment`);
  }

  // ─── 7. Seed Blogs ───
  console.log('\n📝 Seeding Blogs...');
  const existingBlogs = await models.Blog.count();
  if (existingBlogs > 3) {
    console.log(`  ⏭  Already ${existingBlogs} blogs — skipping`);
  } else {
    await models.Blog.bulkCreate(blogData);
    console.log(`  ✅ Created ${blogData.length} blog posts`);
  }

  // ─── 8. Seed Success Stories ───
  console.log('\n🌟 Seeding Success Stories...');
  const existingStories = await models.SuccessStory.count();
  if (existingStories > 2) {
    console.log(`  ⏭  Already ${existingStories} stories — skipping`);
  } else {
    await models.SuccessStory.bulkCreate(storyData);
    console.log(`  ✅ Created ${storyData.length} success stories`);
  }

  // ─── 9. Seed Government Schemes ───
  console.log('\n🏛️  Seeding Government Schemes...');
  const existingSchemes = await models.Scheme.count();
  if (existingSchemes > 2) {
    console.log(`  ⏭  Already ${existingSchemes} schemes — skipping`);
  } else {
    await models.Scheme.bulkCreate(schemeData);
    console.log(`  ✅ Created ${schemeData.length} schemes`);
  }

  // ─── 10. Seed Experts ───
  console.log('\n🎓 Seeding Experts...');
  createdIds.experts = [];
  const existingExperts = await models.ExpertV2.count();
  if (existingExperts > 3) {
    console.log(`  ⏭  Already ${existingExperts} experts — skipping`);
    const exps = await models.ExpertV2.findAll({ attributes: ['id'], limit: 5, raw: true });
    createdIds.experts = exps.map(e => e.id);
  } else {
    for (const exp of expertData) {
      const created = await models.ExpertV2.create(exp);
      createdIds.experts.push(created.id);
    }
    console.log(`  ✅ Created ${expertData.length} experts`);
  }

  // ─── 11. Seed Expert Slots ───
  console.log('\n📅 Seeding Expert Slots...');
  const existingSlots = await models.ExpertSlot.count();
  if (existingSlots > 5) {
    console.log(`  ⏭  Already ${existingSlots} slots — skipping`);
  } else {
    const slots = [];
    for (const expertId of createdIds.experts) {
      for (let d = 1; d <= 4; d++) {
        const hour = 9 + (d * 2); // 11, 13, 15, 17
        const dt = future(d);
        dt.setHours(hour, 0, 0, 0);
        slots.push({
          expertId,
          slotDatetime: dt,
          durationMinutes: 30,
          isBooked: d === 1, // First slot of each expert is booked
        });
      }
    }
    await models.ExpertSlot.bulkCreate(slots);
    console.log(`  ✅ Created ${slots.length} expert slots`);
  }

  // ─── 12. Seed Soil Reports ───
  console.log('\n🧫 Seeding Soil Reports...');
  const existingSoil = await models.SoilReport.count();
  if (existingSoil > 2) {
    console.log(`  ⏭  Already ${existingSoil} reports — skipping`);
  } else {
    const soilReports = [
      { farmerId: createdIds.farmers[0], ph: 6.8, nitrogen: 310, phosphorus: 28, potassium: 295, organic_matter: 0.85, micronutrients: { zinc: 1.2, iron: 8.5, manganese: 4.2, copper: 1.8 }, recommended_fertilizer: 'DAP + Urea (50:25 ratio)', suitable_crops: ['Wheat', 'Cotton', 'Maize'], soil_status: 'Good', suitability_pct: 85, status: 'Completed', next_test_date: future(180) },
      { farmerId: createdIds.farmers[1], ph: 5.9, nitrogen: 220, phosphorus: 18, potassium: 180, organic_matter: 0.55, micronutrients: { zinc: 0.6, iron: 12.0, manganese: 6.1, copper: 1.1 }, recommended_fertilizer: 'Lime + NPK 19-19-19', suitable_crops: ['Rice', 'Turmeric'], soil_status: 'Moderate', suitability_pct: 65, status: 'Completed', next_test_date: future(120) },
      { farmerId: createdIds.farmers[2], ph: 7.8, nitrogen: 180, phosphorus: 12, potassium: 150, organic_matter: 0.35, micronutrients: { zinc: 0.4, iron: 5.2, manganese: 2.8, copper: 0.7 }, recommended_fertilizer: 'Gypsum + Vermicompost + Zinc Sulphate', suitable_crops: ['Soybean', 'Sorghum'], soil_status: 'Critical', suitability_pct: 42, status: 'Completed', next_test_date: future(90) },
      { farmerId: createdIds.farmers[3], ph: 7.2, nitrogen: 280, phosphorus: 24, potassium: 260, organic_matter: 0.72, micronutrients: { zinc: 1.0, iron: 9.0, manganese: 4.8, copper: 1.5 }, recommended_fertilizer: 'Urea + MOP', suitable_crops: ['Cotton', 'Sugarcane', 'Chili'], soil_status: 'Good', suitability_pct: 78, status: 'Completed', next_test_date: future(150) },
      { farmerId: createdIds.farmers[4], ph: 6.5, nitrogen: 260, phosphorus: 20, potassium: 230, organic_matter: 0.62, micronutrients: { zinc: 0.8, iron: 7.8, manganese: 3.9, copper: 1.3 }, recommended_fertilizer: 'NPK 12-32-16 + Neem Cake', suitable_crops: ['Paddy', 'Chili', 'Vegetables'], soil_status: 'Moderate', suitability_pct: 70, status: 'Completed', next_test_date: future(130) },
    ];
    await models.SoilReport.bulkCreate(soilReports);
    console.log(`  ✅ Created ${soilReports.length} soil reports`);
  }

  // ─── 13. Seed Support Tickets ───
  console.log('\n🎫 Seeding Support Tickets...');
  const existingTickets = await models.SupportTicket.count();
  if (existingTickets > 3) {
    console.log(`  ⏭  Already ${existingTickets} tickets — skipping`);
  } else {
    const supportAgentId = createdIds.admins['support_agent'];
    const tickets = [
      { ticketRef: 'TKT-2026-001', farmerId: createdIds.farmers[0], farmerName: 'Rajesh Kumar',  farmerPhone: '9876543210', assignedTo: supportAgentId, assignedAgentName: 'Support Agent', category: 'order_issue',    subject: 'Order not delivered on time',        description: 'I placed an order for wheat seeds 5 days ago but haven\'t received it yet. Order #ORD-2026-001.', priority: 'high',   status: 'in_progress', source: 'app' },
      { ticketRef: 'TKT-2026-002', farmerId: createdIds.farmers[1], farmerName: 'Lakshmi Devi',   farmerPhone: '9876543211', assignedTo: supportAgentId, assignedAgentName: 'Support Agent', category: 'payment',        subject: 'Payment deducted but order failed',  description: 'I tried to pay ₹1,350 for DAP fertilizer but the payment was deducted and order shows failed.', priority: 'critical', status: 'open',        source: 'phone' },
      { ticketRef: 'TKT-2026-003', farmerId: createdIds.farmers[2], farmerName: 'Venkat Reddy',   farmerPhone: '9876543212', assignedTo: supportAgentId, assignedAgentName: 'Support Agent', category: 'disease_scan',   subject: 'Disease detection gave wrong result', description: 'The crop doctor app identified my maize crop issue as rust but it\'s actually fall armyworm.', priority: 'medium',  status: 'open',        source: 'app' },
      { ticketRef: 'TKT-2026-004', farmerId: createdIds.farmers[3], farmerName: 'Priya Sharma',   farmerPhone: '9876543213', category: 'general',         subject: 'How to get soil testing done?',       description: 'I want to get my farm soil tested. How can I register for free soil testing through KMC?', priority: 'low',     status: 'resolved', resolvedAt: ago(2), source: 'whatsapp' },
      { ticketRef: 'TKT-2026-005', farmerId: createdIds.farmers[0], farmerName: 'Rajesh Kumar',  farmerPhone: '9876543210', assignedTo: supportAgentId, assignedAgentName: 'Support Agent', category: 'expert_booking', subject: 'Expert didn\'t call at scheduled time', description: 'I booked a consultation with Dr. Ravi for 2 PM today but he didn\'t call.', priority: 'high',   status: 'in_progress', source: 'app' },
      { ticketRef: 'TKT-2026-006', farmerId: createdIds.farmers[4], farmerName: 'Suresh Patel',   farmerPhone: '9876543214', category: 'soil_test',       subject: 'Soil report seems inaccurate',        description: 'My soil report shows pH 7.8 but I had it tested privately and it was 6.5. Please recheck.', priority: 'medium',  status: 'open',        source: 'app' },
    ];
    const createdTickets = await models.SupportTicket.bulkCreate(tickets);
    console.log(`  ✅ Created ${tickets.length} support tickets`);

    // Seed ticket messages
    console.log('\n💬 Seeding Ticket Messages...');
    const messages = [];
    for (const ticket of createdTickets) {
      messages.push(
        { ticketId: ticket.id, senderType: 'farmer', senderId: ticket.farmerId, senderName: ticket.farmerName, message: ticket.description },
        { ticketId: ticket.id, senderType: 'agent',  senderId: supportAgentId,  senderName: 'Support Agent',  message: `Thank you for reaching out. We are looking into your issue regarding "${ticket.subject}". Our team will get back to you shortly.` },
      );
    }
    await models.TicketMessage.bulkCreate(messages);
    console.log(`  ✅ Created ${messages.length} ticket messages`);
  }

  // ─── 14. Seed Notification Logs ───
  console.log('\n🔔 Seeding Notification Logs...');
  const existingNotifs = await models.NotificationLog.count();
  if (existingNotifs > 5) {
    console.log(`  ⏭  Already ${existingNotifs} notifications — skipping`);
  } else {
    const notifs = [
      { user_id: createdIds.farmers[0], channel: 'sms',   type: 'otp_sent',        recipient: '9876543210', subject: 'OTP Verification',    status: 'sent', metadata: { otp: '******' }, sent_at: ago(5) },
      { user_id: createdIds.farmers[1], channel: 'sms',   type: 'otp_sent',        recipient: '9876543211', subject: 'OTP Verification',    status: 'sent', metadata: { otp: '******' }, sent_at: ago(4) },
      { user_id: createdIds.farmers[0], channel: 'email', type: 'order_placed',    recipient: 'farmer@dev.kissanmithar.com', subject: 'Order Confirmed #ORD-2026-001', status: 'sent', metadata: { orderId: 'ORD-2026-001' }, sent_at: ago(3) },
      { user_id: createdIds.farmers[2], channel: 'push',  type: 'price_alert',     recipient: '9876543212', subject: 'Maize price alert',   status: 'sent', metadata: { crop: 'Maize', price: 1950 }, sent_at: ago(2) },
      { user_id: createdIds.farmers[0], channel: 'email', type: 'ticket_created',  recipient: 'farmer@dev.kissanmithar.com', subject: 'Support Ticket Created', status: 'sent', metadata: { ticketRef: 'TKT-2026-001' }, sent_at: ago(1) },
      { user_id: createdIds.farmers[3], channel: 'sms',   type: 'expert_booking',  recipient: '9876543213', subject: 'Consultation Confirmed', status: 'sent', metadata: { expert: 'Dr. Ravi Shankar' }, sent_at: ago(1) },
      { user_id: createdIds.farmers[1], channel: 'push',  type: 'soil_report',     recipient: '9876543211', subject: 'Soil Report Ready',    status: 'sent', metadata: { reportId: 'SR-001' }, sent_at: ago(1) },
      { user_id: createdIds.farmers[4], channel: 'email', type: 'order_shipped',   recipient: 'suresh@dev.kissanmithar.com', subject: 'Order Shipped #ORD-2026-003', status: 'sent', metadata: { orderId: 'ORD-2026-003' }, sent_at: ago(0) },
    ];
    await models.NotificationLog.bulkCreate(notifs);
    console.log(`  ✅ Created ${notifs.length} notification logs`);
  }

  // ─── 15. Seed Marketplace Orders ───
  console.log('\n📦 Seeding Marketplace Orders...');
  const existingOrders = await models.MarketplaceOrder.count();
  if (existingOrders > 2) {
    console.log(`  ⏭  Already ${existingOrders} orders — skipping`);
  } else if (createdIds.products.length >= 4) {
    const orders = [
      { userId: createdIds.farmers[0], total_amount: 1078, address: '45 Main Street, Nizamabad, Telangana 503001',      status: 'Delivered',   payment_method: 'COD',      payment_status: 'Completed' },
      { userId: createdIds.farmers[1], total_amount: 2249, address: '12 Gandhi Road, Karimnagar, Telangana 505001',      status: 'Processing',  payment_method: 'Razorpay', payment_status: 'Completed', razorpay_order_id: 'order_KMC_test_001' },
      { userId: createdIds.farmers[2], total_amount: 599,  address: '78 Station Road, Warangal, Telangana 506001',       status: 'Pending',     payment_method: 'COD',      payment_status: 'Pending' },
      { userId: createdIds.farmers[4], total_amount: 3498, address: '23 Market Yard, Medak, Telangana 502110',           status: 'Shipped',     payment_method: 'Razorpay', payment_status: 'Completed', razorpay_order_id: 'order_KMC_test_002' },
    ];
    const createdOrders = await models.MarketplaceOrder.bulkCreate(orders);

    // Order items
    const items = [
      { orderId: createdOrders[0].id, productId: createdIds.products[0], quantity: 2, price: 399 },
      { orderId: createdOrders[0].id, productId: createdIds.products[2], quantity: 1, price: 279 },
      { orderId: createdOrders[1].id, productId: createdIds.products[1], quantity: 2, price: 599 },
      { orderId: createdOrders[1].id, productId: createdIds.products[3], quantity: 1, price: 930 },
      { orderId: createdOrders[2].id, productId: createdIds.products[1], quantity: 1, price: 599 },
      { orderId: createdOrders[3].id, productId: createdIds.products[5], quantity: 1, price: 3999 },
    ];
    await models.MarketplaceOrderItem.bulkCreate(items);
    console.log(`  ✅ Created ${orders.length} orders with ${items.length} items`);
  }

  // ─── 16. Seed User Addresses ───
  console.log('\n📍 Seeding User Addresses...');
  const existingAddresses = await models.UserAddress.count();
  if (existingAddresses > 2) {
    console.log(`  ⏭  Already ${existingAddresses} addresses — skipping`);
  } else {
    const addresses = [
      { userId: createdIds.farmers[0], full_name: 'Rajesh Kumar', phone: '9876543210', address: '45 Main Street, Dichpally, Nizamabad, Telangana 503175' },
      { userId: createdIds.farmers[1], full_name: 'Lakshmi Devi', phone: '9876543211', address: '12 Gandhi Road, Huzurabad, Karimnagar, Telangana 505468' },
      { userId: createdIds.farmers[2], full_name: 'Venkat Reddy', phone: '9876543212', address: '78 Station Road, Parkal, Warangal, Telangana 506164' },
    ];
    await models.UserAddress.bulkCreate(addresses);
    console.log(`  ✅ Created ${addresses.length} user addresses`);
  }

  // ─── 17. Seed Price Alerts ───
  console.log('\n🔔 Seeding Price Alerts...');
  const existingAlerts = await models.PriceAlert.count();
  if (existingAlerts > 1) {
    console.log(`  ⏭  Already ${existingAlerts} alerts — skipping`);
  } else {
    const alerts = [
      { userId: createdIds.farmers[0], crop: 'Wheat',    target_price: 2500, condition: 'Above', status: 'Active' },
      { userId: createdIds.farmers[1], crop: 'Turmeric', target_price: 9000, condition: 'Above', status: 'Active' },
      { userId: createdIds.farmers[2], crop: 'Maize',    target_price: 1700, condition: 'Below', status: 'Active' },
    ];
    await models.PriceAlert.bulkCreate(alerts);
    console.log(`  ✅ Created ${alerts.length} price alerts`);
  }

  // ─── 18. Seed Farmer Surveys ───
  console.log('\n📋 Seeding Farmer Surveys...');
  const existingSurveys = await models.FarmerSurvey.count();
  if (existingSurveys > 1) {
    console.log(`  ⏭  Already ${existingSurveys} surveys — skipping`);
  } else {
    const surveys = [
      { userId: createdIds.farmers[0], language: 'te', farm_name: 'Rajesh Farm',    farm_size: 5.5, farm_size_unit: 'acres', land_ownership: 'owned', soil_type: 'Black Cotton', water_source: 'borewell', primary_crops: ['Wheat', 'Cotton'], farming_experience: '10-20 years' },
      { userId: createdIds.farmers[1], language: 'te', farm_name: 'Lakshmi Estate', farm_size: 3.0, farm_size_unit: 'acres', land_ownership: 'owned', soil_type: 'Red Soil',     water_source: 'canal',    primary_crops: ['Rice', 'Turmeric'], farming_experience: '5-10 years' },
    ];
    await models.FarmerSurvey.bulkCreate(surveys);
    console.log(`  ✅ Created ${surveys.length} farmer surveys`);
  }

  // ─── 19. Seed Reply Templates ───
  console.log('\n📄 Seeding Reply Templates...');
  const existingTemplates = await models.ReplyTemplate.count();
  if (existingTemplates > 2) {
    console.log(`  ⏭  Already ${existingTemplates} templates — skipping`);
  } else {
    const templates = [
      { name: 'Order Delay Apology',     category: 'order_issue',    subjectEn: 'Apology for Order Delay',        contentEn: 'Dear {{farmer_name}}, we sincerely apologize for the delay in your order #{{order_id}}. Our team is working to expedite the delivery. Expected arrival: {{expected_date}}. Thank you for your patience.', contentHi: 'प्रिय {{farmer_name}}, आपके ऑर्डर #{{order_id}} में देरी के लिए हमें खेद है।', variables: ['farmer_name', 'order_id', 'expected_date'], isActive: true },
      { name: 'Payment Issue Resolution', category: 'payment',        subjectEn: 'Payment Issue Resolved',          contentEn: 'Dear {{farmer_name}}, we have investigated the payment issue for ₹{{amount}}. The refund has been initiated and will reflect in your account within 3-5 business days. Reference: {{ref_id}}.', variables: ['farmer_name', 'amount', 'ref_id'], isActive: true },
      { name: 'Soil Test Instructions',   category: 'general',        subjectEn: 'How to Get Your Soil Tested',    contentEn: 'Dear {{farmer_name}}, thank you for your interest in soil testing! Here\'s how: 1. Collect soil samples from 15cm depth at 10 spots. 2. Mix and take 500g sample. 3. Visit your nearest KMC center or book a home collection via the app.', variables: ['farmer_name'], isActive: true },
      { name: 'Expert No-Show Follow-up', category: 'expert_booking', subjectEn: 'Expert Consultation Rescheduled', contentEn: 'Dear {{farmer_name}}, we apologize that the expert consultation was missed. We have rescheduled your session with {{expert_name}} on {{new_date}} at {{new_time}}. A reminder will be sent 30 minutes before.', variables: ['farmer_name', 'expert_name', 'new_date', 'new_time'], isActive: true },
    ];
    await models.ReplyTemplate.bulkCreate(templates);
    console.log(`  ✅ Created ${templates.length} reply templates`);
  }

  // ─── 20. Seed SLA Config ───
  console.log('\n⏱️  Seeding SLA Config...');
  const existingSLA = await models.SLAConfig.count();
  if (existingSLA > 2) {
    console.log(`  ⏭  Already ${existingSLA} SLA configs — skipping`);
  } else {
    const slaConfigs = [
      { priority: 'critical', firstResponseHours: 1,  resolutionHours: 4,   escalateAfterHours: 2,  isActive: true },
      { priority: 'high',     firstResponseHours: 4,  resolutionHours: 12,  escalateAfterHours: 6,  isActive: true },
      { priority: 'medium',   firstResponseHours: 8,  resolutionHours: 24,  escalateAfterHours: 12, isActive: true },
      { priority: 'low',      firstResponseHours: 24, resolutionHours: 72,  escalateAfterHours: 48, isActive: true },
    ];
    for (const sla of slaConfigs) {
      const existing = await models.SLAConfig.findOne({ where: { priority: sla.priority } });
      if (!existing) {
        await models.SLAConfig.create(sla);
      }
    }
    console.log(`  ✅ SLA configs seeded`);
  }

  // ─── Done ───
  console.log('\n════════════════════════════════════════');
  console.log('🎉 ALL DATA SEEDED SUCCESSFULLY!');
  console.log('════════════════════════════════════════');
  console.log('\nDev Login Credentials:');
  console.log('  Farmer:       Phone 9876543210, Password Dev@Farmer123');
  console.log('  Super Admin:  superadmin@dev.kissanmithar.com / Dev@SuperAdmin123');
  console.log('  Admin:        admin@dev.kissanmithar.com / Dev@Admin123');
  console.log('  (All roles available via Quick Login buttons)\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
