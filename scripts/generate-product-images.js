const fs = require('fs');
const path = require('path');

// Tạo thư mục nếu chưa có
const imagesDir = path.join(__dirname, '../public/client/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Copy file product.png thành nhiều file khác nhau
const sourceFile = path.join(imagesDir, 'product.png');

if (fs.existsSync(sourceFile)) {
  console.log('✅ File product.png đã tồn tại, sử dụng làm placeholder');
  
  // Tạo thêm một số file placeholder khác
  const placeholderFiles = [
    'product-placeholder-1.png',
    'product-placeholder-2.png', 
    'product-placeholder-3.png',
    'product-placeholder-4.png',
    'product-placeholder-5.png'
  ];
  
  placeholderFiles.forEach((filename, index) => {
    const targetFile = path.join(imagesDir, filename);
    if (!fs.existsSync(targetFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✅ Đã tạo ${filename}`);
    } else {
      console.log(`⏭️  ${filename} đã tồn tại`);
    }
  });
  
  console.log('\n🎉 Hoàn thành tạo hình ảnh placeholder!');
  console.log('📁 Các file đã tạo:');
  fs.readdirSync(imagesDir)
    .filter(file => file.includes('product') || file.includes('placeholder'))
    .forEach(file => console.log(`   - ${file}`));
    
} else {
  console.log('❌ Không tìm thấy file product.png');
  console.log('💡 Hãy tạo file product.png trong public/client/images/ trước');
}
