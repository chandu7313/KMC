import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    package: { type: String, required: true },
    visitDate: { type: Date, required: true },
    assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema);

export default bookingModel;
