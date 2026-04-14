# 📸 Image Management - Hướng Dẫn Quản Lý Ảnh

## 📊 Tóm Tắt Hiện Trạng

```
✅ 159 items (135 sản phẩm + 24 bài viết)
✅ 100% ảnh sử dụng server local (/images/...)
✅ 0 URL external
✅ Tất cả sản phẩm có ảnh chi tiết
```

---

## 📁 Cấu Trúc Thư Mục Ảnh

### Ảnh Sản Phẩm

```
public/images/products/
├── bong-tai/              (19 ảnh - 19 sản phẩm)
├── charm/                 (7 ảnh - 7 sản phẩm)
├── day-chuyen/            (37 ảnh - 37 sản phẩm)
├── khac/                  (4 ảnh - 4 sản phẩm)
├── lac-vong-tay/          (22 ảnh - 22 sản phẩm)
└── nhan/                  (30 ảnh - 46 sản phẩm)

public/images/products_details/
├── bong-tai/              (Chi tiết sản phẩm)
├── charm/
├── day-chuyen/
├── khac/
├── lac-vong-tay/
└── nhan/
```

### Ảnh Bài Viết

```
public/images/articles/
├── kiem-dinh/             (2 ảnh - 2 bài)
├── feedback/              (3 ảnh - 3 bài)
├── huong-dan/             (9 ảnh - 9 bài)
└── news/                  (10 ảnh - 10 bài)

public/images/articles_details/
├── kiem-dinh/             (Chi tiết bài viết)
├── feedback/
├── huong-dan/
└── news/
```

---

## 🔗 Định Dạng Đường Dẫn Ảnh

### Sản Phẩm (Products)

**Ảnh chính (Main Image):**
```
/images/products/{category}/{filename}.png
```

**Ví dụ:**
```javascript
{
  name: "Bông Tai Moissanite 'Bowtie'",
  type: "Bông Tai Bạc",
  category: "Bông Tai Bạc",
  image: "/images/products/bong-tai/01_GBDDDDW060487.png",
  images: ["/images/products/bong-tai/01_GBDDDDW060487.png"]
}
```

### Bài Viết (Posts)

**Ảnh đại diện (Cover Image):**
```
/images/articles/{type}/{filename}.png
```

**Ví dụ:**
```javascript
{
  title: "Giấy Kiểm Định Kim Cương Moissanite Chuẩn GRA",
  type: "Kiểm Định",
  slug: "giay-kiem-dinh-kim-cuong-moissanite-gra-chuan",
  image: "/images/articles/kiem-dinh/kiem-dinh-giv.png",
  images: []  // Ảnh phụ trong bài viết (nếu có)
}
```

---

## 📊 Thống Kê Chi Tiết

### Sản Phẩm Theo Loại

| Loại | Số Lượng | Ảnh Chính | Ảnh Chi Tiết |
|------|----------|----------|------------|
| Bông Tai Bạc | 19 | 19/19 ✅ | 19/19 ✅ |
| Charm Bạc | 7 | 7/7 ✅ | 7/7 ✅ |
| Dây Chuyền Bạc | 37 | 37/37 ✅ | 37/37 ✅ |
| Set Trang Sức | 4 | 4/4 ✅ | 4/4 ✅ |
| Lắc Tay Bạc | 22 | 22/22 ✅ | 22/22 ✅ |
| Nhẫn Bạc | 46 | 46/46 ✅ | 46/46 ✅ |
| **TỔNG** | **135** | **135/135 ✅** | **135/135 ✅** |

### Bài Viết Theo Loại

| Loại | Số Lượng | Ảnh Đại Diện |
|------|----------|------------|
| Kiểm Định | 2 | 2/2 ✅ |
| Feedback | 3 | 3/3 ✅ |
| Hướng Dẫn | 9 | 9/9 ✅ |
| Tin Tức | 10 | 10/10 ✅ |
| **TỔNG** | **24** | **24/24 ✅** |

---

## 🛠️ Scripts Quản Lý Ảnh

### 1. **updateImagePaths.js**
Cập nhật ảnh sản phẩm từ folder `products/`
```bash
node updateImagePaths.js
```

### 2. **updateAllImages.js**
Cập nhật toàn bộ ảnh sản phẩm, bài viết, và ảnh chi tiết
```bash
node updateAllImages.js
```

### 3. **verifyImagePaths.js**
Kiểm tra và in báo cáo chi tiết về toàn bộ ảnh
```bash
node verifyImagePaths.js
```

### 4. **checkProducts.js**
Kiểm tra thông tin sản phẩm trong MongoDB
```bash
node checkProducts.js
```

---

## 🚀 Cách Sử Dụng Ảnh Trong Frontend

### Hiển Thị Ảnh Sản Phẩm

```jsx
// Ảnh chính
<img src={`http://localhost:3001${product.image}`} alt={product.name} />

