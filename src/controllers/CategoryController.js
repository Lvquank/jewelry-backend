const CategoryService = require('../services/CategoryService')

const createCategory = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(200).json({ status: 'ERR', message: 'Tên danh mục là bắt buộc' })
        }
        const response = await CategoryService.createCategory(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.status(200).json({ status: 'ERR', message: 'ID là bắt buộc' })
        const response = await CategoryService.updateCategory(id, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.status(200).json({ status: 'ERR', message: 'ID là bắt buộc' })
        const response = await CategoryService.deleteCategory(id)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getAllCategory = async (req, res) => {
    try {
        const response = await CategoryService.getAllCategory()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getAllCategoryAdmin = async (req, res) => {
    try {
        const response = await CategoryService.getAllCategoryAdmin()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        if (!slug) return res.status(200).json({ status: 'ERR', message: 'Slug là bắt buộc' })
        const response = await CategoryService.getCategoryBySlug(slug)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const getCategoryTree = async (req, res) => {
    try {
        const response = await CategoryService.getCategoryTree()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
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
