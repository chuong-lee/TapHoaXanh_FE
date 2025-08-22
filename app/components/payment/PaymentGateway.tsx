'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface PaymentGatewayProps {
  orderId: string;
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess?: (transactionId: string) => void;
  onPaymentError?: (error: string) => void;
}

interface PaymentData {
  transaction_id: string;
  qr_code_url: string;
  bank_account: string;
  bank_name: string;
  amount: number;
  description: string;
  expires_at: string;
}

export default function PaymentGateway({
  orderId,
  amount,
  description,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
  onPaymentError
}: PaymentGatewayProps) {
  const [paymentData, setPaymentData] = useState<any>(null);
  const loadingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePayment = async () => {
    loadingRef.current = true;
    setError(null);

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          amount: amount,
          description: `Thanh toan don hang ${orderId}`,
          customerName: customerName,
          customerEmail: customerEmail,
          customerPhone: customerPhone
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setPaymentData(result.data);
      } else {
        setError(result.message || 'Có lỗi xảy ra khi tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Có lỗi xảy ra khi tạo thanh toán');
    } finally {
      loadingRef.current = false;
    }
  };

  return (
    <div className="payment-gateway">
      <h3>Thanh Toán Qua Chuyển Khoản</h3>
      
      {!paymentData ? (
        <button 
          onClick={handleCreatePayment} 
          disabled={loadingRef.current}
          className="btn btn-primary"
        >
          {loadingRef.current ? 'Đang tạo thanh toán...' : 'Tạo QR Code Thanh Toán'}
        </button>
      ) : (
        <div className="payment-info">
          <div className="qr-section">
            <h4>Quét mã QR để thanh toán</h4>
            <img 
              src={paymentData.qr_code_url} 
              alt="QR Code" 
              style={{ maxWidth: '300px', border: '2px solid #28a745' }}
            />
          </div>
          
          <div className="bank-info">
            <h4>Thông Tin Tài Khoản</h4>
            <div className="bank-details">
              <p><strong>Ngân hàng:</strong> {paymentData.bank_name}</p>
              <p><strong>Số tài khoản:</strong> {paymentData.bank_account}</p>
              <p><strong>Chủ tài khoản:</strong> {paymentData.account_name}</p>
              <p><strong>Chi nhánh:</strong> {paymentData.branch}</p>
              <p><strong>Số tiền:</strong> {paymentData.amount?.toLocaleString('vi-VN')} VNĐ</p>
              <p><strong>Nội dung:</strong> {paymentData.description}</p>
            </div>
          </div>

          <div className="payment-status">
            <p><strong>Mã giao dịch:</strong> {paymentData.transaction_id}</p>
            <p><strong>Trạng thái:</strong> <span className="badge badge-warning">Chờ thanh toán</span></p>
            <p><small>QR Code có hiệu lực trong 15 phút</small></p>
          </div>

          <div className="payment-actions">
            <button 
              onClick={() => setPaymentData(null)} 
              className="btn btn-secondary"
            >
              Tạo lại QR Code
            </button>
            <button 
              onClick={() => window.location.href = `/payment/status?transaction_id=${paymentData.transaction_id}`}
              className="btn btn-info"
            >
              Kiểm tra trạng thái
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
    </div>
  );
};
