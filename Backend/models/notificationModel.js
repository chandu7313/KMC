import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetType: { type: String, enum: ['All', 'District', 'Crop'], required: true },
    targetValue: { type: String, default: 'Global' },
    recipientCount: { type: Number, default: 0 },
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    sentAt: { type: Date, default: Date.now }
}, { timestamps: true });

const notificationModel = mongoose.models.notification || mongoose.model('notification', notificationSchema);

export default notificationModel;
