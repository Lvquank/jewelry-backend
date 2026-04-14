# 🚀 Deploy Backend lên Vercel

## Bước 1: Truy cập Vercel và kết nối GitHub

1. Vào https://vercel.com
2. Click **"Add New..." → "Project"**
3. Chọn repository: **jewelry-backend** (hoặc tên repo của bạn)
4. Click **"Import"**

## ⚠️ SECURITY FIRST - Environment Variables

**KHÔNG bao giờ commit `.env` file chứa credentials lên GitHub!**

1. `.env` đã trong `.gitignore` - không sẽ được push
2. Sử dụng `.env.example` để tham khảo format
3. **Thực hiện cấu hình Environment Variables trực tiếp trên Vercel UI**

## Bước 2: Cấu hình Environment Variables trên Vercel

**MỢI LƯỚI:**
1. Trong Vercel Dashboard → Chọn Project
2. Vào **Settings → Environment Variables**
3. Thêm từng variable:

| Key | Value |
|-----|-------|
| `MongoDB` | `mongodb+srv://quankle:5122004@cluster0.mxwybde.mongodb.net/ecommerce?retryWrites=true&w=majority` |
| `ACCESS_TOKEN` | `access_token_secret_here` |
| `REFRESH_TOKEN` | `refresh_token_secret_here` |
| `CLIENT_ID` | `your_paypal_client_id` |
| `GOOGLE_CLIENT_ID` | `your_google_client_id` |
| `VNPAY_TMN_CODE` | `your_vnpay_code` |
| `VNPAY_HASH_SECRET` | `your_vnpay_secret` |
| `VNPAY_URL` | `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html` |
| `FRONTEND_URL` | `https://your-frontend-domain.com` |

**Quan trọng:**
- Chọn **"Decrypted"** để xem giá trị (không hiển thị public)
- Chỉ Vercel admin mới thấy được
- Environment variables không được push lên GitHub

## Bước 3: Deploy

1. Click **"Deploy"**
2. Chờ khoảng 1-2 phút để Vercel build và deploy
3. Khi thấy ✅ **"Congratulations"** → Deployment hoàn tất!

## 📍 Vercel Project Details

- **Framework**: None (Node.js)
- **Root Directory**: `.` (root của repository)
- **Build Command**: (để trống - Vercel sẽ auto)
- **Install Command**: (để trống - Vercel sẽ auto)
- **Start Command**: `node src/index.js`

## ✅ Kiểm tra Deployment

Sau khi deploy, Vercel sẽ cấp link domain:

```
https://jewelry-backend-XXXXX.vercel.app
```

Test API endpoint:

```
GET https://jewelry-backend-XXXXX.vercel.app/api/product/get-all
```

## 🔗 Liên kết Frontend với Backend

Trong frontend (React), cập nhật API base URL:

```javascript
const API_URL = "https://jewelry-backend-XXXXX.vercel.app";
```

## ⚠️ Lưu ý quan trọng

- **Static files** (`public/images`): Vercel không serve static files từ `public` folder trực tiếp. Cần dùng CDN hoặc upload ảnh lên cloud storage khác.
- **Database Connection**: Đảm bảo MongoDB Atlas whitelist IP addresses của Vercel (hoặc cho phép `0.0.0.0/0`)

## 📞 Troubleshooting

Nếu gặp lỗi:

1. Xem logs trong **Vercel Dashboard → Deployments → View Build Logs**
2. Kiểm tra Environment Variables đã đúng chưa
3. Đảm bảo MongoDB connection string hợp lệ
