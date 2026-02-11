import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'field-officer'], default: 'user' },
    district: { type: String, default: 'Other' },
    crops: { type: [String], default: [] },
    fieldOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
}, { timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel