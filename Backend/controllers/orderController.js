import marketplaceOrderModel from "../models/MarketplaceOrder.js";
import userModel from "../models/userModel.js";
import productModel from "../models/Product.js";
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

        const orderData = {
            userId,
            items,
            totalAmount: amount,
            address,
            paymentMethod: paymentMethod || 'COD',
            paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
        };

        const newOrder = new marketplaceOrderModel(orderData);
        const savedOrder = await newOrder.save();

        // Clear cart data
        const user = await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Send email (assuming address string contains the full address parts)
        await sendConfirmationEmail(user.email, user.name, savedOrder._id.toString(), address, amount, 'Cash on Delivery');

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
        const orders = await marketplaceOrderModel.find({ userId }).populate('items.productId');
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Razorpay: Initiate Order
const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            totalAmount: amount,
            address,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Pending',
        };

        const newOrder = new marketplaceOrderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // Amount in paise
            currency: process.env.CURRENCY || 'INR',
            receipt: newOrder._id.toString()
        };

        const rzpOrder = await razorpayInstance.orders.create(options);

        // Save razorpay order id
        await marketplaceOrderModel.findByIdAndUpdate(newOrder._id, { razorpayOrderId: rzpOrder.id });

        res.json({ success: true, order: rzpOrder, dbOrderId: newOrder._id });
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
            const savedOrder = await marketplaceOrderModel.findByIdAndUpdate(dbOrderId, {
                paymentStatus: 'Completed',
                paymentDetails: { razorpay_payment_id, razorpay_signature }
            });

            // Clear Cart
            const user = await userModel.findByIdAndUpdate(userId, { cartData: {} });

            // Send Confirmation Email
            await sendConfirmationEmail(user.email, user.name, dbOrderId, savedOrder.address, savedOrder.totalAmount, 'Razorpay');

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
        const orders = await marketplaceOrderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status (Admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await marketplaceOrderModel.findByIdAndUpdate(orderId, { status });
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
        const order = await marketplaceOrderModel.findOne({ _id: orderId, userId });
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
        console.log("Cancel Order Error:", error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, userOrders, allOrders, updateStatus, placeOrderRazorpay, verifyRazorpay, cancelOrder };
