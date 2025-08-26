'use client';

import Image from 'next/image';
import Link from 'next/link';
import WishlistButton from './WishlistButton';
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
}

export default function ProductCard({ 
  product
}: ProductCardProps) {
  const finalPrice = product.price - product.discount;

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
        <WishlistButton
          productId={product.id}
          productData={{
            name: product.name,
            price: finalPrice,
            image: product.images,
            slug: product.slug
          }}
          size="sm"
          className={styles.wishlistBtn}
        />
        
        <Link href={`/product/${product.slug}`} className={styles.quickViewBtn}>
          <i className="fas fa-eye"></i>
        </Link>
        
        <Link href={`/product/${product.slug}`} className={styles.addToCartBtn}>
          Thêm vào giỏ
        </Link>
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
