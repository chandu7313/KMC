import mongoose from 'mongoose';

const soilReportSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    ph: { type: Number, default: null },
    nitrogen: { type: Number, default: null },
    phosphorus: { type: Number, default: null },
    potassium: { type: Number, default: null },
    organicMatter: { type: Number, default: null },
    micronutrients: {
        type: Map,
        of: Number,
        default: {}
    },
    recommendedFertilizer: { type: String, default: null },
    suitableCrops: [{ type: String }],
    soilStatus: {
        type: String,
        enum: ['Good', 'Moderate', 'Critical', 'Acidic', 'Neutral', 'Alkaline', null],
        default: null
    },
    suitabilityPct: { type: Number, default: null },
    reportFile: { type: String, default: null }, // URL or path
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }, // Keeping this for workflow
    nextTestDate: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('SoilReport', soilReportSchema);
