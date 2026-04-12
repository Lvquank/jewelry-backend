const Review = require('../models/ReviewModel')
const Product = require('../models/ProductModel')

const createReview = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { product, user, userName, userAvatar, rating, comment, images, order } = data
            // Kiểm tra xem user đã review sản phẩm này trong đơn hàng này chưa
            const existing = await Review.findOne({ product, user, order })
            if (existing) {
                return resolve({ status: 'ERR', message: 'Bạn đã đánh giá sản phẩm này rồi' })
            }
            const review = await Review.create({ product, user, userName, userAvatar, rating, comment, images, order })
            // Cập nhật rating trung bình cho sản phẩm
            await updateProductRating(product)
            resolve({ status: 'OK', message: 'Đánh giá thành công', data: review })
        } catch (e) { reject(e) }
    })
}

const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId, isApproved: true })
    if (reviews.length === 0) return
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    await Product.findByIdAndUpdate(productId, {
        rating: Math.round(avg * 10) / 10,
        numReviews: reviews.length
    })
}

const getReviewsByProduct = (productId, page = 0, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await Review.countDocuments({ product: productId, isApproved: true })
            const reviews = await Review.find({ product: productId, isApproved: true })
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
                .populate('user', 'name avatar')
            // Thống kê rating
            const allReviews = await Review.find({ product: productId, isApproved: true })
            const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            allReviews.forEach(r => { stats[r.rating] = (stats[r.rating] || 0) + 1 })
            resolve({
                status: 'OK', message: 'Success',
                data: reviews, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit),
                ratingStats: stats
            })
        } catch (e) { reject(e) }
    })
}

const getAllReviews = (page = 0, limit = 20) => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await Review.countDocuments()
            const reviews = await Review.find()
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
                .populate('product', 'name image')
                .populate('user', 'name email')
            resolve({
                status: 'OK', message: 'Success',
                data: reviews, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            })
        } catch (e) { reject(e) }
    })
}

const approveReview = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const review = await Review.findByIdAndUpdate(id, { isApproved: true }, { new: true })
            if (!review) return resolve({ status: 'ERR', message: 'Không tìm thấy đánh giá' })
            await updateProductRating(review.product)
            resolve({ status: 'OK', message: 'Duyệt đánh giá thành công', data: review })
        } catch (e) { reject(e) }
    })
}

const deleteReview = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const review = await Review.findByIdAndDelete(id)
            if (!review) return resolve({ status: 'ERR', message: 'Không tìm thấy đánh giá' })
            await updateProductRating(review.product)
            resolve({ status: 'OK', message: 'Xóa đánh giá thành công' })
        } catch (e) { reject(e) }
    })
}

module.exports = {
    createReview,
    getReviewsByProduct,
    getAllReviews,
    approveReview,
    deleteReview
}
