const express = require('express')
const router = express.Router()
const ShippingService = require('../services/ShippingService')

/**
 * GET /api/address/provinces
 * Lấy danh sách 63 tỉnh/thành phố Việt Nam
 */
router.get('/provinces', async (req, res) => {
    try {
        const response = await ShippingService.getProvinces()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

/**
 * GET /api/address/districts/:provinceCode
 * Lấy danh sách quận/huyện theo mã tỉnh
 */
router.get('/districts/:provinceCode', async (req, res) => {
    try {
        const { provinceCode } = req.params
        if (!provinceCode) {
            return res.status(200).json({ status: 'ERR', message: 'provinceCode là bắt buộc' })
        }
        const response = await ShippingService.getDistricts(provinceCode)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

/**
 * GET /api/address/wards/:districtCode
 * Lấy danh sách phường/xã theo mã quận/huyện
 */
router.get('/wards/:districtCode', async (req, res) => {
    try {
        const { districtCode } = req.params
        if (!districtCode) {
            return res.status(200).json({ status: 'ERR', message: 'districtCode là bắt buộc' })
        }
        const response = await ShippingService.getWards(districtCode)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

/**
 * POST /api/address/shipping-fee
 * Body: { cityName: string, orderAmount: number }
 * Tính phí vận chuyển
 */
router.post('/shipping-fee', async (req, res) => {
    try {
        const { cityName, orderAmount } = req.body
        if (!cityName || orderAmount === undefined) {
            return res.status(200).json({ status: 'ERR', message: 'cityName và orderAmount là bắt buộc' })
        }
        const response = await ShippingService.calculateShippingFee(cityName, Number(orderAmount))
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

module.exports = router
