'use client'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import api from '@/lib/axios'

interface Voucher {
  code: string;
  max_discount: number;
  min_order_value: number;
}

function fixImgSrc(src: string | undefined | null): string {
  if (!src || typeof src !== 'string' || !src.trim() || src === 'null' || src === 'undefined') return '/images/placeholder.png';
  if (src.startsWith('http')) return src;
  if (src.startsWith('/')) return src;
  if (src.startsWith('client/images/')) return '/' + src;
  if (src.startsWith('images/')) return '/' + src;
  return '/' + src;
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart()

  // State lưu danh sách slug sản phẩm được chọn
  const [selected, setSelected] = useState<{slug: string, variant_id?: number}[]>([]);
  const [showAll, setShowAll] = useState(false);
  
  // State cho voucher
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  // Hàm xử lý chọn/bỏ chọn sản phẩm
  const handleSelect = (slug: string, variant_id?: number) => {
    setSelected(prev => {
      const exists = prev.some(s => s.slug === slug && s.variant_id === variant_id);
      if (exists) {
        return prev.filter(s => !(s.slug === slug && s.variant_id === variant_id));
      } else {
        return [...prev, { slug, variant_id }];
      }
    });
  };

  // Tổng tiền chỉ tính sản phẩm được chọn
  const total = useMemo(() =>
    cart.filter(item => selected.some(s => s.slug === item.slug && s.variant_id === item.variant_id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart, selected]
  );

  // Hàm kiểm tra đã chọn hết chưa
  const allSelected = cart.length > 0 && selected.length === cart.length;
  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected(cart.map(item => ({ slug: item.slug, variant_id: item.variant_id })));
  };

  // Fetch vouchers từ API
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoadingVouchers(true);
        const response = await api.get('/voucher');
        const activeVouchers = response.data.filter((voucher: any) => {
          const now = new Date();
          const startDate = new Date(voucher.start_date);
          const endDate = new Date(voucher.end_date);
          return !voucher.is_used && now >= startDate && now <= endDate && voucher.quantity > 0;
        });
        setVouchers(activeVouchers);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        setVouchers([]);
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchVouchers();
  }, []);

  // Hàm xử lý chọn voucher
  const handleVoucherSelect = (voucher: any) => {
    if (selectedVoucher?.id === voucher.id) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
  };

  // Tính toán giảm giá
  const discount = selectedVoucher && total >= selectedVoucher.min_order_value 
    ? Math.min(selectedVoucher.max_discount, total * 0.1) // Giảm tối đa 10% hoặc max_discount
    : 0;

  // Tổng tiền sau giảm giá
  const finalTotal = total - discount;

  return (
    <main className="main-content">
      <div className="container py-5">
        <div className="row">
          {/* Left Column: Cart Items & Notes */}
          <div className="col-lg-8">
            <h4 className="fw-bold mb-1">Giỏ hàng của bạn</h4>
            <p className="text-muted">Bạn đang có {cart.length} sản phẩm trong giỏ hàng</p>
            {cart.length === 0 ? (
              <div className="alert alert-warning mt-4">Giỏ hàng của bạn đang trống.</div>
            ) : (
              <>
                {/* Chọn tất cả */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="select-all"
                    checked={allSelected}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label" htmlFor="select-all">
                    Chọn tất cả
                  </label>
                </div>
                {/* Hiển thị tối đa 5 sản phẩm, nếu nhiều hơn thì có nút xem tất cả */}
                {(showAll ? cart : cart.slice(0, 5)).map((item, idx) => (
                  <div className="card mb-3 border-0 border-bottom rounded-0 pb-3" key={item.id + '-' + idx}>
                    <div className="row g-0 align-items-center">
                      <div className="col-md-1 text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selected.some(s => s.slug === item.slug && s.variant_id === item.variant_id)}
                          onChange={() => handleSelect(item.slug, item.variant_id)}
                        />
                      </div>
                      <div className="col-md-2 text-center">
                        <Image
                          src={fixImgSrc(Array.isArray(item.images) ? item.images[0] : item.images)}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded"
                        />
                      </div>
                      <div className="col-md-5">
                        <div className="card-body py-0">
                          <h6 className="card-title mb-1" style={{marginTop: 12}}>
                            {item.name}
                            {item.variant_name && <span className="text-muted"> ({item.variant_name})</span>}
                          </h6>
                          <p className="card-text text-muted small">(Hộp 500g)</p>
                          <p className="card-text fw-bold">{(item.price * (1-item.discount/100)).toLocaleString()}₫</p>
                        </div>
                      </div>
                      <div className="col-md-3 d-flex justify-content-center">
                        <div className="input-group" style={{ width: '120px' }}>
                          <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.slug, item.variant_id, item.quantity - 1)}>-</button>
                          <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                          <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.slug, item.variant_id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <div className="col-md-1 d-flex justify-content-center">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => removeFromCart(item.slug, item.variant_id)}
                          title="Xóa sản phẩm"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Nút xem tất cả nếu có nhiều hơn 5 sản phẩm */}
                {cart.length > 5 && !showAll && (
                  <div className="text-center my-2">
                    <button
                      className="btn btn-link"
                      style={{ textDecoration: 'none', fontWeight: 500 }}
                      onClick={() => setShowAll(true)}
                    >
                      Hiển thị tất cả sản phẩm <span style={{fontSize: '1.2em'}}>&#8595;</span>
                    </button>
                  </div>
                )}
                {/* Nút thu gọn nếu đã mở rộng */}
                {cart.length > 5 && showAll && (
                  <div className="text-center my-2">
                    <button
                      className="btn btn-link"
                      style={{ textDecoration: 'none', fontWeight: 500 }}
                      onClick={() => setShowAll(false)}
                    >
                      Thu gọn <span style={{fontSize: '1.2em'}}>&#8593;</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Đã bỏ phần ghi chú đơn hàng ở đây */}
            {/* <div className="mt-4">
              <label htmlFor="order-notes" className="form-label fw-bold">Ghi chú đơn hàng</label>
              <textarea className="form-control" id="order-notes" rows={4}></textarea>
            </div>
            <button className="btn btn-success mt-3" style={{backgroundColor: '#005246'}}>LƯU THÔNG TIN</button> */}
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-3 mb-4" style={{ marginTop: 32 }}>
              <div className="card-body">
                <h5 className="card-title fw-bold">Thông tin đơn hàng</h5>
                <hr />
                <table className="table mb-3">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">SL</th>
                      <th className="text-end">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.filter(item => selected.some(s => s.slug === item.slug && s.variant_id === item.variant_id)).map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <hr/>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                {selectedVoucher && (
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-success">Giảm giá ({selectedVoucher.code})</span>
                    <span className="text-success">-{discount.toLocaleString()}₫</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Tổng tiền</span>
                  <span className="fw-bold text-danger fs-5">{finalTotal.toLocaleString()}₫</span>
                </div>
                
                {/* Voucher Section */}
                <div className="mb-3">
                  <h6 className="fw-bold mb-2">Mã giảm giá</h6>
                  {loadingVouchers ? (
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
                      paddingBottom: '5px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#22c55e #f0fdf4'
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
                        Hiện tại không có mã giảm giá nào
                      </div>
                    </div>
                  )}
                  
                  {/* Custom scrollbar styles */}
                  <style jsx>{`
                    .voucher-container::-webkit-scrollbar {
                      height: 6px;
                    }
                    .voucher-container::-webkit-scrollbar-track {
                      background: #f0fdf4;
                      border-radius: 3px;
                    }
                    .voucher-container::-webkit-scrollbar-thumb {
                      background: #22c55e;
                      border-radius: 3px;
                    }
                    .voucher-container::-webkit-scrollbar-thumb:hover {
                      background: #16a34a;
                    }
                    .voucher-item:hover {
                      transform: translateY(-2px);
                      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
                      border-color: #22c55e;
                    }
                  `}</style>
                </div>
                
                {/* Disable nút thanh toán nếu không chọn sản phẩm nào */}
                <button
                  className={`btn w-100 mt-2 fw-bold${selected.length === 0 ? ' disabled' : ''}`}
                  style={{
                    background: '#fb923c',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600
                  }}
                  tabIndex={selected.length === 0 ? -1 : 0}
                  aria-disabled={selected.length === 0}
                  disabled={selected.length === 0}
                  onClick={() => {
                    if (selected.length === 0) return;
                    // Lưu danh sách sản phẩm đã chọn vào localStorage
                    const selectedItems = cart.filter(item => selected.some(s => s.slug === item.slug && s.variant_id === item.variant_id));
                    localStorage.setItem('cart_selected', JSON.stringify(selectedItems));
                    
                    // Lưu voucher đã chọn vào localStorage
                    if (selectedVoucher) {
                      localStorage.setItem('selectedVoucher', JSON.stringify(selectedVoucher));
                    } else {
                      localStorage.removeItem('selectedVoucher');
                    }
                    
                    window.location.href = '/checkout';
                  }}
                >
                  THANH TOÁN
                </button>
              </div>
            </div>
            <div className="card border-0" style={{backgroundColor: '#e6f6f2'}}>
              <div className="card-body">
                <h6 className="card-title fw-bold">Chính sách mua hàng</h6>
                <p className="card-text small">Mua trên 100.000đ để có thể áp dụng mã giảm giá từ shop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
