const crypto = require('crypto')
const Order = require('../models/OrderProduct')

const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || ''
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || ''
const VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNPAY_RETURN_URL = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay-return'

/**
 * Format date sang gio Viet Nam (UTC+7) -> yyyyMMddHHmmss
 */
const formatDateVN = (date) => {
    const vnOffset = 7 * 60 * 60 * 1000
    const vnDate = new Date(date.getTime() + vnOffset)
    return vnDate.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
}

/**
 * Sap xep object theo key alphabet
 */
const sortObject = (obj) => {
    const sorted = {}
    Object.keys(obj).sort().forEach(key => { sorted[key] = obj[key] })
    return sorted
}

/**
 * Build chuoi sign theo chuan VNPay:
 * Dung querystring.stringify de encode giong PHP urlencode (space -> +, : -> %3A, / -> %2F)
 */
const buildSignData = (params) => {
    const qs = require('querystring')
    return qs.stringify(params)
}

/**
 * Build query string cho URL voi encodeURIComponent
 */
const buildQueryString = (params) => {
    return Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')
}

/**
 * Tinh HMAC-SHA512
 */
const hmacSHA512 = (key, data) => {
    return crypto.createHmac('sha512', key)
        .update(Buffer.from(data, 'utf-8'))
        .digest('hex')
}

/**
 * Tao URL thanh toan VNPay
 */
const createVNPayUrl = (orderId, amount, orderInfo, ipAddr) => {
    return new Promise((resolve, reject) => {
        try {
            const createDate = formatDateVN(new Date())

            // Sanitize orderInfo: chi alphanumeric + dau cach
            const sanitizedOrderInfo = (orderInfo || `Thanh toan don hang ${orderId}`)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .trim()

            // Xay params da sort
            const vnp_Params = sortObject({
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: VNPAY_TMN_CODE,
                vnp_Amount: Math.round(amount) * 100,
                vnp_CreateDate: createDate,
                vnp_CurrCode: 'VND',
                vnp_IpAddr: ipAddr || '127.0.0.1',
                vnp_Locale: 'vn',
                vnp_OrderInfo: sanitizedOrderInfo,
                vnp_OrderType: 'other',
                vnp_ReturnUrl: VNPAY_RETURN_URL,
                vnp_TxnRef: String(orderId),
            })

            // Tinh chu ky (querystring.stringify encode giong PHP urlencode)
            const signData = buildSignData(vnp_Params)
            const secureHash = hmacSHA512(VNPAY_HASH_SECRET, signData)

            // Debug log (xem trong Vercel Function Logs)
            console.log('[VNPay] TmnCode:', VNPAY_TMN_CODE)
            console.log('[VNPay] SecretLen:', VNPAY_HASH_SECRET.length)
            console.log('[VNPay] ReturnUrl:', VNPAY_RETURN_URL)
            console.log('[VNPay] SignData:', signData)
            console.log('[VNPay] Hash:', secureHash)

            // Them hash vao params va build URL
            vnp_Params['vnp_SecureHash'] = secureHash
            const paymentUrl = `${VNPAY_URL}?${buildQueryString(vnp_Params)}`

            resolve({ status: 'OK', message: 'Success', data: { paymentUrl } })
        } catch (e) { reject(e) }
    })
}

/**
 * Verify ket qua VNPay callback
 */
const verifyVNPayReturn = (vnpParams) => {
    return new Promise((resolve, reject) => {
        try {
            const secureHash = vnpParams['vnp_SecureHash']
            const params = { ...vnpParams }
            delete params['vnp_SecureHash']
            delete params['vnp_SecureHashType']

            const sortedParams = sortObject(params)
            const signData = buildSignData(sortedParams)
            const signed = hmacSHA512(VNPAY_HASH_SECRET, signData)

            if (secureHash !== signed) {
                return resolve({ status: 'ERR', message: 'Chu ky khong hop le', rspCode: '97' })
            }

            const responseCode = vnpParams['vnp_ResponseCode']
            const orderId = vnpParams['vnp_TxnRef']
            const amount = parseInt(vnpParams['vnp_Amount']) / 100

            if (responseCode === '00') {
                resolve({
                    status: 'OK',
                    message: 'Thanh toan thanh cong',
                    orderId, amount,
                    transactionNo: vnpParams['vnp_TransactionNo'],
                    bankCode: vnpParams['vnp_BankCode'],
                    rspCode: '00'
                })
            } else {
                resolve({
                    status: 'ERR',
                    message: 'Thanh toan that bai hoac bi huy',
                    orderId, responseCode,
                    rspCode: responseCode
                })
            }
        } catch (e) { reject(e) }
    })
}

/**
 * Cap nhat trang thai don hang sau khi thanh toan VNPay
 */
const updateOrderAfterPayment = async (orderId, isPaid) => {
    try {
        await Order.findByIdAndUpdate(orderId, {
            isPaid,
            paidAt: isPaid ? new Date() : undefined,
            status: isPaid ? 'confirmed' : 'cancelled'
        })
    } catch (e) {
        console.error('updateOrderAfterPayment error:', e)
    }
}

module.exports = { createVNPayUrl, verifyVNPayReturn, updateOrderAfterPayment }
