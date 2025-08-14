import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    // Get payment status from order table
    const orderResult = await executeQuery(`
      SELECT 
        id,
        transaction_id,
        payment_amount,
        payment_method,
        payment_status,
        payment_description,
        createdAt,
        updatedAt,
        price,
        quantity,
        comment,
        usersId
      FROM \`order\`
      WHERE transaction_id = ?
    `, [transactionId]);

    if (orderResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 });
    }

    const order = orderResult[0];

    return NextResponse.json({
      success: true,
      data: {
        transaction_id: order.transaction_id,
        order_id: order.id,
        amount: order.payment_amount || order.price,
        status: order.payment_status || 'pending',
        payment_method: order.payment_method,
        description: order.payment_description || order.comment,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        total_amount: order.price,
        quantity: order.quantity
      }
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to check payment status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
