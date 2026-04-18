/**
 * Upload images from public/images/feedback and public/images/posts to Cloudinary
 * Usage: node upload-feedback-posts.js
 */

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGES_DIR = path.join(__dirname, 'public', 'images');
const TARGET_FOLDERS = ['feedback', 'posts'];
const OUTPUT_FILE = path.join(__dirname, 'cloudinary-feedback-posts.json');

// Get all image files recursively from a directory
function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Upload single file to Cloudinary
async function uploadFile(filePath) {
  const relativePath = path.relative(IMAGES_DIR, filePath).replace(/\\/g, '/');
  const folderParts = path.dirname(relativePath).replace(/\\/g, '/');
  const folder = `jensy/${folderParts}`;
  const publicId = path.basename(filePath, path.extname(filePath));

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        public_id: publicId,
        use_filename: false,
        unique_filename: false,
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject({ file: relativePath, error: error.message });
        } else {
          resolve({
            localPath: relativePath,
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
  });
}

// Main upload process
async function main() {
  console.log('===========================================');
  console.log('  Upload feedback & posts => Cloudinary');
  console.log('===========================================\n');
  console.log(`Cloud name : ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Target     : ${TARGET_FOLDERS.join(', ')}\n`);

  // Collect all image files from target folders
  let imageFiles = [];
  for (const folder of TARGET_FOLDERS) {
    const folderPath = path.join(IMAGES_DIR, folder);
    if (fs.existsSync(folderPath)) {
      const files = getImageFiles(folderPath);
      console.log(`📁 ${folder}: ${files.length} ảnh`);
      imageFiles = imageFiles.concat(files);
    } else {
      console.log(`⚠️  Không tìm thấy thư mục: ${folderPath}`);
    }
  }

  console.log(`\nTổng cộng: ${imageFiles.length} ảnh cần upload\n`);
  console.log('-------------------------------------------');

  const results = { success: [], failed: [] };
  let completed = 0;

  for (const filePath of imageFiles) {
    completed++;
    const relativePath = path.relative(IMAGES_DIR, filePath).replace(/\\/g, '/');

    try {
      const result = await uploadFile(filePath);
      results.success.push(result);
      console.log(`[${completed}/${imageFiles.length}] ✅ ${relativePath}`);
      console.log(`              => ${result.cloudinaryUrl}`);
    } catch (err) {
      results.failed.push({ localPath: relativePath, error: err.error });
      console.log(`[${completed}/${imageFiles.length}] ❌ ${relativePath}`);
      console.log(`              => Lỗi: ${err.error}`);
    }
  }

  // Save results to JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  // Summary
  console.log('\n===========================================');
  console.log('              KẾT QUẢ UPLOAD');
  console.log('===========================================');
  console.log(`Tổng số ảnh  : ${imageFiles.length}`);
  console.log(`✅ Thành công : ${results.success.length}`);
  console.log(`❌ Thất bại   : ${results.failed.length}`);
  console.log(`Kết quả lưu  : cloudinary-feedback-posts.json\n`);

  if (results.failed.length > 0) {
    console.log('Danh sách ảnh thất bại:');
    results.failed.forEach((r) => console.log(`  - ${r.localPath}: ${r.error}`));
  }

  if (results.success.length > 0) {
    console.log('\nMột số URL mẫu:');
    results.success.slice(0, 5).forEach((r) => {
      console.log(`  ${r.localPath}`);
      console.log(`  => ${r.cloudinaryUrl}`);
    });
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch(console.error);
