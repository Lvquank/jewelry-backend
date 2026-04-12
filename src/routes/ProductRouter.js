const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require("../middleware/authMiddleware");

// Public routes
router.get('/get-all', ProductController.getAllProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.get('/get-all-type', ProductController.getAllType)
router.get('/get-all-category', ProductController.getAllCategory)
router.get('/search', ProductController.searchProduct)
router.get('/get-flash-sale', ProductController.getFlashSaleProducts)
router.get('/get-new', ProductController.getNewProducts)
router.get('/get-bestseller', ProductController.getBestSellerProducts)
router.get('/get-by-category/:slug', ProductController.getProductsByCategory)
router.get('/get-related/:id', ProductController.getRelatedProducts)
router.get('/get-by-slug/:slug', ProductController.getProductBySlug)

// Admin routes
router.post('/create', authMiddleWare, ProductController.createProduct)
router.put('/update/:id', authMiddleWare, ProductController.updateProduct)
router.delete('/delete/:id', authMiddleWare, ProductController.deleteProduct)
router.post('/delete-many', authMiddleWare, ProductController.deleteMany)

module.exports = router
