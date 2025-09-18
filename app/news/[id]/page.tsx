"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { News, RelatedNews } from "@/types";
import Image from "next/image";
import api from "@/lib/axios";

export default function NewsDetailPage() {
  const { id } = useParams();
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

  useEffect(() => {
    const getNewsDetail = async () => {
      try {
        const response = await api.get(`/news/detail/${id}`);
        await api.patch(`/news/${id}/views`); // Tăng view count
        setNews(response.data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getNewsDetail();
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
    <main className="main-content">
      <div className="container py-4">
        <div style={{ display: "flex", gap: 32 }}>
          {/* Main content */}
          <div style={{ flex: 3 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 32,
                boxShadow: "0 2px 12px rgba(34,197,94,0.10)",
                border: "1.5px solid #e0fbe2",
              }}
            >
              {/* Breadcrumb */}
              <div style={{ marginBottom: 24 }}>
                <Link
                  href="/news"
                  style={{ color: "#22c55e", textDecoration: "none" }}
                >
                  ← Quay lại Tin Tức
                </Link>
              </div>

              {/* Category badge */}
              <div style={{ marginBottom: 16 }}>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 8,
                    padding: "6px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {news.type}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: "2.5rem",
                  marginBottom: 16,
                  color: "#222",
                  lineHeight: 1.3,
                }}
              >
                Bài viết: {news.name}
              </h1>

              {/* Meta info */}
              <div
                style={{
                  color: "#666",
                  fontSize: 16,
                  marginBottom: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span>📅 {news.date}</span>
                <span>👁️ {news.views} lượt xem</span>
                <span>⏱️ {news.readTime}</span>
              </div>

              {/* Content */}
              <div
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#444",
                }}
              >
                {mixedContent.map((item, idx) =>
                  typeof item === "string" ? (
                    <p key={idx} style={{ marginBottom: 20 }}>
                      {item}
                    </p>
                  ) : (
                    <Image
                      key={idx}
                      src={item.image}
                      alt={`image-${idx}`}
                      style={{
                        display: "block",
                        margin: "20px auto",
                        maxWidth: "100%",
                        borderRadius: 8,
                      }}
                      width={800}
                      height={450}
                    />
                  )
                )}
              </div>

              {/* Tags */}
              <div
                style={{
                  marginTop: 32,
                  paddingTop: 24,
                  borderTop: "1px solid #e0fbe2",
                }}
              >
                <h5 style={{ color: "#22c55e", marginBottom: 16 }}>
                  Thẻ liên quan:
                </h5>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span
                    style={{
                      background: "#e0fbe2",
                      color: "#22c55e",
                      borderRadius: 20,
                      padding: "6px 16px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {news.type}
                  </span>
                  <span
                    style={{
                      background: "#e0fbe2",
                      color: "#22c55e",
                      borderRadius: 20,
                      padding: "6px 16px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Tạp Hóa Xanh
                  </span>
                  <span
                    style={{
                      background: "#e0fbe2",
                      color: "#22c55e",
                      borderRadius: 20,
                      padding: "6px 16px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Khuyến Mãi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Bài viết liên quan */}
            <RelatedPosts currentId={news.id} />

            {/* Danh mục */}
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
                Danh Mục
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    color: "#22c55e",
                    padding: "8px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  🛒 Tin Khuyến Mãi
                </div>
                <div
                  style={{
                    color: "#22c55e",
                    padding: "8px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  🆕 Sản Phẩm Mới
                </div>
                <div
                  style={{
                    color: "#22c55e",
                    padding: "8px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  💚 Sức Khỏe & Dinh Dưỡng
                </div>
                <div
                  style={{
                    color: "#22c55e",
                    padding: "8px 0",
                    cursor: "pointer",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  🍽️ Ẩm Thực
                </div>
                <div
                  style={{
                    color: "#22c55e",
                    padding: "8px 0",
                    cursor: "pointer",
                  }}
                >
                  🌟 Lifestyle
                </div>
              </div>
            </div>

            {/* Thẻ phổ biến */}
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
                Thẻ Phổ Biến
              </h5>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Khuyến Mãi
                </span>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Sản Phẩm Mới
                </span>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Sức Khỏe
                </span>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Ẩm Thực
                </span>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Lifestyle
                </span>
                <span
                  style={{
                    background: "#e0fbe2",
                    color: "#22c55e",
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Tạp Hóa
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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
