const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, category, material, countInStock, price, rating, description, discount } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The name of product is already'
                })
            }
            const newProductResult = await Product.create({
                name, 
                image, 
                type, 
                category: category || type,
                material: material || 'Bạc S925',
                countInStock: Number(countInStock), 
                price, 
                rating, 
                description,
                discount: Number(discount),
            })
            if (newProductResult) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: newProduct
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: id
            })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.count()
            let allProduct = []
            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort).sort({createdAt: -1, updatedAt: -1})
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if(!limit) {
                allProduct = await Product.find().sort({createdAt: -1, updatedAt: -1})
            }else {
                allProduct = await Product.find().limit(limit).skip(page * limit).sort({createdAt: -1, updatedAt: -1})
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allCategory = await Product.distinct('category')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allCategory,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Product.distinct('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const searchProduct = ({ q, category, minPrice, maxPrice, material, sort, page, limit }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const filter = { isActive: true }
            if (q) filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } }
            ]
            if (category) filter.category = { $regex: category, $options: 'i' }
            if (material) filter.material = { $regex: material, $options: 'i' }
            if (minPrice || maxPrice) {
                filter.price = {}
                if (minPrice) filter.price.$gte = Number(minPrice)
                if (maxPrice) filter.price.$lte = Number(maxPrice)
            }
            const sortObj = {}
            if (sort === 'price_asc') sortObj.price = 1
            else if (sort === 'price_desc') sortObj.price = -1
            else if (sort === 'rating') sortObj.rating = -1
            else if (sort === 'selled') sortObj.selled = -1
            else sortObj.createdAt = -1

            const total = await Product.countDocuments(filter)
            const products = await Product.find(filter).sort(sortObj).skip(page * limit).limit(limit)
            resolve({
                status: 'OK', message: 'Success',
                data: products, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            })
        } catch (e) { reject(e) }
    })
}

const getFlashSaleProducts = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date()
            const products = await Product.find({
                isFlashSale: true,
                isActive: true,
                $or: [{ flashSaleEndTime: null }, { flashSaleEndTime: { $gt: now } }]
            }).sort({ createdAt: -1 })
            resolve({ status: 'OK', message: 'Success', data: products })
        } catch (e) { reject(e) }
    })
}

const getNewProducts = (limit = 12) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.find({ isNewArrival: true, isActive: true })
                .sort({ createdAt: -1 }).limit(limit)
            resolve({ status: 'OK', message: 'Success', data: products })
        } catch (e) { reject(e) }
    })
}

const getBestSellerProducts = (limit = 12) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.find({ isActive: true })
                .sort({ selled: -1, isBestSeller: -1 }).limit(limit)
            resolve({ status: 'OK', message: 'Success', data: products })
        } catch (e) { reject(e) }
    })
}

const getProductsByCategory = (categorySlug, page = 0, limit = 20, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sortObj = sort === 'price_asc' ? { price: 1 }
                : sort === 'price_desc' ? { price: -1 }
                    : sort === 'newest' ? { createdAt: -1 }
                        : { selled: -1 }

            // Tìm theo slug hoặc category name
            const filter = {
                isActive: true,
                $or: [
                    { category: { $regex: categorySlug, $options: 'i' } },
                    { type: { $regex: categorySlug, $options: 'i' } }
                ]
            }
            const total = await Product.countDocuments(filter)
            const products = await Product.find(filter).sort(sortObj).skip(page * limit).limit(limit)
            resolve({
                status: 'OK', message: 'Success',
                data: products, total,
                pageCurrent: page + 1,
                totalPage: Math.ceil(total / limit)
            })
        } catch (e) { reject(e) }
    })
}

const getRelatedProducts = (productId, limit = 8) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(productId)
            if (!product) return resolve({ status: 'ERR', message: 'Sản phẩm không tồn tại' })
            const related = await Product.find({
                _id: { $ne: productId },
                isActive: true,
                $or: [
                    { category: product.category },
                    { type: product.type }
                ]
            }).limit(limit).sort({ selled: -1 })
            resolve({ status: 'OK', message: 'Success', data: related })
        } catch (e) { reject(e) }
    })
}

const getProductBySlug = (slug) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({ slug, isActive: true })
            if (!product) return resolve({ status: 'ERR', message: 'Sản phẩm không tồn tại' })
            resolve({ status: 'OK', message: 'Success', data: product })
        } catch (e) { reject(e) }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
    getAllCategory,
    searchProduct,
    getFlashSaleProducts,
    getNewProducts,
    getBestSellerProducts,
    getProductsByCategory,
    getRelatedProducts,
    getProductBySlug
}
