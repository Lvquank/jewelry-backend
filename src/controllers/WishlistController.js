const WishlistService = require('../services/WishlistService')

const getWishlist = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) return res.status(200).json({ status: 'ERR', message: 'userId là bắt buộc' })
        const response = await WishlistService.getWishlist(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body
        if (!userId || !productId) {
            return res.status(200).json({ status: 'ERR', message: 'userId và productId là bắt buộc' })
        }
        const response = await WishlistService.toggleWishlist(userId, productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const clearWishlist = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!userId) return res.status(200).json({ status: 'ERR', message: 'userId là bắt buộc' })
        const response = await WishlistService.clearWishlist(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

module.exports = { getWishlist, toggleWishlist, clearWishlist }