// Ảnh chi tiết
{product.images && product.images.map((img, idx) => (
  <img key={idx} src={`http://localhost:3001${img}`} alt={`${product.name} ${idx}`} />
))}
```

### Hiển Thị Ảnh Bài Viết

```jsx
// Ảnh đại diện
<img src={`http://localhost:3001${post.image}`} alt={post.title} />

// Ảnh phụ
{post.images && post.images.map((img, idx) => (
  <img key={idx} src={`http://localhost:3001${img}`} alt={`${post.title} ${idx}`} />
))}
```

---

## 📝 MongoDB Schema

### Product Model
```javascript
{
  _id: ObjectId,
  name: String,                    // Tên sản phẩm
  slug: String,                    // URL-friendly name
  image: "/images/products/...",   // Ảnh chính
  images: ["/images/products/..."], // Ảnh chi tiết
  type: String,                    // Bông Tai, Dây Chuyền, v.v...
  category: String,                // Bông Tai Bạc, Dây Chuyền Bạc, v.v...
  material: String,                // Bạc S925, v.v...
  price: Number,
  countInStock: Number,
  // ... các field khác
}
```

### Post Model
```javascript
{
  _id: ObjectId,
  title: String,                   // Tiêu đề bài viết
  slug: String,                    // URL-friendly slug
  image: "/images/articles/...",   // Ảnh đại diện
  images: ["/images/articles_details/..."], // Ảnh phụ
  type: String,                    // Kiểm Định, Feedback, Hướng Dẫn, Tin Tức
  content: String,                 // Nội dung bài viết
  // ... các field khác
}
```

---

## 🔄 Quy Trình Thêm Ảnh Mới

### Thêm Sản Phẩm Mới

1. **Thêm ảnh chính vào:** `public/images/products/{category}/`
   ```
   public/images/products/nhan/31_GNXM00W002266.png
   ```

2. **Thêm ảnh chi tiết vào:** `public/images/products_details/{category}/{SKU}/`
   ```
   public/images/products_details/nhan/31_GNXM00W002266/1.png
   public/images/products_details/nhan/31_GNXM00W002266/2.png
   ```

3. **Tạo sản phẩm trong MongoDB:**
   ```javascript
   {
     name: "Nhẫn Bạc Mới",
     type: "Nhẫn Bạc",
     category: "Nhẫn Bạc",
     image: "/images/products/nhan/31_GNXM00W002266.png",
     images: [
       "/images/products_details/nhan/31_GNXM00W002266/1.png",
       "/images/products_details/nhan/31_GNXM00W002266/2.png"
     ],
     // ... các field khác
   }
   ```

### Thêm Bài Viết Mới

1. **Thêm ảnh đại diện vào:** `public/images/articles/{type}/`
   ```
   public/images/articles/news/news-valentine-gift.png
   ```

2. **Thêm ảnh phụ vào:** `public/images/articles_details/{type}/{slug}/`
   ```
   public/images/articles_details/news/valentine-gift/1.png
   public/images/articles_details/news/valentine-gift/2.png
   ```

3. **Tạo bài viết trong MongoDB:**
   ```javascript
   {
     title: "Món Quà Valentine Ý Nghĩa",
     type: "Tin Tức",
     image: "/images/articles/news/news-valentine-gift.png",
     images: [
       "/images/articles_details/news/valentine-gift/1.png",
       "/images/articles_details/news/valentine-gift/2.png"
     ],
     content: "...",
     // ... các field khác
   }
   ```

---

## ⚙️ Server Configuration

### Express Static Files (src/index.js)

```javascript
// Serve ảnh từ public/images
app.use('/images', express.static(path.join(__dirname, '../public/images')))

// Url đầy đủ: http://localhost:3001/images/products/nhan/31_GNXM00W002266.png
```

---

## 📋 Danh Sách Kiểm Tra

- ✅ Tất cả 135 sản phẩm có ảnh chính từ server local
- ✅ Tất cả 135 sản phẩm có ảnh chi tiết
- ✅ Tất cả 24 bài viết có ảnh đại diện từ server local
- ✅ Không còn URL external trong database
- ✅ Tất cả ảnh đã được định dạng `/images/...`

---

## 🆘 Troubleshooting

### Ảnh không hiển thị
1. Kiểm tra server đang chạy: `npm start`
2. Kiểm tra đường dẫn ảnh: `http://localhost:3001/images/...`
3. Kiểm tra file tồn tại trong: `public/images/...`

### Thêm ảnh mới nhưng cơ sở dữ liệu chưa update
Chạy script xác thực:
```bash
node verifyImagePaths.js
```

### Cập nhật từ URL external sang local
```bash
node updateAllImages.js
```

---

## 📞 Support

Để xem báo cáo chi tiết: `node verifyImagePaths.js`
Để cập nhật ảnh: `node updateAllImages.js`

---

*Cập nhật lần cuối: 2026-04-14*
