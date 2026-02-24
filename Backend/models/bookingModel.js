import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    village: { type: String, required: true },
    district: { type: String, required: true },
    visitDate: { type: Date, required: true },
    purpose: { type: String, required: true },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema);

export default bookingModel;
