import { User, Order, Booking, Notification } from '../models/index.js';
import bcrypt from "bcryptjs";
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';

// Get Dashboard Stats
export const getDashboardStats = async (req, res) => {
    try {
        // Total Farmers
        const totalFarmers = await User.count({ where: { role: 'user' } });

        // Verified Farmers
        const verifiedFarmers = await User.count({
            where: { role: 'user', isAccountVerified: true }
        });

        // Pending Approvals
        const pendingApprovals = await User.count({
            where: { role: 'user', isAccountVerified: false }
        });

        // Total Districts
        const districts = await User.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('district')), 'district']],
            where: { role: 'user' }
        });
        const totalDistricts = districts.filter(d => d.district).length;

        // Revenue & Active Packages
        const orders = await Order.findAll();
        const activePackages = orders.filter(o => o.status === 'Active').length;
        const revenue = orders.reduce((acc, curr) => acc + Number(curr.amount), 0);

        // Monthly Registrations (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const recentUsers6mo = await User.findAll({
            attributes: ['createdAt'],
            where: { createdAt: { [Op.gte]: sixMonthsAgo } }
        });

        const monthCounts = {};
        recentUsers6mo.forEach(u => {
            const month = new Date(u.createdAt).getMonth() + 1;
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });
        const monthlyRegistrations = Object.entries(monthCounts)
            .sort(([a], [b]) => a - b)
            .map(([month, count]) => ({ _id: Number(month), count }));

        // District Distribution (Top 5)
        const districtCountsData = await User.findAll({
            attributes: [
                'district',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: { role: 'user' },
            group: ['district'],
            order: [[sequelize.col('count'), 'DESC']],
            limit: 5
        });
        
        const districtData = districtCountsData.map(d => ({
            _id: d.district || 'Other',
            count: Number(d.get('count'))
        }));

        // Crop Distribution (Top 5)
        const allFarmersCrops = await User.findAll({
            attributes: ['crops'],
            where: { role: 'user' }
        });

        const cropCounts = {};
        allFarmersCrops.forEach(u => {
            (u.crops || []).forEach(crop => {
                cropCounts[crop] = (cropCounts[crop] || 0) + 1;
            });
        });
        const cropData = Object.entries(cropCounts)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Recent Users
        const recentUsers = await User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });

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
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'phone', 'role', 'district', 'crops', 'isAccountVerified', 'language', 'preferredLanguage', 'hasCompletedTour', 'simpleMode', 'hasCompletedSurvey', 'fieldOfficerId', 'createdAt', 'updatedAt']
        });

        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update User Role
