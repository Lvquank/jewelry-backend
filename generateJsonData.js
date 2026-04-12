/**
 * Script tạo file JSON data để import vào MongoDB Atlas
 * Chạy: node generateJsonData.js
 * Sau đó import các file trong thư mục json-data/ vào MongoDB Atlas
 */
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'json-data');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

// Helper: tạo ObjectId giả cho MongoDB
function objectId() {
    const hex = '0123456789abcdef';
    let id = '';
    for (let i = 0; i < 24; i++) id += hex[Math.floor(Math.random() * 16)];
    return { "$oid": id };
}

function isoDate(d) {
    return { "$date": d.toISOString() };
}

function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ============================================================
// 1. USERS
// ============================================================
const adminId = objectId();
const customerId = objectId();

const users = [
    {
        _id: adminId,
        name: 'Jensy Admin',
        email: 'admin@jensy.vn',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // 123456
        isAdmin: true,
        phone: '0982463691',
        address: '159 Lý Thường Kiệt, Hà Đông',
        city: 'Hà Nội',
        provider: 'local',
        addresses: [],
        wishlist: [],
        loyaltyPoints: 0,
        createdAt: isoDate(new Date('2024-01-01')),
        updatedAt: isoDate(new Date('2024-01-01'))
    },
    {
        _id: customerId,
        name: 'Nguyễn Văn A',
        email: 'khachhang1@gmail.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // 123456
        isAdmin: false,
        phone: '0912345678',
        address: 'Quận 1',
        city: 'TP HCM',
        provider: 'local',
        addresses: [
            {
                _id: objectId(),
                fullName: 'Nguyễn Văn A',
                phone: '0912345678',
                address: '123 Nguyễn Huệ, Quận 1',
                ward: 'Phường Bến Nghé',
                district: 'Quận 1',
                city: 'TP Hồ Chí Minh',
                isDefault: true
            }
        ],
        wishlist: [],
        loyaltyPoints: 150,
        createdAt: isoDate(new Date('2024-06-15')),
        updatedAt: isoDate(new Date('2024-06-15'))
    },
    {
        _id: objectId(),
        name: 'Trần Thị B',
        email: 'khachhang2@gmail.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        isAdmin: false,
        phone: '0987654321',
        address: '456 Trần Hưng Đạo',
        city: 'Hà Nội',
        provider: 'local',
        addresses: [],
        wishlist: [],
        loyaltyPoints: 50,
        createdAt: isoDate(new Date('2024-09-20')),
        updatedAt: isoDate(new Date('2024-09-20'))
    }
];

// ============================================================
// 2. CATEGORIES
// ============================================================
const catNhan = objectId();
const catDayChuyen = objectId();
const catLacTay = objectId();
const catBongTai = objectId();
const catCharm = objectId();
const catCapDoi = objectId();

const categories = [
    { _id: catNhan, name: 'Nhẫn Bạc', slug: 'nhan-bac', image: '/images/products/nhan/01_GNDD00W006416.png', description: 'Nhẫn bạc nữ cao cấp', order: 1, isActive: true, parentCategory: null, createdAt: isoDate(new Date('2024-01-01')), updatedAt: isoDate(new Date('2024-01-01')) },
    { _id: catDayChuyen, name: 'Dây Chuyền Bạc', slug: 'day-chuyen-bac', image: '/images/products/day-chuyen/01_GMXM00W000953.png', description: 'Dây chuyền bạc nữ sang trọng', order: 2, isActive: true, parentCategory: null, createdAt: isoDate(new Date('2024-01-01')), updatedAt: isoDate(new Date('2024-01-01')) },
    { _id: catLacTay, name: 'Lắc Tay Bạc', slug: 'lac-tay-bac', image: '/images/products/lac-vong-tay/01_GLXM00W060088.png', description: 'Lắc tay vòng tay bạc nữ', order: 3, isActive: true, parentCategory: null, createdAt: isoDate(new Date('2024-01-01')), updatedAt: isoDate(new Date('2024-01-01')) },
    { _id: catBongTai, name: 'Bông Tai Bạc', slug: 'bong-tai-bac', image: '/images/products/bong-tai/01_GEDD00W001128.png', description: 'Bông tai khuyên tai bạc nữ', order: 4, isActive: true, parentCategory: null, createdAt: isoDate(new Date('2024-01-01')), updatedAt: isoDate(new Date('2024-01-01')) },
    { _id: catCharm, name: 'Charm Bạc', slug: 'charm-bac', image: '/images/products/charm/01_SIXM00W060049.png', description: 'Charm bạc phụ kiện', order: 5, isActive: true, parentCategory: null, createdAt: isoDate(new Date('2024-01-01')), updatedAt: isoDate(new Date('2024-01-01')) },
    { _id: catCapDoi, name: 'Cặp Đôi', slug: 'cap-doi', image: '/images/products/khac/01_GV0000W001038_GI0000W000177.png', description: 'Trang sức đôi cho cặp tình nhân', order: 6, isActive: true, parentCategory: null, createdAt: isoDate(new Date('2024-01-01')), updatedAt: isoDate(new Date('2024-01-01')) },
];

