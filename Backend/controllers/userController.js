import userModel from '../models/userModel.js'


export const getUserData = async (req, res) => {

    try {

        const { userId } = req.body

        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
                language: user.language,
                preferredLanguage: user.preferredLanguage,
                hasCompletedTour: user.hasCompletedTour,
                hasCompletedSurvey: user.hasCompletedSurvey,
                simpleMode: user.simpleMode,
                addresses: user.addresses || []
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

        await userModel.findByIdAndUpdate(userId, { language })

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

        await userModel.findByIdAndUpdate(userId, updateData);

        res.json({ success: true, message: "User preferences updated successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const saveAddress = async (req, res) => {
    try {
        const { userId, address } = req.body;
        // address: { fullName, phone, address }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.addresses.push(address);
        await user.save();

        res.json({ success: true, message: "Address saved successfully", addresses: user.addresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}