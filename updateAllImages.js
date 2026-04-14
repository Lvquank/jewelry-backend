/**
 * Script cập nhật đầy đủ tất cả ảnh sản phẩm và bài viết từ public/images folder
 * - Kiểm tra và xác thực các đường dẫn ảnh
 * - Update sản phẩm có URL external thành local paths
 * - Gán ảnh detail từ public/images/products_details
 * Chạy: node updateAllImages.js
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

async function updateAllImages() {
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
        console.log(`✨ Tìm thấy ${allImages.length} ảnh tổng cộng\n`);

        // ===== BƯỚC 1: UPDATE PRODUCT MAIN IMAGES =====
        console.log('🛍️  BƯỚC 1: Cập nhật ảnh chính sản phẩm...\n');

        const products = await Product.find({});
        let productsUpdated = 0;

        for (const product of products) {
            // Nếu ảnh là URL external, tìm ảnh tương ứng từ folder
            if (product.image && product.image.startsWith('http')) {
                // Lấy từ khóa tìm kiếm từ tên sản phẩm
                const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');

                // Tìm ảnh từ folder products_details phù hợp
                let foundImage = null;

                // Tìm theo type/category folder
                const typeFolder = product.type
                    .toLowerCase()
                    .replace(/bông tai/i, 'bong-tai')
                    .replace(/dây chuyền/i, 'day-chuyen')
                    .replace(/nhẫn/i, 'nhan')
                    .replace(/lắc tay/i, 'lac-vong-tay')
                    .replace(/charm/i, 'charm')
                    .replace(/set/i, 'khac')
                    .replace(/cặp đôi/i, 'khac')
                    .replace(/bạc/gi, '')
                    .trim();

                const matchingImages = allImages.filter(img =>
                    img.fullPath.includes('/images/products_details/') &&
                    img.fullPath.includes(`/${typeFolder}/`) &&
                    !img.fullPath.includes('_')  // Skip files with underscore (gallery images)
                );

                if (matchingImages.length > 0) {
                    foundImage = matchingImages[0];
                } else {
                    // Thử tìm từ folder products thay vì products_details
                    const productsImages = allImages.filter(img =>
                        img.fullPath.includes('/images/products/') &&
                        !img.fullPath.includes('/images/products_details/')
                    );

                    const categoryFolder = product.category
                        .toLowerCase()
                        .replace(/bông tai/i, 'bong-tai')
                        .replace(/dây chuyền/i, 'day-chuyen')
                        .replace(/nhẫn/i, 'nhan')
                        .replace(/lắc tay/i, 'lac-vong-tay')
                        .replace(/charm/i, 'charm')
                        .replace(/cặp đôi/i, 'khac')
                        .replace(/bạc/gi, '')
                        .trim();

                    const categoryMatches = productsImages.filter(img =>
                        img.fullPath.includes(`/${categoryFolder}/`)
                    );

                    if (categoryMatches.length > 0) {
                        foundImage = categoryMatches[0];
                    }
                }

                if (foundImage) {
                    product.image = foundImage.fullPath;
                    await product.save();
                    productsUpdated++;
                    console.log(`   ✅ ${product.name.substring(0, 50)}... → ${foundImage.fullPath}`);
                }
            } else if (!product.image || product.image === '' || product.image === null) {
                // Nếu không có ảnh, tìm ảnh từ folder
                const typeFolder = (product.type || '').toLowerCase()
                    .replace(/bông tai/i, 'bong-tai')
                    .replace(/dây chuyền/i, 'day-chuyen')
                    .replace(/nhẫn/i, 'nhan')
                    .replace(/lắc tay/i, 'lac-vong-tay')
                    .replace(/charm/i, 'charm')
                    .replace(/bạc/gi, '')
                    .trim();

                const defaultImages = allImages.filter(img =>
                    img.fullPath.includes('/images/products/') &&
                    img.fullPath.includes(`/${typeFolder}/`)
                );

                if (defaultImages.length > 0) {
                    product.image = defaultImages[0].fullPath;
                    await product.save();
                    productsUpdated++;
                }
            }
        }

        console.log(`\n   Cập nhật ${productsUpdated} sản phẩm\n`);

        // ===== BƯỚC 2: UPDATE PRODUCT DETAIL IMAGES =====
        console.log('🖼️  BƯỚC 2: Cập nhật ảnh chi tiết sản phẩm...\n');

        const detailImages = allImages.filter(img =>
            img.fullPath.includes('/images/products_details/')
        );

        console.log(`   Tìm thấy ${detailImages.length} ảnh chi tiết sản phẩm`);

        // Group ảnh theo SKU/Product name
        const imagesByFolder = {};
        detailImages.forEach(img => {
            // Lấy tên folder cuối cùng (chứa SKU hoặc product name)
            const parts = img.directory.split('/');
            const folderName = parts[parts.length - 1];
            if (!imagesByFolder[folderName]) {
                imagesByFolder[folderName] = [];
            }
            imagesByFolder[folderName].push(img.fullPath);
        });

        let detailsUpdated = 0;
        for (const [folderName, images] of Object.entries(imagesByFolder)) {
            // Tìm sản phẩm có SKU hoặc slug khớp với folderName
            const product = await Product.findOne({
                $or: [
                    { sku: { $regex: folderName, $options: 'i' } },
                    { slug: { $regex: folderName, $options: 'i' } },
                    { name: { $regex: folderName, $options: 'i' } }
                ]
            });

            if (product && images.length > 0) {
                // Nếu chưa có ảnh chi tiết hoặc ảnh là URL, update
                if (!product.images || product.images.length === 0 ||
                    product.images.some(img => img.startsWith('http'))) {
                    product.images = images;
                    await product.save();
                    detailsUpdated++;
                    console.log(`   ✅ ${product.name.substring(0, 40)}... → ${images.length} ảnh chi tiết`);
                }
            }
        }

        console.log(`\n   Cập nhật ${detailsUpdated} sản phẩm với ảnh chi tiết\n`);

        // ===== BƯỚC 3: VERIFY ARTICLES =====
        console.log('📰 BƯỚC 3: Xác thực ảnh bài viết...\n');

        const posts = await Post.find({});
        let articlesVerified = 0;

        for (const post of posts) {
            if (post.image && post.image.startsWith('/images/articles')) {
                articlesVerified++;
            }
        }

        console.log(`   ✅ ${articlesVerified}/${posts.length} bài viết có ảnh server-side\n`);

        // ===== STATISTICS =====
        console.log('📊 KẾT QUẢ CUỐI CÙNG:\n');

        const stats = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    withLocalImage: {
                        $sum: { $cond: [{ $regexMatch: { input: '$image', regex: '^/images' } }, 1, 0] }
                    },
                    withExternalImage: {
                        $sum: { $cond: [{ $regexMatch: { input: '$image', regex: '^http' } }, 1, 0] }
                    },
                    withNoImage: {
                        $sum: { $cond: [{ $eq: ['$image', null] }, 1, 0] }
                    },
                    withDetailImages: {
                        $sum: { $cond: [{ $gt: [{ $size: '$images' }, 0] }, 1, 0] }
                    }
                }
            }
        ]);

        if (stats[0]) {
            const s = stats[0];
            console.log(`   ✅ Sản phẩm có ảnh local: ${s.withLocalImage}`);
            console.log(`   ⚠️  Sản phẩm có ảnh external: ${s.withExternalImage}`);
            console.log(`   ❌ Sản phẩm không có ảnh: ${s.withNoImage}`);
            console.log(`   📸 Sản phẩm có ảnh chi tiết: ${s.withDetailImages}`);
        }

        console.log(`\n   ✅ Bài viết có ảnh server: ${articlesVerified}/${posts.length}`);
        console.log(`\n✨ Cập nhật hoàn thành!`);

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        process.exit(1);
    }
}

updateAllImages();
