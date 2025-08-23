'use client';
import React, { useState,  } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PaymentGateway from '../components/payment/PaymentGateway';
import Link from 'next/link';

interface OrderData {
  id: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function PaymentPage() {
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  (() => {
    if (!orderId) {
      ('Không tìm thấy mã đơn hàng');
      setLoading(false);
      return;
    }

    fetchOrderData();
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const response = await fetch(`/api/order/${orderId}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Không thể tải thông tin đơn hàng');
      }

      setOrderData(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? .message : 'Lỗi không xác định';
      (errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    // Redirect to success page
    .push(`/payment/success?transactionId=${transactionId}&orderId=${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    // Redirect to error page
    .push(`/payment/error?error=${encodeURIComponent()}&orderId=${orderId}`);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Đang tải thông tin đơn hàng...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body text-center">
                <i className="fa fa-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3">Lỗi</h4>
                <p className="text-muted">{ || 'Không thể tải thông tin đơn hàng'}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => .push('/')}
                >
                  <i className="fa fa-home me-2"></i>
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Thanh Toán</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/cart">Giỏ Hàng</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Thanh Toán</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main-content">
        <div className="row">
          <div className="col-lg-8">
            <PaymentGateway
              orderId={orderData.id}
              amount={orderData.total_amount}
              description={`Thanh toán đơn hàng ${orderData.id}`}
              customerName={orderData.customer_name}
              customerEmail={orderData.customer_email}
              customerPhone={orderData.customer_phone}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fa fa-shopping-cart me-2"></i>
                  Chi tiết đơn hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="order-summary">
                  <h6>Mã đơn hàng: {orderData.id}</h6>
                  <hr />
                  
                  <div className="order-items">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between mb-2">
                        <span>{item.product_name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    ))}
                  </div>
                  
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Tổng cộng:</strong>
                    <strong>{orderData.total_amount.toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>
                
                <hr />
                
                <div className="customer-info">
                  <h6>Thông tin khách hàng</h6>
                  <p><strong>Tên:</strong> {orderData.customer_name}</p>
                  <p><strong>Email:</strong> {orderData.customer_email}</p>
                  <p><strong>Điện thoại:</strong> {orderData.customer_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
