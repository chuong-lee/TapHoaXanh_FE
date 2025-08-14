import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

interface ReviewData {
  productId: number
  customerName: string
  rating: number
  comment: string
}

// POST /api/reviews - Cập nhật đánh giá cho sản phẩm
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
      SELECT id, rating, comment FROM product WHERE id = ? AND deletedAt IS NULL
    `, [productId])
    
    if (productCheck.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Sản phẩm không tồn tại'
      }, { status: 404 })
    }
    
    const currentProduct = productCheck[0]
    
    // Tính toán rating mới (trung bình với rating hiện tại)
    // Giả sử chúng ta cộng thêm đánh giá mới vào rating hiện tại
    const currentRating = parseFloat(currentProduct.rating || '0')
    const newRating = (currentRating + rating) / 2 // Trung bình đơn giản
    
    // Format comment mới (kết hợp với comment cũ nếu muốn hoặc thay thế)
    const newComment = `${comment} (Đánh giá bởi: ${customerName} - ${new Date().toLocaleDateString('vi-VN')})`
    
    // Cập nhật sản phẩm với rating và comment mới
    await executeQuery(`
      UPDATE product 
      SET 
        rating = ?,
        comment = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [newRating, newComment, productId])
    
    console.log(`📝 Updated review for product ${productId}: Rating ${newRating}, Comment: ${newComment}`)
    
    return NextResponse.json({
      success: true,
      message: 'Đánh giá đã được lưu thành công!',
      data: {
        productId,
        newRating,
        newComment,
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