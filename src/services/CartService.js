const Cart = require('../models/CartModel')

// Lấy giỏ hàng của user
const getCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ user: userId })
                .populate('items.product', 'name images price discount isFlashSale flashSalePrice rating selled isActive countInStock')
            if (!cart) {
                return resolve({ status: 'OK', message: 'Success', data: { items: [], totalPrice: 0 } })
            }
            // Lọc bỏ sản phẩm không còn active
            const activeItems = cart.items.filter(item => item.product && item.product.isActive)
            // Tính tổng tiền
            const totalPrice = activeItems.reduce((sum, item) => {
                const price = item.product.isFlashSale && item.product.flashSalePrice
                    ? item.product.flashSalePrice
                    : item.product.price * (1 - (item.product.discount || 0) / 100)
                return sum + price * item.quantity
            }, 0)
            resolve({
                status: 'OK',
                message: 'Success',
                data: { ...cart.toObject(), items: activeItems, totalPrice }
            })
        } catch (e) { reject(e) }
    })
}

// Thêm sản phẩm vào giỏ hàng
const addToCart = (userId, productId, quantity = 1) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cart = await Cart.findOne({ user: userId })
            if (!cart) {
                cart = await Cart.create({ user: userId, items: [] })
            }
            const index = cart.items.findIndex(item => item.product.toString() === productId)
            if (index > -1) {
                // Đã có → cộng thêm số lượng
                cart.items[index].quantity += quantity
            } else {
                // Chưa có → thêm mới
                cart.items.push({ product: productId, quantity, addedAt: new Date() })
            }
            await cart.save()
            resolve({ status: 'OK', message: 'Đã thêm vào giỏ hàng', data: cart })
        } catch (e) { reject(e) }
    })
}

// Cập nhật số lượng sản phẩm
const updateCartItem = (userId, productId, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ user: userId })
            if (!cart) {
                return resolve({ status: 'ERR', message: 'Giỏ hàng không tồn tại' })
            }
            const index = cart.items.findIndex(item => item.product.toString() === productId)
            if (index === -1) {
                return resolve({ status: 'ERR', message: 'Sản phẩm không có trong giỏ hàng' })
            }
            if (quantity <= 0) {
                // Nếu số lượng <= 0 thì xóa sản phẩm khỏi giỏ
                cart.items.splice(index, 1)
            } else {
                cart.items[index].quantity = quantity
            }
            await cart.save()
            resolve({ status: 'OK', message: 'Đã cập nhật giỏ hàng', data: cart })
        } catch (e) { reject(e) }
    })
}

// Xóa một sản phẩm khỏi giỏ hàng
const removeFromCart = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ user: userId })
            if (!cart) {
                return resolve({ status: 'ERR', message: 'Giỏ hàng không tồn tại' })
            }
            const index = cart.items.findIndex(item => item.product.toString() === productId)
            if (index === -1) {
                return resolve({ status: 'ERR', message: 'Sản phẩm không có trong giỏ hàng' })
            }
            cart.items.splice(index, 1)
            await cart.save()
            resolve({ status: 'OK', message: 'Đã xóa sản phẩm khỏi giỏ hàng', data: cart })
        } catch (e) { reject(e) }
    })
}

// Xóa toàn bộ giỏ hàng
const clearCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Cart.findOneAndUpdate({ user: userId }, { items: [] })
            resolve({ status: 'OK', message: 'Đã xóa toàn bộ giỏ hàng' })
        } catch (e) { reject(e) }
    })
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
