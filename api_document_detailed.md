# API Documentation - Jensy E-Commerce Backend

> **Base URL:** `http://localhost:3001`

> [!NOTE]
> - 🔒 **Admin**: Cần header `Authorization: Bearer {access_token}` từ tài khoản admin (isAdmin = true)
> - 🔑 **Auth**: Cần header `Authorization: Bearer {access_token}` từ tài khoản đã đăng nhập (admin hoặc chính user đó)
> - ❌ **Public**: Không cần token

---

## 1. 👤 User (`/api/user`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Đăng ký | `POST` | `http://localhost:3001/api/user/sign-up` | ❌ | **Body:** `{ "name": "Admin", "email": "admin@gmail.com", "password": "123", "confirmPassword": "123", "phone": "0123456789" }` |
| 2 | Đăng nhập | `POST` | `http://localhost:3001/api/user/sign-in` | ❌ | **Body:** `{ "email": "admin@gmail.com", "password": "123" }` |
| 3 | Đăng xuất | `POST` | `http://localhost:3001/api/user/sign-out` | ❌ | None |
| 4 | Refresh Token | `POST` | `http://localhost:3001/api/user/refresh-token` | ❌ | **Cookie:** `refresh_token` |
| 5 | Đăng nhập Google | `POST` | `http://localhost:3001/api/user/google-login` | ❌ | **Body:** `{ "tokenId": "..." }` |
| 6 | Chi tiết user | `GET` | `http://localhost:3001/api/user/get-details/:id` | 🔑 Auth | **Path:** `id` = User ID |
| 7 | Cập nhật user | `PUT` | `http://localhost:3001/api/user/update-user/:id` | 🔑 Auth | **Path:** `id` · **Body:** `{ "name", "phone", ... }` |
| 8 | Lấy tất cả user | `GET` | `http://localhost:3001/api/user/get-all` | 🔒 Admin | None |
| 9 | Xóa user | `DELETE` | `http://localhost:3001/api/user/delete-user/:id` | 🔒 Admin | **Path:** `id` = User ID |
| 10 | Xóa nhiều user | `POST` | `http://localhost:3001/api/user/delete-many` | 🔒 Admin | **Body:** `{ "ids": ["id1", "id2"] }` |

---

## 2. 📦 Product (`/api/product`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Lấy tất cả sản phẩm | `GET` | `http://localhost:3001/api/product/get-all` | ❌ | **Query:** `?limit=10&page=0&sort=asc&filter=name&filter=Nhẫn` |
| 2 | Chi tiết sản phẩm | `GET` | `http://localhost:3001/api/product/get-details/:id` | ❌ | **Path:** `id` = Product ID |
| 3 | Lấy tất cả type | `GET` | `http://localhost:3001/api/product/get-all-type` | ❌ | None |
| 4 | Lấy tất cả category | `GET` | `http://localhost:3001/api/product/get-all-category` | ❌ | None |
| 5 | Tìm kiếm sản phẩm | `GET` | `http://localhost:3001/api/product/search` | ❌ | **Query:** `?q=nhẫn bạc` |
| 6 | Sản phẩm Flash Sale | `GET` | `http://localhost:3001/api/product/get-flash-sale` | ❌ | None |
| 7 | Sản phẩm mới | `GET` | `http://localhost:3001/api/product/get-new` | ❌ | None |
| 8 | Sản phẩm bán chạy | `GET` | `http://localhost:3001/api/product/get-bestseller` | ❌ | None |
| 9 | SP theo danh mục (slug) | `GET` | `http://localhost:3001/api/product/get-by-category/:slug` | ❌ | **Path:** `slug` = category slug |
| 10 | Sản phẩm liên quan | `GET` | `http://localhost:3001/api/product/get-related/:id` | ❌ | **Path:** `id` = Product ID |
| 11 | SP theo slug | `GET` | `http://localhost:3001/api/product/get-by-slug/:slug` | ❌ | **Path:** `slug` = product slug |
| 12 | Tạo sản phẩm | `POST` | `http://localhost:3001/api/product/create` | 🔒 Admin | **Body:** `{ "name", "image", "type", "price", "countInStock", "rating", "description", ... }` |
| 13 | Cập nhật sản phẩm | `PUT` | `http://localhost:3001/api/product/update/:id` | 🔒 Admin | **Path:** `id` · **Body:** các trường cần update |
| 14 | Xóa sản phẩm | `DELETE` | `http://localhost:3001/api/product/delete/:id` | 🔒 Admin | **Path:** `id` |
| 15 | Xóa nhiều SP | `POST` | `http://localhost:3001/api/product/delete-many` | 🔒 Admin | **Body:** `{ "ids": ["id1", "id2"] }` |

---

