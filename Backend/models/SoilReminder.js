import mongoose from 'mongoose';

const soilReminderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    report: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilReport', required: true },
    reminderDate: { type: Date, required: true },
    isSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('SoilReminder', soilReminderSchema);
