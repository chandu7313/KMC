import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema({
    cropName: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    mandi: { type: String, default: "Local Mandi" },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    modalPrice: { type: Number, required: true },
    change: { type: Number, default: 0 },
    arrivalDate: { type: Date, default: Date.now, index: true },
    variety: { type: String, default: "Standard" },
    source: { type: String, default: "agmarknet" },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for optimized searching
marketPriceSchema.index({ cropName: 1, district: 1, arrivalDate: -1 });

const MarketPrice = mongoose.models.MarketPrice || mongoose.model('MarketPrice', marketPriceSchema);

export default MarketPrice;
