# API Documentation - Jensy E-Commerce Backend

> **Base URL:** `https://jewelry-backend-xi.vercel.app`
>
> **Last Updated:** 2026-04-22

> [!NOTE]
>
> - 🔒 **Admin**: Cần header `Authorization: Bearer {access_token}` từ tài khoản admin (isAdmin = true)
> - 🔑 **Auth**: Cần header `Authorization: Bearer {access_token}` từ tài khoản đã đăng nhập (admin hoặc chính user đó)
> - ❌ **Public**: Không cần token
> - 🖼️ **Images**: Ảnh sản phẩm/bài viết/banner/feedback được lưu trên **Cloudinary** — sử dụng URL trực tiếp từ API response (không cần serve riêng)

---

## 1. 👤 User (`/api/user`)

| #   | Name             | Method   | Full URL                                                         | Auth     | Params / Body                                                                                                                   |
| --- | ---------------- | -------- | ---------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Đăng ký          | `POST`   | `https://jewelry-backend-xi.vercel.app/api/user/sign-up`         | ❌       | **Body:** `{ "name": "Admin", "email": "admin@gmail.com", "password": "123", "confirmPassword": "123", "phone": "0123456789" }` |
| 2   | Đăng nhập        | `POST`   | `https://jewelry-backend-xi.vercel.app/api/user/sign-in`         | ❌       | **Body:** `{ "email": "admin@gmail.com", "password": "123" }`                                                                   |
| 3   | Đăng xuất        | `POST`   | `https://jewelry-backend-xi.vercel.app/api/user/sign-out`        | ❌       | None                                                                                                                            |
| 4   | Refresh Token    | `POST`   | `https://jewelry-backend-xi.vercel.app/api/user/refresh-token`   | ❌       | **Cookie:** `refresh_token`                                                                                                     |
| 5   | Đăng nhập Google | `POST`   | `https://jewelry-backend-xi.vercel.app/api/user/google-login`    | ❌       | **Body:** `{ "tokenId": "..." }`                                                                                                |
| 6   | Chi tiết user    | `GET`    | `https://jewelry-backend-xi.vercel.app/api/user/get-details/:id` | 🔑 Auth  | **Path:** `id` = User ID                                                                                                        |
| 7   | Cập nhật user    | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/user/update-user/:id` | 🔑 Auth  | **Path:** `id` · **Body:** `{ "name", "phone", ... }`                                                                           |
| 8   | Lấy tất cả user  | `GET`    | `https://jewelry-backend-xi.vercel.app/api/user/get-all`         | 🔒 Admin | None                                                                                                                            |
| 9   | Xóa user         | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/user/delete-user/:id` | 🔒 Admin | **Path:** `id` = User ID                                                                                                        |
| 10  | Xóa nhiều user   | `POST`   | `https://jewelry-backend-xi.vercel.app/api/user/delete-many`     | 🔒 Admin | **Body:** `{ "ids": ["id1", "id2"] }`                                                                                           |

---

## 2. 📦 Product (`/api/product`)

