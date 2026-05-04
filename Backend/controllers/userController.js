import { User, UserAddress } from '../models/index.js';

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body

        let user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'role', 'isAccountVerified', 'language', 'preferredLanguage', 'hasCompletedTour', 'hasCompletedSurvey', 'simpleMode']
        });

        let isAdmin = false;

        if (!user) {
            // Check admin_users table for support staff
            const { AdminUser } = await import('../models/index.js');
            user = await AdminUser.findByPk(userId, {
                attributes: ['id', 'name', 'email', 'role']
            });

            if (!user) {
                return res.json({ success: false, message: "User not found" })
            }
            isAdmin = true;
        }

        // Fetch addresses separately from user_addresses table (only for regular users)
        const addresses = !isAdmin ? await UserAddress.findAll({ where: { userId } }) : [];

        res.json({
            success: true,
            userData: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified || false,
                language: user.language || 'en',
                preferredLanguage: user.preferredLanguage || 'en',
                hasCompletedTour: user.hasCompletedTour || false,
                hasCompletedSurvey: user.hasCompletedSurvey || false,
                simpleMode: user.simpleMode || false,
                addresses: addresses || [],
                isAdminUser: isAdmin
            }
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const updateLanguage = async (req, res) => {
    try {
        const { userId, language } = req.body

        if (!['en', 'hi', 'te'].includes(language)) {
            return res.json({ success: false, message: "Invalid language" })
        }

        await User.update({ language }, { where: { id: userId } });

        res.json({ success: true, message: "Language updated successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const updatePreferences = async (req, res) => {
    try {
        const { userId, preferredLanguage, hasCompletedTour, simpleMode } = req.body;

        const updateData = {};
        if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage;
        if (hasCompletedTour !== undefined) updateData.hasCompletedTour = hasCompletedTour;
        if (simpleMode !== undefined) updateData.simpleMode = simpleMode;

        await User.update(updateData, { where: { id: userId } });

        res.json({ success: true, message: "User preferences updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const saveAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        // address: { fullName, phone, address }

        const user = await User.findByPk(userId, { attributes: ['id'] });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Insert into user_addresses table
        await UserAddress.create({
            userId: userId,
            fullName: address.fullName,
            phone: address.phone,
            address: address.address
        });

        // Return all addresses for the user
        const addresses = await UserAddress.findAll({ where: { userId } });

        res.json({ success: true, message: "Address saved successfully", addresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}