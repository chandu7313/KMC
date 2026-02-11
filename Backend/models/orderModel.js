import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    package: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Active' }
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)

export default orderModel
