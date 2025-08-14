const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function updateUserPasswords() {
  // Create connection
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'tap_hoa_xanh'
  });

  try {
    // Hash password
    const hashedPassword = bcrypt.hashSync('password', 10);
    console.log('Hashed password:', hashedPassword);

    // Update existing users with hashed password
    const updateQuery = `
      UPDATE users 
      SET password = ? 
      WHERE id IN (101, 102, 103, 104, 105)
    `;
    
    const [result] = await connection.execute(updateQuery, [hashedPassword]);
    console.log('Updated users:', result.affectedRows);

    // Insert demo user for testing
    const insertQuery = `
      INSERT INTO users (id, name, email, phone, password, role, image, createdAt, updatedAt) 
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
      password = VALUES(password),
      updatedAt = NOW()
    `;

    const demoUsers = [
      {
        id: 1,
        name: 'Demo User',
        email: 'demo@gmail.com',
        phone: '+84123456789',
        password: hashedPassword,
        role: 'user',
        image: '/client/images/profile.jpg'
      },
      {
        id: 2,
        name: 'Admin User',
        email: 'admin@gmail.com',
        phone: '+84987654321',
        password: hashedPassword,
        role: 'admin',
        image: '/client/images/profile.jpg'
      }
    ];

    for (const user of demoUsers) {
      await connection.execute(insertQuery, [
        user.id,
        user.name,
        user.email,
        user.phone,
        user.password,
        user.role,
        user.image
      ]);
      console.log(`Inserted/Updated demo user: ${user.email}`);
    }

    console.log('Database update completed successfully!');

  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await connection.end();
  }
}

updateUserPasswords();