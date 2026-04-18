const FeedbackAlbumService = require('../services/FeedbackAlbumService')

const getAllAlbums = async (req, res) => {
    try {
        const { page = 0, limit = 20 } = req.query
        return res.status(200).json(await FeedbackAlbumService.getAllAlbums(Number(page), Number(limit)))
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getAllAlbumsAdmin = async (req, res) => {
    try {
        const { page = 0, limit = 20 } = req.query
        return res.status(200).json(await FeedbackAlbumService.getAllAlbumsAdmin(Number(page), Number(limit)))
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getAlbumBySlug = async (req, res) => {
    try {
        return res.status(200).json(await FeedbackAlbumService.getAlbumBySlug(req.params.slug))
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const createAlbum = async (req, res) => {
    try {
        return res.status(200).json(await FeedbackAlbumService.createAlbum(req.body))
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const updateAlbum = async (req, res) => {
    try {
        return res.status(200).json(await FeedbackAlbumService.updateAlbum(req.params.id, req.body))
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const deleteAlbum = async (req, res) => {
    try {
        return res.status(200).json(await FeedbackAlbumService.deleteAlbum(req.params.id))
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

module.exports = { getAllAlbums, getAllAlbumsAdmin, getAlbumBySlug, createAlbum, updateAlbum, deleteAlbum }
