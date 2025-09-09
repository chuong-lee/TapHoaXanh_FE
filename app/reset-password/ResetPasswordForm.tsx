'use client'

import { useState, useRef, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token không hợp lệ hoặc đã hết hạn.');
    }
  }, [searchParams]);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (!token) {
      setError('Token không hợp lệ.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/auth/reset-password', {
        token: token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      setSuccess('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.');
      
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

  if (!token && !error) {
    return <div className="text-center">Đang tải...</div>;
  }

  return (
    <form onSubmit={handleResetPassword} className="mx-auto col-12">
      <div className="mb-3">
        <label className="form-label">Mật khẩu mới</label>
        <input
          type="password"
          className="form-control"
          ref={passwordRef}
          required
          placeholder="Nhập mật khẩu mới"
          minLength={6}
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Xác nhận mật khẩu mới</label>
        <input
          type="password"
          className="form-control"
          ref={confirmPasswordRef}
          required
          placeholder="Nhập lại mật khẩu mới"
          minLength={6}
        />
      </div>
      
      {isLoading ? (
        <button type="button" className="btn btn-primary w-100" disabled>
          Đang xử lý...
        </button>
      ) : (
        <button type="submit" className="btn btn-primary w-100">
          Đặt lại mật khẩu
        </button>
      )}
      
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
    </form>
  )
}

export default ResetPasswordForm;
