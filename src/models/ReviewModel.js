const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: { type: String, required: true },
        userAvatar: { type: String },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: { type: String, required: true },
        images: [{ type: String }], // Ảnh kèm theo review
        isApproved: { type: Boolean, default: false }, // Admin duyệt trước khi hiện
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }, // Đơn hàng liên quan (xác minh đã mua)
    },
    {
        timestamps: true,
    }
)

// Đảm bảo 1 user chỉ review 1 lần cho 1 sản phẩm trong 1 đơn hàng
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true, sparse: true })

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
