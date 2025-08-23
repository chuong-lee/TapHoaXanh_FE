import { , NextResponse } from 'next/server';
import {  } from '@/lib/db';

interface PaymentRequest {
  orderId: string;
  amount: number;
  description: string;
  : string;
  : string;
  : string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await .json();
    const { orderId, amount, description, , ,  } = body;

    // Validate input
    if (!orderId || !amount || !description) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Generate unique transaction ID
    const transactionId = `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update order with payment information
    await executeQuery(`
      UPDATE \`order\` 
      SET 
        transaction_id = ?,
        payment_amount = ?,
        payment_method = 'bank_transfer',
        payment_status = 'pending',
        payment_description = ?,
        updatedAt = NOW()
      WHERE id = ?
    `, [transactionId, amount, description, orderId]);

    // Thông tin tài khoản của Phạm Tuấn Kiệt - Vietcombank
    const bankInfo = {
      account_number: '1030517435',
      account_name: 'LE TUAN MINH ',
      : 'Vietcombank',
      branch: 'BINH PHUOC - TRU'
    };

    // Tạo QR code với thông tin Vietcombank thực tế
    const qrData = `VIETQR:${bankInfo.account_number}:${amount}:${description}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    return NextResponse.json({
      success: true,
      data: {
        transaction_id: transactionId,
        order_id: orderId,
        qr_code_url: qrCodeUrl,
        : bankInfo.account_number,
        bank_name: bankInfo.,
        account_name: bankInfo.account_name,
        branch: bankInfo.branch,
        amount: amount,
        description: description,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes
      }
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown '
    }, { status: 500 });
  }
}
