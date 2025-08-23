import { , NextResponse } from 'next/server';
import {  } from '@/lib/db';
import jwt from 'jsonwebtoken';

interface OrderRow {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  freeship: number;
  shipping_fee: number;
  voucherId: number;
  price: number;
  // User info from JOIN
  userName?: string;
  userEmail?: string;
  // Delivery info from JOIN
  deliveryDate?: string;
  deliveryStatus?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = .headers.get('authorization');
    let userId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
        userId = decoded.userId;
      } catch (jwtError) {
        console.log('JWT verification failed:', );
      }
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let orders = [];

    // Try to fetch from database first
    try {
      let query = `
        SELECT 
          o.id, 
          o.createdAt, 
          o.updatedAt, 
          o.deletedAt,
          o.quantity,
          o.images,
          o.comment,
          o.usersId,
          o.currency,
          o.payment_description,
          o.transaction_id,
          o.gateway_response,
          o.payment_amount,
          o.payment_method,
          o.payment_status,
          o.discount,
          o.freeship,
          o.shipping_fee,
          o.voucherId,
          o.price,
          u.name as userName,
          u.email as userEmail,
          d.estimated_date as deliveryDate,
          d.status as deliveryStatus
        FROM \`order\` o
        LEFT JOIN users u ON o.usersId = u.id
        LEFT JOIN delivery d ON o.id = d.orderId AND (d.deletedAt IS NULL OR d.deletedAt IS NULL)
        WHERE o.deletedAt IS NULL
      `;
      
      const params: unknown[] = [];

      // Filter by user if authenticated - TEMPORARILY DISABLED for testing
      // if (userId) {
      //   query += ' AND o.usersId = ?';
      //   params.push(userId);
      // }

      // Filter by payment status if provided
      if (status) {
        query += ' AND (o.payment_status = ? OR d.status = ?)';
        params.push(status, status);
      }

      query += ' ORDER BY o.createdAt DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      console.log('Executing order query with new schema:', query);
      console.log('With params:', params);

      const dbOrders = await executeQuery<OrderRow[]>(query, params);
      console.log('Database query successful, found:', dbOrders?.length || 0, 'orders');
      
      if (dbOrders && dbOrders.length > 0) {
        orders = dbOrders.map((row: unknown) => ({
          id: row.id,
          price: row.price,
          quantity: row.quantity || 1,
          comment: row.comment || '',
          images: row.images || '',
          
          // Status từ chính bảng order
          status: row.payment_status || row.deliveryStatus || 'pending',
          paymentMethod: row.payment_method || 'COD',
          
          // Payment info
          paymentAmount: row.payment_amount || row.price,
          paymentStatus: row.payment_status,
          transactionId: row.transaction_id,
          currency: row.currency || 'VND',
          
          // Shipping info
          discount: row.discount || 0,
          freeship: row.freeship || 0,
          shippingFee: row.shipping_fee || 0,
          voucherId: row.voucherId,
          
          // Dates
          deliveryDate: row.deliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          
          // User info
          usersId: row.usersId,
          user: {
            name: row.userName || 'Unknown User',
            email: row.userEmail || ''
          },
          
          // Additional info
          items: [], // Sẽ fetch từ order_item nếu cần
          address: 'Chưa có địa chỉ giao hàng'
        }));
        
        console.log('Successfully mapped', orders.length, 'orders from database with new schema');
      } else {
        console.log('No orders found in database');
      }
    } catch (dbError) {
      console.('Database query failed:', dbError);
      orders = [];
    }

    return NextResponse.json({
      success: true,
      data: orders,
      total: orders.length,
      limit,
      offset,
      source: orders.length > 0 ? 'database' : 'empty'
    });

  } catch (error) {
    console.error('Error in orders API:', error);
    return NextResponse.json(
      { 
        success: false,
        : 'Lỗi server, vui lòng thử lại sau',
        data: [],
        total: 0 
      },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Processing order request...');
    const body = await request.json();
    console.log('🔍 Received order request:', body);
    
    // Tạm thời bỏ qua authentication để test
    let userId = 1; // User mặc định cho testing
    
    // Kiểm tra token nếu có
    const authHeader = .headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        console.log('🔍 Verifying JWT token:', token.substring(0, 20) + '...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as any;
        console.log('🔍 JWT decoded successfully:', { userId: decoded.userId, email: decoded.email });
        userId = decoded.userId;
      } catch (jwtError) {
        console.error('🔍 JWT verification failed:', );
        // Không return , tiếp tục với userId mặc định
      }
    }
    console.log('🔍 User ID from token:', userId);
    const { 
      items, 
      totalPrice, 
      paymentMethod, 
      comment,
      discount,
      shippingFee,
      voucherId,
      currency 
    } = body;

    // Validate input
    console.log('🔍 Validating order data:', { totalPrice, items: items?.length || 0 });
    
    if (!totalPrice) {
      return NextResponse.json(
        { : 'Thiếu thông tin đơn hàng' },
        { status: 400 }
      );
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { : 'Giỏ hàng trống' },
        { status: 400 }
      );
    }

    // Calculate total quantity
    const totalQuantity = items ? items.reduce((sum: number, item: unknown) => sum + (item.quantity || 1), 0) : 1;

    // Try to create order in database với schema mới
    try {
      console.log('🔍 Creating order with data:', {
        totalPrice,
        totalQuantity,
        userId,
        itemsCount: items?.length || 0,
        paymentMethod,
        comment
      });
      
      // Tạo địa chỉ giao hàng từ thông tin user
      const deliveryAddress = `${comment || 'Địa chỉ giao hàng'}`;
      
      const insertQuery = `
      INSERT INTO \`order\` (
        price, 
        quantity, 
        images, 
        comment, 
        usersId,
        payment_method,
        payment_amount,
        payment_status,
        currency,
        discount,
        shipping_fee,
        voucherId,
        createdAt, 
        updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    
    const result = await executeQuery<any>(insertQuery, [
      totalPrice,
      totalQuantity,
      items && items.length > 0 ? items[0].images || '' : '', // images từ item đầu tiên
      deliveryAddress,
      userId,
      paymentMethod || 'COD',
      totalPrice,
      'pending',
      currency || 'VND',
      discount || 0,
      shippingFee || 0,
      voucherId || null
    ]);
    
    console.log('🔍 Order created successfully, ID:', result.insertId);

      const orderId = result.insertId;

      // Insert order items if provided
      if (items && Array.isArray(items)) {
        console.log('🔍 Inserting order items:', items.length);
        for (const item of items) {
          try {
            console.log('🔍 Inserting item:', { 
              quantity: item.quantity, 
              unit_price: item.unit_price, 
              product: item.product 
            });
            await executeQuery(
              'INSERT INTO order_item (quantity, images, unit_price, productId, orderId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
              [
                item.quantity || 1,
                item.images || '',
                item.unit_price || 0,
                item.product || null, // product field từ frontend
                orderId
              ]
            );
            console.log('🔍 Item inserted successfully');
          } catch (itemError) {
            console.('🔍 Order item insert failed:', itemError);
          }
        }
      }

      // Tạo delivery record nếu có bảng delivery
      try {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        await (
          'INSERT INTO delivery (orderId, estimated_date, status, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
          [orderId, deliveryDate.toISOString().split('T')[0], 'pending']
        );
        console.log('🔍 Delivery record created successfully');
      } catch (deliveryError) {
        console.log('🔍 Delivery record creation skipped (table may not exist):', deliveryError);
      }
      
      // Tạo payment record nếu có bảng payments
      try {
        await (
          'INSERT INTO payments (order_id, status, method, amount, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
          [orderId, 'payment_pending', paymentMethod || 'COD', totalPrice]
        );
        console.log('🔍 Payment record created successfully');
      } catch (paymentError) {
        console.log('🔍 Payment record creation skipped (table may not exist):', paymentError);
      }

      return NextResponse.json({
        success: true,
        message: 'Đơn hàng đã được tạo thành công',
        orderId: orderId
      });

    } catch (dbError) {
      console.error('🔍 Database insert failed:', dbError);
      console.error('🔍 Error details:', {
        message: dbError instanceof Error ? dbError.message : 'Unknown ',
        stack: dbError instanceof Error ? dbError.stack : undefined
      });
      return NextResponse.json(
        { : 'Không thể tạo đơn hàng' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('🔍 Error in create order API:', error);
    console.error('🔍 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? .stack : undefined
    });
    return NextResponse.json(
      { : 'Lỗi server, vui lòng thử lại sau' },
      { status: 500 }
    );
  }
}