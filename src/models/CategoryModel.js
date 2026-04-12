const mongoose = require('mongoose')
const slugify = require('slugify')

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, unique: true },
        image: { type: String },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null
        },
        description: { type: String },
        order: { type: Number, default: 0 }, // Thứ tự hiển thị
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
)

categorySchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = slugify(this.name, { lower: true, locale: 'vi', strict: true })
    }
    next()
})

const Category = mongoose.model('Category', categorySchema)
module.exports = Category
