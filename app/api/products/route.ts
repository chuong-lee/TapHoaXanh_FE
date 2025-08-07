import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Interface for database rows
interface ProductRow {
  id: number
  name: string
  price: string
  slug: string
  images: string
  discount: string
  description: string
  stock: number
  rating: string
  featured: number
  created_at: string
  updated_at: string
  category: string
  category_id: number
}

interface CountRow {
  total: number
}

// Database connection config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tap_hoa_xanh'
}

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  let connection: mysql.Connection | null = null
  
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const categoryId = searchParams.get('category_id')
    
    const offset = (page - 1) * limit
    
    // Create database connection
    connection = await mysql.createConnection(dbConfig)
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1'
    const params: (string | number)[] = []
    
    if (categoryId) {
      whereClause += ' AND p.category_id = ?'
      params.push(parseInt(categoryId))
    }
    
    if (category) {
      whereClause += ' AND c.name LIKE ?'
      params.push(`%${category}%`)
    }
    
    if (search) {
      whereClause += ' AND p.name LIKE ?'
      params.push(`%${search}%`)
    }
    
    if (featured === 'true') {
      whereClause += ' AND p.featured = 1'
    }
    
    // Get products with category info
    const [rows] = await connection.execute(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.images,
        p.discount,
        p.description,
        p.stock,
        p.rating,
        p.featured,
        p.created_at,
        p.updated_at,
        c.name as category,
        p.category_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])
    
    // Get total count
    const [countRows] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `, params)
    
    const total = (countRows as CountRow[])[0].total
    
    // Format products data
    const products = (rows as ProductRow[]).map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      slug: row.slug,
      images: row.images || '/client/images/placeholder.png',
      discount: parseFloat(row.discount || '0'),
      description: row.description,
      category: row.category,
      category_id: row.category_id,
      stock: row.stock,
      rating: parseFloat(row.rating || '4.5'),
      featured: Boolean(row.featured),
      created_at: row.created_at,
      updated_at: row.updated_at
    }))
    
    return NextResponse.json({
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
    
  } catch (error) {
    console.error('Error fetching products:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
    
  } finally {
    // Close connection
    if (connection) {
      await connection.end()
    }
  }
}
