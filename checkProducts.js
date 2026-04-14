/**
 * Script kiểm tra dữ liệu sản phẩm hiện tại trong MongoDB
 * Chạy: node checkProducts.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', false);

const Product = require('./src/models/ProductModel');

async function checkProducts() {
    try {
        console.log('🔌 Đang kết nối MongoDB Atlas...');
        await mongoose.connect(process.env.MongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Kết nối thành công!\n');

        // Lấy tất cả sản phẩm
        const products = await Product.find({});
        console.log(`📦 Tổng sản phẩm: ${products.length}\n`);

        // Thống kê theo loại (type)
        const typeGroups = {};
        const categoryGroups = {};

        products.forEach(p => {
            // Group theo type
            const type = p.type || 'No Type';
            if (!typeGroups[type]) typeGroups[type] = [];
            typeGroups[type].push(p);

            // Group theo category
            const cat = p.category || 'No Category';
            if (!categoryGroups[cat]) categoryGroups[cat] = [];
            categoryGroups[cat].push(p);
        });

        console.log('📊 Thống kê theo Type:');
        Object.entries(typeGroups).forEach(([type, items]) => {
            console.log(`   ${type}: ${items.length} sản phẩm`);
        });

        console.log('\n📊 Thống kê theo Category:');
        Object.entries(categoryGroups).forEach(([cat, items]) => {
            console.log(`   ${cat}: ${items.length} sản phẩm`);
        });

        // Hiển thị một vài sản phẩm mẫu
        console.log('\n📋 Một vài sản phẩm mẫu:');
        products.slice(0, 5).forEach((p, i) => {
            console.log(`\n   ${i + 1}. ${p.name}`);
            console.log(`      Type: ${p.type}`);
            console.log(`      Category: ${p.category}`);
            console.log(`      Image: ${p.image}`);
        });

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

checkProducts();
