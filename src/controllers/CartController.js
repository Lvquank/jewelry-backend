const CartService = require('../services/CartService')

const getCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) return res.status(200).json({ status: 'ERR', message: 'userId là bắt buộc' })
        const response = await CartService.getCart(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body
        if (!userId || !productId) {
            return res.status(200).json({ status: 'ERR', message: 'userId và productId là bắt buộc' })
        }
        const qty = quantity && quantity > 0 ? parseInt(quantity) : 1
        const response = await CartService.addToCart(userId, productId, qty)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body
        if (!userId || !productId || quantity === undefined) {
            return res.status(200).json({ status: 'ERR', message: 'userId, productId và quantity là bắt buộc' })
        }
        const response = await CartService.updateCartItem(userId, productId, parseInt(quantity))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body
        if (!userId || !productId) {
            return res.status(200).json({ status: 'ERR', message: 'userId và productId là bắt buộc' })
        }
        const response = await CartService.removeFromCart(userId, productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const clearCart = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) return res.status(200).json({ status: 'ERR', message: 'userId là bắt buộc' })
        const response = await CartService.clearCart(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
