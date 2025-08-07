import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tap_hoa_xanh'
}

// GET /api/test-db - Test database connection and get categories
export async function GET() {
  let connection: mysql.Connection | null = null
  
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig)
    
    // Test query to get categories
    const [rows] = await connection.execute('SELECT * FROM categories LIMIT 10')
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      categories: rows,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user
      }
    }, { status: 500 })
    
  } finally {
    // Close connection
    if (connection) {
      await connection.end()
    }
  }
}
