"use client"
import { useEffect, useState } from "react";
import api from "@/lib/axios";

const STATUS_LABELS = [
  { key: "pending", label: "Chờ xác nhận", color: "warning" },
  { key: "confirmed", label: "Đã xác nhận", color: "info" },
  { key: "preparing", label: "Đang chuẩn bị", color: "primary" },
  { key: "shipping", label: "Đang vận chuyển", color: "warning" },
  { key: "delivered", label: "Đã giao hàng", color: "success" },
  { key: "cancelled", label: "Đã hủy", color: "danger" },
  { key: "returned", label: "Đã trả hàng", color: "secondary" },
];

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
  shipped_at: string;
  delivered_at: string;
  admin_note: string;
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [tab, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/order${tab !== 'all' ? `?status=${tab}` : ''}&page=${currentPage}&limit=10`);
      
      if (response.data.orders) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setOrders(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/order/${orderId}/status`, { status: newStatus });
      await fetchOrders(); // Refresh danh sách
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Có lỗi khi cập nhật trạng thái!');
    } finally {
      setUpdating(null);
    }
  };

  const handleQuickAction = async (orderId: number, action: string) => {
    setUpdating(orderId);
    try {
      let endpoint = '';
      let message = '';
      
      switch (action) {
        case 'confirm':
          endpoint = `/order/${orderId}/confirm`;
          message = 'Đơn hàng đã được xác nhận thành công!';
          break;
        case 'ship':
          endpoint = `/order/${orderId}/ship`;
          message = 'Đơn hàng đã được chuyển sang vận chuyển!';
          break;
        case 'deliver':
          endpoint = `/order/${orderId}/deliver`;
          message = 'Đơn hàng đã được giao thành công!';
          break;
        case 'cancel':
          if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            setUpdating(null);
            return;
          }
          endpoint = `/order/${orderId}/cancel`;
          message = 'Đơn hàng đã được hủy!';
          break;
      }
      
      await api.patch(endpoint, { admin_note: `Đơn hàng đã được ${action} bởi admin` });
      await fetchOrders();
      alert(message);
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Có lỗi khi thực hiện thao tác!');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusConfig = STATUS_LABELS.find(s => s.key === status);
    return statusConfig ? `bg-${statusConfig.color}` : 'bg-secondary';
  };

  const getStatusText = (status: string) => {
    const statusConfig = STATUS_LABELS.find(s => s.key === status);
    return statusConfig ? statusConfig.label : status;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuickActions = (order: Order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          <button
            key="confirm"
            className="btn btn-sm btn-success me-1"
            onClick={() => handleQuickAction(order.id, 'confirm')}
            disabled={updating === order.id}
          >
            <i className="fa-solid fa-check me-1"></i>
            Xác nhận
          </button>
        );
        break;
      case 'confirmed':
        actions.push(
          <button
            key="ship"
            className="btn btn-sm btn-primary me-1"
            onClick={() => handleQuickAction(order.id, 'ship')}
            disabled={updating === order.id}
          >
            <i className="fa-solid fa-truck me-1"></i>
            Vận chuyển
          </button>
        );
        break;
      case 'shipping':
        actions.push(
          <button
            key="deliver"
            className="btn btn-sm btn-success me-1"
            onClick={() => handleQuickAction(order.id, 'deliver')}
            disabled={updating === order.id}
          >
            <i className="fa-solid fa-check-circle me-1"></i>
            Giao hàng
          </button>
        );
        break;
    }
    
    // Thêm nút hủy cho các trạng thái chưa hoàn thành
    if (['pending', 'confirmed', 'preparing', 'shipping'].includes(order.status)) {
      actions.push(
        <button
          key="cancel"
          className="btn btn-sm btn-danger"
          onClick={() => handleQuickAction(order.id, 'cancel')}
          disabled={updating === order.id}
        >
          <i className="fa-solid fa-times me-1"></i>
          Hủy
        </button>
      );
    }
    
    return actions;
  };

  return (
    <main className="main-content">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Quản lý đơn hàng</h2>
            <p className="text-muted">Quản lý tất cả đơn hàng trong hệ thống</p>
          </div>
          <a href="/admin/orders/pending-shipping" className="btn btn-warning">
            <i className="fa-solid fa-truck me-2"></i>
            Chờ vận chuyển
          </a>
        </div>

        {/* Status Tabs */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn ${tab === 'all' ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                onClick={() => setTab('all')}
              >
                Tất cả
              </button>
              {STATUS_LABELS.map(s => (
                <button
                  key={s.key}
                  className={`btn ${tab === s.key ? `btn-${s.color}` : `btn-outline-${s.color}`} btn-sm`}
                  onClick={() => setTab(s.key)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="fa-solid fa-inbox fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">Không có đơn hàng nào</h5>
              <p className="text-muted">Chưa có đơn hàng nào trong hệ thống.</p>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fa-solid fa-list me-2"></i>
                Danh sách đơn hàng ({orders.length})
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
                      <th>Ngày đặt</th>
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
                            {order.orderItem?.slice(0, 2).map((item, index) => (
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
                            {order.orderItem && order.orderItem.length > 2 && (
                              <small className="text-muted">
                                +{order.orderItem.length - 2} sản phẩm khác
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong className="text-success">
                            {order.price.toLocaleString('vi-VN')}₫
                          </strong>
                        </td>
                        <td>
                          <small>{formatDate(order.created_at)}</small>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {getQuickActions(order)}
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => alert(`Chi tiết đơn hàng #${order.id}`)}
                            >
                              <i className="fa-solid fa-eye me-1"></i>
                              Chi tiết
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

        {/* Statistics */}
        <div className="row mt-4">
          <div className="col-md-2">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h6 className="card-title">Chờ xác nhận</h6>
                <h4 className="mb-0">
                  {orders.filter(o => o.status === 'pending').length}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h6 className="card-title">Đã xác nhận</h6>
                <h4 className="mb-0">
                  {orders.filter(o => o.status === 'confirmed').length}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h6 className="card-title">Đang chuẩn bị</h6>
                <h4 className="mb-0">
                  {orders.filter(o => o.status === 'preparing').length}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h6 className="card-title">Đang vận chuyển</h6>
                <h4 className="mb-0">
                  {orders.filter(o => o.status === 'shipping').length}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h6 className="card-title">Đã giao hàng</h6>
                <h4 className="mb-0">
                  {orders.filter(o => o.status === 'delivered').length}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card bg-danger text-white">
              <div className="card-body text-center">
                <h6 className="card-title">Đã hủy</h6>
                <h4 className="mb-0">
                  {orders.filter(o => o.status === 'cancelled').length}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 