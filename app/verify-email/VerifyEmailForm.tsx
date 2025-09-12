'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'

function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isResending, setIsResending] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [resendError, setResendError] = useState<string>('')
  const [resendSuccess, setResendSuccess] = useState<string>('')
  const emailRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Lấy email và type từ URL params
  const emailFromUrl = searchParams.get('email') || ''
  const pageType = searchParams.get('type') // 'register' hoặc null
  const isRegisterSuccess = pageType === 'register'

  useEffect(() => {
    const token = searchParams.get('token');
    
    // Nếu là trang đăng ký thành công (không có token)
    if (isRegisterSuccess && !token) {
      setIsLoading(false);
      return;
    }
    
    // Nếu có token thì thực hiện xác thực
    if (token) {
      const verifyEmail = async () => {
        try {
          await api.get(`/auth/verify-email?token=${token}`);
          setSuccess('Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.');
          
          // Chuyển về trang login sau 3 giây
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } catch (err) {
          const error = err as Error & { response?: { data?: { message?: string } } };
          console.error(error);
          setError(error.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
        } finally {
          setIsLoading(false);
        }
      };

      verifyEmail();
    } else {
      setError('Token không hợp lệ hoặc đã hết hạn.');
      setIsLoading(false);
    }
  }, [searchParams, router, isRegisterSuccess]);

  const handleResendVerification = async (e: FormEvent) => {
    e.preventDefault();
    setResendError('');
    setResendSuccess('');
    setIsResending(true);

    try {
      await api.post('/auth/resend-verification', {
        email: emailRef.current?.value || emailFromUrl,
      });

      setResendSuccess('Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư và spam.');
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      console.error(error);
      setResendError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsResending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang xác thực...</span>
        </div>
        <p className="mt-2">Đang xác thực email...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto col-12">
      <style jsx>{`
        .success-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.5s ease-out;
          padding: 12px 16px;
          margin: 0 8px;
        }
        .info-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.7s ease-out;
          padding: 12px 16px;
          margin: 0 8px;
        }
        .form-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.9s ease-out;
          margin: 0 8px;
        }
        .custom-input {
          border: 1px solid #d1d5db;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 16px;
          transition: all 0.2s ease;
          background: #ffffff;
        }
        .custom-input:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
          outline: none;
        }
        .custom-btn {
          background: #22c55e;
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-weight: 600;
          font-size: 14px;
          color: white;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
        }
        .custom-btn:hover {
          background: #16a34a;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
        }
        .custom-btn:disabled {
          opacity: 0.5;
          transform: none;
          cursor: not-allowed;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 8px;
          padding: 12px 8px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 8px;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-height: 80px;
        }
        .step-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-4px);
        }
        .step-number {
          background: #22c55e;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          margin-right: 8px;
          font-size: 12px;
          flex-shrink: 0;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .tips-card {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border: 1px solid #fde68a;
          border-radius: 12px;
          padding: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          animation: slideIn 1.1s ease-out;
        }
        .alert-modern {
          border-radius: 16px;
          border: none;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          animation: slideIn 0.5s ease-out;
        }
      `}</style>

      {/* Hiển thị trang đăng ký thành công */}
      {isRegisterSuccess && !error && !success && (
        <>
          {/* Thông báo thành công - Layout ngang */}
          <div className="alert success-card mb-3">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "#22c55e",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  flexShrink: 0
                }}>
                  ✓
                </div>
              </div>
              <div className="flex-grow-1">
                <h5 className="alert-heading mb-1 fw-bold" style={{ color: '#166534', fontSize: '16px' }}>
                  Đăng ký thành công!
                </h5>
                <p className="mb-0" style={{ color: '#166534', fontSize: '14px', lineHeight: '1.4' }}>
                  Chúng tôi đã gửi email xác thực đến địa chỉ email của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Hướng dẫn - Layout ngang 4 cột */}
          <div className="alert info-card mb-3">
            <h6 className="alert-heading mb-3 fw-bold text-center" style={{ color: '#0c4a6e', fontSize: '16px' }}>
              Hướng dẫn xác thực
            </h6>
            <div className="row g-2">
              <div className="col-lg-3 col-md-6">
                <div className="step-item text-center">
                  <div className="step-number mx-auto mb-1">1</div>
                  <span style={{ color: '#0c4a6e', fontWeight: '500', fontSize: '12px' }}>Kiểm tra hộp thư email</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="step-item text-center">
                  <div className="step-number mx-auto mb-1">2</div>
                  <span style={{ color: '#0c4a6e', fontWeight: '500', fontSize: '12px' }}>Tìm email từ &quot;Tạp Hóa Xanh&quot;</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="step-item text-center">
                  <div className="step-number mx-auto mb-1">3</div>
                  <span style={{ color: '#0c4a6e', fontWeight: '500', fontSize: '12px' }}>Click vào link xác thực</span>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="step-item text-center">
                  <div className="step-number mx-auto mb-1">4</div>
                  <span style={{ color: '#0c4a6e', fontWeight: '500', fontSize: '12px' }}>Quay lại đăng nhập</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form gửi lại email - Layout dọc */}
          <div className="form-card mb-3">
            <div className="text-center mb-3">
              <h6 className="mb-1 fw-bold" style={{ color: '#374151', fontSize: '16px' }}>
                Không nhận được email?
              </h6>
              <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
                Gửi lại email xác thực
              </p>
            </div>
            <form onSubmit={handleResendVerification}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '14px' }}>
                  Email đăng ký
                </label>
                <input
                  type="email"
                  className="form-control custom-input"
                  ref={emailRef}
                  defaultValue={emailFromUrl}
                  required
                  placeholder="Nhập email của bạn"
                  style={{ padding: "10px 16px", fontSize: "14px" }}
                />
              </div>
              <div className="text-center">
                {isResending ? (
                  <button type="button" className="btn custom-btn" disabled style={{ padding: "10px 24px", fontSize: "14px", minWidth: "140px" }}>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Đang gửi...
                  </button>
                ) : (
                  <button type="submit" className="btn custom-btn" style={{ padding: "10px 24px", fontSize: "14px", minWidth: "140px" }}>
                    <i className="bi bi-envelope me-2"></i>
                    Gửi lại email
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {resendError && (
            <div className="alert alert-danger mb-3 alert-modern">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {resendError}
            </div>
          )}
          {resendSuccess && (
            <div className="alert alert-success mb-3 alert-modern">
              <i className="bi bi-check-circle me-2"></i>
              {resendSuccess}
            </div>
          )}

          {/* Lưu ý */}
          <div className="tips-card">
            <div className="row g-2">
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <i className="bi bi-info-circle me-2" style={{ color: '#92400e', fontSize: '14px' }}></i>
                  <span style={{ color: '#92400e', fontWeight: '500', fontSize: '12px' }}>
                    Không nhận được email? Kiểm tra thư mục spam
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock me-2" style={{ color: '#92400e', fontSize: '14px' }}></i>
                  <span style={{ color: '#92400e', fontWeight: '500', fontSize: '12px' }}>
                    Link xác thực có hiệu lực trong 5 phút
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hiển thị kết quả xác thực email */}
      {error && (
        <div className="alert alert-danger alert-modern">
          <div className="d-flex align-items-start">
            <div className="me-3 mt-1">
              <div style={{
                width: "40px",
                height: "40px",
                background: "#dc2626",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px"
              }}>
                ✕
              </div>
            </div>
            <div>
              <h5 className="alert-heading mb-2 fw-bold" style={{ color: '#991b1b', fontSize: '18px' }}>
                Xác thực thất bại
              </h5>
              <p className="mb-3" style={{ color: '#991b1b', fontSize: '15px', lineHeight: '1.5' }}>{error}</p>
              <a href="/login" className="btn btn-outline-danger" style={{ borderRadius: '8px', fontSize: '14px' }}>
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại đăng nhập
              </a>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="alert alert-success alert-modern">
          <div className="d-flex align-items-start">
            <div className="me-3 mt-1">
              <div style={{
                width: "40px",
                height: "40px",
                background: "#22c55e",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "20px"
              }}>
                ✓
              </div>
            </div>
            <div>
              <h5 className="alert-heading mb-2 fw-bold" style={{ color: '#166534', fontSize: '18px' }}>
                Xác thực thành công!
              </h5>
              <p className="mb-3" style={{ color: '#166534', fontSize: '15px', lineHeight: '1.5' }}>{success}</p>
              <a href="/login" className="btn btn-outline-success" style={{ borderRadius: '8px', fontSize: '14px' }}>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Đăng nhập ngay
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyEmailForm;
