import { User, MarketplaceOrder, MarketplaceOrderItem, Product } from '../models/index.js';
import razorpay from 'razorpay';
import crypto from 'crypto';
import transporter from '../config/nodemailer.js';
import { ORDER_CONFIRMATION_TEMPLATE } from '../config/emailTemplates.js';

const razorpayInstance = new razorpay({
    key_id: process.env.RAZOR_PAY_API_KEY,
    key_secret: process.env.RAZOR_PAY_SCRET_KEY,
});

// Helper for sending confirmation email
const sendConfirmationEmail = async (userEmail, userName, orderId, addressStr, amount, method) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: userEmail,
            subject: 'Order Confirmation - Kisan Mithar',
            html: ORDER_CONFIRMATION_TEMPLATE
                .replace('{{name}}', userName)
                .replace('{{orderId}}', orderId)
                .replace('{{address}}', addressStr)
                .replace('{{amount}}', amount)
                .replace('{{paymentMethod}}', method)
        };
        await transporter.sendMail(mailOptions);
    } catch (e) {
        console.error("Email sending failed:", e);
    }
}

// Place Order logic (Simplified for COD or Mock Payment)
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        // Insert order
        const savedOrder = await MarketplaceOrder.create({
            userId,
            totalAmount: amount,
            address,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
        });

        // Insert order items
        const orderItems = items.map(item => ({
            orderId: savedOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await MarketplaceOrderItem.bulkCreate(orderItems);

        // Clear cart data
        const user = await User.findByPk(userId);
        if (user) {
            await user.update({ cartData: {} });
            // Send email
            await sendConfirmationEmail(user.email, user.name, savedOrder.id, address, amount, 'Cash on Delivery');
        }

        res.json({ success: true, message: "Order Placed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await MarketplaceOrder.findAll({
            where: { userId },
            include: [{
                model: MarketplaceOrderItem,
                include: [{ model: Product }]
            }],
            order: [['createdAt', 'DESC']]
        });

        // Reshape to match original response shape
        const mapped = orders.map(order => {
            const data = order.toJSON();
            data.items = data.MarketplaceOrderItems.map(item => {
                const itemData = { ...item };
                itemData.productId = itemData.Product;
                delete itemData.Product;
                return itemData;
            });
            delete data.MarketplaceOrderItems;
            return data;
        });

        res.json({ success: true, orders: mapped });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Razorpay: Initiate Order
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        // Insert order
        const newOrder = await MarketplaceOrder.create({
            userId,
            totalAmount: amount,
            address,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Pending',
        });

        // Insert order items
        const orderItems = items.map(item => ({
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await MarketplaceOrderItem.bulkCreate(orderItems);

        const options = {
            amount: amount * 100, // Amount in paise
            currency: process.env.CURRENCY || 'INR',
            receipt: newOrder.id.substring(0, 40) // Razorpay receipt max len is 40
        };

        const rzpOrder = await razorpayInstance.orders.create(options);

        // Save razorpay order id
        await newOrder.update({ razorpayOrderId: rzpOrder.id });

        res.json({ success: true, order: rzpOrder, dbOrderId: newOrder.id });
    } catch (error) {
        console.log("Razorpay Order Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// Razorpay: Verify Payment
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId, userId } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZOR_PAY_SCRET_KEY)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment successful
            const savedOrder = await MarketplaceOrder.findByPk(dbOrderId);
            if (savedOrder) {
                await savedOrder.update({
                    paymentStatus: 'Completed',
                    paymentDetails: { razorpay_payment_id, razorpay_signature }
                });
            }

            // Clear Cart
            const user = await User.findByPk(userId);
            if (user) {
                await user.update({ cartData: {} });
                // Send Confirmation Email
                await sendConfirmationEmail(user.email, user.name, dbOrderId, savedOrder.address, savedOrder.totalAmount, 'Razorpay');
            }

            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.log("Verify Razorpay Error:", error);
        res.json({ success: false, message: error.message });
    }
}

// All Orders for Admin
const allOrders = async (req, res) => {
    try {
        const orders = await MarketplaceOrder.findAll({
            include: [{
                model: MarketplaceOrderItem,
                include: [{ model: Product }]
            }],
            order: [['createdAt', 'DESC']]
        });

        const mapped = orders.map(order => {
            const data = order.toJSON();
            if(data.MarketplaceOrderItems) {
                data.items = data.MarketplaceOrderItems.map(item => {
                    const itemData = { ...item };
                    itemData.productId = itemData.Product;
                    delete itemData.Product;
                    return itemData;
                });
                delete data.MarketplaceOrderItems;
            } else {
                data.items = [];
            }
            return data;
        });

        res.json({ success: true, orders: mapped });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        const order = await MarketplaceOrder.findByPk(orderId);
        if (!order) return res.json({ success: false, message: "Order not found" });

        await order.update({ status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Cancel Order (User)
const cancelOrder = async (req, res) => {
    try {
        const { orderId, userId, reason } = req.body;

        // Verify ownership and status
        const order = await MarketplaceOrder.findOne({
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
        console.log("Cancel Order Error:", error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay, verifyRazorpay, cancelOrder };
