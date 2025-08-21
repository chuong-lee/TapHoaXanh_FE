'use client'
import Link from 'next/link'

export default function PostPage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Bài Viết</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/news">Tin Tức</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Bài Viết</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main-content">
        <div>
          <h1>Post Page</h1>
          <p>This is the post page.</p>
        </div>
      </main>
    </>
  );
}