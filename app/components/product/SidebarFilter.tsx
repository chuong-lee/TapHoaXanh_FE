'use client'
import { , useState } from 'react'
import api from '@/lib/axios'

type Category = {
  id: number
  name: string
  count: number
}

interface SidebarFilterProps {
  onCategoryChange?: (categoryId: number | null) => void
  onPriceChange?: (price: number) => void
}

export default function SidebarFilter({ onCategoryChange, onPriceChange }: SidebarFilterProps) {
  const [categories, setCategories] = useState<[]>([])
  const [, ] = useState<number | null>(null)
  const [price, setPrice] = useState(1000000)

  (() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryChange = (categoryId: number | null) => {
    (categoryId)
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setPrice(value)
    if (onPriceChange) onPriceChange(value)
  }

  return (
    <div className="sidebar-filter p-3 border rounded bg-white">
      <h5 className="fw-bold mb-3" style={{color: '#22c55e'}}>Danh mục</h5>
      <div>
        {/* Tất cả sản phẩm */}
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="category"
            id="cat-all"
            checked={ === null}
            onChange={() => handleCategoryChange(null)}
            style={{accentColor: '#22c55e'}}
          />
          <label className="form-check-label" htmlFor="cat-all" style={{cursor: 'pointer'}}>
            <strong>Tất cả sản phẩm</strong>
          </label>
        </div>
        {categories.map(cat => (
          <div key={cat.id} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="category"
              id={`cat-${cat.id}`}
              checked={ === cat.id}
              onChange={() => handleCategoryChange(cat.id)}
              style={{accentColor: '#22c55e'}}
            />
            <label className="form-check-label" htmlFor={`cat-${cat.id}`} style={{cursor: 'pointer'}}>
              {cat.name} <span className="text-muted">({cat.count || 0})</span>
            </label>
          </div>
        ))}
      </div>
      {/* Phần lọc giá */}
      <div className="mt-4">
        <h6 className="fw-bold mb-3" style={{color: '#22c55e'}}>Lọc theo giá</h6>
        <div className="mb-3">
          <label className="form-label small">Khoảng giá:</label>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <input
              type="range"
              className="form-range custom-range"
              min="0"
              max="1000000"
              step="10000"
              value={price}
              onChange={handlePriceChange}
              style={{accentColor: '#22c55e', width: '80%'}}
            />
            <span style={{fontWeight: 600, color: '#22c55e', minWidth: 90, textAlign: 'right'}}>
              {price.toLocaleString()}đ
            </span>
          </div>
          <div className="d-flex justify-content-between small text-muted mt-1">
            <span>0đ</span>
            <span>1,000,000đ</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-range::-webkit-slider-thumb {
          background: #22c55e;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(34,197,94,0.2);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: box-shadow 0.2s;
        }
        .custom-range:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(34,197,94,0.15);
        }
        .custom-range::-moz-range-thumb {
          background: #22c55e;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(34,197,94,0.2);
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .custom-range::-ms-thumb {
          background: #22c55e;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(34,197,94,0.2);
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .custom-range {
          height: 6px;
          background: #e0fbe2;
        }
      `}</style>
    </div>
  )
}
