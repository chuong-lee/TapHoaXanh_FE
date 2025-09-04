import 'dotenv/config'
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function GET() {
  try {
    console.log('Checking database schema...')
    
    // Kiểm tra cấu trúc bảng product
    const productSchema = await executeQuery(`
      DESCRIBE product
    `)
    
    // Kiểm tra cấu trúc bảng category
    const categorySchema = await executeQuery(`
      DESCRIBE category
    `)
    
    // Lấy dữ liệu mẫu từ bảng category
    const categories = await executeQuery(`
      SELECT * FROM category LIMIT 10
    `)
    
    // Lấy dữ liệu mẫu từ bảng product
    const products = await executeQuery(`
      SELECT p.*, c.name as category_name 
      FROM product p 
      LEFT JOIN category c ON p.category_id = c.id 
      LIMIT 5
    `)
    
    // Kiểm tra các bảng có sẵn
    const tables = await executeQuery(`
      SHOW TABLES
    `)
    
    return NextResponse.json({
      success: true,
      message: 'Database schema retrieved successfully',
      data: {
        tables: tables,
        productSchema: productSchema,
        categorySchema: categorySchema,
        categories: categories,
        products: products,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Schema check error:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve database schema',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

