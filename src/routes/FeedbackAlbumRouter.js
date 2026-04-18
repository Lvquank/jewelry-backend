const express = require('express')
const router = express.Router()
const FeedbackAlbumController = require('../controllers/FeedbackAlbumController')
const { authMiddleWare } = require('../middleware/authMiddleware')

// Public
router.get('/get-all', FeedbackAlbumController.getAllAlbums)
router.get('/detail/:slug', FeedbackAlbumController.getAlbumBySlug)

// Admin
router.get('/admin/get-all', authMiddleWare, FeedbackAlbumController.getAllAlbumsAdmin)
router.post('/create', authMiddleWare, FeedbackAlbumController.createAlbum)
router.put('/update/:id', authMiddleWare, FeedbackAlbumController.updateAlbum)
router.delete('/delete/:id', authMiddleWare, FeedbackAlbumController.deleteAlbum)

module.exports = router
