/**
 * Script xóa toàn bộ database cũ và import data mới
 * Chạy: node resetDatabase.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

dotenv.config();
mongoose.set('strictQuery', false);

const ObjectId = mongoose.Types.ObjectId;

function slugify(text) {
    return text.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

async function resetDatabase() {
    try {
        console.log('🔌 Đang kết nối MongoDB...');
        await mongoose.connect(process.env.MongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('✅ Kết nối thành công!\n');

        const db = mongoose.connection.db;

        // ========== BƯỚC 1: XÓA TOÀN BỘ ==========
        console.log('🗑️  BƯỚC 1: Xóa toàn bộ dữ liệu cũ...');
        const existingCollections = await db.listCollections().toArray();
        for (const col of existingCollections) {
            await db.dropCollection(col.name);
            console.log(`   ❌ Đã xóa: ${col.name}`);
        }
        console.log(`   → Xóa xong ${existingCollections.length} collections\n`);

        // ========== BƯỚC 2: TẠO DATA ==========
        console.log('📥 BƯỚC 2: Import dữ liệu mới...\n');

        // --- USERS ---
        const adminId = new ObjectId();
        const customerId = new ObjectId();
        const customer2Id = new ObjectId();

        const users = [
            {
                _id: adminId,
                name: 'Jensy Admin',
                email: 'admin@jensy.vn',
                password: bcrypt.hashSync('123456', 10),
                isAdmin: true,
                phone: '0982463691',
                address: '159 Lý Thường Kiệt, Hà Đông',
                city: 'Hà Nội',
                provider: 'local',
                addresses: [],
                wishlist: [],
                loyaltyPoints: 0,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            },
            {
                _id: customerId,
                name: 'Nguyễn Văn A',
                email: 'khachhang1@gmail.com',
                password: bcrypt.hashSync('123456', 10),
                isAdmin: false,
                phone: '0912345678',
                address: '123 Nguyễn Huệ, Quận 1',
                city: 'TP Hồ Chí Minh',
                provider: 'local',
                addresses: [{
                    _id: new ObjectId(),
                    fullName: 'Nguyễn Văn A',
                    phone: '0912345678',
                    address: '123 Nguyễn Huệ, Quận 1',
                    ward: 'Phường Bến Nghé',
                    district: 'Quận 1',
                    city: 'TP Hồ Chí Minh',
                    isDefault: true,
                }],
                wishlist: [],
                loyaltyPoints: 150,
                createdAt: new Date('2024-06-15'),
                updatedAt: new Date('2024-06-15'),
            },
            {
                _id: customer2Id,
                name: 'Trần Thị B',
                email: 'khachhang2@gmail.com',
                password: bcrypt.hashSync('123456', 10),
                isAdmin: false,
                phone: '0987654321',
                address: '456 Trần Hưng Đạo',
                city: 'Hà Nội',
                provider: 'local',
                addresses: [],
                wishlist: [],
                loyaltyPoints: 50,
                createdAt: new Date('2024-09-20'),
                updatedAt: new Date('2024-09-20'),
            },
        ];

        await db.collection('users').insertMany(users);
        console.log(`   ✅ users: ${users.length} documents`);

        // --- CATEGORIES ---
        const catNhan = new ObjectId();
        const catDayChuyen = new ObjectId();
        const catLacTay = new ObjectId();
        const catBongTai = new ObjectId();
        const catCharm = new ObjectId();
        const catCapDoi = new ObjectId();

        const categories = [
            { _id: catNhan, name: 'Nhẫn Bạc', slug: 'nhan-bac', image: '/images/products/nhan/01_GNDD00W006416.png', description: 'Nhẫn bạc nữ cao cấp', order: 1, isActive: true, parentCategory: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
            { _id: catDayChuyen, name: 'Dây Chuyền Bạc', slug: 'day-chuyen-bac', image: '/images/products/day-chuyen/01_GMXM00W000953.png', description: 'Dây chuyền bạc nữ sang trọng', order: 2, isActive: true, parentCategory: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
            { _id: catLacTay, name: 'Lắc Tay Bạc', slug: 'lac-tay-bac', image: '/images/products/lac-vong-tay/01_GLXM00W060088.png', description: 'Lắc tay vòng tay bạc nữ', order: 3, isActive: true, parentCategory: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
            { _id: catBongTai, name: 'Bông Tai Bạc', slug: 'bong-tai-bac', image: '/images/products/bong-tai/01_GEDD00W001128.png', description: 'Bông tai khuyên tai bạc nữ', order: 4, isActive: true, parentCategory: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
            { _id: catCharm, name: 'Charm Bạc', slug: 'charm-bac', image: '/images/products/charm/01_SIXM00W060049.png', description: 'Charm bạc phụ kiện', order: 5, isActive: true, parentCategory: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
            { _id: catCapDoi, name: 'Cặp Đôi', slug: 'cap-doi', image: '/images/products/khac/01_GV0000W001038_GI0000W000177.png', description: 'Trang sức đôi cho cặp tình nhân', order: 6, isActive: true, parentCategory: null, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
        ];

        await db.collection('categories').insertMany(categories);
        console.log(`   ✅ categories: ${categories.length} documents`);

        // --- PRODUCTS ---
        const productImagesDir = path.join(__dirname, 'public', 'images', 'products');
        const typeMap = { 'nhan': 'Nhẫn Bạc', 'day-chuyen': 'Dây Chuyền Bạc', 'lac-vong-tay': 'Lắc Tay Bạc', 'bong-tai': 'Bông Tai Bạc', 'charm': 'Charm Bạc', 'khac': 'Set Trang Sức' };
        const categoryMap = { 'nhan': 'Nhẫn Bạc', 'day-chuyen': 'Dây Chuyền Bạc', 'lac-vong-tay': 'Lắc Tay Bạc', 'bong-tai': 'Bông Tai Bạc', 'charm': 'Charm Bạc', 'khac': 'Cặp Đôi' };
        const materialOptions = ['Bạc S925', 'Bạc Xi Bạch Kim', 'Bạc Xi Bạch Kim, Moissanite', 'Bạc Mạ Vàng 18K'];

        const productNames = {
            'nhan': ['Nhẫn Bạc Đính Moissanite Xi Bạch Kim "Starlight"','Nhẫn Bạc Nữ Đính Đá CZ "Elegance"','Nhẫn Bạc Mạ Vàng 18K Moissanite "Royal"','Nhẫn Đôi Bạc S925 "Forever Love"','Nhẫn Bạc Nữ Hàn Quốc "Blossom"','Nhẫn Bạc Moissanite 1 Carat "Diamond Queen"','Nhẫn Bạc Nữ Mặt Vuông "Modern"','Nhẫn Bạc Xi Bạch Kim Ngọc Trai "Pearl Dream"','Nhẫn Bạc Nữ Xoắn "Twisted Grace"','Nhẫn Bạc Tourmaline Hồng "Pink Aura"','Nhẫn Bạc Nam "Minimal Man"','Nhẫn Bạc Nữ Hoa Hồng "Rose Garden"','Nhẫn Bạc Sapphire "Blue Ocean"','Nhẫn Bạc Vintage "Antique Charm"','Nhẫn Bạc Moissanite "Infinity"','Nhẫn Bạc Nữ Mặt Tròn "Full Moon"','Nhẫn Đôi Bạc "Eternal Bond"','Nhẫn Bạc Lá Nguyệt Quế "Laurel"','Nhẫn Bạc Đá Opal "Rainbow Glow"','Nhẫn Bạc Freesize "Flexible Beauty"','Nhẫn Bạc Mạ Vàng Hồng "Rose Gold"','Nhẫn Bạc Thiết Kế Mở "Open Heart"','Nhẫn Bạc Nam Mặt Đá Đen "Dark Knight"','Nhẫn Bạc 3 Viên Kim Cương "Trinity"','Nhẫn Bạc Crown "Princess"','Nhẫn Bạc Hạt Đá Nhỏ "Sparkling"','Nhẫn Bạc Cánh Bướm "Butterfly"','Nhẫn Bạc Sóng "Wave"','Nhẫn Bạc Đính CZ "Crystal Clear"','Nhẫn Đôi Khắc Tên "Soulmate"','Nhẫn Bạc Minimalist "Simply"','Nhẫn Bạc Emerald "Green Fantasy"','Nhẫn Bạc Xoàn "Solitaire"','Nhẫn Bạc Ngôi Sao "Lucky Star"','Nhẫn Bạc Lông Vũ "Feather"','Nhẫn Bạc Boho "Bohemian"','Nhẫn Bạc Zircon Xanh "Aqua Blue"','Nhẫn Bạc Hình Tim "Sweet Heart"','Nhẫn Bạc Ruy Băng "Ribbon"','Nhẫn Bạc Lab Diamond "Lab Diamond"','Nhẫn Bạc Xoắn Đôi "Double Twist"','Nhẫn Bạc Garnet Đỏ "Red Flame"','Nhẫn Bạc Lá "Leaf Ring"','Nhẫn Đôi Tình Nhân "Lover"','Nhẫn Bạc Đơn Giản "Pure Silver"','Nhẫn Bạc Mắt Mèo "Cat Eye"'],
            'day-chuyen': ['Dây Chuyền Moissanite 5 Ly "Julia"','Dây Chuyền Đôi "Couple Ring"','Dây Chuyền Trái Tim "Sweet Love"','Dây Chuyền Ngọc Trai "Pearl Essence"','Dây Chuyền Moissanite "Shining Star"','Dây Chuyền Mặt Vuông CZ "Modern Square"','Dây Chuyền Đôi Tim "Two Halves"','Dây Chuyền Choker "Elegant Choker"','Dây Chuyền Bạch Kim "Circle of Life"','Dây Chuyền Sapphire "Ocean Blue"','Dây Chuyền Giọt Nước "Teardrop"','Dây Chuyền Bướm "Butterfly Pendant"','Dây Chuyền Moissanite 7 Ly "Grand"','Dây Chuyền Ngôi Sao "Starry Night"','Dây Chuyền Mạ Vàng 18K "Golden"','Dây Chuyền Hoa "Floral Dream"','Dây Chuyền Dáng Dài "Long Pendant"','Dây Chuyền Chữ Cái "Initial"','Dây Chuyền Vintage "Classic"','Dây Chuyền Mặt Trăng "Crescent"','Dây Chuyền Opal "Moonstone"','Dây Chuyền Dây Mảnh "Delicate Chain"','Dây Chuyền Dây Xích "Link Chain"','Dây Chuyền Box "Box Chain"','Dây Chuyền Nam "Man Chain"','Dây Chuyền Dây Rắn "Snake Chain"','Dây Chuyền Vàng Hồng "Rose Chain"','Dây Chuyền Nam Mặt Đá "Man Pendant"','Dây Chuyền 2 Tầng "Double Layer"','Dây Chuyền Đôi Xếp Hình "Puzzle"','Dây Chuyền Khắc Tên "Custom Name"','Dây Chuyền Ruby "Red Heart"','Dây Chuyền Infinity "Infinity Love"','Dây Chuyền Lông Vũ "Feather Pendant"','Dây Chuyền Oval "Oval Grace"','Dây Chuyền Topaz "Sky Blue"','Dây Chuyền Micro Pavé "Pave Diamond"'],
            'lac-vong-tay': ['Lắc Tay Moissanite 7 Ly "Frosted Aura"','Lắc Tay Mảnh "Slim Bracelet"','Lắc Tay Charm Tim "Heart Charm"','Lắc Tay Bạch Kim CZ "Crystal Band"','Vòng Tay Bạc Cứng "Silver Bangle"','Lắc Tay Mạ Vàng 18K "Golden Bracelet"','Vòng Tay Ngọc Trai "Pearl String"','Lắc Tay Moissanite "Luxe Band"','Lắc Tay Xích "Chain Link"','Vòng Tay Hàn Quốc "Korean Style"','Lắc Tay Khắc Tên "Personalized"','Lắc Tay Charm Sao "Star Charm"','Vòng Tay Vintage "Retro"','Lắc Tay Tennis "Tennis Bracelet"','Lắc Tay Đôi "Couple Bracelet"','Vòng Tay Đá Xanh "Emerald Touch"','Lắc Tay Lá "Leaf Bracelet"','Lắc Tay 2 Lớp "Double Chain"','Vòng Tay Nam "Man Bangle"','Lắc Tay Charm Bướm "Butterfly"','Vòng Tay Set "Stack Set"','Lắc Tay Vàng Hồng "Rose Bracelet"'],
            'bong-tai': ['Bông Tai Moissanite "Bowtie"','Bông Tai CZ Giọt Nước "Teardrop"','Bông Tai Tròn "Circle Stud"','Bông Tai Moissanite "Solitaire Ear"','Bông Tai Dài "Drop Earring"','Bông Tai Ngọc Trai "Pearl Stud"','Bông Tai Hoa "Flower Stud"','Bông Tai Kẹp "Ear Cuff"','Bông Tai Ngôi Sao "Star Earring"','Bông Tai Đá Nhỏ "Micro Stud"','Bông Tai Tim "Heart Earring"','Bông Tai Tua Rua "Tassel"','Bông Tai Mạ Vàng "Gold Stud"','Bông Tai Lá "Leaf Earring"','Khuyên Tai Bướm "Butterfly Ear"','Bông Tai Minimalist "Simple Ear"','Bông Tai Đôi "Couple Earring"','Khuyên Tai Đá Xanh "Blue Stud"','Bông Tai Mặt Trăng "Moon Earring"'],
            'charm': ['Charm Trái Tim "Heart"','Charm Ngôi Sao CZ "Star"','Charm Bướm "Butterfly"','Charm Moissanite "Diamond"','Charm Hoa "Flower"','Charm Mặt Trăng "Moon"','Charm Opal "Opal"'],
            'khac': ['Set Vòng Cổ + Bông Tai "Classic Set"','Set Trang Sức Mạ Vàng "Golden Set"','Set Lắc Tay Đôi "Couple Set"','Set Dây Chuyền Đôi "Matching Set"'],
        };

        const now = new Date();
        const products = [];

        const folders = fs.readdirSync(productImagesDir).filter(f => fs.statSync(path.join(productImagesDir, f)).isDirectory());
        for (const folder of folders) {
            const files = fs.readdirSync(path.join(productImagesDir, folder)).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
            const names = productNames[folder] || [];

            files.forEach((file, idx) => {
                const name = names[idx] || `Trang Sức Bạc ${typeMap[folder] || folder} #${idx + 1}`;
                const imagePath = `/images/products/${folder}/${file}`;
                const basePrice = Math.floor(Math.random() * 1500 + 300) * 1000;
                const discount = [0, 0, 0, 5, 10, 15, 20][Math.floor(Math.random() * 7)];
                const rating = [4, 4.2, 4.5, 4.7, 4.8, 5, 5][Math.floor(Math.random() * 7)];
                const selled = Math.floor(Math.random() * 300);
                const isFlashSale = Math.random() < 0.1;
                const material = materialOptions[Math.floor(Math.random() * materialOptions.length)];

                products.push({
                    _id: new ObjectId(),
                    name,
                    slug: slugify(name),
                    sku: file.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/^\d+_/, ''),
                    image: imagePath,
                    images: [imagePath],
                    type: typeMap[folder] || 'Khác',
                    category: categoryMap[folder] || 'Khác',
                    material,
                    tags: [typeMap[folder] || 'bạc', material.includes('Moissanite') ? 'moissanite' : 'bạc s925'],
                    price: basePrice,
                    countInStock: Math.floor(Math.random() * 100 + 5),
                    rating,
                    numReviews: Math.floor(Math.random() * 50),
                    description: `${name} - Chất liệu ${material}. Thiết kế sang trọng, tinh tế. Phù hợp làm quà tặng.`,
                    discount,
                    selled,
                    variants: [
                        { size: 'Free Size', packagingType: 'Hộp Thường', additionalPrice: 0 },
                        { size: 'Free Size', packagingType: 'Hộp Quà', additionalPrice: 30000 },
                    ],
                    isFlashSale,
                    flashSalePrice: isFlashSale ? Math.floor(basePrice * 0.7) : null,
                    flashSaleEndTime: isFlashSale ? new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) : null,
                    isNewArrival: Math.random() < 0.2,
                    isBestSeller: selled > 150,
                    isActive: true,
                    createdAt: new Date(now.getTime() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
                    updatedAt: now,
                });
            });
        }

        await db.collection('products').insertMany(products);
        console.log(`   ✅ products: ${products.length} documents`);

        // --- POSTS ---
        const posts = [
            { _id: new ObjectId(), title: 'Giấy Kiểm Định Kim Cương Moissanite Chuẩn GRA', slug: 'giay-kiem-dinh-kim-cuong-moissanite-gra-chuan', image: '/images/articles/kiem-dinh/kiem-dinh-gra.png', images: [], summary: 'Tất cả sản phẩm Moissanite đều đi kèm Giấy Kiểm Định GRA.', content: 'Tất cả sản phẩm gắn Kim cương Moissanite đều đi kèm Giấy Kiểm Định GRA Uy tín.\n\nMỗi đơn hàng nhận được:\n- 1 Giấy Kiểm Định GRA chính hãng\n- 1 Thẻ Bảo Hành Jensy\n- Hộp đựng trang sức cao cấp', type: 'Kiểm Định', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01') },
            { _id: new ObjectId(), title: 'Giấy Kiểm Định Bạc Chuẩn GIV', slug: 'bac-jensy-khong-lo-hoen-gi', image: '/images/articles/kiem-dinh/kiem-dinh-giv.png', images: [], summary: 'Bạc JENSY - Không Lo Hoen Gỉ. Kiểm định GIV.', content: 'Bạc JENSY - Không Lo Hoen Gỉ\nTất cả sản phẩm Bạc đều có giấy kiểm định GIV.\n\nCam kết:\n- Bạc nguyên chất S925\n- Xi Bạch Kim chống hoen gỉ\n- Không gây dị ứng', type: 'Kiểm Định', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-03-15'), updatedAt: new Date('2024-03-15') },
            { _id: new ObjectId(), title: 'Feedback Của Tiktoker Vân Anh Vũ – Gần 300K Followers', slug: 'feedback-cua-tiktoker-van-anh-vu', image: '/images/articles/feedback/feedback-tiktoker.png', images: [], summary: 'Tiktoker Vân Anh Vũ tin tưởng chọn Jensy.', content: 'Vân Anh chia sẻ: "Mình rất ấn tượng với chất lượng bạc. Đeo cả ngày không bị đen, không dị ứng."', type: 'Feedback', author: 'Uyên', createdAt: new Date('2024-05-10'), updatedAt: new Date('2024-05-10') },
            { _id: new ObjectId(), title: 'Những Feedback Khách Hàng Của JENSY 2024', slug: 'nhung-feedback-khach-hang-2024', image: '/images/articles/feedback/feedback-2024.png', images: [], summary: 'Jensy nhận được rất nhiều sự ủng hộ từ khách hàng.', content: '⭐⭐⭐⭐⭐ "Bạc đẹp lắm, đóng gói cẩn thận"\n⭐⭐⭐⭐⭐ "Đeo 3 tháng vẫn sáng bóng"', type: 'Feedback', author: 'Kho + Đóng Đơn', createdAt: new Date('2024-06-01'), updatedAt: new Date('2024-06-01') },
            { _id: new ObjectId(), title: 'Những Feedback Có Tâm Từ Khách Hàng JENSY', slug: 'nhung-feedback-co-tam', image: '/images/articles/feedback/feedback-heartfelt.png', images: [], summary: 'Hơn 50.000+ khách hàng tin tưởng.', content: '💬 "Mua ở Jensy 5 lần rồi, lần nào cũng hài lòng"\n💬 "Đóng gói đẹp, có thiệp, có giấy kiểm định đầy đủ"', type: 'Feedback', author: 'THÔNG', createdAt: new Date('2024-07-01'), updatedAt: new Date('2024-07-01') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Đo Size Lắc Tay', slug: 'huong-dan-do-size-lac-tay', image: '/images/articles/huong-dan/huong-dan-size-lac-tay.png', images: [], summary: 'Đo size lắc tay bạc phù hợp.', content: 'CÁCH 1: Đo bằng thước dây\nCÁCH 2: Đo bằng sợi dây\n\nSize S: 14-15cm | Size M: 15.5-16.5cm | Size L: 17-18cm', type: 'Hướng Dẫn', author: 'TRƯƠNG THỊ TUYẾT KHOA', createdAt: new Date('2024-02-01'), updatedAt: new Date('2024-02-01') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Đo Size Dây Chuyền', slug: 'huong-dan-do-size-day-chuyen', image: '/images/articles/huong-dan/huong-dan-size-day-chuyen.png', images: [], summary: 'Chọn size dây chuyền phù hợp.', content: '35cm: Choker | 40cm: Trên xương quai xanh | 45cm: Phổ biến nhất | 50cm: Trên ngực', type: 'Hướng Dẫn', author: 'TRƯƠNG THỊ TUYẾT KHOA', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Thanh Toán', slug: 'huong-dan-thanh-toan', image: '/images/articles/huong-dan/huong-dan-thanh-toan.png', images: [], summary: 'Các phương thức thanh toán tại Jensy.', content: '1. Chuyển khoản ngân hàng\n2. MoMo\n3. COD - Thanh toán khi nhận hàng', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-02-20'), updatedAt: new Date('2024-02-20') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Đặt Viết Thiệp Theo Yêu Cầu', slug: 'huong-dan-dat-viet-thiep', image: '/images/articles/huong-dan/huong-dan-thiep.png', images: [], summary: 'Viết thiệp miễn phí theo yêu cầu.', content: '1. Chọn sản phẩm\n2. Ghi chú: "YÊU CẦU VIẾT THIỆP"\n3. Kèm nội dung\nMiễn phí!', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Đặt Khắc Theo Yêu Cầu', slug: 'huong-dan-dat-khac-theo-yeu-cau', image: '/images/articles/huong-dan/huong-dan-khac-ten.png', images: [], summary: 'Dịch vụ khắc tên lên trang sức bạc.', content: 'Bước 1: Chọn sản phẩm\nBước 2: Ghi nội dung khắc\nBước 3: Xác nhận\nPhí: 30K-50K', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-03-10'), updatedAt: new Date('2024-03-10') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Làm Sáng Bạc Tại Nhà', slug: 'huong-dan-lam-sang-bac', image: '/images/articles/huong-dan/huong-dan-lam-sang-bac.png', images: [], summary: 'Cách làm sáng bạc dễ nhất.', content: '1. Chanh + muối hạt to\n2. Kem đánh răng\n3. Nước rửa bạc chuyên dụng', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-04-01'), updatedAt: new Date('2024-04-01') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Đặt Nhiều SP Trong 1 Đơn', slug: 'huong-dan-dat-nhieu-sp', image: '/images/articles/huong-dan/huong-dan-nhieu-sp.png', images: [], summary: 'Đặt nhiều SP trong 1 đơn tiết kiệm ship.', content: 'Bước 1: Chọn SP → Thêm vào giỏ\nBước 2: Tiếp tục mua\nBước 3: Thanh toán cùng lúc', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-04-10'), updatedAt: new Date('2024-04-10') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Sử Dụng Và Bảo Quản Bạc', slug: 'huong-dan-bao-quan-bac', image: '/images/articles/huong-dan/huong-dan-bao-quan-bac.png', images: [], summary: 'Bảo quản bạc đúng cách.', content: '❌ Tránh hóa chất, tắm, bơi\n✅ Lau khăn mềm, bảo quản hộp kín', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-04-15'), updatedAt: new Date('2024-04-15') },
            { _id: new ObjectId(), title: 'Hướng Dẫn Chỉnh Sửa Nhẫn Freesize', slug: 'huong-dan-nhan-freesize', image: '/images/articles/huong-dan/huong-dan-freesize.png', images: [], summary: 'Nhẫn freesize - giải quyết nỗi lo size.', content: 'Nhẫn freesize cho phép điều chỉnh kích thước.\nChỉnh từ từ, nhẹ nhàng. KHÔNG bẻ mạnh.', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2024-04-20'), updatedAt: new Date('2024-04-20') },
            { _id: new ObjectId(), title: '✨ CHÚC MỪNG NĂM MỚI 2026 – JENSY ✨', slug: 'chuc-mung-nam-moi-2026', image: '/images/articles/news/news-newyear-2026.png', images: [], summary: 'Jensy chúc năm mới An Khang – Hạnh Phúc.', content: 'Giảm 10% toàn bộ SP | Miễn phí ship đơn từ 300K | 01/01-15/01/2026', type: 'Tin Tức', author: 'Tâm', createdAt: new Date('2026-01-01'), updatedAt: new Date('2026-01-01') },
            { _id: new ObjectId(), title: 'Happy Valentine !', slug: 'happy-valentine', image: '/images/articles/news/news-valentine.png', images: [], summary: 'Valentine Collection - Tình yêu tinh tế.', content: 'Giảm 15% SP Cặp Đôi | Tặng thiệp + hộp quà | Miễn phí gói quà', type: 'Tin Tức', author: 'Tâm', createdAt: new Date('2026-02-01'), updatedAt: new Date('2026-02-01') },
            { _id: new ObjectId(), title: 'Món quà bạn tặng nói lên điều gì?', slug: 'mon-qua-ban-tang', image: '/images/articles/news/news-mon-qua.png', images: [], summary: 'Mỗi món trang sức mang một thông điệp riêng.', content: '💎 NHẪN = Gắn bó | DÂY CHUYỀN = Ở trong tim | LẮC TAY = Bên cạnh em', type: 'Tin Tức', author: 'Tâm', createdAt: new Date('2026-02-05'), updatedAt: new Date('2026-02-05') },
            { _id: new ObjectId(), title: 'Checklist quà Valentine cho "người hay quên"', slug: 'checklist-qua-valentine', image: '/images/articles/news/news-checklist.png', images: [], summary: 'Không cần hoàn hảo, chỉ cần đừng quên.', content: '☐ Dây chuyền ☐ Nhẫn đôi ☐ Lắc tay ☐ Set quà tặng ☐ Thiệp (miễn phí)', type: 'Tin Tức', author: 'Tâm', createdAt: new Date('2026-02-08'), updatedAt: new Date('2026-02-08') },
            { _id: new ObjectId(), title: 'Lịch Làm Việc Tết Bính Ngọ 2026', slug: 'lich-lam-viec-tet-2026', image: '/images/articles/news/news-lich-tet.png', images: [], summary: 'Ngừng giao hàng 15/2-25/2. CSKH vẫn hoạt động.', content: 'Ngừng nhận đơn: 15/2-25/2\nBắt đầu lại: 26/2\nGiảm 10% + Tặng lì xì', type: 'Tin Tức', author: 'NGUYỄN MINH NHÂN', createdAt: new Date('2026-01-20'), updatedAt: new Date('2026-01-20') },
            { _id: new ObjectId(), title: 'Valentine Đến Nhà, Jensy Trao Quà', slug: 'valentine-den-nha-jensy-trao-qua', image: '/images/articles/news/news-valentine-gift.png', images: [], summary: 'Giao hàng đúng ngày 14/2.', content: 'Giao ĐÚNG NGÀY 14/2 | Miễn phí gói quà | Tặng hoa hồng sáp đơn từ 800K', type: 'Tin Tức', author: 'BÌNH DƯƠNG THÁI', createdAt: new Date('2026-02-10'), updatedAt: new Date('2026-02-10') },
            { _id: new ObjectId(), title: '✨Happy New Year 2026✨', slug: 'happy-new-year-2026', image: '/images/articles/news/news-happy-newyear.png', images: [], summary: 'Chúc sức khỏe, an yên trọn vẹn.', content: 'Năm 2025: 15.000 khách mới | 50+ mẫu mới | 99% feedback tích cực', type: 'Tin Tức', author: 'Uyên', createdAt: new Date('2025-12-31'), updatedAt: new Date('2025-12-31') },
            { _id: new ObjectId(), title: 'Giáng Sinh Rộn Ràng, Quà Tặng Ngập Tràn 🎄', slug: 'giang-sinh-ron-rang', image: '/images/articles/news/news-christmas.png', images: [], summary: 'Giáng Sinh - mùa sẻ chia yêu thương.', content: 'Giảm 20% (24-25/12) | Giảm 15% đơn 500K (20-26/12) | Miễn phí gói quà Noel', type: 'Tin Tức', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2025-12-20'), updatedAt: new Date('2025-12-20') },
            { _id: new ObjectId(), title: 'Chúc Mừng Năm Mới Ất Tỵ 2025', slug: 'chuc-mung-nam-moi-at-ty-2025', image: '/images/articles/news/news-tet-2025.png', images: [], summary: 'An Khang – Thịnh Vượng – Hạnh Phúc!', content: 'Flash Sale giảm 30% Mùng 1-3 Tết | Tặng lì xì | Miễn phí ship', type: 'Tin Tức', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2025-01-25'), updatedAt: new Date('2025-01-25') },
            { _id: new ObjectId(), title: '🌸 ĐEO GÌ ĐI CHƠI TẾT? 🌸', slug: 'deo-gi-di-choi-tet', image: '/images/articles/news/news-deo-tet.png', images: [], summary: 'Thêm chút lấp lánh cho outfit Tết.', content: 'ÁO DÀI + Dây chuyền ngọc | ĐẦM PARTY + Bông tai Moissanite | ĐỒ ĐÔI + Set nhẫn đôi', type: 'Tin Tức', author: 'PHẠM HẠ TUYÊN', createdAt: new Date('2025-01-20'), updatedAt: new Date('2025-01-20') },
        ];

        await db.collection('posts').insertMany(posts);
        console.log(`   ✅ posts: ${posts.length} documents`);

        // --- BANNERS ---
        const bannerFiles = fs.readdirSync(path.join(__dirname, 'public', 'images', 'banners')).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
        const bannerTitles = ['Trang Sức Bạc Cao Cấp JENSY','Bộ Sưu Tập Mới 2026','Flash Sale - Giảm 50%','Valentine Collection','Quà Tặng Ý Nghĩa','Kim Cương Moissanite GRA','Bạc S925 Chính Hãng','Miễn Phí Ship Đơn 500K','Combo Tiết Kiệm','New Arrivals','Best Seller 2025','Set Quà Tặng Premium'];
        const positions = ['homepage_hero','homepage_sub','homepage_flash_sale','category_top'];

        const banners = bannerFiles.map((file, idx) => ({
            _id: new ObjectId(),
            title: bannerTitles[idx % bannerTitles.length] + (idx >= bannerTitles.length ? ` ${idx + 1}` : ''),
            subtitle: 'Jensy - Lấp Lánh Em Xinh',
            image: `/images/banners/${file}`,
            imageMobile: null,
            link: '/',
            position: positions[idx % positions.length],
            isActive: idx < 20,
            order: idx + 1,
            startDate: null,
            endDate: null,
            createdAt: new Date('2024-01-01'),
            updatedAt: now,
        }));

        await db.collection('banners').insertMany(banners);
        console.log(`   ✅ banners: ${banners.length} documents`);

        // --- ORDERS ---
        const p1 = products[0], p2 = products[1], p3 = products[10] || products[2];
        const orders = [
            {
                _id: new ObjectId(),
                orderItems: [
                    { name: p1.name, amount: 1, image: p1.image, price: p1.price, discount: p1.discount, product: p1._id },
                    { name: p2.name, amount: 2, image: p2.image, price: p2.price, discount: p2.discount, product: p2._id },
                ],
                shippingAddress: { fullName: 'Nguyễn Văn A', address: '123 Nguyễn Huệ, Quận 1', ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP Hồ Chí Minh', phone: '0912345678' },
                paymentMethod: 'COD', deliveryType: 'delivery',
                itemsPrice: p1.price + p2.price * 2, shippingPrice: 30000, discountAmount: 0,
                totalPrice: p1.price + p2.price * 2 + 30000,
                note: 'Giao giờ hành chính', user: customerId,
                status: 'delivered', isPaid: true, paidAt: new Date('2025-03-15'),
                isDelivered: true, deliveredAt: new Date('2025-03-17'),
                createdAt: new Date('2025-03-13'), updatedAt: new Date('2025-03-17'),
            },
            {
                _id: new ObjectId(),
                orderItems: [
                    { name: p3.name, amount: 1, image: p3.image, price: p3.price, discount: p3.discount, product: p3._id },
                ],
                shippingAddress: { fullName: 'Nguyễn Văn A', address: '123 Nguyễn Huệ, Quận 1', ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP Hồ Chí Minh', phone: '0912345678' },
                paymentMethod: 'VNPay', deliveryType: 'delivery',
                itemsPrice: p3.price, shippingPrice: 0, discountAmount: 0, totalPrice: p3.price,
                note: '', user: customerId,
                status: 'pending', isPaid: false, isDelivered: false,
                createdAt: new Date('2026-04-10'), updatedAt: new Date('2026-04-10'),
            },
        ];

        await db.collection('orders').insertMany(orders);
        console.log(`   ✅ orders: ${orders.length} documents`);

        // ========== THỐNG KÊ ==========
        console.log('\n📊 THỐNG KÊ:');
        const finalCols = await db.listCollections().toArray();
        for (const col of finalCols) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`   📁 ${col.name}: ${count} documents`);
        }

        console.log('\n🎉 HOÀN TẤT! Database đã reset thành công!');
        console.log('\n📌 Tài khoản:');
        console.log('   Admin  → admin@jensy.vn / 123456');
        console.log('   User 1 → khachhang1@gmail.com / 123456');
        console.log('   User 2 → khachhang2@gmail.com / 123456');

        process.exit(0);
    } catch (error) {
        console.error('\n💥 LỖI:', error.message);
        process.exit(1);
    }
}

resetDatabase();