| #   | Name                    | Method   | Full URL                                                                  | Auth     | Params / Body                                                                                  |
| --- | ----------------------- | -------- | ------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| 1   | Lấy tất cả sản phẩm     | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-all`               | ❌       | **Query:** `?limit=10&page=0&sort=asc&filter=name&filter=Nhẫn`                                 |
| 2   | Chi tiết sản phẩm       | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-details/:id`       | ❌       | **Path:** `id` = Product ID                                                                    |
| 3   | Lấy tất cả type         | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-all-type`          | ❌       | None                                                                                           |
| 4   | Lấy tất cả category     | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-all-category`      | ❌       | None                                                                                           |
| 5   | Tìm kiếm sản phẩm       | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/search`                | ❌       | **Query:** `?q=nhẫn bạc`                                                                       |
| 6   | Sản phẩm Flash Sale     | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-flash-sale`        | ❌       | None                                                                                           |
| 7   | Sản phẩm mới            | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-new`               | ❌       | None                                                                                           |
| 8   | Sản phẩm bán chạy       | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-bestseller`        | ❌       | None                                                                                           |
| 9   | SP theo danh mục (slug) | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-by-category/:slug` | ❌       | **Path:** `slug` = category slug                                                               |
| 10  | Sản phẩm liên quan      | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-related/:id`       | ❌       | **Path:** `id` = Product ID                                                                    |
| 11  | SP theo slug            | `GET`    | `https://jewelry-backend-xi.vercel.app/api/product/get-by-slug/:slug`     | ❌       | **Path:** `slug` = product slug                                                                |
| 12  | Tạo sản phẩm            | `POST`   | `https://jewelry-backend-xi.vercel.app/api/product/create`                | 🔒 Admin | **Body:** `{ "name", "image", "type", "price", "countInStock", "rating", "description", ... }` |
| 13  | Cập nhật sản phẩm       | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/product/update/:id`            | 🔒 Admin | **Path:** `id` · **Body:** các trường cần update                                               |
| 14  | Xóa sản phẩm            | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/product/delete/:id`            | 🔒 Admin | **Path:** `id`                                                                                 |
| 15  | Xóa nhiều SP            | `POST`   | `https://jewelry-backend-xi.vercel.app/api/product/delete-many`           | 🔒 Admin | **Body:** `{ "ids": ["id1", "id2"] }`                                                          |

---

## 3. 🛒 Order (`/api/order`)

| #   | Name                | Method   | Full URL                                                                | Auth     | Params / Body                                                                                                                                                |
| --- | ------------------- | -------- | ----------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Tạo đơn hàng        | `POST`   | `https://jewelry-backend-xi.vercel.app/api/order/create/:id`            | 🔑 Auth  | **Path:** `id` = User ID · **Body:** `{ "orderItems", "paymentMethod", "itemsPrice", "shippingPrice", "totalPrice", "fullName", "address", "city", "phone", "user", "isPaid", "paidAt" }` |
| 2   | Đơn hàng của user   | `GET`    | `https://jewelry-backend-xi.vercel.app/api/order/get-all-order/:id`     | 🔑 Auth  | **Path:** `id` = User ID                                                                                                                                     |
| 3   | Chi tiết đơn hàng   | `GET`    | `https://jewelry-backend-xi.vercel.app/api/order/get-details-order/:id` | ❌       | **Path:** `id` = Order ID                                                                                                                                    |
| 4   | Hủy đơn hàng        | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/order/cancel-order/:id`      | 🔑 Auth  | **Path:** `id` (không dùng) · **Body:** `{ "orderId": "...", "orderItems": [...] }`                                                                          |
| 5   | Tất cả đơn hàng     | `GET`    | `https://jewelry-backend-xi.vercel.app/api/order/get-all-order`         | 🔒 Admin | None                                                                                                                                                         |
| 6   | Cập nhật trạng thái | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/order/update-status/:id`     | 🔒 Admin | **Path:** `id` · **Body:** `{ "status": "pending"|"confirmed"|"shipping"|"delivered"|"cancelled", "cancelReason"(opt) }`                                     |

> [!NOTE]
> **Email xác nhận đã bị tắt.** Backend không gửi email sau khi tạo đơn. Trường `email` trong body không còn được sử dụng.

---

## 4. 💳 Payment (`/api/payment`)

| #   | Name                 | Method | Full URL                                                             | Auth    | Params / Body                                                                          |
| --- | -------------------- | ------ | -------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------- |
| 1   | Lấy PayPal Client ID | `GET`  | `https://jewelry-backend-xi.vercel.app/api/payment/config`           | ❌      | None                                                                                   |
| 2   | Tạo URL VNPay        | `POST` | `https://jewelry-backend-xi.vercel.app/api/payment/vnpay/create-url` | 🔑 Auth | **Body:** `{ "orderId": "...", "amount": 500000, "orderInfo": "Thanh toan don hang" }` |
| 3   | VNPay Callback       | `GET`  | `https://jewelry-backend-xi.vercel.app/api/payment/vnpay/callback`   | ❌      | VNPay tự redirect                                                                      |
| 4   | VNPay IPN            | `POST` | `https://jewelry-backend-xi.vercel.app/api/payment/vnpay/ipn`        | ❌      | VNPay tự gọi                                                                           |

