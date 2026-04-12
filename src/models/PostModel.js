const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, unique: true }, // URL thân thiện
        image: { type: String, required: true }, // Ảnh đại diện
        images: [{ type: String }], // Ảnh phụ trong bài viết
        summary: { type: String }, // Mô tả ngắn
        content: { type: String, required: true },
        type: { type: String, required: true, enum: ['Tin Tức', 'Kiểm Định', 'Hướng Dẫn', 'Feedback'] },
        author: { type: String, default: 'Jensy Admin' },
    },
    {
        timestamps: true,
    }
);

// Tự động tạo slug từ title nếu chưa có
postSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    next();
});

// Index cho tìm kiếm nhanh theo type và slug
postSchema.index({ type: 1 });
postSchema.index({ slug: 1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
