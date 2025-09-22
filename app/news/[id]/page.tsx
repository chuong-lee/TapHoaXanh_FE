"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { News, RelatedNews } from "@/types";
import api from "@/lib/axios";

export default function NewsDetailPage() {
  const { id } = useParams();
  
  // State management
  const [news, setNews] = useState<News>({
    id: "",
    name: "",
    images: [],
    date: "",
    views: 0,
    readTime: "",
    description: "",
    type: "",
    createdAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch news detail
        const response = await api.get(`/news/detail/${id}`);
        await api.patch(`/news/${id}/views`); // Tăng view count
        setNews(response.data);

        // Fetch categories
        try {
          const categoriesResponse = await api.get("/categories");
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error("Lỗi khi tải danh mục:", error);
        }

        // Fetch trending products
        try {
          const productsResponse = await api.get("/products?limit=4&sort=popular");
          setTrendingProducts(productsResponse.data || []);
        } catch (error) {
          console.error("Lỗi khi tải sản phẩm thịnh hành:", error);
        }

        // Fetch gallery images from news
        try {
          const newsResponse = await api.get("/news?limit=4");
          const galleryData = newsResponse.data
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
        }

        // Generate tags from news content
        try {
          const allNewsResponse = await api.get("/news");
          const allTags = new Set<string>();
          allNewsResponse.data.forEach((item: any) => {
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
          console.error("Lỗi khi tải thẻ:", error);
        }

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <main className="main-content">
        <div className="container py-4">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải bài viết...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!news) {
    return (
      <main className="main-content">
        <div className="container py-4">
          <div className="text-center">
            <h3 className="text-danger">Không tìm thấy bài viết</h3>
            <Link href="/news" className="btn btn-success mt-3">
              Quay lại trang tin tức
            </Link>
          </div>
        </div>
      </main>
    );
  }

  function insertImagesIntoText(
    text: string,
    listImages: string[]
  ): (string | { image: string })[] {
    // Tách đoạn theo xuống dòng kép hoặc chấm kết thúc câu
    const paragraphs = text
      .split(/\n\s*\n|(?<=\.)\s+/) // tách theo newline hoặc sau dấu chấm
      .map((p) => p.trim())
      .filter(Boolean);

    const result: (string | { image: string })[] = [];
    if (paragraphs.length === 0)
      return listImages.map((img) => ({ image: img }));

    const step = Math.ceil(paragraphs.length / (listImages.length + 1));

    let imgIndex = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      result.push(paragraphs[i]);

      if ((i + 1) % step === 0 && imgIndex < listImages.length) {
        result.push({ image: listImages[imgIndex] });
        imgIndex++;
      }
    }

    // Nếu còn ảnh dư thì nhét vào cuối
    while (imgIndex < listImages.length) {
      result.push({ image: listImages[imgIndex] });
      imgIndex++;
    }

    return result;
  }

  const mixedContent = insertImagesIntoText(
    news?.description ?? "",
    news?.images ?? []
  );
  console.log("🚀 ~ NewsDetailPage ~ mixedContent:", mixedContent);
  return (
    <section>
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">News Detail</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/news">News</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                News Detail
              </li>
            </ol>
          </nav>
        </div>
              </div>

      <div className="news-detail">
        <div className="section-article-detail">
          <div className="container">
            <div className="row">
              <div className="col-lg-9 article-content">
                <div className="article-category">{news.type || "Công thức nấu ăn"}</div>
                <h1 className="article-title">{news.name || "Smartwatch tốt nhất 2022: những thiết bị đeo tay hàng đầu bạn có thể mua ngay hôm nay"}</h1>
                <div className="article-meta">
                  <span className="author">
                    bởi Sugar Rock · 
                    <span className="time">{news.date || "2 giờ trước"} ·</span>
                    <span className="read-time">{news.readTime || "6 phút đọc"}</span>
                </span>
              </div>
                <div className="article-image">
                  <Image 
                    src={news.images?.[0] || "/images/food1.png"} 
                    alt={news.name || "Best smartwatch 2022"}
                    width={800}
                    height={400}
                  />
                </div>
                <div className="article-excerpt">
                  {news.description || "Giúp mọi người sống hạnh phúc và khỏe mạnh hơn tại nhà thông qua căn bếp của họ. Kitchn là tạp chí ẩm thực hàng ngày trên Web ca ngợi cuộc sống trong bếp thông qua việc nấu ăn tại nhà và trí tuệ ẩm thực."}
              </div>
                <div className="article-body">
                {mixedContent.map((item, idx) =>
                  typeof item === "string" ? (
                      <p key={idx}>{item}</p>
                  ) : (
                      <div key={idx} className="article-images-row">
                    <Image
                      src={item.image}
                      alt={`image-${idx}`}
                          width={400}
                          height={300}
                        />
                      </div>
                  )
                )}
              </div>
                <div className="article-tags">
                  <Link className="tag" href="#">{news.type || "Bánh ngọt"}</Link>
                  <Link className="tag" href="#">Công thức</Link>
                  <Link className="tag" href="#">Gà</Link>
                </div>
                <div className="article-share">
                  <span>
                    Chia sẻ bài viết:
                    <Link href="#"><i className="fa fa-facebook"></i></Link>
                    <Link href="#"><i className="fa fa-twitter"></i></Link>
                    <Link href="#"><i className="fa fa-pinterest"></i></Link>
                  </span>
            </div>
          </div>

          {/* Sidebar */}
              <div className="col-lg-3 sidebar">
                <div className="sidebar-box category-box">
                  <div className="sidebar-title">Danh mục</div>
                  <ul className="category-list">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <li key={category.id}>
                          <Link href={`/product?category=${category.id}`}>
                            {category.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li><Link href="#">Sữa & Sản phẩm từ sữa</Link></li>
                        <li><Link href="#">Quần áo</Link></li>
                        <li><Link href="#">Thức ăn thú cưng</Link></li>
                        <li><Link href="#">Nguyên liệu làm bánh</Link></li>
                        <li><Link href="#">Trái cây tươi</Link></li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="sidebar-box trending-box">
                  <div className="sidebar-title">Đang thịnh hành</div>
                  <ul className="trending-list">
                    {trendingProducts.length > 0 ? (
                      trendingProducts.map((product) => (
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
                      ))
                    ) : (
                      <>
                        <li>
                          <Image src="/images/trend1.png" alt="Chen Cardigan" width={60} height={60} />
                          <div className="trend-info">
                            <div className="trend-name">Áo len Chen</div>
                            <div className="trend-price">2.300.000đ</div>
                          </div>
                        </li>
                        <li>
                          <Image src="/images/trend2.png" alt="Chen Sweater" width={60} height={60} />
                          <div className="trend-info">
                            <div className="trend-name">Áo sweater Chen</div>
                            <div className="trend-price">2.070.000đ</div>
                          </div>
                        </li>
                        <li>
                          <Image src="/images/trend3.png" alt="Colorful Jacket" width={60} height={60} />
                          <div className="trend-info">
                            <div className="trend-name">Áo khoác đa màu</div>
                            <div className="trend-price">590.000đ</div>
                          </div>
                        </li>
                        <li>
                          <Image src="/images/trend4.png" alt="Lorem, ipsum" width={60} height={60} />
                          <div className="trend-info">
                            <div className="trend-name">Sản phẩm mới</div>
                            <div className="trend-price">580.000đ</div>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="sidebar-box gallery-box">
                  <div className="sidebar-title">Thư viện ảnh</div>
                  <div className="gallery-list">
                    {galleryImages.length > 0 ? (
                      galleryImages.map((item) => (
                        <Image 
                          key={item.id}
                          src={item.image} 
                          alt={item.title} 
                          width={80} 
                          height={80} 
                        />
                      ))
                    ) : (
                      <>
                        <Image src="/images/gallery1.png" alt="Gallery 1" width={80} height={80} />
                        <Image src="/images/gallery2.png" alt="Gallery 2" width={80} height={80} />
                        <Image src="/images/gallery3.png" alt="Gallery 3" width={80} height={80} />
                        <Image src="/images/gallery4.png" alt="Gallery 4" width={80} height={80} />
                      </>
                    )}
                  </div>
                </div>
                
                <div className="sidebar-box tags-box">
                  <div className="sidebar-title">Thẻ phổ biến</div>
                  <div className="tags-list">
                    {tags.length > 0 ? (
                      tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))
                    ) : (
                      <>
                        <span className="tag">Bắp cải</span>
                        <span className="tag">Bông cải xanh</span>
                        <span className="tag">Sinh tố</span>
                        <span className="tag">Trái cây</span>
                        <span className="tag">Salad</span>
                        <span className="tag">Khai vị</span>
                      </>
                    )}
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

// Component hiển thị bài viết liên quan
function RelatedPosts({ currentId }: { currentId: string }) {
  const [related, setRelated] = useState<RelatedNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await api.get("/news");
        const mapped = response.data.map((item: RelatedNews) => ({
          ...item,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN")
            : "", // format ngày Việt Nam
          views: Math.floor(Math.random() * 1000) + 100, // Random views cho demo
          readTime: Math.floor(Math.random() * 10) + 3 + " phút", // Random thời gian đọc
          description: item.description,
        }));
        setRelated(mapped);
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getNews();
  }, [currentId]);

  if (isLoading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1.5px solid #e0fbe2",
          boxShadow: "0 2px 8px rgba(34,197,94,0.05)",
        }}
      >
        <h5 className="fw-bold mb-3" style={{ color: "#22c55e" }}>
          Bài Viết Liên Quan
        </h5>
        <div className="text-center">
          <div
            className="spinner-border spinner-border-sm text-success"
            role="status"
          >
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 24,
        border: "1.5px solid #e0fbe2",
        boxShadow: "0 2px 8px rgba(34,197,94,0.05)",
      }}
    >
      <h5 className="fw-bold mb-3" style={{ color: "#22c55e" }}>
        Bài Viết Liên Quan
      </h5>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {related.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            style={{
              display: "flex",
              gap: 12,
              textDecoration: "none",
              color: "inherit",
              padding: 12,
              borderRadius: 8,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f0fdf4";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Image
              src={item.images?.[0] ?? "/images/thailan.jpeg"}
              alt={item.name}
              style={{
                width: 80,
                height: 60,
                objectFit: "cover",
                borderRadius: 8,
              }}
              width={80}
              height={60}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 4,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.name}
              </div>
              <div style={{ color: "#888", fontSize: 12 }}>
                📅 {item.date} · 👁️ {item.views}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