---

## 5. 📝 Post (`/api/post`)

| #   | Name                | Method   | Full URL                                                         | Auth     | Params / Body                                                 |
| --- | ------------------- | -------- | ---------------------------------------------------------------- | -------- | ------------------------------------------------------------- |
| 1   | Lấy tất cả bài viết | `GET`    | `https://jewelry-backend-xi.vercel.app/api/post/get-all`         | ❌       | **Query:** `?limit=10&page=0`                                 |
| 2   | Chi tiết bài viết   | `GET`    | `https://jewelry-backend-xi.vercel.app/api/post/get-details/:id` | ❌       | **Path:** `id`                                                |
| 3   | Bài viết theo loại  | `GET`    | `https://jewelry-backend-xi.vercel.app/api/post/type/:type`      | ❌       | **Path:** `type` (kiem-dinh, feedback, huong-dan, tin-tuc)    |
| 4   | Bài viết theo slug  | `GET`    | `https://jewelry-backend-xi.vercel.app/api/post/slug/:slug`      | ❌       | **Path:** `slug`                                              |
| 5   | Tạo bài viết        | `POST`   | `https://jewelry-backend-xi.vercel.app/api/post/create`          | 🔒 Admin | **Body:** `{ "title", "image", "content", "type", "author" }` |
| 6   | Cập nhật bài viết   | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/post/update/:id`      | 🔒 Admin | **Path:** `id` · **Body:** các trường cần update              |
| 7   | Xóa bài viết        | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/post/delete/:id`      | 🔒 Admin | **Path:** `id`                                                |

---

## 6. 📂 Category (`/api/category`)

| #   | Name                | Method   | Full URL                                                               | Auth     | Params / Body                                     |
| --- | ------------------- | -------- | ---------------------------------------------------------------------- | -------- | ------------------------------------------------- |
| 1   | Lấy tất cả danh mục | `GET`    | `https://jewelry-backend-xi.vercel.app/api/category/get-all`           | ❌       | None                                              |
| 2   | Lấy cây danh mục    | `GET`    | `https://jewelry-backend-xi.vercel.app/api/category/get-tree`          | ❌       | None                                              |
| 3   | Danh mục theo slug  | `GET`    | `https://jewelry-backend-xi.vercel.app/api/category/get-by-slug/:slug` | ❌       | **Path:** `slug`                                  |
| 4   | Tạo danh mục        | `POST`   | `https://jewelry-backend-xi.vercel.app/api/category/create`            | 🔒 Admin | **Body:** `{ "name", "slug", "parent", "image" }` |
| 5   | Cập nhật danh mục   | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/category/update/:id`        | 🔒 Admin | **Path:** `id`                                    |
| 6   | Xóa danh mục        | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/category/delete/:id`        | 🔒 Admin | **Path:** `id`                                    |
| 7   | Tất cả DM (Admin)   | `GET`    | `https://jewelry-backend-xi.vercel.app/api/category/admin/get-all`     | 🔒 Admin | None                                              |

---

## 7. 💬 Feedback (`/api/feedback`)

| #   | Name                    | Method   | Full URL                                                                  | Auth     | Params / Body                                                                                    |
| --- | ----------------------- | -------- | ------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| 1   | Feedback đã duyệt       | `GET`    | `https://jewelry-backend-xi.vercel.app/api/feedback/get-approved`         | ❌       | **Query:** `?page=0&limit=10`                                                                    |
| 2   | Gửi feedback            | `POST`   | `https://jewelry-backend-xi.vercel.app/api/feedback/create`               | 🔑 Auth  | **Body:** `{ "userId", "userName", "userAvatar"(opt), "content", "images"[](opt, tối đa 5) }` |
| 3   | Tất cả feedback (Admin) | `GET`    | `https://jewelry-backend-xi.vercel.app/api/feedback/get-all`              | 🔒 Admin | **Query:** `?page=0&limit=20`                                                                    |
| 4   | Duyệt feedback          | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/feedback/approve/:id`          | 🔒 Admin | **Path:** `id`                                                                                   |
| 5   | Xóa feedback            | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/feedback/delete/:id`           | 🔒 Admin | **Path:** `id`                                                                                   |

