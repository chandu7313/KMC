import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
    crop: { type: String, required: true },
    variety: { type: String, required: true },
    district: { type: String, required: true },
    unit: { type: String, default: 'Quintal' },
    price: { type: Number, required: true },
    change: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

const MarketPrice = mongoose.models.marketPrice || mongoose.model('marketPrice', marketPriceSchema);

export default MarketPrice;
