import 'dotenv/config'
import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DB Config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    })

    // Test database connection
    const result = await executeQuery('SELECT 1 as test')
    console.log('Connection test result:', result)

    // Test products table
    const productsCount = await executeQuery('SELECT COUNT(*) as count FROM product')
    console.log('Products count:', productsCount[0].count)

    // Test categories table
    const categoriesCount = await executeQuery('SELECT COUNT(*) as count FROM category')
    console.log('Categories count:', categoriesCount[0].count)

    // Get sample products
    const sampleProducts = await executeQuery(`
      SELECT id, name, price, images
      FROM product
      LIMIT 5
    `)

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        connection: 'OK',
        productsCount: productsCount[0].count,
        categoriesCount: categoriesCount[0].count,
        sampleProducts: sampleProducts,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Database test error:', error)

    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
