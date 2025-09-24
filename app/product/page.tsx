"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/axios";
import SidebarFilter from "@/components/SidebarFilter";
import debounce from "lodash.debounce";
import Pagination from "@/components/Pagination";

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
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [originalFilteredProducts, setOriginalFilteredProducts] = useState<
    Product[]
  >([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [_maxPrice, setMaxPrice] = useState(1000000);

  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/products");
        const productsData = Array.isArray(res.data) ? res.data : [];

        setProducts(productsData);
        setOriginalFilteredProducts(productsData);
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

  const handleCategoryChange = async (categoryId: number | null) => {
    if (categoryId) {
      const res = await api.get(`/products/search?categoryId=${categoryId}`);
      const productFilteredByCategory = res.data || [];
      setSelectedCategory(categoryId);

      setFilteredProducts(productFilteredByCategory.data);
      setOriginalFilteredProducts(productFilteredByCategory.data);
    } else {
      setFilteredProducts(products);
    }
    // filterProducts(categoryId, maxPrice);
  };

  // Xử lý lọc theo giá
  const handlePriceChange = async (price: number) => {
    setMaxPrice(price);
    // filterProducts(selectedCategory, price);
    const { data } = await api.get(`/products/search?minPrice=${price}`);
    const { data: productData } = data;
    setFilteredProducts(productData);
  };

  const debouncedFetchProducts = debounce((price: number) => {
    handlePriceChange(price);
  }, 500);

  const handleSortChange = async (sort: string) => {
    if (sort) {
      const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "name-asc") return a.name.localeCompare(b.name);
        if (sort === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });

      setFilteredProducts(sortedProducts);
    } else {
      setFilteredProducts(originalFilteredProducts);
    }
  };

  useEffect(() => {
    handleSortChange(sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);

  return (
    <main className="main-content">
      <div className="container py-4">
        <div className="row">
          {/* Sidebar filter */}
          <div className="col-md-3">
            <SidebarFilter
              onCategoryChange={handleCategoryChange}
              onPriceChange={debouncedFetchProducts}
            />
          </div>
          {/* Product grid */}
          <div className="col-md-9">
            {/* Thanh Show/Sắp xếp */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="fw-bold mb-0" style={{ fontSize: "2rem" }}>
                {selectedCategory ? (
                  <>
                    Danh mục:{" "}
                    <span style={{ color: "#22c55e" }}>
                      {filteredProducts.slice(0, itemsPerPage).length}
                    </span>
                  </>
                ) : (
                  <>
                    Tất cả sản phẩm:{" "}
                    <span style={{ color: "#e11d48" }}>
                      {filteredProducts.slice(0, itemsPerPage).length}
                    </span>
                  </>
                )}
              </h2>
              <div className="d-flex align-items-center" style={{ gap: 16 }}>
                {/* <label className="me-2" htmlFor="showSelect">
                  Hiển thị:
                </label>
                <select
                  id="showSelect"
                  value={show}
                  onChange={(e) => setShow(Number(e.target.value))}
                  style={{ borderRadius: 6, padding: "2px 8px" }}
                >
                  {[12, 24, 36, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select> */}
                <label className="ms-3 me-2" htmlFor="sortSelect">
                  Sắp xếp theo:
                </label>
                <select
                  id="sortSelect"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  style={{ borderRadius: 6, padding: "2px 8px" }}
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="name-asc">Tên: A-Z</option>
                  <option value="name-desc">Tên: Z-A</option>
                </select>
              </div>
            </div>

            {/* Debug info - tạm thời ẩn để debug */}
            {/* {process.env.NODE_ENV === 'development' && (
              <div className="mb-3 p-2 bg-light rounded">
                <small className="text-muted">
                  Debug: {products.length} sản phẩm tổng, {filteredProducts.length} đã lọc, 
                  Category ID: {selectedCategory}, 
                  Sample product category: {products[0]?.category?.name || 'N/A'}
                </small>
              </div>
            )} */}

            {/* Thông báo khi không có sản phẩm */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-5">
                <div
                  style={{ fontSize: "3rem", color: "#ccc", marginBottom: 16 }}
                >
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
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts
                  .slice(
                    currentPage > 1 ? (currentPage - 1) * itemsPerPage : 0,
                    itemsPerPage * currentPage
                  )
                  .map((product) => (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-lg-3"
                      key={product.id}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            )}

            {/* Hiển thị thông tin về số lượng sản phẩm */}
            {!loading && filteredProducts.length > 0 && (
              <div className="text-center mt-4">
                <p className="text-muted">
                  Hiển thị {Math.min(itemsPerPage, filteredProducts.length)}{" "}
                  trong tổng số {filteredProducts.length} sản phẩm
                  {selectedCategory && " trong danh mục này"}
                </p>
              </div>
            )}

            <Pagination
              currentPage={currentPage || 1}
              totalItems={products.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
