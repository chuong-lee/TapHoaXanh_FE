"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";

import { useAuth } from "../context/AuthContext";
import { useCart } from "@/context/CartContext";
import LogoutButton from "./logout";

const Header = () => {
  const { fetchCart, cart } = useCart();
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <>
      <div className="header fixed-top">
        <div className="nav navbar navbar-expand-lg" id="mainNavbar">
          <div className="container">
            <Link className="navbar-brand" href="/">
              <Image 
                className="img-logo" 
                src="/client/images/logo.png" 
                alt="Tạp Hóa Xanh Logo"
                width={50}
                height={50}
              />
            </Link>
            
            {/* Offcanvas Menu */}
            <div className="offcanvas offcanvas-start" id="menu" tabIndex={-1} aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">
                  <Image 
                    className="img-logo" 
                    src="/client/images/logo.svg" 
                    alt="Tạp Hóa Xanh Logo"
                    width={40}
                    height={40}
                  />
                </h5>
                <button 
                  className="btn p-0 border-0" 
                  type="button" 
                  data-bs-dismiss="offcanvas" 
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark text-highline-2 fa-2x"></i>
                </button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-center flex-grow-1 pe-2 gap-3 gap-lg-5">
                  <li className="nav-item">
                    <Link className="nav-link me-lg-2 active" aria-current="page" href="/">
                      Trang Chủ
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link me-lg-2" href="/product">
                      Cửa Hàng
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link className="nav-link me-lg-2" href="/news">
                      Bài Viết
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link me-lg-2" href="/about-us">
                      Về Chúng Tôi
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link me-lg-2" href="/contact">
                      Liên hệ
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link me-lg-2 border-0 bg-transparent" 
                      onClick={async () => {
                        await fetchCart();
                        router.push("/cart");
                      }}
                      title="Giỏ Hàng"
                    >
                      <i className="fa-solid fa-cart-shopping"></i>
                      {cart.length > 0 && (
                        <span className="badge bg-danger ms-1">{cart.length}</span>
                      )}
                    </button>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link me-lg-2" href="/wishlist" title="Yêu thích">
                      <i className="fa-solid fa-heart"></i>
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <button 
                      className="nav-link me-lg-2 dropdown-toggle border-0 bg-transparent" 
                      role="button" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                    >
                      <i className="fa-solid fa-user"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {profile ? (
                        <>
                          <li>
                            <Link className="dropdown-item" href="/profile">
                              Cá Nhân
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/orders">
                              Đơn hàng
                            </Link>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <div className="px-3 py-1">
                              <LogoutButton />
                            </div>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link className="dropdown-item" href="/login">
                              Đăng nhập
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" href="/register">
                              Đăng ký
                            </Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Mobile Toggle Button */}
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
  );
};

export default Header;
