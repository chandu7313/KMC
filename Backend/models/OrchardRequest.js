import mongoose from "mongoose";

const OrchardRequestSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
    landDetails: {
        acres: { type: Number, required: true },
        location: { type: String, required: true }
    },
    waterType: { type: String, enum: ['Borewell', 'Canal / River', 'Rain-fed'], required: true },
    goal: { type: String, required: true },
    skillLevel: { type: String, required: true },
    marketPreference: { type: String, required: true },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
    assignedExpert: { type: String, default: null }
}, { timestamps: true });

const OrchardModel = mongoose.models.orchardRequest || mongoose.model('orchardRequest', OrchardRequestSchema);
export default OrchardModel;
