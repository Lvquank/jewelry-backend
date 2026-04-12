const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const BASE_DIR = path.join(__dirname, 'public', 'images');

// ==========================================
// CONFIG
// ==========================================
const PNJ_CATEGORIES = [
  { slug: 'nhan', name: 'nhan', label: 'Nhẫn' },
  { slug: 'day-chuyen', name: 'day-chuyen', label: 'Dây chuyền' },
  { slug: 'bong-tai', name: 'bong-tai', label: 'Bông tai' },
  { slug: 'lac-tay', name: 'lac-tay', label: 'Lắc tay' },
  { slug: 'mat-day-chuyen', name: 'mat-day-chuyen', label: 'Mặt dây chuyền' },
  { slug: 'charm', name: 'charm', label: 'Charm' },
];

// PNJ API endpoint for product listing
const PNJ_API_BASE = 'https://edge-api.pnj.io/ecom-frontend/v1';

// ==========================================
// HTTP HELPERS
// ==========================================
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.pnj.com.vn/',
        'Origin': 'https://www.pnj.com.vn',
      },
      timeout: 15000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Referer': 'https://www.pnj.com.vn/',
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) redirectUrl = parsedUrl.origin + redirectUrl;
        fetchHTML(redirectUrl).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.pnj.com.vn/',
      },
      timeout: 20000,
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        let redirectUrl = response.headers.location;
        if (!redirectUrl.startsWith('http')) redirectUrl = parsedUrl.origin + redirectUrl;
        downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(filepath); });
      fileStream.on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
    });
    request.on('error', reject);
    request.on('timeout', () => { request.destroy(); reject(new Error('Timeout')); });
  });
}

// ==========================================
// EXTRACT PRODUCTS FROM PNJ __NEXT_DATA__
// ==========================================
function extractProductsFromNextData(html) {
  const products = [];
  
  // Find __NEXT_DATA__ JSON
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!match) return products;
  
  try {
    const data = JSON.parse(match[1]);
    const pageProps = data?.props?.pageProps;
    
    // Extract from homePageData (homepage)
    if (pageProps?.homePageData) {
      for (const section of pageProps.homePageData) {
        // Products in banners sections  
        if (section.banners) {
          for (const banner of section.banners) {
            // Banner images
            if (banner.banner_url && banner.banner_url.includes('cdn.pnj.io')) {
              products.push({
                type: 'banner',
                name: banner.banner || banner.title || 'banner',
                image: banner.banner_url,
              });
            }
            // Products in banner
            if (banner.products) {
              for (const p of banner.products) {
                if (p.image) {
                  products.push({
                    type: 'product',
                    name: p.name,
                    sku: p.sku_13,
                    image: p.image,
                    price: p.price,
                    brand: p.brand,
                    category: categorizeProduct(p.name),
                  });
                }
              }
            }
          }
        }
      }
    }
    
    // Extract from category pages
    if (pageProps?.categoryData?.data) {
      for (const section of pageProps.categoryData.data) {
        if (section.data?.banner_url) {
          products.push({
            type: 'banner',
            name: section.data.category || 'category-banner',
            image: section.data.banner_url,
          });
        }
      }
    }
  } catch (e) {
    console.log('  ⚠️ Error parsing __NEXT_DATA__:', e.message);
  }
  
  return products;
}

function categorizeProduct(name) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('nhẫn') || nameLower.includes('nhan')) return 'nhan';
  if (nameLower.includes('bông tai') || nameLower.includes('bong tai')) return 'bong-tai';
  if (nameLower.includes('dây chuyền') || nameLower.includes('day chuyen') || nameLower.includes('dây cổ') || nameLower.includes('day co')) return 'day-chuyen';
  if (nameLower.includes('lắc tay') || nameLower.includes('lac tay') || nameLower.includes('vòng tay') || nameLower.includes('vong tay')) return 'lac-vong-tay';
  if (nameLower.includes('mặt dây') || nameLower.includes('mat day')) return 'mat-day-chuyen';
  if (nameLower.includes('charm') || nameLower.includes('hạt')) return 'charm';
  return 'khac';
}

