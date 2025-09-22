"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";
import SidebarFilter from "@/components/SidebarFilter";

type Product = {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string;
  discount: number;
  description: string;
  brand?: string;
  rating?: number;
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
};

export default function ProductListPage() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(1000000);

  // State cho show và sort
  const [show, setShow] = useState(12);
  const [sort, setSort] = useState("price-asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/products");
        const productsData = Array.isArray(res.data) ? res.data : [];
        console.log("Products data:", productsData); // Debug log
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Xử lý lọc theo danh mục
  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    filterProducts(categoryId, maxPrice);
  };

  // Lọc sản phẩm theo danh mục và giá
  const filterProducts = (categoryId: number | null, price: number) => {
    let filtered = products;
    if (categoryId !== null) {
      filtered = filtered.filter(
        (product) =>
          product.category?.id === categoryId ||
          product.categoryId === categoryId
      );
    }
    filtered = filtered.filter((product) => product.price <= price);
    setFilteredProducts(filtered);
  };

  // Xử lý lọc theo giá
  const handlePriceChange = (price: number) => {
    setMaxPrice(price);
    filterProducts(selectedCategory, price);
  };

  // Hàm sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  // Lấy tên danh mục đang được chọn
  const getSelectedCategoryName = () => {
    if (!selectedCategory) return null;
    const product = products.find(
      (p) =>
        p.category?.id === selectedCategory || p.categoryId === selectedCategory
    );
    return product?.category?.name || "Đang tải...";
  };

  return (
    <section>
      <div className="product-page">
        <div className="container my-4">
        <div className="row">
            {/* Left Sidebar */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="sidebar">
                {/* Categories Filter */}
                <div className="filter-group mb-4">
                  <h3 className="filter-title text-success">Categories</h3>
                  <ul className="filter-list list-unstyled">
                    <li className="mb-2">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="dairy"
                          checked={selectedCategory === 1}
                          onChange={() => handleCategoryChange(selectedCategory === 1 ? null : 1)}
                        />
                        <label className="form-check-label" htmlFor="dairy">Dairy Bread</label>
                      </div>
                    </li>
                    <li className="mb-2">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="fruits"
                          checked={selectedCategory === 2}
                          onChange={() => handleCategoryChange(selectedCategory === 2 ? null : 2)}
                        />
                        <label className="form-check-label" htmlFor="fruits">Fresh fruits</label>
                      </div>
                    </li>
                    <li className="mb-2">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="tubers"
                          checked={selectedCategory === 3}
                          onChange={() => handleCategoryChange(selectedCategory === 3 ? null : 3)}
                        />
                        <label className="form-check-label" htmlFor="tubers">Fresh tubers</label>
                      </div>
                    </li>
                    <li className="mb-2">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="vegetables"
                          checked={selectedCategory === 4}
                          onChange={() => handleCategoryChange(selectedCategory === 4 ? null : 4)}
                        />
                        <label className="form-check-label" htmlFor="vegetables">Vegetables</label>
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* Price Filter */}
                <div className="filter-group mb-4">
                  <h3 className="filter-title text-success">Price</h3>
                  <div className="price-range mb-2">
                    <span>Range $28.00 - $79.00</span>
                  </div>
                  <div className="price-slider">
                    <input 
                      className="form-range price-min" 
                      type="range" 
                      min="28" 
                      max="79" 
                      value={Math.min(79, Math.max(28, maxPrice / 1000))}
                      onChange={(e) => handlePriceChange(Number(e.target.value) * 1000)}
            />
          </div>
                </div>
                
                {/* Best Sellers Section */}
                <div className="filter-group mb-4">
                  <h3 className="filter-title text-success">Best Sellers</h3>
                  <div className="best-sellers">
                    {products.slice(0, 3).map((product, index) => (
                      <div key={product.id} className="best-seller-item d-flex align-items-center mb-3">
                        <img 
                          className="me-3" 
                          src={product.images || "/client/images/product-1.png"} 
                          alt={product.name} 
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                        <div className="best-seller-info">
                          <div className="category text-muted small">
                            {product.category?.name || "Fresh Fruits"}
                          </div>
                          <div className="title fw-bold">{product.name}</div>
                          <div className="price">
                            {product.discount > 0 ? (
                              <>
                                <span className="text-muted text-decoration-line-through">
                                  ${(product.price / 1000).toFixed(2)}
                                </span>
                                <span className="ms-2">
                                  ${((product.price * (1 - product.discount / 100)) / 1000).toFixed(2)}
                    </span>
                  </>
                ) : (
                              `$${(product.price / 1000).toFixed(2)}`
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Sidebar Banner */}
                <div className="sidebar-banner">
                  <img 
                    className="img-fluid" 
                    src="/client/images/banner-1.png" 
                    alt="Organic Shop Banner"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-lg-9">
              {/* Header Controls */}
              <div className="content-header d-flex justify-content-between align-items-center mb-4">
                <div className="results-info">
                  <span>Showing {Math.min(show, sortedProducts.length)} results</span>
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
                    <option value="price-asc">Sorting: Price Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              {loading ? (
              <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
                </div>
              ) : !loading && filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: "3rem", color: "#ccc", marginBottom: 16 }}>
                  📦
                </div>
                <h4 className="text-muted mb-3">
                  {selectedCategory
                    ? "Không có sản phẩm nào trong danh mục này"
                    : "Không có sản phẩm nào"}
                </h4>
                <p className="text-muted">
                  Vui lòng thử chọn danh mục khác hoặc quay lại sau.
                </p>
                </div>
              ) : (
                <div className="row g-3 g-lg-4">
                  {sortedProducts.slice(0, show).map((product, index) => (
                    <div key={product.id} className="col-12 col-md-4 col-lg-4">
                      <div className="hvr-float wow fadeInLeft" data-wow-delay={`${(index + 1) * 0.1}s`} data-wow-duration="0.5s">
                        <div className="product-card">
                          <div className="product-image-wrapper">
                            <img 
                              className="product-image" 
                              src={product.images || "/client/images/product-1.png"} 
                              alt={product.name} 
                              title={product.name}
                            />
                            <div className="product-overlay">
                              <div className="overlay-actions">
                                <button className="quick-view-btn">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="wishlist-btn">
                                  <i className="fas fa-heart"></i>
                                </button>
                              </div>
                            </div>
                            <div className="product-badge">
                              {product.discount > 0 ? (
                                <div className="badge badge-sale">Sale</div>
                              ) : (
                                <div className="badge badge-new">New</div>
                              )}
                            </div>
                          </div>
                          <div className="product-content">
                            <div className="product-category">
                              {product.category?.name?.toUpperCase() || "FRESH FRUITS"}
                            </div>
                            <div className="product-title">{product.name}</div>
                            <div className="product-price">
                              <div className="current-price">
                                ${((product.price * (1 - product.discount / 100)) / 1000).toFixed(2)}
                              </div>
                              {product.discount > 0 && (
                                <div className="old-price">
                                  ${(product.price / 1000).toFixed(2)}
              </div>
            )}
                            </div>
                            <div className="product-description">
                              <p>{product.description || "Sản phẩm tươi ngon, chất lượng cao, tốt cho sức khỏe."}</p>
                            </div>
                            <div className="product-actions">
                              <button className="wishlist-btn">
                                <i className="fas fa-heart"></i>
                              </button>
                              <button className="add-to-cart-btn">Thêm vào giỏ</button>
                              <button className="quick-view-btn">
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </div>
                </div>
              </div>
                  </div>
                ))}
              </div>
            )}

              {/* Pagination */}
            {!loading && filteredProducts.length > 0 && (
                <div className="pagination-wrapper d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination">
                      <li className="page-item active">
                        <a className="page-link" href="#">1</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">2</a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          <i className="fas fa-chevron-right"></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
