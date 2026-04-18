import { Equipment, EquipmentOrder, EquipmentOrderItem, User } from '../models/index.js';
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

        await Equipment.create({
            name,
            description,
            price: Number(price),
            category,
            stock: Number(stock),
            image: imageUrl,
            specifications: parsedSpecs
        });

        res.json({ success: true, message: "Equipment Added Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List Equipments
export const listEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.findAll({
            order: [['createdAt', 'DESC']]
        });
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

        const equipment = await Equipment.findByPk(id);
        
        if (!equipment) {
            return res.json({ success: false, message: "Equipment not found" });
        }
        
        await equipment.update(updateData);

        res.json({ success: true, message: "Equipment Updated Successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Equipment
export const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        
        const equipment = await Equipment.findByPk(id);
        if (!equipment) {
            return res.json({ success: false, message: "Equipment not found" });
        }
        
        await equipment.destroy();

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

        const newOrder = await EquipmentOrder.create({
            userId,
            totalAmount,
            address,
            status: 'Pending'
        });

        // Insert order items
        const orderItems = items.map(item => ({
            orderId: newOrder.id,
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            price: item.price
        }));

        await EquipmentOrderItem.bulkCreate(orderItems);

        // Update stock
        for (const item of items) {
            const equipment = await Equipment.findByPk(item.equipmentId);

            if (equipment) {
                await equipment.update({ stock: equipment.stock - item.quantity });
            }
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
        const orders = await EquipmentOrder.findAll({
            where: { userId },
            include: [{
                model: EquipmentOrderItem,
                include: [{ model: Equipment }]
            }],
            order: [['createdAt', 'DESC']]
        });

        // Reshape to match original response
        const mapped = orders.map(order => {
            const data = order.toJSON();
            if(data.EquipmentOrderItems) {
                data.items = data.EquipmentOrderItems.map(item => {
                    const itemData = { ...item };
                    itemData.equipmentId = itemData.Equipment;
                    delete itemData.Equipment;
                    return itemData;
                });
                delete data.EquipmentOrderItems;
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
export const getAdminEquipmentOrders = async (req, res) => {
    try {
        const orders = await EquipmentOrder.findAll({
            include: [
                { model: User, attributes: ['name', 'phone'] },
                {
                    model: EquipmentOrderItem,
                    include: [{ model: Equipment }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Reshape to match original response
        const mapped = orders.map(order => {
            const data = order.toJSON();
            data.userId = data.User;
            delete data.User;
            
            if(data.EquipmentOrderItems) {
                data.items = data.EquipmentOrderItems.map(item => {
                    const itemData = { ...item };
                    itemData.equipmentId = itemData.Equipment;
                    delete itemData.Equipment;
                    return itemData;
                });
                delete data.EquipmentOrderItems;
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

// Cancel Order (User)
export const cancelEquipmentOrder = async (req, res) => {
    try {
        const { orderId, userId, reason } = req.body;

        // Find order and verify ownership
        const order = await EquipmentOrder.findOne({
            where: { id: orderId, userId }
        });

        if (!order) {
            return res.json({ success: false, message: "Order not found or unauthorized" });
        }

        if (order.status !== 'Pending') {
            return res.json({ success: false, message: "Only pending orders can be cancelled" });
        }

        await order.update({
            status: 'Cancelled',
            cancellationReason: reason || 'No reason provided'
        });

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
        
        const order = await EquipmentOrder.findByPk(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        await order.update({ status });
        res.json({ success: true, message: "Equipment Order Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
