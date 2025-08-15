"use client"
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface AdminOrderNotificationProps {
  onNewOrder?: () => void;
}

export default function AdminOrderNotification({ onNewOrder }: AdminOrderNotificationProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [lastOrderCount, setLastOrderCount] = useState(0);

  useEffect(() => {
    fetchOrderCounts();
    
    // Polling để cập nhật số lượng đơn hàng mỗi 10 giây
    const interval = setInterval(fetchOrderCounts, 10000);
    
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
      if (pendingTotal > lastOrderCount && lastOrderCount > 0) {
        setShowNotification(true);
        if (onNewOrder) {
          onNewOrder();
        }
        
        // Phát âm thanh thông báo
        playNotificationSound();
      }

      setLastOrderCount(pendingTotal);
      setPendingCount(pendingTotal);
      setConfirmedCount(confirmedTotal);
    } catch (error) {
      console.error('Error fetching order counts:', error);
    }
  };

  const playNotificationSound = () => {
    try {
      // Tạo âm thanh thông báo đơn giản
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Không thể phát âm thanh thông báo');
    }
  };

  const handleNotificationClick = () => {
    setShowNotification(false);
    window.location.href = '/admin/orders';
  };

  const handleViewPendingShipping = () => {
    setShowNotification(false);
    window.location.href = '/admin/orders/pending-shipping';
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
          <div className="toast show" role="alert" style={{ minWidth: '450px' }}>
            <div className="toast-header bg-warning text-dark">
              <i className="fa-solid fa-bell me-2"></i>
              <strong className="me-auto">Thông báo đơn hàng mới!</strong>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowNotification(false)}
              ></button>
            </div>
            <div className="toast-body">
              <div className="mb-3">
                <h6 className="mb-2">Có đơn hàng mới chờ xử lý!</h6>
                <p className="mb-2 text-muted">
                  Hiện tại có <strong>{pendingCount}</strong> đơn hàng chờ xác nhận và <strong>{confirmedCount}</strong> đơn hàng chờ vận chuyển.
                </p>
              </div>
              
              <div className="d-flex gap-2 mb-3">
                <button 
                  className="btn btn-warning btn-sm flex-fill"
                  onClick={handleViewPendingShipping}
                >
                  <i className="fa-solid fa-truck me-1"></i>
                  Chờ vận chuyển
                </button>
                <button 
                  className="btn btn-primary btn-sm flex-fill"
                  onClick={handleNotificationClick}
                >
                  <i className="fa-solid fa-list me-1"></i>
                  Tất cả đơn hàng
                </button>
              </div>
              
              <div className="alert alert-info alert-sm mb-0">
                <i className="fa-solid fa-info-circle me-1"></i>
                <small>
                  Đơn hàng mới sẽ được hiển thị ở đầu danh sách. Vui lòng xử lý kịp thời để đảm bảo trải nghiệm khách hàng tốt nhất.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
