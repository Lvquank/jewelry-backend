const mongoose = require('mongoose')

/**
 * FeedbackAlbum: Album ảnh feedback từ khách hàng thực tế
 */
const feedbackAlbumSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true },
        description: { type: String, default: '' },
        thumbnail: { type: String, required: true },
        images: [{ type: String }],
        author: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
)

feedbackAlbumSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-').trim()
    }
    next()
})

feedbackAlbumSchema.index({ slug: 1 })
feedbackAlbumSchema.index({ isActive: 1 })

const FeedbackAlbum = mongoose.model('FeedbackAlbum', feedbackAlbumSchema)
module.exports = FeedbackAlbum
