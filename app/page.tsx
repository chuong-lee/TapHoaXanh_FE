'use client';
import React, { useState, useEffect } from "react";
import Marquee from "./components/Marquee";
import Image from "next/image";
import { Product } from "./lib/productService";
import ProductCard from "./components/ProductCard";
import LoadingSkeleton from "./components/LoadingSkeleton";

const bannerList = [
  {},
  {
    image: "/client/images/flash-banner.jpg",
    title: "Mang thiên nhiên",
    subtitle: "vào ngôi nhà của bạn",
    link: "#"
  }
];

function fixImgSrc(src: string) {
  if (!src) return "/client/images/product.png";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return src;
  if (src.startsWith("client/images/")) return "/" + src;
  return "/client/images/" + src;
}

function getCategoryImage(cat: {id: number, name: string}, idx: number) {
  // Trả về ảnh mẫu cho từng danh mục với nhiều options hơn
  const imgs = [
    "/client/images/pr-1.png",
    "/client/images/pr-2.png",
    "/client/images/pr-3.png",
    "/client/images/pr-4.png",
    "/client/images/pr-5.png",
    "/client/images/water.png",
    "/client/images/coffe.png",
    "/client/images/product.png",
    "/client/images/banner.png"
  ];
  return imgs[idx % imgs.length];
}

// Temporary mock data for testing
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Bánh quy hạt chia",
    price: 97489,
    slug: "banh-quy-hat-chia",
    images: "/client/images/product.png",
    discount: 0,
    description: "Bánh quy hạt chia thơm ngon, bổ dưỡng",
    category: "Đồ uống",
    category_id: 1,
    stock: 65,
    rating: 4.5,
    created_at: "2025-06-29T15:58:18.000Z"
  },
  {
    id: 2,
    name: "Nước cam tươi",
    price: 25000,
    slug: "nuoc-cam-tuoi",
    images: "/client/images/product-1.png",
    discount: 10,
    description: "Nước cam tươi nguyên chất",
    category: "Đồ uống",
    category_id: 1,
    stock: 30,
    rating: 4.8,
    created_at: "2025-06-29T15:58:18.000Z"
  }
];

const mockCategories = [
  { id: 1, name: "Gia vị & nguyên liệu nấu ăn", count: 2 },
  { id: 2, name: "Nông sản thực phẩm", count: 14 },
  { id: 3, name: "Thực phẩm chế biến", count: 6 },
  { id: 4, name: "Đồ uống", count: 13 }
];

