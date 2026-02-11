import mongoose from 'mongoose';
import bookingModel from './models/bookingModel.js';
import userModel from './models/userModel.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const seedBookings = async () => {
    try {
        await connectDB();

        // 1. Get some farmers and field officers
        const farmers = await userModel.find({ role: 'user' }).limit(5);
        const officers = await userModel.find({ role: 'field-officer' });

        if (farmers.length === 0 || officers.length === 0) {
            console.log("Seeding failed: Ensure farmers and field officers exist first. Run seedFarmers.js.");
            process.exit(1);
        }

        const bookingData = [
            {
                farmerId: farmers[0]._id,
                package: "Standard Farm Visit",
                visitDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                assignedOfficer: officers[0]._id,
                status: 'Confirmed',
                paymentStatus: 'Completed'
            },
            {
                farmerId: farmers[1]._id,
                package: "Soil Analysis & Consultation",
                visitDate: new Date(Date.now() + 86400000 * 5),
                assignedOfficer: null,
                status: 'Pending',
                paymentStatus: 'Pending'
            },
            {
                farmerId: farmers[2]._id,
                package: "Pest Control Advisory",
                visitDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
                assignedOfficer: officers[1]._id,
                status: 'Completed',
                paymentStatus: 'Completed'
            },
            {
                farmerId: farmers[3]._id,
                package: "Orchard Planning",
                visitDate: new Date(Date.now() + 86400000 * 1),
                assignedOfficer: officers[0]._id,
                status: 'Confirmed',
                paymentStatus: 'Pending'
            },
            {
                farmerId: farmers[4]._id,
                package: "Standard Farm Visit",
                visitDate: new Date(Date.now() + 86400000 * 7),
                assignedOfficer: null,
                status: 'Pending',
                paymentStatus: 'Pending'
            }
        ];

        // Clear existing bookings
        await bookingModel.deleteMany({});
        console.log("Existing bookings cleared.");

        // Insert new bookings
        await bookingModel.insertMany(bookingData);
        console.log("Dummy booking data seeded successfully.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding bookings:", error);
        process.exit(1);
    }
};

seedBookings();
