import { Suspense } from 'react'
import RegisterForm from './registerForm'

export default function RegisterPage() {
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Đăng ký tài khoản</h2>
      <Suspense fallback={<p>Đang tải...</p>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}