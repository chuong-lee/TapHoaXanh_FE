import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ProductRow {
  id: number
  name: string
  price: string
  slug: string
  images: string
  discount: string
  description: string
  quantity: number
  categoryId: number
  brandId: number
  weight_unit: string
  category_name?: string
  avg_rating?: number
  total_reviews?: number
}

// GET /api/products/related/[id] - Get related products based on current product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')
    
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid product ID'
      }, { status: 400 })
    }

    // Lấy thông tin sản phẩm hiện tại
    const currentProductRows = await executeQuery<ProductRow[]>(`
      SELECT 
        p.id,
        p.name,
        p.categoryId,
        p.brandId,
        p.weight_unit,
        p.price
      FROM product p
      WHERE p.id = ? AND p.deletedAt IS NULL
    `, [productId])

    if (currentProductRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Product not found'
      }, { status: 404 })
    }

    const currentProduct = currentProductRows[0]
    const currentPrice = parseFloat(currentProduct.price)

    // Tìm sản phẩm liên quan theo thứ tự ưu tiên:
    // 1. Cùng category và cùng brand (50% kết quả)
    // 2. Cùng category, brand khác (30% kết quả) 
    // 3. Cùng khoảng giá (20% kết quả)

    const limit1 = Math.ceil(limit * 0.5) // 50% - cùng category + brand
    const limit2 = Math.ceil(limit * 0.3) // 30% - cùng category khác brand
    const limit3 = limit - limit1 - limit2 // 20% - cùng khoảng giá

    // Query 1: Cùng category và cùng brand
    const query1 = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.images,
        p.discount,
        p.description,
        p.quantity,
        p.categoryId,
        p.brandId,
        p.weight_unit,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_reviews,
        'same_category_brand' as match_type
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN rating r ON p.id = r.productId AND r.deletedAt IS NULL
      WHERE p.deletedAt IS NULL 
        AND p.id != ?
        AND p.categoryId = ?
        AND p.brandId = ?
      GROUP BY p.id, p.name, p.price, p.slug, p.images, p.discount, p.description, 
               p.quantity, p.categoryId, p.brandId, p.weight_unit, c.name
      ORDER BY ABS(p.price - ?) ASC
      LIMIT ?
    `

    // Query 2: Cùng category, brand khác
    const query2 = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.images,
        p.discount,
        p.description,
        p.quantity,
        p.categoryId,
        p.brandId,
        p.weight_unit,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_reviews,
        'same_category' as match_type
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN rating r ON p.id = r.productId AND r.deletedAt IS NULL
      WHERE p.deletedAt IS NULL 
        AND p.id != ?
        AND p.categoryId = ?
        AND p.brandId != ?
      GROUP BY p.id, p.name, p.price, p.slug, p.images, p.discount, p.description, 
               p.quantity, p.categoryId, p.brandId, p.weight_unit, c.name
      ORDER BY ABS(p.price - ?) ASC
      LIMIT ?
    `

    // Query 3: Cùng khoảng giá (±30%)
    const priceMin = currentPrice * 0.7
    const priceMax = currentPrice * 1.3
    
    const query3 = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.slug,
        p.images,
        p.discount,
        p.description,
        p.quantity,
        p.categoryId,
        p.brandId,
        p.weight_unit,
        c.name as category_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_reviews,
        'similar_price' as match_type
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN rating r ON p.id = r.productId AND r.deletedAt IS NULL
      WHERE p.deletedAt IS NULL 
        AND p.id != ?
        AND p.categoryId != ?
        AND p.price BETWEEN ? AND ?
      GROUP BY p.id, p.name, p.price, p.slug, p.images, p.discount, p.description, 
               p.quantity, p.categoryId, p.brandId, p.weight_unit, c.name
      ORDER BY ABS(p.price - ?) ASC
      LIMIT ?
    `

    // Thực hiện các query song song
    const [rows1, rows2, rows3] = await Promise.all([
      executeQuery<ProductRow[]>(query1, [productId, currentProduct.categoryId, currentProduct.brandId, currentPrice, limit1]),
      executeQuery<ProductRow[]>(query2, [productId, currentProduct.categoryId, currentProduct.brandId, currentPrice, limit2]),
      executeQuery<ProductRow[]>(query3, [productId, currentProduct.categoryId, priceMin, priceMax, currentPrice, limit3])
    ])

    // Kết hợp kết quả và loại bỏ trùng lặp
    const allRows = [...rows1, ...rows2, ...rows3]
    const uniqueProducts = allRows.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    ).slice(0, limit)

    // Format dữ liệu
    const relatedProducts = uniqueProducts.map(row => ({
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      slug: row.slug,
      images: '/client/images/product.png',
      discount: parseFloat(row.discount || '0'),
      description: row.description,
      quantity: row.quantity,
      rating: Number(row.avg_rating || 4.5), // Rating từ bảng rating
      totalReviews: Number(row.total_reviews || 0), // Số lượng đánh giá
      categoryId: row.categoryId,
      brandId: row.brandId,
      weight_unit: row.weight_unit,
      category: { 
        id: row.categoryId, 
        name: row.category_name 
      }
    }))

    console.log(`🔗 Found ${relatedProducts.length} related products for product ${productId}:`)
    console.log(`- Same category + brand: ${rows1.length}`)
    console.log(`- Same category: ${rows2.length}`) 
    console.log(`- Similar price: ${rows3.length}`)

    return NextResponse.json({
      success: true,
      data: relatedProducts,
      meta: {
        currentProduct: {
          id: currentProduct.id,
          name: currentProduct.name,
          categoryId: currentProduct.categoryId,
          brandId: currentProduct.brandId,
          price: currentPrice
        },
        breakdown: {
          sameCategoryBrand: rows1.length,
          sameCategory: rows2.length,
          similarPrice: rows3.length,
          total: relatedProducts.length
        }
      }
    })

  } catch (error) {
    console.error('Error fetching related products:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch related products',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}