"use client";
import { useState, useRef, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { handleError } from "@/helpers/handleError";

function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [verifySuccess, _setVerifySuccess] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Countdown timer cho resend email
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Lưu thông tin đăng ký để sử dụng cho login
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";

      // Đăng ký tài khoản
      await api.post("/auth/register", {
        name: nameRef.current?.value || "",
        phone: phoneRef.current?.value || "",
        email: email,
        password: password,
        confirmPassword: confirmPasswordRef.current?.value || "",
      });

      // Hiển thị popup xác nhận email thay vì chuyển trang
      setRegisteredEmail(email);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm gửi lại email xác thực
  const handleResendVerification = async () => {
    if (resendCooldown > 0) return; // Chặn spam

    setResendSuccess("");
    setIsResending(true);

    try {
      await api.post("/auth/resend-verification", {
        email: registeredEmail,
      });
      setResendSuccess(
        "Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư và spam."
      );
      setResendCooldown(60); // Bắt đầu countdown 60 giây
    } catch (err) {
      const error = err as Error & {
        response?: { data?: { message?: string } };
      };
      setResendSuccess(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="mx-auto col-md-6 col-lg-5 col-12"
    >
      <div className="mb-3">
        <label className="form-label">Tên người dùng</label>
        <input type="text" className="form-control" ref={nameRef} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Số điện thoại</label>
        <input type="tel" className="form-control" ref={phoneRef} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" ref={emailRef} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Mật khẩu</label>
        <input
          type="password"
          className="form-control"
          ref={passwordRef}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Xác nhận mật khẩu</label>
        <input
          type="password"
          className="form-control"
          ref={confirmPasswordRef}
          required
        />
      </div>
      {isLoading ? (
        <button type="button" className="btn btn-primary w-100" disabled>
          Đang đăng ký...
        </button>
      ) : (
        <button type="submit" className="btn btn-primary w-100">
          Đăng Ký
        </button>
      )}

      {error && (
        <div
          className={`alert mt-3 ${
            error.includes("thành công") ? "alert-success" : "alert-danger"
          }`}
        >
          {error}
        </div>
      )}

      {/* Modal xác nhận email */}
      {showSuccessModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác thực email</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Thông báo thành công */}
                <div className="alert alert-success mb-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "#22c55e",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "18px",
                        }}
                      >
                        ✓
                      </div>
                    </div>
                    <div>
                      <h5 className="alert-heading mb-1 fw-bold">
                        Đăng ký thành công!
                      </h5>
                      <p className="mb-0">
                        Chúng tôi đã gửi email xác thực đến{" "}
                        <strong>{registeredEmail}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hướng dẫn */}
                <div className="alert alert-info mb-4">
                  <h6 className="alert-heading mb-3 fw-bold">
                    Hướng dẫn xác thực
                  </h6>
                  <div className="row g-2">
                    <div className="col-md-3 col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="badge bg-primary mb-2">1</div>
                        <small>Kiểm tra hộp thư email</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="badge bg-primary mb-2">2</div>
                        <small>Tìm email từ &quot;Tạp Hóa Xanh&quot;</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="badge bg-primary mb-2">3</div>
                        <small>Click vào link xác thực</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="text-center p-2 border rounded">
                        <div className="badge bg-primary mb-2">4</div>
                        <small>Quay lại đăng nhập</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form gửi lại email xác thực */}
                {!verifySuccess && (
                  <div className="card mb-4">
                    <div className="card-body">
                      <h6 className="card-title fw-bold">Xác thực email</h6>
                      <p className="card-text small text-muted mb-3">
                        Chúng tôi đã gửi email xác thực đến{" "}
                        <strong>{registeredEmail}</strong>. Vui lòng click vào
                        link trong email để xác thực tài khoản.
                      </p>

                      <div>
                        {/* Email hiển thị */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold">
                            Email đăng ký
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            value={registeredEmail}
                            readOnly
                          />
                        </div>

                        {/* Button gửi lại */}
                        <div className="d-grid">
                          {isResending ? (
                            <button
                              type="button"
                              className="btn"
                              disabled
                              style={{
                                background:
                                  "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontWeight: "600",
                                fontSize: "16px",
                                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                                opacity: "0.7",
                              }}
                            >
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Đang gửi...
                            </button>
                          ) : resendCooldown > 0 ? (
                            <button
                              type="button"
                              className="btn"
                              disabled
                              style={{
                                background: "white",
                                color: "#6b7280",
                                border: "2px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontWeight: "600",
                                fontSize: "16px",
                                opacity: "0.7",
                              }}
                            >
                              <i className="bi bi-clock me-2"></i>
                              Gửi lại sau {resendCooldown}s
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn"
                              style={{
                                background:
                                  "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                padding: "12px 24px",
                                fontWeight: "600",
                                fontSize: "16px",
                                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                                transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                  "0 6px 16px rgba(34, 197, 94, 0.4)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(34, 197, 94, 0.3)";
                              }}
                              onClick={handleResendVerification}
                            >
                              <i className="bi bi-envelope me-2"></i>
                              Gửi lại email xác thực
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Success message */}
                      {resendSuccess && (
                        <div className="alert alert-info mt-3 mb-0">
                          <i className="bi bi-info-circle me-2"></i>
                          {resendSuccess}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Thông báo xác thực thành công */}
                {verifySuccess && (
                  <div className="alert alert-success">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#22c55e",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                          }}
                        >
                          ✓
                        </div>
                      </div>
                      <div>
                        <h6 className="alert-heading mb-1 fw-bold">
                          Xác thực thành công!
                        </h6>
                        <p className="mb-0">{verifySuccess}</p>
                        <small className="text-muted">
                          Đang chuyển về trang đăng nhập...
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lưu ý */}
                <div className="alert alert-warning">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Lưu ý:</strong>
                  </div>
                  <ul className="mb-0 small">
                    <li>Không nhận được email? Kiểm tra thư mục spam</li>
                    <li>Link xác thực có hiệu lực trong 5 phút</li>
                    <li>Nếu cần hỗ trợ, liên hệ hotline: 1900-xxxx</li>
                  </ul>
                </div>
              </div>
              <div
                className="modal-footer"
                style={{
                  borderTop: "1px solid #e9ecef",
                  padding: "1rem 1.5rem",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {verifySuccess ? (
                  <button
                    type="button"
                    className="btn"
                    style={{
                      background:
                        "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontWeight: "600",
                      fontSize: "16px",
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(34, 197, 94, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(34, 197, 94, 0.3)";
                    }}
                    onClick={() => {
                      setShowSuccessModal(false);
                      router.push("/login");
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Đăng nhập ngay
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontWeight: "600",
                        fontSize: "16px",
                        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(34, 197, 94, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(34, 197, 94, 0.3)";
                      }}
                      onClick={() => {
                        setShowSuccessModal(false);
                        router.push("/login");
                      }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Quay lại đăng nhập
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: "white",
                        color: "#6b7280",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "12px 24px",
                        fontWeight: "600",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                      onClick={() => setShowSuccessModal(false)}
                    >
                      Đóng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default RegisterForm;
