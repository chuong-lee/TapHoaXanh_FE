'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import api from '@/lib/axios'
import SearchFilter from '@/components/Search'
import Pagination from '@/components/Pagination'

interface Product {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  category?: string
}

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/products')
        const data: unknown = res.data

        let productList: Product[] = []
        if (Array.isArray(data)) {
          productList = data as Product[]
        } else if (
          typeof data === 'object' &&
          data !== null &&
          Array.isArray((data as { products?: unknown }).products)
        ) {
          productList = (data as { products: Product[] }).products
        } else {
          console.error('❌ Dữ liệu sản phẩm không hợp lệ:', data)
        }

        setAllProducts(productList)
        setProducts(productList)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('🚫 Lỗi lấy danh sách sản phẩm:', err.message)
        } else {
          console.error('🚫 Lỗi không xác định:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilter = (filters: { search: string; category: string; maxPrice: string }) => {
    const { search, category, maxPrice } = filters

    const filtered = allProducts.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category ? product.category?.toLowerCase() === category : true
      const matchPrice = maxPrice ? product.price <= parseInt(maxPrice, 10) : true
      return matchSearch && matchCategory && matchPrice
    })

    setProducts(filtered)
    setCurrentPage(1)
  }

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  return (
    <div>
      <div className="container mt-4">
        <SearchFilter onFilter={handleFilter} />

        {loading ? (
          <p>Đang tải sản phẩm...</p>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="alert alert-warning mt-4 mb-4">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            ) : (
              <div className="row">
                {currentProducts.map((product) => (
                  <div className="col-md-3 mb-4" key={product.id}>
                    <div className="card h-100">
                      <Image
                        src={product.images.startsWith('http') ? product.images : `/images/products/${product.images}`}
                        className="card-img-top"
                        alt={product.name}
                        width={400}
                        height={300}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text">
                          <span className="text-danger">{product.price.toLocaleString()}₫</span>
                          {product.discount > 0 && (
                            <span className="ms-2 text-muted text-decoration-line-through">
                              {(product.price + product.discount).toLocaleString()}₫
                            </span>
                          )}
                        </p>
                        <Link href={`main/product/${product.slug}`} className="btn btn-primary">Xem chi tiết</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PHÂN TRANG - sử dụng props theo Pagination mới */}
            {products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={products.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                maxPagesToShow={5} // Có thể bỏ dòng này nếu không cần
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
