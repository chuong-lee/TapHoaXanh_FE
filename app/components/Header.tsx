"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";

import { useAuth } from "../context/AuthContext";
import LogoutButton from "./logout";
import Avatar from "./Avatar";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { fetchCart, cart } = useCart();
  const router = useRouter();
  const { profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".avatar-dropdown-container")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Hàm kiểm tra đăng nhập và chuyển hướng
  const handleProtectedRoute = (route: string) => {
    router.push(route);
  };

  return (
    <>
      <div
        className={`header-index custom-header${scrolled ? " scrolled" : ""}`}
      >
        <nav className="navbar navbar-expand-lg py-2">
          <div
            className="container d-flex align-items-center justify-content-between"
            style={{ gap: 0, minHeight: 70 }}
          >
            <div className="d-flex align-items-center gap-2">
              <Link
                className="navbar-brand d-flex align-items-center gap-2 p-0 m-0"
                href="/"
                style={{ gap: 10 }}
              >
                <Image
                  src="/client/images/logo.jpg"
                  alt="Tạp Hóa Xanh Logo"
                  width={48}
                  height={48}
                  style={{
                    borderRadius: "50%",
                    boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                    objectFit: "cover",
                    background: "#fff",
                    marginRight: 10,
                    verticalAlign: "middle",
                  }}
                />
                <span
                  className="fw-bold fs-4"
                  style={{ letterSpacing: 1, color: "#fff" }}
                >
                  Tạp Hóa Xanh
                </span>
              </Link>
            </div>
            {/* Menu */}
            <div
              className="d-none d-lg-flex align-items-center justify-content-center flex-nowrap"
              style={{ flex: 1, gap: 36, marginLeft: "120px" }}
            >
              <Link
                className="nav-link fw-semibold d-flex align-items-center gap-1"
                href="/"
              >
                Trang Chủ
              </Link>
              <Link
                className="nav-link fw-semibold d-flex align-items-center gap-1"
                href="/product"
              >
                Sản Phẩm
              </Link>
              <Link
                className="nav-link fw-semibold d-flex align-items-center gap-1"
                href="/news"
              >
                Bài Viết
              </Link>
              <Link
                className="nav-link fw-semibold d-flex align-items-center gap-1"
                href="/contact"
              >
                Liên Hệ
              </Link>
              {profile && (
                <button
                  className="nav-link fw-semibold d-flex align-items-center gap-1 border-0 bg-transparent"
                  onClick={() => handleProtectedRoute("/orders")}
                  style={{ color: scrolled ? "#22c55e" : "white" }}
                >
                  Đơn hàng
                </button>
              )}
            </div>
            {/* Icon */}
            <div
              className="header-icons d-flex align-items-center gap-4"
              style={{
                minWidth: 100,
                justifyContent: "flex-end",
                marginLeft: "30px",
              }}
            >
              <button
                className="nav-link fw-semibold d-flex align-items-center p-0 position-relative border-0 bg-transparent"
                onClick={async () => {
                  await fetchCart();
                  router.push("/cart");
                }}
                title="Giỏ Hàng"
              >
                {/* SVG Giỏ hàng */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                    stroke={scrolled ? "#22c55e" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                    stroke={scrolled ? "#22c55e" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                    stroke={scrolled ? "#22c55e" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {/* Badge số lượng sản phẩm */}
                {cart.length > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                    style={{
                      backgroundColor: "#e11d48",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      minWidth: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transform: "translate(-50%, -50%)",
                      border: "2px solid white",
                    }}
                  >
                    {cart.length || "99+"}
                  </span>
                )}
              </button>
              {profile ? (
                <div className="avatar-dropdown-container">
                  <div
                    className="avatar-trigger"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <Avatar
                      image={profile.image}
                      name={profile.name}
                      size={55}
                      className="border-2 border-white"
                    />
                  </div>
                  {showDropdown && (
                    <div className="avatar-dropdown-menu">
                      <Link
                        href="/profile"
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        Thông tin người dùng
                      </Link>
                      <div className="dropdown-divider"></div>
                      <div className="px-3 py-1">
                        <LogoutButton />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-3">
                  <Link
                    className="nav-link fw-semibold d-flex align-items-center p-0"
                    href="/login"
                    title="Đăng Nhập"
                  >
                    <span style={{ color: scrolled ? "#22c55e" : "white" }}>
                      Đăng nhập
                    </span>
                  </Link>
                  <Link
                    className="nav-link fw-semibold d-flex align-items-center p-0"
                    href="/register"
                    title="Đăng Ký"
                  >
                    <span style={{ color: scrolled ? "#22c55e" : "white" }}>
                      Đăng ký
                    </span>
                  </Link>
                </div>
              )}
            </div>
            {/* Nút menu mobile */}
            <button
              className="navbar-toggler text-highline border-0 pe-0 d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#menu"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
            >
              <i className="fa-solid fa-bars fa-2x"></i>
            </button>
          </div>
        </nav>
      </div>
      <div className="header-slogan d-none d-lg-block fst-italic text-white">
        &ldquo;Tươi sạch mỗi ngày - Giao nhanh tận nhà&rdquo;
      </div>
    </>
  );
};

export default Header;
