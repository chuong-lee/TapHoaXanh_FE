'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Marquee from './components/Marquee'
import { ProductListSkeleton, LoadingSpinner } from '@/components/LoadingSkeleton'
import { withErrorBoundary } from '@/components/ErrorBoundary'
import { useProducts } from '@/hooks/useProducts'
import { Product, Category, productService } from '@/lib/productService'
import { CategoryList } from '@/components/CategoryList'

function fixImgSrc(img: string) {
  if (!img) return '/images/placeholder.png'
  if (img.startsWith('http')) return img
  if (img.startsWith('/')) return img
  if (img.startsWith('client/images/')) return '/' + img
  return '/images/products/' + img
}

// Thêm hàm để lấy ảnh danh mục
function getCategoryImage(category: Category, index: number) {
  // Ưu tiên 1: Ảnh từ API (nếu có)
  if (category.image) {
    return fixImgSrc(category.image)
  }
  
  // Ưu tiên 2: Icon từ API (nếu có)
  if (category.icon) {
    return fixImgSrc(category.icon)
  }
  
  // Ưu tiên 3: Ảnh theo slug của danh mục
  if (category.slug) {
    return `./client/images/categories/${category.slug}.png`
  }
  
  // Ưu tiên 4: Ảnh theo index/thứ tự
  return `./client/images/categories/category-${index + 1}.png`
}

// Mapping danh mục với ảnh cố định (fallback)
const categoryImageMap: {[key: string]: string} = {
  'do-uong': 'drinks.png',
  'nong-san-thuc-pham': 'vegetables.png',
  'thuy-hai-san': 'seafood.png',
  'chan-nuoi': 'meat.png',
  'thuc-pham-che-bien': 'processed.png',
  'gia-vi-nguyen-lieu': 'spices.png',
  'an-vat-banh-keo': 'snacks.png',
  'thuc-uong-thuc-pham': 'beverages.png',
  'dac-san-truyen-thong': 'specialty.png'
}

function getCategoryImageBySlug(slug: string, index: number) {
  // Ưu tiên 1: Mapping theo slug
  if (categoryImageMap[slug]) {
    return `./client/images/categories/${categoryImageMap[slug]}`
  }
  
  // Ưu tiên 2: Theo slug trực tiếp
  return `./client/images/categories/${slug}.png`
}

