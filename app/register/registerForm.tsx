'use client'

import { useState, useRef ,FormEvent} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/lib/axios'



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
  const redirectTo = searchParams.get('redirect') || '/home'

  const handleRegister = async (e:FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
      await api.post('/auth/register', {
        name: nameRef.current?.value || '',
        phone: phoneRef.current?.value || '',
        email: emailRef.current?.value || '',
        password: passwordRef.current?.value || '',
        confirmPassword: confirmPasswordRef.current?.value || ''
      }).then(res => {
        console.log(res);
        router.push(redirectTo);
      } ).catch(err => {
        console.log(err);
        setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
      } ).finally(() => {
        setIsLoading(false);
      })
  }

  return (
    <form onSubmit={handleRegister} className="mx-auto col-md-6 col-lg-5 col-12">
        <div className="mb-3">
        <label className="form-label">tên người dùng</label>
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
      {error && <p className="text-danger">{error}</p>}
    </form>
  )
}

export default RegisterForm;