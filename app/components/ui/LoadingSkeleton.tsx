'use client'

import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  borderRadius?: string
  animation?: 'pulse' | 'wave' | 'none'
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  borderRadius = '0.375rem',
  animation = 'pulse'
}) => {
  const animationClass = animation === 'pulse' ? 'skeleton-pulse' : 
                        animation === 'wave' ? 'skeleton-wave' : ''

  return (
    <div
      className={`skeleton ${animationClass} ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e9ecef',
        display: 'inline-block'
      }}
    />
  )
}

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card h-100">
      <div className="position-relative">
        <Skeleton height="200px" borderRadius="0.375rem 0.375rem 0 0" />
      </div>
      <div className="card-body">
        <Skeleton height="1.5rem" className="mb-2" />
        <Skeleton height="1rem" width="60%" className="mb-2" />
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Skeleton height="1.25rem" width="40%" />
          <Skeleton height="1rem" width="30%" />
        </div>
        <Skeleton height="2.5rem" borderRadius="0.375rem" />
      </div>
    </div>
  )
}

// Product List Skeleton
export const ProductListSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="row">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <ProductCardSkeleton />
        </div>
      ))}
    </div>
  )
}

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index}>
          <Skeleton height="1rem" />
        </td>
      ))}
    </tr>
  )
}

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <Skeleton height="1.5rem" width="30%" />
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-3">
            <Skeleton height="120px" width="120px" borderRadius="50%" />
          </div>
          <div className="col-md-9">
            <Skeleton height="1.5rem" width="60%" className="mb-2" />
            <Skeleton height="1rem" width="40%" className="mb-2" />
            <Skeleton height="1rem" width="50%" />
          </div>
        </div>
        <div className="mb-3">
          <Skeleton height="1rem" width="20%" className="mb-2" />
          <Skeleton height="2.5rem" />
        </div>
        <div className="mb-3">
          <Skeleton height="1rem" width="20%" className="mb-2" />
          <Skeleton height="2.5rem" />
        </div>
        <Skeleton height="2.5rem" width="120px" />
      </div>
    </div>
  )
}

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  variant = 'primary'
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : 
                   size === 'lg' ? 'spinner-border-lg' : ''

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`}>
      <div className={`spinner-border text-${variant} ${sizeClass}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <span className="ms-2">{text}</span>}
    </div>
  )
}

// Full Page Loading
export const FullPageLoading: React.FC<{ text?: string }> = ({ text = 'Đang tải...' }) => {
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-90" style={{ zIndex: 9999 }}>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-3 text-muted">{text}</p>
      </div>
    </div>
  )
}

// Button Loading State
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  variant?: string
  children: React.ReactNode
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText = 'Đang xử lý...',
  variant = 'btn-primary',
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`btn ${variant} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </span>
      )}
      {loading ? loadingText : children}
    </button>
  )
}

// CSS for skeleton animations (add to globals.css)
export const skeletonCSS = `
@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

@keyframes skeleton-wave {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.skeleton-pulse {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-wave {
  position: relative;
  overflow: hidden;
}

.skeleton-wave::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: skeleton-wave 1.5s ease-in-out infinite;
}

.spinner-border-lg {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}
`

// Default export
const LoadingSkeleton = ProductCardSkeleton
export default LoadingSkeleton
