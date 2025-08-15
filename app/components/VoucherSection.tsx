'use client'
import { useState, useEffect } from 'react'
import api from '../lib/axios'

export default function VoucherSection() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        console.log('VoucherSection: Fetching vouchers...');
        const response = await api.get('/api/voucher');
        console.log('VoucherSection: Response:', response.data);
        setVouchers(response.data || []);
      } catch (error) {
        console.error('VoucherSection: Error:', error);
        setVouchers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleVoucherSelect = (voucher: any) => {
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
  };

  return (
    <div className="mb-3">
      <h6 className="fw-bold mb-2">Mã giảm giá ({vouchers.length})</h6>
      
      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-success" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <div className="small text-muted mt-1">Đang tải mã giảm giá...</div>
        </div>
      ) : vouchers.length > 0 ? (
        <div className="voucher-container" style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '10px',
          paddingBottom: '5px'
        }}>
          {vouchers.map((voucher) => (
            <div 
              key={voucher.id}
              className="voucher-item" 
              style={{
                minWidth: '200px',
                padding: '12px',
                backgroundColor: selectedVoucher?.id === voucher.id ? '#dcfce7' : '#f0fdf4',
                border: selectedVoucher?.id === voucher.id ? '1.5px solid #22c55e' : '1.5px solid #bbf7d0',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
              onClick={() => handleVoucherSelect(voucher)}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="fw-bold text-success">{voucher.code}</div>
                  <div className="small text-muted">
                    Giảm {voucher.max_discount.toLocaleString()}₫
                    {voucher.min_order_value > 0 && ` (Đơn tối thiểu ${voucher.min_order_value.toLocaleString()}₫)`}
                  </div>
                </div>
                <div className="text-success">
                  {selectedVoucher?.id === voucher.id ? (
                    <i className="fa-solid fa-check-circle"></i>
                  ) : (
                    <i className="fa-solid fa-tag"></i>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3">
          <div className="text-muted">
            <i className="fa-solid fa-tag me-2"></i>
            Không có mã giảm giá nào
          </div>
        </div>
      )}
    </div>
  )
}
