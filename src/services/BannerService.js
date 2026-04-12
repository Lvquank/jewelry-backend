const Banner = require('../models/BannerModel')

const createBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const banner = await Banner.create(data)
            resolve({ status: 'OK', message: 'Tạo banner thành công', data: banner })
        } catch (e) { reject(e) }
    })
}

const updateBanner = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const banner = await Banner.findByIdAndUpdate(id, data, { new: true })
            if (!banner) return resolve({ status: 'ERR', message: 'Không tìm thấy banner' })
            resolve({ status: 'OK', message: 'Cập nhật banner thành công', data: banner })
        } catch (e) { reject(e) }
    })
}

const deleteBanner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const banner = await Banner.findByIdAndDelete(id)
            if (!banner) return resolve({ status: 'ERR', message: 'Không tìm thấy banner' })
            resolve({ status: 'OK', message: 'Xóa banner thành công' })
        } catch (e) { reject(e) }
    })
}

const getAllBanners = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date()
            const banners = await Banner.find({
                isActive: true,
                $or: [
                    { startDate: null }, { startDate: { $lte: now } }
                ],
                $or: [
                    { endDate: null }, { endDate: { $gte: now } }
                ]
            }).sort({ order: 1, createdAt: -1 })
            resolve({ status: 'OK', message: 'Success', data: banners })
        } catch (e) { reject(e) }
    })
}

const getBannersByPosition = (position) => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date()
            const banners = await Banner.find({
                position,
                isActive: true
            }).sort({ order: 1 })
            resolve({ status: 'OK', message: 'Success', data: banners })
        } catch (e) { reject(e) }
    })
}

const getAllBannersAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const banners = await Banner.find().sort({ order: 1, createdAt: -1 })
            resolve({ status: 'OK', message: 'Success', data: banners })
        } catch (e) { reject(e) }
    })
}

module.exports = { createBanner, updateBanner, deleteBanner, getAllBanners, getBannersByPosition, getAllBannersAdmin }
