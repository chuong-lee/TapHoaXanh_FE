'use client'

import { useState, useRef, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'
import { useAuth } from '../context/AuthContext';



function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const { refreshProfile } = useAuth();


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: emailRef.current?.value || '',
        password: passwordRef.current?.value || '',
      });

      const { access_token, refresh_token } = res.data as { access_token?: string; refresh_token?: string };

      if (access_token) localStorage.setItem('access_token', access_token);

      if (refresh_token) localStorage.setItem('refresh_token', refresh_token);


      await refreshProfile();
      router.push(redirectTo);
    } catch (err) {
      const error = err as Error & { response?: { data?: { message?: string } } };
      console.error(error);
      setError(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <form onSubmit={handleLogin} className="mx-auto col-md-6 col-lg-5 col-12">
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
      {isLoading ? <>dang load</> : <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>}
      {error && <p className="text-danger">{error}</p>}
    </form>
  )
}

export default LoginForm;