import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

// Interface for database rows
interface ProductVariantRow {
  id: number
  variant_name: string
  price_modifier: string
  stock: number
  productId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// GET /api/product-variant - Get variants by productId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json({
        success: false,
        message: 'ProductId is required'
      }, { status: 400 })
    }

    // Get variants by productId
    const rows = await executeQuery<ProductVariantRow[]>(`
      SELECT 
        id,
        variant_name,
        price_modifier,
        stock,
        productId,
        createdAt,
        updatedAt,
        deletedAt
      FROM product_variant
      WHERE productId = ? AND deletedAt IS NULL
      ORDER BY id ASC
    `, [parseInt(productId)])
    
    // Format variant data
    const variants = rows.map(row => ({
      id: row.id,
      variant_name: row.variant_name,
      price_modifier: parseFloat(row.price_modifier || '0'),
      stock: row.stock,
      productId: row.productId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }))
    
    return NextResponse.json({
      success: true,
      data: variants,
      total: variants.length
    })
  } catch (error) {
    console.error('Error fetching product variants:', error)
    
    // Return empty array if table doesn't exist or other error
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}