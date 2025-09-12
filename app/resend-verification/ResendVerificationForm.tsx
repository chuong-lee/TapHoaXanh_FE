'use client'

import { useState, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

function ResendVerificationForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const emailRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleResendVerification = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await api.post('/auth/resend-verification', {
        email: emailRef.current?.value || '',
      });

      setSuccess('Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư và spam.');
      
      // Chuyển về trang login sau 3 giây
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      console.error(error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleResendVerification} className="mx-auto col-12">
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          ref={emailRef}
          required
          placeholder="Nhập email của bạn"
        />
      </div>
      
      {isLoading ? (
        <button type="button" className="btn btn-primary w-100" disabled>
          Đang gửi...
        </button>
      ) : (
        <button type="submit" className="btn btn-primary w-100">
          Gửi lại email xác thực
        </button>
      )}
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
    </form>
  )
}

export default ResendVerificationForm;
