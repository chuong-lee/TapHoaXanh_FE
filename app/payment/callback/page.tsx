"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import Link from "next/link";

interface PaymentCallbackResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Đang xử lý thanh toán...");

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Lấy tất cả query params từ URL
        const params = new URLSearchParams(searchParams.toString());

        // Tạo object chứa tất cả params
        const queryParams: Record<string, string> = {};
        params.forEach((value, key) => {
          queryParams[key] = value;
        });

        console.log("Payment callback params:", queryParams);

        // Kiểm tra xem có TxnRef không
        if (queryParams.TxnRef) {
          console.log("TxnRef found:", queryParams.TxnRef);
        }

        // Kiểm tra xem có vnp_ResponseCode không (VNPay response code)
        if (queryParams.vnp_ResponseCode) {
          console.log("VNPay Response Code:", queryParams.vnp_ResponseCode);

          // Nếu response code là 00 thì thanh toán thành công
          if (queryParams.vnp_ResponseCode === "00") {
            console.log("Payment successful according to VNPay");
          } else {
            console.log("Payment failed according to VNPay");
          }
        }

        // Gọi API callback với params
        const response = await api.get<PaymentCallbackResponse>(
          "/payment/vnpay-callback",
          {
            params: queryParams,
          }
        );

        const responseData = response.data;

        // Kiểm tra kết quả
        if (responseData.success) {
          setStatus("success");
          setMessage(
            "Thanh toán thành công! Đơn hàng của bạn đã được xác nhận."
          );

          // Xóa thông tin đơn hàng pending
          localStorage.removeItem("pending_payment_order");
        } else {
          setStatus("error");
          setMessage(
            responseData.message || "Thanh toán thất bại. Vui lòng thử lại."
          );
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        setStatus("error");
        setMessage(
          "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ."
        );
      }
    };

    handlePaymentCallback();
  }, [searchParams]);

  return (
    <main className="main-content">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center p-5">
                {status === "loading" && (
                  <>
                    <div
                      className="spinner-border text-primary mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="text-primary mb-3">Đang xử lý thanh toán</h4>
                    <p className="text-muted">{message}</p>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div
                      className="text-success mb-3"
                      style={{ fontSize: "4rem" }}
                    >
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                      >
                        <circle cx="32" cy="32" r="32" fill="#4caf50" />
                        <path
                          d="M18 34L28 44L46 26"
                          stroke="#fff"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h4 className="text-success mb-3">
                      Thanh toán thành công!
                    </h4>
                    <p className="text-muted mb-4">{message}</p>
                    <div className="d-grid gap-2">
                      <Link href="/orders" className="btn btn-primary">
                        <i className="fas fa-shopping-bag me-2"></i>
                        Xem đơn hàng
                      </Link>
                      <Link href="/" className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Về trang chủ
                      </Link>
                    </div>
                  </>
                )}

                {status === "error" && (
                  <>
                    <div
                      className="text-danger mb-3"
                      style={{ fontSize: "4rem" }}
                    >
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 64 64"
                        fill="none"
                      >
                        <circle cx="32" cy="32" r="32" fill="#f44336" />
                        <path
                          d="M22 22L42 42M42 22L22 42"
                          stroke="#fff"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <h4 className="text-danger mb-3">Thanh toán thất bại</h4>
                    <p className="text-muted mb-4">{message}</p>
                    <div className="d-grid gap-2">
                      <a href="/checkout" className="btn btn-primary">
                        <i className="fas fa-redo me-2"></i>
                        Thử lại
                      </a>
                      <Link href="/" className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Về trang chủ
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="main-content">
          <div className="container py-5">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center p-5">
                    <div
                      className="spinner-border text-primary mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4 className="text-primary mb-3">Đang tải...</h4>
                    <p className="text-muted">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
