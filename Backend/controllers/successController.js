import { SuccessStory } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';

// Add Success Story
export const addSuccessStory = async (req, res) => {
    try {
        const { farmerName, district, crop, beforeYield, afterYield, description, status } = req.body;
        const imageFile = req.file;

        let imageUrl = "";
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        await SuccessStory.create({
            farmerName,
            district,
            crop,
            beforeYield,
            afterYield,
            description,
            status: status || 'draft',
            image: imageUrl
        });

        res.json({ success: true, message: "Success Story Added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Stories (Admin)
export const listStories = async (req, res) => {
    try {
        const stories = await SuccessStory.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.json({ success: true, stories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Story
export const updateStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { farmerName, district, crop, beforeYield, afterYield, description, status } = req.body;
        const imageFile = req.file;

        const updateData = {
            farmerName,
            district,
            crop,
            beforeYield,
            afterYield,
            description,
            status
        };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        const story = await SuccessStory.findByPk(id);

        if (!story) {
            return res.json({ success: false, message: "Success Story not found" });
        }

        await story.update(updateData);

        res.json({ success: true, message: "Success Story Updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Story
export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const story = await SuccessStory.findByPk(id);
        
        if (!story) {
            return res.json({ success: false, message: "Success Story not found" });
        }
        
        await story.destroy();

        res.json({ success: true, message: "Success Story Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Published Stories (Public)
export const listPublishedStories = async (req, res) => {
    try {
        const stories = await SuccessStory.findAll({
            where: { status: 'published' },
            order: [['createdAt', 'DESC']]
        });
        
        res.json({ success: true, stories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
