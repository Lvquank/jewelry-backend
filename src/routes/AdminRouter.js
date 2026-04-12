const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/AdminController')
const { authMiddleWare } = require('../middleware/authMiddleware')

// Tất cả admin routes đều cần quyền admin
router.get('/dashboard', authMiddleWare, AdminController.getDashboardStats)
router.get('/revenue-chart', authMiddleWare, AdminController.getRevenueChart)
router.get('/top-products', authMiddleWare, AdminController.getTopProducts)
router.get('/recent-orders', authMiddleWare, AdminController.getRecentOrders)
router.get('/order-stats', authMiddleWare, AdminController.getOrderStats)
router.get('/user-stats', authMiddleWare, AdminController.getUserStats)

module.exports = router
