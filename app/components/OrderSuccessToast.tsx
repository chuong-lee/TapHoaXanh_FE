"use client"
import { useEffect, useState } from "react";

interface OrderSuccessToastProps {
  orderId: string;
  totalAmount: number;
  productCount: number;
  paymentMethod: string;
  onClose: () => void;
}

export default function OrderSuccessToast({ 
  orderId, 
  totalAmount, 
  productCount, 
  paymentMethod, 
  onClose 
}: OrderSuccessToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hiển thị toast sau 100ms để có animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'qr': return 'Thanh toán qua QR';
      case 'bank': return 'Chuyển khoản ngân hàng';
      case 'ewallet': return 'Ví điện tử';
      default: return 'N/A';
    }
  };

  return (
    <div 
      className={`position-fixed top-0 end-0 p-3`} 
      style={{ 
        zIndex: 9999,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
      }}
    >
      <div className="toast show" role="alert" style={{ minWidth: '400px' }}>
        <div className="toast-header bg-success text-white">
          <i className="fa-solid fa-circle-check me-2"></i>
          <strong className="me-auto">Đặt hàng thành công!</strong>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          ></button>
        </div>
        <div className="toast-body">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="fa-solid fa-shopping-cart me-2 text-success"></i>
              <strong>Đơn hàng #{orderId}</strong>
            </div>
            <p className="mb-2 text-muted">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.
            </p>
          </div>
          
          <div className="bg-light p-3 rounded mb-3">
            <div className="row text-center">
              <div className="col-4">
                <div className="fw-bold text-success">{totalAmount.toLocaleString('vi-VN')}₫</div>
                <small className="text-muted">Tổng tiền</small>
              </div>
              <div className="col-4">
                <div className="fw-bold text-primary">{productCount}</div>
                <small className="text-muted">Sản phẩm</small>
              </div>
              <div className="col-4">
                <div className="fw-bold text-info">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <small className="text-muted">Thanh toán</small>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <small className="text-muted">
              <strong>Phương thức thanh toán:</strong> {getPaymentMethodText(paymentMethod)}
            </small>
          </div>
          
          <div className="d-flex gap-2">
            <button 
              className="btn btn-success btn-sm flex-fill"
              onClick={() => {
                window.location.href = `/orders?success=true&orderId=${orderId}`;
              }}
            >
              <i className="fa-solid fa-eye me-1"></i>
              Xem đơn hàng
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              Đóng
            </button>
          </div>
          
          <div className="mt-3">
            <div className="alert alert-info alert-sm mb-0">
              <i className="fa-solid fa-info-circle me-1"></i>
              <small>
                Chúng tôi sẽ thông báo cho bạn khi đơn hàng được xác nhận và bắt đầu vận chuyển.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
