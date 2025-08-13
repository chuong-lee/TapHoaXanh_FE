import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Lấy trạng thái thanh toán của đơn hàng
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Lấy thông tin đơn hàng và trạng thái thanh toán
    const [orderRows] = await db.execute(
      `SELECT o.*, p.status as payment_status, p.method as payment_method, p.amount, p.created_at as payment_date
       FROM orders o 
       LEFT JOIN payments p ON o.id = p.order_id 
       WHERE o.id = ?`,
      [orderId]
    );

    if (!orderRows || (orderRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = (orderRows as any[])[0];

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderStatus: order.status,
        paymentStatus: order.payment_status || 'payment_pending',
        paymentMethod: order.payment_method,
        amount: order.amount || order.price,
        paymentDate: order.payment_date,
        orderDate: order.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Cập nhật trạng thái thanh toán
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentStatus, paymentMethod, amount, failureReason } = body;

    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        { success: false, error: 'Order ID and payment status are required' },
        { status: 400 }
      );
    }

    // Kiểm tra đơn hàng tồn tại
    const [orderRows] = await db.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (!orderRows || (orderRows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Cập nhật hoặc tạo mới payment record
    const [existingPayment] = await db.execute(
      'SELECT * FROM payments WHERE order_id = ?',
      [orderId]
    );

    if ((existingPayment as any[]).length > 0) {
      // Cập nhật payment hiện có
      await db.execute(
        `UPDATE payments 
         SET status = ?, method = ?, amount = ?, failure_reason = ?, updated_at = NOW()
         WHERE order_id = ?`,
        [paymentStatus, paymentMethod, amount, failureReason, orderId]
      );
    } else {
      // Tạo payment record mới
      await db.execute(
        `INSERT INTO payments (order_id, status, method, amount, failure_reason, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [orderId, paymentStatus, paymentMethod, amount, failureReason]
      );
    }

    // Cập nhật trạng thái đơn hàng dựa trên trạng thái thanh toán
    let orderStatus = 'pending';
    if (paymentStatus === 'payment_success') {
      orderStatus = 'confirmed';
    } else if (paymentStatus === 'payment_failed' || paymentStatus === 'payment_insufficient_funds') {
      orderStatus = 'pending';
    }

    await db.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [orderStatus, orderId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        orderId,
        paymentStatus,
        orderStatus
      }
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Xử lý thanh toán thất bại do số dư không đủ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod, amount, bankAccount } = body;

    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { success: false, error: 'Order ID, payment method and amount are required' },
        { status: 400 }
      );
    }

    // Mô phỏng kiểm tra số dư ngân hàng
    const checkBankBalance = (account: string, requiredAmount: number) => {
      // Trong thực tế, đây sẽ là API call đến ngân hàng
      const mockBalances: { [key: string]: number } = {
        '1234567890': 500000,  // Số dư 500k
        '0987654321': 200000,  // Số dư 200k
        '1122334455': 1500000, // Số dư 1.5M
      };
      
      const balance = mockBalances[account] || 0;
      return {
        hasEnoughFunds: balance >= requiredAmount,
        currentBalance: balance,
        requiredAmount
      };
    };

    let paymentStatus = 'payment_processing';
    let failureReason = null;

    if (paymentMethod.includes('ngân hàng') || paymentMethod.includes('ATM')) {
      const balanceCheck = checkBankBalance(bankAccount || '1234567890', amount);
      
      if (!balanceCheck.hasEnoughFunds) {
        paymentStatus = 'payment_insufficient_funds';
        failureReason = `Số dư không đủ. Hiện tại: ${balanceCheck.currentBalance.toLocaleString('vi-VN')}₫, Cần: ${balanceCheck.requiredAmount.toLocaleString('vi-VN')}₫`;
      } else {
        // Mô phỏng xử lý thanh toán thành công
        paymentStatus = 'payment_success';
      }
    } else {
      // Các phương thức thanh toán khác
      paymentStatus = 'payment_success';
    }

    // Cập nhật trạng thái thanh toán
    const [existingPayment] = await db.execute(
      'SELECT * FROM payments WHERE order_id = ?',
      [orderId]
    );

    if ((existingPayment as any[]).length > 0) {
      await db.execute(
        `UPDATE payments 
         SET status = ?, method = ?, amount = ?, failure_reason = ?, updated_at = NOW()
         WHERE order_id = ?`,
        [paymentStatus, paymentMethod, amount, failureReason, orderId]
      );
    } else {
      await db.execute(
        `INSERT INTO payments (order_id, status, method, amount, failure_reason, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [orderId, paymentStatus, paymentMethod, amount, failureReason]
      );
    }

    // Cập nhật trạng thái đơn hàng
    const orderStatus = paymentStatus === 'payment_success' ? 'confirmed' : 'pending';
    await db.execute(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [orderStatus, orderId]
    );

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        orderId,
        paymentStatus,
        orderStatus,
        failureReason
      }
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 