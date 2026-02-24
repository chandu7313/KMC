import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";

// Create a new farm visit booking
export const createBooking = async (req, res) => {
    try {
        const { farmerId, fullName, phone, village, district, visitDate, purpose } = req.body;

        if (!farmerId || !fullName || !phone || !village || !district || !visitDate || !purpose) {
            return res.json({ success: false, message: "Missing required booking details" });
        }

        const newBooking = new bookingModel({
            farmerId,
            fullName,
            phone,
            village,
            district,
            visitDate,
            purpose
        });

        await newBooking.save();

        res.json({ success: true, message: "Farm visit booked successfully!", booking: newBooking });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get bookings for a specific farmer
export const getUserBookings = async (req, res) => {
    try {
        const { userId } = req.body;
        const bookings = await bookingModel.find({ farmerId: userId }).sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
