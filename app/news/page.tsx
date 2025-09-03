'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { News } from '@/types'
import Image from 'next/image'



export default function PostPage() {
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/news')
      .then(res => res.json())
      .then(data => {
        // Map lại dữ liệu cho đúng với type News ở FE
        const mapped = data.map((item:News) => ({
          id: item.id,
          title: item.title, 
          image: item.image, 
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '', // format ngày Việt Nam
          views: Math.floor(Math.random() * 1000) + 100, // Random views cho demo
          readTime: Math.floor(Math.random() * 10) + 3 + ' phút', // Random thời gian đọc
          description: item.description,
          category: getRandomCategory(), // Random category
        }));
        setNews(mapped);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải tin tức:', error);
        setIsLoading(false);
      });
  }, []);

  const getRandomCategory = () => {
    const categories = ['Tin Khuyến Mãi', 'Sản Phẩm Mới', 'Sức Khỏe', 'Ẩm Thực', 'Lifestyle'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

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
    )
  }

  return (
    <main className="main-content">
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold" style={{color: '#22c55e', fontSize: '2.5rem'}}>Tin Tức & Khuyến Mãi</h1>
          <p className="text-muted" style={{fontSize: 18}}>Cập nhật những tin tức mới nhất từ Tạp Hóa Xanh</p>
        </div>

        <div style={{display: 'flex', gap: 32}}>
          {/* Main content */}
          <div style={{flex: 3}}>
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
                      src={item.image} 
                      alt={item.title} 
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
    </main>
  )
}
