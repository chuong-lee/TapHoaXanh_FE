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
};

export default function VoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/voucher')
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
        <div style={{textAlign: 'center', marginBottom: 32}}>
          <h2 style={{
            fontWeight: 700, // hoặc 600 cho vừa phải
            color: '#7c3aed',
            textTransform: 'none', // Đảm bảo không in hoa toàn bộ
            letterSpacing: 0,
            fontSize: 32,
            margin: 0
          }}>
            Chọn mã giảm giá
          </h2>
          <div style={{color: '#666', fontSize: 16, marginTop: 8}}>
            Chọn một mã voucher phù hợp để nhận ưu đãi cho đơn hàng của bạn
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            justifyContent: 'center',
            margin: '24px 0',
            gridAutoFlow: 'row dense',
          }}
        >
          {vouchers.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelected(v.id)}
              style={{
                cursor: 'pointer',
                padding: 20,
                borderRadius: 16,
                border: '2.5px solid ' + (selected === v.id ? '#7c3aed' : '#e0e0e0'),
                background: selected === v.id ? 'linear-gradient(90deg, #f3e8ff 0%, #fff 100%)' : '#fff',
                color: selected === v.id ? '#7c3aed' : '#222',
                minWidth: 260,
                maxWidth: 320,
                boxShadow: '0 2px 8px #f3f3f3',
                transition: 'background 0.2s, border-color 0.2s, color 0.2s',
                position: 'relative',
                marginBottom: 12,
                outline: 'none',
                justifySelf: 'center',
              }}
            >
              <div style={{fontWeight: 700, fontSize: 20, marginBottom: 8, letterSpacing: 1}}>{v.code}</div>
              <div style={{fontSize: 15, marginBottom: 4}}>Giảm tối đa: <b>{v.max_discount.toLocaleString()}₫</b></div>
              <div style={{fontSize: 15, marginBottom: 4}}>Đơn tối thiểu: <b>{v.min_order_value.toLocaleString()}₫</b></div>
              {v.description && <div style={{fontSize: 13, marginTop: 6, color: '#666'}}>{v.description}</div>}
              {selected === v.id && (
                <div style={{position: 'absolute', top: 12, right: 16, color: '#7c3aed', fontWeight: 700, fontSize: 16}}>
                  ✓ Đã chọn
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: 32}}>
          <button
            className="btn btn-primary"
            style={{
              background: selected !== null ? '#7c3aed' : '#bdbdbd',
              border: 0,
              borderRadius: 8,
              fontSize: 18,
              opacity: selected !== null ? 1 : 0.7,
              cursor: selected !== null ? 'pointer' : 'not-allowed',
              minWidth: 180,
              padding: '10px 0',
              fontWeight: 700,
              letterSpacing: 1
            }}
            disabled={selected === null}
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
        <style jsx global>{`
          @media (max-width: 900px) {
            .container > div[style*='display: grid'] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            .container > div[style*='display: grid'] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </main>
  )
}
