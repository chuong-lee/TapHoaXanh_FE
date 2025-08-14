// components/CategoryFilter.tsx
'use client'
import { useState, useRef } from 'react'

interface FilterProps {
  onFilter: (filters: { name: string; min: string; max: string; sort: string }) => void
}

export default function CategoryFilter({ onFilter }: FilterProps) {
  const nameRef = useRef('')
  const minRef = useRef('')
  const maxRef = useRef('')
  const sortRef = useRef('newest')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter({ 
      name: nameRef.current, 
      min: minRef.current, 
      max: maxRef.current, 
      sort: sortRef.current 
    })
  }

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="row g-2">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Tên sản phẩm"
            defaultValue={nameRef.current} onChange={e => nameRef.current = e.target.value} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Giá từ"
            defaultValue={minRef.current} onChange={e => minRef.current = e.target.value} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Giá đến"
            defaultValue={maxRef.current} onChange={e => maxRef.current = e.target.value} />
        </div>
        <div className="col-md-2">
          <select className="form-select" defaultValue={sortRef.current} onChange={e => sortRef.current = e.target.value}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">Lọc</button>
        </div>
      </div>
    </form>
  )
}
