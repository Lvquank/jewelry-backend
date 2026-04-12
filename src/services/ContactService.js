const Contact = require('../models/ContactModel')

const createContact = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, email, phone, subject, message } = data
            if (!name || !email || !message) {
                return resolve({ status: 'ERR', message: 'Vui lòng điền đầy đủ thông tin' })
            }
            const contact = await Contact.create({ name, email, phone, subject, message })
            resolve({ status: 'OK', message: 'Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!', data: contact })
        } catch (e) { reject(e) }
    })
}

const getAllContacts = (page = 0, limit = 20, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const filter = status ? { status } : {}
            const total = await Contact.countDocuments(filter)
            const contacts = await Contact.find(filter)
                .sort({ createdAt: -1 })
                .skip(page * limit)
                .limit(limit)
            resolve({
                status: 'OK', message: 'Success',
                data: contacts, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            })
        } catch (e) { reject(e) }
    })
}

const updateContactStatus = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updateData = { status: data.status }
            if (data.adminNote) updateData.adminNote = data.adminNote
            if (data.status === 'replied') updateData.repliedAt = new Date()
            const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true })
            if (!contact) return resolve({ status: 'ERR', message: 'Không tìm thấy liên hệ' })
            resolve({ status: 'OK', message: 'Cập nhật thành công', data: contact })
        } catch (e) { reject(e) }
    })
}

const deleteContact = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Contact.findByIdAndDelete(id)
            resolve({ status: 'OK', message: 'Xóa thành công' })
        } catch (e) { reject(e) }
    })
}

module.exports = { createContact, getAllContacts, updateContactStatus, deleteContact }
