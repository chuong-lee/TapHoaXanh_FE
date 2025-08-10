import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;
    const orderId = params.id;

    // Kiểm tra đơn hàng thuộc về user và có thể hủy
    const checkQuery = `
      SELECT id, status FROM \`order\` 
      WHERE id = ? AND usersId = ? AND deletedAt IS NULL
    `;
    
    const order = await executeQuery<any[]>(checkQuery, [orderId, userId]);
    
    if (!order || order.length === 0) {
      return NextResponse.json(
        { error: 'Đơn hàng không tồn tại' },
        { status: 404 }
      );
    }

    const currentStatus = order[0].status;
    
    // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc confirmed
    if (!['pending', 'confirmed'].includes(currentStatus)) {
      return NextResponse.json(
        { error: 'Không thể hủy đơn hàng ở trạng thái này' },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đơn hàng thành cancelled
    const updateQuery = `
      UPDATE \`order\` 
      SET status = 'cancelled', updatedAt = NOW() 
      WHERE id = ? AND usersId = ?
    `;
    
    await executeQuery(updateQuery, [orderId, userId]);

    return NextResponse.json({
      success: true,
      message: 'Đơn hàng đã được hủy thành công'
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Không thể hủy đơn hàng' },
      { status: 500 }
    );
  }
} 