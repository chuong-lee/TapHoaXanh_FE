'use client'

import { Suspense } from "react";
import VerifyEmailForm from "../verify-email/VerifyEmailForm";
import Image from "next/image";

export default function VerifyEmailPage() {
  return (
    <main
      className="main-content d-flex align-items-center justify-content-center"
      style={{ 
        minHeight: "100vh", 
        background: "#f9fafb",
        padding: "10px 0"
      }}
    >
      
      <div
        className="login-card p-4 p-md-5 rounded-4 shadow-lg bg-white"
        style={{
          maxWidth: "95%",
          width: "100%",
          margin: "0 auto",
          border: "none",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          background: "#ffffff"
        }}
      >
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .card-enter {
            animation: slideUp 0.6s ease-out;
          }
        `}</style>
        
        <div className="text-center mb-4 card-enter" style={{ width: "100%" }}>
          <div style={{
            width: "100px",
            height: "100px",
            margin: "0 auto 20px",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)"
          }}>
            <Image
              src="/client/images/logo.jpg"
              alt="Tạp Hóa Xanh"
              width={80}
              height={80}
              className="rounded-full"
              style={{ border: "3px solid white" }}
            />
          </div>
          
          <h1
            className="fw-bold mb-3 text-center"
            style={{ 
              color: "#1f2937", 
              fontSize: "2.2rem",
              letterSpacing: "-0.5px",
              textAlign: "center",
              width: "100%"
            }}
          >
            Xác thực email
          </h1>
          <p 
            className="text-muted mb-0 text-center" 
            style={{ 
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "1.5",
              textAlign: "center",
              width: "100%",
              margin: "0 auto"
            }}
          >
            Hoàn tất quá trình đăng ký tài khoản
          </p>
        </div>
        
        <Suspense fallback={
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải...</p>
          </div>
        }>
          <VerifyEmailForm />
        </Suspense>
        
        <div className="text-center mt-4">
          <a 
            href="/login" 
            style={{ 
              color: "#6b7280", 
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#22c55e";
              (e.target as HTMLElement).style.transform = "translateX(-5px)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "#6b7280";
              (e.target as HTMLElement).style.transform = "translateX(0)";
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    </main>
  );
}
