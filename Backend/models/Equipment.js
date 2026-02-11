import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Tillage, Harvesting, Spraying
    stock: { type: Number, default: 0 },
    specifications: { type: Map, of: String }, // Flexible key-value pairs for technical specs
}, { timestamps: true });

const equipmentModel = mongoose.models.equipment || mongoose.model('equipment', equipmentSchema);

export default equipmentModel;
