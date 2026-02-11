import mongoose from 'mongoose';

const fertilizerOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{
        fertilizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'fertilizer', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

const fertilizerOrderModel = mongoose.models.fertilizerOrder || mongoose.model('fertilizerOrder', fertilizerOrderSchema);

export default fertilizerOrderModel;
