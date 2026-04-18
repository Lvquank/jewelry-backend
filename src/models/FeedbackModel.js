const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: { type: String, required: true },
        userAvatar: { type: String },
        content: { type: String, required: true },
        images: [{ type: String }],   // Mảng ảnh kèm theo (tuỳ chọn, tối đa 5 ảnh)
        isApproved: { type: Boolean, default: false } // Admin duyệt trước khi hiển thị
    },
    {
        timestamps: true,
    }
)

const Feedback = mongoose.model('Feedback', feedbackSchema)
module.exports = Feedback
