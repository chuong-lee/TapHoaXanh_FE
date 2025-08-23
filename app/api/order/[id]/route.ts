import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

interface OrderRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  quantity: number;
  images: string;
  comment: string;
  usersId: number;
  currency: string;
  payment_description: string;
  transaction_id: string;
  gateway_response: string;
  payment_amount: number;
  payment_method: string;
  payment_status: string;
  discount: number;
  freeship: boolean;
  shipping_fee: number;
  voucherId: number | null;
  price: number;
}

interface OrderItemRow {
  id: number;
  quantity: number;
  images: string;
  unit_price: number;
  productId: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // Lấy thông tin đơn hàng
    const orderQuery = `
      SELECT 
        id, 
        createdAt, 
        updatedAt, 
        deletedAt,
        quantity,
        images,
        comment,
        usersId,
        currency,
        payment_description,
        transaction_id,
        gateway_response,
        payment_amount,
        payment_method,
        payment_status,
        discount,
        freeship,
        shipping_fee,
        voucherId,
        price
      FROM \`order\`
      WHERE id = ? AND deletedAt IS NULL
    `;
    
    const orderResult = await executeQuery<OrderRow[]>(orderQuery, [orderId]);
    
    if (!orderResult || orderResult.length === 0) {
      return NextResponse.json(
        { error: 'Đơn hàng không tồn tại' },
        { status: 404 }
      );
    }

    const order = orderResult[0];

    // Lấy danh sách sản phẩm trong đơn hàng
    const itemsQuery = `
      SELECT 
        oi.id,
        oi.quantity,
        oi.images,
        oi.unit_price,
        oi.productId
      FROM order_item oi
      WHERE oi.orderId = ?
    `;
    
    const itemsResult = await executeQuery<OrderItemRow[]>(itemsQuery, [orderId]);
    
    // Map dữ liệu
    const orderData = {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      price: order.price || order.payment_amount || 0,
      status: order.payment_status || 'pending',
      paymentMethod: order.payment_method || 'COD',
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: itemsResult.map(item => ({
        id: item.id,
        name: 'Sản phẩm',
        price: item.unit_price || 0,
        quantity: item.quantity || 1,
        images: item.images || '/client/images/product.png',
        description: ''
      })),
      address: order.comment || 'Chưa có địa chỉ giao hàng',
      user: {
        name: 'Khách hàng',
        email: 'N/A'
      },
      quantity: order.quantity || 1,
      comment: order.comment || '',
      currency: order.currency || 'VND',
      discount: order.discount || 0,
      shippingFee: order.shipping_fee || 0,
      voucherId: order.voucherId,
      transactionId: order.transaction_id,
      paymentStatus: order.payment_status
    };

    return NextResponse.json({
      success: true,
      data: orderData
    });

  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json(
      { error: 'Không thể tải thông tin đơn hàng' },
      { status: 500 }
    );
  }
} 