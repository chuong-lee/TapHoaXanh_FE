'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useVNPayPayment } from '@/hooks/useVNPayPayment';

interface VNPayQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  amount: number;
  customerEmail?: string;
  customerPhone?: string;
}

export default function VNPayQRModal({ 
  isOpen, 
  onClose, 
  orderId, 
  amount, 
  customerEmail, 
  customerPhone 
}: VNPayQRModalProps) {
  const { createPayment, loading, error } = useVNPayPayment();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen && orderId) {
      generatePayment();
    }
  }, [isOpen, orderId]);

  const generatePayment = async () => {
    try {
      const result = await createPayment({
        orderId,
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

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-qrcode text-primary me-2"></i>
              Thanh toán VNPay
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body text-center">
            {loading ? (
              <div className="py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Đang tạo mã QR...</p>
              </div>
            ) : error ? (
              <div className="py-4">
                <div className="text-danger mb-3">
                  <i className="fas fa-exclamation-triangle fa-2x"></i>
                </div>
                <h6 className="text-danger">Lỗi tạo thanh toán</h6>
                <p className="text-muted">{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={generatePayment}
                >
                  <i className="fas fa-redo me-2"></i>
                  Thử lại
                </button>
              </div>
            ) : (
              <>
                {/* Order Info */}
                <div className="bg-light rounded p-3 mb-4">
                  <div className="row text-start">
                    <div className="col-6">
                      <strong>Mã đơn hàng:</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-primary">#{orderId}</span>
                    </div>
                  </div>
                  <div className="row text-start mt-2">
                    <div className="col-6">
                      <strong>Số tiền:</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-success fw-bold">
                        {amount.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="mb-4">
                  <h6 className="mb-3">Quét mã QR để thanh toán</h6>
                  {qrCodeUrl ? (
                    <div className="border rounded p-3 d-inline-block">
                      <Image 
                        src={qrCodeUrl} 
                        alt="VNPay QR Code" 
                        width={250}
                        height={250}
                        className="img-fluid"
                        style={{ maxWidth: '250px' }}
                      />
                    </div>
                  ) : (
                    <div className="border rounded p-5 d-inline-block">
                      <i className="fas fa-qrcode fa-3x text-muted"></i>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="text-start mb-4">
                  <h6 className="mb-2">Hướng dẫn thanh toán:</h6>
                  <ol className="small text-muted">
                    <li>Mở ứng dụng VNPay trên điện thoại</li>
                    <li>Chọn tính năng "Quét mã QR"</li>
                    <li>Quét mã QR bên trên</li>
                    <li>Xác nhận thông tin và hoàn tất thanh toán</li>
                  </ol>
                </div>

                {/* Alternative Payment Link */}
                <div className="mb-3">
                  <p className="text-muted small mb-2">Hoặc bấm vào link bên dưới:</p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={handlePaymentRedirect}
                    disabled={!paymentUrl}
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Thanh toán qua VNPay
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
      
      {/* Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}
