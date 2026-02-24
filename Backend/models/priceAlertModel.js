import mongoose from 'mongoose';

const priceAlertSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: { type: String, required: true },
    targetPrice: { type: Number, required: true },
    condition: { type: String, enum: ['Above', 'Below'], required: true },
    status: { type: String, enum: ['Active', 'Triggered'], default: 'Active' },
    lastNotified: { type: Date }
}, { timestamps: true });

const PriceAlert = mongoose.models.priceAlert || mongoose.model('priceAlert', priceAlertSchema);

export default PriceAlert;
