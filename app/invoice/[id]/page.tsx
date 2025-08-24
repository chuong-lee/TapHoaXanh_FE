'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images: string;
}

interface Order {
  id: number;
  createdAt: string;
  price: number;
  status: string;
  paymentMethod: string;
  deliveryDate: string;
  items: OrderItem[];
  address: string;
  user: any;
  quantity: number;
  comment: string;
}

export default function InvoicePage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${orderId}`);
        if (response.data?.success) {
          setOrder(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h3>Không tìm thấy đơn hàng</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Hóa Đơn</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Hóa Đơn</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main-content">
        <div className="invoice-container" style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            borderBottom: '2px solid #e9ecef',
            paddingBottom: '20px'
          }}>
            <div>
              <h1 style={{ color: '#28a745', margin: 0 }}>TẠP HÓA XANH</h1>
              <p style={{ margin: '8px 0 0 0', color: '#6c757d' }}>
                123 Đường ABC, Quận 1, TP.HCM<br />
                Điện thoại: 0123-456-789<br />
                Email: info@taphoxanh.com
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ color: '#495057', margin: 0 }}>HÓA ĐƠN</h2>
              <p style={{ margin: '8px 0 0 0', color: '#6c757d' }}>
                Số hóa đơn: #{order.id}<br />
                Ngày: {formatDate(order.createdAt)}<br />
                Trạng thái: {order.status}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#495057', marginBottom: '16px' }}>Thông tin khách hàng</h3>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '4px 0' }}>
                <strong>Tên khách hàng:</strong> {order.user?.name || 'Khách hàng'}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Email:</strong> {order.user?.email || 'N/A'}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Địa chỉ giao hàng:</strong> {order.address}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Ngày giao dự kiến:</strong> {formatDate(order.deliveryDate)}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#495057', marginBottom: '16px' }}>Chi tiết đơn hàng</h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #e9ecef'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e9ecef' }}>Sản phẩm</th>
                  <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e9ecef' }}>Số lượng</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #e9ecef' }}>Đơn giá</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #e9ecef' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '12px', border: '1px solid #e9ecef' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img 
                            src={item.images} 
                            alt={item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e9ecef' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #e9ecef' }}>
                        {formatPrice(item.price)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #e9ecef' }}>
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: '12px', textAlign: 'center', border: '1px solid #e9ecef' }}>
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div style={{ marginBottom: '30px' }}>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span>Tổng tiền hàng:</span>
                <span>{formatPrice(order.price)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span>Phí vận chuyển:</span>
                <span>0₫</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}>
                <span>Giảm giá:</span>
                <span>0₫</span>
              </div>
              <hr style={{ margin: '16px 0' }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                <span>Tổng cộng:</span>
                <span>{formatPrice(order.price)}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#495057', marginBottom: '16px' }}>Thông tin thanh toán</h3>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '4px 0' }}>
                <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Trạng thái thanh toán:</strong> {order.status}
              </p>
              <p style={{ margin: '4px 0' }}>
                <strong>Ghi chú:</strong> {order.comment || 'Không có'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '2px solid #e9ecef',
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#6c757d', margin: '8px 0' }}>
              Cảm ơn bạn đã mua sắm tại Tạp Hóa Xanh!
            </p>
            <p style={{ color: '#6c757d', margin: '8px 0' }}>
              Mọi thắc mắc vui lòng liên hệ: 0123-456-789
            </p>
          </div>

          {/* Print Button */}
          <div style={{
            marginTop: '30px',
            textAlign: 'center'
          }}>
            <button 
              onClick={handlePrint}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: '1px solid #007bff',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              In hóa đơn
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 