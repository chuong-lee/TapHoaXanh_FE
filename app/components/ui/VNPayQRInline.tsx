'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useVNPayPayment } from '@/hooks/useVNPayPayment';

interface VNPayQRInlineProps {
  orderId: string;
  amount: number;
  customerEmail?: string;
  customerPhone?: string;
}

export default function VNPayQRInline({ 
  orderId, 
  amount, 
  customerEmail, 
  customerPhone 
}: VNPayQRInlineProps) {
  const { createPayment, loading, error } = useVNPayPayment();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  // Đảm bảo amount không âm
  const safeAmount = Math.max(0, amount);

  useEffect(() => {
    if (orderId && safeAmount > 0) {
      generatePayment();
    }
  }, [orderId, safeAmount]);

  const generatePayment = async () => {
    try {
      const result = await createPayment({
        orderId,
        amount: safeAmount,
        customerEmail,
        customerPhone
      });

      if (result.success && result.data) {
        setPaymentUrl(result.data.paymentUrl);
        // Tạo QR code từ payment URL
        const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(result.data.paymentUrl)}`;
        setQrCodeUrl(qrCodeApiUrl);
      }
    } catch (err) {
      console.error('Failed to generate payment:', err);
    }
  };

  const handlePaymentRedirect = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  return (
    <div className="vnpay-qr-inline">
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" style={{width: '2rem', height: '2rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang tạo mã QR...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <div className="text-danger mb-3">
            <i className="fas fa-exclamation-triangle fa-2x"></i>
          </div>
          <p className="text-danger mb-3">Lỗi tạo thanh toán</p>
          <button 
            className="btn btn-outline-primary"
            onClick={generatePayment}
          >
            <i className="fas fa-redo me-2"></i>
            Thử lại
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Order Info */}
          <div className="col-lg-4 col-md-6">
            <div className="bg-white rounded-3 p-4 border shadow-sm h-100">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <i className="fas fa-info-circle text-primary"></i>
                </div>
                <h6 className="mb-0 fw-bold">Thông tin đơn hàng</h6>
              </div>
              <div className="space-y-3">
                <div>
                  <small className="text-muted d-block">Mã đơn hàng</small>
                  <div className="text-primary fw-semibold">#{orderId}</div>
                </div>
                <div>
                  <small className="text-muted d-block">Số tiền</small>
                  <div className="text-success fw-bold fs-5">
                    {safeAmount.toLocaleString('vi-VN')}₫
                  </div>
                </div>
                <div>
                  <small className="text-muted d-block">Phương thức</small>
                  <div className="text-info fw-semibold">
                    <i className="fab fa-vnpay me-1"></i>
                    VNPay
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="col-lg-4 col-md-6">
            <div className="bg-white rounded-3 p-4 border shadow-sm h-100 text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <i className="fas fa-qrcode text-primary"></i>
                </div>
                <h6 className="mb-0 fw-bold">Quét mã QR</h6>
              </div>
              {qrCodeUrl ? (
                <div className="bg-light rounded-3 p-3 d-inline-block">
                  <Image 
                    src={qrCodeUrl} 
                    alt="VNPay QR Code" 
                    width={220}
                    height={220}
                    className="img-fluid"
                    style={{ 
                      maxWidth: '220px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              ) : (
                <div className="bg-light rounded-3 p-5 d-inline-block">
                  <i className="fas fa-qrcode fa-3x text-muted"></i>
                </div>
              )}
            </div>
          </div>

          {/* Instructions & Actions */}
          <div className="col-lg-4 col-md-12">
            <div className="bg-white rounded-3 p-4 border shadow-sm h-100">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                  <i className="fas fa-list-ol text-primary"></i>
                </div>
                <h6 className="mb-0 fw-bold">Hướng dẫn</h6>
              </div>
              <ol className="text-muted mb-4" style={{paddingLeft: '1.2rem'}}>
                <li className="mb-2">Mở ứng dụng VNPay</li>
                <li className="mb-2">Chọn "Quét mã QR"</li>
                <li className="mb-2">Quét mã QR bên cạnh</li>
                <li className="mb-2">Xác nhận thanh toán</li>
              </ol>
              
              <button 
                className="btn btn-primary w-100 py-3 fw-semibold"
                onClick={handlePaymentRedirect}
                disabled={!paymentUrl}
                style={{
                  borderRadius: '12px',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}
              >
                <i className="fas fa-external-link-alt me-2"></i>
                Thanh toán qua VNPay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
