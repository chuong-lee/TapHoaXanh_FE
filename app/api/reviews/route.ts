import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ReviewData {
  productId: number
  customerName: string
  rating: number
  comment: string
}

// POST /api/reviews - Thêm đánh giá mới cho sản phẩm
export async function POST(request: NextRequest) {
  try {
    const body: ReviewData = await request.json()
    
    const { productId, customerName, rating, comment } = body
    
    // Validate input
    if (!productId || !customerName || !rating || !comment) {
      return NextResponse.json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      }, { status: 400 })
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        message: 'Đánh giá phải từ 1 đến 5 sao'
      }, { status: 400 })
    }
    
    if (comment.length < 10) {
      return NextResponse.json({
        success: false,
        message: 'Nhận xét phải có ít nhất 10 ký tự'
      }, { status: 400 })
    }
    
    // Kiểm tra sản phẩm có tồn tại không
    const productCheck = await executeQuery<any[]>(`
      SELECT id FROM product WHERE id = ? AND deletedAt IS NULL
    `, [productId])
    
    if (productCheck.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      }, { status: 404 })
    }
    
    // Thêm đánh giá mới vào bảng rating
    const insertResult = await executeQuery<any>(`
      INSERT INTO rating (
        productId,
        customer_name,
        rating,
        comment,
        createdAt,
        updatedAt
      ) VALUES (?, ?, ?, ?, NOW(), NOW())
    `, [productId, customerName, rating, comment])
    
    console.log(`📝 Added new review for product ${productId}: Rating ${rating}, Comment: ${comment}`)
    
    return NextResponse.json({
      success: true,
      message: 'Đánh giá đã được lưu thành công!',
      data: {
        reviewId: insertResult.insertId,
        productId,
        rating,
        comment,
        customerName
      }
    })
    
  } catch (error) {
    console.error('Error saving review:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Lỗi khi lưu đánh giá',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}