## 3. 🛒 Order (`/api/order`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Tạo đơn hàng | `POST` | `http://localhost:3001/api/order/create/:id` | 🔑 Auth | **Path:** `id` = User ID · **Body:** `{ "orderItems", "shippingAddress", "paymentMethod", ... }` |
| 2 | Đơn hàng của user | `GET` | `http://localhost:3001/api/order/get-all-order/:id` | 🔑 Auth | **Path:** `id` = User ID |
| 3 | Chi tiết đơn hàng | `GET` | `http://localhost:3001/api/order/get-details-order/:id` | ❌ | **Path:** `id` = Order ID |
| 4 | Hủy đơn hàng | `DELETE` | `http://localhost:3001/api/order/cancel-order/:id` | 🔑 Auth | **Path:** `id` = Order ID |
| 5 | Tất cả đơn hàng | `GET` | `http://localhost:3001/api/order/get-all-order` | 🔒 Admin | None |
| 6 | Cập nhật trạng thái | `PUT` | `http://localhost:3001/api/order/update-status/:id` | 🔒 Admin | **Path:** `id` · **Body:** `{ "status": "delivered" }` |

---

## 4. 💳 Payment (`/api/payment`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Lấy PayPal Client ID | `GET` | `http://localhost:3001/api/payment/config` | ❌ | None |
| 2 | Tạo URL VNPay | `POST` | `http://localhost:3001/api/payment/vnpay/create-url` | 🔑 Auth | **Body:** `{ "orderId": "...", "amount": 500000, "orderInfo": "Thanh toan don hang" }` |
| 3 | VNPay Callback | `GET` | `http://localhost:3001/api/payment/vnpay/callback` | ❌ | VNPay tự redirect |
| 4 | VNPay IPN | `POST` | `http://localhost:3001/api/payment/vnpay/ipn` | ❌ | VNPay tự gọi |

---

## 5. 📝 Post (`/api/post`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Lấy tất cả bài viết | `GET` | `http://localhost:3001/api/post/get-all` | ❌ | **Query:** `?limit=10&page=0` |
| 2 | Chi tiết bài viết | `GET` | `http://localhost:3001/api/post/get-details/:id` | ❌ | **Path:** `id` |
| 3 | Bài viết theo loại | `GET` | `http://localhost:3001/api/post/type/:type` | ❌ | **Path:** `type` (kiem-dinh, feedback, huong-dan, tin-tuc) |
| 4 | Bài viết theo slug | `GET` | `http://localhost:3001/api/post/slug/:slug` | ❌ | **Path:** `slug` |
| 5 | Tạo bài viết | `POST` | `http://localhost:3001/api/post/create` | 🔒 Admin | **Body:** `{ "title", "image", "content", "type", "author" }` |
| 6 | Cập nhật bài viết | `PUT` | `http://localhost:3001/api/post/update/:id` | 🔒 Admin | **Path:** `id` · **Body:** các trường cần update |
| 7 | Xóa bài viết | `DELETE` | `http://localhost:3001/api/post/delete/:id` | 🔒 Admin | **Path:** `id` |

---

## 6. 📂 Category (`/api/category`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Lấy tất cả danh mục | `GET` | `http://localhost:3001/api/category/get-all` | ❌ | None |
| 2 | Lấy cây danh mục | `GET` | `http://localhost:3001/api/category/get-tree` | ❌ | None |
| 3 | Danh mục theo slug | `GET` | `http://localhost:3001/api/category/get-by-slug/:slug` | ❌ | **Path:** `slug` |
| 4 | Tạo danh mục | `POST` | `http://localhost:3001/api/category/create` | 🔒 Admin | **Body:** `{ "name", "slug", "parent", "image" }` |
| 5 | Cập nhật danh mục | `PUT` | `http://localhost:3001/api/category/update/:id` | 🔒 Admin | **Path:** `id` |
| 6 | Xóa danh mục | `DELETE` | `http://localhost:3001/api/category/delete/:id` | 🔒 Admin | **Path:** `id` |
| 7 | Tất cả DM (Admin) | `GET` | `http://localhost:3001/api/category/admin/get-all` | 🔒 Admin | None |

---

## 7. ⭐ Review (`/api/review`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Review theo SP | `GET` | `http://localhost:3001/api/review/product/:productId` | ❌ | **Path:** `productId` |
| 2 | Tạo review | `POST` | `http://localhost:3001/api/review/create` | 🔑 Auth | **Body:** `{ "productId", "rating", "comment" }` |
| 3 | Tất cả review | `GET` | `http://localhost:3001/api/review/get-all` | 🔒 Admin | None |
| 4 | Duyệt review | `PUT` | `http://localhost:3001/api/review/approve/:id` | 🔒 Admin | **Path:** `id` |
| 5 | Xóa review | `DELETE` | `http://localhost:3001/api/review/delete/:id` | 🔒 Admin | **Path:** `id` |

---

