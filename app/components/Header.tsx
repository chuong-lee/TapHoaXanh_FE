"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import "bootstrap/dist/css/bootstrap.min.css"
import "../globals.css"
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './logout';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const router = useRouter();
  const { profile } = useAuth();
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Hàm kiểm tra đăng nhập và chuyển hướng
  const handleProtectedRoute = (route: string) => {
    router.push(route);
  };

  return (
    <>
      <div className={`header-index custom-header${scrolled ? ' scrolled' : ''}`}>  
        <nav className="navbar navbar-expand-lg py-2">
          <div className="container d-flex align-items-center justify-content-between" style={{gap: 0, minHeight: 70}}>
            {/* Logo + Tên */}
            <div className="d-flex align-items-center gap-2" style={{minWidth: 220}}>
              <Link className="navbar-brand d-flex align-items-center gap-2 p-0 m-0" href="/home" style={{gap: 10}}>
                <img
                  src="/client/images/logo.png"
                  alt="Tạp Hóa Xanh Logo"
                  width={48}
                  height={48}
                  style={{borderRadius: '50%', boxShadow: '0 2px 8px rgba(34,197,94,0.10)', objectFit: 'cover', background: '#fff', marginRight: 10, verticalAlign: 'middle'}}
                />
                <span className="fw-bold fs-4" style={{letterSpacing: 1, color: '#fff'}}>Tạp Hóa Xanh</span>
              </Link>
            </div>
            {/* Menu */}
            <div className="d-none d-lg-flex align-items-center justify-content-center flex-nowrap" style={{flex: 1, gap: 36, marginLeft: '120px'}}>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/">
                Trang Chủ
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/product">
                Sản Phẩm
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/news">
                Bài Viết
              </Link>
              <Link className="nav-link fw-semibold d-flex align-items-center gap-1" href="/contact">
                Liên Hệ
              </Link>
              <button 
                className="nav-link fw-semibold d-flex align-items-center gap-1 border-0 bg-transparent"
                onClick={() => handleProtectedRoute('/orders')}
                style={{color: scrolled ? '#22c55e' : 'white'}}
              >
                Đơn hàng
              </button>
            </div>
            {/* Icon */}
            <div className="header-icons d-flex align-items-center gap-4" style={{minWidth: 100, justifyContent: 'flex-end', marginLeft: '30px'}}>
              <button 
                className="nav-link fw-semibold d-flex align-items-center p-0 position-relative border-0 bg-transparent"
                onClick={() => handleProtectedRoute('/cart')}
                title="Giỏ Hàng"
              >
                {/* SVG Giỏ hàng */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* Badge số lượng sản phẩm */}
                {cartItemCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      backgroundColor: '#e11d48',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translate(-50%, -50%)',
                      border: '2px solid white'
                    }}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
              {profile ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id="dropdown-user" className="p-0 border-0 bg-transparent" style={{boxShadow: 'none'}}>
                    {profile.image ? (
                      <img src={profile.image} alt="avatar" width={32} height={32} style={{borderRadius: '50%', objectFit: 'cover', background: '#eee'}} />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="7" r="4" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} href="/profile">Thông tin người dùng</Dropdown.Item>
                    <Dropdown.Divider />
                    <div className="px-3 py-1"><LogoutButton /></div>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Link className="nav-link fw-semibold d-flex align-items-center p-0" href="/login" title="Đăng Nhập">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke={scrolled ? "#22c55e" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
            </div>
            {/* Nút menu mobile */}
            <button className="navbar-toggler text-highline border-0 pe-0 d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#menu" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
              <i className="fa-solid fa-bars fa-2x"></i>
            </button>
          </div>
        </nav>
      </div>
      <div className="header-slogan d-none d-lg-block fst-italic text-white">
        "Tươi sạch mỗi ngày - Giao nhanh tận nhà"
      </div>
    </>
  )
}

export default Header;
