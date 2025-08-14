import React from 'react';

interface PaymentStatusProps {
  status: string;
  paymentMethod?: string;
  amount?: number;
  showDetails?: boolean;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  status, 
  paymentMethod, 
  amount, 
  showDetails = false 
}) => {
  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { 
      label: string; 
      color: string; 
      icon: string; 
      description: string;
      action?: string;
    } } = {
      // Trạng thái đơn hàng
      'pending': { 
        label: 'Chờ xử lý', 
        color: '#ffc107', 
        icon: 'fas fa-clock',
        description: 'Đơn hàng đang chờ xác nhận từ cửa hàng'
      },
      'confirmed': { 
        label: 'Đã chấp nhận', 
        color: '#28a745', 
        icon: 'fas fa-check-circle',
        description: 'Đơn hàng đã được xác nhận và đang chuẩn bị'
      },
      'shipping': { 
        label: 'Đang giao hàng', 
        color: '#17a2b8', 
        icon: 'fas fa-truck',
        description: 'Đơn hàng đang được vận chuyển đến bạn'
      },
      'delivered': { 
        label: 'Đã giao hàng', 
        color: '#6f42c1', 
        icon: 'fas fa-box-check',
        description: 'Đơn hàng đã được giao thành công'
      },
      'cancelled': { 
        label: 'Đã hủy', 
        color: '#dc3545', 
        icon: 'fas fa-times-circle',
        description: 'Đơn hàng đã được hủy'
      },
      
      // Trạng thái thanh toán
      'payment_pending': { 
        label: 'Chưa thanh toán', 
        color: '#ffc107', 
        icon: 'fas fa-credit-card',
        description: 'Vui lòng hoàn tất thanh toán để xử lý đơn hàng',
        action: 'Thanh toán ngay'
      },
      'payment_success': { 
        label: 'Thanh toán thành công', 
        color: '#28a745', 
        icon: 'fas fa-check-circle',
        description: 'Thanh toán đã được xử lý thành công'
      },
      'payment_failed': { 
        label: 'Thanh toán thất bại', 
        color: '#dc3545', 
        icon: 'fas fa-exclamation-triangle',
        description: 'Thanh toán không thành công, vui lòng thử lại',
        action: 'Thử lại'
      },
      'payment_insufficient_funds': { 
        label: 'Số dư không đủ', 
        color: '#dc3545', 
        icon: 'fas fa-exclamation-circle',
        description: 'Tài khoản không đủ số dư để thực hiện thanh toán',
        action: 'Nạp tiền'
      },
      'payment_processing': { 
        label: 'Đang xử lý thanh toán', 
        color: '#17a2b8', 
        icon: 'fas fa-spinner fa-spin',
        description: 'Đang xử lý thanh toán, vui lòng chờ trong giây lát'
      },
      'payment_refunded': { 
        label: 'Đã hoàn tiền', 
        color: '#6c757d', 
        icon: 'fas fa-undo',
        description: 'Số tiền đã được hoàn về tài khoản của bạn'
      },
      'payment_partial': { 
        label: 'Thanh toán một phần', 
        color: '#fd7e14', 
        icon: 'fas fa-percentage',
        description: 'Chỉ một phần thanh toán được xử lý thành công',
        action: 'Thanh toán nốt'
      }
    };
    
    return statusMap[status] || { 
      label: 'Không xác định', 
      color: '#6c757d', 
      icon: 'fas fa-question-circle',
      description: 'Trạng thái không xác định'
    };
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="payment-status-container">
      <div className="status-badge" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: 600,
        background: statusInfo.color,
        color: 'white',
        marginBottom: showDetails ? '12px' : '0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <i className={statusInfo.icon} style={{ fontSize: '16px' }}></i>
        <span>{statusInfo.label}</span>
      </div>
      
      {showDetails && (
        <div className="status-details" style={{
          background: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginTop: '8px'
        }}>
          <p style={{ 
            margin: '0 0 12px 0', 
            color: '#6c757d',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            {statusInfo.description}
          </p>
          
          {paymentMethod && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              <i className="fas fa-credit-card" style={{ color: '#6c757d' }}></i>
              <span style={{ fontSize: '14px', color: '#495057' }}>
                Phương thức: {paymentMethod}
              </span>
            </div>
          )}
          
          {amount && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '12px'
            }}>
              <i className="fas fa-money-bill-wave" style={{ color: '#28a745' }}></i>
              <span style={{ fontSize: '14px', color: '#495057', fontWeight: 600 }}>
                Số tiền: {amount.toLocaleString('vi-VN')}₫
              </span>
            </div>
          )}
          
          {statusInfo.action && (
            <button style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: statusInfo.color,
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            >
              {statusInfo.action}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus; 