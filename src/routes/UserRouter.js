const express = require("express");
const router = express.Router()
const UserController = require('../controllers/UserController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

// Auth routes
router.post('/sign-up', UserController.createUser)
router.post('/sign-in', UserController.loginUser)
router.post('/sign-out', UserController.logoutUser)
router.post('/refresh-token', UserController.refreshToken)
router.post('/google-login', UserController.googleLogin)   // Đăng nhập Google

// User profile routes
router.get('/get-details/:id', authUserMiddleWare, UserController.getDetailsUser)
router.put('/update-user/:id', authUserMiddleWare, UserController.updateUser)

// Admin routes
router.get('/get-all', authMiddleWare, UserController.getAllUser)
router.delete('/delete-user/:id', authMiddleWare, UserController.deleteUser)
router.post('/delete-many', authMiddleWare, UserController.deleteMany)

module.exports = router