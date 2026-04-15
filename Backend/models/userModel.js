import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for mobile-only users, but required for email users
    phone: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls if unique is true
    otp: { type: String, default: '' },
    otpExpireAt: { type: Number, default: 0 },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'field-officer'], default: 'user' },
    district: { type: String, default: 'Other' },
    crops: { type: [String], default: [] },
    fieldOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    language: { type: String, default: 'en' },
    preferredLanguage: { type: String, default: 'en' },
    hasCompletedTour: { type: Boolean, default: false },
    simpleMode: { type: Boolean, default: false },
    cartData: { type: Object, default: {} },
    hasCompletedSurvey: { type: Boolean, default: false },
    surveyData: {
        language: { type: String },
        farmName: { type: String },
        farmSize: { type: Number },
        farmSizeUnit: { type: String, default: 'acres' },
        landOwnership: { type: String },
        soilType: { type: String },
        waterSource: { type: String },
        primaryCrops: [{ type: String }],
        farmingExperience: { type: String },
    },
    addresses: [{
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    }]
}, { timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel