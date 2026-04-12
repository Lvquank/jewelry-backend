const express = require('express')
const router = express.Router()
const WishlistController = require('../controllers/WishlistController')
const { authUserMiddleWare } = require('../middleware/authMiddleware')

router.get('/:userId', authUserMiddleWare, WishlistController.getWishlist)
router.post('/toggle', authUserMiddleWare, WishlistController.toggleWishlist)
router.delete('/clear/:userId', authUserMiddleWare, WishlistController.clearWishlist)

module.exports = router
