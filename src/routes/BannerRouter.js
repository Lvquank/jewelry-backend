const express = require('express')
const router = express.Router()
const BannerController = require('../controllers/BannerController')
const { authMiddleWare } = require('../middleware/authMiddleware')

// Public routes
router.get('/get-all', BannerController.getAllBanners)
router.get('/get-by-position', BannerController.getBannersByPosition)

// Admin routes
router.post('/create', authMiddleWare, BannerController.createBanner)
router.put('/update/:id', authMiddleWare, BannerController.updateBanner)
router.delete('/delete/:id', authMiddleWare, BannerController.deleteBanner)
router.get('/admin/get-all', authMiddleWare, BannerController.getAllBannersAdmin)

module.exports = router
