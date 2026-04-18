const express = require('express')
const router = express.Router()
const FeedbackController = require('../controllers/FeedbackController')
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleware')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

// Middleware: chỉ cần đăng nhập (không check userId hay isAdmin)
const verifyToken = (req, res, next) => {
    const rawToken = req.headers.authorization
    if (!rawToken) return res.status(401).json({ message: 'No token provided', status: 'ERROR' })
    const token = rawToken.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err) => {
        if (err) return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn', status: 'ERROR' })
        next()
    })
}

// Public routes
router.get('/get-approved', FeedbackController.getApprovedFeedbacks)

// Auth routes (đăng nhập mới được gửi feedback)
router.post('/create', verifyToken, FeedbackController.createFeedback)

// Admin routes
router.get('/get-all', authMiddleWare, FeedbackController.getAllFeedbacks)
router.put('/approve/:id', authMiddleWare, FeedbackController.approveFeedback)
router.delete('/delete/:id', authMiddleWare, FeedbackController.deleteFeedback)

module.exports = router
