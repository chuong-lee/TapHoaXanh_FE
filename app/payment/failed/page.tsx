"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderId = searchParams.get('orderId');
  const errorMessage = searchParams.get('message') || 'Thanh toán thất bại';

  useEffect(() => {
    // Có thể thêm logic để ghi log hoặc gửi thông báo
    console.log('Payment failed for order:', orderId);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thanh toán thất bại
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {orderId && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Mã đơn hàng: <span className="font-medium text-gray-900">{orderId}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/checkout"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Thử lại thanh toán
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Về trang chủ
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ khách hàng
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
} 