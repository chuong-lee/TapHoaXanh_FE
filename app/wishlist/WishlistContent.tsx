"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../context/AuthContext';

export default function WishlistContent() {
  const { wishlist, isLoading, removeFromWishlist } = useWishlist();
  const { profile } = useAuth();
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());



  const handleRemoveFromWishlist = async (productId: number) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">
            <i className="fa-solid fa-heart text-danger me-2"></i>
            Sản Phẩm Yêu Thích
          </h1>
          
          {!profile && (
            <div className="alert alert-info" role="alert">
              <i className="fa-solid fa-info-circle me-2"></i>
              Bạn chưa đăng nhập. Các sản phẩm yêu thích sẽ được lưu tạm thời trong trình duyệt.
              <Link href="/login" className="alert-link ms-2">
                Đăng nhập ngay
              </Link>
            </div>
          )}

          {wishlist.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa-solid fa-heart-broken fa-3x text-muted mb-3"></i>
              <h3 className="text-muted">Chưa có sản phẩm yêu thích</h3>
              <p className="text-muted">Hãy khám phá và thêm sản phẩm vào danh sách yêu thích của bạn!</p>
              <Link href="/product" className="btn btn-primary">
                <i className="fa-solid fa-shopping-bag me-2"></i>
                Khám Phá Sản Phẩm
              </Link>
            </div>
          ) : (
            <div className="row">
              {wishlist.map((item) => (
                <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="position-relative">
                      <img
                        src={item.product.image || '/client/images/placeholder.jpg'}
                        className="card-img-top"
                        alt={item.product.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <button
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                        onClick={() => handleRemoveFromWishlist(item.product.id)}
                        disabled={removingItems.has(item.product.id)}
                        title="Xóa khỏi yêu thích"
                      >
                        {removingItems.has(item.product.id) ? (
                          <i className="fa-solid fa-spinner fa-spin"></i>
                        ) : (
                          <i className="fa-solid fa-times"></i>
                        )}
                      </button>
                    </div>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title">{item.product.name}</h6>
                      <p className="card-text text-primary fw-bold">
                        {item.product.price?.toLocaleString('vi-VN')} ₫
                      </p>
                      <div className="mt-auto">
                        <Link
                          href={`/product/${item.product.slug || item.product.id}`}
                          className="btn btn-outline-primary btn-sm w-100"
                        >
                          <i className="fa-solid fa-eye me-2"></i>
                          Xem Chi Tiết
                        </Link>
                      </div>
                    </div>
                    <div className="card-footer text-muted small">
                      <i className="fa-solid fa-clock me-1"></i>
                      Đã thêm {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
