import fertilizerModel from "../models/Fertilizer.js";
import fertilizerOrderModel from "../models/FertilizerOrder.js";
import { v2 as cloudinary } from 'cloudinary';

// Add Fertilizer
export const addFertilizer = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const imageFile = req.file;

        if (!imageFile) return res.json({ success: false, message: "Image is required" });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const fertilizerData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            image: imageUrl
        };

        const fertilizer = new fertilizerModel(fertilizerData);
        await fertilizer.save();

        res.json({ success: true, message: "Fertilizer Added Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Fertilizers
export const listFertilizers = async (req, res) => {
    try {
        const fertilizers = await fertilizerModel.find().sort({ createdAt: -1 });
        res.json({ success: true, fertilizers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Fertilizer
export const updateFertilizer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;
        const imageFile = req.file;

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
        };

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        await fertilizerModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Fertilizer Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Fertilizer
export const deleteFertilizer = async (req, res) => {
    try {
        const { id } = req.params;
        await fertilizerModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Fertilizer Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- Order Management ---

// Place Order
export const placeOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, address } = req.body;

        const orderData = {
            userId,
            items,
            totalAmount,
            address,
            status: 'Pending'
        };

        const newOrder = new fertilizerOrderModel(orderData);
        await newOrder.save();

        // Update stock
        for (const item of items) {
            await fertilizerModel.findByIdAndUpdate(item.fertilizerId, { $inc: { stock: -item.quantity } });
        }

        res.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await fertilizerOrderModel.find({ userId }).populate('items.fertilizerId').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Admin Orders
export const getAdminOrders = async (req, res) => {
    try {
        const orders = await fertilizerOrderModel.find().populate('userId', 'name phone').populate('items.fertilizerId').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await fertilizerOrderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
