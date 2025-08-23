import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Đăng Nhập</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Đăng Nhập</li>
            </ol>
          </nav>
        </div>
      </div>

      <main className="main-content d-flex align-items-center justify-content-center" style={{minHeight: '60vh', background: '#f9fafb'}}>
        <div
          className="login-card p-4 p-md-5 rounded-4 shadow bg-white"
          style={{
            maxWidth: 1040,
            width: '100%',
            margin: '0 auto'
          }}
        >
          <div className="text-center mb-4">
            <Image src="/client/images/logo.png" alt="Tạp Hóa Xanh" width={64} height={64} style={{borderRadius: '50%', boxShadow: '0 2px 8px rgba(34,197,94,0.10)'}} />
            <h2 className="fw-bold mt-3 mb-2" style={{color: '#22c55e', fontSize: '2.1rem'}}>Đăng nhập</h2>
            <div className="text-muted mb-2" style={{fontSize: 16}}>Chào mừng bạn đến với Tạp Hóa Xanh</div>
          </div>
          <Suspense fallback={<p>Đang tải...</p>}>
            <LoginForm />
          </Suspense>
          <div className="login-links">
            <a href="#" style={{color: '#22c55e', fontSize: 15}}>Quên mật khẩu?</a>
            <a href="/register" style={{color: '#22c55e', fontSize: 15}}>Đăng ký tài khoản</a>
          </div>
        </div>
      </main>
    </>
  )
}