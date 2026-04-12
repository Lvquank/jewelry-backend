const express = require("express");
const router = express.Router()
const dotenv = require('dotenv')
const VNPayService = require('../services/VNPayService')
const { authUserMiddleWare } = require('../middleware/authMiddleware')
dotenv.config()

// PayPal config
router.get('/config', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        data: process.env.CLIENT_ID
    })
})

/**
 * POST /api/payment/vnpay/create-url
 * Body: { orderId, amount, orderInfo }
 * Tạo URL thanh toán VNPay
 */
router.post('/vnpay/create-url', authUserMiddleWare, async (req, res) => {
    try {
        const { orderId, amount, orderInfo } = req.body
        if (!orderId || !amount) {
            return res.status(200).json({ status: 'ERR', message: 'orderId và amount là bắt buộc' })
        }
        const ipAddr = req.headers['x-forwarded-for']
            || req.connection.remoteAddress
            || req.socket.remoteAddress
            || '127.0.0.1'
        const response = await VNPayService.createVNPayUrl(orderId, amount, orderInfo, ipAddr)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

/**
 * GET /api/payment/vnpay/callback
 * VNPay redirect sau khi thanh toán
 */
router.get('/vnpay/callback', async (req, res) => {
    try {
        const vnpParams = { ...req.query }
        const result = await VNPayService.verifyVNPayReturn(vnpParams)
        if (result.status === 'OK') {
            await VNPayService.updateOrderAfterPayment(result.orderId, true)
            return res.redirect(`${process.env.FRONTEND_URL}/order-success?orderId=${result.orderId}`)
        } else {
            return res.redirect(`${process.env.FRONTEND_URL}/order-failed?orderId=${result.orderId}`)
        }
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

/**
 * POST /api/payment/vnpay/ipn
 * VNPay IPN (Instant Payment Notification) webhook
 */
router.post('/vnpay/ipn', async (req, res) => {
    try {
        const vnpParams = { ...req.query }
        const result = await VNPayService.verifyVNPayReturn(vnpParams)
        if (result.status === 'OK' && result.rspCode === '00') {
            await VNPayService.updateOrderAfterPayment(result.orderId, true)
            return res.status(200).json({ RspCode: '00', Message: 'Success' })
        }
        return res.status(200).json({ RspCode: result.rspCode || '99', Message: 'Error' })
    } catch (e) {
        return res.status(200).json({ RspCode: '99', Message: e.message })
    }
})

module.exports = router