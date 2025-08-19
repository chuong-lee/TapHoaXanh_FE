'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'

interface ProductData {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  quantity: number
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



// Helper function để format giá VND
function formatPriceVND(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Component Rating Stars
const RatingStars = ({ rating = 4.5 }: { rating?: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="product-rating d-flex align-items-center">
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star active" style={{ color: '#FFD700' }}></i>
        ))}
        {hasHalfStar && (
          <i className="fas fa-star-half-alt active" style={{ color: '#FFD700' }}></i>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={i} className="fas fa-star" style={{ color: '#ddd' }}></i>
        ))}
      </div>
      <span className="rating-text ms-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default function ProductListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductData[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState(79)
  const [sort, setSort] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null)
  const [addToCartMessage, setAddToCartMessage] = useState('')
  
  // Cart functionality
  const { addToCart } = useCart()

  // Thêm state để theo dõi số lượng sản phẩm theo từng category
  const [categoryCounts, setCategoryCounts] = useState<{[key: number]: number}>({})

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
        let productArray: ProductData[] = []
        if (Array.isArray(productsData)) {
          productArray = productsData
        } else if (productsData && productsData.data && Array.isArray(productsData.data)) {
          productArray = productsData.data
        }
        
        // Process categories
        let categoryArray: Category[] = []
        if (Array.isArray(categoriesData)) {
          categoryArray = categoriesData
        } else if (categoriesData && categoriesData.data && Array.isArray(categoriesData.data)) {
          categoryArray = categoriesData.data
        }
        
        setCategories(categoryArray)
        setProducts(productArray)
        
        // Tính toán số lượng sản phẩm theo từng category
        const counts: {[key: number]: number} = {}
        categoryArray.forEach(category => {
          counts[category.id] = productArray.filter(product => 
            product.category?.id === category.id || product.categoryId === category.id
          ).length
        })
        setCategoryCounts(counts)
      } catch (error) {
        console.error('Error fetching data:', error)
        setProducts([])
        setCategories([])
        setCategoryCounts({})
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Cập nhật hàm lọc sản phẩm
  const filterProductsByCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // Reset về trang đầu khi thay đổi filter
  }

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product: ProductData) => {
    const finalPrice = product.price - product.discount;
    addToCart({
      ...product,
      price: finalPrice,
      stock: product.quantity || 0,
      images: Array.isArray(product.images) ? product.images.join(',') : product.images,
    }, 1);
    
    setAddToCartMessage('✅ Đã thêm vào giỏ hàng thành công!');
    setTimeout(() => {
      setAddToCartMessage('');
    }, 3000);
  };

  // Xử lý wishlist toggle
  const handleToggleWishlist = async (productId: number) => {
    setWishlistLoading(productId);
    
    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        setWishlist(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(null);
    }
  };

  // Xử lý xem chi tiết sản phẩm
  const handleViewDetail = (product: ProductData) => {
    router.push(`/product/${product.slug}`);
  };

  // Lọc và sắp xếp sản phẩm
  let filteredProducts = [...products];
  
  // Lọc theo category
  if (selectedCategory !== null) {
    filteredProducts = filteredProducts.filter(product => 
      product.category?.id === selectedCategory || product.categoryId === selectedCategory
    );
  }
  
  // Lọc theo giá
  filteredProducts = filteredProducts.filter(product => product.price <= maxPrice * 1000);
  
  // Sắp xếp
  filteredProducts.sort((a, b) => {
    switch (sort) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'name-a-z':
        return a.name.localeCompare(b.name);
      case 'name-z-a':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <>
      {/* Hiển thị thông báo thêm vào giỏ hàng */}
      {addToCartMessage && (
        <div className="alert alert-success alert-dismissible fade show position-fixed" 
             style={{top: '20px', right: '20px', zIndex: 9999}}>
          {addToCartMessage}
          <button type="button" className="btn-close" onClick={() => setAddToCartMessage('')}></button>
                  </div>
                )}

      <section>
        <div className="product-page">
          {/* Breadcrumb Section */}
          <div className="breadcrumb-section">
            <div className="container">
              <h3 className="text-center">Cửa Hàng</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link href="/">Trang Chủ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Cửa Hàng</li>
                </ol>
              </nav>
            </div>
          </div>
          
          <div className="container my-4">
        <div className="row">
              {/* Left Sidebar */}
              <div className="col-lg-3 d-none d-lg-block">
            <div className="sidebar">
                  {/* Categories Filter */}
                  <div className="filter-group mb-4">
                    <h3 className="filter-title text-success">Danh Mục</h3>
                    <ul className="filter-list list-unstyled">
                      {/* Tất cả sản phẩm */}
                      <li className="mb-2">
                        <Link 
                          className={`text-decoration-none d-flex justify-content-between align-items-center ${selectedCategory === null ? 'text-success fw-bold' : 'text-dark'}`}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            filterProductsByCategory(null)
                          }}
                        >
                          <span>Tất cả sản phẩm</span>
                          <span className="badge bg-secondary">{products.length}</span>
                        </Link>
                  </li>
                      
                      {/* Danh sách categories */}
                  {categories.map(category => (
                        <li key={category.id} className="mb-2">
                          <Link 
                            className={`text-decoration-none d-flex justify-content-between align-items-center ${selectedCategory === category.id ? 'text-success fw-bold' : 'text-dark'}`}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              filterProductsByCategory(category.id)
                            }}
                          >
                            <span>{category.name}</span>
                            <span className="badge bg-secondary">
                              {categoryCounts[category.id] || 0}
                            </span>
                          </Link>
                    </li>
                  ))}
                </ul>
              </div>
                  
                  {/* Price Filter */}
                  <div className="filter-group mb-4">
                    <h3 className="filter-title text-success">Giá</h3>
                    <div className="price-range mb-2">
                      <span>Khoảng giá: {formatPriceVND(maxPrice * 350)} - {formatPriceVND(maxPrice * 1000)}</span>
                    </div>
                <div className="price-slider">
                <input
                        className="form-range price-min" 
                    type="range" 
                        min="28" 
                        max="79" 
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(parseInt(e.target.value))
                          setCurrentPage(1)
                        }}
                      />
                  </div>
                    {/* Price presets */}
                  <div className="price-presets mt-2">
                    <div className="d-flex flex-wrap gap-1">
                        {[28, 35, 50, 65, 79].map(price => (
                        <button
                          key={price}
                          className={`btn btn-sm ${maxPrice === price ? 'btn-success' : 'btn-outline-secondary'}`}
                          style={{fontSize: '11px', padding: '2px 6px'}}
                            onClick={() => {
                              setMaxPrice(price)
                              setCurrentPage(1)
                            }}
                        >
                            {formatPriceVND(price * 1000)}
                        </button>
                      ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Best Sellers Section */}
                  <div className="filter-group mb-4">
                    <h3 className="filter-title text-success">Sản Phẩm Bán Chạy</h3>
                    <div className="best-sellers">
                      {products.slice(0, 3).map((product, index) => (
                        <div key={product.id} className="best-seller-item d-flex align-items-center mb-3">
                          <Image 
                            className="me-3" 
                            src={product.images || '/client/images/product.png'} 
                            alt={product.name} 
                            width={60} 
                            height={60}
                            style={{objectFit: 'cover'}}
                          />
                          <div className="best-seller-info">
                            <div className="category text-muted small">{product.category?.name || 'Trái Cây Tươi'}</div>
                            <div className="title fw-bold">{product.name}</div>
                            <div className="price">{formatPriceVND(product.price)}</div>
                </div>
              </div>
                      ))}
                    </div>
              </div>
                  
                  {/* Sidebar Banner */}
              <div className="sidebar-banner">
                    <Image 
                      className="img-fluid" 
                      src="/client/images/banner-1.png" 
                      alt="Banner Cửa Hàng"
                      width={300}
                      height={200}
                    />
              </div>
            </div>
              </div>
              
              {/* Main Content Area */}
          <div className="col-lg-9">
            <div className="content">
                  {/* Header Controls */}
                  <div className="content-header d-flex justify-content-between align-items-center mb-4">
                    <div className="results-info">
                      <span>
                        Hiển thị {currentProducts.length} kết quả
                        {selectedCategory && (
                          <span className="text-muted ms-2">
                            trong <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
                          </span>
                        )}
                      </span>
                      <div className="view-toggles ms-3 d-inline-block">
                        <i className="fas fa-th-large text-success me-2"></i>
                        <i className="fas fa-th-large text-success me-2"></i>
                        <i className="fas fa-th-large text-muted"></i>
                      </div>
                    </div>
                    <div className="sorting-controls">
                      <select 
                        className="form-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="default">Sắp xếp: Mặc định</option>
                        <option value="price-low-high">Giá: Thấp đến Cao</option>
                        <option value="price-high-low">Giá: Cao đến Thấp</option>
                        <option value="name-a-z">Tên: A đến Z</option>
                        <option value="name-z-a">Tên: Z đến A</option>
                      </select>
              </div>
                  </div>
                  
                  {/* Product Grid */}
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-3 g-3 g-lg-4 mt-2">
                      {loading ? (
                        <div className="col-12 text-center py-4">
                          <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                          </div>
                        </div>
                      ) : currentProducts.length === 0 ? (
                        <div className="col-12 text-center py-4">
                          <h4 className="text-muted">Không có sản phẩm nào</h4>
                        </div>
                      ) : (
                        currentProducts.map((product, index) => (
                          <div className="col" key={product.id}>
                            <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                              <div className="product-card">
                                <div className="product-image-wrapper">
                                  <Image 
                                    className="product-image" 
                                    src={product.images || '/client/images/product.png'} 
                                    alt={product.name} 
                                    title={product.name}
                                    width={300}
                                    height={300}
                                  />
                                  <div className="product-badge">
                                    <div className="badge">Mới</div>
                                  </div>
                                </div>
                                <div className="product-content">
                                  <div className="product-category">
                                    {product.category?.name?.toUpperCase() || 'SẢN PHẨM'}
                                  </div>
                              <div className="product-title">{product.name}</div>
                              <div className="product-price">
                                    <div className="current-price">
                                      {formatPriceVND(product.price - product.discount)}
                                    </div>
                                {product.discount > 0 && (
                                      <div className="old-price">
                                        {formatPriceVND(product.price)}
                                      </div>
                                )}
                              </div>
                                  <div className="product-description">
                                    <p>{product.description || 'Sản phẩm chất lượng cao, đảm bảo an toàn thực phẩm.'}</p>
                              </div>
                                  <div className="product-actions">
                                    <button 
                                      className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleToggleWishlist(product.id)
                                      }}
                                      disabled={wishlistLoading === product.id}
                                      title={wishlist.includes(product.id) ? 'Bỏ thích' : 'Thích'}
                                    >
                                      {wishlistLoading === product.id ? (
                                        <i className="fas fa-spinner fa-spin"></i>
                                      ) : (
                                        <i className={`fas fa-heart ${wishlist.includes(product.id) ? 'text-danger' : ''}`}></i>
                                      )}
                                    </button>
                            <button 
                                      className="add-to-cart-btn" 
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                                    >
                                      Thêm vào giỏ
                                    </button>
                                    <button 
                                      className="quick-view-btn" 
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleViewDetail(product)
                                      }}
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                            </button>
                        </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-wrapper d-flex justify-content-center mt-5">
                      <nav>
                        <ul className="pagination">
                          {currentPage > 1 && (
                            <li className="page-item">
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(currentPage - 1)}
                              >
                                <i className="fas fa-chevron-left"></i>
                              </button>
                            </li>
                          )}
                          
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                <button 
                                  className="page-link" 
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              </li>
                            );
                          })}
                          
                          {currentPage < totalPages && (
                            <li className="page-item">
                              <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(currentPage + 1)}
                              >
                                <i className="fas fa-chevron-right"></i>
                              </button>
                            </li>
                          )}
                        </ul>
                      </nav>
                  </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
      </section>
    </>
  )
}