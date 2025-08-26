"use client"

import { useState } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../context/AuthContext';

interface WishlistButtonProps {
  productId: number;
  productData?: {
    name: string;
    price: number;
    image?: string;
    slug?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function WishlistButton({
  productId,
  productData,
  size = 'md',
  showText = false,
  className = ''
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleToggleWishlist = async () => {
    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId, productData);
        
        // Hiển thị thông báo khi thêm vào wishlist (cho cả đã đăng nhập và chưa đăng nhập)
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      default:
        return '';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'fa-sm';
      case 'lg':
        return 'fa-lg';
      default:
        return '';
    }
  };

  return (
    <div className="position-relative">
      <button
        className={`btn ${getButtonSize()} ${inWishlist ? 'btn-danger' : 'btn-outline-danger'} ${className}`}
        onClick={handleToggleWishlist}
        disabled={isLoading}
        title={inWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
      >
        {isLoading ? (
          <i className={`fa-solid fa-spinner fa-spin ${getIconSize()}`}></i>
        ) : (
          <i className={`fa-solid fa-heart ${getIconSize()}`}></i>
        )}
        {showText && (
          <span className="ms-2">
            {inWishlist ? 'Đã yêu thích' : 'Yêu thích'}
          </span>
        )}
      </button>

      {/* Toast notification khi thêm vào wishlist */}
      {showMessage && (
        <div 
          className="position-fixed" 
          style={{ 
            top: '20px', 
            right: '20px', 
            zIndex: 99999,
            minWidth: '300px',
            maxWidth: '400px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            color: '#155724'
          }}
        >
          <div className="d-flex align-items-center">
            <i className="fa-solid fa-check-circle me-2" style={{ color: '#28a745' }}></i>
            <div className="flex-grow-1">
              <strong>Đã thêm vào sản phẩm yêu thích</strong>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowMessage(false)}
              style={{ fontSize: '12px', border: 'none', background: 'none' }}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}
