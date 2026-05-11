import mongoose from 'mongoose';
import userModel from './models/userModel.js';
import orderModel from './models/orderModel.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const seedData = async () => {
    try {
        await connectDB();

        console.log("Clearing existing orders...");
        await orderModel.deleteMany({});

        // Update existing users with random districts and crops if missing
        console.log("Updating users with random districts and crops...");
        const users = await userModel.find({ role: 'user' });
        const districts = ['Nashik', 'Pune', 'Nagpur', 'Solapur', 'Aurangabad', 'Amravati', 'Kolhapur'];
        const crops = ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Soybean', 'Maize', 'Grapes', 'Pomegranate'];

        for (const user of users) {
            user.district = districts[Math.floor(Math.random() * districts.length)];
            user.crops = [
                crops[Math.floor(Math.random() * crops.length)],
                crops[Math.floor(Math.random() * crops.length)]
            ];
            // Randomly set some as verified
            if (Math.random() > 0.3) user.isAccountVerified = true;
            await user.save();
        }

        // Create dummy orders
        console.log("Creating dummy orders...");
        const packages = [
            { name: 'Starter', price: 999 },
            { name: 'Growth', price: 2999 },
            { name: 'Premium', price: 5999 }
        ];

        const orders = [];
        for (let i = 0; i < 20; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            if (!randomUser) continue;

            const randomPackage = packages[Math.floor(Math.random() * packages.length)];
            const randomDate = new Date();
            randomDate.setMonth(randomDate.getMonth() - Math.floor(Math.random() * 6));

            orders.push({
                userId: randomUser._id,
                package: randomPackage.name,
                amount: randomPackage.price,
                date: randomDate,
                status: Math.random() > 0.1 ? 'Active' : 'Expired'
            });
        }

        await orderModel.insertMany(orders);
        console.log("Seed data created successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
