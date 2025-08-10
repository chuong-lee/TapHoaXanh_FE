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
  rating: number
  categoryId: number
  category_name?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('API: Tìm sản phẩm với slug:', slug)

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: 'Slug không hợp lệ'
      }, { status: 400 })
    }

    // Tìm sản phẩm theo slug hoặc tên với đầy đủ thông tin bao gồm brand
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
        p.rating,
        p.categoryId,
        p.barcode,
        p.expiry_date,
        p.origin,
        p.weight_unit,
        p.brandId,
        p.purchase,
        p.category_childId,
        p.comment,
        p.createdAt,
        p.updatedAt,
        c.name as category_name,
        b.name as brand_name
      FROM product p
      LEFT JOIN category c ON p.categoryId = c.id
      LEFT JOIN brand b ON p.brandId = b.id
      WHERE p.deletedAt IS NULL 
      AND (
        p.slug = ? 
        OR p.slug = ?
        OR REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
          LOWER(p.name), ' ', '-'), 'á', 'a'), 'à', 'a'), 'ả', 'a'), 'ã', 'a'), 'ạ', 'a'), 
          'đ', 'd'), 'ê', 'e'), 'ô', 'o'), 'ư', 'u') = ?
      )
      LIMIT 1
    `

    const normalizedSlug = slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    const rows = await executeQuery<ProductRow[]>(query, [slug, normalizedSlug, normalizedSlug])
    
    console.log('API: Kết quả query:', rows.length)

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      }, { status: 404 })
    }

    const product = rows[0]
    
    const result = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      slug: product.slug,
      images: product.images || '/client/images/product.png',
      discount: Number(product.discount || 0),
      description: product.description || '',
      quantity: Number(product.quantity || 0),
      rating: Number(product.rating || 4.5),
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
        comment: product.comment || '',
        rating: Number(product.rating || 4.5),
        created_at: product.createdAt || null,
        updated_at: product.updatedAt || null
      }
    }

    console.log('API: Trả về sản phẩm:', result.name)
    
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