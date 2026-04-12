const express = require('express')
const router = express.Router()
const ReviewController = require('../controllers/ReviewController')
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleware')

// Public routes
router.get('/product/:productId', ReviewController.getReviewsByProduct)

// Auth routes (đăng nhập mới được review)
router.post('/create', authUserMiddleWare, ReviewController.createReview)

// Admin routes
router.get('/get-all', authMiddleWare, ReviewController.getAllReviews)
router.put('/approve/:id', authMiddleWare, ReviewController.approveReview)
router.delete('/delete/:id', authMiddleWare, ReviewController.deleteReview)

module.exports = router