export default function Home() {
  // Start with mock data, then update with real API data
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<any[]>(mockCategories);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false); // Start with false to show content immediately
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔥 Starting API calls...');
    
    // Timeout fallback to stop loading and use mock data after 3 seconds
    const timeoutId = setTimeout(() => {
      console.log('🔥 Timeout reached, using fallback data');
      if (products.length === 0) {
        // Generate more mock products for 6 rows
        const extendedMockProducts = Array.from({length: 60}, (_, i) => ({
          ...mockProducts[i % 2],
          id: i + 1,
          name: i % 2 === 0 ? `Bánh quy hạt chia ${i + 1}` : `Nước cam tươi ${i + 1}`,
          slug: i % 2 === 0 ? `banh-quy-hat-chia-${i + 1}` : `nuoc-cam-tuoi-${i + 1}`,
        }));
        setProducts(extendedMockProducts);
        setFeaturedProducts(extendedMockProducts.slice(0, 8));
        setBestSellingProducts(extendedMockProducts.slice(0, 8));
      }
      setCategories(mockCategories);
      setLoading(false);
      setCategoriesLoading(false);
      setFeaturedLoading(false);
    }, 3000);
    
         // Fetch products
     console.log('🔥 Fetching products...');
     fetch('/api/products?limit=60')
      .then(res => {
        console.log('🔥 Products response status:', res.status);
        return res.json();
      })
             .then(data => {
         console.log('🔥 Products data received:', data);
         if (data.success) {
           console.log('🔥 Setting products:', data.data.length, 'items');
           setProducts(data.data || []);
           clearTimeout(timeoutId); // Clear timeout on success
         }
         setLoading(false);
       })
      .catch(err => {
        console.error('🔥 Products fetch error:', err);
        setError(err.message);
        setLoading(false);
      });

    // Fetch categories
    fetch('/api/category?withCount=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCategories(data.data || []);
        }
        setCategoriesLoading(false);
      })
      .catch(err => {
        console.error('Categories error:', err);
        setCategoriesLoading(false);
      });

    // Fetch featured products
    fetch('/api/products/featured?limit=8')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeaturedProducts(data.data || []);
        }
        setFeaturedLoading(false);
      })
      .catch(err => {
        console.error('Featured products error:', err);
        setFeaturedLoading(false);
      });

         // Fetch best selling products
     fetch('/api/products/best-selling?limit=8')
       .then(res => res.json())
       .then(data => {
         if (data.success) {
           setBestSellingProducts(data.data || []);
         }
       })
       .catch(err => {
         console.error('Best selling products error:', err);
       });

    // Cleanup timeout on unmount
    return () => clearTimeout(timeoutId);
  }, []);


  // Error handling hiển thị
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Lỗi tải dữ liệu!</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger" 
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: Product) => {
    // Navigate to product detail page
    window.location.href = `/product/${product.slug || product.id}`;
  };

  return (
    <div>
      <Marquee />
      <section>
        <div className="home">
          <div className="hero-subscribe-section">
            <div className="container">
              <div className="row align-items-center hero-subscribe-section-lg">
                <div className="col-lg-7 col-md-12 mb-4 mb-lg-0">
                  <div className="text-label mb-2"><span className="text-danger fw-bold">100%</span> Rau củ hữu cơ</div>
                  <h1 className="hero-title mb-3">Cách tốt nhất để<br />tiết kiệm cho ví của bạn.</h1>
                  <p className="text-muted mb-4">Mua sắm thông minh với Tạp Hoá Xanh - nơi cung cấp thực phẩm tươi ngon, chất lượng cao với giá cả phải chăng nhất thị trường.</p>
                  <form className="d-flex align-items-center gap-2 hero-subscribe-form">
                    <div className="input-group rounded-pill bg-white shadow-sm overflow-hidden"><span className="input-group-text bg-white border-0"><i className="fa fa-envelope text-muted" /></span>
                      <input className="form-control border-0" type="email" placeholder="Địa chỉ email của bạn" />
                    </div>
                    <button className="btn btn-success rounded-pill px-4">Đăng ký</button>
                  </form>
                </div>
                <div className="col-lg-5 col-md-12 text-center position-relative">
                  <div className="hero-tags d-flex justify-content-center gap-2 mb-4 flex-wrap">
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-success border border-success hvr-float"><i className="fa fa-times-circle text-muted me-1" />Mua sắm
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-muted border hvr-float"><i className="fa fa-times-circle text-muted me-1" />Công thức
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-success border border-success hvr-float"><i className="fa fa-times-circle text-muted me-1" />Bếp núc
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-muted border hvr-float"><i className="fa fa-times-circle text-muted me-1" />Tin tức
                    </button>
                    <button className="btn hero-tag badge px-3 py-2 fs-6 rounded-pill shadow-sm hvr-float bg-white text-success border border-success hvr-float"><i className="fa fa-times-circle text-muted me-1" />Thực phẩm
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-subscribe"><img className="hero-lettuce" src="client/images/banner.png" /></div><img className="hero-decor1 floating" src="client/images/decor4.png" alt="decor" /><img className="hero-decor2 floating" src="client/images/decor2.png" alt="decor" /><img className="hero-decor3 floating" src="client/images/decor3.png" alt="decor" /><img className="hero-decor4 floating" src="client/images/decor1.png" alt="decor" />
          </div>
          <div className="container">
            <div className="section-featured-categories">
              <div className="featured-categories-header">
                <h2 className="featured-categories-title">Danh mục sản phẩm  </h2>
                <div className="featured-categories-tabs"><span className="tab-item active">Bánh &amp; Sữa</span><span className="tab-item">Cà phê &amp; Trà</span><span className="tab-item">Thức ăn thú cưng</span><span className="tab-item">Rau củ</span></div>
                <div className="featured-categories-nav">
                  <button className="nav-btn left"><i className="icon-arrow-left" /></button>
                  <button className="nav-btn right"><i className="icon-arrow-right" /></button>
                </div>
              </div>
              <div className="featured-categories-list">
                {categoriesLoading ? (
                  <LoadingSkeleton />
                ) : categories && categories.length > 0 ? (
                  categories.map((cat, idx) => {
                    const bgColors = ['bg-yellow', 'bg-orange', 'bg-green', 'bg-pink', 'bg-purple'];
                    const bgClass = bgColors[idx % bgColors.length];
                    return (
                      <div className={`featured-category-item ${bgClass}`} key={cat.id}>
                    <Image src={getCategoryImage(cat, idx)} alt={cat.name} width={80} height={80} />
                    <div className="category-name">{cat.name}</div>
                        <div className="category-count">{cat.count ? `${cat.count} sản phẩm` : 'Đang cập nhật...'}</div>
                  </div>
                    );
                  })
                ) : (
                  <div className="text-center">Không có danh mục nào</div>
                )}
              </div>
            </div>
            <div className="flash-sale-row my-1">
              <div className="container">
                <div className="row g-4 align-items-stretch">
                  {/* Banner trái động từ API hoặc fallback */}
                  <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                    <div className="flash-sale-banner bg-dark text-white rounded-4 p-4 h-100 d-flex flex-column justify-content-center align-items-start">
                      <Image
                        className="mb-4 rounded-3"
                        src={bannerList && bannerList[1] && bannerList[1].image ? fixImgSrc(bannerList[1].image) : '/client/images/flash-banner.jpg'}
                        alt={bannerList && bannerList[1] && bannerList[1].title ? bannerList[1].title : 'Banner'}
                        width={260}
                        height={180}
                        style={{width: '100%', maxWidth: 260, height: 'auto', objectFit: 'cover'}}
                      />
                      <h2 className="fw-bold mb-3">{bannerList && bannerList[1] && bannerList[1].title ? bannerList[1].title : 'Mang thiên nhiên'}<br />{bannerList && bannerList[1] && bannerList[1].subtitle ? bannerList[1].subtitle : 'vào ngôi nhà của bạn'}</h2>
                      <a className="btn btn-danger rounded-pill px-4 py-2 mt-3" href={bannerList && bannerList[1] && bannerList[1].link ? bannerList[1].link : '#'}>Mua ngay →</a>
                    </div>
                  </div>
                  {/* Slider phải động từ API */}
                  <div className="col-lg-9">
                    <div className="flash-sale-slider position-relative">
                      {/* Nút điều hướng trái/phải */}
                      <button className="slick-prev custom-arrow" type="button"><i className="fa fa-chevron-left" /></button>
                      <button className="slick-next custom-arrow" type="button"><i className="fa fa-chevron-right" /></button>
                      {/* Danh sách sản phẩm featured */}
                      <div className="flash-sale-track">
                        {featuredLoading ? (
                          <div className="row">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="col-md-3">
                                <LoadingSkeleton />
                              </div>
                            ))}
                          </div>
                        ) : featuredProducts && featuredProducts.length > 0 ? (
                          <div className="row">
                            {featuredProducts.slice(0, 4).map((product) => (
                              <div key={product.id} className="col-md-3">
                                <ProductCard 
                                  product={product}
                                  onAddToCart={handleAddToCart}
                                  showBadge={true}
                                  badgeText="Nổi bật"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p>Không có sản phẩm nổi bật nào</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="products w-100 my-1">
              <div className="d-flex justify-content-lg-between align-items-center align-items-center flex-wrap justify-content-center">
                <h2>Sản phẩm phổ biến</h2>
              </div>
              <div className="product-list">
                <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                  {loading ? (
                    // Loading skeleton
                    [1,2,3,4,5,6,7,8,9,10].map(i => (
                      <div className="col" key={i}>
                        <LoadingSkeleton />
                      </div>
                    ))
                  ) : products && products.length > 0 ? (
                    products.slice(0, 10).map((product) => (
                    <div className="col" key={product.id}>
                        <ProductCard 
                          product={product}
                          onAddToCart={handleAddToCart}
                          showBadge={true}
                          badgeText="Phổ biến"
                        />
                      </div>
                    ))
                  ) : !loading ? (
                    <div className="col-12 text-center py-5">
                      <p>Không có sản phẩm nào để hiển thị (Products: {products.length})</p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                      >
                        Tải lại
                      </button>
                    </div>
                  ) : null}
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
                        <div className="promo-title my-3">Rau củ tươi ngon<br />hoàn toàn sạch</div><a className="promo-btn" href="#">Mua ngay</a>
                      </div>
                      <div className="promo-image"><img className="img-pr" src="./client/images/water.png" alt="Water Bottle" /></div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="promo-banner bg-yellow">
                      <div className="promo-conten-b">
                        <div className="promo-badge">Giảm giá 25%</div>
                        <div className="promo-title my-3">Trái cây tươi<br />chất lượng cao</div><a className="promo-btn" href="#">Mua ngay</a>
                      </div>
                      <div className="promo-image"><img className="img-pr" src="./client/images/coffe.png" alt="Coffee Beans" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section-best-sells">
              
              <div className="row g-3 my-2">
                {/* Banner chỉ hiển thị trên desktop */}
                <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay="0.1s" data-wow-duration="0.5s">
                  <div className="promo-banner">
                    <Image className="img-fluid rounded" src="/client/images/banner-1.png" alt="Banner" width={180} height={418} style={{height:418, width:'100%', objectFit:'cover'}} />
                  </div>
                </div>
                {/* Tên danh mục thay thế banner khi ở tablet/mobile */}
                <div className="col-12 d-block d-lg-none mb-2">
                    <h5 className="fw-bold text-success">Sản phẩm bán chạy</h5>
                </div>    
                  <div className="col-12 col-lg-10">
                    <div className="row">
                          {loading ? (
                            [1,2,3,4].map(i => (
                              <div className="col-12 col-md-6 col-lg-3 padd" key={i}>
                                <LoadingSkeleton />
                              </div>
                            ))
                          ) : bestSellingProducts && bestSellingProducts.length > 0 ? (
                            bestSellingProducts.slice(0, 4).map((product) => (
                        <div className="col-12 col-md-6 col-lg-3 padd hvr-float" key={product.id}>
                                <ProductCard 
                                  product={product}
                                  onAddToCart={handleAddToCart}
                                  showBadge={true}
                                  badgeText="Bán chạy"
                                  layout="default"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="col-12 text-center">
                              <p>Không có sản phẩm bán chạy nào</p>
                            </div>
                          )}
                          </div>
                        </div>
                
                                </div>

          {/* Row 4: Sản phẩm cao cấp */}
          <div className="section-premium my-4">
            <div className="row g-3 my-2">
              {/* Banner chỉ hiển thị trên desktop */}
              <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay="0.1s" data-wow-duration="0.5s">
                <div className="promo-banner">
                  <Image className="img-fluid rounded" src="/client/images/banner-1.png" alt="Banner Cao Cấp" width={180} height={418} style={{height:418, width:'100%', objectFit:'cover'}} />
                                </div>
                              </div>
              {/* Tên danh mục thay thế banner khi ở tablet/mobile */}
              <div className="col-12 d-block d-lg-none mb-2">
                  <h5 className="fw-bold text-success">Sản phẩm cao cấp</h5>
              </div>    
                <div className="col-12 col-lg-10">
                  <div className="row">
                        {loading ? (
                          [1,2,3,4].map(i => (
                            <div className="col-12 col-md-6 col-lg-3 padd" key={i}>
                              <LoadingSkeleton />
                            </div>
                          ))
                        ) : products && products.length > 30 ? (
                          products.slice(30, 34).map((product) => (
                          <div className="col-12 col-md-6 col-lg-3 padd hvr-float" key={product.id}>
                              <ProductCard 
                                product={product}
                                onAddToCart={handleAddToCart}
                                showBadge={true}
                                badgeText="Cao cấp"
                                layout="default"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center">
                            <p>Không có sản phẩm cao cấp nào</p>
                          </div>
                        )}
                        </div>
                  </div>
            </div>
          </div>

          {/* Row 5: Sản phẩm hữu cơ */}
          <div className="section-organic my-4">
            <div className="row g-3 my-2">
              {/* Banner chỉ hiển thị trên desktop */}
              <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay="0.1s" data-wow-duration="0.5s">
                <div className="promo-banner">
                  <Image className="img-fluid rounded" src="/client/images/banner-1.png" alt="Banner Hữu Cơ" width={180} height={418} style={{height:418, width:'100%', objectFit:'cover'}} />
                </div>
              </div>
              {/* Tên danh mục thay thế banner khi ở tablet/mobile */}
              <div className="col-12 d-block d-lg-none mb-2">
                  <h5 className="fw-bold text-success">Sản phẩm hữu cơ</h5>
              </div>    
                <div className="col-12 col-lg-10">
                  <div className="row">
                        {loading ? (
                          [1,2,3,4].map(i => (
                            <div className="col-12 col-md-6 col-lg-3 padd" key={i}>
                              <LoadingSkeleton />
                            </div>
                          ))
                        ) : products && products.length > 40 ? (
                          products.slice(40, 44).map((product) => (
                          <div className="col-12 col-md-6 col-lg-3 padd hvr-float" key={product.id}>
                              <ProductCard 
                                product={product}
                                onAddToCart={handleAddToCart}
                                showBadge={true}
                                badgeText="Hữu cơ"
                                layout="default"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center">
                            <p>Không có sản phẩm hữu cơ nào</p>
                          </div>
                        )}
                        </div>
                  </div>
            </div>
          </div>

          {/* Row 6: Sản phẩm đặc biệt */}
          <div className="section-special my-4">
            <div className="row g-3 my-2">
              {/* Banner chỉ hiển thị trên desktop */}
              <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay="0.1s" data-wow-duration="0.5s">
                <div className="promo-banner">
                  <Image className="img-fluid rounded" src="/client/images/banner-1.png" alt="Banner Đặc Biệt" width={180} height={418} style={{height:418, width:'100%', objectFit:'cover'}} />
                </div>
              </div>
              {/* Tên danh mục thay thế banner khi ở tablet/mobile */}
              <div className="col-12 d-block d-lg-none mb-2">
                  <h5 className="fw-bold text-success">Sản phẩm đặc biệt</h5>
              </div>    
                <div className="col-12 col-lg-10">
                  <div className="row">
                        {loading ? (
                          [1,2,3,4].map(i => (
                            <div className="col-12 col-md-6 col-lg-3 padd" key={i}>
                              <LoadingSkeleton />
                            </div>
                          ))
                        ) : products && products.length > 50 ? (
                          products.slice(50, 54).map((product) => (
                          <div className="col-12 col-md-6 col-lg-3 padd hvr-float" key={product.id}>
                              <ProductCard 
                                product={product}
                                onAddToCart={handleAddToCart}
                                showBadge={true}
                                badgeText="Đặc biệt"
                                layout="default"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-12 text-center">
                            <p>Không có sản phẩm đặc biệt nào</p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
          </div>


          <div className="newsletter-banner">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="newsletter-content">
                    <h1 className="title">Ở nhà &amp; nhận nhu cầu hàng ngày<br />từ cửa hàng của chúng tôi</h1>
                    <p className="subtitle">Mua sắm thông minh với <span className="brand">Tạp Hoá Xanh</span></p>
                    <form className="newsletter-form">
                      <div className="input-group"><span className="input-icon"><i className="fa fa-envelope" /></span>
                        <input className="form-control" type="email" placeholder="Địa chỉ email của bạn" />
                        <button className="btn-subscribe" type="submit">Đăng ký</button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="newsletter-image position-relative"><img className="girl-img floating" src="client/images/girl.png" alt="Girl" draggable="false" /></div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}