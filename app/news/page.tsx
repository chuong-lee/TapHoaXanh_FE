'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface ApiPost {
  id: number
  name: string
  summary?: string
  images?: string
  description?: string
  views?: number
  likes?: number
  comments_count?: number
  author_id?: number
  category_id?: number
  type?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string
}

export default function PostPage() {
  const [news, setNews] = useState<ApiPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fixImageSrc = (src: string) => {
    if (!src || src === 'null' || src === 'undefined') return '/images/placeholder.png';
    if (src.startsWith('http')) return src;
    if (src.startsWith('/')) return src;
    if (src.startsWith('client/images/')) return '/' + src;
    if (src.startsWith('images/')) return '/' + src;
    return '/images/' + src;
  }

  useEffect(() => {
    // Gọi API posts từ local API routes
    fetch('/api/posts')
      .then(res => {
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('API Response:', data);
        
        let postsArray = []
        
        // Xử lý response đơn giản
        if (Array.isArray(data)) {
          postsArray = data
        } else if (data && data.data && Array.isArray(data.data)) {
          postsArray = data.data
        } else if (data && data.posts && Array.isArray(data.posts)) {
          postsArray = data.posts
        } else if (data && data.news && Array.isArray(data.news)) {
          postsArray = data.news
        }
        
        console.log('Posts found:', postsArray.length);
        
        // Debug: Kiểm tra structure của item đầu tiên
        if (postsArray.length > 0) {
          console.log('Sample post structure:', postsArray[0]);
        }
        
        if (postsArray.length === 0) {
          console.log('Không có bài viết nào từ API');
          setNews([]);
          setIsLoading(false);
          return;
        }
        
        // Map lại dữ liệu cho đúng với type News ở FE
        const mapped = postsArray.map((item: ApiPost) => {
          // Debug logging cho mỗi item
          console.log('Processing item:', { 
            id: item.id, 
            title: item.name, 
            name: item.name, 
            category: item.category_id 
          });
          
          return {
            id: item.id,
            title: item.name || 'Tiêu đề bài viết', // title hoặc name
            image: item.images || '/images/placeholder.png', // image hoặc images
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 
                  new Date().toLocaleDateString('vi-VN'), // format ngày Việt Nam
            views: item.views || Math.floor(Math.random() * 1000) + 100, // views hoặc random
            readTime: 'N/A', // readTime hoặc random
            description: item.description || item.summary || 'Nội dung bài viết...',
            category: item.category_id ? getCategoryNameById(item.category_id) : getRandomCategory(), // xử lý category object
          }
        });
        setNews(mapped);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải tin tức:', error);
        setNews([]);
        setIsLoading(false);
      });
  }, []);

  const getRandomCategory = () => {
    const categories = ['Tin Khuyến Mãi', 'Sản Phẩm Mới', 'Sức Khỏe', 'Ẩm Thực', 'Lifestyle'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  const getCategoryNameById = (categoryId: number) => {
    switch (categoryId) {
      case 1:
        return 'Tin Khuyến Mãi';
      case 2:
        return 'Sản Phẩm Mới';
      case 3:
        return 'Sức Khỏe';
      case 4:
        return 'Ẩm Thực';
      case 5:
        return 'Lifestyle';
      default:
        return 'Không rõ';
    }
  };

  if (isLoading) {
    return (
        <div className="container py-4">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3">Đang tải tin tức...</p>
          </div>
        </div>
      
    )
  }

  return (
    <section>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Bài Viết</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Bài Viết</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="container my-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{color: '#22c55e', fontSize: '2.5rem'}}>Tin Tức & Khuyến Mãi</h1>
          <p className="text-muted" style={{fontSize: 18}}>Cập nhật những tin tức mới nhất từ Tạp Hóa Xanh</p>
        </div>

        <div style={{display: 'flex', gap: 32}}>
          {/* Main content */}
          <div style={{flex: 3}}>
            {news.length === 0 ? (
              <div style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(34,197,94,0.10)',
                border: '1.5px solid #e0fbe2',
                padding: 40,
                textAlign: 'center'
              }}>
                <div style={{fontSize: '3rem', marginBottom: 16}}>📰</div>
                <h4 style={{color: '#22c55e', marginBottom: 16}}>Không có bài viết nào</h4>
                <p style={{color: '#666', marginBottom: 20}}>
                  Hiện tại chưa có bài viết nào từ API. 
                  Hãy kiểm tra kết nối API hoặc thêm dữ liệu vào backend.
                </p>
                <button 
                  className="btn"
                  style={{
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontWeight: 600
                  }}
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
                {news.map(item => (
                  <Link href={`/news/${item.id}`} key={item.id} style={{textDecoration: 'none', color: 'inherit'}}>
                    <div style={{
                      background: '#fff',
                      borderRadius: 16,
                      boxShadow: '0 2px 12px rgba(34,197,94,0.10)',
                      border: '1.5px solid #e0fbe2',
                      padding: 20,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.18)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(34,197,94,0.10)';
                    }}>
                      <Image 
                        src={fixImageSrc(item.image)} 
                        alt={item.title} 
                        width={400}
                        height={180}
                        style={{
                          width: '100%', 
                          height: 180, 
                          objectFit: 'cover', 
                          borderRadius: 12,
                          marginBottom: 16
                        }} 
                      />
                      <div style={{marginBottom: 12}}>
                        <span style={{
                          background: '#e0fbe2', 
                          color: '#22c55e', 
                          borderRadius: 8, 
                          padding: '4px 12px', 
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {item.category}
                        </span>
                      </div>
                      <h5 style={{
                        fontWeight: 700, 
                        fontSize: '1.1rem',
                        marginBottom: 8,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.title}
                      </h5>
                      <p style={{
                        color: '#666', 
                        fontSize: 14,
                        marginBottom: 12,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5
                      }}>
                        {item.description || 'Khám phá những thông tin thú vị về sản phẩm và dịch vụ của chúng tôi...'}
                      </p>
                      <div style={{
                        color: '#888', 
                        fontSize: 13,
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                      }}>
                        <span>📅 {item.date}</span>
                        <span>👁️ {item.views} lượt xem</span>
                        <span>⏱️ {item.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
            {/* Danh mục */}
            <div style={{
              background: '#fff', 
              borderRadius: 16, 
              padding: 24,
              border: '1.5px solid #e0fbe2',
              boxShadow: '0 2px 8px rgba(34,197,94,0.05)'
            }}>
              <h5 className="fw-bold mb-3" style={{color: '#22c55e'}}>Danh Mục</h5>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <div style={{color: '#22c55e', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f0f0f0'}}>
                  🛒 Tin Khuyến Mãi
                </div>
                <div style={{color: '#22c55e', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f0f0f0'}}>
                  🆕 Sản Phẩm Mới
                </div>
                <div style={{color: '#22c55e', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f0f0f0'}}>
                  💚 Sức Khỏe & Dinh Dưỡng
                </div>
                <div style={{color: '#22c55e', padding: '8px 0', cursor: 'pointer', borderBottom: '1px solid #f0f0f0'}}>
                  🍽️ Ẩm Thực
                </div>
                <div style={{color: '#22c55e', padding: '8px 0', cursor: 'pointer'}}>
                  🌟 Lifestyle
                </div>
              </div>
            </div>

            {/* Tin nổi bật */}
            <div style={{
              background: '#fff', 
              borderRadius: 16, 
              padding: 24,
              border: '1.5px solid #e0fbe2',
              boxShadow: '0 2px 8px rgba(34,197,94,0.05)'
            }}>
              <h5 className="fw-bold mb-3" style={{color: '#22c55e'}}>Tin Nổi Bật</h5>
              <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
                <div style={{padding: '12px 0', borderBottom: '1px solid #f0f0f0'}}>
                  <div style={{fontWeight: 600, marginBottom: 4}}>Khuyến mãi cuối tuần</div>
                  <span style={{color: '#22c55e', fontWeight: 600}}>Giảm đến 50%</span>
                </div>
                <div style={{padding: '12px 0', borderBottom: '1px solid #f0f0f0'}}>
                  <div style={{fontWeight: 600, marginBottom: 4}}>Sản phẩm mới tháng 12</div>
                  <span style={{color: '#22c55e', fontWeight: 600}}>Đã có mặt</span>
                </div>
                <div style={{padding: '12px 0', borderBottom: '1px solid #f0f0f0'}}>
                  <div style={{fontWeight: 600, marginBottom: 4}}>Chương trình tích điểm</div>
                  <span style={{color: '#22c55e', fontWeight: 600}}>Nhận quà ngay</span>
                </div>
                <div style={{padding: '12px 0'}}>
                  <div style={{fontWeight: 600, marginBottom: 4}}>Giao hàng miễn phí</div>
                  <span style={{color: '#22c55e', fontWeight: 600}}>Đơn từ 200k</span>
                </div>
              </div>
            </div>

            {/* Thẻ phổ biến */}
            <div style={{
              background: '#fff', 
              borderRadius: 16, 
              padding: 24,
              border: '1.5px solid #e0fbe2',
              boxShadow: '0 2px 8px rgba(34,197,94,0.05)'
            }}>
              <h5 className="fw-bold mb-3" style={{color: '#22c55e'}}>Thẻ Phổ Biến</h5>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                <span style={{
                  background: '#e0fbe2', 
                  color: '#22c55e',
                  borderRadius: 20, 
                  padding: '6px 16px',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>Khuyến Mãi</span>
                <span style={{
                  background: '#e0fbe2', 
                  color: '#22c55e',
                  borderRadius: 20, 
                  padding: '6px 16px',
                  fontSize: 13,
                  cursor: 'pointer'
                }}>Sản Phẩm Mới</span>
                <span style={{
                  background: '#e0fbe2', 
                  color: '#22c55e',
                  borderRadius: 20, 
                  padding: '6px 16px',
                  fontSize: 13,
                  cursor: 'pointer'
                }}>Sức Khỏe</span>
                <span style={{
                  background: '#e0fbe2', 
                  color: '#22c55e',
                  borderRadius: 20, 
                  padding: '6px 16px',
                  fontSize: 13,
                  cursor: 'pointer'
                }}>Ẩm Thực</span>
                <span style={{
                  background: '#e0fbe2', 
                  color: '#22c55e',
                  borderRadius: 20, 
                  padding: '6px 16px',
                  fontSize: 13,
                  cursor: 'pointer'
                }}>Lifestyle</span>
                <span style={{
                  background: '#e0fbe2', 
                  color: '#22c55e',
                  borderRadius: 20, 
                  padding: '6px 16px',
                  fontSize: 13,
                  cursor: 'pointer'
                }}>Tạp Hóa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
