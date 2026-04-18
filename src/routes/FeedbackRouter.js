const express = require('express')
const router = express.Router()
const FeedbackController = require('../controllers/FeedbackController')
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleware')

// Public routes
router.get('/get-approved', FeedbackController.getApprovedFeedbacks)

// Auth routes (đăng nhập mới được gửi feedback)
router.post('/create', authUserMiddleWare, FeedbackController.createFeedback)

// Admin routes
router.get('/get-all', authMiddleWare, FeedbackController.getAllFeedbacks)
router.put('/approve/:id', authMiddleWare, FeedbackController.approveFeedback)
router.delete('/delete/:id', authMiddleWare, FeedbackController.deleteFeedback)

module.exports = router
