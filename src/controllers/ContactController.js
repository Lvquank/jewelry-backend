const ContactService = require('../services/ContactService')

const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body
        if (!name || !email || !message) {
            return res.status(200).json({ status: 'ERR', message: 'Vui lòng điền đầy đủ họ tên, email và nội dung' })
        }
        const response = await ContactService.createContact(req.body)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getAllContacts = async (req, res) => {
    try {
        const { page = 0, limit = 20, status } = req.query
        const response = await ContactService.getAllContacts(Number(page), Number(limit), status)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params
        const response = await ContactService.updateContactStatus(id, req.body)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params
        const response = await ContactService.deleteContact(id)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

module.exports = { createContact, getAllContacts, updateContactStatus, deleteContact }
