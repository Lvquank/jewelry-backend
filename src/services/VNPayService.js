const crypto = require('crypto')
const querystring = require('querystring')
const Order = require('../models/OrderProduct')

const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || ''
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || ''
const VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
const VNPAY_RETURN_URL = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay-return'

/**
 * Tạo URL thanh toán VNPay
 */
const createVNPayUrl = (orderId, amount, orderInfo, ipAddr) => {
    return new Promise((resolve, reject) => {
        try {
            const date = new Date()
            const createDate = date.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)
            const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
                .toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)

            let vnp_Params = {
                vnp_Version: '2.1.0',
                vnp_Command: 'pay',
                vnp_TmnCode: VNPAY_TMN_CODE,
                vnp_Amount: amount * 100, // VNPay tính bằng đồng * 100
                vnp_CreateDate: createDate,
                vnp_CurrCode: 'VND',
                vnp_IpAddr: ipAddr || '127.0.0.1',
                vnp_Locale: 'vn',
                vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
                vnp_OrderType: 'other',
                vnp_ReturnUrl: VNPAY_RETURN_URL,
                vnp_TxnRef: orderId,
                vnp_ExpireDate: expireDate,
            }

            vnp_Params = sortObject(vnp_Params)
            const signData = querystring.stringify(vnp_Params, { encode: false })
            const hmac = crypto.createHmac('sha512', VNPAY_HASH_SECRET)
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
            vnp_Params['vnp_SecureHash'] = signed

            const paymentUrl = `${VNPAY_URL}?${querystring.stringify(vnp_Params, { encode: false })}`
            resolve({ status: 'OK', message: 'Success', data: { paymentUrl } })
        } catch (e) { reject(e) }
    })
}

/**
 * Verify kết quả từ VNPay callback
 */
const verifyVNPayReturn = (vnpParams) => {
    return new Promise((resolve, reject) => {
        try {
            const secureHash = vnpParams['vnp_SecureHash']
            delete vnpParams['vnp_SecureHash']
            delete vnpParams['vnp_SecureHashType']

            const sortedParams = sortObject(vnpParams)
            const signData = querystring.stringify(sortedParams, { encode: false })
            const hmac = crypto.createHmac('sha512', VNPAY_HASH_SECRET)
            const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

            if (secureHash !== signed) {
                return resolve({ status: 'ERR', message: 'Chữ ký không hợp lệ', rspCode: '97' })
            }

            // Kiểm tra mã trả về từ VNPay
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
 * Cập nhật trạng thái thanh toán sau khi verify VNPay
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

const sortObject = (obj) => {
    const sorted = {}
    const keys = Object.keys(obj).sort()
    keys.forEach(key => { sorted[key] = obj[key] })
    return sorted
}

module.exports = { createVNPayUrl, verifyVNPayReturn, updateOrderAfterPayment }