export const updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;

        if (!['user', 'admin', 'field-officer'].includes(role)) {
            return res.json({ success: false, message: "Invalid Role" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        await user.update({ role });

        res.json({ success: true, message: "User role updated", user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Farmers with search, filter, and pagination
export const getFarmers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', district = '', crop = '', status = '' } = req.query;

        const where = { role: 'user' };

        if (search) {
            where.name = { [Op.iLike]: `%${search}%` };
        }

        if (district) {
            where.district = district;
        }

        if (crop) {
            where.crops = { [Op.contains]: [crop] };
        }

        if (status !== '') {
            where.isAccountVerified = status === 'Approved';
        }

        const skip = (page - 1) * limit;

        const { count, rows: farmers } = await User.findAndCountAll({
            where,
            include: [{ model: User, as: 'FieldOfficer', attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: skip
        });

        // Map fieldOfficer to match original shape
        const mapped = farmers.map(f => {
            const data = f.toJSON();
            data.fieldOfficer = data.FieldOfficer;
            delete data.FieldOfficer;
            return data;
        });

        res.json({
            success: true,
            farmers: mapped,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalFarmers: count
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

        const user = await User.findByPk(id);

        if (!user) {
            return res.json({ success: false, message: "Farmer not found" });
        }

        await user.update({ isAccountVerified });

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
        if (fieldOfficer !== undefined) updateData.fieldOfficerId = fieldOfficer || null;

        const user = await User.findByPk(id);

        if (!user) {
            return res.json({ success: false, message: "Farmer not found" });
        }

        await user.update(updateData);

        const updatedUser = await User.findByPk(id, {
            include: [{ model: User, as: 'FieldOfficer', attributes: ['name', 'email'] }]
        });
        
        const mappedUser = updatedUser.toJSON();
        mappedUser.fieldOfficer = mappedUser.FieldOfficer;
        delete mappedUser.FieldOfficer;

        res.json({ success: true, message: "Farmer information updated", user: mappedUser });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Bookings
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: User, as: 'Farmer', attributes: ['name', 'email', 'district', 'phone'] },
                { model: User, as: 'Officer', attributes: ['name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Map to match original response shape
        const mapped = bookings.map(b => {
            const data = b.toJSON();
            data.farmerId = data.Farmer;
            data.assignedOfficer = data.Officer;
            delete data.Farmer;
            delete data.Officer;
            return data;
        });

        res.json({ success: true, bookings: mapped });
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
        if (assignedOfficer !== undefined) updateData.assignedOfficerId = assignedOfficer || null;
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const booking = await Booking.findByPk(id);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        await booking.update(updateData);
        
        const updatedBooking = await Booking.findByPk(id, {
            include: [
                { model: User, as: 'Farmer', attributes: ['name', 'email', 'phone'] },
                { model: User, as: 'Officer', attributes: ['name', 'email'] }
            ]
        });

        const mappedBooking = updatedBooking.toJSON();
        mappedBooking.farmerId = mappedBooking.Farmer;
        mappedBooking.assignedOfficer = mappedBooking.Officer;
        delete mappedBooking.Farmer;
        delete mappedBooking.Officer;

        res.json({ success: true, message: "Booking updated successfully", booking: mappedBooking });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Send Targeted Notification
export const sendNotification = async (req, res) => {
    try {
        const { title, message, targetType, targetValue } = req.body;
        const adminId = req.body.userId; // From adminAuth middleware

        let whereConfig = { role: 'user' };

        if (targetType === 'District') {
            whereConfig.district = targetValue;
        } else if (targetType === 'Crop') {
            whereConfig.crops = { [Op.contains]: [targetValue] };
        }

        const recipientCount = await User.count({ where: whereConfig });

        const newNotification = await Notification.create({
            title,
            message,
            targetType,
            targetValue: targetValue || 'Global',
            recipientCount: recipientCount || 0,
            sentBy: adminId
        });

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
        const notifications = await Notification.findAll({
            include: [
                { model: User, attributes: ['name', 'email'] } // Adjust relation mapping if needed
            ],
            order: [['createdAt', 'DESC']]
        });

        // Map to match original response shape
        const mapped = notifications.map(n => {
            const data = n.toJSON();
            data.sentBy = data.User;
            delete data.User;
            return data;
        });

        res.json({ success: true, notifications: mapped });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Advanced Analytics
export const getAnalytics = async (req, res) => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // 1. Monthly Farmer Growth (Last 12 months)
        const recentFarmers = await User.findAll({
            attributes: ['createdAt'],
            where: { role: 'user', createdAt: { [Op.gte]: oneYearAgo } }
        });

        const farmerGrowthMap = {};
        recentFarmers.forEach(u => {
            const month = new Date(u.createdAt).getMonth() + 1;
            farmerGrowthMap[month] = (farmerGrowthMap[month] || 0) + 1;
        });
        const farmerGrowth = Object.entries(farmerGrowthMap)
            .map(([_id, count]) => ({ _id: Number(_id), count }))
            .sort((a, b) => a._id - b._id);

        // 2. Crop Distribution
        const allFarmersCrops = await User.findAll({
            attributes: ['crops'],
            where: { role: 'user' }
        });

        const cropDistMap = {};
        allFarmersCrops.forEach(u => {
            (u.crops || []).forEach(crop => {
                cropDistMap[crop] = (cropDistMap[crop] || 0) + 1;
            });
        });
        const cropDistribution = Object.entries(cropDistMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count);

        // 3. District Distribution
        const allFarmers = await User.findAll({
            attributes: ['district'],
            where: { role: 'user' }
        });

        const distDistMap = {};
        allFarmers.forEach(u => {
            const d = u.district || 'Other';
            distDistMap[d] = (distDistMap[d] || 0) + 1;
        });
        const districtDistribution = Object.entries(distDistMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count);

        // 4. Revenue Trend (Monthly orders)
        const recentOrders = await Order.findAll({
            attributes: ['amount', 'createdAt'],
            where: { createdAt: { [Op.gte]: oneYearAgo } }
        });

        const revMap = {};
        recentOrders.forEach(o => {
            const month = new Date(o.createdAt).getMonth() + 1;
            revMap[month] = (revMap[month] || 0) + Number(o.amount);
        });
        const revenueTrend = Object.entries(revMap)
            .map(([_id, total]) => ({ _id: Number(_id), total }))
            .sort((a, b) => a._id - b._id);

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

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists" });
        }

        if (phone) {
            const existingPhone = await User.findOne({ where: { phone } });

            if (existingPhone) {
                return res.json({ success: false, message: "User with this phone number already exists" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            phone: phone || null,
            password: hashedPassword,
            role,
            district: district || 'Other',
            isAccountVerified: true // Admin-created accounts are auto-verified
        });

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

        const user = await User.findByPk(id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        await user.update(updateData);

        res.json({ success: true, message: "User updated successfully", user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        await user.destroy();

        res.json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
