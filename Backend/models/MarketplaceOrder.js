import mongoose from 'mongoose';

const marketplaceOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, required: true, default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    razorpayOrderId: { type: String, default: '' },
    paymentDetails: { type: Object, default: {} },
    cancellationReason: { type: String, default: '' }
}, { timestamps: true });

const marketplaceOrderModel = mongoose.models.marketplaceOrder || mongoose.model('marketplaceOrder', marketplaceOrderSchema);

export default marketplaceOrderModel;
