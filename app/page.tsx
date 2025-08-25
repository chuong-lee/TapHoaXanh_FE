'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCategoriesQuery } from '@/hooks/useProductsQuery'
import { useHomepageProducts } from '@/hooks/useHomepageProducts'
import ProductSkeleton from '@/components/ui/ProductSkeleton'
import { useCart } from '@/hooks/useCart'
import CartNotification from '@/components/ui/CartNotification'
import { getBannerImage, fixImgSrc, handleImageError } from '@/lib/imageUtils'

// Thêm hàm format giá VND
function formatPriceVND(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}



interface Product {
  id: number
  name: string
  price: number
  discount: number
  images: string
  slug: string
  description: string
  quantity: number
  categoryId?: number
  category?: string
  barcode?: string
  expiry_date?: string
  origin?: string
  weight_unit?: string
  brandId?: number
  purchase?: number
  category_childId?: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

// Thêm component Rating Stars với màu vàng
const RatingStars = ({ rating = 4.5, showNumber = true }: { rating?: number, showNumber?: boolean }) => {
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
          <i key={i} className="fas fa-star" style={{ color: '#D3D3D3' }}></i>
        ))}
      </div>
      {showNumber && (
        <span className="rating-text ms-1" style={{ color: '#666', fontSize: '0.9rem' }}>({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default function HomePage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [wishlist, setWishlist] = useState<number[]>([])
  const [wishlistLoading, setWishlistLoading] = useState<number | null>(null)
  const [addToCartMessage, setAddToCartMessage] = useState('')

  // Sử dụng optimized hooks
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategoriesQuery(true)
  const { products: allProducts, loading: productsLoading, error: productsError } = useHomepageProducts()

  console.log('Homepage products state:', {
    productsCount: allProducts?.length || 0,
    loading: productsLoading,
    error: productsError
  });

  // Load wishlist từ localStorage khi component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        setWishlist([]);
      }
    }
  }, []);

  // Lưu wishlist vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Tính toán loading state tổng hợp
  const isLoading = productsLoading || categoriesLoading;

  const handleAddToCart = (product: Product) => {
    // Thêm sản phẩm vào giỏ hàng
    const finalPrice = product.price - product.discount;
    
    addToCart({
      ...product,
      price: finalPrice,
              stock: 0,
      images: Array.isArray(product.images) ? product.images.join(',') : product.images,
    }, 1); // Thêm 1 sản phẩm
    
    // Hiển thị thông báo thành công
    setAddToCartMessage('✅ Đã thêm vào giỏ hàng thành công!');
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setAddToCartMessage('');
    }, 3000);
  };

  const handleViewDetail = (product: Product) => {
    router.push(`/product/${product.slug}`);
  };

  // Thêm hàm xử lý wishlist toggle
  const handleToggleWishlist = async (productId: number) => {
    setWishlistLoading(productId);
    
    try {
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        // Xóa khỏi wishlist
        setWishlist(prev => prev.filter(id => id !== productId));
        console.log(`Đã bỏ thích sản phẩm ${productId}`);
      } else {
        // Thêm vào wishlist
        setWishlist(prev => [...prev, productId]);
        console.log(`Đã thích sản phẩm ${productId}`);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setWishlistLoading(null);
    }
  };

  // Helper lấy 4 sản phẩm cho mỗi hàng
  const getRowProducts = (rowIdx: number) => {
    const start = (rowIdx - 1) * 4;
    return allProducts.slice(start, start + 4);
  };



  return (
    <div>
      {/* <Marquee /> */}
      {/* Hiển thị thông báo thêm vào giỏ hàng */}
      {addToCartMessage && (
        <CartNotification 
          message={addToCartMessage}
          onClose={() => setAddToCartMessage('')}
          duration={3000}
        />
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
                    <h1 className="hero-title">Organic Tubers &amp; Fresh Fruits</h1>
                    <p className="hero-subtitle">Provides us with fiber &amp; nutrition every day</p>
                    <button className="btn btn-primary shop-now-btn">Shop now</button>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="hero-image">
                    <Image className="hero-fruit-bowl" src="/client/images/vegetables-basket.png" alt="Fresh Vegetables Basket" width={500} height={400} />
                    <div className="hero-decorations">
                      <Image className="hero-leaf leaf-1" src="/client/images/leaf-1.png" alt="Leaf" width={50} height={50} />
                      <Image className="hero-leaf leaf-2" src="/client/images/leaf-2.png" alt="Leaf" width={50} height={50} />
                      <Image className="hero-leaf leaf-3" src="/client/images/leaf-3.png" alt="Leaf" width={50} height={50} />
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
                  {/* Tabs có thể render từ categories nếu muốn filter */}
                  {categoriesData?.slice(0, 4).map((cat: any, idx: number) => (
                    <span className={`tab-item${idx === 0 ? ' active' : ''}`} key={cat.id}>{cat.name}</span>
                  ))}
                </div>
                <div className="featured-categories-nav">
                  <button className="nav-btn left"><i className="icon-arrow-left"></i></button>
                  <button className="nav-btn right"><i className="icon-arrow-right"></i></button>
                </div>
              </div>
              <div className="featured-categories-list">
                {categoriesLoading ? (
                  <div>Đang tải danh mục...</div>
                ) : categoriesError ? (
                  <div>Lỗi tải danh mục</div>
                ) : (
                  categoriesData?.map((cat: any, idx: number) => (
                    <div className="featured-category-item" style={{ background: cat.color || undefined }} key={cat.id}>
                      <Image src={cat.icon || '/images/placeholder.jpg'} alt={cat.name} width={80} height={80} />
                      <div className="category-name">{cat.name}</div>
                      <div className="category-count">{cat.count ?? 0} sản phẩm</div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="flash-sale-section">
              <div className="container">
                <div className="section-header text-center mb-5">
                  <h2 className="section-title">Flash Sale</h2>
                  <p className="section-subtitle">Limited time offers - Don't miss out!</p>
                </div>
                <div className="row g-4">
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
                  <div className="col-lg-9">
                    <div className="flash-sale-slider">
                      <button className="slider-nav prev-btn" type="button"><i className="fas fa-chevron-left"></i></button>
                      <button className="slider-nav next-btn" type="button"><i className="fas fa-chevron-right"></i></button>
                      <div className="slider-container">
                        <div className="slider-track">
                          {/* Example static flash sale products, replace with dynamic if needed */}
                          {[1,2,3,4,5,6,7,8].map((item, idx) => (
                            <div className="slider-item" key={idx}>
                              <div className="flash-product-card">
                                <div className="product-badge">{["Hot","New","Sale","Hot","New","Sale","Hot","New"][idx]}</div>
                                <div className="discount-badge">{["20%","15%","30%","25%","35%","18%","22%","28%"][idx]}</div>
                                <div className="product-image">
                                  <Image src={`/client/images/product-${item}.png`} alt={`Product ${item}`} width={150} height={150} />
                                </div>
                                <div className="product-info">
                                  <h4 className="product-name">{["Fresh Organic Tomatoes","Organic Avocados","Fresh Spinach","Organic Carrots","Fresh Broccoli","Organic Bell Peppers","Fresh Cucumbers","Organic Onions"][idx]}</h4>
                                  <div className="product-rating">
                                    <RatingStars rating={parseFloat(["4.5","4.8","4.3","4.6","4.7","4.4","4.2","4.6"][idx])} />
                                  </div>
                                  <div className="product-price">
                                    <span className="current-price">{formatPriceVND(parseFloat(["12.99","8.99","5.99","6.99","7.99","9.99","4.99","5.99"][idx]) * 1000)}</span>
                                    <span className="old-price">{formatPriceVND(parseFloat(["16.99","10.99","8.99","9.99","12.99","12.99","6.99","8.99"][idx]) * 1000)}</span>
                                  </div>
                                  <button 
                                    className="add-to-cart-btn" 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      // Có thể thêm một sản phẩm mặc định hoặc chuyển đến trang sản phẩm
                                      router.push('/categories');
                                    }}
                                  >
                                    Add to Cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="slider-dots">
                        <button className="dot-btn active"></button>
                        <button className="dot-btn"></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Products Tabs */}
            <div className="products w-100 my-1">
              <div className="d-flex justify-content-lg-between align-items-center align-items-center flex-wrap justify-content-center">
                <h2 className="fresh-products-title">Fresh Products</h2>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="all-tab" data-bs-toggle="tab" data-bs-target="#all-tab-pane" type="button" role="tab" aria-controls="all-tab-pane" aria-selected="true">Tất cả</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="drinks-tab" data-bs-toggle="tab" data-bs-target="#drinks-tab-pane" type="button" role="tab" aria-controls="drinks-tab-pane" aria-selected="false">Đồ uống</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="seafood-tab" data-bs-toggle="tab" data-bs-target="#seafood-tab-pane" type="button" role="tab" aria-controls="seafood-tab-pane" aria-selected="false">Thủy hải sản</button>
                  </li>
                </ul>
              </div>
              <div className="tab-content" id="myTabContent">
                {/* All Products Tab */}
                <div className="tab-pane fade show active" id="all-tab-pane" role="tabpanel" aria-labelledby="all-tab" tabIndex={0}>
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {productsLoading ? (
                        <ProductSkeleton count={10} />
                      ) : !allProducts || allProducts.length === 0 ? (
                        <div className="col-12 text-center py-4">
                          <div className="alert alert-info">
                            {productsError ? `Lỗi: ${productsError}` : 'Không có sản phẩm'}
                          </div>
                        </div>
                      ) : (
                        allProducts.slice(0, 10).map((product: Product, i: number) => (
                          <div className="col" key={product.id}>
                            <div className="product-card wow fadeInLeft" data-wow-delay={`${i * 0.1}s`} data-wow-duration="0.5s">
                              <div className="product-image-container">
                                <img 
                                  className="product-image" 
                                  src={fixImgSrc(product.images)} 
                                  alt={product.name} 
                                  title={product.name} 
                                  loading="lazy"
                                />
                              </div>
                              <div className="product-info">
                                <div className="product-category">
                                  {typeof (product as any).category === 'string' 
                                    ? (product as any).category 
                                    : (product as any).category?.name ?? 'Danh mục'}
                                </div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">
                                  {product.discount > 0 ? (
                                    <>
                                      <span className="text-decoration-line-through text-muted me-2">
                                        {formatPriceVND(product.price)}
                                      </span>
                                      <span className="text-danger fw-bold">
                                        {formatPriceVND(Math.round(product.price * (1 - product.discount / 100)))}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="fw-bold">{formatPriceVND(product.price)}</span>
                                  )}
                                </div>
                                <RatingStars rating={4.5} />
                                <div className="product-description">{product.description}</div>
                              </div>
                             
                              <div className="product-actions">
                                <button 
                                  className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleToggleWishlist(product.id);
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
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                >
                                  Add to cart
                                </button>
                                <button 
                                  className="quick-view-btn" 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleViewDetail(product);
                                  }}
                                  title="Xem chi tiết"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                         
                        ))
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Đồ uống Tab */}
                <div className="tab-pane fade" id="drinks-tab-pane" role="tabpanel" aria-labelledby="drinks-tab" tabIndex={0}>
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {isLoading ? (
                        <div className="col-12 text-center py-4">
                          <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                          </div>
                        </div>
                      ) : (
                        allProducts
                          .filter((product: Product) => {
                            const productCategory = typeof (product as any).category === 'string' 
                              ? (product as any).category 
                              : (product as any).category?.name;
                            return productCategory && (
                              productCategory.toLowerCase().includes('đồ uống') ||
                              productCategory.toLowerCase().includes('drink') ||
                              productCategory.toLowerCase().includes('nước') ||
                              productCategory.toLowerCase().includes('beverage')
                            );
                          })
                          .slice(0, 10)
                          .map((product, i) => (
                            <div className="col" key={product.id}>
                              <div className="product-card wow fadeInLeft" data-wow-delay={`${i * 0.1}s`} data-wow-duration="0.5s">
                                <div className="product-image-container">
                                  <img 
                                    className="product-image" 
                                    src={fixImgSrc(product.images)} 
                                    alt={product.name} 
                                    title={product.name} 
                                    loading="lazy"
                                  />
                                </div>
                                <div className="product-info">
                                  <div className="product-category">
                                    {typeof (product as any).category === 'string' 
                                      ? (product as any).category 
                                      : (product as any).category?.name ?? 'Danh mục'}
                                  </div>
                                  <div className="product-name">{product.name}</div>
                                  <div className="product-price">
                                    {product.discount > 0 ? (
                                      <>
                                        <span className="text-decoration-line-through text-muted me-2">
                                          {formatPriceVND(product.price)}
                                        </span>
                                        <span className="text-danger fw-bold">
                                          {formatPriceVND(Math.round(product.price * (1 - product.discount / 100)))}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="fw-bold">{formatPriceVND(product.price)}</span>
                                    )}
                                  </div>
                                  <RatingStars rating={4.3} />
                                  <div className="product-description">{product.description}</div>
                                </div>
                                <div className="product-actions">
                                  <button 
                                    className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleWishlist(product.id);
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
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAddToCart(product);
                                    }}
                                  >
                                    Add to cart
                                  </button>
                                  <button 
                                    className="quick-view-btn" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetail(product);
                                    }}
                                    title="Xem chi tiết"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Thủy hải sản Tab */}
                <div className="tab-pane fade" id="seafood-tab-pane" role="tabpanel" aria-labelledby="seafood-tab" tabIndex={0}>
                  <div className="product-list">
                    <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                      {isLoading ? (
                        <div className="col-12 text-center py-4">
                          <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                          </div>
                        </div>
                      ) : (
                        allProducts
                          .filter((product: Product) => {
                            const productCategory = typeof (product as any).category === 'string' 
                              ? (product as any).category 
                              : (product as any).category?.name;
                            return productCategory && (
                              productCategory.toLowerCase().includes('thủy hải sản') ||
                              productCategory.toLowerCase().includes('seafood') ||
                              productCategory.toLowerCase().includes('cá') ||
                              productCategory.toLowerCase().includes('tôm') ||
                              productCategory.toLowerCase().includes('cua') ||
                              productCategory.toLowerCase().includes('mực')
                            );
                          })
                          .slice(0, 10)
                          .map((product, i) => (
                            <div className="col" key={product.id}>
                          <div className={`p-lg-0 hvr-float wow fadeInLeft`} data-wow-delay={`${i * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                    <Image 
                                      className="product-image" 
                                      src={fixImgSrc(product.images)} 
                                      alt={product.name} 
                                      title={product.name} 
                                      width={300} 
                                      height={300} 
                                    />
                              </div>
                              <div className="product-info">
                                    <div className="product-category">
                                      {typeof (product as any).category === 'string' 
                                        ? (product as any).category 
                                        : (product as any).category?.name ?? 'Danh mục'}
                                    </div>
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-price">
                                      {product.discount > 0 ? (
                                        <>
                                          <span className="text-decoration-line-through text-muted me-2">
                                            {formatPriceVND(product.price)}
                                          </span>
                                          <span className="text-danger fw-bold">
                                            {formatPriceVND(Math.round(product.price * (1 - product.discount / 100)))}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="fw-bold">{formatPriceVND(product.price)}</span>
                                      )}
                                    </div>
                                    <RatingStars rating={4.7} />
                                    <div className="product-description text-truncate">{product.description}</div>
                              </div>
                              <div className="product-actions">
                                    <button 
                                      className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleWishlist(product.id);
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
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleAddToCart(product);
                                      }}
                                    >
                                      Add to cart
                                    </button>
                                    <button 
                                      className="quick-view-btn" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetail(product);
                                      }}
                                      title="Xem chi tiết"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Promo Banners */}
            <div className="promo-banners my-2">
              <div className="promo-grid">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="promo-banner bg-blue">
                      <div className="promo-content">
                        <div className="promo-badge">Giảm giá 20%</div>
                        <div className="promo-title my-3">Rau củ tươi ngon<br />hoàn toàn sạch</div>
                        <a className="promo-btn" href="#">Mua ngay</a>
                      </div>
                      <div className="promo-image">
                        <Image className="img-pr" src="/client/images/water.png" alt="Water Bottle" width={360} height={240} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="promo-banner bg-yellow">
                      <div className="promo-conten-b">
                        <div className="promo-badge">Giảm giá 25%</div>
                        <div className="promo-title my-3">Trái cây tươi<br />chất lượng cao</div>
                        <a className="promo-btn" href="#">Mua ngay</a>
                      </div>
                      <div className="promo-image">
                        <Image className="img-pr" src="/client/images/coffe.png" alt="Coffee Beans" width={360} height={240} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section Best Sells */}
            <div className="section-best-sells">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p className="mt-2">Đang tải sản phẩm bán chạy...</p>
                </div>
              ) : (
                [1,2,3,4].map((rowIdx) => {
                  const rowProducts = getRowProducts(rowIdx);
                  if (rowProducts.length === 0) return null;
                  return (
                    <div className="row g-3 my-2" key={rowIdx}>
                      {/* Banner chỉ hiển thị trên desktop */}
                      <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay={`${rowIdx * 0.1}s`} data-wow-duration="0.5s">
                        <div className="promo-banner">
                          <Image 
                            className="img-fluid rounded" 
                            src={getBannerImage(rowIdx)} 
                            alt={`Banner ${rowIdx}`} 
                            width={180} 
                            height={418} 
                            style={{height: 418}} 
                          />
                        </div>
                      </div>
                      {/* Tên danh mục thay thế banner khi ở tablet/mobile */}
                      <div className="col-12 d-block d-lg-none mb-2">
                        <h5 className="fw-bold text-success">Danh mục: Sản phẩm dinh dưỡng</h5>
                      </div>
                      {/* Dữ liệu sản phẩm */}
                      <div className="col-12 col-lg-10">
                        <div className="row">
                          {rowProducts.map((product, i) => (
                            <div className="col-12 col-md-6 col-lg-3" key={product.id ?? i}>
                              <div className="product-card wow fadeInLeft" data-wow-delay={`${i*0.1}s`} data-wow-duration="0.5s">
                                <div className="product-image-container">
                                  <img
                                    className="product-image"
                                    src={fixImgSrc(product.images)}
                                    alt={product.name}
                                    title={product.name}
                                    loading="lazy"
                                    onError={handleImageError}
                                  />
                                </div>
                                <div className="product-info">
                                  <div className="product-category">
                                    {(product as any).category?.name || 
                                     (typeof (product as any).category === 'string' ? (product as any).category : 'Sản phẩm tươi')}
                                  </div>
                                  <div className="product-name">{product.name}</div>
                                  <div className="product-price">
                                    {product.discount > 0 ? (
                                      <>
                                        <span className="text-decoration-line-through text-muted me-2">
                                          {formatPriceVND(product.price)}
                                        </span>
                                        <span className="text-danger fw-bold">
                                          {formatPriceVND(Math.round(product.price * (1 - product.discount / 100)))}
                                        </span>
                                      </>
                                    ) : (
                                      <span className="fw-bold">{formatPriceVND(product.price)}</span>
                                    )}
                                  </div>
                                  <RatingStars rating={4.2} />
                                  <div className="product-description">{product.description}</div>
                                </div>
                                <div className="product-actions">
                                  <button 
                                    className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleWishlist(product.id);
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
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleAddToCart(product);
                                    }}
                                  >
                                    Add to cart
                                  </button>
                                  <button 
                                    className="quick-view-btn" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewDetail(product);
                                    }}
                                    title="Xem chi tiết"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {/* Newsletter Banner */}
          </div>
            <div className="newsletter-banner">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-7 col-md-12">
                    <div className="newsletter-content">
                      <h1 className="title">Ở nhà & nhận nhu cầu hàng ngày<br />từ cửa hàng của chúng tôi</h1>
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
                      <Image className="girl-img floating" src="/client/images/girl.png" alt="Girl" width={500} height={400} draggable={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}