const BannerService = require('../services/BannerService')

const createBanner = async (req, res) => {
    try {
        const { title, image, position } = req.body
        if (!title || !image) {
            return res.status(200).json({ status: 'ERR', message: 'Tiêu đề và ảnh là bắt buộc' })
        }
        const response = await BannerService.createBanner(req.body)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const updateBanner = async (req, res) => {
    try {
        const { id } = req.params
        const response = await BannerService.updateBanner(id, req.body)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params
        const response = await BannerService.deleteBanner(id)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getAllBanners = async (req, res) => {
    try {
        const response = await BannerService.getAllBanners()
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getBannersByPosition = async (req, res) => {
    try {
        const { position } = req.query
        if (!position) return res.status(200).json({ status: 'ERR', message: 'position là bắt buộc' })
        const response = await BannerService.getBannersByPosition(position)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getAllBannersAdmin = async (req, res) => {
    try {
        const response = await BannerService.getAllBannersAdmin()
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

module.exports = { createBanner, updateBanner, deleteBanner, getAllBanners, getBannersByPosition, getAllBannersAdmin }
