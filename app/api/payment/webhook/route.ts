import { , NextResponse } from 'next/server';
import {  } from '@/lib/db';
import crypto from 'crypto';

// SePay Configuration
const SEPAY_CONFIG = {
  SECRET_KEY: process.env.SEPAY_SECRET_KEY || 'your_sepay_secret_key',
};

interface SePayWebhookData {
  transaction_id: string;
  : string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  : string;
  : string;
  : string;
  description: string;
  signature: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = .headers.get('x-sepay-signature');
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', SEPAY_CONFIG.SECRET_KEY)
      .update(body)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ : 'Invalid signature' }, { status: 401 });
    }

    const webhookData: SePayWebhookData = JSON.parse(body);
    const { 
      transaction_id, 
      , 
      amount, 
      status, 
      , 
      , 
      ,
      description 
    } = webhookData;

    console.log('Received SePay webhook:', webhookData);

    // Update order status directly in order table
    await executeQuery(`
      UPDATE \`order\` 
      SET 
        payment_status = ?,
        payment_method = 'bank_transfer',
        payment_amount = ?,
        payment_description = ?,
        updatedAt = NOW()
      WHERE transaction_id = ?
    `, [status, amount, description, transaction_id]);

    // If payment is successful, mark order as paid
    if (status === 'success') {
      await (`
        UPDATE \`order\` 
        SET 
          payment_status = 'completed',
          payment_date = NOW(),
          updatedAt = NOW()
        WHERE transaction_id = ?
      `, [transaction_id]);

      console.log(`Order with transaction ${transaction_id} marked as completed`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : 'Unknown '
    }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'SePay webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
