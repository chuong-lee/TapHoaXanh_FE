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

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  return (
    <>
      <div className="container py-5">
        <div className="row">
          {/* Left Column: Cart Items & Notes */}
          <div className="col-lg-8">
            <h4 className="fw-bold mb-1">Giỏ hàng của bạn</h4>
            <p className="text-muted">Bạn đang có {cart.length} sản phẩm trong giỏ hàng</p>
            {cart.length === 0 ? (
              <div className="alert alert-warning mt-4">Giỏ hàng của bạn đang trống.</div>
            ) : (
              cart.map((item, idx) => (
                <div className="card mb-3 border-0 border-bottom rounded-0 pb-3" key={item.id + '-' + idx}>
                  <div className="row g-0 align-items-center">
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
                        <h6 className="card-title mb-1">{item.name}</h6>
                        <p className="card-text text-muted small">(Hộp 500g)</p>
                        <p className="card-text fw-bold">{(item.price * (1-item.discount/100)).toLocaleString()}₫</p>
                      </div>
                    </div>
                    <div className="col-md-3 d-flex justify-content-center">
                      <div className="input-group" style={{ width: '120px' }}>
                        <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)}>-</button>
                        <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="col-md-2 d-flex justify-content-center">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => removeFromCart(item.slug)}
                        title="Xóa sản phẩm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="mt-4">
              <label htmlFor="order-notes" className="form-label fw-bold">Ghi chú đơn hàng</label>
              <textarea className="form-control" id="order-notes" rows={4}></textarea>
            </div>
            <button className="btn btn-success mt-3" style={{backgroundColor: '#005246'}}>LƯU THÔNG TIN</button>
          </div>

          {/* Right Column: Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-3 mb-4">
              <div className="card-body">
                <h5 className="card-title fw-bold">Thông tin đơn hàng</h5>
                <hr />
                <div className="d-flex justify-content-between">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()}₫</span>
                </div>
                <hr/>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold">Tổng tiền</span>
                  <span className="fw-bold text-danger fs-5">{total.toLocaleString()}₫</span>
                </div>
                <Link href="/checkout" className="btn btn-dark w-100 mt-2 fw-bold">THANH TOÁN</Link>
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
    </>
  )
}
