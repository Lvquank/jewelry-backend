const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/CategoryController')
const { authMiddleWare } = require('../middleware/authMiddleware')

// Public routes
router.get('/get-all', CategoryController.getAllCategory)
router.get('/get-tree', CategoryController.getCategoryTree)
router.get('/get-by-slug/:slug', CategoryController.getCategoryBySlug)

// Admin routes
router.post('/create', authMiddleWare, CategoryController.createCategory)
router.put('/update/:id', authMiddleWare, CategoryController.updateCategory)
router.delete('/delete/:id', authMiddleWare, CategoryController.deleteCategory)
router.get('/admin/get-all', authMiddleWare, CategoryController.getAllCategoryAdmin)

module.exports = router
