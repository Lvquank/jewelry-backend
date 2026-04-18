const Feedback = require('../models/FeedbackModel')

// Tạo feedback mới
const createFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { user, userName, userAvatar, content, images } = data
            if (!user || !userName || !content) {
                return resolve({ status: 'ERR', message: 'Thiếu thông tin bắt buộc' })
            }
            const feedback = await Feedback.create({ user, userName, userAvatar, content, images: images || [] })
            resolve({ status: 'OK', message: 'Gửi feedback thành công, đang chờ duyệt', data: feedback })
        } catch (e) { reject(e) }
    })
}

// Lấy tất cả feedback đã được duyệt (public)
const getApprovedFeedbacks = (page = 0, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await Feedback.countDocuments({ isApproved: true })
            const feedbacks = await Feedback.find({ isApproved: true })
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
                .populate('user', 'name avatar')
            resolve({
                status: 'OK', message: 'Success',
                data: feedbacks, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            })
        } catch (e) { reject(e) }
    })
}

// Lấy tất cả feedback (admin)
const getAllFeedbacks = (page = 0, limit = 20) => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await Feedback.countDocuments()
            const feedbacks = await Feedback.find()
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
                .populate('user', 'name email avatar')
            resolve({
                status: 'OK', message: 'Success',
                data: feedbacks, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            })
        } catch (e) { reject(e) }
    })
}

// Duyệt feedback (admin)
const approveFeedback = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const feedback = await Feedback.findByIdAndUpdate(id, { isApproved: true }, { new: true })
            if (!feedback) return resolve({ status: 'ERR', message: 'Không tìm thấy feedback' })
            resolve({ status: 'OK', message: 'Duyệt feedback thành công', data: feedback })
        } catch (e) { reject(e) }
    })
}

// Xóa feedback (admin)
const deleteFeedback = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const feedback = await Feedback.findByIdAndDelete(id)
            if (!feedback) return resolve({ status: 'ERR', message: 'Không tìm thấy feedback' })
            resolve({ status: 'OK', message: 'Xóa feedback thành công' })
        } catch (e) { reject(e) }
    })
}

module.exports = { createFeedback, getApprovedFeedbacks, getAllFeedbacks, approveFeedback, deleteFeedback }
