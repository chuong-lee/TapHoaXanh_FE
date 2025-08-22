import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface RelatedProduct {
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
}

// GET /api/products/related/[id] - Get related products
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '12')

    console.log('🔍 Lấy sản phẩm liên quan cho product ID:', productId)

    // Lấy thông tin sản phẩm hiện tại
    const currentProductQuery = `
      SELECT category_id, brand_id, price
      FROM product 
      WHERE id = ? AND deletedAt IS NULL
    `
    const currentProduct = await executeQuery<any[]>(currentProductQuery, [productId])

    if (currentProduct.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy sản phẩm gốc'
      }, { status: 404 })
    }

    const { category_id, brand_id, price } = currentProduct[0]

    // Query để lấy sản phẩm liên quan
    const relatedQuery = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.discount,
        p.images,
        p.slug,
        p.description,
        p.quantity,
        p.category_id,
        c.name as category_name,
        p.brand_id,
        b.name as brand_name
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      LEFT JOIN brand b ON p.brand_id = b.id
      WHERE p.id != ? 
        AND p.deletedAt IS NULL 
        AND p.quantity > 0
        AND (
          p.category_id = ? 
          OR p.brand_id = ? 
          OR ABS(p.price - ?) <= ? * 0.3
        )
      ORDER BY 
        CASE 
          WHEN p.category_id = ? AND p.brand_id = ? THEN 1
          WHEN p.category_id = ? THEN 2
          WHEN p.brand_id = ? THEN 3
          ELSE 4
        END,
        p.id DESC
      LIMIT ?
    `

    const priceRange = price * 0.3 // 30% của giá hiện tại
    const rows = await executeQuery<RelatedProduct[]>(relatedQuery, [
      productId, category_id, brand_id, price, priceRange,
      category_id, brand_id, category_id, brand_id, limit
    ])

    console.log('📦 Related products found:', rows.length)

    // Function để xử lý URL hình ảnh
    function processImageUrl(imagePath: string | null): string {
      if (!imagePath) {
        return '/client/images/product-placeholder-1.png'
      }
      
      if (imagePath.startsWith('http')) {
        return imagePath
      }
      
      if (imagePath.startsWith('/')) {
        return imagePath
      }
      
      if (imagePath.startsWith('client/images/')) {
        return '/' + imagePath
      }
      
      return '/client/images/' + imagePath
    }

    // Format products
    const formattedProducts = rows.map(product => ({
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
      } : null
    }))

    // Tính toán breakdown
    const breakdown = {
      sameCategoryBrand: formattedProducts.filter(p => 
        p.categoryId === category_id && p.brandId === brand_id
      ).length,
      sameCategory: formattedProducts.filter(p => 
        p.categoryId === category_id && p.brandId !== brand_id
      ).length,
      similarPrice: formattedProducts.filter(p => 
        Math.abs(p.price - price) <= priceRange
      ).length
    }

    console.log('📊 Related products breakdown:', breakdown)

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      meta: {
        total: formattedProducts.length,
        breakdown
      }
    })

  } catch (error) {
    console.error('🚨 Lỗi API related products:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Lỗi server khi lấy sản phẩm liên quan',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}