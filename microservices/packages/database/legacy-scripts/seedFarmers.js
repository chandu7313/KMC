import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/userModel.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const seedData = async () => {
    try {
        await connectDB();

        const password = await bcrypt.hash("password123", 10);

        // 1. Create Field Officers if they don't exist
        const fieldOfficers = [
            { name: "John Officer", email: "john.fo@agridust.com", role: 'field-officer' },
            { name: "Sarah Field", email: "sarah.fo@agridust.com", role: 'field-officer' }
        ];

        const seededOfficers = [];
        for (const fo of fieldOfficers) {
            let existing = await userModel.findOne({ email: fo.email });
            if (!existing) {
                existing = await userModel.create({ ...fo, password, isAccountVerified: true });
                console.log(`Created Field Officer: ${fo.name}`);
            }
            seededOfficers.push(existing);
        }

        // 2. Create Dummy Farmers
        const farmers = [
            { name: "Amit Kumar", email: "amit@example.com", district: "Pune", crops: ["Wheat", "Tomato"], isAccountVerified: true, fieldOfficer: seededOfficers[0]._id },
            { name: "Suresh Patil", email: "suresh@example.com", district: "Nashik", crops: ["Grapes", "Onion"], isAccountVerified: false, fieldOfficer: null },
            { name: "Ramesh Pawar", email: "ramesh@example.com", district: "Pune", crops: ["Sugarcane"], isAccountVerified: true, fieldOfficer: seededOfficers[1]._id },
            { name: "Ganesh Shinde", email: "ganesh@example.com", district: "Satara", crops: ["Strawberry", "Potato"], isAccountVerified: false, fieldOfficer: null },
            { name: "Sunil Deshmukh", email: "sunil@example.com", district: "Nagpur", crops: ["Orange", "Cotton"], isAccountVerified: true, fieldOfficer: seededOfficers[0]._id },
            { name: "Anita More", email: "anita@example.com", district: "Pune", crops: ["Mango"], isAccountVerified: true, fieldOfficer: null },
            { name: "Vijay Jadhav", email: "vijay@example.com", district: "Nashik", crops: ["Corn"], isAccountVerified: false, fieldOfficer: null },
            { name: "Prakash Kadam", email: "prakash@example.com", district: "Satara", crops: ["Wheat"], isAccountVerified: true, fieldOfficer: seededOfficers[1]._id },
            { name: "Sandip Thorat", email: "sandip@example.com", district: "Pune", crops: ["Tomato"], isAccountVerified: false, fieldOfficer: null },
            { name: "Rahul Mane", email: "rahul@example.com", district: "Nagpur", crops: ["Rice"], isAccountVerified: true, fieldOfficer: seededOfficers[0]._id }
        ];

        for (const farmer of farmers) {
            const existing = await userModel.findOne({ email: farmer.email });
            if (!existing) {
                await userModel.create({ ...farmer, password, role: 'user' });
                console.log(`Created Farmer: ${farmer.name}`);
            }
        }

        console.log("Seeding complete!");
        process.exit(0);

    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
