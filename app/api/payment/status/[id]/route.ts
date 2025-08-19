import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Kiểm tra xem id là orderId hay transactionId
    let result;
    
    // Thử tìm theo orderId trước
    result = await executeQuery(`
      SELECT 
        id,
        payment_status,
        payment_amount,
        transaction_id,
        payment_method,
        payment_description,
        createdAt,
        updatedAt,
        price,
        quantity,
        comment,
        usersId
      FROM \`order\` 
      WHERE id = ?
    `, [id]);

    // Nếu không tìm thấy, thử tìm theo transaction_id
    if (result.length === 0) {
      result = await executeQuery(`
        SELECT 
          id,
          payment_status,
          payment_amount,
          transaction_id,
          payment_method,
          payment_description,
          createdAt,
          updatedAt,
          price,
          quantity,
          comment,
          usersId
        FROM \`order\` 
        WHERE transaction_id = ?
      `, [id]);
    }

    if (result.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }

    const order = result[0];

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        transactionId: order.transaction_id,
        paymentStatus: order.payment_status,
        paymentAmount: order.payment_amount,
        paymentMethod: order.payment_method,
        description: order.payment_description || order.comment,
        amount: order.payment_amount || order.price,
        status: order.payment_status || 'pending',
        totalAmount: order.price,
        quantity: order.quantity,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