// ============================================================
// 3. PRODUCTS - Sử dụng ảnh local từ /images/products/
// ============================================================
const now = new Date();
const productNames = {
    'nhan': [
        'Nhẫn Bạc Đính Kim Cương Moissanite Xi Bạch Kim "Starlight"',
        'Nhẫn Bạc Nữ Đính Đá CZ Cao Cấp "Elegance"',
        'Nhẫn Bạc Mạ Vàng 18K Đính Kim Cương Moissanite "Royal"',
        'Nhẫn Đôi Bạc S925 Khắc Tên "Forever Love"',
        'Nhẫn Bạc Nữ Phong Cách Hàn Quốc "Blossom"',
        'Nhẫn Bạc Đính Kim Cương Moissanite 1 Carat "Diamond Queen"',
        'Nhẫn Bạc Nữ Mặt Vuông Đính Đá "Modern"',
        'Nhẫn Bạc Xi Bạch Kim Đính Ngọc Trai "Pearl Dream"',
        'Nhẫn Bạc Nữ Thiết Kế Xoắn "Twisted Grace"',
        'Nhẫn Bạc Đính Đá Tourmaline Hồng "Pink Aura"',
        'Nhẫn Bạc Nam Đơn Giản "Minimal Man"',
        'Nhẫn Bạc Nữ Hoa Hồng "Rose Garden"',
        'Nhẫn Bạc S925 Đính Sapphire "Blue Ocean"',
        'Nhẫn Bạc Nữ Vintage "Antique Charm"',
        'Nhẫn Bạc Đính Kim Cương Moissanite "Infinity"',
        'Nhẫn Bạc Nữ Mặt Tròn "Full Moon"',
        'Nhẫn Đôi Bạc Tình Yêu "Eternal Bond"',
        'Nhẫn Bạc Nữ Lá Nguyệt Quế "Laurel"',
        'Nhẫn Bạc Đính Đá Opal "Rainbow Glow"',
        'Nhẫn Bạc Nữ Freesize "Flexible Beauty"',
        'Nhẫn Bạc Mạ Vàng Hồng "Rose Gold Dream"',
        'Nhẫn Bạc Nữ Thiết Kế Mở "Open Heart"',
        'Nhẫn Bạc Nam Mặt Đá Đen "Dark Knight"',
        'Nhẫn Bạc Nữ Đính Kim Cương 3 Viên "Trinity"',
        'Nhẫn Bạc S925 Kiểu Dáng Crown "Princess"',
        'Nhẫn Bạc Nữ Đính Hạt Đá Nhỏ "Sparkling Ring"',
        'Nhẫn Bạc Freesize Cánh Bướm "Butterfly"',
        'Nhẫn Bạc Nữ Thiết Kế Sóng "Wave"',
        'Nhẫn Bạc Xi Bạch Kim Đính CZ "Crystal Clear"',
        'Nhẫn Bạc Đôi Cặp Khắc Tên "Soulmate"',
        'Nhẫn Bạc Nữ Phong Cách Minimalist "Simply"',
        'Nhẫn Bạc Nữ Đính Emerald "Green Fantasy"',
        'Nhẫn Bạc Nữ Kiểu Nhẫn Xoàn "Solitaire"',
        'Nhẫn Bạc S925 Mặt Ngôi Sao "Lucky Star"',
        'Nhẫn Bạc Nữ Thiết Kế Lông Vũ "Feather"',
        'Nhẫn Bạc Nữ Phong Cách Boho "Bohemian"',
        'Nhẫn Bạc Nữ Đính Đá Zircon Xanh "Aqua Blue"',
        'Nhẫn Bạc S925 Hình Tim "Sweet Heart"',
        'Nhẫn Bạc Nữ Thiết Kế Ruy Băng "Ribbon"',
        'Nhẫn Bạc Nữ Đính Kim Cương Lab "Lab Diamond"',
        'Nhẫn Bạc Nữ Kiểu Xoắn Đôi "Double Twist"',
        'Nhẫn Bạc S925 Đính Đá Garnet Đỏ "Red Flame"',
        'Nhẫn Bạc Nữ Thiết Kế Lá "Leaf"',
        'Nhẫn Bạc Đôi Tình Nhân "Lover"',
        'Nhẫn Bạc S925 Đơn Giản "Pure Silver"',
        'Nhẫn Bạc Nữ Mặt Đá Mắt Mèo "Cat Eye"',
    ],
    'day-chuyen': [
        'Dây Chuyền Bạc Đính Moissanite 5 Ly Xi Bạch Kim "Julia"',
        'Dây Chuyền Đôi Bạc S925 "Couple Ring"',
        'Dây Chuyền Bạc Nữ Mặt Trái Tim "Sweet Love"',
        'Dây Chuyền Bạc Đính Ngọc Trai Thiên Nhiên "Pearl Essence"',
        'Dây Chuyền Bạc Nữ Đính Kim Cương Moissanite "Shining Star"',
        'Dây Chuyền Bạc Mặt Vuông Đính CZ "Modern Square"',
        'Dây Chuyền Đôi Bạc Mặt Ghép Tim "Two Halves"',
        'Dây Chuyền Bạc Nữ Kiểu Choker "Elegant Choker"',
        'Dây Chuyền Bạc Xi Bạch Kim Mặt Tròn "Circle of Life"',
        'Dây Chuyền Bạc Đính Đá Sapphire Xanh "Ocean Blue"',
        'Dây Chuyền Bạc Nữ Mặt Giọt Nước "Teardrop"',
        'Dây Chuyền Bạc S925 Mặt Bướm "Butterfly Pendant"',
        'Dây Chuyền Bạc Đính Kim Cương Moissanite 7 Ly "Grand"',
        'Dây Chuyền Bạc Nữ Mặt Ngôi Sao "Starry Night"',
        'Dây Chuyền Bạc Mạ Vàng 18K "Golden Charm"',
        'Dây Chuyền Bạc Nữ Mặt Hoa "Floral Dream"',
        'Dây Chuyền Bạc Nữ Dáng Dài "Long Pendant"',
        'Dây Chuyền Bạc Nữ Mặt Chữ Cái "Initial"',
        'Dây Chuyền Bạc Nữ Phong Cách Vintage "Classic"',
        'Dây Chuyền Bạc Nữ Mặt Mặt Trăng "Crescent"',
        'Dây Chuyền Bạc Nữ Đính Đá Opal "Moonstone"',
        'Dây Chuyền Bạc S925 Dây Mảnh "Delicate Chain"',
        'Dây Chuyền Bạc S925 Dây Xích "Link Chain"',
        'Dây Chuyền Bạc Nữ Dây Box "Box Chain"',
        'Dây Chuyền Bạc Nam Đơn Giản "Man Chain"',
        'Dây Chuyền Bạc S925 Dây Rắn "Snake Chain"',
        'Dây Chuyền Bạc Mạ Vàng Hồng "Rose Chain"',
        'Dây Chuyền Bạc Nam Mặt Đá "Man Pendant"',
        'Dây Chuyền Bạc Nữ Layer 2 Tầng "Double Layer"',
        'Dây Chuyền Đôi Bạc Mặt Xếp Hình "Puzzle"',
        'Dây Chuyền Bạc Nữ Mặt Khắc Tên "Custom Name"',
        'Dây Chuyền Bạc Nữ Mặt Đá Ruby "Red Heart"',
        'Dây Chuyền Bạc S925 Mặt Infinity "Infinity Love"',
        'Dây Chuyền Bạc Nữ Mặt Lông Vũ "Feather Pendant"',
        'Dây Chuyền Bạc Nữ Mặt Hình Oval "Oval Grace"',
        'Dây Chuyền Bạc Nữ Đính Đá Topaz "Sky Blue"',
        'Dây Chuyền Bạc Nữ Mặt Micro Pavé "Pave Diamond"',
    ],
    'lac-vong-tay': [
        'Lắc Tay Bạc Đính Moissanite 7 Ly Xi Bạch Kim "Frosted Aura"',
        'Lắc Tay Bạc S925 Kiểu Dáng Mảnh "Slim Bracelet"',
        'Lắc Tay Bạc Đính Charm Hình Tim "Heart Charm"',
        'Lắc Tay Bạc Xi Bạch Kim Đính CZ "Crystal Band"',
        'Vòng Tay Bạc S925 Kiểu Cứng "Silver Bangle"',
        'Lắc Tay Bạc Mạ Vàng 18K "Golden Bracelet"',
        'Vòng Tay Bạc Đính Ngọc Trai "Pearl String"',
        'Lắc Tay Bạc Đính Kim Cương Moissanite "Luxe Band"',
        'Lắc Tay Bạc Kiểu Dây Xích "Chain Link"',
        'Vòng Tay Bạc Phong Cách Hàn "Korean Style"',
        'Lắc Tay Bạc S925 Khắc Tên "Personalized"',
        'Lắc Tay Bạc Nữ Charm Ngôi Sao "Star Charm"',
        'Vòng Tay Bạc Phong Cách Vintage "Retro"',
        'Lắc Tay Bạc Nữ Dáng Tennis "Tennis Bracelet"',
        'Lắc Tay Bạc Đôi Cặp "Couple Bracelet"',
        'Vòng Tay Bạc Đính Đá Xanh "Emerald Touch"',
        'Lắc Tay Bạc S925 Kiểu Lá "Leaf Bracelet"',
        'Lắc Tay Bạc Nữ Layer 2 Lớp "Double Chain"',
        'Vòng Tay Bạc Nam Đơn Giản "Man Bangle"',
        'Lắc Tay Bạc Nữ Charm Bướm "Butterfly Charm"',
        'Vòng Tay Set Bạc Nữ "Stack Set"',
        'Lắc Tay Bạc Mạ Vàng Hồng "Rose Bracelet"',
    ],
    'bong-tai': [
        'Bông Tai Bạc Đính Moissanite Xi Bạch Kim "Bowtie"',
        'Bông Tai Bạc Nữ Đính CZ Kiểu Giọt Nước "Teardrop"',
        'Bông Tai Bạc Nữ Hình Tròn "Circle Stud"',
        'Bông Tai Bạc Đính Kim Cương Moissanite "Solitaire Ear"',
        'Bông Tai Bạc Nữ Kiểu Dài "Drop Earring"',
        'Bông Tai Bạc Nữ Đính Ngọc Trai "Pearl Stud"',
        'Bông Tai Bạc Xi Bạch Kim Hình Hoa "Flower Stud"',
        'Bông Tai Bạc Nữ Kiểu Kẹp "Ear Cuff"',
        'Bông Tai Bạc Nữ Hình Ngôi Sao "Star Earring"',
        'Bông Tai Bạc S925 Đính Đá Nhỏ "Micro Stud"',
        'Bông Tai Bạc Nữ Hình Tim "Heart Earring"',
        'Bông Tai Bạc Nữ Kiểu Tua Rua "Tassel"',
        'Bông Tai Bạc Mạ Vàng 18K "Gold Stud"',
        'Bông Tai Bạc Nữ Hình Lá "Leaf Earring"',
        'Khuyên Tai Bạc Nữ Hình Bướm "Butterfly Ear"',
        'Bông Tai Bạc Nữ Phong Cách Minimalist "Simple Ear"',
        'Bông Tai Bạc Đôi Cặp "Couple Earring"',
        'Khuyên Tai Bạc Nữ Đính Đá Xanh "Blue Stud"',
        'Bông Tai Bạc Nữ Hình Mặt Trăng "Moon Earring"',
    ],
    'charm': [
        'Charm Bạc S925 Hình Trái Tim "Heart Charm"',
        'Charm Bạc Đính Đá CZ Hình Ngôi Sao "Star Charm"',
        'Charm Bạc Nữ Hình Bướm "Butterfly Charm"',
        'Charm Bạc Đính Moissanite "Diamond Charm"',
        'Charm Bạc S925 Hình Hoa "Flower Charm"',
        'Charm Bạc Hình Mặt Trăng "Moon Charm"',
        'Charm Bạc Đính Đá Opal "Opal Charm"',
    ],
    'khac': [
        'Set Vòng Cổ + Bông Tai Bạc "Classic Set"',
        'Set Trang Sức Bạc Mạ Vàng "Golden Set"',
        'Set Lắc Tay Đôi Bạc "Couple Set"',
        'Set Dây Chuyền Đôi Bạc "Matching Set"',
    ]
};

