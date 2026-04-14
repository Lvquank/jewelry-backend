const app = require('./app');

const port = process.env.PORT || 3001;

// Chỉ listen khi chạy local (không phải serverless)
if (require.main === module) {
    app.listen(port, () => {
        console.log('🚀 Server is running on port:', port);
    });
}

module.exports = app;

