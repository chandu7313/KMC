import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import userModel from './models/userModel.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "admin@agridust.com";
        const adminPassword = "adminpassword123";
        const adminName = "Admin User";

        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        const newAdmin = new userModel({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isAccountVerified: true
        });

        await newAdmin.save();
        console.log("Admin user created successfully");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);

        process.exit(0);

    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
