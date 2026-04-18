const express = require('express')
const router = express.Router()
const CartController = require('../controllers/CartController')
const { authUserMiddleWare } = require('../middleware/authMiddleware')

router.get('/:userId', authUserMiddleWare, CartController.getCart)
router.post('/add', authUserMiddleWare, CartController.addToCart)
router.put('/update', authUserMiddleWare, CartController.updateCartItem)
router.delete('/remove', authUserMiddleWare, CartController.removeFromCart)
router.delete('/clear/:userId', authUserMiddleWare, CartController.clearCart)

module.exports = router
