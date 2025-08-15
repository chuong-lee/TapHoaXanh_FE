"use client"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";

const STATUS_LABELS = [
  { key: "pending", label: "Chờ xác nhận", color: "warning" },
  { key: "confirmed", label: "Đã xác nhận", color: "info" },
  { key: "preparing", label: "Đang chuẩn bị", color: "primary" },
  { key: "shipping", label: "Đang vận chuyển", color: "warning" },
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Kiểm tra xem có thông báo thành công không
    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');
    
    if (success === 'true' && orderId) {
      setShowSuccessMessage(true);
      setSuccessOrderId(orderId);
      
      // Ẩn thông báo sau 5 giây
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessOrderId(null);
      }, 5000);
    }

    fetchOrders();
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/order");
      const data = Array.isArray(response.data) ? response.data : response.data.orders || [];
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const filtered = tab === "all" ? orders : orders.filter(o => o.status === tab);

  return (
    <main className="main-content">
      <div className="container py-4">
        {/* Thông báo đặt hàng thành công */}
        {showSuccessMessage && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-circle-check fs-4 me-3"></i>
              <div>
                <h5 className="alert-heading mb-1">Đặt hàng thành công!</h5>
                <p className="mb-0">
                  Đơn hàng #{successOrderId} của bạn đã được ghi nhận và đang chờ xử lý. 
                  Chúng tôi sẽ thông báo cho bạn khi đơn hàng được xác nhận.
                </p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowSuccessMessage(false)}
            ></button>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Đơn hàng của tôi</h2>
            <p className="text-muted">Theo dõi trạng thái đơn hàng của bạn</p>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn ${tab === "all" ? "btn-success" : "btn-outline-success"} btn-sm`}
              onClick={() => setTab("all")}
            >
              Tất cả ({orders.length})
            </button>
            {STATUS_LABELS.map(s => (
              <button
                key={s.key}
                className={`btn ${tab === s.key ? `btn-${s.color}` : `btn-outline-${s.color}`} btn-sm`}
                onClick={() => setTab(s.key)}
              >
                {s.label} ({orders.filter(o => o.status === s.key).length})
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải đơn hàng...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-5">
              <i className="fa-solid fa-shopping-bag fs-1 text-muted mb-3"></i>
              <h5 className="text-muted">Không có đơn hàng nào</h5>
              <p className="text-muted">
                {tab === "all" 
                  ? "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!" 
                  : `Không có đơn hàng nào ở trạng thái "${getStatusText(tab)}"`
                }
              </p>
              {tab === "all" && (
                <a href="/" className="btn btn-success">
                  <i className="fa-solid fa-shopping-cart me-2"></i>
                  Mua sắm ngay
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="row">
            {filtered.map(order => (
              <div key={order.id} className="col-12 mb-4">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">
                        <i className="fa-solid fa-shopping-cart me-2"></i>
                        Đơn hàng #{order.id}
                      </h6>
                      <small className="text-muted">
                        Đặt hàng lúc: {formatDate(order.created_at)}
                      </small>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="mb-3">
                          <strong>Thông tin giao hàng:</strong>
                          <div className="text-muted">
                            {order.shipping_name} - {order.shipping_phone}<br/>
                            {order.shipping_address}
                          </div>
                        </div>
                        
                        {order.orderItem && order.orderItem.length > 0 && (
                          <div className="mb-3">
                            <strong>Sản phẩm:</strong>
                            <div className="mt-2">
                              {order.orderItem.map((item, index) => (
                                <div key={item.id} className="d-flex align-items-center mb-2">
                                  <img 
                                    src={item.product.images} 
                                    alt={item.product.name}
                                    className="me-2"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                  />
                                  <div className="flex-grow-1">
                                    <div className="fw-bold">{item.product.name}</div>
                                    <small className="text-muted">
                                      SL: {item.quantity} × {item.price.toLocaleString('vi-VN')}₫
                                    </small>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {order.comment && (
                          <div className="mb-3">
                            <strong>Ghi chú:</strong>
                            <div className="text-muted">{order.comment}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="col-md-4 text-end">
                        <div className="mb-3">
                          <h5 className="text-success mb-0">
                            {order.price.toLocaleString("vi-VN")}₫
                          </h5>
                          <small className="text-muted">
                            {order.quantity} sản phẩm
                          </small>
                        </div>
                        
                        <div className="d-grid gap-2">
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="fa-solid fa-eye me-1"></i>
                            Xem chi tiết
                          </button>
                          {order.status === 'pending' && (
                            <button className="btn btn-outline-danger btn-sm">
                              <i className="fa-solid fa-times me-1"></i>
                              Hủy đơn hàng
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
