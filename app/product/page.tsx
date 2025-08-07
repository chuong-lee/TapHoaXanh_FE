'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import SidebarFilter from '@/components/SidebarFilter'
import Pagination from '@/components/Pagination'

interface ProductData {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  brand?: string
  rating?: number
  category?: {
    id: number
    name: string
  }
  categoryId?: number
}

interface ApiProduct {
  id: number
  name: string
  price: number
  slug?: string
  images: string
  discount: number
  description: string
  brand?: string
  rating?: number
  category?: {
    id: number
    name: string
  }
  categoryId?: number
}

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState(1000000)
  const [sort, setSort] = useState('price-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [viewAll, setViewAll] = useState(false)
  const [totalProductsFromAPI, setTotalProductsFromAPI] = useState<number>(0) // Tổng số sản phẩm từ API

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Gọi API lấy tất cả sản phẩm, không phân trang phía FE
        const response = await fetch(`http://localhost:4000/products`)
        const data = await response.json()
        
        console.log('API Response:', data)
        
        let productsArray = []
        let total = 0
        
        // Xử lý response đơn giản
        if (Array.isArray(data)) {
          productsArray = data
          total = data.length
        } else if (data && data.data && Array.isArray(data.data)) {
          productsArray = data.data
          total = data.total || data.data.length
        } else if (data && data.products && Array.isArray(data.products)) {
          productsArray = data.products
          total = data.total || data.products.length
        }
        
        console.log('Products found:', productsArray.length, 'Total:', total)
        
        // Cập nhật tổng số sản phẩm từ API
        setTotalProductsFromAPI(total)
        
        if (productsArray.length > 0) {
          // Đảm bảo mỗi sản phẩm có slug
          const processedProducts = productsArray.map((product: ApiProduct) => ({
            ...product,
            slug: product.slug || generateSlug(product.name, product.id)
          }))
          
          setProducts(processedProducts)
          setFilteredProducts(processedProducts)
        }
        
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setFilteredProducts([])
        setTotalProductsFromAPI(0)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, []) // Chỉ load dữ liệu một lần khi component mount

  // Tạo slug từ tên sản phẩm nếu chưa có
  const generateSlug = (name: string, id: number) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${id}` // Thay thế trim('-')
  }

  // Xử lý lọc theo danh mục
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // Reset về trang đầu khi thay đổi filter
    setViewAll(false) // Tắt chế độ xem tất cả
    filterProducts(categoryId, maxPrice)
  }

  // Lọc sản phẩm
  const filterProducts = (categoryId: number | null, price: number) => {
    let filtered = products
    if (categoryId !== null) {
      filtered = filtered.filter(product => 
        product.category?.id === categoryId || product.categoryId === categoryId
      )
    }
    filtered = filtered.filter(product => product.price <= price)
    setFilteredProducts(filtered)
  }

  // Xử lý lọc theo giá
  const handlePriceChange = (price: number) => {
    setMaxPrice(price)
    setCurrentPage(1) // Reset về trang đầu khi thay đổi filter
    setViewAll(false) // Tắt chế độ xem tất cả
    filterProducts(selectedCategory, price)
  }

  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'name-asc') return a.name.localeCompare(b.name)
    if (sort === 'name-desc') return b.name.localeCompare(a.name)
    return 0
  })

  // Tính toán phân trang - sử dụng sortedProducts để đảm bảo nhất quán
  // Tính toán phân trang động, luôn cho phép sang trang tiếp nếu còn sản phẩm
  const totalItems = totalProductsFromAPI || sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedProducts.length);
  const currentProducts = viewAll ? sortedProducts : sortedProducts.slice(startIndex, endIndex);
  // Kiểm tra còn sản phẩm để bấm sang trang tiếp không
  const hasNextPage = safeCurrentPage < totalPages;
  
  // Logic để xác định có còn sản phẩm để load hay không
  const hasMoreProducts = totalProductsFromAPI > products.length || sortedProducts.length > currentPage * itemsPerPage
  const effectiveTotalItems = Math.max(sortedProducts.length, totalProductsFromAPI)

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setViewAll(false) // Tắt chế độ xem tất cả khi chuyển trang
    
    // Thêm một chút delay để tạo cảm giác loading mượt mà
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  // Xử lý xem tất cả
  const handleViewAll = () => {
    setLoading(true)
    setTimeout(() => {
      setViewAll(true)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
  }

  // Lấy tên danh mục
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null
    const product = products.find(p => 
      p.category?.id === selectedCategory || p.categoryId === selectedCategory
    )
    return product?.category?.name || 'Đang tải...'
  }

  return (
    <main className="main-content product-page-container">
      <div className="container py-4">
        <div className="row">
          {/* Sidebar filter */}
          <div className="col-md-3">
            <SidebarFilter onCategoryChange={handleCategoryChange} onPriceChange={handlePriceChange} />
          </div>
          
          {/* Product grid */}
          <div className="col-md-9">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-bold mb-0">
                {selectedCategory ? (
                  <>Danh mục: <span style={{color: '#22c55e'}}>{getSelectedCategoryName()}</span></>
                ) : (
                  <>Tất cả sản phẩm: <span style={{color: '#e11d48'}}>{sortedProducts.length}</span></>
                )}
              </h2>
              
              <div className="d-flex align-items-center" style={{gap: 16}}>
                <label className="ms-3 me-2">Sắp xếp:</label>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
                <input
                  type="text"
                  className="form-control ms-3"
                  style={{ width: 180 }}
                  placeholder="Tìm theo tên..."
                  onChange={e => {
                    const value = e.target.value.toLowerCase()
                    const filtered = products.filter(product =>
                      product.name.toLowerCase().includes(value)
                    )
                    setFilteredProducts(filtered.filter(p => p.price <= maxPrice && (selectedCategory === null || p.category?.id === selectedCategory || p.categoryId === selectedCategory)))
                    setCurrentPage(1) // Reset về trang đầu khi tìm kiếm
                    setViewAll(false) // Tắt chế độ xem tất cả
                  }}
                />
              </div>
            </div>

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-3 p-2 bg-light rounded">
                <small>
                  Debug: {products.length} sản phẩm tổng | {filteredProducts.length} đã lọc | {sortedProducts.length} đã sắp xếp |
                  API Total: {totalProductsFromAPI} |
                  Trang {currentPage}/{Math.ceil(totalProductsFromAPI / itemsPerPage)} | 
                  Hiển thị: {currentProducts.length}
                </small>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success"></div>
                <p className="mt-3">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <>
                {/* No products */}
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-5">
                    <h4 className="text-muted">Không có sản phẩm nào</h4>
                    <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>
                      Thử lại
                    </button>
                  </div>
                ) : (
                  /* Products grid */
                  <div className={`row g-4 ${loading ? 'loading-overlay' : ''}`}>
                    {currentProducts.map(product => {
                      // Convert ProductData to Product for ProductCard
                      const productForCard = {
                        ...product,
                        category: product.category?.name || undefined
                      }
                      return (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={product.id}>
                          <ProductCard 
                            product={productForCard}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {/* Pagination */}
                {!viewAll && totalProductsFromAPI > itemsPerPage && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalProductsFromAPI}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                      maxPagesToShow={Math.min(10, Math.ceil(totalProductsFromAPI / itemsPerPage))}  
                      showFirstLast={true}
                      showInfo={true}
                      loading={loading}
                      showViewAll={true}
                      onViewAll={handleViewAll}
                    />
                  </div>
                )}
                {/* Thông báo khi đã hết sản phẩm */}
                {!viewAll && !loading && currentProducts.length < itemsPerPage && currentPage > 1 && (
                  <div className="text-center mt-3 p-3 bg-light rounded">
                    <div className="text-muted">
                      <strong>🎉 Bạn đã xem hết tất cả sản phẩm!</strong>
                      <br />
                      <small>Đã hiển thị {sortedProducts.length} sản phẩm</small>
                    </div>
                  </div>
                )}

                {/* Hiển thị khi đang xem tất cả */}
                {viewAll && (
                  <div className="text-center mt-4">
                    <div className="view-all-alert">
                      <strong>✅ Đang hiển thị tất cả {sortedProducts.length} sản phẩm</strong>
                      <button 
                        className="back-to-pagination-btn"
                        onClick={() => {
                          setViewAll(false)
                          setCurrentPage(1)
                        }}
                      >
                        🔙 Quay lại phân trang
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

