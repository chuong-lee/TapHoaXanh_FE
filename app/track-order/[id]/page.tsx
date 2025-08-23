'use client';

import React, { useState,  } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import Image from 'next/image';

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
  user: unknown;
  quantity: number;
  comment: string;
}

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  icon: string;
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = params.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  (() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${orderId}`);
        if (response.data?.success) {
          setOrder(response.data.data);
        }
      } catch {
        console.error('Error fetching order');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  const getTrackingSteps = (orderStatus: string): TrackingStep[] => {
    const steps: TrackingStep[] = [
      {
        id: 'ordered',
        title: 'Đã đặt hàng',
        description: 'Đơn hàng đã được đặt thành công',
        status: 'completed',
        date: order?.createdAt,
        icon: 'fas fa-shopping-cart'
      },
      {
        id: 'confirmed',
        title: 'Đã xác nhận',
        description: 'Đơn hàng đã được xác nhận bởi cửa hàng',
        status: orderStatus === 'pending' ? 'pending' : 'completed',
        icon: 'fas fa-check-circle'
      },
      {
        id: 'processing',
        title: 'Đang xử lý',
        description: 'Đơn hàng đang được chuẩn bị',
        status: orderStatus === 'confirmed' ? 'current' : 
                ['shipping', 'delivered'].includes(orderStatus) ? 'completed' : 'pending',
        icon: 'fas fa-box'
      },
      {
        id: 'shipping',
        title: 'Đang giao hàng',
        description: 'Đơn hàng đang được vận chuyển',
        status: orderStatus === 'shipping' ? 'current' : 
                orderStatus === 'delivered' ? 'completed' : 'pending',
        icon: 'fas fa-truck'
      },
      {
        id: 'delivered',
        title: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao thành công',
        status: orderStatus === 'delivered' ? 'completed' : 'pending',
        icon: 'fas fa-home'
      }
    ];

    // Nếu đơn hàng bị hủy
    if (orderStatus === 'cancelled') {
      return [
        {
          id: 'ordered',
          title: 'Đã đặt hàng',
          description: 'Đơn hàng đã được đặt thành công',
          status: 'completed',
          date: order?.createdAt,
          icon: 'fas fa-shopping-cart'
        },
        {
          id: 'cancelled',
          title: 'Đã hủy',
          description: 'Đơn hàng đã được hủy',
          status: 'current',
          icon: 'fas fa-times-circle'
        }
      ];
    }

    return steps;
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

  const trackingSteps = getTrackingSteps(order.status);

  return (
    <div className="container py-4">
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Theo Dõi Đơn Hàng</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Theo Dõi Đơn Hàng</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="tracking-container" style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{ color: '#28a745', marginBottom: '8px' }}>Theo dõi đơn hàng</h1>
          <p style={{ color: '#6c757d', fontSize: '18px' }}>
            Đơn hàng #{order.id} - {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Order Summary */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '16px' }}>Thông tin đơn hàng</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Tổng tiền:</strong> {formatPrice(order.price)}
            </div>
            <div>
              <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
            </div>
            <div>
              <strong>Địa chỉ giao hàng:</strong> {order.address}
            </div>
            <div>
              <strong>Ngày giao dự kiến:</strong> {formatDate(order.deliveryDate)}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '24px' }}>Trạng thái đơn hàng</h3>
          
          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: '0',
              bottom: '0',
              width: '2px',
              background: '#e9ecef',
              zIndex: 1
            }}></div>

            {trackingSteps.map((step) => (
              <div key={step.id} style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '32px',
                zIndex: 2
              }}>
                {/* Step icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  background: step.status === 'completed' ? '#28a745' : 
                             step.status === 'current' ? '#007bff' : '#e9ecef',
                  color: step.status === 'pending' ? '#6c757d' : 'white',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  <i className={step.icon}></i>
                </div>

                {/* Step content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      color: step.status === 'pending' ? '#6c757d' : '#495057',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      {step.title}
                    </h4>
                    {step.date && step.status === 'completed' && (
                      <span style={{
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        {formatDate(step.date)}
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: 0,
                    color: step.status === 'pending' ? '#6c757d' : '#495057',
                    fontSize: '14px'
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '16px' }}>Sản phẩm đã đặt</h3>
          {order.items && order.items.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px'
                }}>
                  <Image 
                    src={item.images} 
                    alt={item.name}
                    width={60}
                    height={60}
                    style={{ 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      marginRight: '16px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: '0 0 4px 0', color: '#495057' }}>{item.name}</h5>
                    <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                      Số lượng: {item.quantity} x {formatPrice(item.price)}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#28a745' }}>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6c757d', textAlign: 'center' }}>Không có sản phẩm nào</p>
          )}
        </div>

        {/* Contact Info */}
        <div style={{
          background: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          marginTop: '30px',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#495057', marginBottom: '16px' }}>Cần hỗ trợ?</h4>
          <p style={{ color: '#6c757d', marginBottom: '16px' }}>
            Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              padding: '12px 20px',
              background: '#28a745',
              color: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-phone"></i>
              <span>0123-456-789</span>
            </div>
            <div style={{
              padding: '12px 20px',
              background: '#007bff',
              color: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="fas fa-envelope"></i>
              <span>support@taphoxanh.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 