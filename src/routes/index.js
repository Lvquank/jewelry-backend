const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const PostRouter = require('./PostRouter')
const CategoryRouter = require('./CategoryRouter')
const FeedbackRouter = require('./FeedbackRouter')
const FeedbackAlbumRouter = require('./FeedbackAlbumRouter')
const WishlistRouter = require('./WishlistRouter')
const BannerRouter = require('./BannerRouter')
const UploadRouter = require('./UploadRouter')
const AddressRouter = require('./AddressRouter')
const AdminRouter = require('./AdminRouter')
const CartRouter = require('./CartRouter')

const routes = (app) => {
    // Existing routes
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/post', PostRouter)

    // New routes
    app.use('/api/category', CategoryRouter)
    app.use('/api/feedback', FeedbackRouter)
    app.use('/api/feedback-album', FeedbackAlbumRouter)
    app.use('/api/wishlist', WishlistRouter)
    app.use('/api/banner', BannerRouter)
    app.use('/api/upload', UploadRouter)
    app.use('/api/address', AddressRouter)
    app.use('/api/admin', AdminRouter)
    app.use('/api/cart', CartRouter)
}

module.exports = routes