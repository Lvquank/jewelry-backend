const path = require('path')
const fs = require('fs')

/**
 * Upload ảnh từ base64 string
 * Lưu file vào thư mục uploads/
 */
const uploadBase64Image = (base64String, filename) => {
    return new Promise((resolve, reject) => {
        try {
            if (!base64String) {
                return resolve({ status: 'ERR', message: 'Không có dữ liệu ảnh' })
            }
            // Tách header khỏi data
            const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            if (!matches || matches.length !== 3) {
                return resolve({ status: 'ERR', message: 'Định dạng base64 không hợp lệ' })
            }
            const ext = matches[1].split('/')[1]
            const data = Buffer.from(matches[2], 'base64')
            const uploadDir = path.join(__dirname, '../../uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }
            const fileName = filename || `img_${Date.now()}.${ext}`
            const filePath = path.join(uploadDir, fileName)
            fs.writeFileSync(filePath, data)
            resolve({
                status: 'OK',
                message: 'Upload thành công',
                data: {
                    filename: fileName,
                    url: `/uploads/${fileName}`
                }
            })
        } catch (e) { reject(e) }
    })
}

/**
 * Upload nhiều ảnh base64
 */
const uploadMultipleBase64 = async (images) => {
    const results = []
    for (const img of images) {
        const result = await uploadBase64Image(img.data, img.filename)
        results.push(result)
    }
    return { status: 'OK', message: 'Upload thành công', data: results }
}

/**
 * Xóa file ảnh
 */
const deleteImage = (filename) => {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join(__dirname, '../../uploads', filename)
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
            resolve({ status: 'OK', message: 'Xóa ảnh thành công' })
        } catch (e) { reject(e) }
    })
}

module.exports = { uploadBase64Image, uploadMultipleBase64, deleteImage }
