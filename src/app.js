const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('../routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();
mongoose.set('strictQuery', false);

const app = express();

// Cấu hình CORS
app.use(cors());

// Cấu hình middleware của express
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Serve static files (ảnh upload)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Serve static files (ảnh bài viết, banner, sản phẩm)
app.use('/images', express.static(path.join(__dirname, '../public/images')))

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Định tuyến
routes(app);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        status: 'ERR',
        message: err.message || 'Internal Server Error'
    });
});

// Kết nối MongoDB (chỉ một lần)
let dbConnected = false;

if (!dbConnected && process.env.MongoDB) {
    mongoose.connect(process.env.MongoDB, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
        .then(() => {
            console.log('✅ MongoDB connected');
            dbConnected = true;
        })
        .catch((err) => {
            console.error('❌ MongoDB connection error:', err.message);
        });
}

module.exports = app;
