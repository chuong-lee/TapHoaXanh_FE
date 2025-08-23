'use client';

import { useState, useEffect } from 'react';
import { useVNPayPayment } from &#39;@/hooks/useVNPayPayment';

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
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(&#39;');
  const [paymentUrl, setPaymentUrl] = useState<string>(&#39;');

  // Đảm bảo amount không âm
  const safeAmount = Math.max(0, amount);

  useEffect(() =&gt; {
    if (orderId && safeAmount &gt; 0) {
      generatePayment();
    }
  }, [orderId, safeAmount]);

  const generatePayment = async () =&gt; {
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
      console.error('Failed to generate payment:&#39;, err);
    }
  };

  const handlePaymentRedirect = () =&gt; {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  return (
    <div className="vnpay-qr-inline"&gt;
      {loading ? (
        <div className="text-center py-4"&gt;
          <div className="spinner-border text-primary" role="status" style={{width: '2rem', height: '2rem'}}&gt;
            <span className="visually-hidden">Loading...&lt;/span>
          &lt;/div>
          <p className="mt-3 text-muted"&gt;Đang tạo mã QR...&lt;/p>
        &lt;/div>
      ) : error ? (
        <div className="text-center py-4"&gt;
          <div className="text-danger mb-3"&gt;
            <i className="fas fa-exclamation-triangle fa-2x"&gt;&lt;/i>
          &lt;/div>
          <p className="text-danger mb-3">Lỗi tạo thanh toán</p>
          <button 
            className="btn btn-outline-primary"
            onClick={generatePayment}
          &gt;
            <i className="fas fa-redo me-2"&gt;&lt;/i>
            Thử lại
          &lt;/button>
        &lt;/div>
      ) : (
        <div className="row g-4"&gt;
          {/* Order Info */}
          <div className="col-lg-4 col-md-6"&gt;
            <div className="bg-white rounded-3 p-4 border shadow-sm h-100"&gt;
              <div className="d-flex align-items-center mb-3"&gt;
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3"&gt;
                  <i className="fas fa-info-circle text-primary"&gt;&lt;/i>
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
                  <div className="text-info fw-semibold"&gt;
                    <i className="fab fa-vnpay me-1"&gt;&lt;/i>
                    VNPay
                  &lt;/div>
                &lt;/div>
              &lt;/div>
            &lt;/div>
          &lt;/div>

          {/* QR Code */}
          <div className="col-lg-4 col-md-6"&gt;
            <div className="bg-white rounded-3 p-4 border shadow-sm h-100 text-center"&gt;
              <div className="d-flex align-items-center justify-content-center mb-3"&gt;
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3"&gt;
                  <i className="fas fa-qrcode text-primary"&gt;&lt;/i>
                &lt;/div>
                <h6 className="mb-0 fw-bold">Quét mã QR</h6>
              &lt;/div>
              {qrCodeUrl ? (
                <div className="bg-light rounded-3 p-3 d-inline-block"&gt;
                  <img 
                    src={qrCodeUrl} 
                    alt="VNPay QR Code" 
                    className="img-fluid"
                    style={{ 
                      maxWidth: '220px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)&#39;
                    }}
                  /&gt;
                &lt;/div>
              ) : (
                <div className="bg-light rounded-3 p-5 d-inline-block"&gt;
                  <i className="fas fa-qrcode fa-3x text-muted"&gt;&lt;/i>
                &lt;/div>
              )}
            &lt;/div>
          &lt;/div>

          {/* Instructions & Actions */}
          <div className="col-lg-4 col-md-12"&gt;
            <div className="bg-white rounded-3 p-4 border shadow-sm h-100"&gt;
              <div className="d-flex align-items-center mb-3"&gt;
                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3"&gt;
                  <i className="fas fa-list-ol text-primary"&gt;&lt;/i>
                &lt;/div>
                <h6 className="mb-0 fw-bold">Hướng dẫn</h6>
              &lt;/div>
              <ol className="text-muted mb-4" style={{paddingLeft: '1.2rem'}}&gt;
                <li className="mb-2">Mở ứng dụng VNPay</li>
                <li className="mb-2">Chọn "Quét mã QR"&lt;/li>
                <li className="mb-2">Quét mã QR bên cạnh</li>
                <li className="mb-2">Xác nhận thanh toán</li>
              &lt;/ol>
              
              <button 
                className="btn btn-primary w-100 py-3 fw-semibold"
                onClick={handlePaymentRedirect}
                disabled={!paymentUrl}
                style={{
                  borderRadius: '12px',
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)&#39;
                }}
              &gt;
                <i className="fas fa-external-link-alt me-2"&gt;&lt;/i>
                Thanh toán qua VNPay
              &lt;/button>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      )}
    &lt;/div>
  );
}
