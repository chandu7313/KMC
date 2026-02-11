import mongoose from 'mongoose';

const fertilizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
}, { timestamps: true });

const fertilizerModel = mongoose.models.fertilizer || mongoose.model('fertilizer', fertilizerSchema);

export default fertilizerModel;
