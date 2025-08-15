"use client"
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface OrderNotificationProps {
  onNewOrder?: () => void;
}

export default function OrderNotification({ onNewOrder }: OrderNotificationProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    fetchOrderCounts();
    
    // Polling để cập nhật số lượng đơn hàng mỗi 30 giây
    const interval = setInterval(fetchOrderCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrderCounts = async () => {
    try {
      const [pendingResponse, confirmedResponse] = await Promise.all([
        api.get('/order?status=pending&limit=1'),
        api.get('/order?status=confirmed&limit=1')
      ]);

      const pendingTotal = pendingResponse.data.pagination?.total || 0;
      const confirmedTotal = confirmedResponse.data.pagination?.total || 0;

      // Kiểm tra nếu có đơn hàng mới
      if (pendingTotal > pendingCount && pendingCount > 0) {
        setShowNotification(true);
        if (onNewOrder) {
          onNewOrder();
        }
      }

      setPendingCount(pendingTotal);
      setConfirmedCount(confirmedTotal);
    } catch (error) {
      console.error('Error fetching order counts:', error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    window.location.href = '/admin/orders';
  };

  return (
    <>
      {/* Badge hiển thị số lượng đơn hàng chờ xử lý */}
      {(pendingCount > 0 || confirmedCount > 0) && (
        <div className="position-relative d-inline-block">
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {pendingCount + confirmedCount}
            <span className="visually-hidden">đơn hàng chờ xử lý</span>
          </span>
        </div>
      )}

      {/* Toast notification */}
      {showNotification && (
        <div 
          className="position-fixed top-0 end-0 p-3" 
          style={{ zIndex: 1050 }}
        >
          <div className="toast show" role="alert">
            <div className="toast-header bg-warning text-dark">
              <i className="fa-solid fa-bell me-2"></i>
              <strong className="me-auto">Thông báo đơn hàng</strong>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowNotification(false)}
              ></button>
            </div>
            <div className="toast-body">
              <p className="mb-2">Có đơn hàng mới chờ xử lý!</p>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={handleNotificationClick}
                >
                  Xem ngay
                </button>
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowNotification(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
