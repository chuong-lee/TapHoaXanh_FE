import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import jwt from 'jsonwebtoken';

interface OrderDetail {
  id: number;
  price: number;
  quantity: number;
  images: string;
  comment: string;
  status: string;
  usersId: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: number;
  quantity: number;
  images: string;
  unit_price: number;
  productId: number;
  orderId: number;
  product?: {
    name: string;
    slug: string;
  };
}

export async function GET(
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

    // Lấy thông tin đơn hàng
    const orderQuery = `
      SELECT * FROM \`order\` 
      WHERE id = ? AND usersId = ? AND deletedAt IS NULL
    `;
    
    const orders = await executeQuery<OrderDetail[]>(orderQuery, [orderId, userId]);
    
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { error: 'Đơn hàng không tồn tại' },
        { status: 404 }
      );
    }

    const order = orders[0];

    // Lấy chi tiết sản phẩm trong đơn hàng
    const itemsQuery = `
      SELECT oi.*, p.name as productName, p.slug as productSlug
      FROM order_item oi
      LEFT JOIN product p ON oi.productId = p.id
      WHERE oi.orderId = ?
    `;
    
    const items = await executeQuery<OrderItem[]>(itemsQuery, [orderId]);

    // Kết hợp thông tin
    const orderDetail = {
      ...order,
      items: items || []
    };

    return NextResponse.json({
      success: true,
      data: orderDetail
    });

  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json(
      { error: 'Không thể lấy thông tin đơn hàng' },
      { status: 500 }
    );
  }
} 