import { Suspense } from "react";
import LoginForm from "./LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main
      className="main-content d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh", background: "#f9fafb" }}
    >
      <div
        className="login-card p-4 p-md-5 rounded-4 shadow bg-white"
        style={{
          maxWidth: 1040, // giống trang đăng ký
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div className="text-center mb-4">
          <Image
            src="/client/images/logo.jpg"
            alt="Tạp Hóa Xanh"
            width={64}
            height={64}
            className="rounded-full shadow-md"
          />
          <h2
            className="fw-bold mt-3 mb-2"
            style={{ color: "#22c55e", fontSize: "2.1rem" }}
          >
            Đăng nhập
          </h2>
          <div className="text-muted mb-2" style={{ fontSize: 16 }}>
            Chào mừng bạn đến với Tạp Hóa Xanh
          </div>
        </div>
        <Suspense fallback={<p>Đang tải...</p>}>
          <LoginForm />
        </Suspense>
        <div className="login-links">
          <a href="#" style={{ color: "#22c55e", fontSize: 15 }}>
            Quên mật khẩu?
          </a>
          <a href="/register" style={{ color: "#22c55e", fontSize: 15 }}>
            Đăng ký tài khoản
          </a>
        </div>
      </div>
    </main>
  );
}
