const FeedbackService = require('../services/FeedbackService')

const createFeedback = async (req, res) => {
    try {
        const { content } = req.body
        if (!content) {
            return res.status(200).json({ status: 'ERR', message: 'Nội dung feedback là bắt buộc' })
        }
        // Hỗ trợ cả 2 format: images (mảng) và image (đơn) — ưu tiên images[]
        let images = req.body.images
        if (!images || images.length === 0) {
            images = req.body.image ? [req.body.image] : []
        }
        if (images.length > 5) {
            return res.status(200).json({ status: 'ERR', message: 'Tối đa 5 ảnh mỗi feedback' })
        }
        const data = {
            ...req.body,
            user: req.body.userId,
            images
        }
        const response = await FeedbackService.createFeedback(data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getApprovedFeedbacks = async (req, res) => {
    try {
        const { page = 0, limit = 10 } = req.query
        const response = await FeedbackService.getApprovedFeedbacks(Number(page), Number(limit))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getAllFeedbacks = async (req, res) => {
    try {
        const { page = 0, limit = 20 } = req.query
        const response = await FeedbackService.getAllFeedbacks(Number(page), Number(limit))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const approveFeedback = async (req, res) => {
    try {
        const { id } = req.params
        const response = await FeedbackService.approveFeedback(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params
        const response = await FeedbackService.deleteFeedback(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = { createFeedback, getApprovedFeedbacks, getAllFeedbacks, approveFeedback, deleteFeedback }