export default function HomePage() {
  const router = useRouter()

  const {
    currentProducts,
    categories,
    featuredProducts,
    bestSellingProducts,
    loading,
    categoriesLoading,
    featuredLoading,
    error,
    fetchFeaturedProducts,
    fetchBestSellingProducts,
    filterByCategory,
    currentPage,
    setCurrentPage
  } = useProducts({
    itemsPerPage: 20
  })

  // State để quản lý sản phẩm theo danh mục
  const [categoryProducts, setCategoryProducts] = React.useState<{[key: string]: Product[]}>({})
  const [loadingCategories, setLoadingCategories] = React.useState<{[key: string]: boolean}>({})
  const [categoryCounts, setCategoryCounts] = React.useState<{[key: number]: number}>({})
  const [loadingCounts, setLoadingCounts] = React.useState(false)
  const [categoriesProcessed, setCategoriesProcessed] = React.useState(false)

  // Lấy sản phẩm theo từng danh mục
  const fetchProductsByCategory = React.useCallback(async (categoryId: number, categoryName: string) => {
    try {
      setLoadingCategories(prev => ({...prev, [categoryName]: true}))
      const products = await productService.getProductsByCategory(categoryId, {limit: 4})
      setCategoryProducts(prev => ({...prev, [categoryName]: products}))
    } catch (err) {
      console.error(`Error fetching products for category ${categoryName}:`, err)
    } finally {
      setLoadingCategories(prev => ({...prev, [categoryName]: false}))
    }
  }, [])

  // Hàm lấy số lượng sản phẩm cho tất cả danh mục
  const fetchCategoryCounts = React.useCallback(async () => {
    if (categories.length === 0) return
    
    setLoadingCounts(true)
    try {
      const counts: {[key: number]: number} = {}
      
      await Promise.all(
        categories.map(async (category) => {
          try {
            const products = await productService.getProductsByCategory(category.id, {limit: 1000})
            counts[category.id] = products.length
          } catch (error) {
            console.error(`Error fetching count for category ${category.name}:`, error)
            counts[category.id] = 0
          }
        })
      )
      
      setCategoryCounts(counts)
    } catch (error) {
      console.error('Error fetching category counts:', error)
    } finally {
      setLoadingCounts(false)
    }
  }, [categories])

  // Lấy featured products và best selling products - chỉ chạy 1 lần
  React.useEffect(() => {
    fetchFeaturedProducts(8)
    fetchBestSellingProducts(12)
  }, [])

  // Load số lượng sản phẩm khi categories được load
  React.useEffect(() => {
    if (categories.length > 0 && !categoriesProcessed) {
      setCategoriesProcessed(true)
      
      fetchCategoryCounts()
      
      const mainCategories = categories.slice(0, 5)
      mainCategories.forEach((cat, index) => {
        fetchProductsByCategory(cat.id, `category-${index + 1}`)
      })
    }
  }, [categories.length, categoriesProcessed])

  // Reset flag khi categories thay đổi hoàn toàn
  React.useEffect(() => {
    if (categories.length === 0) {
      setCategoriesProcessed(false)
    }
  }, [categories.length])

  const handleAddToCart = (product: Product) => {
    router.push(`/product/${product.slug}`)
  }

  const handleCategoryClick = (category: Category) => {
    router.push(`/category/${category.id}?name=${encodeURIComponent(category.name)}`)
  }

  // Debug để kiểm tra categories
  console.log('🔍 Homepage Debug:', {
    currentProducts: currentProducts?.length || 0,
    categories: categories?.length || 0,
    featuredProducts: featuredProducts?.length || 0,
    loading,
    categoriesLoading,
    error,
    useProducts_working: true,
    api_url: process.env.NEXT_PUBLIC_API_URL,
    categories_data: categories,
    categories_names: categories.map(cat => cat.name)
  })

  return (
    <>
      <Marquee />
      <section>
        <div className="home">
          {/* Hero Section */}
          <div className="hero-subscribe-section">
            <div className="container">
              <div className="row align-items-center hero-subscribe-section-lg">
                <div className="col-lg-7 col-md-12 mb-4 mb-lg-0">
                  <div className="text-label mb-2">
                    <span className="text-danger fw-bold">100%</span> Rau củ hữu cơ
                  </div>
                  <h1 className="hero-title mb-3">
                    Cách tốt nhất để<br />tiết kiệm cho ví của bạn.
                  </h1>
                  <p className="text-muted mb-4">
                    Mua sắm thông minh với Tạp Hoá Xanh - nơi cung cấp thực phẩm tươi ngon, 
                    chất lượng cao với giá cả phải chăng nhất thị trường.
                  </p>
                  <form className="d-flex align-items-center gap-2 hero-subscribe-form">
                    <div className="input-group rounded-pill bg-white shadow-sm overflow-hidden">
                      <span className="input-group-text bg-white border-0">
                        <i className="fa fa-envelope text-muted"></i>
                      </span>
                      <input 
                        className="form-control border-0" 
                        type="email" 
                        placeholder="Địa chỉ email của bạn" 
                      />
                    </div>
                    <button className="btn btn-success rounded-pill px-4">Đăng ký</button>
                  </form>
                </div>
                <div className="col-lg-5 col-md-12 text-center position-relative">
                  <div className="hero-tags d-flex justify-content-center gap-2 mb-4 flex-wrap">
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-success border border-success hvr-float">
                      <i className="fa fa-times-circle text-muted me-1"></i>Mua sắm
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-muted border hvr-float">
                      <i className="fa fa-times-circle text-muted me-1"></i>Công thức
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-success border border-success hvr-float">
                      <i className="fa fa-times-circle text-muted me-1"></i>Bếp núc
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-muted border hvr-float">
                      <i className="fa fa-times-circle text-muted me-1"></i>Tin tức
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-success border border-success hvr-float">
                      <i className="fa fa-times-circle text-muted me-1"></i>Thực phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-subscribe">
              <img className="hero-lettuce" src="./client/images/banner.png" alt="Banner" />
            </div>
            <img className="hero-decor1 floating" src="./client/images/decor4.png" alt="decor" />
            <img className="hero-decor2 floating" src="./client/images/decor2.png" alt="decor" />
            <img className="hero-decor3 floating" src="./client/images/decor3.png" alt="decor" />
            <img className="hero-decor4 floating" src="./client/images/decor1.png" alt="decor" />
          </div>

          <div className="container">
            {/* Featured Categories */}
            <div className="section-featured-categories">
              <div className="featured-categories-header">
                <h2 className="featured-categories-title">Tất cả danh mục ({categories.length})</h2>
                <div className="featured-categories-tabs">
                  <span className="tab-item active">Tất cả ({categories.length})</span>
                  {categories.slice(0, 4).map((cat) => (
                    <span key={cat.id || cat.name} className="tab-item">
                      {cat.name} ({categoryCounts[cat.id] || 0})
                    </span>
                  ))}
                </div>
                <div className="featured-categories-nav">
                  <button className="nav-btn left">
                    <i className="icon-arrow-left"></i>
                  </button>
                  <button className="nav-btn right">
                    <i className="icon-arrow-right"></i>
                  </button>
                </div>
              </div>
              
              <div className="featured-categories-list" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: '15px',
                padding: '20px 0'
              }}>
                {categoriesLoading || loadingCounts ? (
                  Array.from({length: 9}).map((_, idx) => (
                    <div className="featured-category-item placeholder-glow" key={idx} style={{ minHeight: '120px' }}>
                      <div className="placeholder bg-secondary" style={{width: 50, height: 50, borderRadius: '50%', margin: '0 auto 10px'}}></div>
                      <div className="placeholder bg-secondary" style={{height: '12px', width: '80%', margin: '0 auto 5px'}}></div>
                      <div className="placeholder bg-secondary" style={{height: '10px', width: '60%', margin: '0 auto'}}></div>
                    </div>
                  ))
                ) : error ? (
                  <div className="text-center w-100 py-4" style={{ gridColumn: '1 / -1' }}>
                    <p className="text-danger">Lỗi tải danh mục: {error}</p>
                    <button 
                      className="btn btn-outline-primary btn-sm" 
                      onClick={() => window.location.reload()}
                    >
                      Thử lại
                    </button>
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <div 
                      className="featured-category-item" 
                      key={cat.id || cat.name} 
                      style={{ 
                        background: cat.color || '#f8f9fa', 
                        cursor: 'pointer',
                        padding: '15px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        minHeight: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => handleCategoryClick(cat)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCategoryClick(cat)
                        }
                      }}
                    >
                      <img 
                        src={getCategoryImage(cat, index)}
                        alt={cat.name}
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover', 
                          borderRadius: '50%', 
                          marginBottom: '8px' 
                        }}
                        onError={(e) => {
                          // Fallback chain: thử nhiều nguồn ảnh
                          const target = e.currentTarget as HTMLImageElement
                          const currentSrc = target.src
                          
                          if (currentSrc.includes('categories/')) {
                            // Thử ảnh theo slug
                            target.src = getCategoryImageBySlug(cat.slug, index)
                          } else if (currentSrc.includes(cat.slug)) {
                            // Thử ảnh theo index
                            target.src = `./client/images/categories/category-${index + 1}.png`
                          } else if (currentSrc.includes('category-')) {
                            // Cuối cùng dùng ảnh mặc định
                            target.src = './client/images/category-default.png'
                          }
                        }}
                      />
                      <div className="category-name" style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        marginBottom: '4px',
                        color: '#333'
                      }}>
                        {cat.name}
                      </div>
                      <div className="category-count" style={{ 
                        fontSize: '12px', 
                        color: '#666' 
                      }}>
                        {loadingCounts ? (
                          <span className="placeholder-glow">
                            <span className="placeholder" style={{width: '40px', height: '12px'}}></span>
                          </span>
                        ) : (
                          `${categoryCounts[cat.id] || 0} sản phẩm`
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center w-100 py-4" style={{ gridColumn: '1 / -1' }}>
                    <p className="text-muted">Không có danh mục nào</p>
                    <small className="text-muted">
                      Kiểm tra kết nối API: {process.env.NEXT_PUBLIC_API_URL || 'Chưa cấu hình'}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Flash Sale Row */}
            {featuredProducts.length > 0 && (
              <div className="flash-sale-row my-5">
                <div className="container">
                  <div className="row g-4 align-items-stretch">
                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                      <div className="flash-sale-banner bg-dark text-white rounded-4 p-4 h-100 d-flex flex-column justify-content-center align-items-start">
                        <img 
                          className="mb-4 rounded-3" 
                          src="./client/images/flash-banner.jpg" 
                          alt="Banner" 
                          style={{ width: '100%', maxWidth: 260 }} 
                        />
                        <h2 className="fw-bold mb-3">
                          Mang thiên nhiên<br />vào ngôi nhà của bạn
                        </h2>
                        <a className="btn btn-danger rounded-pill px-4 py-2 mt-3" href="#">
                          Mua ngay →
                        </a>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div className="flash-sale-slider position-relative">
                        <button className="slick-prev custom-arrow" type="button">
                          <i className="fa fa-chevron-left"></i>
                        </button>
                        <button className="slick-next custom-arrow" type="button">
                          <i className="fa fa-chevron-right"></i>
                        </button>
                        <div className="flash-sale-track d-flex gap-3">
                          {loading ? (
                            // Loading skeleton
                            Array.from({length: 4}).map((_, idx) => (
                              <div className="flash-sale-card bg-white rounded-4 p-3 h-100 position-relative" key={idx}>
                                <div className="placeholder-glow">
                                  <div className="placeholder bg-secondary mb-3" style={{height: 110, width: '100%'}}></div>
                                  <div className="placeholder bg-secondary col-8 mb-2"></div>
                                  <div className="placeholder bg-secondary col-6 mb-2"></div>
                                  <div className="placeholder bg-secondary col-4 mb-2"></div>
                                </div>
                              </div>
                            ))
                          ) : featuredProducts.length > 0 ? (
                            featuredProducts.slice(0, 4).map((product, idx) => (
                              <div className="flash-sale-card bg-white rounded-4 p-3 h-100 position-relative" key={product.id}>
                                <div className={`badge position-absolute top-0 start-0 mt-3 ms-3 text-white fs-6 ${
                                  ['bg-success', 'bg-info', 'bg-warning', 'bg-danger'][idx % 4]
                                }`}>
                                  {product.discount > 0 ? `Giảm ${Math.round((product.discount / (product.price + product.discount)) * 100)}%` : ['Khuyến mãi', 'Bán chạy', 'Nổi bật'][idx % 3]}
                                </div>
                                <img 
                                  className="mx-auto d-block mb-3" 
                                  src={fixImgSrc(product.images)} 
                                  alt={product.name} 
                                  style={{ height: 110, objectFit: 'contain' }} 
                                />
                                <div className="text-muted mb-1">Tạp Hoá Xanh</div>
                                <div className="prod-title fw-semibold mb-2" title={product.name}>
                                  {product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name}
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                  <i className="fa fa-star text-warning me-1"></i>
                                  <span className="text-muted small">{product.rating || 4.5}</span>
                                </div>
                                <span className="text-success fw-bold me-2">
                                  {product.price.toLocaleString()}đ
                                </span>
                                {product.discount > 0 && (
                                  <span className="text-muted text-decoration-line-through">
                                    {(product.price + product.discount).toLocaleString()}đ
                                  </span>
                                )}
                                <div className="progress my-2" style={{ height: 6 }}>
                                  <div className="progress-bar bg-danger" style={{ width: '75%' }}></div>
                                </div>
                                <div className="sold-text text-muted mb-2">Đã bán: {Math.floor(Math.random() * 100)}/{Math.floor(Math.random() * 50) + 100}</div>
                                <button 
                                  className="btn btn-danger w-100 rounded-pill" 
                                  onClick={() => handleAddToCart(product)}
                                >
                                  Thêm vào giỏ
                                </button>
                              </div>
                            ))
                          ) : (
                            // No products found
                            <div className="text-center w-100 py-4">
                              <p className="text-muted">Không có sản phẩm nổi bật</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Popular Products */}
            {currentProducts.length > 0 && (
              <div className="products w-100 my-5">
                <div className="d-flex justify-content-lg-between align-items-center align-items-center flex-wrap justify-content-center">
                  <h2>Sản phẩm phổ biến</h2>
                </div>
                <div className="tab-content" id="myTabContent">
                  <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex={0}>
                    <div className="product-list">
                      <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                        {loading ? (
                          // Loading skeleton
                          Array.from({length: 10}).map((_, idx) => (
                            <div className="col" key={idx}>
                              <div className="p-lg-0">
                                <div className="product-card selected placeholder-glow">
                                  <div className="product-img">
                                    <div className="placeholder bg-secondary" style={{height: 150, width: '100%'}}></div>
                                  </div>
                                  <div className="product-info">
                                    <div className="placeholder bg-secondary col-6 mb-2"></div>
                                    <div className="placeholder bg-secondary col-8 mb-2"></div>
                                    <div className="placeholder bg-secondary col-7 mb-2"></div>
                                    <div className="placeholder bg-secondary col-5"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : currentProducts.length > 0 ? (
                          currentProducts.map((product, idx) => (
                            <div className="col" key={product.id}>
                              <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${idx * 0.1}s`} data-wow-duration="0.5s">
                                <div className="product-card selected">
                                  <div className="badge badge-hot">Nổi bật</div>
                                  <div className="product-img">
                                    <img src={fixImgSrc(product.images)} alt={product.name} />
                                  </div>
                                  <div className="product-info">
                                    <div className="category">{product.category || 'Snack'}</div>
                                    <div className="name" title={product.name}>
                                      {product.name.length > 25 ? product.name.substring(0, 25) + '...' : product.name}
                                    </div>
                                    <div className="brand">
                                      Bởi <span className="brand-name">Tạp Hoá Xanh</span>
                                    </div>
                                    <div className="price-row">
                                      <div className="price">{product.price.toLocaleString()}đ</div>
                                      {product.discount > 0 && (
                                        <div className="old-price">
                                          {(product.price + product.discount).toLocaleString()}đ
                                        </div>
                                      )}
                                    </div>
                                    <div className="rating">
                                      <i className="fa fa-star filled"></i>
                                      <i className="fa fa-star filled"></i>
                                      <i className="fa fa-star filled"></i>
                                      <i className="fa fa-star filled"></i>
                                      <i className="fa fa-star"></i>
                                      <span className="rating">{product.rating || 4.0}</span>
                                    </div>
                                  </div>
                                  <div className="add-cart-row">
                                    <button className="add-cart" onClick={() => handleAddToCart(product)}>
                                      Thêm vào giỏ<i className="fa fa-shopping-cart"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center py-4">
                            <p className="text-muted">Không có sản phẩm nào</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sản phẩm theo danh mục */}
            <div className="section-best-sells">
              {categories.slice(0, 5).map((category, categoryIndex) => {
                const categoryKey = `category-${categoryIndex + 1}`
                const products = categoryProducts[categoryKey] || []
                const isLoading = loadingCategories[categoryKey]
                
                return (
                  <div key={category.id} className="row g-3 my-4">
                    <div className="col-lg-2 d-none d-lg-block h-100">
                      <div className="promo-banner">
                        <img 
                          className="img-fluid rounded" 
                          src={`./client/images/banner-${categoryIndex + 1}.png`} 
                          style={{ height: 418, width: '100%', objectFit: 'cover' }} 
                          alt={`Banner ${category.name}`}
                          onError={(e) => {
                            e.currentTarget.src = './client/images/banner-default.png'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="col-12 d-block d-lg-none mb-2">
                      <h5 className="fw-bold text-success">Danh mục: {category.name}</h5>
                    </div>
                    
                    <div className="col-12 col-lg-10">
                      <div className="row">
                        {isLoading ? (
                          [1, 2, 3, 4].map((item) => (
                            <div key={item} className="col-12 col-md-6 col-lg-3 padd hvr-float">
                              <div className="product-card d-flex flex-column justify-content-between h-100 placeholder-glow" style={{ minHeight: 420 }}>
                                <div className="product-img">
                                  <div className="placeholder bg-secondary" style={{height: 150, width: '100%'}}></div>
                                </div>
                                <div className="product-info">
                                  <div className="placeholder bg-secondary col-6 mb-2"></div>
                                  <div className="placeholder bg-secondary col-8 mb-2"></div>
                                  <div className="placeholder bg-secondary col-7 mb-2"></div>
                                  <div className="placeholder bg-secondary col-5"></div>
                                </div>
                                <div className="placeholder bg-secondary w-100 mt-2" style={{height: 40}}></div>
                              </div>
                            </div>
                          ))
                        ) : products.length > 0 ? (
                          products.slice(0, 4).map((product, index) => (
                            <div key={product.id} className="col-12 col-md-6 col-lg-3 padd hvr-float">
                              <div className="product-card d-flex flex-column justify-content-between h-100" style={{ minHeight: 420 }}>
                                {index === 0 && <div className="badge badge-hot">Hot</div>}
                                {index === 2 && <div className="badge badge-new">New</div>}
                                
                                <div className="product-img">
                                  <img 
                                    className="img-fluid" 
                                    src={fixImgSrc(product.images)} 
                                    alt={product.name}
                                    onError={(e) => {
                                      e.currentTarget.src = './client/images/placeholder.png'
                                    }}
                                  />
                                </div>
                                
                                <div className="product-info">
                                  <div className="category">{category.name}</div>
                                  <div className="name">{product.name}</div>
                                  <div className="brand">
                                    Bởi <span className="brand-name">Tạp Hoá Xanh</span>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="price-row d-flex flex-column">
                                      <div className="price">{product.price.toLocaleString()}đ</div>
                                      {product.discount > 0 && (
                                        <div className="old-price">{(product.price + product.discount).toLocaleString()}đ</div>
                                      )}
                                    </div>
                                    <div className="rating">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <i key={star} className={`fa fa-star ${star <= (product.rating || 5) ? 'filled' : ''}`} />
                                      ))}
                                      <span className="rating">{product.rating || '5.0'}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <button 
                                  className="add-cart btn w-100 mt-2"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  Thêm vào giỏ<i className="fa fa-shopping-cart ms-2" />
                                </button>
                                
                                <div className="sold-bar mt-2">
                                  <div className="progress">
                                    <div className="progress-bar bg-pink" style={{ width: '75%' }} />
                                  </div>
                                  <div className="sold-text">Đã bán: {product.soldCount || Math.floor(Math.random() * 100)}/120</div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center py-4">
                            <p className="text-muted">Không có sản phẩm trong danh mục này</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-banner">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="newsletter-content">
                    <h1 className="title">
                      Ở nhà & nhận nhu cầu hàng ngày<br />từ cửa hàng của chúng tôi
                    </h1>
                    <p className="subtitle">
                      Mua sắm thông minh với <span className="brand">Tạp Hoá Xanh</span>
                    </p>
                    <form className="newsletter-form">
                      <div className="input-group">
                        <span className="input-icon">
                          <i className="fa fa-envelope"></i>
                        </span>
                        <input className="form-control" type="email" placeholder="Địa chỉ email của bạn" />
                        <button className="btn-subscribe" type="submit">Đăng ký</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="newsletter-image position-relative">
                    <img className="girl-img floating" src="client/images/girl.png" alt="Girl" draggable="false" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}