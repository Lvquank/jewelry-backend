const express = require('express')
const router = express.Router()
const ContactController = require('../controllers/ContactController')
const { authMiddleWare } = require('../middleware/authMiddleware')

// Public route - gửi form liên hệ
router.post('/create', ContactController.createContact)

// Admin routes
router.get('/get-all', authMiddleWare, ContactController.getAllContacts)
router.put('/update-status/:id', authMiddleWare, ContactController.updateContactStatus)
router.delete('/delete/:id', authMiddleWare, ContactController.deleteContact)

module.exports = router
