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
          fetch(`/api/product?limit=100`),
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
    router.push(`/product/${product.id}`);
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
        <div className="home">
          <div className="hero-section">
            <div className="hero-background">
              <div className="hero-curve"></div>
            </div>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="hero-content">
                    <h1 className="hero-title">Organic Tubers & Fresh Fruits</h1>
                    <p className="hero-subtitle">Provides us with fiber & nutrition every day</p>
                    <button className="btn btn-primary shop-now-btn">Shop now</button>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image">
                    <Image className="hero-fruit-bowl" src="/client/images/vegetables-basket.png" alt="Fresh Vegetables Basket" width={500} height={400} />
                    <div className="hero-decorations">
                      <Image className="hero-leaf leaf-1" src="/client/images/leaf-1.png" alt="Leaf" width={100} height={100} />
                      <Image className="hero-leaf leaf-2" src="/client/images/leaf-2.png" alt="Leaf" width={100} height={100} />
                      <Image className="hero-leaf leaf-3" src="/client/images/leaf-3.png" alt="Leaf" width={100} height={100} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="promotional-banners">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div className="promo-banner organic-farm">
                    <div className="promo-content">
                      <h3 className="promo-title">Organic Farm</h3>
                      <p className="promo-subtitle">Very pure & natural</p>
                      <button className="btn btn-outline-light shop-now-btn">Shop now</button>
                    </div>
                    <div className="promo-image">
                      <Image src="/client/images/pomegranate.png" alt="Pomegranate" width={200} height={200} />
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="promo-banner healthy-diet">
                    <div className="promo-content">
                      <h3 className="promo-title">Healthy Diet</h3>
                      <p className="promo-subtitle">100% Fresh organic</p>
                      <button className="btn btn-outline-light shop-now-btn">Shop now</button>
                    </div>
                    <div className="promo-image">
                      <Image src="/client/images/vegetables-crate.png" alt="Fresh Vegetables" width={200} height={200} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="section-featured-categories">
              <div className="featured-categories-header">
                <h2 className="featured-categories-title">Danh mục nổi bật</h2>
                <div className="featured-categories-tabs">
                  <span className="tab-item active">Bánh & Sữa</span>
                  <span className="tab-item">Cà phê & Trà</span>
                  <span className="tab-item">Thức ăn thú cưng</span>
                  <span className="tab-item">Rau củ</span>
                </div>
                <div className="featured-categories-nav">
                  <button className="nav-btn left"><i className="icon-arrow-left"></i></button>
                  <button className="nav-btn right"><i className="icon-arrow-right"></i></button>
                </div>
              </div>
              <div className="featured-categories-list">
                <div className="featured-category-item bg-yellow">
                  <Image src="/public/images/cake-milk.png" alt="Cake & Milk" width={100} height={100} />
                  <div className="category-name">Bánh & Sữa</div>
                  <div className="category-count">26 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-orange">
                  <Image src="/public/images/kiwi.png" alt="Organic Kiwi" width={100} height={100} />
                  <div className="category-name">Kiwi hữu cơ</div>
                  <div className="category-count">28 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-green">
                  <Image src="/public/images/peach.png" alt="Peach" width={100} height={100} />
                  <div className="category-name">Đào</div>
                  <div className="category-count">14 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-pink">
                  <Image src="/public/images/red-apple.png" alt="Red Apple" width={100} height={100} />
                  <div className="category-name">Táo đỏ</div>
                  <div className="category-count">54 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-yellow">
                  <Image src="/public/images/snack.png" alt="Snack" width={100} height={100} />
                  <div className="category-name">Snack</div>
                  <div className="category-count">56 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-purple">
                  <Image src="/public/images/vegetables.png" alt="Vegetables" width={100} height={100} />
                  <div className="category-name">Rau củ</div>
                  <div className="category-count">72 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-green">
                  <Image src="/public/images/strawberry.png" alt="Strawberry" width={100} height={100} />
                  <div className="category-name">Dâu tây</div>
                  <div className="category-count">36 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-pink">
                  <Image src="/public/images/black-plum.png" alt="Black plum" width={100} height={100} />
                  <div className="category-name">Mận đen</div>
                  <div className="category-count">123 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-yellow">
                  <Image src="/public/images/custard-apple.png" alt="Custard apple" width={100} height={100} />
                  <div className="category-name">Na</div>
                  <div className="category-count">34 sản phẩm</div>
                </div>
                <div className="featured-category-item bg-pink">
                  <Image src="/public/images/coffee-tea.png" alt="Coffee & Tea" width={100} height={100} />
                  <div className="category-name">Cà phê & Trà</div>
                  <div className="category-count">89 sản phẩm</div>
                </div>
              </div>
            </div>

            <div className="flash-sale-section">
              <div className="container">
                <div className="section-header text-center mb-5">
                  <h2 className="section-title">Flash Sale</h2>
                  <p className="section-subtitle">Limited time offers - Don't miss out!</p>
                </div>
                <div className="row g-4">
                  {/* Banner trái*/}
                  <div className="col-lg-3 col-md-12">
                    <div className="promo-card">
                      <div className="promo-image">
                        <Image src="/client/images/flash-banner.jpg" alt="Flash Sale Banner" width={300} height={400} />
                      </div>
                      <div className="promo-content">
                        <div className="promo-badge">-50% OFF</div>
                        <h3 className="promo-title">Fresh Organic Products</h3>
                        <p className="promo-desc">Limited time offer on selected items</p>
                        <div className="countdown-timer">
                          <div className="timer-item"><span className="number">02</span><span className="label">Days</span></div>
                          <div className="timer-item"><span className="number">18</span><span className="label">Hours</span></div>
                          <div className="timer-item"><span className="number">45</span><span className="label">Min</span></div>
                        </div>
                        <button className="btn btn-primary shop-now-btn">Shop Now</button>
                      </div>
                    </div>
                  </div>
                  {/* Sản phẩm flash sale slider*/}
                  <div className="col-lg-9">
                    <div className="flash-sale-slider">
                      {/* Navigation arrows*/}
                      <button className="slider-nav prev-btn" type="button" aria-label="Previous slide">
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button className="slider-nav next-btn" type="button" aria-label="Next slide">
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      {/* Slider container*/}
                      <div className="slider-container">
                        <div className="slider-track">
                          {currentProducts.slice(0, 8).map((product, index) => (
                            <div className="slider-item" key={product.id}>
                              <div className="flash-product-card">
                                <div className="product-badge">Hot</div>
                                <div className="discount-badge">{product.discount > 0 ? Math.round((product.discount / product.price) * 100) : 0}%</div>
                                <div className="product-image">
                                  <Image src={product.images || '/client/images/product.png'} alt={product.name} loading="lazy" width={200} height={200} />
                                  <div className="quick-view-overlay">
                                    <button className="quick-view-btn" onClick={() => handleViewDetail(product)}>
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </div>
                                </div>
                                <div className="product-info">
                                  <h4 className="product-name">{product.name}</h4>
                                  <div className="product-rating">
                                    <i className="fas fa-star active"></i>
                                    <i className="fas fa-star active"></i>
                                    <i className="fas fa-star active"></i>
                                    <i className="fas fa-star active"></i>
                                    <i className="fas fa-star-half-alt active"></i>
                                    <span className="rating-text">4.5</span>
                                    <span className="sold-count">(156 sold)</span>
                                  </div>
                                  <div className="product-price">
                                    <span className="current-price">{formatPriceVND(product.price - product.discount)}</span>
                                    {product.discount > 0 && (
                                      <span className="old-price">{formatPriceVND(product.price)}</span>
                                    )}
                                  </div>
                                  <div className="product-actions">
                                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>
                                      <i className="fas fa-shopping-cart"></i>
                                      <span>Add to Cart</span>
                                    </button>
                                    <button className="wishlist-btn" onClick={() => handleToggleWishlist(product.id)}>
                                      <i className={`far fa-heart ${wishlist.includes(product.id) ? 'fas text-danger' : ''}`}></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Dots navigation*/}
                      <div className="slider-dots">
                        <button className="dot-btn active" aria-label="Go to slide 1"></button>
                        <button className="dot-btn" aria-label="Go to slide 2"></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="products w-100 my-1">
              <div className="d-flex justify-content-lg-between align-items-center align-items-center flex-wrap justify-content-center">
                <h2 className="fresh-products-title">Fresh Products</h2>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="vegetables-tab" data-bs-toggle="tab" data-bs-target="#vegetables-tab-pane" type="button" role="tab" aria-controls="vegetables-tab-pane" aria-selected="true">Vegetables</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="fruits-tab" data-bs-toggle="tab" data-bs-target="#fruits-tab-pane" type="button" role="tab" aria-controls="fruits-tab-pane" aria-selected="false">Fresh Fruits</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="tubers-tab" data-bs-toggle="tab" data-bs-target="#tubers-tab-pane" type="button" role="tab" aria-controls="tubers-tab-pane" aria-selected="false">Fresh Tubers</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="dairy-tab" data-bs-toggle="tab" data-bs-target="#dairy-tab-pane" type="button" role="tab" aria-controls="dairy-tab-pane" aria-selected="false">Dairy Bread</button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="vegetables-tab-pane" role="tabpanel" aria-labelledby="vegetables-tab" tabIndex={0}> 
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image className="product-image" src={product.images || '/client/images/product.png'} alt="Product" title="Product" width={200} height={200} />
                              </div>
                              <div className="product-info">
                                <div className="product-category">{product.category?.name || 'Dairy Bread'}</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{formatPriceVND(product.price)}</div>
                                <div className="product-description">{product.description || 'Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.'}</div>
                              </div>
                              <div className="product-actions">
                                <button className="wishlist-btn" onClick={() => handleToggleWishlist(product.id)}>
                                  <i className={`fas fa-heart ${wishlist.includes(product.id) ? 'text-danger' : ''}`}></i>
                                </button>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to cart</button>
                                <button className="quick-view-btn" onClick={() => handleViewDetail(product)}>
                                  <i className="fas fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="fruits-tab-pane" role="tabpanel" aria-labelledby="fruits-tab" tabIndex={0}> 
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image className="product-image" src={product.images || '/client/images/product.png'} alt="Product" title="Product" width={200} height={200} />
                              </div>
                              <div className="product-info">
                                <div className="product-category">{product.category?.name || 'Dairy Bread'}</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{formatPriceVND(product.price)}</div>
                                <div className="product-description">{product.description || 'Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.'}</div>
                              </div>
                              <div className="product-actions">
                                <button className="wishlist-btn" onClick={() => handleToggleWishlist(product.id)}>
                                  <i className={`fas fa-heart ${wishlist.includes(product.id) ? 'text-danger' : ''}`}></i>
                                </button>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to cart</button>
                                <button className="quick-view-btn" onClick={() => handleViewDetail(product)}>
                                  <i className="fas fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="tubers-tab-pane" role="tabpanel" aria-labelledby="tubers-tab" tabIndex={0}> 
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image className="product-image" src={product.images || '/client/images/product.png'} alt="Product" title="Product" width={200} height={200} />
                              </div>
                              <div className="product-info">
                                <div className="product-category">{product.category?.name || 'Dairy Bread'}</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{formatPriceVND(product.price)}</div>
                                <div className="product-description">{product.description || 'Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.'}</div>
                              </div>
                              <div className="product-actions">
                                <button className="wishlist-btn" onClick={() => handleToggleWishlist(product.id)}>
                                  <i className={`fas fa-heart ${wishlist.includes(product.id) ? 'text-danger' : ''}`}></i>
                                </button>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to cart</button>
                                <button className="quick-view-btn" onClick={() => handleViewDetail(product)}>
                                  <i className="fas fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="dairy-tab-pane" role="tabpanel" aria-labelledby="dairy-tab" tabIndex={0}>
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image className="product-image" src={product.images || '/client/images/product.png'} alt="Product" title="Product" width={200} height={200} />
                              </div>
                              <div className="product-info">
                                <div className="product-category">{product.category?.name || 'Dairy Bread'}</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{formatPriceVND(product.price)}</div>
                                <div className="product-description">{product.description || 'Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.'}</div>
                              </div>
                              <div className="product-actions">
                                <button className="wishlist-btn" onClick={() => handleToggleWishlist(product.id)}>
                                  <i className={`fas fa-heart ${wishlist.includes(product.id) ? 'text-danger' : ''}`}></i>
                                </button>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to cart</button>
                                <button className="quick-view-btn" onClick={() => handleViewDetail(product)}>
                                  <i className="fas fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="promo-banners my-2">
              <div className="promo-grid">
                <div className="row"> 
                  <div className="col-lg-6">
                    <div className="promo-banner bg-blue">
                      <div className="promo-content">
                        <div className="promo-badge">Giảm giá 20%</div>
                        <div className="promo-title my-3">Rau củ tươi ngon<br/>hoàn toàn sạch</div>
                        <a className="promo-btn" href="#">Mua ngay</a>
                      </div>
                      <div className="promo-image">
                        <Image className="img-pr" src="/client/images/water.png" alt="Water Bottle" width={200} height={200} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="promo-banner bg-yellow">
                      <div className="promo-conten-b">
                        <div className="promo-badge">Giảm giá 25%</div>
                        <div className="promo-title my-3">Trái cây tươi<br/>chất lượng cao</div>
                        <a className="promo-btn" href="#">Mua ngay</a>
                      </div>
                      <div className="promo-image">
                        <Image className="img-pr" src="/client/images/coffe.png" alt="Coffee Beans" width={200} height={200} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-best-sells">
              {Array.from({ length: 6 }, (_, sectionIndex) => (
                <div className="row g-3 my-2" key={sectionIndex}>
                  {/* Banner chỉ hiển thị trên desktop*/}
                  <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay={`${(sectionIndex + 1) * 0.1}s`} data-wow-duration="0.5s">
                    <div className="promo-banner">
                      <Image className="img-fluid rounded" src={`/client/images/banner-${sectionIndex + 1}.png`} alt={`Banner ${sectionIndex + 1}`} width={200} height={418} style={{height: '418px'}} />
                    </div>
                  </div>
                  {/* Tên danh mục thay thế banner khi ở tablet/mobile*/}
                  <div className="col-12 d-block d-lg-none mb-2">
                    <h5 className="fw-bold text-success">Danh mục: Sản phẩm dinh dưỡng</h5>
                  </div>
                  {/* Dữ liệu sản phẩm*/}
                  <div className="col-12 col-lg-10">
                    <div className="row">
                      {currentProducts.slice(0, 4).map((product, index) => (
                        <div className="col-12 col-md-6 col-lg-3 padd hvr-float" key={product.id}>
                          <div className="product-list">
                            <div className="product-card wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                              <div className="product-image-container">
                                <Image className="product-image" src={product.images || `/client/images/pr-${index + 1}.png`} alt={product.name} title={product.name} width={200} height={200} />
                              </div>
                              <div className="product-info">
                                <div className="product-category">{product.category?.name || 'Dairy Bread'}</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">{formatPriceVND(product.price)}</div>
                                <div className="product-description">{product.description || 'Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.'}</div>
                              </div>
                              <div className="product-actions">
                                <button className="wishlist-btn" onClick={() => handleToggleWishlist(product.id)}>
                                  <i className={`fas fa-heart ${wishlist.includes(product.id) ? 'text-danger' : ''}`}></i>
                                </button>
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(product)}>Add to cart</button>
                                <button className="quick-view-btn" onClick={() => handleViewDetail(product)}>
                                  <i className="fas fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="newsletter-banner">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="newsletter-content">
                    <h1 className="title">Ở nhà & nhận nhu cầu hàng ngày<br/>từ cửa hàng của chúng tôi</h1>
                    <p className="subtitle">Mua sắm thông minh với <span className="brand">Tạp Hoá Xanh</span></p>
                    <form className="newsletter-form">
                      <div className="input-group">
                        <span className="input-icon"><i className="fa fa-envelope"></i></span>
                        <input className="form-control" type="email" placeholder="Địa chỉ email của bạn" />
                        <button className="btn-subscribe" type="submit">Đăng ký</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="newsletter-image position-relative">
                    <Image className="girl-img floating" src="/client/images/girl.png" alt="Girl" draggable="false" width={300} height={400} />
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