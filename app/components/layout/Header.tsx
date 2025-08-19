"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { cart } = useCart();
  const router = useRouter();
  const { profile } = useAuth();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Theo dõi scroll để thay đổi màu header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  


  return (
    <>
      <div className={`header fixed-top ${isScrolled ? 'scrolled' : ''}`}> 
        <div className="nav navbar navbar-expand-lg" id="mainNavbar">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <img className="img-logo" src="/client/images/logo.png" alt="Tạp Hóa Xanh"/>
              </Link>
            
            <div className="offcanvas offcanvas-start" id="menu" tabIndex={-1} aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">
                  <img className="img-logo" src="/client/images/logo.svg" alt="Tạp Hóa Xanh"/>
                </h5>
                <button className="btn p-0 border-0" type="button" data-bs-dismiss="offcanvas" aria-label="Close">
                  <i className="fa-solid fa-xmark text-highline-2 fa-2x"></i>
                </button>
            </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-center flex-grow-1 pe-2 gap-3 gap-lg-5">
                  <li className="nav-item">
                    <Link 
                      className={`nav-link me-lg-2 ${pathname === '/' ? 'active' : ''}`} 
                      href="/"
                    >
                Trang Chủ
              </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link me-lg-2 ${pathname === '/product' ? 'active' : ''}`} 
                      href="/product"
                    >
                      Cửa Hàng
              </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link me-lg-2 ${pathname === '/news' ? 'active' : ''}`} 
                      href="/news"
                    >
                Bài Viết
              </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link me-lg-2 ${pathname === '/about-us' ? 'active' : ''}`} 
                      href="/about-us"
                    >
                Về Chúng Tôi
              </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className={`nav-link me-lg-2 ${pathname === '/contact' ? 'active' : ''}`} 
                      href="/contact"
                    >
                      Liên hệ
              </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="nav-link me-lg-2 position-relative" 
                      href="/cart"
                title="Giỏ Hàng"
              >
                      <i className="fa-solid fa-cart-shopping"></i>
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
                    </Link>
                  </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link me-lg-2 dropdown-toggle" 
                      href="#" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-user"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                      {profile ? (
                        <>
                    <li>
                      <Link className="dropdown-item" href="/profile">Cá Nhân</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <LogoutDropdownItem />
                    </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link className="dropdown-item" href="/login">Đăng Nhập</Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/register">Đăng Ký</Link>
                          </li>
                        </>
                      )}
                  </ul>
                </li>
                </ul>
              </div>
            </div>
            
            <button 
              className="navbar-toggler text-highline border-0 pe-0" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#menu" 
              aria-controls="offcanvasNavbar" 
              aria-label="Toggle navigation"
            >
              <i className="fa-solid fa-bars fa-2x"></i>
            </button>
          </div>
        </div>
      </div>
      

    </>
  )
}

// Component LogoutButton tùy chỉnh cho dropdown
function LogoutDropdownItem() {
  const { setProfile } = useAuth();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      
      // Update auth context
      setProfile(null);
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <button 
      className="dropdown-item text-start w-100 border-0 bg-transparent"
      onClick={handleLogout} 
      disabled={logoutLoading}
      style={{
        cursor: logoutLoading ? 'not-allowed' : 'pointer',
        opacity: logoutLoading ? 0.6 : 1
      }}
    >
      {logoutLoading ? (
        <>
          <i className="fa-solid fa-spinner fa-spin me-2"></i>
          Đang đăng xuất...
        </>
      ) : (
        <>
          <i className="fa-solid fa-sign-out-alt me-2"></i>
          Đăng Xuất
        </>
      )}
    </button>
  );
}

export default Header;
