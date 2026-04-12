const express = require('express')
const router = express.Router()
const UploadController = require('../controllers/UploadController')
const { authMiddleWare } = require('../middleware/authMiddleware')
const path = require('path')

// Serve uploaded images statically (được mount trong index.js)
// Upload routes - chỉ admin
router.post('/image', authMiddleWare, UploadController.uploadImage)
router.post('/images', authMiddleWare, UploadController.uploadImages)
router.delete('/image', authMiddleWare, UploadController.deleteImage)

module.exports = router
