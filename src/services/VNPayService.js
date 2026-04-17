const crypto = require('crypto')
const Order = require('../models/OrderProduct')

const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || ''
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || ''
const VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNPAY_RETURN_URL = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay-return'

/**
 * Format date sang giờ Việt Nam (UTC+7) -> yyyyMMddHHmmss
 */
const formatDateVN = (date) => {
    const vnOffset = 7 * 60 * 60 * 1000
    const vnDate = new Date(date.getTime() + vnOffset)
    return vnDate.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
}

/**
 * Sắp xếp object theo key alphabet
 */
const sortObject = (obj) => {
    const sorted = {}
    Object.keys(obj).sort().forEach(key => { sorted[key] = obj[key] })
    return sorted
}

/**
 * Build chuỗi sign: key=value&key=value (KHÔNG encode) theo đúng spec VNPay
 */
const buildSignData = (params) => {
    return Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')
}

/**
 * Build query string cho URL: key=value&key=value (có encode value)
 */
const buildQueryString = (params) => {
    return Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')
}

/**
 * Tính HMAC-SHA512
 */
const hmacSHA512 = (key, data) => {
    return crypto.createHmac('sha512', key)
        .update(Buffer.from(data, 'utf-8'))
        .digest('hex')
}

/**
 * Tạo URL thanh toán VNPay
 */
const createVNPayUrl = (orderId, amount, orderInfo, ipAddr) => {
    return new Promise((resolve, reject) => {
        try {
            const createDate = formatDateVN(new Date())

            // Sanitize orderInfo: chỉ alphanumeric + dấu cách
            const sanitizedOrderInfo = (orderInfo || `Thanh toan don hang ${orderId}`)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-zA-Z0-9 ]/g, '')
                .trim()

            // Xây params đã sort
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

            // Tính chữ ký từ chuỗi KHÔNG encode
            const signData = buildSignData(vnp_Params)
            const secureHash = hmacSHA512(VNPAY_HASH_SECRET, signData)

            // Thêm hash vào params và build URL
            vnp_Params['vnp_SecureHash'] = secureHash
            const paymentUrl = `${VNPAY_URL}?${buildQueryString(vnp_Params)}`

            resolve({ status: 'OK', message: 'Success', data: { paymentUrl } })
        } catch (e) { reject(e) }
    })
}

/**
 * Verify kết quả VNPay callback
 * (Express tự decode req.query nên nhận được raw values)
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
                return resolve({ status: 'ERR', message: 'Chữ ký không hợp lệ', rspCode: '97' })
            }

            const responseCode = vnpParams['vnp_ResponseCode']
            const orderId = vnpParams['vnp_TxnRef']
            const amount = parseInt(vnpParams['vnp_Amount']) / 100

            if (responseCode === '00') {
                resolve({
                    status: 'OK',
                    message: 'Thanh toán thành công',
                    orderId, amount,
                    transactionNo: vnpParams['vnp_TransactionNo'],
                    bankCode: vnpParams['vnp_BankCode'],
                    rspCode: '00'
                })
            } else {
                resolve({
                    status: 'ERR',
                    message: 'Thanh toán thất bại hoặc bị hủy',
                    orderId, responseCode,
                    rspCode: responseCode
                })
            }
        } catch (e) { reject(e) }
    })
}

/**
 * Cập nhật trạng thái đơn hàng sau khi thanh toán VNPay
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
