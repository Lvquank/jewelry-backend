/**
 * Script cập nhật đường dẫn ảnh trong MongoDB Atlas
 * Đọc từ public/images folder và update vào database
 * Chạy: node updateImagePaths.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();
mongoose.set('strictQuery', false);

const Product = require('./src/models/ProductModel');
const Post = require('./src/models/PostModel');

// Hàm quét folder để lấy danh sách file
function getFilesRecursive(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                getFilesRecursive(filePath, fileList);
            } else if (/\.(png|jpg|jpeg|gif|webp)$/i.test(file)) {
                // Lưu relative path từ public/images
                const relativePath = filePath.replace(/\\/g, '/').replace(/.*public\/images/, '/images');
                fileList.push({
                    filename: file,
                    fullPath: relativePath,
                    absolutePath: filePath,
                    directory: path.dirname(filePath).replace(/\\/g, '/')
                });
            }
        });
    } catch (error) {
        console.error(`❌ Lỗi quét folder: ${error.message}`);
    }
    return fileList;
}

async function updateImagePaths() {
    try {
        console.log('🔌 Đang kết nối MongoDB Atlas...');
        await mongoose.connect(process.env.MongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Kết nối thành công!\n');

        const imageFolderPath = path.join(__dirname, 'public/images');
        console.log(`📁 Quét ảnh từ: ${imageFolderPath}\n`);

        // Lấy danh sách tất cả ảnh
        const allImages = getFilesRecursive(imageFolderPath);
        console.log(`✨ Tìm thấy ${allImages.length} ảnh\n`);

        // ===== UPDATE PRODUCTS =====
        console.log('🛍️  BƯỚC 1: Cập nhật Product Images...\n');

        const productImages = allImages.filter(img =>
            img.fullPath.includes('/images/products/')
        );

        console.log(`   Tìm thấy ${productImages.length} ảnh sản phẩm `);

        // Group ảnh theo loại sản phẩm (bông tai, dây chuyền, nhẫn, lắc tay, charm, khác)
        const productsByCategory = {};
        productImages.forEach(img => {
            const match = img.fullPath.match(/\/images\/products\/([^\/]+)\//);
            if (match) {
                const category = match[1];
                if (!productsByCategory[category]) {
                    productsByCategory[category] = [];
                }
                productsByCategory[category].push(img);
            }
        });

        console.log(`   📂 Phân loại theo category: ${Object.keys(productsByCategory).length} loại\n`);

        // Update từng product với ảnh từ folder tương ứng
        for (const [category, images] of Object.entries(productsByCategory)) {
            const products = await Product.find({
                category: { $regex: category, $options: 'i' }
            });

            console.log(`   📸 ${category}: ${images.length} ảnh, ${products.length} sản phẩm`);

            // Gán ảnh chính (nếu chưa có hoặc là URL ngoài)
            for (let i = 0; i < products.length && i < images.length; i++) {
                const product = products[i];
                const mainImg = images[i];

                // Chỉ update nếu ảnh hiện tại là URL ngoài
                if (product.image && product.image.startsWith('http')) {
                    product.image = mainImg.fullPath;
                    await product.save();
                }
            }
        }

        console.log('   ✅ Sản phẩm cập nhật xong!\n');

        // ===== UPDATE ARTICLES =====
        console.log('📰 BƯỚC 2: Cập nhật Post/Article Images...\n');

        const articleImages = allImages.filter(img =>
            img.fullPath.includes('/images/articles/')
        );

        console.log(`   Tìm thấy ${articleImages.length} ảnh bài viết`);

        // Group ảnh theo loại bài viết (kiem-dinh, feedback, huong-dan, news)
        const articlesByType = {};
        articleImages.forEach(img => {
            const match = img.fullPath.match(/\/images\/articles\/([^\/]+)\//);
            if (match) {
                const type = match[1];
                if (!articlesByType[type]) {
                    articlesByType[type] = [];
                }
                articlesByType[type].push(img);
            }
        });

        console.log(`   📂 Phân loại theo type: ${Object.keys(articlesByType).length} loại\n`);

        // Mapping tên folder thành Post type
        const typeMapping = {
            'kiem-dinh': 'Kiểm Định',
            'feedback': 'Feedback',
            'huong-dan': 'Hướng Dẫn',
            'news': 'Tin Tức'
        };

        for (const [folder, images] of Object.entries(articlesByType)) {
            const postType = typeMapping[folder] || folder;
            const posts = await Post.find({ type: postType });

            console.log(`   📸 ${folder} (${postType}): ${images.length} ảnh, ${posts.length} bài viết`);

            // Gán ảnh cho từng bài viết
            for (let i = 0; i < posts.length && i < images.length; i++) {
                const post = posts[i];
                const img = images[i];

                // Update ảnh chính
                if (post.image && post.image.startsWith('/images')) {
                    post.image = img.fullPath;
                    await post.save();
                }
            }
        }

        console.log('   ✅ Bài viết cập nhật xong!\n');

        // ===== STATISTICS =====
        console.log('📊 Thống kê kết quả:\n');
        const updatedProducts = await Product.find({ image: { $regex: '^/images' } });
        const updatedPosts = await Post.find({ image: { $regex: '^/images' } });

        console.log(`   ✅ ${updatedProducts.length} sản phẩm có ảnh từ server`);
        console.log(`   ✅ ${updatedPosts.length} bài viết có ảnh từ server`);
        console.log(`   ⚠️  Tổng ảnh tìm thấy: ${allImages.length}`);

        console.log('\n✨ Cập nhật hoàn thành!');
        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

updateImagePaths();
