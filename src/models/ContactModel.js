const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        subject: { type: String },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['new', 'read', 'replied', 'closed'],
            default: 'new'
        },
        adminNote: { type: String }, // Ghi chú của admin
        repliedAt: { type: Date },
    },
    {
        timestamps: true,
    }
)

const Contact = mongoose.model('Contact', contactSchema)
module.exports = Contact
