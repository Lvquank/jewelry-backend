const ReviewService = require('../services/ReviewService')

const createReview = async (req, res) => {
    try {
        const { product, rating, comment } = req.body
        if (!product || !rating || !comment) {
            return res.status(200).json({ status: 'ERR', message: 'Vui lòng điền đầy đủ thông tin đánh giá' })
        }
        // Lấy thông tin user từ token
        const userId = req.user?.id
        if (!userId) return res.status(401).json({ status: 'ERR', message: 'Bạn cần đăng nhập để đánh giá' })

        const data = { ...req.body, user: userId }
        const response = await ReviewService.createReview(data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params
        const { page = 0, limit = 10 } = req.query
        const response = await ReviewService.getReviewsByProduct(productId, Number(page), Number(limit))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getAllReviews = async (req, res) => {
    try {
        const { page = 0, limit = 20 } = req.query
        const response = await ReviewService.getAllReviews(Number(page), Number(limit))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const approveReview = async (req, res) => {
    try {
        const { id } = req.params
        const response = await ReviewService.approveReview(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params
        const response = await ReviewService.deleteReview(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = { createReview, getReviewsByProduct, getAllReviews, approveReview, deleteReview }
