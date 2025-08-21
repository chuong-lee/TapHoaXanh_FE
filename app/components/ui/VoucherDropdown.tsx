'use client';

import { useState, useRef, useEffect } from 'react';
import { Voucher } from '@/hooks/useVouchers';

interface VoucherDropdownProps {
  vouchers: Voucher[];
  loading: boolean;
  selectedVoucher: Voucher | null;
  onSelectVoucher: (voucher: Voucher | null) => void;
  subtotal: number;
}

export default function VoucherDropdown({ 
  vouchers, 
  loading, 
  selectedVoucher, 
  onSelectVoucher, 
  subtotal 
}: VoucherDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format discount value
  const formatDiscount = (voucher: Voucher) => {
    if (voucher.type === 'percentage') {
      return `${voucher.max_discount}%`;
    } else {
      return `${voucher.max_discount.toLocaleString('vi-VN')}₫`;
    }
  };

  // Calculate actual discount
  const calculateDiscount = (voucher: Voucher) => {
    if (voucher.type === 'percentage') {
      const discount = (subtotal * voucher.max_discount) / 100;
      return discount;
    } else {
      return voucher.max_discount;
    }
  };

  // Check if voucher is applicable
  const isVoucherApplicable = (voucher: Voucher) => {
    return subtotal >= voucher.min_order_value;
  };

  // Filter applicable vouchers
  const applicableVouchers = vouchers.filter(isVoucherApplicable);

  return (
    <div className="voucher-dropdown" ref={dropdownRef}>
      <div className="d-flex align-items-center mb-3">
        <button 
          type="button" 
          className="btn btn-outline-primary me-2"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin me-2"></i>
              Đang tải...
            </>
          ) : (
            <>
              <i className="fas fa-ticket-alt me-2"></i>
              {selectedVoucher ? 'Đổi mã giảm giá' : 'Chọn mã giảm giá'}
            </>
          )}
        </button>
        
        {selectedVoucher && (
          <button 
            type="button" 
            className="btn btn-outline-danger btn-sm"
            onClick={() => onSelectVoucher(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {selectedVoucher && (
        <div className="alert alert-success mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{selectedVoucher.code}</strong>
              <br />
              <small className="text-muted">Giảm {formatDiscount(selectedVoucher)}</small>
            </div>
            <div className="text-end">
              <div className="text-success fw-bold">
                -{calculateDiscount(selectedVoucher).toLocaleString('vi-VN')}₫
              </div>
              <small className="text-muted">Giảm {formatDiscount(selectedVoucher)}</small>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="dropdown-menu show p-3" style={{ 
          position: 'absolute', 
          zIndex: 1000, 
          minWidth: '400px',
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px'
        }}>
          <h6 className="mb-3" style={{ color: '#495057', fontWeight: '600' }}>
            <i className="fas fa-ticket-alt me-2" style={{ color: '#007bff' }}></i>
            Mã giảm giá khả dụng
          </h6>
          
          {loading ? (
            <div className="text-center py-3">
              <i className="fas fa-spinner fa-spin me-2"></i>
              Đang tải mã giảm giá...
            </div>
          ) : applicableVouchers.length === 0 ? (
            <div className="text-center py-3 text-muted">
              <i className="fas fa-info-circle me-2"></i>
              Không có mã giảm giá khả dụng
              <br />
              <small>Đơn hàng tối thiểu: {Math.min(...vouchers.map(v => v.min_order_amount)).toLocaleString('vi-VN')}₫</small>
            </div>
          ) : (
            <div className="voucher-list">
              {applicableVouchers.map((voucher) => (
                <div 
                  key={voucher.id}
                  className={`voucher-item p-3 mb-2 border rounded cursor-pointer ${
                    selectedVoucher?.id === voucher.id ? 'border-success bg-light' : 'border-light'
                  }`}
                  onClick={() => {
                    onSelectVoucher(voucher);
                    setIsOpen(false);
                  }}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedVoucher?.id === voucher.id ? '#f8f9fa' : '#ffffff',
                    transition: 'all 0.2s ease',
                    color: '#333333'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selectedVoucher?.id === voucher.id ? '#f8f9fa' : '#ffffff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="fw-bold" style={{ color: '#007bff', fontSize: '1.1rem' }}>{voucher.code}</div>
                      <div className="fw-bold" style={{ color: '#28a745', fontSize: '1rem' }}>Giảm {formatDiscount(voucher)}</div>
                      <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>Loại: {voucher.type}</div>
                      <div className="text-muted small">
                        <i className="fas fa-calendar me-1"></i>
                        HSD: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                                          <div className="text-end">
                        <div className="fw-bold" style={{ color: '#dc3545', fontSize: '1.1rem' }}>
                          -{calculateDiscount(voucher).toLocaleString('vi-VN')}₫
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Giảm {formatDiscount(voucher)}
                        </div>
                        <div style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                          Tối thiểu: {voucher.min_order_value.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-3 pt-3 border-top">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
                             Mã giảm giá chỉ áp dụng cho đơn hàng từ {Math.min(...vouchers.map(v => v.min_order_value)).toLocaleString('vi-VN')}₫
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
