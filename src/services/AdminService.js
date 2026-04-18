const Order = require('../models/OrderProduct')
const Product = require('../models/ProductModel')
const User = require('../models/UserModel')
const Feedback = require('../models/FeedbackModel')

/**
 * Lấy thống kê tổng quan cho Dashboard Admin
 */
const getDashboardStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date()
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

            // Thống kê đơn hàng
            const [
                totalOrders,
                monthOrders,
                lastMonthOrders,
                pendingOrders,
                totalRevenue,
                monthRevenue,
                totalProducts,
                totalUsers,
                newUsersThisMonth,
                pendingFeedbacks
            ] = await Promise.all([
                Order.countDocuments(),
                Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
                Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
                Order.countDocuments({ status: { $in: ['pending', 'confirmed'] } }),
                Order.aggregate([
                    { $match: { status: 'delivered', isPaid: true } },
                    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
                ]),
                Order.aggregate([
                    { $match: { status: 'delivered', isPaid: true, createdAt: { $gte: startOfMonth } } },
                    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
                ]),
                Product.countDocuments({ isActive: true }),
                User.countDocuments({ isAdmin: false }),
                User.countDocuments({ isAdmin: false, createdAt: { $gte: startOfMonth } }),
                Feedback.countDocuments({ isApproved: false }),
            ])

            resolve({
                status: 'OK',
                message: 'Success',
                data: {
                    orders: {
                        total: totalOrders,
                        thisMonth: monthOrders,
                        lastMonth: lastMonthOrders,
                        pending: pendingOrders,
                        growth: lastMonthOrders > 0
                            ? Math.round((monthOrders - lastMonthOrders) / lastMonthOrders * 100)
                            : 100
                    },
                    revenue: {
                        total: totalRevenue[0]?.total || 0,
                        thisMonth: monthRevenue[0]?.total || 0,
                    },
                    products: { total: totalProducts },
                    users: {
                        total: totalUsers,
                        newThisMonth: newUsersThisMonth
                    },
                    alerts: {
                        pendingFeedbacks
                    }
                }
            })
        } catch (e) { reject(e) }
    })
}

/**
 * Biểu đồ doanh thu theo ngày trong 30 ngày gần đây
 */
const getRevenueChart = (period = 'month') => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date()
            let startDate, groupBy

            if (period === 'week') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            } else if (period === 'year') {
                startDate = new Date(now.getFullYear(), 0, 1)
                groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
            } else {
                // month (default) - 30 ngày
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            }

            const data = await Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        status: 'delivered',
                        isPaid: true
                    }
                },
                {
                    $group: {
                        _id: groupBy,
                        revenue: { $sum: '$totalPrice' },
                        orders: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])

            resolve({ status: 'OK', message: 'Success', data })
        } catch (e) { reject(e) }
    })
}

/**
 * Top sản phẩm bán chạy
 */
const getTopProducts = (limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = await Product.find({ isActive: true })
                .sort({ selled: -1 })
                .limit(limit)
                .select('name image price selled rating category')
            resolve({ status: 'OK', message: 'Success', data: products })
        } catch (e) { reject(e) }
    })
}

/**
 * Đơn hàng gần đây
 */
const getRecentOrders = (limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('user', 'name email')
                .select('totalPrice status paymentMethod shippingAddress createdAt isPaid')
            resolve({ status: 'OK', message: 'Success', data: orders })
        } catch (e) { reject(e) }
    })
}

/**
 * Thống kê đơn hàng theo trạng thái
 */
const getOrderStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const stats = await Order.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
                { $sort: { count: -1 } }
            ])
            resolve({ status: 'OK', message: 'Success', data: stats })
        } catch (e) { reject(e) }
    })
}

/**
 * Thống kê người dùng
 */
const getUserStats = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date()
            const months = []
            for (let i = 5; i >= 0; i--) {
                const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
                const count = await User.countDocuments({
                    isAdmin: false,
                    createdAt: { $gte: start, $lte: end }
                })
                months.push({
                    month: `${start.getMonth() + 1}/${start.getFullYear()}`,
                    newUsers: count
                })
            }
            resolve({ status: 'OK', message: 'Success', data: months })
        } catch (e) { reject(e) }
    })
}

module.exports = {
    getDashboardStats,
    getRevenueChart,
    getTopProducts,
    getRecentOrders,
    getOrderStats,
    getUserStats
}
