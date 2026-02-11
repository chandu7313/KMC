import successStoryModel from "../models/SuccessStory.js";
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

        const storyData = {
            farmerName,
            district,
            crop,
            beforeYield,
            afterYield,
            description,
            status: status || 'draft',
            image: imageUrl
        };

        const story = new successStoryModel(storyData);
        await story.save();

        res.json({ success: true, message: "Success Story Added" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Stories (Admin)
export const listStories = async (req, res) => {
    try {
        const stories = await successStoryModel.find().sort({ createdAt: -1 });
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

        const updateData = { farmerName, district, crop, beforeYield, afterYield, description, status };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        await successStoryModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Success Story Updated" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Story
export const deleteStory = async (req, res) => {
    try {
        const { id } = req.params;
        await successStoryModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Success Story Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
// List Published Stories (Public)
export const listPublishedStories = async (req, res) => {
    try {
        const stories = await successStoryModel.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json({ success: true, stories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
