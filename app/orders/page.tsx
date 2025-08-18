"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";

const STATUS_LABELS = [
  { key: "pending", label: "Chờ vận chuyển", color: "warning" },
  { key: "confirmed", label: "Đã xác nhận", color: "info" },
  { key: "shipping", label: "Đang vận chuyển", color: "primary" },
  { key: "delivered", label: "Đã giao hàng", color: "success" },
  { key: "cancelled", label: "Đã hủy", color: "danger" },
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
  comment: string;
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
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    // Initialize tab from URL (?tab=...)
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTab = params.get('tab');
      if (urlTab && (urlTab === 'all' || STATUS_LABELS.some(s => s.key === urlTab))) {
        setTab(urlTab);
      }
    } catch {}
    fetchOrders();
  }, [tab]);

  // Keep URL in sync when tab changes
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tab);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } catch {}
  }, [tab]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/order${tab !== 'all' ? `?status=${tab}` : ''}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setLoading(false);
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

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  return (
    <main className="main-content">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">Quản lý đơn hàng</h2>
          <div className="d-flex gap-2">
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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="alert alert-info">
            <i className="fa-solid fa-info-circle me-2"></i>
            Không có đơn hàng nào ở mục này.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái hiện tại</th>
                  <th>Thay đổi trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : "-"}
                    </td>
                    <td>
                      <strong className="text-success">
                        {order.price?.toLocaleString("vi-VN")}₫
                      </strong>
                    </td>
                    <td>
                      <span className={`badge bg-${STATUS_LABELS.find(s => s.key === order.status)?.color}`}>
                        {STATUS_LABELS.find(s => s.key === order.status)?.label}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                      >
                        {STATUS_LABELS.map(status => (
                          <option key={status.key} value={status.key}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => alert(`Chi tiết đơn hàng #${order.id}`)}
                      >
                        <i className="fa-solid fa-eye me-1"></i>
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4">
          <div className="row">
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">Chờ vận chuyển</h5>
                  <h3 className="mb-0">
                    {orders.filter(o => o.status === 'pending').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">Đã xác nhận</h5>
                  <h3 className="mb-0">
                    {orders.filter(o => o.status === 'confirmed').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">Đang vận chuyển</h5>
                  <h3 className="mb-0">
                    {orders.filter(o => o.status === 'shipping').length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h5 className="card-title">Đã giao hàng</h5>
                  <h3 className="mb-0">
                    {orders.filter(o => o.status === 'delivered').length}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 