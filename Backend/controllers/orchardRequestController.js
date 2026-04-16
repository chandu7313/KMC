import OrchardModel from "../models/OrchardRequest.js";
import { v2 as cloudinary } from "cloudinary";

// POST /api/orchard/request
export const createRequest = async (req, res) => {
    try {
        const { acres, location, waterType, goal, skillLevel, marketPreference } = req.body;
        
        // Basic requirement validation
        if (!acres || !location || Number(acres) <= 0) {
            return res.json({ success: false, message: "Valid Acres (>0) and Location are required" });
        }

        let imageUrls = [];
        // Handle images if uploaded
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, { folder: "orchard_requests" });
                imageUrls.push(result.secure_url);
            }
        }

        const newRequest = new OrchardModel({
            farmerId: req.body.userId || null, // Optional tie-in if user is logged in
            landDetails: {
                acres: Number(acres),
                location
            },
            waterType,
            goal,
            skillLevel,
            marketPreference,
            images: imageUrls,
            status: 'pending'
        });

        await newRequest.save();

        res.json({ success: true, message: "Expert plan request submitted successfully", data: newRequest });

    } catch (error) {
        console.error("Error creating orchard request:", error);
        res.json({ success: false, message: error.message });
    }
};

// GET /api/orchard/admin-requests
export const getRequests = async (req, res) => {
    try {
        const requests = await OrchardModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.error("Error fetching orchard requests:", error);
        res.json({ success: false, message: error.message });
    }
};

// PUT /api/orchard/assign/:id
export const assignExpert = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedExpert } = req.body;
        
        const request = await OrchardModel.findByIdAndUpdate(id, {
            status: 'assigned',
            assignedExpert
        }, { new: true });

        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }

        res.json({ success: true, message: "Expert assigned successfully", request });
    } catch (error) {
        console.error("Error assigning expert:", error);
        res.json({ success: false, message: error.message });
    }
};
