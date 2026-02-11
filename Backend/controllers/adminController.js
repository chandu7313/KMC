import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import orderModel from "../models/orderModel.js";
import bookingModel from "../models/bookingModel.js";
import notificationModel from "../models/notificationModel.js";

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        const totalFarmers = await userModel.countDocuments({ role: 'user' });
        const verifiedFarmers = await userModel.countDocuments({ role: 'user', isAccountVerified: true });
        const pendingApprovals = await userModel.countDocuments({ role: 'user', isAccountVerified: false });

        const totalDistricts = (await userModel.distinct('district')).length;

        // Revenue & Active Packages
        const orders = await orderModel.find();
        const activePackages = orders.filter(o => o.status === 'Active').length;
        const revenue = orders.reduce((acc, curr) => acc + curr.amount, 0);

        // Monthly Registrations (Last 6 months)
        const monthlyRegistrations = await userModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 5))
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // District Distribution
        const districtData = await userModel.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Crop Distribution
        const cropData = await userModel.aggregate([
            { $match: { role: 'user' } },
            { $unwind: "$crops" },
            { $group: { _id: "$crops", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);


        const recentUsers = await userModel.find().sort({ createdAt: -1 }).limit(5);


        res.json({
            success: true,
            stats: {
                totalFarmers,
                verifiedFarmers,
                pendingApprovals,
                activePackages,
                totalDistricts,
                monthlyRegistrations,
                revenue,
                districtData,
                cropData
            },
            recentUsers
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password');
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User Role - Keep for compatibility if needed, but updateUser is more complete
export const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!['user', 'admin', 'field-officer'].includes(role)) {
            return res.json({ success: false, message: "Invalid Role" });
        }

        const user = await userModel.findByIdAndUpdate(userId, { role }, { new: true });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User role updated", user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Farmers with search, filter, and pagination
export const getFarmers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', district = '', crop = '', status = '' } = req.query;

        const query = { role: 'user' };

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (district) {
            query.district = district;
        }

        if (crop) {
            query.crops = { $in: [crop] };
        }

        if (status !== '') {
            query.isAccountVerified = status === 'Approved';
        }

        const skip = (page - 1) * limit;

        const farmers = await userModel.find(query)
            .populate('fieldOfficer', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const totalFarmers = await userModel.countDocuments(query);

        res.json({
            success: true,
            farmers,
            totalPages: Math.ceil(totalFarmers / limit),
            currentPage: parseInt(page),
            totalFarmers
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Approve / Reject Farmer
export const updateFarmerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Approved' or 'Pending'

        const isAccountVerified = status === 'Approved';

        const user = await userModel.findByIdAndUpdate(id, { isAccountVerified }, { new: true });

        if (!user) {
            return res.json({ success: false, message: "Farmer not found" });
        }

        res.json({ success: true, message: `Farmer ${status}`, user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Farmer Info and Assign Field Officer
export const updateFarmerInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, district, crops, fieldOfficer } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (district) updateData.district = district;
        if (crops) updateData.crops = crops;
        if (fieldOfficer !== undefined) updateData.fieldOfficer = fieldOfficer || null;

        const user = await userModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('fieldOfficer', 'name email');

        if (!user) {
            return res.json({ success: false, message: "Farmer not found" });
        }

        res.json({ success: true, message: "Farmer information updated", user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Bookings
export const getBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({})
            .populate('farmerId', 'name email district phone')
            .populate('assignedOfficer', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Booking
export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedOfficer, status, paymentStatus } = req.body;

        const updateData = {};
        if (assignedOfficer !== undefined) updateData.assignedOfficer = assignedOfficer || null;
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const booking = await bookingModel.findByIdAndUpdate(id, updateData, { new: true })
            .populate('farmerId', 'name email phone')
            .populate('assignedOfficer', 'name email');

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, message: "Booking updated successfully", booking });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Send Targeted Notification
export const sendNotification = async (req, res) => {
    try {
        const { title, message, targetType, targetValue } = req.body;
        const adminId = req.body.userId; // From adminAuth middleware

        let userQuery = { role: 'user' };

        if (targetType === 'District') {
            userQuery.district = targetValue;
        } else if (targetType === 'Crop') {
            userQuery.crops = { $in: [targetValue] };
        }

        const recipients = await userModel.find(userQuery).select('_id');
        const recipientCount = recipients.length;

        const newNotification = new notificationModel({
            title,
            message,
            targetType,
            targetValue: targetValue || 'Global',
            recipientCount,
            sentBy: adminId
        });

        await newNotification.save();

        // Note: In a real app, we would trigger push notifications or SMS here
        res.json({
            success: true,
            message: `Notification sent to ${recipientCount} users`,
            notification: newNotification
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Notification History
export const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find({})
            .populate('sentBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, notifications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Advanced Analytics
export const getAnalytics = async (req, res) => {
    try {
        // 1. Monthly Farmer Growth (Last 12 months)
        const farmerGrowth = await userModel.aggregate([
            {
                $match: {
                    role: 'user',
                    createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Crop Distribution
        const cropDistribution = await userModel.aggregate([
            { $match: { role: 'user' } },
            { $unwind: "$crops" },
            { $group: { _id: "$crops", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 3. District Distribution
        const districtDistribution = await userModel.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: "$district", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 4. Revenue Trend (Monthly orders)
        const revenueTrend = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            success: true,
            analytics: {
                farmerGrowth,
                cropDistribution,
                districtDistribution,
                revenueTrend
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Add New User (Admin/Field Officer)
export const addUser = async (req, res) => {
    try {
        const { name, email, phone, password, role, district } = req.body;

        if (!name || !email || !password || !role) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists" });
        }

        const existingPhone = await userModel.findOne({ phone });
        if (phone && existingPhone) {
            return res.json({ success: false, message: "User with this phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            name,
            email,
            phone: phone || '',
            password: hashedPassword,
            role,
            district: district || '',
            isAccountVerified: true // Admin-created accounts are auto-verified
        });

        await newUser.save();
        res.json({ success: true, message: "User added successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User (Full Edit)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role, district, password } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (role) updateData.role = role;
        if (district !== undefined) updateData.district = district;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await userModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User updated successfully", user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
