const UploadService = require('../services/UploadService')

const uploadImage = async (req, res) => {
    try {
        const { image, filename } = req.body
        if (!image) {
            return res.status(200).json({ status: 'ERR', message: 'Không có dữ liệu ảnh' })
        }
        const response = await UploadService.uploadBase64Image(image, filename)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const uploadImages = async (req, res) => {
    try {
        const { images } = req.body
        if (!images || !Array.isArray(images) || images.length === 0) {
            return res.status(200).json({ status: 'ERR', message: 'Không có dữ liệu ảnh' })
        }
        const response = await UploadService.uploadMultipleBase64(images)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const deleteImage = async (req, res) => {
    try {
        const { filename } = req.body
        if (!filename) return res.status(200).json({ status: 'ERR', message: 'filename là bắt buộc' })
        const response = await UploadService.deleteImage(filename)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

module.exports = { uploadImage, uploadImages, deleteImage }
