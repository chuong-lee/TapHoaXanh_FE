'use client'

import { Suspense } from 'react'
import LoginForm from './LoginForm'



export default function LoginPage() {
  return (
    <div className="container py-5">
      <h2 className="mb-4">Đăng nhập tài khoản</h2>
      <Suspense fallback={<p>Đang tải...</p>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}