import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ProductRow {
  id: number
  name: string
  price: string
  images: string
  discount: string
  description: string
  stock: number
  rating: string
  created_at: string
  updated_at: string
  category: string
  category_id: number
  barcode?: string
  expiry_date?: string
  origin?: string
  weight_unit?: string
  brandId?: number
  purchase?: string
  category_childId?: number
  comment?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    
    // Get products with highest quantity sold as "best-selling"
    // Since we don't have a sold column, we'll use newest products with good rating
    const rows = await executeQuery<ProductRow[]>(`
      SELECT 
        p.id,
        p.name,
        p.price,

        p.images,
        p.discount,
        p.description,
        p.quantity as stock,
        p.createdAt as created_at,
        p.updatedAt as updated_at,
        p.barcode,
        p.expiry_date,
        p.origin,
        p.weight_unit,
        p.brandId,
        p.purchase,
        p.category_childId,
        p.rating,
        p.comment,
        c.name as category,
        p.categoryId as category_id
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.rating >= 4.0 AND p.deletedAt IS NULL
      ORDER BY p.createdAt DESC, p.rating DESC
      LIMIT ?
    `, [limit])
    
    // Format product data
    const products = rows.map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),

      images: row.images || '/client/images/placeholder.png',
      discount: parseFloat(row.discount || '0'),
      description: row.description,
      category: row.category,
      category_id: row.category_id,
      stock: row.stock,
      rating: parseFloat(row.rating || '4.5'),
      created_at: row.created_at,
      updated_at: row.updated_at,
      barcode: row.barcode,
      expiry_date: row.expiry_date,
      origin: row.origin,
      weight_unit: row.weight_unit,
      brandId: row.brandId,
      purchase: row.purchase,
      category_childId: row.category_childId,
      comment: row.comment
    }))
    
    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
    })
  } catch (error) {
    console.error('Error fetching best-selling products:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch best-selling products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}