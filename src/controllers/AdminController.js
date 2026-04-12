const AdminService = require('../services/AdminService')

const getDashboardStats = async (req, res) => {
    try {
        const response = await AdminService.getDashboardStats()
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getRevenueChart = async (req, res) => {
    try {
        const { period = 'month' } = req.query
        const response = await AdminService.getRevenueChart(period)
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getTopProducts = async (req, res) => {
    try {
        const { limit = 10 } = req.query
        const response = await AdminService.getTopProducts(Number(limit))
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getRecentOrders = async (req, res) => {
    try {
        const { limit = 10 } = req.query
        const response = await AdminService.getRecentOrders(Number(limit))
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getOrderStats = async (req, res) => {
    try {
        const response = await AdminService.getOrderStats()
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

const getUserStats = async (req, res) => {
    try {
        const response = await AdminService.getUserStats()
        return res.status(200).json(response)
    } catch (e) { return res.status(500).json({ message: e.message }) }
}

module.exports = {
    getDashboardStats,
    getRevenueChart,
    getTopProducts,
    getRecentOrders,
    getOrderStats,
    getUserStats
}
