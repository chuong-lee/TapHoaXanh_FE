import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise';

// Interface for database row
interface CategoryRow {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  count: number
}

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tap_hoa_xanh'
}

// GET /api/categories - Get all categories
export async function GET() {
  let connection: mysql.Connection | null = null
  
  try {
    // Create database connection
    connection = await mysql.createConnection(dbConfig)
    
    // Get all categories with product count
    const [rows] = await connection.execute(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.created_at,
        c.updated_at,
        COUNT(p.id) as count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at
      ORDER BY c.id ASC
    `)
    
    // Format categories data
    const categories = (rows as CategoryRow[]).map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      count: row.count,
      color: getColorForCategory(row.id),
      icon: `/client/images/category-${row.id}.png`
    }))
    
    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length
    })
    
  } catch (error) {
    console.error('Error fetching categories:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    
  } finally {
    // Close connection
    if (connection) {
      await connection.end()
    }
  }
}

// Helper function to assign colors to categories
function getColorForCategory(categoryId: number): string {
  const colors = [
    '#4CAF50', // Green - Đồ uống
    '#FF9800', // Orange - Nông sản thực phẩm  
    '#2196F3', // Blue - Thủy hải sản
    '#9C27B0', // Purple - Thực phẩm tự chăn nuôi
    '#F44336', // Red - Thực phẩm chế biến
    '#795548', // Brown - Gia vị & nguyên liệu nấu ăn
    '#E91E63', // Pink - Đồ ăn vặt & bánh kẹo
    '#607D8B', // Blue Grey - Thức uống thực phẩm
    '#FF5722'  // Deep Orange - Đặc sản & thực phẩm truyền thống
  ]
  
  return colors[(categoryId - 1) % colors.length] || '#4CAF50'
}
