import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ProductVariant {
  id: number
  variant_name: string
  price_modifier: number
  stock: number
  productId: number
}

// GET /api/product-variant - Get product variants
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: 'Product ID is required'
      }, { status: 400 })
    }

    console.log('🔍 Lấy variants cho product ID:', productId)

    // Query để lấy variants
    const rows = await executeQuery<ProductVariant[]>(`
      SELECT 
        id,
        variant_name,
        price_modifier,
        stock,
        productId
      FROM product_variant
      WHERE productId = ? AND deletedAt IS NULL
      ORDER BY price_modifier ASC
    `, [productId])

    console.log('📦 Variants found:', rows.length)

    return NextResponse.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error('🚨 Lỗi API product variants:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Lỗi server khi lấy product variants',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}