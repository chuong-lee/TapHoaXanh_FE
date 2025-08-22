const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupPaymentsTable() {
  let connection;
  
  try {
    // Kết nối database
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 8889,
      user: 'root',
      password: 'root', // Password từ db.ts
      database: 'tap_hoa_xanh'
    });

    console.log('✅ Đã kết nối database thành công');

    // Đọc file SQL
    const sqlFile = path.join(__dirname, 'add_payments_table.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');

    // Thực thi từng câu lệnh SQL
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✅ Thực thi thành công:', statement.substring(0, 50) + '...');
        } catch (error) {
          if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('ℹ️ Cột đã tồn tại, bỏ qua...');
          } else if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log('ℹ️ Bảng đã tồn tại, bỏ qua...');
          } else {
            console.error('❌ Lỗi thực thi SQL:', error.message);
          }
        }
      }
    }

    console.log('🎉 Hoàn thành tạo bảng payments!');

  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Hãy đảm bảo MySQL server đang chạy');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Hãy kiểm tra username/password MySQL');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Chạy script
setupPaymentsTable();
