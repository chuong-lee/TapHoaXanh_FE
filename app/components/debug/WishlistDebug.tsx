"use client"

import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';

export default function WishlistDebug() {
  const { wishlist, isLoading } = useWishlist();
  const { profile } = useAuth();

  return (
    <div className="container mt-3 p-3 border rounded bg-light">
      <h6>🔍 Wishlist Debug Info</h6>
      <div className="row">
        <div className="col-md-6">
          <p><strong>Auth Status:</strong> {profile ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</p>
          <p><strong>Loading:</strong> {isLoading ? 'Đang tải...' : 'Đã tải xong'}</p>
          <p><strong>Wishlist Count:</strong> {wishlist.length} sản phẩm</p>
        </div>
        <div className="col-md-6">
          <p><strong>localStorage:</strong></p>
          <pre className="small">
            {typeof window !== 'undefined' 
              ? localStorage.getItem('wishlist_items') || 'Empty'
              : 'Server-side'
            }
          </pre>
        </div>
      </div>
      
      {wishlist.length > 0 && (
        <div className="mt-3">
          <p><strong>Wishlist Items:</strong></p>
          <ul className="list-unstyled">
            {wishlist.map((item) => (
              <li key={item.id} className="mb-2 p-2 border rounded">
                <strong>ID:</strong> {item.id} | 
                <strong>Product:</strong> {item.product.name} | 
                <strong>Price:</strong> {item.product.price}₫
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
