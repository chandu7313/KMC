import mongoose from 'mongoose';

const equipmentOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{
        equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'equipment', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

const equipmentOrderModel = mongoose.models.equipmentOrder || mongoose.model('equipmentOrder', equipmentOrderSchema);

export default equipmentOrderModel;
