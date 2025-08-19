'use client';

interface ProductSkeletonProps {
  count?: number;
}

export default function ProductSkeleton({ count = 10 }: ProductSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div className="col" key={index}>
          <div className="product-card skeleton">
            <div className="product-image-container">
              <div className="skeleton-image"></div>
            </div>
            <div className="product-info">
              <div className="skeleton-category"></div>
              <div className="skeleton-title"></div>
              <div className="skeleton-price"></div>
              <div className="skeleton-rating"></div>
              <div className="skeleton-description"></div>
            </div>
            <div className="product-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
