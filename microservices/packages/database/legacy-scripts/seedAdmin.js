import mongoose from 'mongoose';
import userModel from './models/userModel.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminPhone = "9999999999";
        const adminName = "Admin User";

        const existingAdmin = await userModel.findOne({ phone: adminPhone });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        const newAdmin = new userModel({
            name: adminName,
            phone: adminPhone,
            role: 'admin',
            isAccountVerified: true
        });

        await newAdmin.save();
        console.log("Admin user created successfully");
        console.log("Phone:", adminPhone);
        console.log("Note: Admin can now log in using this phone number and receiving OTP (mocked in console if API fails)");

        process.exit(0);

    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
