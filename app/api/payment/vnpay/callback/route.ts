import { , NextResponse } from 'next/server';
import crypto from 'crypto';
import {  } from '@/lib/db';

const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'KASJHDFKASJHFKASJHFKASJHF';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get all VNPay response parameters
    const vnpParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith('vnp_')) {
        vnpParams[key] = value;
      }
    });

    // Extract important parameters
    const {
      vnp_Amount,
      vnp_BankCode,
      ,
      ,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_ResponseCode,
      ,
      vnp_TransactionNo,
      vnp_TxnRef,
      
    } = vnpParams;

    // Verify secure hash
    const isValidSignature = verifyVNPaySignature(vnpParams, vnp_SecureHash);
    
    if (!isValidSignature) {
      console.error('VNPay signature verification failed');
      return NextResponse.redirect(new URL('/payment/failed?=invalid_signature', .url));
    }

    // Check response code
    if (vnp_ResponseCode === '00') {
      // Payment successful
      const amount = parseInt(vnp_Amount) / 100; // Convert from smallest unit to VND
      
      // Update order status in database
      try {
        const updateOrderQuery = `
          UPDATE \`order\` 
          SET 
            payment_status = 'paid',
            transaction_id = ?,
            gateway_response = ?,
            payment_amount = ?,
            updatedAt = NOW()
          WHERE id = ?
        `;
        
        const gatewayResponse = JSON.stringify({
          transactionId: vnp_TransactionNo,
          bankCode: vnp_BankCode,
          payDate: vnp_PayDate,
          responseCode: vnp_ResponseCode,
          amount: amount
        });

        await executeQuery(updateOrderQuery, [
          vnp_TransactionNo,
          gatewayResponse,
          amount,
          vnp_TxnRef
        ]);

        console.log('Order updated successfully:', {
          orderId: vnp_TxnRef,
          transactionId: vnp_TransactionNo,
          amount: amount,
          bankCode: vnp_BankCode,
          payDate: vnp_PayDate
        });
      } catch (dbError) {
        console.('Failed to update order status:', dbError);
      }

      // Redirect to success page
      return NextResponse.redirect(new URL(`/payment/success?orderId=${vnp_TxnRef}&transactionId=${vnp_TransactionNo}`, request.url));
    } else {
      // Payment failed
      console.('VNPay payment failed:', {
        orderId: vnp_TxnRef,
        responseCode: vnp_ResponseCode,
        orderInfo: vnp_OrderInfo
      });

      // Update order status to failed
      try {
        const updateOrderQuery = `
          UPDATE \`order\` 
          SET 
            payment_status = 'failed',
            gateway_response = ?,
            updatedAt = NOW()
          WHERE id = ?
        `;
        
        const gatewayResponse = JSON.stringify({
          responseCode: vnp_ResponseCode,
          orderInfo: vnp_OrderInfo,
          : 'Payment failed'
        });

        await executeQuery(updateOrderQuery, [
          gatewayResponse,
          vnp_TxnRef
        ]);
      } catch (dbError) {
        console.('Failed to update order status:', dbError);
      }

      // Redirect to failed page
      return NextResponse.redirect(new URL(`/payment/failed?orderId=${vnp_TxnRef}&error=${vnp_ResponseCode}`, request.url));
    }

  } catch (error) {
    console.error('VNPay callback error:', error);
    return NextResponse.redirect(new URL('/payment/failed?=callback_error', .url));
  }
}

function verifyVNPaySignature(params: Record<string, string>, secureHash: string): boolean {
  try {
    // Remove vnp_SecureHash from parameters
    const { , ...otherParams } = params;
    
    // Sort parameters alphabetically
    const sortedParams = Object.keys(otherParams)
      .sort()
      .reduce((result: Record<string, string>, key) => {
        result[key] = otherParams[key];
        return result;
      }, {});

    // Create query string
    const queryString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Create secure hash
    const hmac = crypto.createHmac('sha512', VNPAY_HASH_SECRET);
    const calculatedHash = hmac.update(new Buffer(queryString, 'utf-8')).digest('hex');

    return calculatedHash === secureHash;
  } catch (error) {
    console.error('VNPay signature verification error:', );
    return false;
  }
}
