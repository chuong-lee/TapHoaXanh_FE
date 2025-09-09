import { Suspense } from "react";
import ResetPasswordForm from "../reset-password/ResetPasswordForm";
import Image from "next/image";

export default function ResetPasswordPage() {
  return (
    <main
      className="main-content d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh", background: "#f9fafb" }}
    >
      <div
        className="login-card p-4 p-md-5 rounded-4 shadow bg-white"
        style={{
          maxWidth: 500,
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
            Đặt lại mật khẩu
          </h2>
          <div className="text-muted mb-2" style={{ fontSize: 16 }}>
            Nhập mật khẩu mới của bạn
          </div>
        </div>
        <Suspense fallback={<p>Đang tải...</p>}>
          <ResetPasswordForm />
        </Suspense>
        <div className="text-center mt-3">
          <a href="/login" style={{ color: "#22c55e", fontSize: 15 }}>
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </main>
  );
}
