'use client';

import { useState,  } from 'react';
import Image from 'next/image';

interface VietQRPaymentProps {
  orderId: string;
  amount: number;
  ?: string;
  ?: string;
}

export default function VietQRPayment({ 
  orderId, 
  amount, 
  , 
   
}: VietQRPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [, ] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'&gt;('pending');

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

  const handleCopyAccountNumber = () =&gt; {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    // Có thể thêm toast notification ở đây
  };

  const handleCopyTransferContent = () =&gt; {
    navigator.clipboard.writeText(transferContent);
    // Có thể thêm toast notification ở đây
  };

  const checkPaymentStatus = async () =&gt; {
    setLoading(true);
    try {
      // Gọi API để kiểm tra trạng thái thanh toán
      const response = await fetch(`/api/payment/status/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus(data.status);
      }
    } catch (err) {
      console.('Error checking payment status:&#39;, );
    } finally {
      setLoading(false);
    }
  };

  // Tự động kiểm tra trạng thái thanh toán mỗi 30 giây
  useEffect(() =&gt; {
    const interval = setInterval(() =&gt; {
      if (paymentStatus === 'pending') {
        checkPaymentStatus();
      }
    }, 30000);

    return () =&gt; clearInterval(interval);
  }, [paymentStatus]);

  return (
    <div className="vietqr-payment"&gt;
      <div className="row g-4"&gt;
        {/* Order Info */}
        <div className="col-lg-4 col-md-6"&gt;
          <div className="bg-white rounded-3 p-4 border shadow-sm h-100"&gt;
            <div className="d-flex align-items-center mb-3"&gt;
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3"&gt;
                <i className="fas fa-info-circle text-success"&gt;&lt;/i>
              &lt;/div>
              <h6 className="mb-0 fw-bold">Thông tin đơn hàng</h6>
            &lt;/div>
            <div className="space-y-3"&gt;
              <div>
                <small className="text-muted d-block">Mã đơn hàng</small>
                <div className="text-primary fw-semibold"&gt;#{orderId}&lt;/div>
              &lt;/div>
              <div>
                <small className="text-muted d-block">Số tiền</small>
                <div className="text-success fw-bold fs-5"&gt;
                  {safeAmount.toLocaleString('vi-VN')}₫
                &lt;/div>
              &lt;/div>
              <div>
                <small className="text-muted d-block">Phương thức</small>
                <div className="text-success fw-semibold"&gt;
                  <i className="fas fa-university me-1"&gt;&lt;/i>
                  Chuyển khoản Vietcombank
                &lt;/div>
              &lt;/div>
              <div>
                <small className="text-muted d-block">Trạng thái</small>
                <div className={`fw-semibold ${
                  paymentStatus === 'success' ? 'text-success' : 
                  paymentStatus === 'failed' ? 'text-danger' : 'text-warning'
                }`}&gt;
                  {paymentStatus === 'success' ? &#39;Đã thanh toán' :
                   paymentStatus === 'failed' ? 'Thanh toán thất bại' : 'Chờ thanh toán'}
                &lt;/div>
              &lt;/div>
            &lt;/div>
          &lt;/div>
        &lt;/div>

        {/* QR Code */}
        <div className="col-lg-4 col-md-6"&gt;
          <div className="bg-white rounded-3 p-4 border shadow-sm h-100 text-center"&gt;
            <div className="d-flex align-items-center justify-content-center mb-3"&gt;
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3"&gt;
                <i className="fas fa-qrcode text-success"&gt;&lt;/i>
              &lt;/div>
              <h6 className="mb-0 fw-bold">Quét mã QR</h6>
            &lt;/div>
            <div className="bg-light rounded-3 p-3 d-inline-block"&gt;
              <img 
                src={bankInfo.qrCodeUrl} 
                alt="VietQR Code" 
                className="img-fluid"
                style={{ 
                  maxWidth: '220px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)&#39;
                }}
              /&gt;
            &lt;/div>
            <p className="text-muted small mt-2"&gt;
              Quét mã QR bằng ứng dụng ngân hàng
            &lt;/p>
          &lt;/div>
        &lt;/div>

        {/* Bank Info & Instructions */}
        <div className="col-lg-4 col-md-12"&gt;
          <div className="bg-white rounded-3 p-4 border shadow-sm h-100"&gt;
            <div className="d-flex align-items-center mb-3"&gt;
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3"&gt;
                <i className="fas fa-university text-success"&gt;&lt;/i>
              &lt;/div>
              <h6 className="mb-0 fw-bold">Thông tin tài khoản</h6>
            &lt;/div>
            
            <div className="bank-details mb-4"&gt;
              <div className="mb-3"&gt;
                <small className="text-muted d-block">Ngân hàng</small>
                <div className="fw-semibold"&gt;{bankInfo.bankName}&lt;/div>
              &lt;/div>
              <div className="mb-3"&gt;
                <small className="text-muted d-block">Số tài khoản</small>
                <div className="d-flex align-items-center"&gt;
                  <div className="fw-semibold me-2"&gt;{bankInfo.accountNumber}&lt;/div>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopyAccountNumber}
                    title="Sao chép số tài khoản"
                  &gt;
                    <i className="fas fa-copy"&gt;&lt;/i>
                  &lt;/button>
                &lt;/div>
              &lt;/div>
              <div className="mb-3"&gt;
                <small className="text-muted d-block">Chủ tài khoản</small>
                <div className="fw-semibold"&gt;{bankInfo.accountName}&lt;/div>
              &lt;/div>
              <div className="mb-3"&gt;
                <small className="text-muted d-block">Chi nhánh</small>
                <div className="fw-semibold"&gt;{bankInfo.branch}&lt;/div>
              &lt;/div>
              <div className="mb-3"&gt;
                <small className="text-muted d-block">Nội dung chuyển khoản</small>
                <div className="d-flex align-items-center"&gt;
                  <div className="fw-semibold me-2 text-break"&gt;{transferContent}&lt;/div>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleCopyTransferContent}
                    title="Sao chép nội dung"
                  &gt;
                    <i className="fas fa-copy"&gt;&lt;/i>
                  &lt;/button>
                &lt;/div>
              &lt;/div>
            &lt;/div>

            <div className="instructions mb-4"&gt;
              <h6 className="mb-2">Hướng dẫn thanh toán:&lt;/h6>
              <ol className="text-muted small" style={{paddingLeft: '1.2rem'}}&gt;
                <li className="mb-1">Mở ứng dụng ngân hàng</li>
                <li className="mb-1">Chọn "Chuyển khoản"&lt;/li>
                <li className="mb-1">Quét mã QR hoặc nhập thông tin tài khoản</li>
                <li className="mb-1">Nhập số tiền: {safeAmount.toLocaleString('vi-VN')}₫&lt;/li>
                <li className="mb-1">Nhập nội dung: {transferContent}&lt;/li>
                <li className="mb-1">Xác nhận và hoàn tất</li>
              &lt;/ol>
            &lt;/div>

            <button 
              className="btn btn-success w-100 py-3 fw-semibold"
              onClick={checkPaymentStatus}
              disabled={loading}
              style={{
                borderRadius: '12px',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)&#39;
              }}
            &gt;
              {loading ? (
                &lt;&gt;
                  <div className="spinner-border spinner-border-sm me-2" role="status"&gt;
                    <span className="visually-hidden">Loading...&lt;/span>
                  &lt;/div>
                  Đang kiểm tra...
                &lt;/&gt;
              ) : (
                &lt;&gt;
                  <i className="fas fa-sync-alt me-2"&gt;&lt;/i>
                  Kiểm tra thanh toán
                &lt;/&gt;
              )}
            &lt;/button>
          &lt;/div>
        &lt;/div>
      &lt;/div>

      {/* Payment Status Alert */}
      {paymentStatus === 'success' && (
        <div className="alert alert-success mt-3" role="alert"&gt;
          <i className="fas fa-check-circle me-2"&gt;&lt;/i>
          <strong>Thanh toán thành công!&lt;/strong> Đơn hàng của bạn đã được xác nhận.
        &lt;/div>
      )}

      {paymentStatus === 'failed' && (
        <div className="alert alert-danger mt-3" role="alert"&gt;
          <i className="fas fa-exclamation-triangle me-2"&gt;&lt;/i>
          <strong>Thanh toán thất bại!&lt;/strong> Vui lòng thử lại hoặc liên hệ hỗ trợ.
        &lt;/div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert"&gt;
          <i className="fas fa-exclamation-triangle me-2"&gt;&lt;/i>
          {}
        &lt;/div>
      )}
    &lt;/div>
  );
}
