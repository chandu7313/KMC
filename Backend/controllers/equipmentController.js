import equipmentModel from "../models/Equipment.js";
import equipmentOrderModel from "../models/EquipmentOrder.js";
import { v2 as cloudinary } from 'cloudinary';

// Add Equipment
export const addEquipment = async (req, res) => {
    try {
        const { name, description, price, category, stock, specifications } = req.body;
        const imageFile = req.file;

        if (!imageFile) return res.json({ success: false, message: "Image is required" });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        let parsedSpecs = {};
        if (specifications) {
            try {
                parsedSpecs = JSON.parse(specifications);
                if (typeof parsedSpecs !== 'object' || parsedSpecs === null) {
                    parsedSpecs = {};
                }
            } catch (e) {
                parsedSpecs = {};
            }
        }

        const equipmentData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            image: imageUrl,
            specifications: parsedSpecs
        };

        const equipment = new equipmentModel(equipmentData);
        await equipment.save();

        res.json({ success: true, message: "Equipment Added Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Equipments
export const listEquipments = async (req, res) => {
    try {
        const equipments = await equipmentModel.find().sort({ createdAt: -1 });
        res.json({ success: true, equipments });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Equipment
export const updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, specifications } = req.body;
        const imageFile = req.file;

        const updateData = {
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
        };

        if (specifications) {
            try {
                const parsedSpecs = JSON.parse(specifications);
                if (typeof parsedSpecs === 'object' && parsedSpecs !== null) {
                    updateData.specifications = parsedSpecs;
                } else {
                    updateData.specifications = {};
                }
            } catch (e) {
                updateData.specifications = {};
            }
        }

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        await equipmentModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Equipment Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Equipment
export const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        await equipmentModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Equipment Deleted Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- Order Management ---

// Place Order
export const placeEquipmentOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount, address } = req.body;

        const orderData = {
            userId,
            items,
            totalAmount,
            address,
            status: 'Pending'
        };

        const newOrder = new equipmentOrderModel(orderData);
        await newOrder.save();

        // Update stock
        for (const item of items) {
            await equipmentModel.findByIdAndUpdate(item.equipmentId, { $inc: { stock: -item.quantity } });
        }

        res.json({ success: true, message: "Equipment Order Placed Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get User Orders
export const getUserEquipmentOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await equipmentOrderModel.find({ userId }).populate('items.equipmentId').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Admin Orders
export const getAdminEquipmentOrders = async (req, res) => {
    try {
        const orders = await equipmentOrderModel.find().populate('userId', 'name phone').populate('items.equipmentId').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Cancel Order (User)
export const cancelEquipmentOrder = async (req, res) => {
    try {
        const { orderId, userId, reason } = req.body;

        // Find order and verify ownership
        const order = await equipmentOrderModel.findOne({ _id: orderId, userId });

        if (!order) {
            return res.json({ success: false, message: "Order not found or unauthorized" });
        }

        if (order.status !== 'Pending') {
            return res.json({ success: false, message: "Only pending orders can be cancelled" });
        }

        order.status = 'Cancelled';
        order.cancellationReason = reason || 'No reason provided';
        await order.save();

        res.json({ success: true, message: "Order Cancelled Successfully" });
    } catch (error) {
        console.log("Cancel Equipment Order Error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status
export const updateEquipmentOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await equipmentOrderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Equipment Order Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
