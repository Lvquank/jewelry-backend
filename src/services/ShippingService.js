const axios = require('axios')

// Cache tỉnh thành để không gọi API nhiều lần
let provincesCache = null
let districtsCache = {}
let wardsCache = {}

const BASE_URL = 'https://provinces.open-api.vn/api'

/**
 * Lấy danh sách 63 tỉnh/thành phố
 */
const getProvinces = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (provincesCache) {
                return resolve({ status: 'OK', message: 'Success', data: provincesCache })
            }
            const response = await axios.get(`${BASE_URL}/p/`)
            provincesCache = response.data.map(p => ({
                code: p.code,
                name: p.name,
                division_type: p.division_type
            }))
            resolve({ status: 'OK', message: 'Success', data: provincesCache })
        } catch (e) { reject(e) }
    })
}

/**
 * Lấy danh sách quận/huyện theo tỉnh
 */
const getDistricts = (provinceCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (districtsCache[provinceCode]) {
                return resolve({ status: 'OK', message: 'Success', data: districtsCache[provinceCode] })
            }
            const response = await axios.get(`${BASE_URL}/p/${provinceCode}?depth=2`)
            const districts = response.data.districts.map(d => ({
                code: d.code,
                name: d.name,
                division_type: d.division_type
            }))
            districtsCache[provinceCode] = districts
            resolve({ status: 'OK', message: 'Success', data: districts })
        } catch (e) { reject(e) }
    })
}

/**
 * Lấy danh sách phường/xã theo quận/huyện
 */
const getWards = (districtCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (wardsCache[districtCode]) {
                return resolve({ status: 'OK', message: 'Success', data: wardsCache[districtCode] })
            }
            const response = await axios.get(`${BASE_URL}/d/${districtCode}?depth=2`)
            const wards = response.data.wards.map(w => ({
                code: w.code,
                name: w.name,
                division_type: w.division_type
            }))
            wardsCache[districtCode] = wards
            resolve({ status: 'OK', message: 'Success', data: wards })
        } catch (e) { reject(e) }
    })
}

/**
 * Tính phí vận chuyển
 * - Nội thành HCM/HN: 20.000đ
 * - Tỉnh thành khác: 35.000đ
 * - Miễn phí ship đơn >= 500.000đ
 */
const calculateShippingFee = (cityName, orderAmount) => {
    return new Promise((resolve, reject) => {
        try {
            const FREE_SHIP_THRESHOLD = 500000
            if (orderAmount >= FREE_SHIP_THRESHOLD) {
                return resolve({ status: 'OK', message: 'Success', data: { fee: 0, reason: 'Miễn phí vận chuyển cho đơn từ 500.000đ' } })
            }
            const CITY_FEE_AREAS = [
                'Hồ Chí Minh', 'TP. Hồ Chí Minh', 'TP.HCM', 'Hà Nội'
            ]
            const isCity = CITY_FEE_AREAS.some(area =>
                cityName && cityName.toLowerCase().includes(area.toLowerCase().replace('tp. ', '').replace('tp.', ''))
            )
            const fee = isCity ? 20000 : 35000
            resolve({
                status: 'OK', message: 'Success',
                data: { fee, reason: isCity ? 'Phí giao hàng nội thành' : 'Phí giao hàng ngoại tỉnh' }
            })
        } catch (e) { reject(e) }
    })
}

module.exports = { getProvinces, getDistricts, getWards, calculateShippingFee }