const typeMap = {
    'nhan': 'Nhẫn Bạc',
    'day-chuyen': 'Dây Chuyền Bạc',
    'lac-vong-tay': 'Lắc Tay Bạc',
    'bong-tai': 'Bông Tai Bạc',
    'charm': 'Charm Bạc',
    'khac': 'Set Trang Sức'
};

const categoryMap = {
    'nhan': 'Nhẫn Bạc',
    'day-chuyen': 'Dây Chuyền Bạc',
    'lac-vong-tay': 'Lắc Tay Bạc',
    'bong-tai': 'Bông Tai Bạc',
    'charm': 'Charm Bạc',
    'khac': 'Cặp Đôi'
};

const materialOptions = ['Bạc S925', 'Bạc Xi Bạch Kim', 'Bạc Xi Bạch Kim, Moissanite', 'Bạc Mạ Vàng 18K'];

// Scan product images
const productImagesDir = path.join(__dirname, 'public', 'images', 'products');
const products = [];
const productIds = [];

const folders = fs.readdirSync(productImagesDir);
for (const folder of folders) {
    const folderPath = path.join(productImagesDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
    const names = productNames[folder] || [];

    files.forEach((file, idx) => {
        const id = objectId();
        productIds.push(id);
        const name = names[idx] || `Trang Sức Bạc ${folder} #${idx + 1}`;
        const imagePath = `/images/products/${folder}/${file}`;
        const basePrice = Math.floor(Math.random() * 1500 + 300) * 1000; // 300K-1.8M
        const discount = [0, 0, 0, 5, 10, 15, 20][Math.floor(Math.random() * 7)];
        const rating = [4, 4.2, 4.5, 4.7, 4.8, 5, 5][Math.floor(Math.random() * 7)];
        const selled = Math.floor(Math.random() * 300);
        const isFlashSale = Math.random() < 0.1;
        const material = materialOptions[Math.floor(Math.random() * materialOptions.length)];

        const product = {
            _id: id,
            name,
            slug: slugify(name),
            sku: file.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/^\d+_/, ''),
            image: imagePath,
            images: [imagePath],
            type: typeMap[folder] || 'Khác',
            category: categoryMap[folder] || 'Khác',
            material,
            tags: [typeMap[folder], material.includes('Moissanite') ? 'moissanite' : 'bạc s925'].filter(Boolean),
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
            flashSaleEndTime: isFlashSale ? isoDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) : null,
            isNewArrival: Math.random() < 0.2,
            isBestSeller: selled > 150,
            isActive: true,
            createdAt: isoDate(new Date(now.getTime() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000)),
            updatedAt: isoDate(now),
        };

        products.push(product);
    });
}

