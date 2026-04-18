import { Fertilizer, FertilizerOrder, FertilizerOrderItem, User } from '../models/index.js';
import { v2 as cloudinary } from 'cloudinary';

// Add Fertilizer
export const addFertilizer = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const imageFile = req.file;

        if (!imageFile) return res.json({ success: false, message: "Image is required" });

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        await Fertilizer.create({
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            image: imageUrl
        });

        res.json({ success: true, message: "Fertilizer Added Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Fertilizers
export const listFertilizers = async (req, res) => {
    try {
        const fertilizers = await Fertilizer.findAll({
            order: [['createdAt', 'DESC']]
        });
        
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

        const fertilizer = await Fertilizer.findByPk(id);

        if (!fertilizer) {
            return res.json({ success: false, message: "Fertilizer not found" });
        }

        await fertilizer.update(updateData);

        res.json({ success: true, message: "Fertilizer Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Fertilizer
export const deleteFertilizer = async (req, res) => {
    try {
        const { id } = req.params;
        
        const fertilizer = await Fertilizer.findByPk(id);
        if (!fertilizer) {
            return res.json({ success: false, message: "Fertilizer not found" });
        }

        await fertilizer.destroy();
        
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

        const newOrder = await FertilizerOrder.create({
            userId,
            totalAmount,
            address,
            status: 'Pending'
        });

        // Insert order items
        const orderItems = items.map(item => ({
            orderId: newOrder.id,
            fertilizerId: item.fertilizerId,
            quantity: item.quantity,
            price: item.price
        }));

        await FertilizerOrderItem.bulkCreate(orderItems);

        // Update stock
        for (const item of items) {
            const fertilizer = await Fertilizer.findByPk(item.fertilizerId);

            if (fertilizer) {
                await fertilizer.update({ stock: fertilizer.stock - item.quantity });
            }
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
        const orders = await FertilizerOrder.findAll({
            where: { userId },
            include: [{
                model: FertilizerOrderItem,
                include: [{ model: Fertilizer }]
            }],
            order: [['createdAt', 'DESC']]
        });

        // Reshape to match original response
        const mapped = orders.map(order => {
            const data = order.toJSON();
            if(data.FertilizerOrderItems) {
                data.items = data.FertilizerOrderItems.map(item => {
                    const itemData = { ...item };
                    itemData.fertilizerId = itemData.Fertilizer;
                    delete itemData.Fertilizer;
                    return itemData;
                });
                delete data.FertilizerOrderItems;
            } else {
                data.items = [];
            }
            return data;
        });

        res.json({ success: true, orders: mapped });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Admin Orders
export const getAdminOrders = async (req, res) => {
    try {
        const orders = await FertilizerOrder.findAll({
            include: [
                { model: User, attributes: ['name', 'phone'] },
                {
                    model: FertilizerOrderItem,
                    include: [{ model: Fertilizer }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Reshape to match original response
        const mapped = orders.map(order => {
            const data = order.toJSON();
            data.userId = data.User;
            delete data.User;

            if(data.FertilizerOrderItems) {
                data.items = data.FertilizerOrderItems.map(item => {
                    const itemData = { ...item };
                    itemData.fertilizerId = itemData.Fertilizer;
                    delete itemData.Fertilizer;
                    return itemData;
                });
                delete data.FertilizerOrderItems;
            } else {
                data.items = [];
            }
            return data;
        });

        res.json({ success: true, orders: mapped });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        const order = await FertilizerOrder.findByPk(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        await order.update({ status });

        res.json({ success: true, message: "Order Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
