import { Suspense } from 'react'
import Link from 'next/link'
import RegisterForm from './registerForm'

export default function RegisterPage() {
  return (
    <>
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section">
        <div className="container">
          <h3 className="text-center">Đăng Ký</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link href="/">Trang Chủ</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Đăng Ký</li>
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
            <img src="/client/images/logo.png" alt="Tạp Hóa Xanh" width={64} height={64} style={{borderRadius: '50%', boxShadow: '0 2px 8px rgba(34,197,94,0.10)'}} />
            <h2 className="fw-bold mt-3 mb-2" style={{color: '#22c55e', fontSize: '2.1rem'}}>Đăng ký</h2>
            <div className="text-muted mb-2" style={{fontSize: 16}}>Tạo tài khoản mới tại Tạp Hóa Xanh</div>
          </div>
          <Suspense fallback={<p>Đang tải...</p>}>
            <RegisterForm />
          </Suspense>
          <div className="login-links">
            <a href="/login" style={{color: '#22c55e', fontSize: 15}}>Đã có tài khoản? Đăng nhập</a>
          </div>
        </div>
      </main>
    </>
  )
}