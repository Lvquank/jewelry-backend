const PostService = require('../services/PostService')

const createPost = async (req, res) => {
    try {
        const { title, image, content, type } = req.body
        if (!title || !image || !content || !type) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await PostService.createPost(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        const data = req.body
        if (!postId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The postId is required'
            })
        }
        const response = await PostService.updatePost(postId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsPost = async (req, res) => {
    try {
        const postId = req.params.id
        if (!postId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The postId is required'
            })
        }
        const response = await PostService.getDetailsPost(postId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        if (!postId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The postId is required'
            })
        }
        const response = await PostService.deletePost(postId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPost = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await PostService.getAllPost(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Lấy bài viết theo type (Kiểm Định, Feedback, Hướng Dẫn, Tin Tức)
const getPostsByType = async (req, res) => {
    try {
        const type = decodeURIComponent(req.params.type)
        const { limit, page } = req.query
        
        const validTypes = ['Tin Tức', 'Kiểm Định', 'Hướng Dẫn', 'Feedback']
        if (!validTypes.includes(type)) {
            return res.status(200).json({
                status: 'ERR',
                message: `Invalid type. Must be one of: ${validTypes.join(', ')}`
            })
        }

        const response = await PostService.getPostsByType(type, Number(limit) || null, Number(page) || 0)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Lấy bài viết theo slug
const getPostBySlug = async (req, res) => {
    try {
        const slug = req.params.slug
        if (!slug) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The slug is required'
            })
        }
        const response = await PostService.getPostBySlug(slug)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createPost,
    updatePost,
    getDetailsPost,
    deletePost,
    getAllPost,
    getPostsByType,
    getPostBySlug
}
