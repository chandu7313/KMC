import mongoose from 'mongoose';

const marketHistorySchema = new mongoose.Schema({
    crop: { type: String, required: true },
    district: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Ensure unique snapshot per crop-district-day
marketHistorySchema.index({ crop: 1, district: 1, date: 1 }, { unique: true });

const MarketHistory = mongoose.models.marketHistory || mongoose.model('marketHistory', marketHistorySchema);

export default MarketHistory;
