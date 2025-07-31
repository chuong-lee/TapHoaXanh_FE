'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type News = {
  id: number
  title: string
  image: string
  date: string
  views: number
  readTime: string
  description: string
  category: string
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const [news, setNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:5000/news/${id}`)
      .then(res => res.json())
      .then(item => {
        setNews({
          id: item.id,
          title: item.name,
          image: item.images,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '',
          views: Math.floor(Math.random() * 1000) + 100,
          readTime: Math.floor(Math.random() * 10) + 3 + ' phút',
          description: item.description,
          category: getRandomCategory(),
        })
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Lỗi khi tải bài viết:', error)
        setIsLoading(false)
      })
  }, [id])

  const getRandomCategory = () => {
    const categories = ['Tin Khuyến Mãi', 'Sản Phẩm Mới', 'Sức Khỏe', 'Ẩm Thực', 'Lifestyle']
    return categories[Math.floor(Math.random() * categories.length)]
  }

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
    )
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
    )
  }

  return (
    <main className="main-content">
      <div className="container py-4">
        <div style={{display: 'flex', gap: 32}}>
          {/* Main content */}
          <div style={{flex: 3}}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 2px 12px rgba(34,197,94,0.10)',
              border: '1.5px solid #e0fbe2'
            }}>
              {/* Breadcrumb */}
              <div style={{marginBottom: 24}}>
                <Link href="/news" style={{color: '#22c55e', textDecoration: 'none'}}>
                  ← Quay lại Tin Tức
                </Link>
              </div>

              {/* Category badge */}
              <div style={{marginBottom: 16}}>
                <span style={{
                  background: '#e0fbe2',
                  color: '#22c55e',
                  borderRadius: 8,
                  padding: '6px 16px',
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  {news.category}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontWeight: 700,
                fontSize: '2.5rem',
                marginBottom: 16,
                color: '#222',
                lineHeight: 1.3
              }}>
                {news.title}
              </h1>

              {/* Meta info */}
              <div style={{
                color: '#666',
                fontSize: 16,
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 16
              }}>
                <span>📅 {news.date}</span>
                <span>👁️ {news.views} lượt xem</span>
                <span>⏱️ {news.readTime}</span>
              </div>

              {/* Featured image */}
              <img 
                src={news.image} 
                alt={news.title} 
                style={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 16,
                  marginBottom: 32
                }} 
              />

              {/* Description */}
              <div style={{
                fontSize: 18,
                lineHeight: 1.8,
                color: '#333',
                marginBottom: 32
              }}>
                {news.description}
              </div>

              {/* Content */}
              <div style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: '#444'
              }}>
                <p style={{marginBottom: 20}}>
                  Tạp Hóa Xanh tự hào mang đến cho bạn những thông tin hữu ích về sản phẩm, 
                  dịch vụ và các chương trình khuyến mãi đặc biệt. Chúng tôi cam kết cung cấp 
                  những sản phẩm chất lượng cao với giá cả hợp lý nhất.
                </p>
                
                <p style={{marginBottom: 20}}>
                  Với đội ngũ nhân viên tận tâm và hệ thống phân phối hiện đại, 
                  chúng tôi đảm bảo mọi nhu cầu mua sắm của bạn đều được đáp ứng 
                  một cách nhanh chóng và thuận tiện nhất.
                </p>

                <p style={{marginBottom: 20}}>
                  Hãy theo dõi trang tin tức của chúng tôi để cập nhật những thông tin 
                  mới nhất về sản phẩm, khuyến mãi và các sự kiện đặc biệt từ Tạp Hóa Xanh.
                </p>
              </div>

              {/* Tags */}
              <div style={{marginTop: 32, paddingTop: 24, borderTop: '1px solid #e0fbe2'}}>
                <h5 style={{color: '#22c55e', marginBottom: 16}}>Thẻ liên quan:</h5>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                  <span style={{
                    background: '#e0fbe2',
                    color: '#22c55e',
                    borderRadius: 20,
                    padding: '6px 16px',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}>
                    {news.category}
                  </span>
                  <span style={{
                    background: '#e0fbe2',
                    color: '#22c55e',
                    borderRadius: 20,
                    padding: '6px 16px',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}>
                    Tạp Hóa Xanh
                  </span>
                  <span style={{
                    background: '#e0fbe2',
                    color: '#22c55e',
                    borderRadius: 20,
                    padding: '6px 16px',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}>
                    Khuyến Mãi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
            {/* Bài viết liên quan */}
            <RelatedPosts currentId={news.id} />
            
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
                  cursor: 'pointer'
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

// Component hiển thị bài viết liên quan
function RelatedPosts({ currentId }: { currentId: number }) {
  const [related, setRelated] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:5000/news')
      .then(res => res.json())
      .then(data => {
        const mapped = data
          .filter((item: any) => item.id !== currentId)
          .map((item: any) => ({
            id: item.id,
            title: item.name,
            image: item.images,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '',
            views: Math.floor(Math.random() * 1000) + 100,
            readTime: Math.floor(Math.random() * 10) + 3 + ' phút',
            description: item.description,
            category: getRandomCategory(),
          }))
          .slice(0, 3)
        setRelated(mapped)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Lỗi khi tải bài viết liên quan:', error)
        setIsLoading(false)
      })
  }, [currentId])

  const getRandomCategory = () => {
    const categories = ['Tin Khuyến Mãi', 'Sản Phẩm Mới', 'Sức Khỏe', 'Ẩm Thực', 'Lifestyle']
    return categories[Math.floor(Math.random() * categories.length)]
  }

  if (isLoading) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        border: '1.5px solid #e0fbe2',
        boxShadow: '0 2px 8px rgba(34,197,94,0.05)'
      }}>
        <h5 className="fw-bold mb-3" style={{color: '#22c55e'}}>Bài Viết Liên Quan</h5>
        <div className="text-center">
          <div className="spinner-border spinner-border-sm text-success" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      border: '1.5px solid #e0fbe2',
      boxShadow: '0 2px 8px rgba(34,197,94,0.05)'
    }}>
      <h5 className="fw-bold mb-3" style={{color: '#22c55e'}}>Bài Viết Liên Quan</h5>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
        {related.map(item => (
          <Link 
            key={item.id} 
            href={`/news/${item.id}`} 
            style={{
              display: 'flex', 
              gap: 12, 
              textDecoration: 'none', 
              color: 'inherit',
              padding: 12,
              borderRadius: 8,
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0fdf4'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <img 
              src={item.image} 
              alt={item.title} 
              style={{
                width: 80, 
                height: 60, 
                objectFit: 'cover', 
                borderRadius: 8
              }} 
            />
            <div style={{flex: 1}}>
              <div style={{
                fontWeight: 600, 
                fontSize: 14, 
                marginBottom: 4,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.title}
              </div>
              <div style={{color: '#888', fontSize: 12}}>
                📅 {item.date} · 👁️ {item.views}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
