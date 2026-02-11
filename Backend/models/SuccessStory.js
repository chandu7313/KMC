import mongoose from 'mongoose';

const successStorySchema = new mongoose.Schema({
    farmerName: { type: String },
    district: { type: String, index: true },
    crop: { type: String, index: true },
    beforeYield: { type: Number },
    afterYield: { type: Number },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

const successStoryModel = mongoose.models.successStory || mongoose.model('successStory', successStorySchema);

export default successStoryModel;
