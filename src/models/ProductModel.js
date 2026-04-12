const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({
    size: { type: String },           // vd: 14, 15, 16, Free Size
    packagingType: { type: String },  // vd: Hộp Thường, Hộp Quà, Túi Giấy
    additionalPrice: { type: Number, default: 0 } // giá cộng thêm so với giá gốc
}, { _id: false })

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, unique: true },           // URL-friendly name
        sku: { type: String },                           // Mã sản phẩm
        image: { type: String, required: true },         // Ảnh chính
        images: [{ type: String }],                      // Gallery ảnh
        type: { type: String, required: true },          // vd: Lắc Tay, Dây Chuyền
        category: { type: String },                      // vd: Dây Chuyền Bạc, Cặp Đôi
        material: { type: String, default: 'Bạc S925' }, // vd: Bạc S925, Bạch Kim
        tags: [{ type: String }],                        // vd: ['cặp đôi', 'valentine']
        price: { type: Number, required: true },
        countInStock: { type: Number, required: true, default: 0 },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        description: { type: String },
        discount: { type: Number, default: 0 },          // % giảm giá thường
        selled: { type: Number, default: 0 },            // Số đã bán
        variants: [variantSchema],                       // Biến thể (size, gói quà)
        // Flash Sale
        isFlashSale: { type: Boolean, default: false },
        flashSalePrice: { type: Number },                // Giá flash sale
        flashSaleEndTime: { type: Date },                // Thời gian kết thúc flash sale
        // Flags
        isNewArrival: { type: Boolean, default: false },         // Hàng mới
        isBestSeller: { type: Boolean, default: false },  // Bán chạy
        isActive: { type: Boolean, default: true },       // Hiển thị/ẩn
    },
    {
        timestamps: true,
    }
);

// Tự động tạo slug từ name trước khi lưu
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        const slugify = require('slugify')
        this.slug = slugify(this.name, { lower: true, locale: 'vi', strict: true })
    }
    next()
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
