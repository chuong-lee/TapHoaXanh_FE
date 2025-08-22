'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VietQRPaymentProps {
  orderId: string;
  amount: number;
  customerEmail?: string;
  customerPhone?: string;
}

export default function VietQRPayment({ 
  orderId, 
  amount, 
  customerEmail, 
  customerPhone 
}: VietQRPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  // Thông tin tài khoản Vietcombank thực tế
  const bankInfo = {
    accountNumber: '1030517435',
    accountName: 'LE TUAN MINH',
    bankName: 'Vietcombank',
    branch: 'BINH PHUOC - TRU',
    qrCodeUrl: 'https://img.vietqr.io/image/VCB-1030517435-qr_only.png'
  };

  // Đảm bảo amount không âm
  const safeAmount = Math.max(0, amount);

  // Tạo nội dung chuyển khoản
  const transferContent = `Thanh toan don hang #${orderId}`;

  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    // Có thể thêm toast notification ở đây
  };

  const handleCopyTransferContent = () => {
    navigator.clipboard.writeText(transferContent);
    // Có thể thêm toast notification ở đây
  };

  const checkPaymentStatus = async () => {
    setLoading(true);
    try {
      // Gọi API để kiểm tra trạng thái thanh toán
      const response = await fetch(`/api/payment/status/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus(data.status);
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tự động kiểm tra trạng thái thanh toán mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      if (paymentStatus === 'pending') {
        checkPaymentStatus();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [paymentStatus]);

  return (
    <div className="vietqr-payment">
      <div className="row g-4">
        {/* Order Info */}
        <div className="col-lg-4 col-md-6">
          <div className="bg-white rounded-3 p-4 border shadow-sm h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-info-circle text-success"></i>
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
                <div className="text-success fw-semibold">
                  <i className="fas fa-university me-1"></i>
                  Chuyển khoản Vietcombank
                </div>
              </div>
              <div>
                <small className="text-muted d-block">Trạng thái</small>
                <div className={`fw-semibold ${
                  paymentStatus === 'success' ? 'text-success' : 
                  paymentStatus === 'failed' ? 'text-danger' : 'text-warning'
                }`}>
                  {paymentStatus === 'success' ? 'Đã thanh toán' :
                   paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Chờ thanh toán'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="col-lg-4 col-md-6">
          <div className="bg-white rounded-3 p-4 border shadow-sm h-100 text-center">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-qrcode text-success"></i>
              </div>
              <h6 className="mb-0 fw-bold">Quét mã QR</h6>
            </div>
            <div className="bg-light rounded-3 p-3 d-inline-block">
              <img 
                src={bankInfo.qrCodeUrl} 
                alt="VietQR Code" 
                className="img-fluid"
                style={{ 
                  maxWidth: '220px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </div>
            <p className="text-muted small mt-2">
              Quét mã QR bằng ứng dụng ngân hàng
            </p>
          </div>
        </div>

        {/* Bank Info & Instructions */}
        <div className="col-lg-4 col-md-12">
          <div className="bg-white rounded-3 p-4 border shadow-sm h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-university text-success"></i>
              </div>
              <h6 className="mb-0 fw-bold">Thông tin tài khoản</h6>
            </div>
            
            <div className="bank-details mb-4">
              <div className="mb-3">
                <small className="text-muted d-block">Ngân hàng</small>
                <div className="fw-semibold">{bankInfo.bankName}</div>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Số tài khoản</small>
                <div className="d-flex align-items-center">
                  <div className="fw-semibold me-2">{bankInfo.accountNumber}</div>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopyAccountNumber}
                    title="Sao chép số tài khoản"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Chủ tài khoản</small>
                <div className="fw-semibold">{bankInfo.accountName}</div>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Chi nhánh</small>
                <div className="fw-semibold">{bankInfo.branch}</div>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Nội dung chuyển khoản</small>
                <div className="d-flex align-items-center">
                  <div className="fw-semibold me-2 text-break">{transferContent}</div>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopyTransferContent}
                    title="Sao chép nội dung"
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="instructions mb-4">
              <h6 className="mb-2">Hướng dẫn thanh toán:</h6>
              <ol className="text-muted small" style={{paddingLeft: '1.2rem'}}>
                <li className="mb-1">Mở ứng dụng ngân hàng</li>
                <li className="mb-1">Chọn "Chuyển khoản"</li>
                <li className="mb-1">Quét mã QR hoặc nhập thông tin tài khoản</li>
                <li className="mb-1">Nhập số tiền: {safeAmount.toLocaleString('vi-VN')}₫</li>
                <li className="mb-1">Nhập nội dung: {transferContent}</li>
                <li className="mb-1">Xác nhận và hoàn tất</li>
              </ol>
            </div>

            <button 
              className="btn btn-success w-100 py-3 fw-semibold"
              onClick={checkPaymentStatus}
              disabled={loading}
              style={{
                borderRadius: '12px',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <i className="fas fa-sync-alt me-2"></i>
                  Kiểm tra thanh toán
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Status Alert */}
      {paymentStatus === 'success' && (
        <div className="alert alert-success mt-3" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          <strong>Thanh toán thành công!</strong> Đơn hàng của bạn đã được xác nhận.
        </div>
      )}

      {paymentStatus === 'failed' && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <strong>Thanh toán thất bại!</strong> Vui lòng thử lại hoặc liên hệ hỗ trợ.
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
    </div>
  );
}
