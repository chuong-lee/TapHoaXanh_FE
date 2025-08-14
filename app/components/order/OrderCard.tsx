'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

interface OrderItem {
  id: number;
  quantity: number;
  images: string;
  unit_price: number;
  productId: number;
  orderId: number;
  productName?: string;
  productSlug?: string;
}

interface Order {
  id: number;
  price: number;
  quantity: number;
  images: string;
  comment: string;
  status: string;
  usersId: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  onOrderCancelled: () => void;
}

const ORDER_STATUS_CONFIG = {
  pending: {
    label: 'Chờ xác nhận',
    color: 'warning',
    icon: '⏳'
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: 'info',
    icon: '✅'
  },
  shipping: {
    label: 'Đang giao',
    color: 'primary',
    icon: '🚚'
  },
  delivered: {
    label: 'Đã giao',
    color: 'success',
    icon: '📦'
  },
  cancelled: {
    label: 'Đã hủy',
    color: 'danger',
    icon: '❌'
  }
} as const;

export default function OrderCard({ order, onOrderCancelled }: OrderCardProps) {
  const isLoadingRef = useRef(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || {
    label: 'Không xác định',
    color: 'secondary',
    icon: '❓'
  };

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  const handleCancelOrder = async () => {
    if (!canCancel) return;

    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    isLoadingRef.current = true;
    try {
      await api.put(`/order/${order.id}/cancel`);
      alert('Đơn hàng đã được hủy thành công');
      onOrderCancelled();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi hủy đơn hàng';
      alert(errorMessage);
    } finally {
      isLoadingRef.current = false;
    }
  };

  const handleViewDetails = () => {
    setShowDetails(!showDetails);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0">Đơn hàng #{order.id}</h6>
          <small className="text-muted">
            {formatDate(order.createdAt)}
          </small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className={`badge bg-${statusConfig.color}`}>
            {statusConfig.icon} {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <div className="d-flex justify-content-between mb-2">
              <span>Tổng tiền:</span>
              <strong className="text-primary">{formatPrice(order.price)}</strong>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Số lượng:</span>
              <span>{order.quantity} sản phẩm</span>
            </div>
            {order.comment && (
              <div className="mb-2">
                <span>Ghi chú:</span>
                <p className="text-muted mb-0 small">{order.comment}</p>
              </div>
            )}
          </div>
          <div className="col-md-4">
            <div className="d-grid gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleViewDetails}
              >
                {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
              </button>
              {canCancel && (
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleCancelOrder}
                  disabled={isLoadingRef.current}
                >
                  {isLoadingRef.current ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" />
                      Đang hủy...
                    </>
                  ) : (
                    'Hủy đơn hàng'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        {showDetails && order.items && order.items.length > 0 && (
          <div className="mt-3 border-top pt-3">
            <h6>Chi tiết sản phẩm:</h6>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.images && (
                            <img
                              src={item.images}
                              alt="Product"
                              className="me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          )}
                          <span>{item.productName || `Sản phẩm #${item.productId}`}</span>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.unit_price)}</td>
                      <td>{formatPrice(item.quantity * item.unit_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tracking progress */}
        <div className="mt-3 border-top pt-3">
          <h6>Theo dõi tiến độ:</h6>
          <div className="progress mb-2" style={{ height: '8px' }}>
            <div
              className={`progress-bar bg-${statusConfig.color}`}
              style={{
                width: order.status === 'pending' ? '25%' :
                       order.status === 'confirmed' ? '50%' :
                       order.status === 'shipping' ? '75%' :
                       order.status === 'delivered' ? '100%' : '0%'
              }}
            />
          </div>
          <div className="d-flex justify-content-between small text-muted">
            <span>Đặt hàng</span>
            <span>Xác nhận</span>
            <span>Giao hàng</span>
            <span>Hoàn thành</span>
          </div>
        </div>
      </div>
    </div>
  );
} 