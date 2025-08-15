import crypto from 'crypto';

export const VNPAY_CONFIG = {
  TMN_CODE: process.env.VNPAY_TMN_CODE || '2QXUI4J4',
  HASH_SECRET: process.env.VNPAY_HASH_SECRET || 'KARPEBEMHBEYTODHLJOOQQRZIFJILURT',
  URL: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/payment/status',
  IPN_URL: process.env.VNPAY_IPN_URL || 'http://localhost:3000/api/payment/webhook',
  CURRENCY: 'VND',
  LOCALE: 'vn'
};

export interface VNPayPaymentRequest {
  amount: number;
  orderId: string;
  orderInfo: string;
  customerEmail?: string;
  customerPhone?: string;
}

export function createVNPayUrl(paymentData: VNPayPaymentRequest): string {
  const date = new Date();
  const createDate = date.toISOString().split('T')[0].split('-').join('');
  
  const txnRef = `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const vnpParams: any = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNPAY_CONFIG.TMN_CODE,
    vnp_Amount: paymentData.amount * 100, // VNPAY yêu cầu số tiền nhân 100
    vnp_CurrCode: VNPAY_CONFIG.CURRENCY,
    vnp_BankCode: '',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: paymentData.orderInfo,
    vnp_OrderType: 'other',
    vnp_Locale: VNPAY_CONFIG.LOCALE,
    vnp_ReturnUrl: VNPAY_CONFIG.RETURN_URL,
    vnp_IpnUrl: VNPAY_CONFIG.IPN_URL,
    vnp_CreateDate: createDate,
    vnp_IpAddr: '127.0.0.1'
  };

  // Thêm thông tin khách hàng nếu có
  if (paymentData.customerEmail) {
    vnpParams.vnp_Email = paymentData.customerEmail;
  }
  if (paymentData.customerPhone) {
    vnpParams.vnp_Phone = paymentData.customerPhone;
  }

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnpParams)
    .sort()
    .reduce((result: any, key) => {
      result[key] = vnpParams[key];
      return result;
    }, {});

  // Tạo chuỗi query string
  const queryString = Object.keys(sortedParams)
    .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  // Tạo chữ ký
  const signData = queryString;
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.HASH_SECRET);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  // Thêm chữ ký vào URL
  const vnpUrl = `${VNPAY_CONFIG.URL}?${queryString}&vnp_SecureHash=${signed}`;

  return vnpUrl;
}

export function verifyVNPayResponse(queryParams: any): boolean {
  const secureHash = queryParams['vnp_SecureHash'];
  
  // Loại bỏ vnp_SecureHash và vnp_SecureHashType khỏi params
  delete queryParams['vnp_SecureHash'];
  delete queryParams['vnp_SecureHashType'];

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(queryParams)
    .sort()
    .reduce((result: any, key) => {
      result[key] = queryParams[key];
      return result;
    }, {});

  // Tạo chuỗi query string
  const signData = Object.keys(sortedParams)
    .map(key => `${key}=${encodeURIComponent(sortedParams[key])}`)
    .join('&');

  // Tạo chữ ký
  const hmac = crypto.createHmac('sha512', VNPAY_CONFIG.HASH_SECRET);
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  return secureHash === signed;
}
