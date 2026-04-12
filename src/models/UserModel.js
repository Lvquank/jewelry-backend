const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    ward: { type: String },
    district: { type: String },
    city: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, { _id: true })

const userSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String },        // optional nếu đăng nhập Google
        isAdmin: { type: Boolean, default: false, required: true },
        phone: { type: String },
        address: { type: String },         // địa chỉ đơn giản (backward compat)
        avatar: { type: String },
        city: { type: String },
        // Google OAuth
        googleId: { type: String, sparse: true },
        provider: { type: String, default: 'local' }, // 'local' | 'google'
        // Nhiều địa chỉ giao hàng
        addresses: [addressSchema],
        // Điểm tích lũy
        loyaltyPoints: { type: Number, default: 0 },
        // Wishlist
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
    },
    {
        timestamps: true
    }
);
const User = mongoose.model("User", userSchema);
module.exports = User;