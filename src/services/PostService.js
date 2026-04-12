const Post = require("../models/PostModel")

const createPost = (newPost) => {
    return new Promise(async (resolve, reject) => {
        const { title, image, content, type, author, slug, summary, images } = newPost
        try {
            const checkPost = await Post.findOne({
                title: title
            })
            if (checkPost !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The title of post is already defined'
                })
            }
            const post = await Post.create({
                title, 
                image, 
                images: images || [],
                content, 
                type, 
                summary: summary || '',
                slug: slug || undefined,
                author: author || 'Jensy Admin'
            })
            if (post) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: post
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updatePost = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPost = await Post.findOne({
                _id: id
            })
            if (checkPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The post is not defined'
                })
            }

            const updatedPost = await Post.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedPost
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deletePost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkPost = await Post.findOne({
                _id: id
            })
            if (checkPost === null) {
                resolve({
                    status: 'ERR',
                    message: 'The post is not defined'
                })
            }

            await Post.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete post success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsPost = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await Post.findOne({
                _id: id
            })
            if (post === null) {
                resolve({
                    status: 'ERR',
                    message: 'The post is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: post
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllPost = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalPost = await Post.countDocuments()
            let allPost = []
            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Post.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalPost,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalPost / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allPostSort = await Post.find().limit(limit).skip(page * limit).sort(objectSort).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allPostSort,
                    total: totalPost,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalPost / limit)
                })
            }
            if(!limit) {
                allPost = await Post.find().sort({createdAt: -1, updatedAt: -1})
            }else {
                allPost = await Post.find().limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allPost,
                total: totalPost,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalPost / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

// Lấy bài viết theo type (Kiểm Định, Feedback, Hướng Dẫn, Tin Tức)
const getPostsByType = (type, limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = { type: type }
            const totalPost = await Post.countDocuments(query)
            let posts = []
            
            if (!limit) {
                posts = await Post.find(query).sort({ createdAt: -1 })
            } else {
                posts = await Post.find(query)
                    .limit(limit)
                    .skip((page || 0) * limit)
                    .sort({ createdAt: -1 })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: posts,
                total: totalPost,
                pageCurrent: Number((page || 0) + 1),
                totalPage: Math.ceil(totalPost / (limit || totalPost || 1))
            })
        } catch (e) {
            reject(e)
        }
    })
}

// Lấy bài viết theo slug
const getPostBySlug = (slug) => {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await Post.findOne({ slug: slug })
            if (post === null) {
                resolve({
                    status: 'ERR',
                    message: 'The post is not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: post
            })
        } catch (e) {
            reject(e)
        }
    })
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
