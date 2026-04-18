const FeedbackAlbum = require('../models/FeedbackAlbumModel')

const getAllAlbums = (page = 0, limit = 20) =>
    new Promise(async (resolve, reject) => {
        try {
            const total = await FeedbackAlbum.countDocuments({ isActive: true })
            const albums = await FeedbackAlbum.find({ isActive: true })
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip(page * limit).limit(limit)
            resolve({ status: 'OK', message: 'Success', data: albums, total, pageCurrent: page + 1, totalPage: Math.ceil(total / limit) })
        } catch (e) { reject(e) }
    })

const getAllAlbumsAdmin = (page = 0, limit = 20) =>
    new Promise(async (resolve, reject) => {
        try {
            const total = await FeedbackAlbum.countDocuments()
            const albums = await FeedbackAlbum.find()
                .sort({ sortOrder: 1, createdAt: -1 })
                .skip(page * limit).limit(limit)
            resolve({ status: 'OK', message: 'Success', data: albums, total, pageCurrent: page + 1, totalPage: Math.ceil(total / limit) })
        } catch (e) { reject(e) }
    })

const getAlbumBySlug = (slug) =>
    new Promise(async (resolve, reject) => {
        try {
            const album = await FeedbackAlbum.findOne({ slug, isActive: true })
            if (!album) return resolve({ status: 'ERR', message: 'Không tìm thấy album' })
            resolve({ status: 'OK', message: 'Success', data: album })
        } catch (e) { reject(e) }
    })

const createAlbum = (data) =>
    new Promise(async (resolve, reject) => {
        try {
            const { title, images } = data
            if (!title || !images || images.length === 0)
                return resolve({ status: 'ERR', message: 'Thiếu title hoặc images' })
            const thumbnail = data.thumbnail || images[0]
            const album = await FeedbackAlbum.create({ ...data, thumbnail })
            resolve({ status: 'OK', message: 'Tạo album thành công', data: album })
        } catch (e) { reject(e) }
    })

const updateAlbum = (id, data) =>
    new Promise(async (resolve, reject) => {
        try {
            const album = await FeedbackAlbum.findByIdAndUpdate(id, data, { new: true })
            if (!album) return resolve({ status: 'ERR', message: 'Không tìm thấy album' })
            resolve({ status: 'OK', message: 'Cập nhật thành công', data: album })
        } catch (e) { reject(e) }
    })

const deleteAlbum = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            const album = await FeedbackAlbum.findByIdAndDelete(id)
            if (!album) return resolve({ status: 'ERR', message: 'Không tìm thấy album' })
            resolve({ status: 'OK', message: 'Xóa album thành công' })
        } catch (e) { reject(e) }
    })

module.exports = { getAllAlbums, getAllAlbumsAdmin, getAlbumBySlug, createAlbum, updateAlbum, deleteAlbum }