> **Lưu ý:** `content` là bắt buộc. `images` là mảng URL ảnh (Cloudinary), tối đa **5 ảnh** mỗi feedback. Tương thích ngược: vẫn có thể truyền `image` (string) thay vì `images` (array).

---

## 8. 🖼️ Feedback Album (`/api/feedback-album`)

> **Gallery ảnh feedback** từ khách hàng thực tế — được nhóm thành album. Khác với `/api/feedback` (khách hàng gửi đánh giá văn bản cần đăng nhập).

| #   | Name                      | Method   | Full URL                                                                         | Auth     | Params / Body                                                                                              |
| --- | ------------------------- | -------- | -------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Tất cả album (Public)      | `GET`    | `https://jewelry-backend-xi.vercel.app/api/feedback-album/get-all`               | ❌       | **Query:** `?page=0&limit=20`                                                                               |
| 2   | Chi tiết album theo slug  | `GET`    | `https://jewelry-backend-xi.vercel.app/api/feedback-album/detail/:slug`          | ❌       | **Path:** `slug`                                                                                            |
| 3   | Tất cả album (Admin)      | `GET`    | `https://jewelry-backend-xi.vercel.app/api/feedback-album/admin/get-all`         | 🔒 Admin | **Query:** `?page=0&limit=20`                                                                               |
| 4   | Tạo album                 | `POST`   | `https://jewelry-backend-xi.vercel.app/api/feedback-album/create`                | 🔒 Admin | **Body:** `{ "title", "images": [...], "description"(opt), "thumbnail"(opt), "author"(opt), "sortOrder"(opt) }` |
| 5   | Cập nhật album            | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/feedback-album/update/:id`            | 🔒 Admin | **Path:** `id` · **Body:** các trường cần update                                                       |
| 6   | Xóa album                 | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/feedback-album/delete/:id`            | 🔒 Admin | **Path:** `id`                                                                                             |

> **Schema fields:** `title`, `slug` (tự tạo), `description`, `thumbnail` (URL Cloudinary), `images[]` (mảng URL), `author`, `isActive`, `sortOrder`

> **Response mẫu** `GET /api/feedback-album/get-all`:
> ```json
> {
>   "status": "OK",
>   "data": [{
>     "_id": "69e3cfff91c7b29eaa707b29",
>     "title": "Feedback của TikToker Vân Anh Vũ - Gần 300K Followers",
>     "slug": "feedback-cua-tiktoker-van-anh-vu-gan-300k-followers",
>     "thumbnail": "https://res.cloudinary.com/drxum5uxt/image/upload/v.../jensy/feedback/...",
>     "images": ["https://res.cloudinary.com/drxum5uxt/..."],
>     "author": "Uyên",
>     "isActive": true,
>     "sortOrder": 1
>   }],
>   "total": 3
> }
> ```

---

## 9. 🛍️ Cart (`/api/cart`)

