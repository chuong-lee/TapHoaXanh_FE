const mysql = require('mysql2/promise');

// Cấu hình database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'taphuaxanh'
};

async function checkDatabaseImages() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Đã kết nối database');

    // Lấy dữ liệu hình ảnh từ database
    const [rows] = await connection.execute(`
      SELECT id, name, images 
      FROM product 
      WHERE deletedAt IS NULL 
      ORDER BY id DESC
      LIMIT 10
    `);

    console.log(`📦 Tìm thấy ${rows.length} sản phẩm`);
    console.log('\n📊 Dữ liệu hình ảnh trong database:');
    
    rows.forEach((product, index) => {
      console.log(`${index + 1}. ID: ${product.id}`);
      console.log(`   Tên: ${product.name}`);
      console.log(`   Images: ${product.images}`);
      console.log(`   Type: ${typeof product.images}`);
      console.log(`   Length: ${product.images ? product.images.length : 0}`);
      console.log('');
    });

    // Kiểm tra các loại hình ảnh khác nhau
    const [imageTypes] = await connection.execute(`
      SELECT 
        CASE 
          WHEN images LIKE 'http%' THEN 'URL'
          WHEN images LIKE 'client/images/%' THEN 'Local Path'
          WHEN images LIKE '/client/images/%' THEN 'Absolute Path'
          WHEN images IS NULL OR images = '' THEN 'Empty'
          ELSE 'Other'
        END as image_type,
        COUNT(*) as count
      FROM product 
      WHERE deletedAt IS NULL 
      GROUP BY image_type
    `);

    console.log('📈 Phân loại hình ảnh:');
    imageTypes.forEach(type => {
      console.log(`   - ${type.image_type}: ${type.count} sản phẩm`);
    });

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
checkDatabaseImages();
