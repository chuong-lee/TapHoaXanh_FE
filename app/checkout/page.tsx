'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/axios'
import { useRouter } from 'next/navigation'

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  slug: string
  images: string
  discount: number
  description: string
  variant_id?: number
  variant_name?: string
  stock?: number
}

function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    createAccount: false,
    shipToDifferent: false,
    notes: '',
    agree: false,
    payment: 'bank',
    voucher: ''
  });

  // Danh sách voucher mẫu
  const voucherList = [
    { code: '', label: 'Không sử dụng voucher' },
    { code: 'SALE10', label: 'SALE10 - Giảm 10%' },
    { code: 'FREESHIP', label: 'FREESHIP - Miễn phí vận chuyển' }
  ];

  const [selectedProductVoucher, setSelectedProductVoucher] = useState<string | null>(null)
  const [selectedShippingVoucher, setSelectedShippingVoucher] = useState<string | null>(null)
  const router = useRouter();
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem("cart_selected");
    if (!selected || JSON.parse(selected).length === 0) {
      window.location.href = "/cart";
    }
    // Ưu tiên lấy sản phẩm đã chọn (cart_selected), nếu không có thì lấy toàn bộ cart_local
    if (selected) {
      try {
        setCart(JSON.parse(selected));
      } catch {
        setCart([]);
      }
    } else {
      const local = localStorage.getItem("cart_local");
      if (local) {
        try {
          setCart(JSON.parse(local));
        } catch {
          setCart([]);
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Lấy mã voucher đã chọn từ localStorage
    const productCode = localStorage.getItem('selectedProductVoucher')
    const shippingCode = localStorage.getItem('selectedShippingVoucher')
    setSelectedProductVoucher(productCode)
    setSelectedShippingVoucher(shippingCode)
    // Có thể fetch thêm thông tin voucher nếu cần
  }, [])

  useEffect(() => {
    const voucherStr = localStorage.getItem('selectedVoucher');
    if (voucherStr) {
      setSelectedVoucher(JSON.parse(voucherStr));
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('checkout_user_info');
    if (saved) {
      setForm(f => ({ ...f, ...JSON.parse(saved) }));
    }
  }, []);

  // Tính tổng tiền
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (selectedVoucher && subtotal >= selectedVoucher.min_order_value) {
    discount = Math.min(selectedVoucher.max_discount, subtotal);
  }
  const shipping = subtotal > 300000 ? 0 : 15000;
  const total = subtotal - discount + shipping;

  const requiredFields = [
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'city', label: 'Tỉnh/Thành phố' },
    { key: 'state', label: 'Huyện/Quận' },
    { key: 'zip', label: 'Xã/Thị trấn' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'email', label: 'Email' }
  ];

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = requiredFields.filter(f => !form[f.key as keyof typeof form]);
    if (missing.length > 0) {
      setErrorFields(missing.map(f => f.label));
      return;
    }
    setErrorFields([]);
    try {
      // Gửi đúng các trường backend yêu cầu
      await api.post('/order', {
        price: total,
        quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
        images: cart.map(item => item.images).join(','),
        comment: form.notes || '',
        orderItems: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          images: item.images,
          unit_price: item.price
        }))
      });

      // Nếu thành công mới xóa giỏ hàng và chuyển trang
      const cartLocal = JSON.parse(localStorage.getItem('cart_local') || '[]');
      const cartSelected = JSON.parse(localStorage.getItem('cart_selected') || '[]');
      const updatedCart = cartLocal.filter((item: any) =>
        !cartSelected.some((sel: any) => sel.id === item.id && sel.variant_id === item.variant_id)
      );
      localStorage.setItem('cart_local', JSON.stringify(updatedCart));
      localStorage.removeItem('cart_selected');
      localStorage.setItem('checkout_user_info', JSON.stringify(form));
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.location.href = '/orders';
      }, 1500);
    } catch (err: any) {
      alert('Có lỗi khi đặt hàng: ' + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.15)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '40px 48px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{fontSize: 60, color: '#22c55e', marginBottom: 8}}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div style={{fontSize: 22, fontWeight: 700, color: '#22c55e', textAlign: 'center'}}>Đã đặt hàng thành công</div>
          </div>
        </div>
      )}
      <main className="main-content">
        <div className="container py-4">
          <div className="row">
            {/* Cột trái: Thông tin nhận hàng */}
            <div className="col-md-7">
              <div className="alert alert-danger mb-4">
                Thêm <b>{(300000 - subtotal).toLocaleString('vi-VN')}₫</b> vào giỏ để được <b>miễn phí giao hàng!</b>
              </div>
              <h3 className="fw-bold mb-3">Thông tin nhận hàng</h3>
              <div className="row g-3">
                <div className="col-12">
                  <label>Họ và tên *</label>
                  <input className="form-control" value={form.fullName} onChange={e => setForm(f => ({...f, fullName: e.target.value}))} />
                </div>
                <div className="col-12">
                  <label>Địa chỉ *</label>
                  <input className="form-control" placeholder="Số nhà, tên đường" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
                  <input className="form-control mt-2" placeholder="Căn hộ, tầng, v.v. (không bắt buộc)" value={form.address2} onChange={e => setForm(f => ({...f, address2: e.target.value}))} />
                </div>
                <div className="col-md-6">
                  <label>Tỉnh/Thành phố *</label>
                  <input className="form-control" placeholder="Nhập tỉnh hoặc thành phố" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} />
                </div>
                <div className="col-md-3">
                  <label>Huyện/Quận *</label>
                  <input className="form-control" placeholder="Nhập huyện hoặc quận" value={form.state} onChange={e => setForm(f => ({...f, state: e.target.value}))} />
                </div>
                <div className="col-md-3">
                  <label>Xã/Thị trấn *</label>
                  <input className="form-control" placeholder="Nhập xã hoặc thị trấn" value={form.zip} onChange={e => setForm(f => ({...f, zip: e.target.value}))} />
                </div>
                <div className="col-md-6">
                  <label>Số điện thoại *</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
                </div>
                <div className="col-md-6">
                  <label>Email *</label>
                  <input className="form-control" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={form.createAccount} onChange={e => setForm(f => ({...f, createAccount: e.target.checked}))} />
                    <label className="form-check-label">Tạo tài khoản?</label>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" checked={form.shipToDifferent} onChange={e => setForm(f => ({...f, shipToDifferent: e.target.checked}))} />
                    <label className="form-check-label">Giao hàng tới địa chỉ khác?</label>
                  </div>
                </div>
                <div className="col-12">
                  <label>Ghi chú đơn hàng (không bắt buộc)</label>
                  <textarea className="form-control" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
                </div>
              </div>
            </div>

            {/* Cột phải: Đơn hàng */}
            <div className="col-md-5">
              <div className="bg-white p-3 rounded-3 mb-4" style={{border: '1.5px solid #f3f3f3'}}>
                <h5 className="fw-bold mb-3">Đơn hàng của bạn</h5>
                {/* Thông báo điều kiện voucher */}
                {selectedVoucher && subtotal < selectedVoucher.min_order_value && (
                  <div className="alert alert-warning mt-2">
                    Bạn không đủ điều kiện để dùng voucher này (Đơn tối thiểu: {selectedVoucher.min_order_value.toLocaleString('vi-VN')}₫)
                  </div>
                )}
                <table className="table mb-3">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-end">Tạm tính</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.id}>
                        <td>{item.name} ×{item.quantity}</td>
                        <td className="text-end">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</td>
                      </tr>
                    ))}
                    <tr>
                      <td><b>Tạm tính</b></td>
                      <td className="text-end">{subtotal.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td>Giảm giá voucher</td>
                      <td className="text-end">-{discount.toLocaleString('vi-VN')}₫</td>
                    </tr>
                    <tr>
                      <td>Phí vận chuyển</td>
                      <td className="text-end">{shipping === 0 ? 'Miễn phí' : shipping.toLocaleString('vi-VN') + '₫'}</td>
                    </tr>
                    <tr>
                      <td><b>Tổng cộng</b></td>
                      <td className="text-end"><b style={{color:'#7c3aed', fontSize:18}}>{total.toLocaleString('vi-VN')}₫</b></td>
                    </tr>
                  </tbody>
                </table>
                <div className="mb-3">
                  <label className="fw-bold mb-2">Mã giảm giá</label>
                  <div className="d-flex align-items-center mb-3">
                    <button type="button" className="btn btn-outline-primary me-2" onClick={() => router.push('/voucher')}>
                      Chọn mã giảm giá
                    </button>
                    <div>
                      {selectedProductVoucher && (
                        <div className="badge bg-success me-1">Sản phẩm: {selectedProductVoucher}</div>
                      )}
                      {selectedShippingVoucher && (
                        <div className="badge bg-info">Vận chuyển: {selectedShippingVoucher}</div>
                      )}
                      {!(selectedProductVoucher || selectedShippingVoucher) && (
                        <span className="text-muted">Chưa chọn mã giảm giá</span>
                      )}
                    </div>
                  </div>
                  <div className="form-check">
                    <input type="radio" className="form-check-input" checked={form.payment === 'bank'} onChange={() => setForm(f => ({...f, payment: 'bank'}))} />
                    <label className="form-check-label"><b>Chuyển khoản ngân hàng</b></label>
                    <div className="small text-muted ms-4">
                      Vui lòng chuyển khoản theo hướng dẫn. Đơn hàng sẽ được xử lý sau khi nhận được tiền.
                    </div>
                  </div>
                  <div className="form-check mt-2">
                    <input type="radio" className="form-check-input" checked={form.payment === 'cod'} onChange={() => setForm(f => ({...f, payment: 'cod'}))} />
                    <label className="form-check-label">Thanh toán khi nhận hàng</label>
                  </div>
                </div>
                <div className="form-check mb-3">
                  <input type="checkbox" className="form-check-input" checked={form.agree} onChange={e => setForm(f => ({...f, agree: e.target.checked}))} />
                  <label className="form-check-label">
                    Tôi đã đọc và đồng ý với <a href="#" target="_blank">điều khoản & chính sách</a>
                  </label>
                </div>
                {/* Thông báo lỗi nếu thiếu thông tin */}
                {errorFields.length > 0 && (
                  <div className="alert alert-danger">
                    Bạn chưa nhập: {errorFields.join(', ')}
                  </div>
                )}
                <button
                  className="btn btn-primary w-100 fw-bold"
                  style={{
                    background: form.agree ? '#7c3aed' : '#bdbdbd',
                    border: 0,
                    borderRadius: 8,
                    fontSize: 18,
                    opacity: form.agree ? 1 : 0.7,
                    cursor: form.agree ? 'pointer' : 'not-allowed'
                  }}
                  disabled={!form.agree}
                  onClick={handleOrder}
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutPage;