// ============================================================
// 4. POSTS - Sử dụng data từ seedJensyData.js
// ============================================================
const posts = [
    // Kiểm Định
    { _id: objectId(), title: 'Giấy Kiểm Định Kim Cương Moissanite Chuẩn GRA', slug: 'giay-kiem-dinh-kim-cuong-moissanite-gra-chuan', image: '/images/articles/kiem-dinh/kiem-dinh-gra.png', summary: 'Tất cả các sản phẩm gắn Kim cương Moissanite của Jensy đều đi kèm Giấy Kiểm Định GRA Uy tín.', content: 'Tất cả các sản phẩm gắn Kim cương Moissanite của Jensy đều đi kèm Giấy Kiểm Định GRA Uy tín cùng với thẻ Bảo Hành.\n\nVới mỗi đơn hàng, khách hàng sẽ nhận được:\n- 1 Giấy Kiểm Định GRA chính hãng\n- 1 Thẻ Bảo Hành Jensy\n- Hộp đựng trang sức cao cấp\n\nGRA (Gemological Research Association) là tổ chức kiểm định kim cương Moissanite uy tín hàng đầu thế giới.', type: 'Kiểm Định', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-03-01')), updatedAt: isoDate(new Date('2024-03-01')) },
    { _id: objectId(), title: 'Giấy Kiểm Định Bạc Chuẩn GIV', slug: 'bac-jensy-khong-lo-hoen-gi', image: '/images/articles/kiem-dinh/kiem-dinh-giv.png', summary: 'Bạc JENSY - Không Lo Hoen Gỉ. Tất cả sản phẩm Bạc của Jensy đều có giấy kiểm định đầu vào GIV.', content: 'Bạc JENSY - Không Lo Hoen Gỉ\n\nTất cả sản phẩm Bạc của Jensy đều có giấy kiểm định đầu vào GIV.\n\nGIV là tên viết tắt của Viện Đá Quý Việt Nam - đơn vị kiểm định uy tín tại Việt Nam.\n\nCam kết chất lượng Bạc Jensy:\n- Bạc nguyên chất S925\n- Xi lớp Bạch Kim chống hoen gỉ\n- Không gây dị ứng da\n- Giấy kiểm định GIV kèm theo', type: 'Kiểm Định', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-03-15')), updatedAt: isoDate(new Date('2024-03-15')) },
    // Feedback
    { _id: objectId(), title: 'Feedback Của Tiktoker Vân Anh Vũ – Gần 300K Followers', slug: 'feedback-cua-tiktoker-van-anh-vu-gan-300k-followers', image: '/images/articles/feedback/feedback-tiktoker.png', summary: 'Ngàn lời quảng cáo cũng không có giá trị nếu sản phẩm không chất lượng.', content: 'Tiktoker Vân Anh Vũ - gần 300K followers trên TikTok đã tin tưởng lựa chọn trang sức Jensy.\n\nVân Anh chia sẻ: "Mình rất ấn tượng với chất lượng bạc của Jensy."', type: 'Feedback', author: 'Uyên', images: [], createdAt: isoDate(new Date('2024-05-10')), updatedAt: isoDate(new Date('2024-05-10')) },
    { _id: objectId(), title: 'Những Feedback Khách Hàng Của JENSY 2024', slug: 'nhung-feedback-khach-hang-cua-jensy-2024', image: '/images/articles/feedback/feedback-2024.png', summary: 'Từ đầu năm 2024 tới nay, Jensy đã nhận được rất nhiều sự ủng hộ của khách hàng.', content: 'Từ đầu năm 2024 tới nay, Jensy đã nhận được rất nhiều sự ủng hộ.\n\n⭐⭐⭐⭐⭐ "Bạc đẹp lắm, đóng gói cẩn thận"\n⭐⭐⭐⭐⭐ "Mua tặng bạn gái, bạn ấy thích lắm"', type: 'Feedback', author: 'Kho + Đóng Đơn', images: [], createdAt: isoDate(new Date('2024-06-01')), updatedAt: isoDate(new Date('2024-06-01')) },
    { _id: objectId(), title: 'Những Feedback Có Tâm Từ Khách Hàng Của JENSY Thân Yêu', slug: 'nhung-feedback-co-tam-tu-khach-hang-cua-jensy', image: '/images/articles/feedback/feedback-heartfelt.png', summary: 'Ra đời từ đầu năm 2017 đến nay Jensy vẫn luôn cố gắng cung cấp sản phẩm tốt nhất.', content: 'Jensy đã phục vụ hơn 50.000+ khách hàng trên toàn quốc.\n\n💬 "Mua ở Jensy 5 lần rồi, lần nào cũng hài lòng"\n💬 "Mình là khách hàng từ thời 20Silvers"', type: 'Feedback', author: 'THÔNG', images: [], createdAt: isoDate(new Date('2024-07-01')), updatedAt: isoDate(new Date('2024-07-01')) },
    // Hướng Dẫn
    { _id: objectId(), title: 'Hướng Dẫn Đo Size Lắc Tay', slug: 'huong-dan-do-size-lac-tay', image: '/images/articles/huong-dan/huong-dan-size-lac-tay.png', summary: 'Hướng dẫn đo size lắc tay bạc phù hợp.', content: 'CÁCH 1: Đo bằng thước dây\nCÁCH 2: Đo bằng sợi dây\n\nBảng size:\n- Size S: 14-15cm\n- Size M: 15.5-16.5cm\n- Size L: 17-18cm', type: 'Hướng Dẫn', author: 'TRƯƠNG THỊ TUYẾT KHOA', images: [], createdAt: isoDate(new Date('2024-02-01')), updatedAt: isoDate(new Date('2024-02-01')) },
    { _id: objectId(), title: 'Hướng Dẫn Đo Size Dây Chuyền', slug: 'huong-dan-do-size-day-chuyen', image: '/images/articles/huong-dan/huong-dan-size-day-chuyen.png', summary: 'Hướng dẫn chọn size dây chuyền bạc phù hợp.', content: 'BẢNG SIZE:\n- 35cm: Choker\n- 40cm: Trên xương quai xanh\n- 45cm: Phổ biến nhất\n- 50cm: Trên ngực', type: 'Hướng Dẫn', author: 'TRƯƠNG THỊ TUYẾT KHOA', images: [], createdAt: isoDate(new Date('2024-02-15')), updatedAt: isoDate(new Date('2024-02-15')) },
    { _id: objectId(), title: 'Hướng Dẫn Thanh Toán', slug: 'huong-dan-thanh-toan', image: '/images/articles/huong-dan/huong-dan-thanh-toan.png', summary: 'Hướng dẫn các phương thức thanh toán tại Jensy.', content: '1. Chuyển khoản ngân hàng\n2. Thanh toán qua MoMo\n3. COD - Thanh toán khi nhận hàng', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-02-20')), updatedAt: isoDate(new Date('2024-02-20')) },
    { _id: objectId(), title: 'Hướng Dẫn Đặt Viết Thiệp Theo Yêu Cầu', slug: 'huong-dan-dat-viet-thiep-theo-yeu-cau', image: '/images/articles/huong-dan/huong-dan-thiep.png', summary: 'Viết thiệp theo yêu cầu - Tạo điểm nhấn đặc biệt cho quà tặng.', content: 'CÁCH ĐẶT VIẾT THIỆP:\n1. Chọn sản phẩm\n2. Ghi chú: "YÊU CẦU VIẾT THIỆP"\n3. Kèm nội dung\n4. Jensy sẽ viết tay', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-03-01')), updatedAt: isoDate(new Date('2024-03-01')) },
    { _id: objectId(), title: 'Hướng Dẫn Đặt Khắc Theo Yêu Cầu', slug: 'huong-dan-dat-khac-theo-yeu-cau', image: '/images/articles/huong-dan/huong-dan-khac-ten.png', summary: 'Cách đặt dịch vụ khắc tên lên trang sức bạc tại Jensy.', content: 'Bước 1: Chọn sản phẩm\nBước 2: Ghi nội dung khắc\nBước 3: Xác nhận thiết kế\n\nPhí khắc: 30.000đ - 50.000đ', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-03-10')), updatedAt: isoDate(new Date('2024-03-10')) },
    { _id: objectId(), title: 'Hướng Dẫn Làm Sáng Bạc Tại Nhà', slug: 'huong-dan-lam-sang-bac-tai-nha', image: '/images/articles/huong-dan/huong-dan-lam-sang-bac.png', summary: 'Cách làm sáng bạc dễ và hiệu quả nhất.', content: '1. Chanh + muối hạt to\n2. Kem đánh răng\n3. Nước rửa bạc chuyên dụng', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-04-01')), updatedAt: isoDate(new Date('2024-04-01')) },
    { _id: objectId(), title: 'Hướng Dẫn Đặt Nhiều Sản Phẩm Trong Cùng 1 Đơn Hàng', slug: 'huong-dan-dat-nhieu-san-pham-trong-cung-1-don-hang', image: '/images/articles/huong-dan/huong-dan-nhieu-sp.png', summary: 'Cách đặt nhiều sản phẩm trong 1 đơn hàng để tiết kiệm ship.', content: 'Bước 1: Chọn SP → Thêm vào giỏ\nBước 2: Tiếp tục mua sắm\nBước 3: Vào giỏ hàng\nBước 4: Thanh toán', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-04-10')), updatedAt: isoDate(new Date('2024-04-10')) },
    { _id: objectId(), title: 'Hướng Dẫn Sử Dụng Và Bảo Quản Bạc', slug: 'huong-dan-su-dung-va-bao-quan-bac', image: '/images/articles/huong-dan/huong-dan-bao-quan-bac.png', summary: 'Để trang sức bạc luôn sáng đẹp, cần lưu ý bảo quản đúng cách.', content: '❌ KHÔNG NÊN: Tiếp xúc hóa chất, đeo khi tắm\n✅ NÊN: Lau bằng khăn mềm, bảo quản hộp kín', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-04-15')), updatedAt: isoDate(new Date('2024-04-15')) },
    { _id: objectId(), title: 'Hướng Dẫn Sử Dụng Và Chỉnh Sửa Nhẫn Freesize', slug: 'huong-dan-su-dung-va-chinh-sua-nhan-freesize', image: '/images/articles/huong-dan/huong-dan-freesize.png', summary: 'Nhẫn freesize sẽ giải quyết nỗi lo về size nhẫn.', content: 'Nhẫn freesize cho phép điều chỉnh kích thước.\n\nCách chỉnh: Nhẹ nhàng bóp/mở.\nKHÔNG bẻ mạnh.', type: 'Hướng Dẫn', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2024-04-20')), updatedAt: isoDate(new Date('2024-04-20')) },
    // Tin Tức
    { _id: objectId(), title: '✨ CHÚC MỪNG NĂM MỚI 2026 – JENSY ✨', slug: 'chuc-mung-nam-moi-2026-jensy', image: '/images/articles/news/news-newyear-2026.png', summary: 'Cảm ơn bạn đã luôn đồng hành cùng Jensy. Chúc năm mới An Khang – Hạnh Phúc.', content: 'Giảm 10% toàn bộ sản phẩm\nMiễn phí ship đơn từ 300K\nÁp dụng từ 01/01 - 15/01/2026', type: 'Tin Tức', author: 'Tâm', images: [], createdAt: isoDate(new Date('2026-01-01')), updatedAt: isoDate(new Date('2026-01-01')) },
    { _id: objectId(), title: 'Happy Valentine !', slug: 'happy-valentine', image: '/images/articles/news/news-valentine.png', summary: 'Tình yêu luôn được tạo nên từ những điều tinh tế và chân thành.', content: 'VALENTINE COLLECTION\nGiảm 15% sản phẩm Cặp Đôi\nTặng thiệp viết tay + hộp quà cao cấp', type: 'Tin Tức', author: 'Tâm', images: [], createdAt: isoDate(new Date('2026-02-01')), updatedAt: isoDate(new Date('2026-02-01')) },
    { _id: objectId(), title: 'Món quà bạn tặng nói lên điều gì?', slug: 'mon-qua-ban-tang-noi-len-dieu-gi', image: '/images/articles/news/news-mon-qua.png', summary: 'Món quà bạn tặng đang "nói" gì với cô ấy?', content: '💎 NHẪN = "Anh muốn gắn bó"\n💎 DÂY CHUYỀN = "Em luôn ở trong tim anh"\n💎 LẮC TAY = "Anh luôn bên cạnh em"', type: 'Tin Tức', author: 'Tâm', images: [], createdAt: isoDate(new Date('2026-02-05')), updatedAt: isoDate(new Date('2026-02-05')) },
    { _id: objectId(), title: 'Checklist quà Valentine cho "người hay quên"', slug: 'checklist-qua-valentine-cho-nguoi-hay-quen', image: '/images/articles/news/news-checklist.png', summary: 'Không cần hoàn hảo. Chỉ cần đừng quên.', content: 'CHECKLIST QUÀ VALENTINE:\n☐ Dây chuyền bạc\n☐ Nhẫn đôi\n☐ Lắc tay bạc\n☐ Set quà tặng', type: 'Tin Tức', author: 'Tâm', images: [], createdAt: isoDate(new Date('2026-02-08')), updatedAt: isoDate(new Date('2026-02-08')) },
    { _id: objectId(), title: 'Lịch Làm Việc Tết Bính Ngọ 2026', slug: 'lich-lam-viec-tet-binh-ngo-2026', image: '/images/articles/news/news-lich-tet.png', summary: 'CSKH vẫn hoạt động xuyên Tết. Ngừng giao hàng 15/2-25/2.', content: 'Ngừng nhận đơn: 15/2 - 25/2/2026\nBắt đầu lại: 26/2/2026\nGiảm 10% + Tặng lì xì', type: 'Tin Tức', author: 'NGUYỄN MINH NHÂN', images: [], createdAt: isoDate(new Date('2026-01-20')), updatedAt: isoDate(new Date('2026-01-20')) },
    { _id: objectId(), title: 'Valentine Đến Nhà, Jensy Trao Quà', slug: 'valentine-den-nha-jensy-trao-qua', image: '/images/articles/news/news-valentine-gift.png', summary: 'Valentine là ngày để trao nhau những món bạc nhỏ mà ý nghĩa lớn.', content: 'Giao hàng ĐÚNG NGÀY 14/2\nMiễn phí gói quà Valentine\nTặng hoa hồng sáp cho đơn từ 800K', type: 'Tin Tức', author: 'BÌNH DƯƠNG THÁI', images: [], createdAt: isoDate(new Date('2026-02-10')), updatedAt: isoDate(new Date('2026-02-10')) },
    { _id: objectId(), title: '✨Happy New Year 2026✨', slug: 'happy-new-year-2026', image: '/images/articles/news/news-happy-newyear.png', summary: 'JENSY chúc quý khách Sức khỏe dồi dào – An yên trọn vẹn.', content: 'Năm 2025: 15.000 khách hàng mới, 50+ mẫu mới, 99% feedback tích cực', type: 'Tin Tức', author: 'Uyên', images: [], createdAt: isoDate(new Date('2025-12-31')), updatedAt: isoDate(new Date('2025-12-31')) },
    { _id: objectId(), title: 'Giáng Sinh Rộn Ràng, Quà Tặng Ngập Tràn 🎄', slug: 'giang-sinh-ron-rang-qua-tang-ngap-tran', image: '/images/articles/news/news-christmas.png', summary: 'Giáng Sinh - mùa của sự sẻ chia và trao tặng yêu thương.', content: 'Giảm 20% toàn bộ (24-25/12)\nGiảm 15% đơn từ 500K (20-26/12)\nMiễn phí gói quà Noel', type: 'Tin Tức', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2025-12-20')), updatedAt: isoDate(new Date('2025-12-20')) },
    { _id: objectId(), title: 'Chúc Mừng Năm Mới Ất Tỵ 2025', slug: 'chuc-mung-nam-moi-at-ty-2025', image: '/images/articles/news/news-tet-2025.png', summary: 'Jensy chúc quý khách An Khang – Thịnh Vượng – Hạnh Phúc!', content: 'Flash Sale giảm đến 30% Mùng 1-3 Tết\nTặng bao lì xì\nMiễn phí ship toàn quốc', type: 'Tin Tức', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2025-01-25')), updatedAt: isoDate(new Date('2025-01-25')) },
    { _id: objectId(), title: '🌸 ĐEO GÌ ĐI CHƠI TẾT? 🌸', slug: 'deo-gi-di-choi-tet', image: '/images/articles/news/news-deo-tet.png', summary: 'Tết đến rồi! Thêm chút lấp lánh cho outfit Tết của bạn.', content: 'ÁO DÀI + Dây chuyền ngọc\nĐẦM PARTY + Bông tai Moissanite\nÁO KHOÁC + Lắc tay\nĐỒ ĐÔI + Set nhẫn đôi', type: 'Tin Tức', author: 'PHẠM HẠ TUYÊN', images: [], createdAt: isoDate(new Date('2025-01-20')), updatedAt: isoDate(new Date('2025-01-20')) },
];

// ============================================================
// 5. BANNERS
// ============================================================
const bannerFiles = fs.readdirSync(path.join(__dirname, 'public', 'images', 'banners'))
    .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();

const bannerTitles = [
    'Trang Sức Bạc Cao Cấp JENSY', 'Bộ Sưu Tập Mới 2026', 'Flash Sale - Giảm 50%',
    'Valentine Collection', 'Quà Tặng Ý Nghĩa', 'Kim Cương Moissanite GRA',
    'Bạc S925 Chính Hãng', 'Miễn Phí Ship Đơn 500K', 'Combo Tiết Kiệm',
    'New Arrivals', 'Best Seller 2025', 'Set Quà Tặng Premium'
];
const positions = ['homepage_hero', 'homepage_sub', 'homepage_flash_sale', 'category_top'];

const banners = bannerFiles.map((file, idx) => ({
    _id: objectId(),
    title: bannerTitles[idx % bannerTitles.length] + (idx >= bannerTitles.length ? ` ${idx + 1}` : ''),
    subtitle: `Jensy - Lấp Lánh Em Xinh`,
    image: `/images/banners/${file}`,
    imageMobile: null,
    link: '/',
    position: positions[idx % positions.length],
    isActive: idx < 20,
    order: idx + 1,
    startDate: null,
    endDate: null,
    createdAt: isoDate(new Date('2024-01-01')),
    updatedAt: isoDate(now),
}));

// ============================================================
// 6. ORDERS (mẫu)
// ============================================================
const orders = [];
if (productIds.length >= 3) {
    const p1 = products[0];
    const p2 = products[1];
    const p3 = products[10] || products[2];

    orders.push({
        _id: objectId(),
        orderItems: [
            { name: p1.name, amount: 1, image: p1.image, price: p1.price, discount: p1.discount, product: p1._id },
            { name: p2.name, amount: 2, image: p2.image, price: p2.price, discount: p2.discount, product: p2._id },
        ],
        shippingAddress: { fullName: 'Nguyễn Văn A', address: '123 Nguyễn Huệ, Quận 1', ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP Hồ Chí Minh', phone: '0912345678' },
        paymentMethod: 'COD',
        deliveryType: 'delivery',
        itemsPrice: p1.price + p2.price * 2,
        shippingPrice: 30000,
        discountAmount: 0,
        totalPrice: p1.price + p2.price * 2 + 30000,
        note: 'Giao giờ hành chính',
        user: customerId,
        status: 'delivered',
        isPaid: true,
        paidAt: isoDate(new Date('2025-03-15')),
        isDelivered: true,
        deliveredAt: isoDate(new Date('2025-03-17')),
        createdAt: isoDate(new Date('2025-03-13')),
        updatedAt: isoDate(new Date('2025-03-17')),
    });

    orders.push({
        _id: objectId(),
        orderItems: [
            { name: p3.name, amount: 1, image: p3.image, price: p3.price, discount: p3.discount, product: p3._id },
        ],
        shippingAddress: { fullName: 'Nguyễn Văn A', address: '123 Nguyễn Huệ, Quận 1', ward: 'Phường Bến Nghé', district: 'Quận 1', city: 'TP Hồ Chí Minh', phone: '0912345678' },
        paymentMethod: 'VNPay',
        deliveryType: 'delivery',
        itemsPrice: p3.price,
        shippingPrice: 0,
        discountAmount: 0,
        totalPrice: p3.price,
        note: '',
        user: customerId,
        status: 'pending',
        isPaid: false,
        isDelivered: false,
        createdAt: isoDate(new Date('2026-04-10')),
        updatedAt: isoDate(new Date('2026-04-10')),
    });
}

// ============================================================
// WRITE FILES
// ============================================================
const collections = {
    'users': users,
    'products': products,
    'categories': categories,
    'posts': posts,
    'banners': banners,
    'orders': orders,
};

for (const [name, data] of Object.entries(collections)) {
    const filePath = path.join(OUTPUT_DIR, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ${name}.json — ${data.length} documents`);
}

console.log(`\n📁 Tất cả file JSON đã được tạo trong thư mục: ${OUTPUT_DIR}`);
console.log('\n📌 Hướng dẫn import vào MongoDB Atlas:');
console.log('1. Vào MongoDB Atlas → Database → Browse Collections');
console.log('2. Chọn database "ecommerce"');
console.log('3. Click "Add Data" → "Insert Document" hoặc dùng mongoimport');
console.log('4. Hoặc dùng lệnh: mongoimport --uri "mongodb+srv://..." --collection products --file products.json --jsonArray');
