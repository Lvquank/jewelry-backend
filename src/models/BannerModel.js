const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        image: { type: String, required: true },
        imageMobile: { type: String }, // Ảnh riêng cho mobile
        link: { type: String },        // URL khi click vào banner
        position: {
            type: String,
            enum: ['homepage_hero', 'homepage_sub', 'homepage_flash_sale', 'category_top', 'popup'],
            default: 'homepage_hero'
        },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 }, // Thứ tự hiển thị
        startDate: { type: Date },     // Ngày bắt đầu hiển thị
        endDate: { type: Date },       // Ngày kết thúc hiển thị
    },
    {
        timestamps: true,
    }
)

const Banner = mongoose.model('Banner', bannerSchema)
module.exports = Banner
