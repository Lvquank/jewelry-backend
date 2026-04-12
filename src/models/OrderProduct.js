const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        ward: { type: String },       // Phường/Xã
        district: { type: String },   // Quận/Huyện
        city: { type: String, required: true }, // Tỉnh/Thành phố
        phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true }, // COD | VNPay | PayPal
    deliveryType: {
        type: String,
        enum: ['delivery', 'pickup'],
        default: 'delivery'
    }, // delivery: giao tận nơi, pickup: nhận tại cửa hàng
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 }, // Số tiền được giảm
    totalPrice: { type: Number, required: true },
    note: { type: String },           // Ghi chú của khách
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Trạng thái đơn hàng
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order