| #   | Name                     | Method   | Full URL                                                               | Auth    | Params / Body                                             |
| --- | ------------------------ | -------- | ---------------------------------------------------------------------- | ------- | --------------------------------------------------------- |
| 1   | Lấy giỏ hàng             | `GET`    | `https://jewelry-backend-xi.vercel.app/api/cart/:userId`               | 🔑 Auth | **Path:** `userId`                                        |
| 2   | Thêm vào giỏ             | `POST`   | `https://jewelry-backend-xi.vercel.app/api/cart/add`                   | 🔑 Auth | **Body:** `{ "userId", "productId", "quantity"(opt, mặc định 1) }`   |
| 3   | Cập nhật số lượng        | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/cart/update`                | 🔑 Auth | **Body:** `{ "userId", "productId", "quantity" }`                     |
| 4   | Xóa 1 sản phẩm           | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/cart/remove`                | 🔑 Auth | **Body:** `{ "userId", "productId" }`                               |
| 5   | Xóa toàn bộ giỏ          | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/cart/clear/:userId`         | 🔑 Auth | **Path:** `userId`                                        |

> **Lưu ý:** Response của `GET /api/cart/:userId` bao gồm `totalPrice` được tính tự động (áp dụng giá flash sale / discount nếu có). Khi `quantity <= 0` ở endpoint update, sản phẩm sẽ bị xóa khỏi giỏ.

---

## 10. ❤️ Wishlist (`/api/wishlist`)

| #   | Name              | Method   | Full URL                                                           | Auth    | Params / Body                         |
| --- | ----------------- | -------- | ------------------------------------------------------------------ | ------- | ------------------------------------- |
| 1   | Lấy wishlist      | `GET`    | `https://jewelry-backend-xi.vercel.app/api/wishlist/:userId`       | 🔑 Auth | **Path:** `userId`                    |
| 2   | Thêm/Bỏ yêu thích | `POST`   | `https://jewelry-backend-xi.vercel.app/api/wishlist/toggle`        | 🔑 Auth | **Body:** `{ "userId", "productId" }` |
| 3   | Xóa toàn bộ       | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/wishlist/clear/:userId` | 🔑 Auth | **Path:** `userId`                    |

---

## 11. 🖼️ Banner (`/api/banner`)

| #   | Name                  | Method   | Full URL                                                           | Auth     | Params / Body                                        |
| --- | --------------------- | -------- | ------------------------------------------------------------------ | -------- | ---------------------------------------------------- |
| 1   | Lấy tất cả banner     | `GET`    | `https://jewelry-backend-xi.vercel.app/api/banner/get-all`         | ❌       | None                                                 |
| 2   | Banner theo vị trí    | `GET`    | `https://jewelry-backend-xi.vercel.app/api/banner/get-by-position` | ❌       | **Query:** `?position=home-slider`                   |
| 3   | Tạo banner            | `POST`   | `https://jewelry-backend-xi.vercel.app/api/banner/create`          | 🔒 Admin | **Body:** `{ "image", "title", "link", "position" }` |
| 4   | Cập nhật banner       | `PUT`    | `https://jewelry-backend-xi.vercel.app/api/banner/update/:id`      | 🔒 Admin | **Path:** `id`                                       |
| 5   | Xóa banner            | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/banner/delete/:id`      | 🔒 Admin | **Path:** `id`                                       |
| 6   | Tất cả banner (Admin) | `GET`    | `https://jewelry-backend-xi.vercel.app/api/banner/admin/get-all`   | 🔒 Admin | None                                                 |

---

## 12. 📤 Upload (`/api/upload`)

| #   | Name             | Method   | Full URL                                                  | Auth     | Params / Body                          |
| --- | ---------------- | -------- | --------------------------------------------------------- | -------- | -------------------------------------- |
| 1   | Upload 1 ảnh     | `POST`   | `https://jewelry-backend-xi.vercel.app/api/upload/image`  | 🔒 Admin | **Body (form-data):** `image` (file)   |
| 2   | Upload nhiều ảnh | `POST`   | `https://jewelry-backend-xi.vercel.app/api/upload/images` | 🔒 Admin | **Body (form-data):** `images` (files) |
| 3   | Xóa ảnh          | `DELETE` | `https://jewelry-backend-xi.vercel.app/api/upload/image`  | 🔒 Admin | **Body:** `{ "imagePath": "..." }`     |

---

## 13. 📍 Address (`/api/address`)

