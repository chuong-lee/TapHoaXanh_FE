const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Cấu hình database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taphuaxanh'
};

async function generateProductImages() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Đã kết nối database');

    // Lấy danh sách tất cả sản phẩm
    const [rows] = await connection.execute(`
      SELECT id, name, images 
      FROM product 
      WHERE deletedAt IS NULL 
      ORDER BY id
    `);

    console.log(`📦 Tìm thấy ${rows.length} sản phẩm`);

    // Tạo thư mục images nếu chưa có
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
      return;
    }

    // Tạo hình ảnh cho từng sản phẩm
    let createdCount = 0;
    let skippedCount = 0;

    for (const product of rows) {
      const targetFile = path.join(imagesDir, `product-${product.id}.png`);
      
      if (fs.existsSync(targetFile)) {
        console.log(`⏭️  product-${product.id}.png đã tồn tại`);
        skippedCount++;
      } else {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`✅ Đã tạo product-${product.id}.png cho "${product.name}"`);
        createdCount++;
      }
    }

    console.log('\n🎉 Hoàn thành!');
    console.log(`📊 Thống kê:`);
    console.log(`   - Đã tạo: ${createdCount} file`);
    console.log(`   - Đã có: ${skippedCount} file`);
    console.log(`   - Tổng cộng: ${rows.length} sản phẩm`);

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

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Đã đóng kết nối database');
    }
  }
}

// Chạy script
generateProductImages();
