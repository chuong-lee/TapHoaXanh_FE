'use client';

import { useState, useEffect } from 'react';
import { useVNPayPayment } from &#39;@/hooks/useVNPayPayment';

interface VNPayQRModalProps {
  isOpen: boolean;
  onClose: () =&gt; void;
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
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(&#39;');
  const [paymentUrl, setPaymentUrl] = useState<string>(&#39;');

  useEffect(() =&gt; {
    if (isOpen && orderId) {
      generatePayment();
    }
  }, [isOpen, orderId]);

  const generatePayment = async () =&gt; {
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
      console.error('Failed to generate payment:&#39;, err);
    }
  };

  const handlePaymentRedirect = () =&gt; {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}&gt;
      <div className="modal-dialog modal-dialog-centered"&gt;
        <div className="modal-content"&gt;
          <div className="modal-header"&gt;
            <h5 className="modal-title"&gt;
              <i className="fas fa-qrcode text-primary me-2"&gt;&lt;/i>
              Thanh toán VNPay
            &lt;/h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            &gt;&lt;/button>
          &lt;/div>
          
          <div className="modal-body text-center"&gt;
            {loading ? (
              <div className="py-5"&gt;
                <div className="spinner-border text-primary" role="status"&gt;
                  <span className="visually-hidden">Loading...&lt;/span>
                &lt;/div>
                <p className="mt-3 text-muted"&gt;Đang tạo mã QR...&lt;/p>
              &lt;/div>
            ) : error ? (
              <div className="py-4"&gt;
                <div className="text-danger mb-3"&gt;
                  <i className="fas fa-exclamation-triangle fa-2x"&gt;&lt;/i>
                &lt;/div>
                <h6 className="text-danger">Lỗi tạo thanh toán</h6>
                <p className="text-muted"&gt;{error}&lt;/p>
                <button 
                  className="btn btn-primary"
                  onClick={generatePayment}
                &gt;
                  <i className="fas fa-redo me-2"&gt;&lt;/i>
                  Thử lại
                &lt;/button>
              &lt;/div>
            ) : (
              &lt;&gt;
                {/* Order Info */}
                <div className="bg-light rounded p-3 mb-4"&gt;
                  <div className="row text-start"&gt;
                    <div className="col-6"&gt;
                      <strong>Mã đơn hàng:&lt;/strong>
                    &lt;/div>
                    <div className="col-6"&gt;
                      <span className="text-primary"&gt;#{orderId}&lt;/span>
                    &lt;/div>
                  &lt;/div>
                  <div className="row text-start mt-2"&gt;
                    <div className="col-6"&gt;
                      <strong>Số tiền:&lt;/strong>
                    &lt;/div>
                    <div className="col-6"&gt;
                      <span className="text-success fw-bold"&gt;
                        {amount.toLocaleString('vi-VN')}₫
                      &lt;/span>
                    &lt;/div>
                  &lt;/div>
                &lt;/div>

                {/* QR Code */}
                <div className="mb-4"&gt;
                  <h6 className="mb-3">Quét mã QR để thanh toán</h6>
                  {qrCodeUrl ? (
                    <div className="border rounded p-3 d-inline-block"&gt;
                      <img 
                        src={qrCodeUrl} 
                        alt="VNPay QR Code" 
                        className="img-fluid"
                        style={{ maxWidth: '250px' }}
                      /&gt;
                    &lt;/div>
                  ) : (
                    <div className="border rounded p-5 d-inline-block"&gt;
                      <i className="fas fa-qrcode fa-3x text-muted"&gt;&lt;/i>
                    &lt;/div>
                  )}
                &lt;/div>

                {/* Instructions */}
                <div className="text-start mb-4"&gt;
                  <h6 className="mb-2">Hướng dẫn thanh toán:&lt;/h6>
                  <ol className="small text-muted"&gt;
                    <li>Mở ứng dụng VNPay trên điện thoại</li>
                    <li>Chọn tính năng "Quét mã QR"&lt;/li>
                    <li>Quét mã QR bên trên</li>
                    <li>Xác nhận thông tin và hoàn tất thanh toán</li>
                  &lt;/ol>
                &lt;/div>

                {/* Alternative Payment Link */}
                <div className="mb-3"&gt;
                  <p className="text-muted small mb-2">Hoặc bấm vào link bên dưới:&lt;/p>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={handlePaymentRedirect}
                    disabled={!paymentUrl}
                  &gt;
                    <i className="fas fa-external-link-alt me-2"&gt;&lt;/i>
                    Thanh toán qua VNPay
                  &lt;/button>
                &lt;/div>
              &lt;/&gt;
            )}
          &lt;/div>
          
          <div className="modal-footer"&gt;
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            &gt;
              Đóng
            &lt;/button>
          &lt;/div>
        &lt;/div>
      &lt;/div>
      
      {/* Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}&gt;&lt;/div>
    &lt;/div>
  );
}
