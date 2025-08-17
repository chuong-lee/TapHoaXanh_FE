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
  if (!src || typeof src !== 'string' || !src.trim() || src === 'null' || src === 'undefined') return '/images/placeholder.jpg';
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
                      <th className="text-end">Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.filter(item => selected.some(s => s.slug === item.slug && s.variant_id === item.variant_id)).map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td className="text-end">{item.price.toLocaleString('vi-VN')}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <hr/>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Tổng tiền</span>
                  <span className="fw-bold text-danger fs-5">{total.toLocaleString()}₫</span>
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
