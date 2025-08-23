'use client'

import { useState, useRef, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'
import { useAuth } from '@/context/AuthContext'



function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [, setError] = useState<string>('')
  const nameRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    ('');
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

      // Tự động login sau khi đăng ký thành công
      try {
        const loginRes = await api.post('/auth/login', {
          email: email,
          password: password,
        });

        const { token, user } = loginRes.data as { token?: string; user?: unknown };

        if (token) localStorage.setItem('access_token', token);

        await refreshProfile();
        router.push(redirectTo);
      } catch (loginErr) {
        // Nếu login thất bại, vẫn chuyển về trang login để user login thủ công
        console.('Tự động login thất bại:', loginErr);
        ('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        setTimeout(() => {
          .push('/login');
        }, 2000);
      }
    } catch (err) {
        
      console.error(error);
      setError(.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra thông tin.');
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
      {isLoading ? <>Đang load</> : <button type="submit" className="btn btn-primary w-100">Đăng Ký</button>}
      {error && <p className="text-danger">{}</p>}
    </form>
  )
}

export default RegisterForm;