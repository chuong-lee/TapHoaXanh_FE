'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

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

  useEffect(() => {
    fetch(`http://localhost:5000/news/${id}`)
      .then(res => res.json())
      .then(item => {
        setNews({
          id: item.id,
          title: item.name,
          image: item.images,
          date: item.createdAt ? item.createdAt.slice(0, 10) : '',
          views: 0,
          readTime: '5 phút',
          description: item.description,
          category: '', // hoặc lấy từ backend nếu có
        })
      })
  }, [id])

  if (!news) return <div>Đang tải...</div>

  return (
    <main className="main-content">
      <div className="container py-4" style={{display: 'flex', gap: 32}}>
        {/* Main content */}
        <div style={{flex: 3}}>
          <div>
            <div style={{color: '#1dbf73', fontWeight: 700, marginBottom: 8, fontSize: 18}}>Recipes</div>
            <h1 style={{fontWeight: 800, fontSize: 36, marginBottom: 8}}>{news.title}</h1>
            <div style={{color: '#888', marginBottom: 16}}>
              by <b>Sugar Rock</b> · {news.date} · {news.readTime} read
            </div>
            <img src={news.image} alt={news.title} style={{width: '100%', maxHeight: 350, objectFit: 'cover', borderRadius: 12, marginBottom: 24}} />
            <div style={{fontWeight: 600, fontSize: 20, marginBottom: 12}}>
              {/* Nếu description có nhiều đoạn, tách và render từng đoạn */}
              {news.description.split('\n').map((line, idx) =>
                idx === 0 ? (
                  <span key={idx} style={{fontWeight: 700, fontSize: 22, display: 'block', marginBottom: 8}}>
                    {line}
                  </span>
                ) : (
                  <span key={idx} style={{fontWeight: 400, display: 'block', marginBottom: 8}}>
                    {line}
                  </span>
                )
              )}
            </div>
            {/* Nội dung chính, có thể render thêm nếu backend trả về */}
            <div style={{color: '#222', fontSize: 17, lineHeight: 1.7}}>
              {/* Nếu có trường content thì render ở đây */}
              {/* {news.content} */}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet in enim libero...
            </div>
          </div>
        </div>
        {/* Related posts */}
        <RelatedPosts currentId={news.id} />
      </div>
    </main>
  )
}

// Component hiển thị bài viết liên quan
function RelatedPosts({ currentId }: { currentId: number }) {
  const [related, setRelated] = useState<News[]>([])
  useEffect(() => {
    fetch('http://localhost:5000/news')
      .then(res => res.json())
      .then(data => {
        // Map lại dữ liệu và loại bỏ bài hiện tại
        const mapped = data
          .filter((item: any) => item.id !== currentId)
          .map((item: any) => ({
            id: item.id,
            title: item.name,
            image: item.images,
            date: item.createdAt ? item.createdAt.slice(0, 10) : '',
            views: 0,
            readTime: '5 phút',
            description: item.description,
            category: '',
          }))
          .slice(0, 3) // lấy 3 bài liên quan
        setRelated(mapped)
      })
  }, [currentId])

  return (
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
      <div style={{background: '#fff', borderRadius: 16, padding: 16}}>
        <b style={{fontSize: 18}}>Bài viết liên quan</b>
        <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16}}>
          {related.map(item => (
            <a key={item.id} href={`/news/${item.id}`} style={{display: 'flex', gap: 12, textDecoration: 'none', color: 'inherit', alignItems: 'center'}}>
              <img src={item.image} alt={item.title} style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8}} />
              <div>
                <div style={{fontWeight: 600, fontSize: 15, marginBottom: 4}}>{item.title}</div>
                <div style={{color: '#888', fontSize: 13}}>{item.date}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
