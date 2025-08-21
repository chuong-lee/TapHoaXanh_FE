'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '../ui/LoadingSpinner';

// Lazy load ProductCard component
const ProductCard = dynamic(() => import('../product/ProductCard'), {
  loading: () => <LoadingSpinner size="sm" text="Tải sản phẩm..." />,
  ssr: false
});

export default ProductCard;
