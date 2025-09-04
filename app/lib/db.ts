import mysql from 'mysql2/promise'

// Database connection pool configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '8889'),
  user: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'tap_hoa_xanh',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
}

// Create connection pool
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    console.log('Creating database pool with config:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    })
    
    pool = mysql.createPool(dbConfig)
    
    // Handle pool events
    pool.on('connection', (connection) => {
      console.log('Database connected as id ' + connection.threadId)
    })

    // Handle pool errors
    pool.on('acquire', function (connection) {
      console.log('Connection %d acquired', connection.threadId)
    })

    pool.on('release', function (connection) {
      console.log('Connection %d released', connection.threadId)
    })
  }
  
  return pool
}

// Execute query with connection pool
export async function executeQuery<T>(
  query: string, 
  params: any[] = []
): Promise<T> {
  const pool = getPool()
  
  try {
    const [rows] = await pool.execute(query, params)
    return rows as T
  } catch (error: any) {
    console.error('Database query error:', error)
    console.error('Query:', query)
    console.error('Params:', params)
    
    // Nếu lỗi database không tồn tại, thử tạo database
    if (error.code === 'ER_BAD_DB_ERROR' || error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('Attempting to create database...')
      try {
        const tempPool = mysql.createPool({
          ...dbConfig,
          database: undefined // Kết nối không chỉ định database
        })
        
        // Tạo database nếu chưa có
        await tempPool.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE || 'tap_hoa_xanh'}`)
        await tempPool.execute(`USE ${process.env.MYSQL_DATABASE || 'tap_hoa_xanh'}`)
        
        // Tạo bảng cần thiết
        await tempPool.execute(`
          CREATE TABLE IF NOT EXISTS product (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            images TEXT,
            discount INT DEFAULT 0,
            description TEXT,
            quantity INT DEFAULT 0,
            category_id INT,
            slug VARCHAR(255),
            rating DECIMAL(3,2) DEFAULT 4.5,
            barcode VARCHAR(100),
            expiry_date DATE,
            origin VARCHAR(255),
            weight_unit VARCHAR(50),
            brandId INT,
            purchase INT DEFAULT 0,
            category_childId INT,
            comment TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deletedAt TIMESTAMP NULL
          )
        `)
        
        await tempPool.execute(`
          CREATE TABLE IF NOT EXISTS category (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            parent_id INT DEFAULT 0,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deletedAt TIMESTAMP NULL
          )
        `)
        
        // Thêm dữ liệu mẫu cho category
        await tempPool.execute(`
          INSERT IGNORE INTO category (id, name, parent_id) VALUES 
          (1, 'Thực phẩm tươi sống', 0),
          (2, 'Trái cây', 0),
          (3, 'Thực phẩm đóng hộp và gia vị', 0),
          (4, 'Thịt tươi', 0),
          (5, 'Thực phẩm hữu cơ và ăn kiêng', 0),
          (6, 'Hải sản', 0),
          (7, 'Sản phẩm từ sữa và phô mai', 0),
          (8, 'Đồ uống', 0)
        `)
        
        // Thêm dữ liệu mẫu cho product
        await tempPool.execute(`
          INSERT IGNORE INTO product (name, price, images, discount, description, quantity, category_id, slug) VALUES 
          ('Rau cải xanh', 15000, '/client/images/vegetables-basket.png', 10, 'Rau cải xanh tươi ngon', 100, 1, 'rau-cai-xanh'),
          ('Rau muống', 12000, '/client/images/vegetables-basket.png', 5, 'Rau muống tươi xanh', 80, 1, 'rau-muong'),
          ('Cà chua', 25000, '/client/images/vegetables-basket.png', 8, 'Cà chua chín đỏ', 60, 1, 'ca-chua'),
          ('Cà rốt', 18000, '/client/images/vegetables-basket.png', 12, 'Cà rốt tươi ngọt', 70, 1, 'ca-rot'),
          ('Bắp cải', 22000, '/client/images/vegetables-basket.png', 6, 'Bắp cải trắng tươi', 45, 1, 'bap-cai'),
          ('Táo đỏ', 45000, '/client/images/apple.jpg', 15, 'Táo đỏ giòn ngọt', 50, 2, 'tao-do'),
          ('Cam sành', 35000, '/client/images/apple.jpg', 10, 'Cam sành mọng nước', 40, 2, 'cam-sanh'),
          ('Chuối', 25000, '/client/images/apple.jpg', 8, 'Chuối chín vàng', 90, 2, 'chuoi'),
          ('Dứa', 30000, '/client/images/apple.jpg', 12, 'Dứa thơm ngọt', 30, 2, 'dua'),
          ('Nho', 55000, '/client/images/apple.jpg', 18, 'Nho đen ngọt', 25, 2, 'nho'),
          ('Thịt heo', 120000, '/client/images/pork.jpg', 5, 'Thịt heo tươi', 30, 4, 'thit-heo'),
          ('Thịt bò', 180000, '/client/images/pork.jpg', 8, 'Thịt bò tươi', 25, 4, 'thit-bo'),
          ('Thịt gà', 95000, '/client/images/pork.jpg', 10, 'Thịt gà tươi', 35, 4, 'thit-ga'),
          ('Cá hồi', 250000, '/client/images/salmon.jpg', 20, 'Cá hồi tươi', 20, 6, 'ca-hoi'),
          ('Tôm sú', 180000, '/client/images/salmon.jpg', 15, 'Tôm sú tươi', 15, 6, 'tom-su'),
          ('Sữa tươi', 35000, '/client/images/salmon.jpg', 8, 'Sữa tươi nguyên kem', 40, 7, 'sua-tuoi'),
          ('Phô mai', 45000, '/client/images/salmon.jpg', 12, 'Phô mai béo ngậy', 30, 7, 'pho-mai'),
          ('Sữa chua', 25000, '/client/images/salmon.jpg', 6, 'Sữa chua tự nhiên', 50, 7, 'sua-chua'),
          ('Bánh mì', 15000, '/client/images/salmon.jpg', 5, 'Bánh mì tươi', 60, 3, 'banh-mi'),
          ('Mì gói', 8000, '/client/images/salmon.jpg', 3, 'Mì gói tiện lợi', 100, 3, 'mi-goi'),
          ('Gạo', 25000, '/client/images/salmon.jpg', 0, 'Gạo trắng thơm', 200, 3, 'gao'),
          ('Dầu ăn', 45000, '/client/images/salmon.jpg', 8, 'Dầu ăn tinh khiết', 80, 3, 'dau-an'),
          ('Nước mắm', 35000, '/client/images/salmon.jpg', 5, 'Nước mắm truyền thống', 70, 3, 'nuoc-mam'),
          ('Hạt chia', 85000, '/client/images/salmon.jpg', 15, 'Hạt chia hữu cơ', 25, 5, 'hat-chia'),
          ('Yến mạch', 65000, '/client/images/salmon.jpg', 10, 'Yến mạch nguyên hạt', 30, 5, 'yen-mach'),
          ('Hạt quinoa', 95000, '/client/images/salmon.jpg', 18, 'Hạt quinoa dinh dưỡng', 20, 5, 'hat-quinoa'),
          ('Trà xanh', 28000, '/client/images/salmon.jpg', 8, 'Trà xanh tự nhiên', 45, 8, 'tra-xanh'),
          ('Cà phê', 32000, '/client/images/salmon.jpg', 12, 'Cà phê đen đậm đà', 40, 8, 'ca-phe'),
          ('Nước cam', 18000, '/client/images/salmon.jpg', 5, 'Nước cam tươi', 55, 8, 'nuoc-cam')
        `)
        
        await tempPool.end()
        console.log('Database and tables created successfully!')
        
        // Thử lại query ban đầu
        const [retryRows] = await pool.execute(query, params)
        return retryRows as T
      } catch (createError) {
        console.error('Failed to create database:', createError)
        throw error // Throw original error
      }
    }
    
    throw error
  }
}

// Get connection for transactions
export async function getConnection(): Promise<mysql.PoolConnection> {
  const pool = getPool()
  return await pool.getConnection()
}

// Close pool (for graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

export default {
  getPool,
  executeQuery,
  getConnection,
  closePool
}