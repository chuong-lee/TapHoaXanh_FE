"use client"

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import để tránh lỗi server-side
const WishlistContent = dynamic(() => import('./WishlistContent'), {
  ssr: false,
  loading: () => (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-12 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    </div>
  )
});

export default function WishlistPage() {
  return <WishlistContent />;
}
