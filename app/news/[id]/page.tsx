'use client'
import { , useState } from 'react'
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
    </>
  )
}

// Component hiển thị bài viết liên quan
function RelatedPosts({ currentId }: { currentId: number }) {
  const [related, setRelated] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)

  (() => {
    const fetchRelatedPosts = async () => {
      try {
        console.log('Fetching related posts...')
        
        // Gọi local API posts
        let response = await fetch('/api/posts')
        
        if (!response.ok) {
          throw new Error(`HTTP ! status: ${response.status}`)
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
        console.error('Lỗi khi tải bài viết liên quan:', )
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
