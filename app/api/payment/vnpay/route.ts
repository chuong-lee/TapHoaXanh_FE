import { , NextResponse } from 'next/server';
import crypto from 'crypto';
import {  } from '@/lib/db';

// VNPay Configuration
const VNPAY_TMN_CODE = process.env.VNPAY_TMN_CODE || '2QXUI4J4';
const VNPAY_HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'KASJHDFKASJHFKASJHFKASJHF';
const VNPAY_URL = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const VNPAY_RETURN_URL = process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/vnpay/callback';

export async function POST(request: NextRequest) {
  try {
    const body = await .json();
    const { orderId, amount, ,  } = body;

    // Validate required fields
    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, : 'Missing order ID or amount' },
        { status: 400 }
      );
    }

    // Create VNPay payment URL directly with provided data
    const vnpayUrl = createVNPayUrl({
      amount: parseFloat(amount),
      orderId: orderId.toString(),
      orderInfo: `Thanh toan don hang #${orderId}`,
      customerEmail,
      customerPhone
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl: vnpayUrl,
        orderId: orderId.toString(),
        amount: parseFloat(amount),
        orderInfo: `Thanh toan don hang #${orderId}`
      }
    });

  } catch (error) {
    console.error('VNPay payment error:', error);
    return NextResponse.json(
      { success: false, : 'Failed to create payment URL' },
      { status: 500 }
    );
  }
}

interface VNPayParams {
  amount: number;
  orderId: string;
  orderInfo: string;
  ?: string;
  ?: string;
}

function createVNPayUrl(params: VNPayParams): string {
  const date = new Date();
  const createDate = date.toISOString().slice(0, 8).replace(/-/g, '');
  
  const txnRef = params.orderId;
  const amount = Math.round(params.amount * 100); // Convert to VND (smallest unit)
  
  const vnpParams: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    : VNPAY_TMN_CODE,
    vnp_Amount: amount.toString(),
    vnp_CurrCode: 'VND',
    vnp_BankCode: '',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: VNPAY_RETURN_URL,
    vnp_IpAddr: '127.0.0.1',
    vnp_CreateDate: createDate,
  };

  // Add optional parameters
  if (params.customerEmail) {
    vnpParams.vnp_Email = params.;
  }
  if (params.customerPhone) {
    vnpParams.vnp_Phone = params.;
  }

  // Sort parameters alphabetically
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((result: Record<string, string>, key) => {
      result[key] = vnpParams[key];
      return result;
    }, {});

  // Create query string
  const queryString = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  // Create secure hash
  const signData = queryString;
  const hmac = crypto.createHmac('sha512', VNPAY_HASH_SECRET);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  // Add signature to query string
  const finalQueryString = `${queryString}&vnp_SecureHash=${signed}`;

  return `${VNPAY_URL}?${finalQueryString}`;
}
