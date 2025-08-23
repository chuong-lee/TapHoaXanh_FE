'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import OrderCard from './OrderCard'

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
  items?: unknown[];
}

interface OrderListProps {
  className?: string;
}

const STATUS_FILTERS = [
  { value: 'all', label: 'Tất cả', color: 'secondary' },
  { value: 'pending', label: 'Chờ xác nhận', color: 'warning' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'info' },
  { value: 'shipping', label: 'Đang giao', color: 'primary' },
  { value: 'delivered', label: 'Đã giao', color: 'success' },
  { value: 'cancelled', label: 'Đã hủy', color: 'danger' }
];

export default function OrderList({ className = '' }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/order');
      
      if (response.data.success && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        setOrders([]);
      }
    } catch (error: unknown) {
      console.error('Error loading orders:', error);
      setError('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderCancelled = () => {
    loadOrders(); // Reload orders after cancellation
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  if (loading) {
    return (
      <div className={`order-list ${className}`}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`order-list ${className}`}>
        <div className="alert alert-danger">
          <h5>Lỗi tải dữ liệu</h5>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger"
            onClick={loadOrders}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`order-list ${className}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title">Đơn hàng của tôi</h2>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Tổng cộng:</span>
          <span className="badge bg-primary">{orders.length}</span>
        </div>
      </div>

      {/* Status filters */}
      <div className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`btn btn-sm btn-outline-${filter.color} ${
                statusFilter === filter.value ? 'active' : ''
              }`}
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
              {filter.value !== 'all' && (
                <span className="badge bg-secondary ms-1">
                  {getStatusCount(filter.value)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-shopping-bag fa-3x text-muted"></i>
          </div>
          <h5 className="text-muted">
            {statusFilter === 'all' 
              ? 'Bạn chưa có đơn hàng nào'
              : `Không có đơn hàng ${STATUS_FILTERS.find(f => f.value === statusFilter)?.label.toLowerCase()}`
            }
          </h5>
          <p className="text-muted">
            {statusFilter === 'all' 
              ? 'Hãy mua sắm để tạo đơn hàng đầu tiên!'
              : 'Hãy thử chọn trạng thái khác hoặc tạo đơn hàng mới'
            }
          </p>
          {statusFilter === 'all' && (
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Mua sắm ngay
            </button>
          )}
        </div>
      ) : (
        <div className="orders-container">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onOrderCancelled={handleOrderCancelled}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {orders.length > 0 && (
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Thống kê đơn hàng:</h6>
          <div className="row">
            <div className="col-md-2 col-4 text-center">
              <div className="text-warning">
                <strong>{getStatusCount('pending')}</strong>
              </div>
              <small>Chờ xác nhận</small>
            </div>
            <div className="col-md-2 col-4 text-center">
              <div className="text-info">
                <strong>{getStatusCount('confirmed')}</strong>
              </div>
              <small>Đã xác nhận</small>
            </div>
            <div className="col-md-2 col-4 text-center">
              <div className="text-primary">
                <strong>{getStatusCount('shipping')}</strong>
              </div>
              <small>Đang giao</small>
            </div>
            <div className="col-md-2 col-4 text-center">
              <div className="text-success">
                <strong>{getStatusCount('delivered')}</strong>
              </div>
              <small>Đã giao</small>
            </div>
            <div className="col-md-2 col-4 text-center">
              <div className="text-danger">
                <strong>{getStatusCount('cancelled')}</strong>
              </div>
              <small>Đã hủy</small>
            </div>
            <div className="col-md-2 col-4 text-center">
              <div className="text-dark">
                <strong>{orders.length}</strong>
              </div>
              <small>Tổng cộng</small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 