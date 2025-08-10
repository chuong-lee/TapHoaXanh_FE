import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

// Interface for database rows
interface ProductRow {
  id: number
  name: string
  price: string
  slug: string
  images: string
  discount: string
  description: string
  quantity: number
  rating: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  barcode: string
  expiry_date: string
  origin: string
  weight_unit: string
  brandId: number
  purchase: string
  categoryId: number
  category_childId: number
  comment: string
  category?: string
}

// GET /api/products/[id] - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid product ID'
      }, { status: 400 })
    }

    // Get product by ID with category name
    const rows = await executeQuery<ProductRow[]>(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.images,
        p.discount,
        p.description,
        p.quantity,
        p.rating,
        p.createdAt,
        p.updatedAt,
        p.deletedAt,
        p.barcode,
        p.expiry_date,
        p.origin,
        p.weight_unit,
        p.brandId,
        p.purchase,
        p.categoryId,
        p.category_childId,
        p.comment,
        c.name as category
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      WHERE p.id = ? AND p.deletedAt IS NULL
    `, [id])

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 })
    }

    const row = rows[0]
    
    // Format product data
    const product = {
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      slug: row.slug,
      images: row.images || '/client/images/placeholder.png',
      discount: parseFloat(row.discount || '0'),
      description: row.description,
      quantity: row.quantity,
      rating: parseFloat(row.rating || '4.5'),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      barcode: row.barcode,
      expiry_date: row.expiry_date,
      origin: row.origin,
      weight_unit: row.weight_unit,
      brandId: row.brandId,
      purchase: row.purchase,
      categoryId: row.categoryId,
      category_childId: row.category_childId,
      comment: row.comment,
      category: { id: row.categoryId, name: row.category }
    }
    
    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch product',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}