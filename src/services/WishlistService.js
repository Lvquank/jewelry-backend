const Wishlist = require('../models/WishlistModel')

const getWishlist = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const wishlist = await Wishlist.findOne({ user: userId })
                .populate('products.product', 'name image price discount isFlashSale flashSalePrice rating selled isActive')
            if (!wishlist) {
                return resolve({ status: 'OK', message: 'Success', data: { products: [] } })
            }
            // Lọc bỏ sản phẩm không còn active
            const activeProducts = wishlist.products.filter(p => p.product && p.product.isActive)
            resolve({ status: 'OK', message: 'Success', data: { ...wishlist.toObject(), products: activeProducts } })
        } catch (e) { reject(e) }
    })
}

const toggleWishlist = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let wishlist = await Wishlist.findOne({ user: userId })
            if (!wishlist) {
                wishlist = await Wishlist.create({ user: userId, products: [] })
            }
            const index = wishlist.products.findIndex(p => p.product.toString() === productId)
            let action = ''
            if (index > -1) {
                // Đã có → xóa
                wishlist.products.splice(index, 1)
                action = 'removed'
            } else {
                // Chưa có → thêm
                wishlist.products.push({ product: productId, addedAt: new Date() })
                action = 'added'
            }
            await wishlist.save()
            resolve({ status: 'OK', message: action === 'added' ? 'Đã thêm vào yêu thích' : 'Đã xóa khỏi yêu thích', action, data: wishlist })
        } catch (e) { reject(e) }
    })
}

const clearWishlist = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Wishlist.findOneAndUpdate({ user: userId }, { products: [] })
            resolve({ status: 'OK', message: 'Đã xóa toàn bộ danh sách yêu thích' })
        } catch (e) { reject(e) }
    })
}

module.exports = { getWishlist, toggleWishlist, clearWishlist }
