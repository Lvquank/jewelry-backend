# 🎯 MongoDB Image Update - Quick Reference

## ✨ Current Status

```
📦 135 Products:  ✅ 100% with server images (/images/...)
📰 24 Posts:      ✅ 100% with server images (/images/...)
📸 865 Total Images in public/images folder
```

---

## 📊 Image Structure

### Products (135 total)
- Bông Tai Bạc: 19
- Charm Bạc: 7
- Dây Chuyền Bạc: 37
- Lắc Tay Bạc: 22
- Nhẫn Bạc: 46
- Set Trang Sức: 4

### Posts (24 total)
- Kiểm Định: 2
- Feedback: 3
- Hướng Dẫn: 9
- Tin Tức: 10

---

## 🎬 Image Paths Format

### Products
```
Main Image:     /images/products/{category}/{filename}
Detail Images:  /images/products_details/{category}/{sku}/{filename}
```

### Posts
```
Cover Image:    /images/articles/{type}/{filename}
Detail Images:  /images/articles_details/{type}/{slug}/{filename}
```

---

## ⚡ Quick Commands

### Check Status
```bash
node verifyImagePaths.js
```
Shows detailed report of all images with statistics.

### Update Images
```bash
node updateAllImages.js
```
Scans public/images and updates MongoDB with correct paths.

### Check Products
```bash
node checkProducts.js
```
Lists all products with their types and categories.

---

## 🔗 Server URL Pattern

```
Local: http://localhost:3001{image_path}

Example:
- Product: http://localhost:3001/images/products/nhan/01_GNDD00W006416.png
- Post: http://localhost:3001/images/articles/news/news-tet-2025.png
```

---

## 📱 Frontend Usage

```jsx
// Products
<img src={`http://localhost:3001${product.image}`} />

// Posts
<img src={`http://localhost:3001${post.image}`} />
```

---

## ✅ Verification Checklist

- [x] All 135 products have local server images
- [x] All 135 products have detail images
- [x] All 24 posts have server images
- [x] No external URLs in database
- [x] 865 images organized in public/images

---

## 🆘 If Images Not Showing

1. Check server is running: `npm start`
2. Verify image exists: `public/images/...`
3. Check path starts with `/images/`
4. Run: `node verifyImagePaths.js`

---

*Last Updated: 2026-04-14*
