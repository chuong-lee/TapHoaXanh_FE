"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

import api from "@/lib/axios";
import Marquee from "./components/Marquee";
import { useAuth } from "./context/AuthContext";

interface Category {
  name: string;
  color: string;
  icon: string;
  count: number;
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string;
  discount: number;
  description: string;
  category?: string;
}

export default function HomePage() {
  const router = useRouter();
  const { profile } = useAuth();
  
  // State management
  const [_allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, _setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Constants
  const itemsPerPage = 20;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/products");
        const data: unknown = res.data;
        let productList: Product[] = [];
        if (Array.isArray(data)) {
          productList = data as Product[];
        } else if (
          typeof data === "object" &&
          data !== null &&
          Array.isArray((data as { products?: unknown }).products)
        ) {
          productList = (data as { products: Product[] }).products;
        } else {
          console.error("❌ Dữ liệu sản phẩm không hợp lệ:", data);
        }
        setAllProducts(productList);
        setProducts(productList);
      } catch {
        setAllProducts([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Lấy categories từ API
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data as Category[]); // Đảm bảo API trả về đúng format
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handleViewDetail = (product: Product) => {
    // Bỏ kiểm tra đăng nhập, cho phép thao tác tự do
    router.push(`/product/${product.slug}`);
  };

  const handleWishList = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: number,
    productName: string
  ) => {
    e.preventDefault();
    try {
      await api.post("wishlist", { productId });
      toast.success(`Đã thêm "${productName}" vào sản phẩm yêu thích!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.log("Lỗi", error);
      toast.error("Có lỗi xảy ra khi thêm vào sản phẩm yêu thích!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <>
      <div className="home">
          {/* Promotional Banners */}
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

          {/* Featured Categories */}
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
                {categories.slice(0, 10).map((cat, index) => (
                  <div
                    className={`featured-category-item bg-${['yellow', 'orange', 'green', 'pink', 'yellow', 'purple', 'green', 'pink', 'yellow', 'pink'][index % 10]}`}
                  key={cat.name}
                  >
                    <Image
                      src={cat.image_url || `/client/images/product-${index}.png`}
                    alt={cat.name}
                      width={60}
                      height={60}
                    style={{ objectFit: "contain" }}
                    />
                    <div className="category-name">{cat.name}</div>
                    <div className="category-count">{cat.count} sản phẩm</div>
                  </div>
                ))}
                  </div>
                </div>
            </div>

          {/* Flash Sale Section */}
          <div className="flash-sale-section">
            <div className="container">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">Flash Sale</h2>
                <p className="section-subtitle">Limited time offers - Don't miss out!</p>
                </div>
              <div className="row g-4">
                {/* Banner trái */}
                <div className="col-lg-3 col-md-12">
                  <div className="promo-card">
                    <div className="promo-image">
                      <Image src="/client/images/flash-banner.jpg" alt="Flash Sale Banner" width={300} height={200} />
                    </div>
                    <div className="promo-content">
                      <div className="promo-badge">-50% OFF</div>
                      <h3 className="promo-title">Fresh Organic Products</h3>
                      <p className="promo-desc">Limited time offer on selected items</p>
                      <div className="countdown-timer">
                        <div className="timer-item">
                          <span className="number">02</span>
                          <span className="label">Days</span>
                        </div>
                        <div className="timer-item">
                          <span className="number">18</span>
                          <span className="label">Hours</span>
                        </div>
                        <div className="timer-item">
                          <span className="number">45</span>
                          <span className="label">Min</span>
                        </div>
                      </div>
                      <button className="btn btn-primary shop-now-btn">Shop Now</button>
                    </div>
                  </div>
                </div>
                {/* Sản phẩm flash sale slider */}
                <div className="col-lg-9">
                  <div className="flash-sale-slider">
                    {/* Navigation arrows */}
                    <button className="slider-nav prev-btn" type="button" aria-label="Previous slide">
                      <i className="fas fa-chevron-left"></i>
                </button>
                    <button className="slider-nav next-btn" type="button" aria-label="Next slide">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                    {/* Slider container */}
                    <div className="slider-container">
                      <div className="slider-track">
                        {products.slice(0, 8).map((product, idx) => (
                          <div className="slider-item" key={product.id}>
                            <div className="flash-product-card">
                              <div className="product-badge">
                                {idx === 0 ? 'Hot' : idx === 1 ? 'New' : idx === 2 ? 'Sale' : 'Hot'}
              </div>
                              <div className="discount-badge">
                                {Math.round(product.discount)}%
                              </div>
                              <div className="product-image">
                      <Image
                        src={product.images}
                        alt={product.name}
                                  width={200}
                                  height={200}
                                  style={{ objectFit: "contain" }}
                                />
                                <div className="quick-view-overlay">
                                  <button className="quick-view-btn">
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
                                  <span className="current-price">
                                    {(product.price * (1 - product.discount / 100)).toLocaleString()} VNĐ
                      </span>
                                  <span className="old-price">
                        {product.price.toLocaleString()} VNĐ
                      </span>
                    </div>
                                <div className="product-actions">
                                  <button className="add-to-cart-btn">
                                    <i className="fas fa-shopping-cart"></i>
                                    <span>Add to Cart</span>
                                  </button>
                                  <button 
                                    className="wishlist-btn"
                                    onClick={(e) => handleWishList(e, product.id, product.name)}
                                  >
                                    <i className="far fa-heart"></i>
                                  </button>
                      </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                    {/* Dots navigation */}
                    <div className="slider-dots">
                      <button className="dot-btn active" aria-label="Go to slide 1"></button>
                      <button className="dot-btn" aria-label="Go to slide 2"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fresh Products */}
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
            {loading ? (
                      <div className="col-12 text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
              </div>
            ) : (
                      currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image 
                                  className="product-image" 
                                  src={product.images || "images/thailan.jpeg"} 
                                  alt="Product" 
                                  title="Product"
                                  width={200}
                                  height={200}
                                />
                              </div>
                              <div className="product-info">
                                <div className="product-category">Dairy Bread</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">
                                  {(product.price * (1 - product.discount / 100)).toLocaleString()} VNĐ
                                </div>
                                <div className="product-description">
                                  Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.
                                </div>
                              </div>
                              <div className="product-actions">
                                <button 
                                  className="wishlist-btn"
                                  onClick={(e) => handleWishList(e, product.id, product.name)}
                                >
                                  <i className="fas fa-heart"></i>
                                </button>
                                <button 
                                  className="add-to-cart-btn"
                                  onClick={() => handleViewDetail(product)}
                                >
                                  Add to cart
                                </button>
                                <button 
                                  className="quick-view-btn"
                                  onClick={() => handleViewDetail(product)}
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
              <div className="tab-pane fade" id="fruits-tab-pane" role="tabpanel" aria-labelledby="fruits-tab" tabIndex={0}> 
                <div className="product-list">
                  <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                    {loading ? (
                      <div className="col-12 text-center py-5">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
                      </div>
                    ) : (
                      currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                      <Image
                                  className="product-image" 
                        src={product.images || "images/thailan.jpeg"}
                                  alt="Product" 
                                  title="Product"
                                  width={200}
                                  height={200}
                      />
                    </div>
                    <div className="product-info">
                                <div className="product-category">Dairy Bread</div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">
                                  {(product.price * (1 - product.discount / 100)).toLocaleString()} VNĐ
                      </div>
                                <div className="product-description">
                                  Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.
                        </div>
                              </div>
                              <div className="product-actions">
                                <button 
                                  className="wishlist-btn"
                                  onClick={(e) => handleWishList(e, product.id, product.name)}
                                >
                                  <i className="fas fa-heart"></i>
                                </button>
                                <button 
                                  className="add-to-cart-btn"
                                  onClick={() => handleViewDetail(product)}
                                >
                                  Add to cart
                                </button>
                                <button 
                                  className="quick-view-btn"
                                  onClick={() => handleViewDetail(product)}
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
              <div className="tab-pane fade" id="tubers-tab-pane" role="tabpanel" aria-labelledby="tubers-tab" tabIndex={0}> 
                <div className="product-list">
                  <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                    {loading ? (
                      <div className="col-12 text-center py-5">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
                      </div>
                    ) : (
                      currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image 
                                  className="product-image" 
                                  src={product.images || "images/thailan.jpeg"} 
                                  alt="Product" 
                                  title="Product"
                                  width={200}
                                  height={200}
                                />
                      </div>
                              <div className="product-info">
                                <div className="product-category">Dairy Bread</div>
                                <div className="product-name">{product.name}</div>
                      <div className="product-price">
                                  {(product.price * (1 - product.discount / 100)).toLocaleString()} VNĐ
                    </div>
                                <div className="product-description">
                                  Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.
                        </div>
                              </div>
                              <div className="product-actions">
                                <button 
                                  className="wishlist-btn"
                                  onClick={(e) => handleWishList(e, product.id, product.name)}
                                >
                                  <i className="fas fa-heart"></i>
                                </button>
                                <button 
                                  className="add-to-cart-btn"
                                  onClick={() => handleViewDetail(product)}
                                >
                                  Add to cart
                                </button>
                                <button 
                                  className="quick-view-btn"
                                  onClick={() => handleViewDetail(product)}
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
              <div className="tab-pane fade" id="dairy-tab-pane" role="tabpanel" aria-labelledby="dairy-tab" tabIndex={0}>
                <div className="product-list">
                  <div className="row row-cols-2 row-cols-lg-5 g-3 g-lg-3 mt-2">
                    {loading ? (
                      <div className="col-12 text-center py-5">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">Đang tải...</span>
                        </div>
                        <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
                      </div>
                    ) : (
                      currentProducts.map((product, index) => (
                        <div className="col" key={product.id}>
                          <div className="p-lg-0 hvr-float wow fadeInLeft" data-wow-delay={`${index * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-card">
                              <div className="product-image-container">
                                <Image 
                                  className="product-image" 
                                  src={product.images || "images/thailan.jpeg"} 
                                  alt="Product" 
                                  title="Product"
                                  width={200}
                                  height={200}
                                />
                      </div>
                              <div className="product-info">
                                <div className="product-category">Dairy Bread</div>
                                <div className="product-name">{product.name}</div>
                                <div className="product-price">
                                  {(product.price * (1 - product.discount / 100)).toLocaleString()} VNĐ
                    </div>
                                <div className="product-description">
                                  Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.
                                </div>
                              </div>
                              <div className="product-actions">
                                <button 
                                  className="wishlist-btn"
                                  onClick={(e) => handleWishList(e, product.id, product.name)}
                                >
                                  <i className="fas fa-heart"></i>
                                </button>
                                <button 
                                  className="add-to-cart-btn"
                                  onClick={() => handleViewDetail(product)}
                                >
                                  Add to cart
                                </button>
                  <button
                                  className="quick-view-btn"
                                  onClick={() => handleViewDetail(product)}
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
                      <div className="promo-title my-3">Rau củ tươi ngon<br/>hoàn toàn sạch</div>
                      <button 
                        className="promo-btn" 
                    onClick={() => router.push("/product")}
                  >
                    Mua ngay
                  </button>
                </div>
                    <div className="promo-image">
                      <Image 
                        className="img-pr" 
                        src="/client/images/water.png" 
                        alt="Water Bottle"
                        width={200}
                        height={200}
                      />
              </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="promo-banner bg-yellow">
                    <div className="promo-conten-b">
                      <div className="promo-badge">Giảm giá 25%</div>
                      <div className="promo-title my-3">Trái cây tươi<br/>chất lượng cao</div>
                  <button
                        className="promo-btn" 
                    onClick={() => router.push("/product")}
                  >
                    Mua ngay
                  </button>
                </div>
                    <div className="promo-image">
                      <Image 
                        className="img-pr" 
                        src="/client/images/coffe.png" 
                        alt="Coffee Beans"
                        width={200}
                        height={200}
                      />
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Sells Section */}
          <div className="section-best-sells">
            {[0, 1, 2, 3, 4].map((rowIdx) => (
              <div className="row g-3 my-2" key={rowIdx}>
                {/* Banner chỉ hiển thị trên desktop */}
                <div className="col-lg-2 d-none d-lg-block h-100 wow fadeInLeft" data-wow-delay={`${(rowIdx + 1) * 0.1}s`} data-wow-duration="0.5s">
                  <div className="promo-banner">
                  <Image
                      className="img-fluid rounded" 
                      src={`/client/images/banner-${rowIdx + 1}.png`} 
                      alt={`Banner ${rowIdx + 1}`}
                      width={200}
                      height={418}
                      style={{ height: 418 }}
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
                    {products.slice(rowIdx * 4, rowIdx * 4 + 4).map((product, productIdx) => (
                      <div className="col-12 col-md-4 col-lg-3 padd hvr-float" key={product.id}>
                        <div className="product-list">
                          <div className="product-card wow fadeInLeft" data-wow-delay={`${productIdx * 0.1}s`} data-wow-duration="0.5s">
                            <div className="product-image-container">
                      <Image
                                className="product-image" 
                                src={product.images || `/client/images/pr-${(productIdx % 4) + 1}.png`} 
                        alt={product.name}
                                title={product.name}
                                width={200}
                                height={200}
                      />
                    </div>
                            <div className="product-info">
                              <div className="product-category">Dairy Bread</div>
                              <div className="product-name">{product.name}</div>
                              <div className="product-price">
                                {(product.price * (1 - product.discount / 100)).toLocaleString()} VNĐ
                              </div>
                              <div className="product-description">
                                Khăn giấy Tempo là thương hiệu khăn giấy nhiều khách hàng tin tưởng và sử dụng bởi nhiều công năng vượt trội như mềm mịn an toàn cho da hay độ dày ổn định. Khăn giấy ăn Tempo hương bạc hà 4 lớp 10 gói x 10 tờ dai và thấm hút tốt, lau mặt lau tay, nhỏ gọn dễ cầm theo.
                    </div>
                    </div>
                            <div className="product-actions">
                              <button 
                                className="wishlist-btn"
                                onClick={(e) => handleWishList(e, product.id, product.name)}
                              >
                                <i className="fas fa-heart"></i>
                              </button>
                              <button 
                                className="add-to-cart-btn"
                                onClick={() => handleViewDetail(product)}
                              >
                                Add to cart
                              </button>
                              <button 
                                className="quick-view-btn"
                                onClick={() => handleViewDetail(product)}
                              >
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
          {/* Newsletter Banner */}
          <div className="newsletter-banner">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-7 col-md-12">
                  <div className="newsletter-content">
                    <h1 className="title">Ở nhà & nhận nhu cầu hàng ngày<br/>từ cửa hàng của chúng tôi</h1>
                    <p className="subtitle">Mua sắm thông minh với <span className="brand">Tạp Hoá Xanh</span></p>
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
                    <Image 
                      className="girl-img floating" 
                      src="/client/images/girl.png" 
                      alt="Girl" 
                      draggable={false}
                      width={300}
                      height={300}
                    />
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
