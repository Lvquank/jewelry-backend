const express = require("express");
const router = express.Router()
const PostController = require('../controllers/PostController');
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create', authMiddleWare, PostController.createPost)
router.put('/update/:id', authMiddleWare, PostController.updatePost)
router.get('/get-details/:id', PostController.getDetailsPost)
router.delete('/delete/:id', authMiddleWare, PostController.deletePost)
router.get('/get-all', PostController.getAllPost)

// API mới: lấy bài viết theo loại (Kiểm Định, Feedback, Hướng Dẫn, Tin Tức)
router.get('/type/:type', PostController.getPostsByType)

// API mới: lấy bài viết theo slug
router.get('/slug/:slug', PostController.getPostBySlug)

module.exports = router
