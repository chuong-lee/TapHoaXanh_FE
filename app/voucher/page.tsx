'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Voucher = {
  id: number;
  code: string;
  max_discount: number;
  min_order_value: number;
  quantity: number;
  is_used: number;
  start_date: string;
  end_date: string;
  description?: string;
  type: 'product' | 'shipping'; // Bạn nên thêm trường này ở backend hoặc phân loại ở FE
};

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedShipping, setSelectedShipping] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/voucher') // Đổi thành endpoint thực tế của bạn
      .then(res => res.json())
      .then(data => setVouchers(data))
  }, [])

  console.log('Vouchers:', vouchers);

  const productVouchers = vouchers.filter(v => v.code.toLowerCase().includes('ship') === false);
  const shippingVouchers = vouchers.filter(v => v.code.toLowerCase().includes('ship'));

  const handleConfirm = () => {
    localStorage.setItem('selectedProductVoucher', selectedProduct)
    localStorage.setItem('selectedShippingVoucher', selectedShipping)
    router.push('/checkout')
  }

  return (
    <div className="container py-4">
      <h2>Chọn voucher</h2>
      <h4>Voucher giảm giá sản phẩm</h4>
      {productVouchers.map(v => (
        <div key={v.code}>
          <input
            type="radio"
            name="productVoucher"
            value={v.code}
            checked={selectedProduct === v.code}
            onChange={() => setSelectedProduct(v.code)}
          />
          {v.code} - {v.max_discount}đ ({v.description})
        </div>
      ))}
      <h4>Voucher giảm phí ship</h4>
      {shippingVouchers.map(v => (
        <div key={v.code}>
          <input
            type="radio"
            name="shippingVoucher"
            value={v.code}
            checked={selectedShipping === v.code}
            onChange={() => setSelectedShipping(v.code)}
          />
          {v.code} - {v.max_discount}đ ({v.description})
        </div>
      ))}
      <button
        className="btn btn-primary w-100 fw-bold"
        style={{background:'#7c3aed', border:0, borderRadius:8, fontSize:18}}
        disabled={!form.agree}
      >
        Đặt hàng
      </button>
      <div>
        <h4>Tất cả voucher (debug)</h4>
        {vouchers.map(v => (
          <div key={v.code}>
            {v.code} - {v.max_discount}đ ({v.description})
          </div>
        ))}
      </div>
    </div>
  )
}
