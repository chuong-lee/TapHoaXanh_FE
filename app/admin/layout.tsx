"use client"
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'fa-solid fa-chart-line'
    },
    {
      name: 'Quản lý đơn hàng',
      href: '/admin/orders',
      icon: 'fa-solid fa-shopping-cart'
    },
    {
      name: 'Quản lý sản phẩm',
      href: '/admin/products',
      icon: 'fa-solid fa-box'
    },
    {
      name: 'Quản lý người dùng',
      href: '/admin/users',
      icon: 'fa-solid fa-users'
    },
    {
      name: 'Quản lý danh mục',
      href: '/admin/categories',
      icon: 'fa-solid fa-tags'
    }
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`bg-dark text-white ${sidebarOpen ? 'd-block' : 'd-none'} d-md-block`} 
           style={{width: '250px', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1000}}>
        <div className="p-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 text-success">
              <i className="fa-solid fa-leaf me-2"></i>
              Admin Panel
            </h5>
            <button 
              className="btn btn-outline-light btn-sm d-md-none"
              onClick={() => setSidebarOpen(false)}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
          
          <nav className="nav flex-column">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link text-white ${pathname === item.href ? 'bg-success' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${item.icon} me-2`}></i>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1" style={{marginLeft: '250px'}}>
        {/* Top navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div className="container-fluid">
            <button 
              className="btn btn-outline-secondary d-md-none me-2"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            
            <span className="navbar-brand mb-0 h1">Tạp Hóa Xanh - Admin</span>
            
            <div className="navbar-nav ms-auto">
              <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="fa-solid fa-user me-1"></i>
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#"><i className="fa-solid fa-cog me-2"></i>Cài đặt</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="/"><i className="fa-solid fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <div style={{minHeight: 'calc(100vh - 60px)'}}>
          {children}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="d-md-none position-fixed" 
          style={{
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            zIndex: 999
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}