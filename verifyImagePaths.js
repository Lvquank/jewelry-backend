/**
 * Script kiểm tra và hiển thị báo cáo chi tiết về ảnh trong MongoDB
 * Chạy: node verifyImagePaths.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
mongoose.set('strictQuery', false);

const Product = require('./src/models/ProductModel');
const Post = require('./src/models/PostModel');

async function verifyImagePaths() {
    try {
        console.log('🔌 Đang kết nối MongoDB Atlas...');
        await mongoose.connect(process.env.MongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Kết nối thành công!\n');

        // ===== PRODUCTS REPORT =====
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📦 BÁO CÁO SẢN PHẨM (PRODUCTS)');
        console.log('═══════════════════════════════════════════════════════════\n');

        const products = await Product.find({});
        console.log(`Tổng sản phẩm: ${products.length}\n`);

        // Phân loại theo type
        const byType = {};
        products.forEach(p => {
            const type = p.type || 'Unknown';
            if (!byType[type]) byType[type] = [];
            byType[type].push(p);
        });

        console.log('📊 Thống kê theo loại:\n');
        let totalWithImages = 0;
        for (const [type, items] of Object.entries(byType)) {
            const withImg = items.filter(p => p.image && p.image.length > 0).length;
            const withDetail = items.filter(p => p.images && p.images.length > 0).length;
            totalWithImages += withImg;

            console.log(`   🏷️  ${type} (${items.length} sản phẩm)`);
            console.log(`       ├─ Ảnh chính: ${withImg}/${items.length}`);
            console.log(`       ├─ Ảnh chi tiết: ${withDetail}/${withImg}`);

            // Hiển thị ví dụ
            const sample = items[0];
            if (sample.image) {
                console.log(`       └─ VD: ${sample.name.substring(0, 50)}`);
                console.log(`          Main: ${sample.image}`);
                if (sample.images && sample.images.length > 0) {
                    console.log(`          Details: ${sample.images.length} ảnh`);
                    console.log(`          VD: ${sample.images[0]}`);
                }
            }
            console.log('');
        }

        // Kiểm tra loại ảnh
        console.log('\n🔍 Phân loại đường dẫn ảnh:\n');

        const imageStats = {
            localServer: products.filter(p => p.image && p.image.startsWith('/images')).length,
            externalUrl: products.filter(p => p.image && p.image.startsWith('http')).length,
            noImage: products.filter(p => !p.image || p.image === '').length,
            withDetailImages: products.filter(p => p.images && p.images.length > 0).length
        };

        console.log(`   ✅ Ảnh từ server local: ${imageStats.localServer}/${products.length}`);
        console.log(`   ⚠️  Ảnh từ URL external: ${imageStats.externalUrl}/${products.length}`);
        console.log(`   ❌ Không có ảnh: ${imageStats.noImage}/${products.length}`);
        console.log(`   📸 Có ảnh chi tiết: ${imageStats.withDetailImages}/${products.length}`);

        // ===== POSTS REPORT =====
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('📰 BÁO CÁO BÀI VIẾT (POSTS)');
        console.log('═══════════════════════════════════════════════════════════\n');

        const posts = await Post.find({});
        console.log(`Tổng bài viết: ${posts.length}\n`);

        // Phân loại theo type
        const postsByType = {};
        posts.forEach(p => {
            const type = p.type || 'Unknown';
            if (!postsByType[type]) postsByType[type] = [];
            postsByType[type].push(p);
        });

        console.log('📊 Thống kê bài viết:\n');
        for (const [type, items] of Object.entries(postsByType)) {
            const withImg = items.filter(p => p.image && p.image.length > 0).length;
            const withDetail = items.filter(p => p.images && p.images.length > 0).length;

            console.log(`   📌 ${type} (${items.length} bài)`);
            console.log(`       ├─ Ảnh đại diện: ${withImg}/${items.length}`);
            console.log(`       ├─ Ảnh phụ: ${withDetail} bài`);

            // Hiển thị ví dụ
            const sample = items[0];
            if (sample.image) {
                console.log(`       └─ VD: ${sample.title.substring(0, 50)}`);
                console.log(`          Image: ${sample.image}`);
                if (sample.images && sample.images.length > 0) {
                    console.log(`          Detail images: ${sample.images.length} ảnh`);
                }
            }
            console.log('');
        }

        // Kiểm tra loại ảnh bài viết
        console.log('\n🔍 Phân loại ảnh bài viết:\n');

        const postImageStats = {
            localServer: posts.filter(p => p.image && p.image.startsWith('/images')).length,
            externalUrl: posts.filter(p => p.image && p.image.startsWith('http')).length,
            noImage: posts.filter(p => !p.image || p.image === '').length,
            withDetailImages: posts.filter(p => p.images && p.images.length > 0).length
        };

        console.log(`   ✅ Ảnh từ server local: ${postImageStats.localServer}/${posts.length}`);
        console.log(`   ⚠️  Ảnh từ URL external: ${postImageStats.externalUrl}/${posts.length}`);
        console.log(`   ❌ Không có ảnh: ${postImageStats.noImage}/${posts.length}`);
        console.log(`   📸 Có ảnh phụ: ${postImageStats.withDetailImages}/${posts.length}`);

        // ===== SUMMARY =====
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('✨ TÓM TẮT');
        console.log('═══════════════════════════════════════════════════════════\n');

        const totalItems = products.length + posts.length;
        const totalLocalImages = imageStats.localServer + postImageStats.localServer;
        const totalExternalImages = imageStats.externalUrl + postImageStats.externalUrl;
        const totalWithoutImages = imageStats.noImage + postImageStats.noImage;

        console.log(`📦 Tổng cộng ${totalItems} item (${products.length} sản phẩm + ${posts.length} bài viết)`);
        console.log(`✅ ${totalLocalImages} items sử dụng ảnh từ server local (/images/...)`);
        console.log(`⚠️  ${totalExternalImages} items sử dụng URL external (http...)`);
        console.log(`❌ ${totalWithoutImages} items không có ảnh\n`);

        if (totalLocalImages === totalItems) {
            console.log('🎉 HOÀN HẢO! Tất cả ảnh đã được cập nhật thành đường dẫn server local!\n');
        } else if (totalExternalImages > 0) {
            console.log('⚠️  Vẫn còn ảnh external, chạy updateAllImages.js để cập nhật!\n');
        }

        console.log('═══════════════════════════════════════════════════════════\n');

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

verifyImagePaths();
