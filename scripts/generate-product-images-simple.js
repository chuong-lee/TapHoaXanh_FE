const fs = require('fs');
const path = require('path');

// Tạo thư mục nếu chưa có
const imagesDir = path.join(__dirname, '../public/client/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Kiểm tra file source
const sourceFiles = [
  'product.png',
  'product-1.png',
  'pr-1.png',
  'pr-2.png',
  'pr-3.png',
  'pr-4.png',
  'pr-5.png'
];

let sourceFile = null;
for (const file of sourceFiles) {
  const filePath = path.join(imagesDir, file);
  if (fs.existsSync(filePath)) {
    sourceFile = filePath;
    console.log(`✅ Sử dụng ${file} làm source`);
    break;
  }
}

if (!sourceFile) {
  console.log('❌ Không tìm thấy file source nào');
  process.exit(1);
}

// Tạo hình ảnh cho sản phẩm từ 1-60
const productIds = Array.from({length: 60}, (_, i) => i + 1);
let createdCount = 0;
let skippedCount = 0;

console.log(`📦 Tạo hình ảnh cho ${productIds.length} sản phẩm...`);

for (const productId of productIds) {
  const targetFile = path.join(imagesDir, `product-${productId}.png`);
  
  if (fs.existsSync(targetFile)) {
    console.log(`⏭️  product-${productId}.png đã tồn tại`);
    skippedCount++;
  } else {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Đã tạo product-${productId}.png`);
    createdCount++;
  }
}

console.log('\n🎉 Hoàn thành!');
console.log(`📊 Thống kê:`);
console.log(`   - Đã tạo: ${createdCount} file`);
console.log(`   - Đã có: ${skippedCount} file`);
console.log(`   - Tổng cộng: ${productIds.length} sản phẩm`);

// Hiển thị danh sách file đã tạo
console.log('\n📁 Danh sách file hình ảnh sản phẩm:');
fs.readdirSync(imagesDir)
  .filter(file => file.match(/^product-\d+\.png$/))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  })
  .forEach(file => console.log(`   - ${file}`));
