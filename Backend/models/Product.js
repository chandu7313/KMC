import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: { type: String, required: true }, // e.g., Fertilizers, Equipments, Seeds
    subCategory: { type: String },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    images: [{ type: String, required: true }],
    stock: { type: Number, default: 0 },
    specifications: { type: Map, of: String },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;
