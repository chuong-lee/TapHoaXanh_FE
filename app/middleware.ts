import { NextResponse } from 'next/server'
import type {  } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/orders',
  '/checkout',
  '/cart'
]

// Admin routes that require admin role
const adminRoutes = [
  '/admin'
]

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/home',
  '/login',
  '/register',
  '/product',
  '/category',
  '/contact',
  '/news',
  '/post',
  '/voucher'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )
  
   mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all  paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|client|images).*)',
  ],
}