## 8. ❤️ Wishlist (`/api/wishlist`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Lấy wishlist | `GET` | `http://localhost:3001/api/wishlist/:userId` | 🔑 Auth | **Path:** `userId` |
| 2 | Thêm/Bỏ yêu thích | `POST` | `http://localhost:3001/api/wishlist/toggle` | 🔑 Auth | **Body:** `{ "userId", "productId" }` |
| 3 | Xóa toàn bộ | `DELETE` | `http://localhost:3001/api/wishlist/clear/:userId` | 🔑 Auth | **Path:** `userId` |

---

## 9. 🖼️ Banner (`/api/banner`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Lấy tất cả banner | `GET` | `http://localhost:3001/api/banner/get-all` | ❌ | None |
| 2 | Banner theo vị trí | `GET` | `http://localhost:3001/api/banner/get-by-position` | ❌ | **Query:** `?position=home-slider` |
| 3 | Tạo banner | `POST` | `http://localhost:3001/api/banner/create` | 🔒 Admin | **Body:** `{ "image", "title", "link", "position" }` |
| 4 | Cập nhật banner | `PUT` | `http://localhost:3001/api/banner/update/:id` | 🔒 Admin | **Path:** `id` |
| 5 | Xóa banner | `DELETE` | `http://localhost:3001/api/banner/delete/:id` | 🔒 Admin | **Path:** `id` |
| 6 | Tất cả banner (Admin) | `GET` | `http://localhost:3001/api/banner/admin/get-all` | 🔒 Admin | None |

---

## 10. 📞 Contact (`/api/contact`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Gửi form liên hệ | `POST` | `http://localhost:3001/api/contact/create` | ❌ | **Body:** `{ "name", "email", "phone", "message" }` |
| 2 | Lấy tất cả liên hệ | `GET` | `http://localhost:3001/api/contact/get-all` | 🔒 Admin | None |
| 3 | Cập nhật trạng thái | `PUT` | `http://localhost:3001/api/contact/update-status/:id` | 🔒 Admin | **Path:** `id` · **Body:** `{ "status" }` |
| 4 | Xóa liên hệ | `DELETE` | `http://localhost:3001/api/contact/delete/:id` | 🔒 Admin | **Path:** `id` |

---

## 11. 📤 Upload (`/api/upload`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Upload 1 ảnh | `POST` | `http://localhost:3001/api/upload/image` | 🔒 Admin | **Body (form-data):** `image` (file) |
| 2 | Upload nhiều ảnh | `POST` | `http://localhost:3001/api/upload/images` | 🔒 Admin | **Body (form-data):** `images` (files) |
| 3 | Xóa ảnh | `DELETE` | `http://localhost:3001/api/upload/image` | 🔒 Admin | **Body:** `{ "imagePath": "..." }` |

---

## 12. 📍 Address (`/api/address`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Danh sách tỉnh/thành | `GET` | `http://localhost:3001/api/address/provinces` | ❌ | None |
| 2 | Quận/huyện theo tỉnh | `GET` | `http://localhost:3001/api/address/districts/:provinceCode` | ❌ | **Path:** `provinceCode` |
| 3 | Phường/xã theo quận | `GET` | `http://localhost:3001/api/address/wards/:districtCode` | ❌ | **Path:** `districtCode` |
| 4 | Tính phí vận chuyển | `POST` | `http://localhost:3001/api/address/shipping-fee` | ❌ | **Body:** `{ "cityName": "Hà Nội", "orderAmount": 500000 }` |

---

## 13. 📊 Admin Dashboard (`/api/admin`)

| # | Name | Method | Full URL | Auth | Params / Body |
|---|------|--------|----------|------|---------------|
| 1 | Thống kê tổng quan | `GET` | `http://localhost:3001/api/admin/dashboard` | 🔒 Admin | None |
| 2 | Biểu đồ doanh thu | `GET` | `http://localhost:3001/api/admin/revenue-chart` | 🔒 Admin | **Query:** `?period=month` |
| 3 | SP bán chạy nhất | `GET` | `http://localhost:3001/api/admin/top-products` | 🔒 Admin | None |
| 4 | Đơn hàng gần đây | `GET` | `http://localhost:3001/api/admin/recent-orders` | 🔒 Admin | None |
| 5 | Thống kê đơn hàng | `GET` | `http://localhost:3001/api/admin/order-stats` | 🔒 Admin | None |
| 6 | Thống kê người dùng | `GET` | `http://localhost:3001/api/admin/user-stats` | 🔒 Admin | None |

---

## 14. 📁 Static Files

| # | Name | Full URL | Mô tả |
|---|------|----------|-------|
| 1 | Uploaded images | `http://localhost:3001/uploads/{filename}` | Ảnh do admin upload |
| 2 | Public images | `http://localhost:3001/images/{path}` | Ảnh sản phẩm, banner, bài viết |
