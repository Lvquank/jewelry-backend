const Category = require('../models/CategoryModel')
const slugify = require('slugify')

const createCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name, image, parentCategory, description, order } = data
            const check = await Category.findOne({ name })
            if (check) {
                return resolve({ status: 'ERR', message: 'Danh mục đã tồn tại' })
            }
            const slug = slugify(name, { lower: true, locale: 'vi', strict: true })
            const result = await Category.create({ name, slug, image, parentCategory, description, order })
            resolve({ status: 'OK', message: 'Tạo danh mục thành công', data: result })
        } catch (e) { reject(e) }
    })
}

const updateCategory = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.name) {
                data.slug = slugify(data.name, { lower: true, locale: 'vi', strict: true })
            }
            const result = await Category.findByIdAndUpdate(id, data, { new: true })
            if (!result) return resolve({ status: 'ERR', message: 'Không tìm thấy danh mục' })
            resolve({ status: 'OK', message: 'Cập nhật thành công', data: result })
        } catch (e) { reject(e) }
    })
}

const deleteCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await Category.findByIdAndDelete(id)
            if (!result) return resolve({ status: 'ERR', message: 'Không tìm thấy danh mục' })
            resolve({ status: 'OK', message: 'Xóa danh mục thành công' })
        } catch (e) { reject(e) }
    })
}

const getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
            resolve({ status: 'OK', message: 'Success', data: categories })
        } catch (e) { reject(e) }
    })
}

const getAllCategoryAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const categories = await Category.find().sort({ order: 1, createdAt: -1 })
            resolve({ status: 'OK', message: 'Success', data: categories })
        } catch (e) { reject(e) }
    })
}

const getCategoryBySlug = (slug) => {
    return new Promise(async (resolve, reject) => {
        try {
            const category = await Category.findOne({ slug, isActive: true })
            if (!category) return resolve({ status: 'ERR', message: 'Không tìm thấy danh mục' })
            resolve({ status: 'OK', message: 'Success', data: category })
        } catch (e) { reject(e) }
    })
}

// Danh mục dạng cây (cha + con)
const getCategoryTree = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const all = await Category.find({ isActive: true }).sort({ order: 1 })
            const roots = all.filter(c => !c.parentCategory)
            const tree = roots.map(root => ({
                ...root.toObject(),
                children: all.filter(c => c.parentCategory && c.parentCategory.toString() === root._id.toString())
            }))
            resolve({ status: 'OK', message: 'Success', data: tree })
        } catch (e) { reject(e) }
    })
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getAllCategoryAdmin,
    getCategoryBySlug,
    getCategoryTree
}
