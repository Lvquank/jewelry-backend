# 🚀 Deploy Backend lên Vercel

## Bước 1: Truy cập Vercel và kết nối GitHub

1. Vào https://vercel.com
2. Click **"Add New..." → "Project"**
3. Chọn repository: **jewelry-backend** (hoặc tên repo của bạn)
4. Click **"Import"**

## Bước 2: Cấu hình Environment Variables

Trong màn hình **Environment Variables**, thêm:

```
MongoDB = mongodb+srv://quankle:5122004@cluster0.mxwybde.mongodb.net/ecommerce?retryWrites=true&w=majority
ACCESS_TOKEN = access_token_secret
REFRESH_TOKEN = refresh_token_secret
CLIENT_ID = your_paypal_client_id
GOOGLE_CLIENT_ID = your_google_client_id
```

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
const API_URL = 'https://jewelry-backend-XXXXX.vercel.app'
```

## ⚠️ Lưu ý quan trọng

- **Static files** (`public/images`): Vercel không serve static files từ `public` folder trực tiếp. Cần dùng CDN hoặc upload ảnh lên cloud storage khác.
- **Database Connection**: Đảm bảo MongoDB Atlas whitelist IP addresses của Vercel (hoặc cho phép `0.0.0.0/0`)

## 📞 Troubleshooting

Nếu gặp lỗi:
1. Xem logs trong **Vercel Dashboard → Deployments → View Build Logs**
2. Kiểm tra Environment Variables đã đúng chưa
3. Đảm bảo MongoDB connection string hợp lệ
