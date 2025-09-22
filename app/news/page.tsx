"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { News } from "@/types";
import api from "@/lib/axios";

export default function PostPage() {
  // State management
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch news data
        const newsResponse = await api.get("/news");
        const mappedNews = newsResponse.data.map((item: News) => ({
          ...item,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN")
            : "",
          readTime: Math.floor(Math.random() * 10) + 3 + " phút",
          description: item.description,
        }));
        setNews(mappedNews);

        // Fetch categories
        try {
          const categoriesResponse = await api.get("/categories");
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error("Lỗi khi tải danh mục:", error);
          // Fallback categories
          setCategories([
            { id: 1, name: "Sữa & Sản phẩm từ sữa" },
            { id: 2, name: "Quần áo" },
            { id: 3, name: "Thức ăn thú cưng" },
            { id: 4, name: "Nguyên liệu làm bánh" },
            { id: 5, name: "Trái cây tươi" }
          ]);
        }

        // Fetch trending products
        try {
          const productsResponse = await api.get("/products?limit=4&sort=popular");
          setTrendingProducts(productsResponse.data || []);
        } catch (error) {
          console.error("Lỗi khi tải sản phẩm thịnh hành:", error);
          // Fallback trending products
          setTrendingProducts([
            { id: 1, name: "Áo len Chen", price: 2300000, images: ["/images/trend1.png"] },
            { id: 2, name: "Áo sweater Chen", price: 2070000, images: ["/images/trend2.png"] },
            { id: 3, name: "Áo khoác đa màu", price: 590000, images: ["/images/trend3.png"] },
            { id: 4, name: "Sản phẩm mới", price: 580000, images: ["/images/trend4.png"] }
          ]);
        }

        // Fetch gallery images from news
        try {
          const galleryData = mappedNews
            .filter((item: any) => item.images && item.images.length > 0)
            .slice(0, 4)
            .map((item: any) => ({
              id: item.id,
              image: item.images[0],
              title: item.name
            }));
          setGalleryImages(galleryData);
        } catch (error) {
          console.error("Lỗi khi tải thư viện ảnh:", error);
          // Fallback gallery
          setGalleryImages([
            { id: 1, image: "/images/gallery1.png", title: "Gallery 1" },
            { id: 2, image: "/images/gallery2.png", title: "Gallery 2" },
            { id: 3, image: "/images/gallery3.png", title: "Gallery 3" },
            { id: 4, image: "/images/gallery4.png", title: "Gallery 4" }
          ]);
        }

        // Generate tags from news content
        const allTags = new Set<string>();
        mappedNews.forEach((item: any) => {
          if (item.description) {
            const words = item.description.toLowerCase()
              .replace(/[^\w\s]/g, '')
              .split(/\s+/)
              .filter((word: string) => word.length > 3);
            words.forEach((word: string) => allTags.add(word));
          }
        });
        setTags(Array.from(allTags).slice(0, 6));

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <main className="main-content">
        <div className="container py-4">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải tin tức...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <section>
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">News</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                News
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="news">
        <div className="section-recipe-articles">
          <div className="container">
            {/* Mobile Filter Dropdown */}
            <div className="mobile-filters d-block d-lg-none mb-4">
              <div className="row">
                <div className="col-6">
                  <select className="form-select mb-3">
                    <option value="">Chọn danh mục</option>
                    <option value="sua">Sữa & Sản phẩm từ sữa</option>
                    <option value="quanao">Quần áo</option>
                    <option value="thucan">Thức ăn thú cưng</option>
                    <option value="nguyenlieu">Nguyên liệu làm bánh</option>
                    <option value="traicay">Trái cây tươi</option>
                  </select>
                </div>
                <div className="col-6">
                  <select className="form-select mb-3">
                    <option value="">Sắp xếp theo</option>
                    <option value="moi">Mới nhất</option>
                    <option value="xem">Xem nhiều</option>
                    <option value="trend">Thịnh hành</option>
                  </select>
                </div>
              </div>
        </div>

            <div className="row">
              <div className="col-lg-8 col-12 col-md-8 order-2 order-lg-1">
                <div className="articles-grid">
              {news.map((item) => (
                <Link
                      key={item.id} 
                      className="article-card" 
                  href={`/news/${item.id}`}
                    >
                      <div className="article-img">
                        <Image 
                          src={item.images?.[0] ?? "/images/food1.png"} 
                          alt={item.name || "Hướng dẫn trung cấp về thực phẩm lành mạnh"}
                          width={300}
                          height={200}
                        />
                        <div className="article-tag">Món ăn kèm</div>
                      </div>
                      <div className="article-info">
                        <div className="article-title">
                          {item.name || "Hướng dẫn trung cấp về thực phẩm lành mạnh"}
                        </div>
                        <div className="article-meta">
                          {item.date} · {item.views || "1,2k"} lượt xem · {item.readTime || "4 phút đọc"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

              <div className="col-lg-4 col-md-4 order-1 order-lg-2">
                <div className="sidebar d-none d-lg-block">
                  <div className="sidebar-box category-box">
                    <div className="sidebar-title">Danh mục</div>
                    <ul className="category-list">
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link href={`/product?category=${category.id}`}>
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="sidebar-box trending-box">
                    <div className="sidebar-title">Đang thịnh hành</div>
                    <ul className="trending-list">
                      {trendingProducts.map((product) => (
                        <li key={product.id}>
                          <Image 
                            src={product.images?.[0] || "/images/trend1.png"} 
                            alt={product.name} 
                            width={60} 
                            height={60} 
                          />
                          <div className="trend-info">
                            <div className="trend-name">{product.name}</div>
                            <div className="trend-price">
                              {(product.price / 1000).toLocaleString('vi-VN')}.000đ
                            </div>
                </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="sidebar-box gallery-box">
                    <div className="sidebar-title">Thư viện ảnh</div>
                    <div className="gallery-list d-flex flex-wrap gap-2">
                      {galleryImages.map((item) => (
                        <Image 
                          key={item.id}
                          src={item.image} 
                          alt={item.title} 
                          width={80} 
                          height={80} 
                        />
                      ))}
                </div>
                  </div>
                  
                  <div className="sidebar-box tags-box">
                    <div className="sidebar-title">Thẻ phổ biến</div>
                    <div className="tags-list d-flex flex-wrap gap-2">
                      {tags.length > 0 ? (
                        tags.map((tag, index) => (
                          <span key={index} className="tag badge bg-light text-dark">
                            {tag}
                  </span>
                        ))
                      ) : (
                        <>
                          <span className="tag badge bg-light text-dark">Bắp cải</span>
                          <span className="tag badge bg-light text-dark">Bông cải xanh</span>
                          <span className="tag badge bg-light text-dark">Sinh tố</span>
                          <span className="tag badge bg-light text-dark">Trái cây</span>
                          <span className="tag badge bg-light text-dark">Salad</span>
                          <span className="tag badge bg-light text-dark">Khai vị</span>
                        </>
                      )}
                </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