| #   | Name                 | Method | Full URL                                                                    | Auth | Params / Body                                               |
| --- | -------------------- | ------ | --------------------------------------------------------------------------- | ---- | ----------------------------------------------------------- |
| 1   | Danh sách tỉnh/thành | `GET`  | `https://jewelry-backend-xi.vercel.app/api/address/provinces`               | ❌   | None                                                        |
| 2   | Quận/huyện theo tỉnh | `GET`  | `https://jewelry-backend-xi.vercel.app/api/address/districts/:provinceCode` | ❌   | **Path:** `provinceCode`                                    |
| 3   | Phường/xã theo quận  | `GET`  | `https://jewelry-backend-xi.vercel.app/api/address/wards/:districtCode`     | ❌   | **Path:** `districtCode`                                    |
| 4   | Tính phí vận chuyển  | `POST` | `https://jewelry-backend-xi.vercel.app/api/address/shipping-fee`            | ❌   | **Body:** `{ "cityName": "Hà Nội", "orderAmount": 500000 }` |

---

## 14. 📊 Admin Dashboard (`/api/admin`)

| #   | Name                | Method | Full URL                                                        | Auth     | Params / Body              |
| --- | ------------------- | ------ | --------------------------------------------------------------- | -------- | -------------------------- |
| 1   | Thống kê tổng quan  | `GET`  | `https://jewelry-backend-xi.vercel.app/api/admin/dashboard`     | 🔒 Admin | None                       |
| 2   | Biểu đồ doanh thu   | `GET`  | `https://jewelry-backend-xi.vercel.app/api/admin/revenue-chart` | 🔒 Admin | **Query:** `?period=month` |
| 3   | SP bán chạy nhất    | `GET`  | `https://jewelry-backend-xi.vercel.app/api/admin/top-products`  | 🔒 Admin | None                       |
| 4   | Đơn hàng gần đây    | `GET`  | `https://jewelry-backend-xi.vercel.app/api/admin/recent-orders` | 🔒 Admin | None                       |
| 5   | Thống kê đơn hàng   | `GET`  | `https://jewelry-backend-xi.vercel.app/api/admin/order-stats`   | 🔒 Admin | None                       |
| 6   | Thống kê người dùng | `GET`  | `https://jewelry-backend-xi.vercel.app/api/admin/user-stats`    | 🔒 Admin | None                       |

---

## 15. 📁 Static Files & Images

| #   | Name                              | Cloudinary Folder                              | Mô tả                                                                                     |
| --- | --------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Ảnh sản phẩm                      | `jensy/products/`                              | Ảnh chính sản phẩm — field `image` trong Product response                                 |
| 2   | Ảnh chi tiết sản phẩm             | `jensy/products_details/`                      | Ảnh phụ sản phẩm — field `images[]` trong Product response                                |
| 3   | Ảnh bài viết (Posts)              | `jensy/posts/`                                 | Ảnh bài viết — field `image` trong Post response                                          |
| 4   | Ảnh banner                        | `jensy/banners/`                               | Ảnh banner — field `image` trong Banner response                                          |
| 5   | Album feedback khách hàng         | `jensy/feedback/`                              | Ảnh album feedback — field `thumbnail` & `images[]` trong FeedbackAlbum response          |
| 6   | Ảnh upload từ admin               | `https://jewelry-backend-xi.vercel.app/uploads/{filename}` | Ảnh do admin upload thủ công qua `/api/upload`                          |

> [!TIP]
> Tất cả ảnh sản phẩm, banner, bài viết và feedback album đã được lưu trên **Cloudinary** (`https://res.cloudinary.com/drxum5uxt/`). URL đã có sẵn trong response của API — không cần serve qua backend.

### Cloudinary URL Format

```
https://res.cloudinary.com/drxum5uxt/image/upload/v{version}/jensy/{folder}/{filename}
```

**Ví dụ:**
- Ảnh posts: `https://res.cloudinary.com/drxum5uxt/image/upload/v.../jensy/posts/DeoGiChoiTet.png`
- Album feedback: `https://res.cloudinary.com/drxum5uxt/image/upload/v.../jensy/feedback/nhung-feedback-khach-hang-cua-jensy-2024/1.png`
