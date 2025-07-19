"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import "../globals.css"
import Footer from '../components/Footer';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <div className={`header-index custom-header${scrolled ? ' scrolled' : ''}`}>  
        <nav className="navbar navbar-expand-lg py-2">
          <div className="container d-flex align-items-center justify-content-between">
            <Link className="navbar-brand d-flex align-items-center gap-2" href="/home">
              <img className="img-logo" src="/client/images/logo.png" alt="Tạp Hóa Xanh Logo" width={56} height={56} style={{borderRadius: '50%', boxShadow: '0 2px 8px rgba(34,197,94,0.10)'}} />
              <span className="fw-bold fs-4" style={{letterSpacing: 1}}>Tạp Hóa Xanh</span>
            </Link>
            
            {/* Marquee chạy chữ */}
            <div className="header-marquee flex-grow-1 d-none d-lg-block mx-3">
              <div className="marquee-text">
                🚚 Miễn phí giao hàng toàn quốc cho đơn từ 300.000đ! | 🎁 Ưu đãi thành viên mới lên đến 50.000đ | ☎️ Hotline: 0901 234 567
              </div>
            </div>

            <div className="d-none d-lg-flex align-items-center gap-4">
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/home">
                <i className="fa-solid fa-house"></i> Trang Chủ
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/product">
                <i className="fa-solid fa-store"></i> Sản Phẩm
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/posts">
                <i className="fa-solid fa-newspaper"></i> Bài Viết
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/contact">
                <i className="fa-solid fa-envelope"></i> Liên Hệ
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/cart">
                <i className="fa-solid fa-cart-shopping"></i> Giỏ Hàng
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/login">
                <i className="fa-solid fa-right-to-bracket"></i> Đăng Nhập
              </Link>
            </div>
            <button className="navbar-toggler text-highline border-0 pe-0 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#menu" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
              <i className="fa-solid fa-bars fa-2x"></i>
            </button>
          </div>
        </nav>
      </div>
      <div className="header-slogan d-none d-lg-block fst-italic text-white">
        "Tươi sạch mỗi ngày - Giao nhanh tận nhà"
      </div>
      <main className="main-content">{children}</main>
      <Footer />
    </>
  )
}