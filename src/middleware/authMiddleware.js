const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleWare = (req, res, next) => {
    const rawToken = req.headers.authorization;
    if (!rawToken) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        })
    }
    const token = rawToken.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập',
                status: 'ERROR'
            })
        }
    });
}

const authUserMiddleWare = (req, res, next) => {
    const rawToken = req.headers.authorization;
    if (!rawToken) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        })
    }
    const token = rawToken.split(' ')[1]
    
    // 🔥 Cập nhật: lấy userId từ params, hoặc body, hoặc query
    const userId = req.params.userId ?? req.params.id ?? req.body.userId ?? req.query.userId;
    
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'Token không hợp lệ hoặc đã hết hạn',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            next()
        } else {
            return res.status(403).json({
                message: 'Bạn không có quyền truy cập',
                status: 'ERROR'
            })
        }
    });
}

module.exports = {
    authMiddleWare,
    authUserMiddleWare
}