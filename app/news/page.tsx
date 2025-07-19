'use client'
import { useEffect, useState } from 'react'
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

export default function PostPage() {
  const [news, setNews] = useState<News[]>([])
  // Các state cho sidebar (category, trending, gallery, tags) nếu cần

  useEffect(() => {
    fetch('http://localhost:5000/news')
      .then(res => res.json())
      .then(data => {
        // Map lại dữ liệu cho đúng với type News ở FE
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.name, // name -> title
          image: item.images, // images -> image
          date: item.createdAt ? item.createdAt.slice(0, 10) : '', // lấy ngày tạo
          views: 0, // Nếu chưa có trường views thì để tạm 0
          readTime: '5 phút', // Nếu chưa có trường này thì hardcode
          description: item.description,
          category: '', // Nếu chưa có category thì để rỗng hoặc hardcode
        }));
        setNews(mapped);
      });
  }, []);

  return (
    <main className="main-content">
      <div className="container py-4" style={{display: 'flex', gap: 32}}>
        {/* Main content */}
        <div style={{flex: 3}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
            {news.map(item => (
              <Link href={`/news/${item.id}`} key={item.id} style={{textDecoration: 'none', color: 'inherit'}}>
                <div style={{
                  background: '#fff',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px #eee',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}>
                  <img src={item.image} alt={item.title} style={{width: '100%', height: 120, objectFit: 'cover', borderRadius: 8}} />
                  <div style={{margin: '8px 0'}}>
                    <span style={{background: '#ffe9b3', color: '#bfa100', borderRadius: 4, padding: '2px 8px', fontSize: 12}}>Side dish</span>
                  </div>
                  <h5 style={{fontWeight: 700}}>{item.title}</h5>
                  <div style={{color: '#888', fontSize: 14}}>
                    {item.date} · {item.views} Views · {item.readTime} read
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Sidebar */}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
          <div style={{background: '#fff', borderRadius: 16, padding: 16}}>
            <b>Category</b>
            <div style={{marginTop: 8}}>
              {/* Map category ở đây */}
              <div style={{color: '#1dbf73', marginBottom: 4}}>Milk & Dairies</div>
              <div style={{color: '#1dbf73', marginBottom: 4}}>Clothing</div>
              <div style={{color: '#1dbf73', marginBottom: 4}}>Pet Foods</div>
              <div style={{color: '#1dbf73', marginBottom: 4}}>Baking material</div>
              <div style={{color: '#1dbf73'}}>Fresh Fruit</div>
            </div>
          </div>
          <div style={{background: '#fff', borderRadius: 16, padding: 16}}>
            <b>Trending Now</b>
            <div style={{marginTop: 8}}>
              {/* Map trending ở đây */}
              <div>Chen Cardigan<br /><span style={{color: '#1dbf73'}}>$99.50</span></div>
              <div>Chen Sweater<br /><span style={{color: '#1dbf73'}}>$89.50</span></div>
              <div>Colorful Jacket<br /><span style={{color: '#1dbf73'}}>$25.50</span></div>
              <div>Lorem, ipsum<br /><span style={{color: '#1dbf73'}}>$25</span></div>
            </div>
          </div>
          <div style={{background: '#fff', borderRadius: 16, padding: 16}}>
            <b>Gallery</b>
            <div style={{display: 'flex', gap: 8, marginTop: 8}}>
              {/* Map gallery ở đây */}
              <img src="/gallery1.jpg" alt="Gallery 1" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 8}} />
              <img src="/gallery2.jpg" alt="Gallery 2" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 8}} />
              <img src="/gallery3.jpg" alt="Gallery 3" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 8}} />
              <img src="/gallery4.jpg" alt="Gallery 4" style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 8}} />
            </div>
          </div>
          <div style={{background: '#fff', borderRadius: 16, padding: 16}}>
            <b>Popular Tags</b>
            <div style={{marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8}}>
              <span style={{background: '#f3f3f3', borderRadius: 8, padding: '4px 12px'}}>Cabbage</span>
              <span style={{background: '#f3f3f3', borderRadius: 8, padding: '4px 12px'}}>Broccoli</span>
              <span style={{background: '#f3f3f3', borderRadius: 8, padding: '4px 12px'}}>Smoothie</span>
              <span style={{background: '#f3f3f3', borderRadius: 8, padding: '4px 12px'}}>Fruit</span>
              <span style={{background: '#f3f3f3', borderRadius: 8, padding: '4px 12px'}}>Salad</span>
              <span style={{background: '#f3f3f3', borderRadius: 8, padding: '4px 12px'}}>Appetizer</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
