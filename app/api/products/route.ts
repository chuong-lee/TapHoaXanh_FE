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
  stock: number
  created_at: string
  updated_at: string
  category: string
  category_id: number
  barcode?: string
  expiry_date?: string
  origin?: string
  weight_unit?: string
  brandId?: number
  purchase?: number
  category_childId?: number
  brand_name?: string
}

interface CountRow {
  total: number
}

// GET /api/products - Get all products with filters
export async function GET(request: NextRequest) {
  // Add caching headers
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  
  try {
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const categoryId = searchParams.get('category_id')
    
    const offset = (page - 1) * limit
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1'
    const params: (string | number)[] = []
    
    if (categoryId) {
      whereClause += ' AND p.categoryId = ?'
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

    // Execute main query - chỉ select các cột cần thiết để tối ưu performance
    const rows = await executeQuery<ProductRow[]>(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.images,
        p.discount,
        p.description,
        p.quantity as stock,
        p.categoryId as category_id,
        c.name as category
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      ${whereClause}
      ORDER BY p.id DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    // Get total count
    const countRows = await executeQuery<CountRow[]>(`
      SELECT COUNT(*) as total
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      ${whereClause}
    `, params)
    
    const total = countRows[0].total
    
    // Function để xử lý URL hình ảnh
    function processImageUrl(imagePath: string | null): string {
      if (!imagePath) {
        return '/client/images/product.png'
      }
      
      // Nếu là URL đầy đủ
      if (imagePath.startsWith('http')) {
        return imagePath
      }
      
      // Nếu là đường dẫn tương đối
      if (imagePath.startsWith('/')) {
        return imagePath
      }
      
      // Sử dụng placeholder cho tất cả sản phẩm
      return '/client/images/product.png'
    }

    // Format product data
    const product = rows.map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      slug: row.slug,
      images: processImageUrl(row.images),
      discount: parseFloat(row.discount || '0'),
      description: row.description,
      category: {
        id: row.category_id,
        name: row.category
      },
      categoryId: row.category_id,
      brand: {
        id: row.brandId,
        name: row.brand_name || 'Chưa có thương hiệu'
      },
      brandId: row.brandId,
      stock: row.stock,
      rating: 4.5,
      created_at: row.created_at,
      updated_at: row.updated_at,
      barcode: row.barcode,
      expiry_date: row.expiry_date,
      origin: row.origin,
      weight_unit: row.weight_unit,
      purchase: row.purchase,
      category_childId: row.category_childId
    }))
    
    return NextResponse.json({
      success: true,
      data: product,
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
  }
}
