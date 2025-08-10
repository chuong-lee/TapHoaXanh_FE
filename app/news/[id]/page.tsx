'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type News = {
  id: number
  title: string
  image: string
  date: string
  views: number
  readTime: string
  description: string
  category: string
  content?: string
}

// Hàm helper để xử lý URL hình ảnh
const processImageUrl = (imageData: unknown): string => {
  if (!imageData) return '/images/hinh1.jpg'
  
  // Nếu là array, lấy phần tử đầu tiên
  if (Array.isArray(imageData)) {
    return imageData.length > 0 ? imageData[0] : '/images/hinh1.jpg'
  }
  
  // Nếu là string
  if (typeof imageData === 'string') {
    // Kiểm tra nếu là JSON array trong string
    try {
      const parsed = JSON.parse(imageData)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]
      }
    } catch {
      // Nếu không parse được, sử dụng string gốc
      return imageData
    }
    return imageData
  }
  
  return '/images/hinh1.jpg'
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const [news, setNews] = useState<News | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Thử endpoint posts trước, nếu không có thì thử news
    const fetchNewsDetail = async () => {
      try {
        console.log('Fetching news detail for ID:', id)
        
        // Gọi local API posts
        let response = await fetch(`/api/posts/${id}`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const apiResponse = await response.json()
        console.log('API response:', apiResponse)
        
        // Lấy data từ response
        const newsItem = apiResponse.data
        
        // Xử lý dữ liệu từ API
        const newsData = {
          id: newsItem.id,
          title: newsItem.title || 'Tiêu đề bài viết',
          image: newsItem.image || '/images/hinh1.jpg',
          date: newsItem.createdAt ? new Date(newsItem.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
          views: newsItem.views || Math.floor(Math.random() * 1000) + 100,
          readTime: newsItem.readTime || '5 phút',
          description: newsItem.description || 'Nội dung bài viết đang được cập nhật...',
          category: newsItem.category || getRandomCategory(),
          content: newsItem.content || newsItem.description || 'Nội dung chi tiết đang được cập nhật...'
        }
        
        console.log('Processed news data:', newsData)
        setNews(newsData)
        setIsLoading(false)
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bài viết:', error)
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchNewsDetail()
    }
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
              <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: 32 }}>
                <Image 
                  src={news.image} 
                  alt={news.title} 
                  fill
                  style={{
                    objectFit: 'cover',
                    borderRadius: 16
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/hinh1.jpg';
                  }}
                />
              </div>

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
              <div 
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: '#444'
                }}
                className="article-content"
                dangerouslySetInnerHTML={{ __html: news.content || news.description }}
              />
              
              <style jsx>{`
                .article-content h2 {
                  color: #22c55e;
                  font-size: 1.5rem;
                  font-weight: 700;
                  margin: 24px 0 16px 0;
                  line-height: 1.4;
                }
                
                .article-content h3 {
                  color: #333;
                  font-size: 1.25rem;
                  font-weight: 600;
                  margin: 20px 0 12px 0;
                  line-height: 1.4;
                }
                
                .article-content p {
                  margin-bottom: 16px;
                  text-align: justify;
                }
                
                .article-content ul, .article-content ol {
                  margin: 16px 0;
                  padding-left: 24px;
                }
                
                .article-content li {
                  margin-bottom: 8px;
                  line-height: 1.6;
                }
                
                .article-content strong {
                  color: #22c55e;
                  font-weight: 600;
                }
              `}</style>

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
    const fetchRelatedPosts = async () => {
      try {
        console.log('Fetching related posts...')
        
        // Gọi local API posts
        let response = await fetch('/api/posts')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const apiResponse = await response.json()
        console.log('Related posts API response:', apiResponse)
        
        const relatedData = apiResponse.data || []
        
        const mapped = relatedData
          .filter((postItem: { id: number }) => postItem.id !== currentId)
          .map((postItem: {
            id: number
            title?: string
            image?: string
            createdAt?: string
            description?: string
            content?: string
            category?: string
            views?: number
            readTime?: string
          }) => ({
            id: postItem.id,
            title: postItem.title || 'Tiêu đề bài viết',
            image: postItem.image || '/images/hinh1.jpg',
            date: postItem.createdAt ? new Date(postItem.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
            views: postItem.views || Math.floor(Math.random() * 1000) + 100,
            readTime: postItem.readTime || '5 phút',
            description: postItem.description || postItem.content || 'Mô tả bài viết...',
            category: postItem.category || getRandomCategory(),
          }))
          .slice(0, 3)
        setRelated(mapped)
        setIsLoading(false)
      } catch (error) {
        console.error('Lỗi khi tải bài viết liên quan:', error)
        setIsLoading(false)
      }
    }

    fetchRelatedPosts()
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
            <div style={{ position: 'relative', width: '80px', height: '60px', flexShrink: 0 }}>
              <Image 
                src={item.image} 
                alt={item.title} 
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: 8
                }}
                sizes="80px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/hinh1.jpg';
                }}
              />
            </div>
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
