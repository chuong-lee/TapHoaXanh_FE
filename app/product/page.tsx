'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Pagination from '@/components/Pagination'
import { useCart } from '@/hooks/useCart'

interface ProductData {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  brand?: {
    id: number
    name: string
  }
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
  brand?: {
    id: number
    name: string
  }
  rating?: number
  category?: {
    id: number
    name: string
  }
  categoryId?: number
}

interface Category {
  id: number
  name: string
  count?: number
}

export default function ProductListPage() {
  const router = useRouter()
  const [product, setproduct] = useState<ProductData[]>([])
  const [filteredproduct, setFilteredproduct] = useState<ProductData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER)
  const [sort, setSort] = useState('price-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [viewAll, setViewAll] = useState(false)
  const [totalproductFromAPI, setTotalproductFromAPI] = useState<number>(0) // Tổng số sản phẩm từ API
  const [addingToCart, setAddingToCart] = useState<number | null>(null) // Track which product is being added
  
  // Cart functionality
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/products?limit=100`),
          fetch(`/api/category?withCount=true`)
        ])
        
        const productsData = await productsResponse.json()
        const categoriesData = await categoriesResponse.json()
        
        // Process products
        let productArray: ApiProduct[] = []
        let total = 0
        if (Array.isArray(productsData)) {
          productArray = productsData
          total = productsData.length
        } else if (productsData && productsData.data && Array.isArray(productsData.data)) {
          productArray = productsData.data
          total = productsData.total || productsData.data.length
        }
        
        // Process categories
        let categoryArray: Category[] = []
        if (Array.isArray(categoriesData)) {
          categoryArray = categoriesData
        } else if (categoriesData && categoriesData.data && Array.isArray(categoriesData.data)) {
          categoryArray = categoriesData.data
        }
        
        // Set categories
        setCategories(categoryArray)
        
        // Set products
        if (!Array.isArray(productArray)) productArray = []
        setTotalproductFromAPI(total)
        if (productArray.length > 0) {
          const processedproduct: ProductData[] = productArray.map((product: ApiProduct) => ({
            ...product,
            slug: product.slug || generateSlug(product.name, product.id)
          }))
          setproduct(processedproduct)
          setFilteredproduct(processedproduct)
        } else {
          setproduct([])
          setFilteredproduct([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setproduct([])
        setFilteredproduct([])
        setCategories([])
        setTotalproductFromAPI(0)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Re-filter when products change
  useEffect(() => {
    if (product.length > 0) {
      filterproduct(selectedCategory, maxPrice)
    }
  }, [product, selectedCategory, maxPrice])

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
    filterproduct(categoryId, maxPrice)
  }

  // Lọc sản phẩm
  const filterproduct = (categoryId: number | null, price: number) => {
    let filtered = [...product]
    
    // Filter by category
    if (categoryId !== null) {
      filtered = filtered.filter(prod => 
        prod.category?.id === categoryId || prod.categoryId === categoryId
      )
    }
    
    // Filter by price
    filtered = filtered.filter(product => product.price <= price)
    
    setFilteredproduct(filtered)
  }

  // Xử lý lọc theo giá
  const handlePriceChange = (price: number) => {
    setMaxPrice(price)
    setCurrentPage(1)
    setViewAll(false)
    filterproduct(selectedCategory, price)
  }

  // Sắp xếp sản phẩm
  const sortedproduct = [...filteredproduct].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'name-asc') return a.name.localeCompare(b.name)
    if (sort === 'name-desc') return b.name.localeCompare(a.name)
    return 0
  })

  // Tính toán phân trang - sử dụng sortedproduct để đảm bảo nhất quán
  // Tính toán phân trang động, luôn cho phép sang trang tiếp nếu còn sản phẩm
  const totalItems = totalproductFromAPI || sortedproduct.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(1, totalPages));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedproduct.length);
  const currentproduct = viewAll ? sortedproduct : sortedproduct.slice(startIndex, endIndex);
  // Kiểm tra còn sản phẩm để bấm sang trang tiếp không
  // ...existing code...

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

  // Xử lý navigation tới product detail
  const handleProductClick = (product: ProductData) => {
    const productSlug = product.slug || generateSlug(product.name, product.id)
    router.push(`/product/${productSlug}`)
  }

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (product: ProductData) => {
    try {
      setAddingToCart(product.id)
      
      // Convert product data to cart item format
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        images: product.images,
        discount: product.discount,
        description: product.description || '',
        variant_id: undefined, // No variants for listing page
        stock: 100 // Default stock
      }
      
      addToCart(cartItem, 1)
      
      // Show success feedback
      setTimeout(() => {
        setAddingToCart(null)
      }, 1000)
      
    } catch (error) {
      console.error('Lỗi thêm vào giỏ hàng:', error)
      setAddingToCart(null)
    }
  }



  return (
    <div className="product">
      <div className="container my-3">
        <div className="row">
          <div className="col-12"> 
            <div className="content-header">
              <h2 className="title">
                Chúng tôi tìm thấy <span className="count">{sortedproduct.length}</span> sản phẩm cho bạn!
                {selectedCategory && (
                  <div style={{fontSize: '14px', color: '#666', fontWeight: 'normal'}}>
                    Danh mục: <span style={{color: '#22c55e'}}>{categories.find(c => c.id === selectedCategory)?.name}</span>
                  </div>
                )}
                {maxPrice !== Number.MAX_SAFE_INTEGER && (
                  <div style={{fontSize: '14px', color: '#666', fontWeight: 'normal'}}>
                    Giá tối đa: <span style={{color: '#e11d48'}}>{maxPrice.toLocaleString()}đ</span>
          </div>
                )}
              </h2>
              <div className="content-controls">
                <div className="control">
                  <label htmlFor="show">Hiển thị:</label>
                  <select 
                    id="show" 
                    value={itemsPerPage} 
                    onChange={() => {
                      // Có thể thêm logic thay đổi itemsPerPage nếu cần
                    }}
                  >
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
          </div>
                <div className="control">
                  <label htmlFor="sort">Sắp xếp theo:</label>
                  <select 
                    id="sort" 
                    value={sort} 
                    onChange={e => setSort(e.target.value)}
                  >
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <div className="sidebar">
              <div className="filter-group">
                <h3 className="filter-title">Danh mục</h3>
                <ul className="filter-list">
                  <li 
                    className={selectedCategory === null ? 'active' : ''} 
                    onClick={() => handleCategoryChange(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="icon"></span>Tất cả sản phẩm<span className="count">({product.length})</span>
                  </li>
                  {categories.map(category => (
                    <li 
                      key={category.id}
                      className={selectedCategory === category.id ? 'active' : ''}
                      onClick={() => handleCategoryChange(category.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className="icon"></span>{category.name}<span className="count">({category.count || 0})</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="filter-group">
                <h3 className="filter-title">Giá</h3>
                <div className="price-slider">
                  <div className="price-current mb-2 text-center">
                    <strong style={{color: '#22c55e', fontSize: '16px'}}>
                      Tối đa: {maxPrice === Number.MAX_SAFE_INTEGER ? '2.000.000' : maxPrice.toLocaleString()}đ
                    </strong>
                  </div>
                <input
                    type="range" 
                    min="10000" 
                    max="200000" 
                    step="5000"
                    value={maxPrice === Number.MAX_SAFE_INTEGER ? 200000 : Math.min(maxPrice, 200000)}
                    onChange={e => handlePriceChange(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      appearance: 'none',
                      height: '6px',
                      borderRadius: '3px',
                      background: '#ddd',
                      outline: 'none'
                    }}
                  />
                  <div className="price-range d-flex justify-content-between mt-2">
                    <span style={{fontSize: '12px', color: '#666'}}>10.000đ</span>
                    <span style={{fontSize: '12px', color: '#666'}}>200.000đ</span>
                  </div>
                  <div className="price-presets mt-2">
                    <div className="d-flex flex-wrap gap-1">
                      {[20000, 50000, 80000, 100000, 150000].map(price => (
                        <button
                          key={price}
                          className={`btn btn-sm ${maxPrice === price ? 'btn-success' : 'btn-outline-secondary'}`}
                          style={{fontSize: '11px', padding: '2px 6px'}}
                          onClick={() => handlePriceChange(price)}
                        >
                          {price/1000}k
                        </button>
                      ))}
                      <button
                        className={`btn btn-sm ${maxPrice === Number.MAX_SAFE_INTEGER ? 'btn-success' : 'btn-outline-secondary'}`}
                        style={{fontSize: '11px', padding: '2px 6px'}}
                        onClick={() => handlePriceChange(Number.MAX_SAFE_INTEGER)}
                      >
                        Tất cả
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-group">
                <h3 className="filter-title">Đánh giá</h3>
                <ul className="review-list">
                  <li>
                    <div className="stars">
                      <i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-full"></i>
                    </div>5 Sao
                  </li>
                  <li>
                    <div className="stars">
                      <i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-empty"></i>
                    </div>4 Sao
                  </li>
                  <li>
                    <div className="stars">
                      <i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-full"></i><i className="icon-star-empty"></i><i className="icon-star-empty"></i>
                    </div>3 Sao
                  </li>
                </ul>
              </div>
              <div className="sidebar-banner">
                <img src="/client/images/banner.png" alt="Product"/>
              </div>
            </div>
              </div>
          <div className="col-lg-9">
            <div className="content">
            {/* Loading */}
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success"></div>
                <p className="mt-3">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <>
                {/* No product */}
                {sortedproduct.length === 0 ? (
                  <div className="text-center py-5">
                    <h4 className="text-muted">Không có sản phẩm nào</h4>
                    <button className="btn btn-primary mt-2" onClick={() => window.location.reload()}>
                      Thử lại
                    </button>
                  </div>
                ) : (
                  <div className="product-grid">
                    {currentproduct.map(product => {
                        const productSlug = product.slug || `product-${product.id}`
                      return (
                          <div 
                            className="product-card" 
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-4px)'
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                            style={{ 
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                          >
                            <div className="product-img">
                              <img 
                                src={product.images?.startsWith('client/') ? `/${product.images}` : (product.images || '/client/images/product.png')} 
                                alt={product.name}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/client/images/product.png'
                                }}
                          />
                        </div>
                            <div className="product-info">
                              <div className="product-category">{product.category?.name || 'Sản phẩm'}</div>
                              <div className="product-title">{product.name}</div>
                              <div className="product-brand">bởi <span className="brand">{product.brand?.name || 'Tạp Hoá Xanh'}</span></div>
                              <div className="product-price">
                                <span className="price-new">{product.price.toLocaleString()}đ</span>
                                {product.discount > 0 && (
                                  <span className="price-old">
                                    {Math.round(product.price * (1 + product.discount / 100)).toLocaleString()}đ
                                  </span>
                                )}
                              </div>
                              <div className="product-rating">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <i 
                                    key={star}
                                    className={star <= (product.rating || 4) ? 'icon-star-full' : 'icon-star-empty'}
                                  ></i>
                                ))}
                                <span className="rating">{(product.rating || 4).toFixed(1)}</span>
                              </div>
                            </div>
                            <button 
                              className={`btn-add ${addingToCart === product.id ? 'adding' : ''}`}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                              disabled={addingToCart === product.id}
                              style={{
                                backgroundColor: addingToCart === product.id ? '#22c55e' : '',
                                opacity: addingToCart === product.id ? 0.8 : 1,
                                cursor: addingToCart === product.id ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {addingToCart === product.id ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Đang thêm...
                                </>
                              ) : (
                                'Thêm vào giỏ'
                              )}
                            </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                
                {/* Pagination */}
                {!viewAll && totalproductFromAPI > itemsPerPage && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalItems={totalproductFromAPI}
                      itemsPerPage={itemsPerPage}
                      onPageChange={handlePageChange}
                      maxPagesToShow={Math.min(10, Math.ceil(totalproductFromAPI / itemsPerPage))}  
                      showFirstLast={true}
                      showInfo={true}
                      loading={loading}
                      showViewAll={true}
                      onViewAll={handleViewAll}
                    />
                  </div>
                )}
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}