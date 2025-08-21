import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ProductRow {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  quantity: number
  categoryId: number
  category_name?: string
  barcode?: string
  expiry_date?: string
  origin?: string
  weight_unit?: string
  brandId?: number
  purchase?: number
  category_childId?: number
  createdAt?: string
  updatedAt?: string
  brand_name?: string
  avg_rating?: number
  total_reviews?: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Decode URL để lấy slug gốc
    const decodedSlug = decodeURIComponent(slug)
    console.log('API: Tìm sản phẩm với slug gốc:', decodedSlug)

    if (!decodedSlug) {
      return NextResponse.json({
        success: false,
        message: 'Slug không hợp lệ'
      }, { status: 400 })
    }

    // Tìm sản phẩm theo slug hoặc tên với đầy đủ thông tin bao gồm brand và rating
    const query = `
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
        p.barcode,
        p.expiry_date,
        p.origin,
        p.weight_unit,
        p.brandId,
        p.purchase,
        p.category_childId,
        p.createdAt,
        p.updatedAt,
        c.name as category_name,
        b.name as brand_name,
        COALESCE(AVG(r.rating), 0) as avg_rating,
        COUNT(r.id) as total_reviews
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN brand b ON p.brandId = b.id
      LEFT JOIN rating r ON p.id = r.productId AND r.deletedAt IS NULL
      WHERE p.deletedAt IS NULL 
      AND (
        p.slug = ? 
        OR p.slug = ?
        OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
          LOWER(p.name), ' ', '-'), 'á', 'a'), 'à', 'a'), 'ả', 'a'), 'ã', 'a'), 'ạ', 'a'), 
          'đ', 'd'), 'ê', 'e'), 'ô', 'o'), 'ư', 'u') = ?
      )
      GROUP BY p.id, p.name, p.price, p.slug, p.images, p.discount, p.description, 
               p.quantity, p.categoryId, p.barcode, p.expiry_date, p.origin, p.weight_unit, 
               p.brandId, p.purchase, p.category_childId, p.createdAt, p.updatedAt, 
               c.name, b.name
      LIMIT 1
    `

    const normalizedSlug = decodedSlug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    console.log('API: Slug normalized:', normalizedSlug)

    const rows = await executeQuery<ProductRow[]>(query, [decodedSlug, normalizedSlug, normalizedSlug])
    
    console.log('API: Kết quả query:', rows.length)

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      }, { status: 404 })
    }

    const product = rows[0]
    
    // Lấy danh sách đánh giá chi tiết từ bảng rating
    const reviewsQuery = `
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.createdAt,
        r.updatedAt,
        u.name as customer_name,
        u.email as customer_email
      FROM rating r
      LEFT JOIN users u ON r.usersId = u.id
      WHERE r.productId = ? AND r.deletedAt IS NULL
      ORDER BY r.createdAt DESC
      LIMIT 10
    `
    
    const reviews = await executeQuery<any[]>(reviewsQuery, [product.id])
    
    // Lấy comment mới nhất từ bảng rating
    const latestCommentQuery = `
      SELECT comment 
      FROM rating 
      WHERE productId = ? AND deletedAt IS NULL 
      ORDER BY createdAt DESC 
      LIMIT 1
    `
    
    const latestComment = await executeQuery<any[]>(latestCommentQuery, [product.id])
    const latestCommentText = latestComment.length > 0 ? latestComment[0].comment : ''
    
    const result = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      slug: product.slug,
      images: '/client/images/product.png',
      discount: Number(product.discount || 0),
      description: product.description || '',
      quantity: Number(product.quantity || 0),
      rating: Number(product.avg_rating || 4.5), // Rating từ bảng rating
      totalReviews: Number(product.total_reviews || 0), // Số lượng đánh giá
      categoryId: product.categoryId,
      category: {
        id: product.categoryId,
        name: product.category_name || 'Chưa phân loại'
      },
      brand: {
        id: product.brandId,
        name: product.brand_name || 'Chưa có thông tin'
      },
      // Thông tin chi tiết mở rộng
      specifications: {
        barcode: product.barcode || '',
        origin: product.origin || '',
        weight_unit: product.weight_unit || '',
        expiry_date: product.expiry_date || null,
        brandId: product.brandId || null,
        brand_name: product.brand_name || 'Chưa có thông tin',
        purchase_price: Number(product.purchase || 0)
      },
      reviews: {
        averageRating: Number(product.avg_rating || 4.5),
        totalCount: Number(product.total_reviews || 0),
        comment: latestCommentText, // Comment từ bảng rating
        created_at: product.createdAt || null,
        updated_at: product.updatedAt || null,
        // Danh sách đánh giá chi tiết
        list: reviews.map(review => ({
          id: review.id,
          rating: Number(review.rating),
          comment: review.comment,
          customerName: review.customer_name || 'Khách hàng',
          customerEmail: review.customer_email,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt
        }))
      }
    }

    console.log('API: Trả về sản phẩm:', result.name, 'Rating:', result.rating, 'Reviews:', result.totalReviews)
    
    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Lỗi server',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}