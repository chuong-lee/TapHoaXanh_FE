"use client"
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Order {
  id: number;
  price: number;
  quantity: number;
  status: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_name: string;
  created_at: string;
  confirmed_at: string;
  users?: {
    name: string;
    email: string;
  };
  orderItem?: Array<{
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      images: string;
    };
  }>;
}

export default function PendingShippingOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingOrder, setProcessingOrder] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/order/pending-shipping?page=${currentPage}&limit=10`);
      setOrders(response.data.orders || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShipOrder = async (orderId: number) => {
    try {
      setProcessingOrder(orderId);
      await api.patch(`/order/${orderId}/ship`, {
        admin_note: 'Đơn hàng đã được chuyển sang vận chuyển'
      });
      
      // Refresh the orders list
      fetchOrders();
      
      // Show success message
      alert('Đơn hàng đã được chuyển sang trạng thái vận chuyển thành công!');
    } catch (error) {
      console.error('Error shipping order:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    } finally {
      setProcessingOrder(null);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setProcessingOrder(orderId);
      await api.patch(`/order/${orderId}/cancel`, {
        admin_note: 'Đơn hàng đã được hủy bởi admin'
      });
      
      // Refresh the orders list
      fetchOrders();
      
      // Show success message
      alert('Đơn hàng đã được hủy thành công!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setProcessingOrder(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-info';
      case 'preparing': return 'bg-primary';
      case 'shipping': return 'bg-warning';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      case 'returned': return 'bg-secondary';
      default: return 'bg-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'preparing': return 'Đang chuẩn bị';
      case 'shipping': return 'Đang vận chuyển';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Đã trả hàng';
      default: return status;
    }
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải danh sách đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-0">Đơn hàng chờ vận chuyển</h2>
              <p className="text-muted">Quản lý các đơn hàng đã xác nhận và chờ vận chuyển</p>
            </div>
            <a href="/admin/orders" className="btn btn-outline-primary">
              <i className="fa-solid fa-arrow-left me-2"></i>
              Quay lại
            </a>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="fa-solid fa-truck fs-1 text-muted mb-3"></i>
            <h5 className="text-muted">Không có đơn hàng nào chờ vận chuyển</h5>
            <p className="text-muted">Tất cả đơn hàng đã được xử lý hoặc chưa có đơn hàng nào được xác nhận.</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fa-solid fa-truck me-2"></i>
              Danh sách đơn hàng chờ vận chuyển ({orders.length})
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Ngày xác nhận</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{order.shipping_name}</div>
                          <small className="text-muted">{order.shipping_phone}</small>
                          <br />
                          <small className="text-muted">{order.shipping_address}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          {order.orderItem?.map((item, index) => (
                            <div key={item.id} className="d-flex align-items-center mb-1">
                              <img 
                                src={item.product.images} 
                                alt={item.product.name}
                                className="me-2"
                                style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                              />
                              <div>
                                <small className="fw-bold">{item.product.name}</small>
                                <br />
                                <small className="text-muted">SL: {item.quantity}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className="text-success">
                          {order.price.toLocaleString('vi-VN')}₫
                        </strong>
                      </td>
                      <td>
                        <small>{formatDate(order.confirmed_at)}</small>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => handleShipOrder(order.id)}
                            disabled={processingOrder === order.id}
                          >
                            {processingOrder === order.id ? (
                              <span className="spinner-border spinner-border-sm me-1"></span>
                            ) : (
                              <i className="fa-solid fa-truck me-1"></i>
                            )}
                            Vận chuyển
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={processingOrder === order.id}
                          >
                            <i className="fa-solid fa-times me-1"></i>
                            Hủy
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
