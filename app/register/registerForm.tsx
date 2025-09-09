'use client'

import { useState, useRef, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'



function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const { refreshProfile } = useAuth();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Lưu thông tin đăng ký để sử dụng cho login
      const email = emailRef.current?.value || '';
      const password = passwordRef.current?.value || '';

      // Đăng ký tài khoản
      await api.post('/auth/register', {
        name: nameRef.current?.value || '',
        phone: phoneRef.current?.value || '',
        email: email,
        password: password,
        confirmPassword: confirmPasswordRef.current?.value || '',
      });

      // Chuyển đến trang verify-email với thông báo đăng ký thành công
      router.push(`/verify-email?email=${encodeURIComponent(email)}&type=register`);
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };  
      console.error(error);
      setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra thông tin.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleRegister} className="mx-auto col-md-6 col-lg-5 col-12">
      <div className="mb-3">
        <label className="form-label">Tên người dùng</label>
        <input
          type="text"
          className="form-control"
          ref={nameRef}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Số điện thoại</label>
        <input
          type="tel"
          className="form-control"
          ref={phoneRef}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control"
          ref={emailRef}
          required
        />
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
        <button type="submit" className="btn btn-primary w-100">Đăng Ký</button>
      )}
      
      {error && (
        <div className={`alert mt-3 ${error.includes('thành công') ? 'alert-success' : 'alert-danger'}`}>
          {error}
        </div>
      )}
    </form>
  )
}

export default RegisterForm;