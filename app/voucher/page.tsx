'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';

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
  image?: string; // Thêm trường image
};

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:4000/voucher')
      .then(res => res.json())
      .then(data => setVouchers(data))
  }, [])

  const handleConfirm = () => {
    if (selected !== null) {
      const voucher = vouchers.find(v => v.id === selected);
      if (voucher) {
        localStorage.setItem('selectedVoucher', JSON.stringify(voucher));
        router.push('/checkout'); // Chuyển về trang thanh toán
      }
    }
  };

  return (
    <main className="main-content">
      <div className="container py-4" style={{maxWidth: 800, margin: '0 auto'}}>
        <h2 className="fw-bold mb-4 text-center" style={{fontSize: 32, color: '#7c3aed'}}>Danh sách Voucher</h2>
        <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="voucher-card d-flex align-items-center"
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 8px #f3f3f3',
                padding: 20,
                minHeight: 120,
                gap: 24
              }}
            >
              {/* Hình ảnh bên trái */}
              <div style={{flex: '0 0 80px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img
                  src={v.image || '/images/voucher-default.jpg'}
                  alt="Hình ảnh voucher"
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                    borderRadius: 12,
                    background: '#f3f3f3'
                  }}
                />
              </div>
              {/* Thông tin voucher */}
              <div style={{flex: 1}}>
                <div style={{fontWeight: 700, fontSize: 20, color: '#7c3aed'}}>{v.code}</div>
                <div style={{fontSize: 15, marginBottom: 4}}>Giảm tối đa: <b>{v.max_discount.toLocaleString()}₫</b></div>
                <div style={{fontSize: 15, marginBottom: 4}}>Đơn tối thiểu: <b>{v.min_order_value.toLocaleString()}₫</b></div>
                <div style={{fontSize: 15, marginBottom: 4}}>Số lượng còn: <b>{v.quantity}</b></div>
                <div style={{fontSize: 15, marginBottom: 4}}>Ngày bắt đầu: <b>{v.start_date}</b></div>
                <div style={{fontSize: 15, marginBottom: 4}}>Ngày kết thúc: <b>{v.end_date}</b></div>
                {v.description && <div style={{fontSize: 13, marginTop: 6, color: '#666'}}>Mô tả: {v.description}</div>}
              </div>
              {/* Nút chọn hoặc trạng thái */}
              <div>
                <button className="btn btn-success" style={{borderRadius: 8, fontWeight: 600}}>Dùng ngay</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
