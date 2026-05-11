import mongoose from 'mongoose';
import MarketPrice from './models/MarketPrice.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const marketData = [
    { cropName: "Cotton", variety: "J-34", district: "Rajkot", mandi: "Rajkot Mandi", unit: "Quintal", modalPrice: 6200, change: 3.8, arrivalDate: new Date() },
    { cropName: "Cotton", variety: "Shankar-6", district: "Nagpur", mandi: "Nagpur Mandi", unit: "Quintal", modalPrice: 6050, change: 2.1, arrivalDate: new Date() },
    { cropName: "Groundnut", variety: "TG-37A", district: "Junagadh", mandi: "Junagadh Mandi", unit: "Quintal", modalPrice: 5800, change: 2.1, arrivalDate: new Date() },
    { cropName: "Maize", variety: "Yellow", district: "Davangere", mandi: "Davangere Mandi", unit: "Quintal", modalPrice: 2100, change: -0.8, arrivalDate: new Date() },
    { cropName: "Mustard", variety: "RH-30", district: "Alwar", mandi: "Alwar Mandi", unit: "Quintal", modalPrice: 5200, change: 4.2, arrivalDate: new Date() },
    { cropName: "Pulses", variety: "Chana", district: "Latur", mandi: "Latur Mandi", unit: "Quintal", modalPrice: 4800, change: 1.2, arrivalDate: new Date() },
    { cropName: "Rice", variety: "Sona Masoori", district: "Guntur", mandi: "Guntur Mandi", unit: "Quintal", modalPrice: 3200, change: 0.5, arrivalDate: new Date() },
    { cropName: "Rice", variety: "Basmati", district: "Karnal", mandi: "Karnal Mandi", unit: "Quintal", modalPrice: 3800, change: -1.2, arrivalDate: new Date() },
    { cropName: "Soybean", variety: "JS-9560", district: "Dewas", mandi: "Dewas Mandi", unit: "Quintal", modalPrice: 4100, change: 0, arrivalDate: new Date() },
    { cropName: "Sugarcane", variety: "Co-0238", district: "Muzaffarnagar", mandi: "Muzaffarnagar Mandi", unit: "Quintal", modalPrice: 350, change: 1.5, arrivalDate: new Date() },
    { cropName: "Wheat", variety: "Sharbati", district: "Indore", mandi: "Indore Mandi", unit: "Quintal", modalPrice: 2450, change: 2.5, arrivalDate: new Date() },
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
