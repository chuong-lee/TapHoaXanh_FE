'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    discount: number;
    slug: string;
    images: string;
    description: string;
  };
  onAddToCart: (product: unknown) => void;
  onToggleWishlist: (productId: number) => void;
  isWishlisted: boolean;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isWishlisted 
}: ProductCardProps) {
  const finalPrice = product.price - product.discount;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  return (
    <div className={styles.productCard}>
      <Link href={`/product/${product.slug}`}>
        <div className={styles.imageContainer}>
          <Image
            src={product.images || '/client/images/product.png'}
            alt={product.name}
            fill
            className={styles.image}
          />
        </div>
      </Link>
      
      <div className={styles.info}>
        <Link href={`/product/${product.slug}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        
        <div className={styles.price}>
          {formatPriceVND(finalPrice)}
          {product.discount > 0 && (
            <span className={styles.oldPrice}>
              {formatPriceVND(product.price)}
            </span>
          )}
        </div>
        
        <p className={styles.description}>{product.description}</p>
      </div>
      
      <div className={styles.actions}>
        <button 
          className={`${styles.wishlistBtn} ${isWishlisted ? 'active' : ''}`}
          onClick={handleToggleWishlist}
        >
          <i className={`fas fa-heart ${isWishlisted ? 'text-danger' : ''}`}></i>
        </button>
        
        <Link href={`/product/${product.slug}`} className={styles.quickViewBtn}>
          <i className="fas fa-eye"></i>
        </Link>
        
        <button 
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

// Helper function để format giá VND
function formatPriceVND(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}
