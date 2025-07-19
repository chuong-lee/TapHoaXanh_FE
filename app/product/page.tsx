'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import api from '@/lib/axios'
import SidebarFilter from '@/components/SidebarFilter'
import Pagination from '@/components/Pagination'

type Product = {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  brand?: string
  rating?: number
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // State cho show và sort
  const [show, setShow] = useState(50)
  const [sort, setSort] = useState('price-asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products')
        setProducts(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Hàm sắp xếp sản phẩm (ví dụ đơn giản)
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    return 0
  })

  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar filter */}
        <div className="col-md-3">
          <SidebarFilter />
        </div>
        {/* Product grid */}
        <div className="col-md-9">
          {/* Thanh Show/Sắp xếp */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold mb-0" style={{fontSize: '2rem'}}>
              Tìm thấy <span style={{color: '#e11d48'}}>{products.length}</span> sản phẩm!
            </h2>
            <div className="d-flex align-items-center" style={{gap: 16}}>
              <label className="me-2" htmlFor="showSelect">Hiển thị:</label>
              <select
                id="showSelect"
                value={show}
                onChange={e => setShow(Number(e.target.value))}
                style={{borderRadius: 6, padding: '2px 8px'}}
              >
                {[12, 24, 36, 50, 100].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <label className="ms-3 me-2" htmlFor="sortSelect">Sắp xếp theo:</label>
              <select
                id="sortSelect"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{borderRadius: 6, padding: '2px 8px'}}
              >
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="name-asc">Tên: A-Z</option>
                <option value="name-desc">Tên: Z-A</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <div className="row g-4">
              {sortedProducts.slice(0, show).map(product => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
