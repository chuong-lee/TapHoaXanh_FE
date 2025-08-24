import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ProductDetail {
  id: number
  name: string
  price: number
  discount: number
  images: string
  slug: string
  description: string
  quantity: number
  category_id: number
  category_name: string
  brand_id?: number
  brand_name?: string
  barcode?: string
  expiry_date?: string
  origin?: string
  weight_unit?: string
  purchase?: number
  created_at: string
  updated_at: string
}

// GET /api/products/detail/[slug] - Get product detail by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = decodeURIComponent(resolvedParams.slug)
    
    console.log('🔍 Tìm sản phẩm với slug:', slug)

    // Query để lấy chi tiết sản phẩm
    const rows = await executeQuery<ProductDetail[]>(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.discount,
        p.images,
        p.slug,
        p.description,
        0 as quantity,
        p.category_id,
        c.name as category_name,
        p.brand_id,
        b.name as brand_name,
        p.barcode,
        p.expiry_date,
        p.origin,
        p.weight_unit,
        p.purchase,
        p.createdAt as created_at,
        p.updatedAt as updated_at
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN brand b ON p.brand_id = b.id
      WHERE p.slug = ? AND p.deletedAt IS NULL
      LIMIT 1
    `, [slug])

    console.log('📦 Query result:', {
      slug,
      found: rows.length > 0,
      productName: rows[0]?.name
    })

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
        slug: slug
      }, { status: 404 })
    }

    const product = rows[0]

    // Function để xử lý URL hình ảnh
    function processImageUrl(imagePath: string | null): string {
      if (!imagePath) {
        return '/client/images/product-placeholder-1.png'
      }
      
      // Nếu là URL đầy đủ
      if (imagePath.startsWith('http')) {
        return imagePath
      }
      
      // Nếu là đường dẫn tương đối
      if (imagePath.startsWith('/')) {
        return imagePath
      }
      
      // Nếu là tên file trong thư mục client/images
      if (imagePath.startsWith('client/images/')) {
        return '/' + imagePath
      }
      
      // Nếu là tên file khác, thêm prefix
      return '/client/images/' + imagePath
    }

    // Format product data
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      images: processImageUrl(product.images),
      slug: product.slug,
      description: product.description,
      quantity: product.quantity,
      categoryId: product.category_id,
      category: {
        id: product.category_id,
        name: product.category_name
      },
      brandId: product.brand_id,
      brand: product.brand_id ? {
        id: product.brand_id,
        name: product.brand_name || 'Chưa có thông tin'
      } : null,
      specifications: {
        barcode: product.barcode,
        expiry_date: product.expiry_date,
        origin: product.origin,
        weight_unit: product.weight_unit,
        purchase_price: product.purchase || 0
      },
      rating: 4.5, // Default rating
      avg_rating: 4.5, // Default average rating
      total_reviews: 0, // Default total reviews
      reviews: [], // Empty reviews array
      created_at: product.created_at,
      updated_at: product.updated_at
    }

    console.log('✅ Trả về sản phẩm:', {
      id: formattedProduct.id,
      name: formattedProduct.name,
      price: formattedProduct.price,
      category: formattedProduct.category?.name
    })

    return NextResponse.json({
      success: true,
      data: formattedProduct
    })

  } catch (error) {
    console.error('🚨 Lỗi API product detail:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Lỗi server khi lấy thông tin sản phẩm',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}