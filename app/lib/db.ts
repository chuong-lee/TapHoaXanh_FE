import mysql from 'mysql2/promise'

// Database connection pool configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tap_hoa_xanh',
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

    pool.on('error', (err) => {
      console.error('Database pool error:', err)
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Recreate pool if connection is lost
        pool = mysql.createPool(dbConfig)
      } else {
        throw err
      }
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
  } catch (error) {
    console.error('Database query error:', error)
    console.error('Query:', query)
    console.error('Params:', params)
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