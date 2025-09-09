'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import Marquee from './components/Marquee';

interface Category {
  name: string
  color: string
  icon: string
  count: number
  image_url: string
}

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
  const router = useRouter()
  const [_allProducts, setAllProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, _setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [categories, setCategories] = useState<Category[]>([]);
console.log("categories", categories)
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
        console.log('Products loaded:', productList)
        setAllProducts(productList)
        setProducts(productList)
      } catch  {
        setAllProducts([])
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // Lấy categories từ API
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data as Category[]); // Đảm bảo API trả về đúng format
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const handleAddToCart = (product: Product) => {
    // Bỏ kiểm tra đăng nhập, cho phép thao tác tự do
    router.push(`/product/${product.slug}`);
  };

  const handleViewDetail = (product: Product) => {
    // Bỏ kiểm tra đăng nhập, cho phép thao tác tự do
    router.push(`/product/${product.slug}`);
  };

  return (
    <>
      <Marquee />
      <main className="main-content" style={{ paddingTop: 0 }}>
        <div className="home-page min-vh-100 bg-light">
          {/* Banner/Hero Section */}
          <section className="hero-section-green mb-4" style={{background: '#f3f4f6', borderRadius: '0 0 32px 32px', marginTop: 0, paddingTop: 0, paddingBottom: 40}}>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-7 mb-4 mb-lg-0">
                  <div className="mb-2">
                    <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 fw-bold" style={{fontSize: '1rem'}}>100% Rau củ hữu cơ</span>
                  </div>
                  <h1 className="fw-bold display-4 mb-3" style={{lineHeight: 1.1, fontSize: '2.8rem'}}>
                    Cách tốt nhất để<br />làm đầy ví của bạn.
                  </h1>
                  <p className="lead text-secondary mb-4" style={{fontSize: '1.05rem'}}>
                    Chào mừng bạn đến với Tạp Hóa Xanh! Nơi cung cấp thực phẩm sạch, an toàn và chất lượng cho gia đình bạn.
                  </p>
                  <form className="d-flex mb-3" style={{maxWidth: 420}}>
                    <div className="position-relative flex-grow-1">
                      <span className="input-icon position-absolute top-50 start-0 translate-middle-y ms-3" style={{color: '#888'}}>
                        <i className="fa-solid fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control ps-5"
                        placeholder="Nhập email của bạn"
                        style={{
                          borderRadius: 24,
                          height: 44,
                          border: 'none',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                        }}
                      />
                    </div>
                    <button
                      className="btn fw-bold ms-2"
                      type="submit"
                      style={{
                        borderRadius: 24,
                        height: 44,
                        minWidth: 120,
                        fontWeight: 600,
                        fontSize: 17,
                        background: '#22c55e',
                        color: '#fff',
                        boxShadow: '0 2px 8px rgba(34,197,94,0.08)'
                      }}
                    >
                      Đăng ký
                    </button>
                  </form>
                </div>
                <div className="col-lg-5 text-center d-flex justify-content-end align-items-end" style={{height: '100%'}}>
                  <Image
                    src="/client/images/banner.jpg"
                    alt="Tạp Hóa Xanh"
                    width={1000}
                    height={800}
                    style={{
                      objectFit: 'contain',
                      background: 'none',
                      width: '100%',      // luôn chiếm hết chiều ngang cột
                      height: 'auto',     // tự động chiều cao
                      maxWidth: 'none',   // không giới hạn
                      maxHeight: 'none'   // không giới hạn
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Featured Categories */}
          <section className="container mb-5">
            <h2 className="fw-bold mb-4" style={{fontSize: '2rem'}}>Danh mục nổi bật</h2>
            <div className="categories-scroll d-flex flex-nowrap gap-3">
              {categories.map((cat) => (
                <div
                  className="category-card d-flex flex-column align-items-center justify-content-center py-3 px-2"
                  key={cat.name}
                  style={{
                    background: cat.color,
                    borderRadius: 16,
                    minWidth: 170,
                    minHeight: 120,
                    flex: '0 0 170px'
                  }}
                >
                  <Image src={cat.image_url} alt={cat.name} width={40} height={40} style={{objectFit: 'contain'}} />
                  <div className="fw-bold mt-2" style={{fontSize: 15}}>{cat.name}</div>
                  <div className="text-secondary small">{cat.count} sản phẩm</div>
                </div>
              ))}
            </div>
          </section>

          {/* Banner + Featured Products Section */}
          <section className="container mb-5">
            <div className="featured-banner-products d-flex align-items-stretch" style={{gap: '12px'}}>
              {/* Banner bên trái */}
              <div className="featured-banner bg-dark text-white rounded-4 p-4 d-flex flex-column justify-content-between h-100" style={{minWidth: 260, maxWidth: 320}}>
                <div>
                  <span className="badge bg-success mb-2">Khuyến mãi</span>
                  <h3 className="fw-bold mb-3" style={{fontSize: '2rem'}}>Mang thiên nhiên<br/>vào ngôi nhà bạn</h3>
                </div>
                <button className="btn btn-danger fw-bold px-4 py-2 mt-3 align-self-start" style={{borderRadius: 24, fontSize: 18}}>Mua ngay</button>
              </div>
              {/* Sản phẩm nổi bật bên phải */}
              <div className="featured-product-list d-flex flex-row align-items-stretch">
                {products.slice(0, 4).map((product, idx) => (
                  <div
                    key={product.id}
                    className="featured-product-card card border-0 shadow-sm position-relative p-3"
                  >
                    {/* Thêm ảnh sản phẩm ở đây */}
                    <div className="featured-product-image d-flex align-items-center justify-content-center mb-2">
                      <Image
                        src={product.images}
                        alt={product.name}
                        width={120}
                        height={120}
                        style={{objectFit: 'contain', width: '100%', height: '120px', background: 'transparent', mixBlendMode: 'multiply', filter: 'contrast(1.1)'}}
                      />
                    </div>
                    {/* Nhãn giảm giá */}
                    {idx === 0 && <span className="badge position-absolute top-0 start-0 m-2" style={{fontSize:13, borderRadius:8, background:'#fb923c', color:'#fff', fontWeight:600}}>Tiết kiệm 35%</span>}
                    {idx === 1 && <span className="badge position-absolute top-0 start-0 m-2" style={{fontSize:13, borderRadius:8, background:'#fb923c', color:'#fff', fontWeight:600}}>Giảm giá</span>}
                    {idx === 2 && <span className="badge position-absolute top-0 start-0 m-2" style={{fontSize:13, borderRadius:8, background:'#fb923c', color:'#fff', fontWeight:600}}>Bán chạy</span>}
                    {idx === 3 && <span className="badge position-absolute top-0 start-0 m-2" style={{fontSize:13, borderRadius:8, background:'#fb923c', color:'#fff', fontWeight:600}}>Tiết kiệm 15%</span>}
                    {/* Brand + icon sao */}
                    <div className="d-flex align-items-center mb-1">
                      <span className="text-secondary small me-2">Hodo Foods</span>
                      <span className="text-warning" style={{fontSize: 16}}>&#9733;</span>
                    </div>
                    {/* Tên sản phẩm */}
                    <h6 className="fw-bold text-dark mb-2" style={{fontSize: '1.08rem'}}>{product.name}</h6>
                    {/* Giá */}
                    <div className="mb-2">
                      <span className="fw-bold text-success me-2" style={{fontSize: 18}}>{product.price.toLocaleString()}₫</span>
                      <span className="text-muted text-decoration-line-through small">{(product.price + product.discount).toLocaleString()}₫</span>
                    </div>
                    {/* Thanh tiến trình bán */}
                    <div className="mb-2">
                      <div className="progress" style={{height: 4, borderRadius: 8}}>
                        <div className="progress-bar bg-danger" role="progressbar" style={{width: `${90/120*100}%`}} aria-valuenow={90} aria-valuemin={0} aria-valuemax={120}></div>
                      </div>
                      <div className="small text-muted mt-1">Đã bán: 90/120</div>
                    </div>
                    {/* Nút Add To Cart */}
                    <button 
                      className="btn btn-danger w-100 fw-bold mt-auto" 
                      style={{borderRadius: 24, fontSize: 18, padding: '10px 0'}}
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className="fa-solid fa-cart-plus me-2"></i> Thêm vào giỏ hàng
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Products */}
          <section className="container mb-5">
            <h2 className="fw-bold mb-4" style={{fontSize: '2rem'}}>Sản phẩm phổ biến</h2>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <div className="product-list-grid">
                {currentProducts.map((product) => (
                  <div className="custom-product-card d-flex flex-column h-100 position-relative" key={product.id}>
                    {product.discount > 0 && (
                      <span
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          background: '#fb923c',
                          color: '#fff',
                          borderRadius: 8,
                          padding: '2px 10px',
                          fontWeight: 700,
                          fontSize: 13,
                          minWidth: 0,
                          textAlign: 'center',
                          lineHeight: '18px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          letterSpacing: 0.5
                        }}
                      >
                        -{Math.round((product.discount / (product.price + product.discount)) * 100)}%
                      </span>
                    )}
                    <div className="product-image">
                      <Image
                        src={product.images}
                        alt={product.name}
                        width={140}
                        height={140}
                        style={{objectFit: 'contain', width: '100%', height: '140px', background: 'transparent', mixBlendMode: 'multiply', filter: 'contrast(1.1)'}}
                      />
                    </div>
                    <div className="product-info">
                      <div className="product-type">Đồ ăn vặt</div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-brand" style={{color: '#e11d48'}}>Bởi NestFood</div>
                      <div className="product-price">
                        <span className="price-main" style={{color: '#e11d48'}}>{product.price.toLocaleString()}₫</span>
                        <span className="price-old">{(product.price + product.discount).toLocaleString()}₫</span>
                      </div>
                      <div className="product-rating">
                        <span className="star">★</span> <span>4.0</span>
                      </div>
                    </div>
                    <div style={{ height: 18 }}></div>
                    <Link
                      href="#"
                      className="btn btn-success"
                      onClick={e => {
                        e.preventDefault();
                        handleViewDetail(product);
                      }}
                    >
                      Xem chi tiết <i className="fa fa-eye"></i>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="container mb-5">
            <div className="row g-4 home-below-banners">
              <div className="col-md-6">
                <div
                  className="double-banner-card left-banner d-flex flex-column justify-content-center align-items-start p-5"
                  style={{
                    backgroundImage: 'url(/client/images/water.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 32,
                    minHeight: 340,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span className="banner-sale">Giảm ngay 20%</span>
                  <h2 style={{
                    fontWeight: 800,
                    fontSize: '2.3rem',
                    color: '#222',
                    marginBottom: 24,
                    lineHeight: 1.1,
                    wordBreak: 'break-word'
                  }}>
                    Rau củ tươi sạch<br />100% tự nhiên
                  </h2>
                  <button style={{
                    background:'#ffc300',
                    color:'#222',
                    fontWeight:700,
                    border:'none',
                    borderRadius:10,
                    padding:'12px 32px',
                    fontSize:20,
                    boxShadow:'0 2px 8px rgba(220,53,69,0.08)'
                  }}>
                    Mua ngay
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="double-banner-card right-banner d-flex flex-column justify-content-center align-items-start p-5"
                  style={{
                    background: "#ffd43b url('/client/images/coffe.jpg') no-repeat right bottom / contain",
                    borderRadius: 32,
                    minHeight: 340,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <span style={{background:'#dc3545',color:'#fff',fontWeight:700,fontSize:22,padding:'8px 28px',borderRadius:12,marginBottom:24,display:'inline-block'}}>Giảm ngay 25%</span>
                  <h2 style={{
                    fontSize: '2.3rem',
                    color: '#222',
                    marginBottom: 24,
                    lineHeight: 1.15,
                    fontFamily: 'system-ui, Arial, Helvetica, sans-serif',
                    fontWeight: 700,
                    wordBreak: 'break-word'
                  }}>
                    <span style={{ display: 'block', fontWeight: 800 }}>Rau củ tươi sạch</span>
                    <span style={{ display: 'block', fontWeight: 400 }}>100% tự nhiên</span>
                  </h2>
                  <button style={{background:'#ffd43b',color:'#222',fontWeight:700,border:'none',borderRadius:10,padding:'12px 32px',fontSize:20,boxShadow:'0 2px 8px rgba(220,53,69,0.08)'}}>Mua ngay</button>
                </div>
              </div>
            </div>
          </section>

          {/* PHẦN SẢN PHẨM NẰM Ở ĐÂY */}
          {[0, 1, 2, 3].map(rowIdx => (
            <section className="container mb-5" key={rowIdx}>
              <div className="featured-product-list">
                {/* Banner ngoài cùng bên trái */}
                <div className="featured-product-card banner-in-grid">
                  <Image
                  width={300}
                  height={300}
                    src="/client/images/banne-milk.jpg"
                    alt="Banner"
                    className="banner-img-in-grid"
                  />
                </div>
                {/* Các sản phẩm còn lại */}
                {products.slice(rowIdx * 4, rowIdx * 4 + 4).map((product) => (
                  <div className="featured-product-card" key={product.id}>
                    <div className="featured-product-image">
                      <Image
                       width={300}
                       height={300}
                        src={product.images}
                        alt={product.name}
                        style={{objectFit: 'contain', width: '100%', height: '120px', background: 'transparent', mixBlendMode: 'multiply', filter: 'contrast(1.1)'}}
                      />
                    </div>
                    <div className="brand-row">
                      <span>Hodo Foods</span>
                      <span className="star">&#9733;</span>
                    </div>
                    <div className="product-title">{product.name}</div>
                    <div className="price-row">
                      <span className="price-main">{product.price.toLocaleString()}₫</span>
                      <span className="price-old">{(product.price + product.discount).toLocaleString()}₫</span>
                    </div>
                    <div className="progress" style={{height: 4, borderRadius: 8}}>
                      <div className="progress-bar" style={{width: `${90/120*100}%`}}></div>
                    </div>
                    <div className="sold-row">Đã bán: 90/120</div>
                    <Link href={product.slug ? `/product/${product.slug}` : '#'} passHref legacyBehavior>
                      <a
                        className="btn-featured-addcart"
                        style={{
                          background: '#22c55e',
                          color: '#fff',
                          borderRadius: 999,
                          fontWeight: 600,
                          fontSize: 16,
                          padding: '10px 0',
                          minHeight: 36,
                          width: '92%',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginTop: 'auto',
                          marginBottom: 20,
                          cursor: product.slug ? 'pointer' : 'not-allowed',
                          pointerEvents: product.slug ? 'auto' : 'none',
                          display: 'inline-block',
                          textAlign: 'center'
                        }}
                      >
                        Xem chi tiết <i className="fa fa-eye"></i>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          ))}
          {/* SECTION ĐĂNG KÝ NHẬN TIN */}
          <section className="container mb-5">
            <div className="row align-items-center p-4" style={{background: '#eaf8f3', borderRadius: 18, minHeight: 320}}>
              <div className="col-md-7 mb-4 mb-md-0">
                <h2 className="fw-bold mb-3" style={{fontSize: '2.5rem', lineHeight: 1.15}}>
                  Ở nhà & nhận mọi nhu cầu<br />hàng ngày từ cửa hàng của chúng tôi
                </h2>
                <div className="mb-3 text-secondary" style={{fontSize: '1.1rem'}}>
                  Bắt đầu mua sắm cùng <span style={{color: '#e11d48', fontWeight: 700}}>TapHoaXanh</span>
                </div>
                <form className="d-flex" style={{maxWidth: 400}}>
                  <div className="position-relative flex-grow-1">
                    <span className="input-icon position-absolute top-50 start-0 translate-middle-y ms-3" style={{color: '#888'}}>
                      <i className="fa-solid fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control ps-5"
                      placeholder="Nhập email của bạn"
                      style={{
                        borderRadius: 24,
                        height: 48,
                        border: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                      }}
                    />
                  </div>
                  <button
                    className="btn fw-bold ms-2"
                    type="submit"
                    style={{
                      borderRadius: 24,
                      height: 48,
                      minWidth: 120,
                      fontWeight: 600,
                      fontSize: 17,
                      background: '#ffd43b',
                      color: '#222',
                      boxShadow: '0 2px 8px rgba(220,53,69,0.08)'
                    }}
                  >
                    Đăng ký
                  </button>
                </form>
              </div>
              <div className="col-md-5 text-center">
                <Image
                  src="/images/girl-red-hoodie.jpg"
                  alt="Cô gái áo đỏ"
                  style={{maxWidth: '100%', height: 280, objectFit: 'contain'}}
                  width={300}
                  height={280}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
