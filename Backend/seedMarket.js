import mongoose from 'mongoose';
import MarketPrice from './models/marketPriceModel.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const marketData = [
    { crop: "Cotton", variety: "J-34", district: "Rajkot", unit: "Quintal", price: 6200, change: 3.8 },
    { crop: "Cotton", variety: "Shankar-6", district: "Nagpur", unit: "Quintal", price: 6050, change: 2.1 },
    { crop: "Groundnut", variety: "TG-37A", district: "Junagadh", unit: "Quintal", price: 5800, change: 2.1 },
    { crop: "Maize", variety: "Yellow", district: "Davangere", unit: "Quintal", price: 2100, change: -0.8 },
    { crop: "Mustard", variety: "RH-30", district: "Alwar", unit: "Quintal", price: 5200, change: 4.2 },
    { crop: "Pulses", variety: "Chana", district: "Latur", unit: "Quintal", price: 4800, change: 1.2 },
    { crop: "Rice", variety: "Sona Masoori", district: "Guntur", unit: "Quintal", price: 3200, change: 0.5 },
    { crop: "Rice", variety: "Basmati", district: "Karnal", unit: "Quintal", price: 3800, change: -1.2 },
    { crop: "Soybean", variety: "JS-9560", district: "Dewas", unit: "Quintal", price: 4100, change: 0 },
    { crop: "Sugarcane", variety: "Co-0238", district: "Muzaffarnagar", unit: "Quintal", price: 350, change: 1.5 },
    { crop: "Wheat", variety: "Sharbati", district: "Indore", unit: "Quintal", price: 2450, change: 2.5 },
];

const seedMarketData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await MarketPrice.deleteMany({});
        console.log("Existing market prices cleared.");

        // Insert new data
        await MarketPrice.insertMany(marketData);
        console.log("Dummy market data seeded successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding market data:", error);
        process.exit(1);
    }
};

seedMarketData();