// ==========================================
// MAIN SCRAPER
// ==========================================
async function scrapePNJ() {
  console.log('═'.repeat(60));
  console.log('🔨 PNJ PRODUCT IMAGE SCRAPER');
  console.log('   Source: https://www.pnj.com.vn/');
  console.log('═'.repeat(60));
  
  const allProducts = [];
  const allBanners = [];
  
  // 1. Scrape homepage
  console.log('\n📄 Fetching homepage...');
  try {
    const html = await fetchHTML('https://www.pnj.com.vn/');
    const items = extractProductsFromNextData(html);
    for (const item of items) {
      if (item.type === 'product') allProducts.push(item);
      else if (item.type === 'banner') allBanners.push(item);
    }
    console.log(`  ✅ Found ${allProducts.length} products, ${allBanners.length} banners from homepage`);
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
  }
  
  // 2. Scrape category pages
  for (const cat of PNJ_CATEGORIES) {
    console.log(`\n📄 Fetching category: ${cat.label} (/${cat.slug}/)...`);
    try {
      const html = await fetchHTML(`https://www.pnj.com.vn/${cat.slug}/`);
      const items = extractProductsFromNextData(html);
      let newProducts = 0;
      for (const item of items) {
        if (item.type === 'product') {
          const exists = allProducts.find(p => p.image === item.image);
          if (!exists) { allProducts.push(item); newProducts++; }
        } else if (item.type === 'banner') {
          const exists = allBanners.find(b => b.image === item.image);
          if (!exists) allBanners.push(item);
        }
      }
      console.log(`  ✅ Found ${newProducts} new products from ${cat.label}`);
    } catch (e) {
      console.log(`  ❌ Error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
  
  // 3. Deduplicate
  const uniqueProducts = [];
  const seenImages = new Set();
  for (const p of allProducts) {
    if (!seenImages.has(p.image)) {
      seenImages.add(p.image);
      uniqueProducts.push(p);
    }
  }
  
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📊 Total unique products: ${uniqueProducts.length}`);
  console.log(`📊 Total banners: ${allBanners.length}`);
  
  // 4. Categorize
  const categories = {};
  for (const p of uniqueProducts) {
    const cat = p.category || 'khac';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  }
  
  console.log('\n📂 Products by category:');
  for (const [cat, prods] of Object.entries(categories)) {
    console.log(`  ${cat}: ${prods.length} products`);
  }
  
  // 5. Download images
  console.log('\n' + '═'.repeat(60));
  console.log('📥 DOWNLOADING IMAGES');
  console.log('═'.repeat(60));
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  // Download products by category
  for (const [cat, prods] of Object.entries(categories)) {
    const dir = path.join(BASE_DIR, 'products', cat);
    fs.mkdirSync(dir, { recursive: true });
    
    console.log(`\n📁 Downloading ${prods.length} ${cat} images...`);
    
    for (let i = 0; i < prods.length; i++) {
      const p = prods[i];
      const ext = path.extname(new URL(p.image).pathname) || '.png';
      const filename = `${String(i + 1).padStart(2, '0')}_${(p.sku || 'product').replace(/[^a-zA-Z0-9]/g, '_')}${ext}`;
      const filepath = path.join(dir, filename);
      
      try {
        await downloadImage(p.image, filepath);
        const stats = fs.statSync(filepath);
        console.log(`  ✅ [${i + 1}/${prods.length}] ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
        totalSuccess++;
      } catch (e) {
        console.log(`  ❌ [${i + 1}/${prods.length}] ${filename} - ${e.message}`);
        totalFailed++;
      }
      await new Promise(r => setTimeout(r, 150));
    }
  }
  
  // Download banners
  const bannerDir = path.join(BASE_DIR, 'banners');
  fs.mkdirSync(bannerDir, { recursive: true });
  
  console.log(`\n📁 Downloading ${allBanners.length} banners...`);
  for (let i = 0; i < allBanners.length; i++) {
    const b = allBanners[i];
    const parsedUrl = new URL(b.image);
    const ext = path.extname(parsedUrl.pathname) || '.jpg';
    const filename = `${String(i + 1).padStart(2, '0')}_banner${ext}`;
    const filepath = path.join(bannerDir, filename);
    
    try {
      await downloadImage(b.image, filepath);
      const stats = fs.statSync(filepath);
      console.log(`  ✅ [${i + 1}/${allBanners.length}] ${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
      totalSuccess++;
    } catch (e) {
      console.log(`  ❌ [${i + 1}/${allBanners.length}] ${filename} - ${e.message}`);
      totalFailed++;
    }
    await new Promise(r => setTimeout(r, 150));
  }
  
  // 6. Save product data as JSON (useful for seeding database)
  const dataFile = path.join(BASE_DIR, 'pnj_products.json');
  const productData = uniqueProducts.map(p => ({
    name: p.name,
    sku: p.sku,
    price: p.price,
    brand: p.brand,
    category: p.category,
    image: p.image,
    localImage: `products/${p.category}/${path.basename(p.image)}`,
  }));
  fs.writeFileSync(dataFile, JSON.stringify(productData, null, 2), 'utf8');
  console.log(`\n💾 Product data saved to: ${dataFile}`);
  
  // 7. Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 DOWNLOAD SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  ✅ Successfully downloaded: ${totalSuccess}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log(`  📦 Total unique products scraped: ${uniqueProducts.length}`);
  console.log(`  🖼️  Total banners scraped: ${allBanners.length}`);
  console.log(`  📂 Saved to: ${BASE_DIR}`);
  console.log('═'.repeat(60));
  console.log('✨ Done!\n');
}

scrapePNJ().catch(console.error);
