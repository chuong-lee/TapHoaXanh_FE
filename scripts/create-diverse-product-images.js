const fs = require('fs');
const path = require('path');

// Tạo thư mục nếu chưa có
const imagesDir = path.join(__dirname, '../public/client/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Danh sách file source có sẵn
const sourceFiles = [
  'product.png',
  'product-1.png',
  'pr-1.png',
  'pr-2.png',
  'pr-3.png',
  'pr-4.png',
  'pr-5.png'
];

// Kiểm tra file source nào có sẵn
const availableSources = [];
for (const file of sourceFiles) {
  const filePath = path.join(imagesDir, file);
  if (fs.existsSync(filePath)) {
    availableSources.push(filePath);
    console.log(`✅ Tìm thấy ${file}`);
  }
}

if (availableSources.length === 0) {
  console.log('❌ Không tìm thấy file source nào');
  process.exit(1);
}

console.log(`📦 Sử dụng ${availableSources.length} file source`);

// Tạo hình ảnh đa dạng cho sản phẩm từ 1-60
const productIds = Array.from({length: 60}, (_, i) => i + 1);
let createdCount = 0;
let updatedCount = 0;

console.log(`🎨 Tạo hình ảnh đa dạng cho ${productIds.length} sản phẩm...`);

for (const productId of productIds) {
  const targetFile = path.join(imagesDir, `product-${productId}.png`);
  
  // Chọn source file ngẫu nhiên dựa trên productId
  const sourceIndex = productId % availableSources.length;
  const sourceFile = availableSources[sourceIndex];
  
  if (fs.existsSync(targetFile)) {
    // Cập nhật file hiện có với source khác
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`🔄 Cập nhật product-${productId}.png với source ${path.basename(sourceFile)}`);
    updatedCount++;
  } else {
    // Tạo file mới
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Tạo product-${productId}.png với source ${path.basename(sourceFile)}`);
    createdCount++;
  }
}

console.log('\n🎉 Hoàn thành!');
console.log(`📊 Thống kê:`);
console.log(`   - Đã tạo: ${createdCount} file`);
console.log(`   - Đã cập nhật: ${updatedCount} file`);
console.log(`   - Tổng cộng: ${productIds.length} sản phẩm`);

// Hiển thị phân bố hình ảnh
console.log('\n📊 Phân bố hình ảnh:');
const distribution = {};
for (const productId of productIds) {
  const sourceIndex = productId % availableSources.length;
  const sourceName = path.basename(availableSources[sourceIndex]);
  distribution[sourceName] = (distribution[sourceName] || 0) + 1;
}

Object.entries(distribution).forEach(([source, count]) => {
  console.log(`   - ${source}: ${count} sản phẩm`);
});
