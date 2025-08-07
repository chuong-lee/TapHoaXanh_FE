# Ví dụ thực tế sử dụng API Service

## 🎯 Ví dụ 1: Trang sản phẩm đơn giản

```typescript
// pages/products.tsx
'use client'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/ProductCard'

export default function ProductsPage() {
  const {
    currentProducts,
    categories,
    loading,
    error,
    searchProducts,
    filterByCategory,
    currentPage,
    totalPages,
    setCurrentPage
  } = useProducts({
    itemsPerPage: 12,
    autoFetch: true
  })

  const handleSearch = (searchTerm: string) => {
    searchProducts(searchTerm)
  }

  const handleCategoryFilter = (categoryId: number) => {
    filterByCategory(categoryId)
  }

  if (error) {
    return <div className="alert alert-danger">Lỗi: {error}</div>
  }

  return (
    <div className="container">
      {/* Search và Filter */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm sản phẩm..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            onChange={(e) => handleCategoryFilter(Number(e.target.value))}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            {currentProducts.map(product => (
              <div key={product.id} className="col-md-3 mb-4">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({length: totalPages}, (_, i) => (
                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  )
}
```

## 🎯 Ví dụ 2: Trang chi tiết sản phẩm

```typescript
// pages/product/[slug].tsx
'use client'
import { useProduct } from '@/hooks/useProducts'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const { product, loading, error } = useProduct(undefined, slug)

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="placeholder-glow">
              <div className="placeholder" style={{height: 400, width: '100%'}}></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="placeholder-glow">
              <h1 className="placeholder col-8"></h1>
              <p className="placeholder col-6"></p>
              <p className="placeholder col-12"></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          Không tìm thấy sản phẩm hoặc có lỗi xảy ra
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.images}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <h1>{product.name}</h1>
          <p className="text-muted">{product.category}</p>
          <div className="price-section mb-4">
            <span className="h3 text-success">{product.price.toLocaleString()}đ</span>
            {product.discount > 0 && (
              <span className="text-muted text-decoration-line-through ms-2">
                {(product.price + product.discount).toLocaleString()}đ
              </span>
            )}
          </div>
          <p>{product.description}</p>
          <button className="btn btn-primary btn-lg">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  )
}
```

## 🎯 Ví dụ 3: Component tìm kiếm với debounce

```typescript
// components/ProductSearch.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { productService } from '@/lib/productService'
import { Product } from '@/lib/productService'

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Debounce search term
  const debouncedSearchTerm = useMemo(() => {
    const handler = setTimeout(() => {
      return searchTerm
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setResults([])
        setShowResults(false)
        return
      }

      setLoading(true)
      try {
        const products = await productService.searchProducts(searchTerm)
        setResults(products.slice(0, 5)) // Chỉ hiển thị 5 kết quả
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [debouncedSearchTerm])

  return (
    <div className="position-relative">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        <button className="btn btn-outline-secondary" type="button">
          <i className="fa fa-search"></i>
        </button>
      </div>

      {/* Dropdown results */}
      {showResults && (
        <div className="dropdown-menu show position-absolute w-100" style={{top: '100%', zIndex: 1000}}>
          {loading ? (
            <div className="dropdown-item text-center">
              <div className="spinner-border spinner-border-sm" role="status"></div>
              <span className="ms-2">Đang tìm kiếm...</span>
            </div>
          ) : results.length > 0 ? (
            results.map(product => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="dropdown-item d-flex align-items-center"
              >
                <img
                  src={product.images}
                  alt={product.name}
                  style={{width: 40, height: 40}}
                  className="me-3 rounded"
                />
                <div>
                  <div className="fw-bold">{product.name}</div>
                  <small className="text-muted">{product.price.toLocaleString()}đ</small>
                </div>
              </a>
            ))
          ) : searchTerm && (
            <div className="dropdown-item text-muted text-center">
              Không tìm thấy sản phẩm nào
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## 🎯 Ví dụ 4: Hook custom cho giỏ hàng

```typescript
// hooks/useCart.ts
'use client'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/productService'

interface CartItem extends Product {
  quantity: number
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load giỏ hàng từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save giỏ hàng vào localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...prev, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  }
}
```

## 🎯 Ví dụ 5: Component ProductCard nâng cao

```typescript
// components/AdvancedProductCard.tsx
import { useState } from 'react'
import { Product } from '@/lib/productService'
import { useCart } from '@/hooks/useCart'

interface AdvancedProductCardProps {
  product: Product
  showQuickView?: boolean
  showWishlist?: boolean
  showCompare?: boolean
}

export default function AdvancedProductCard({
  product,
  showQuickView = true,
  showWishlist = true,
  showCompare = true
}: AdvancedProductCardProps) {
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product)
    // Hiển thị toast notification
    alert(`Đã thêm ${product.name} vào giỏ hàng!`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsWishlisted(!isWishlisted)
    // Call API to save wishlist
  }

  const discountPercent = product.discount > 0 
    ? Math.round((product.discount / (product.price + product.discount)) * 100)
    : 0

  return (
    <div 
      className="product-card position-relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="product-image position-relative">
        <img 
          src={product.images} 
          alt={product.name}
          className="w-100"
          style={{height: 250, objectFit: 'cover'}}
        />
        
        {/* Badges */}
        <div className="position-absolute top-0 start-0 m-2">
          {discountPercent > 0 && (
            <span className="badge bg-danger">-{discountPercent}%</span>
          )}
          {product.stock && product.stock < 10 && (
            <span className="badge bg-warning ms-1">Sắp hết</span>
          )}
        </div>

        {/* Quick Actions - Hiển thị khi hover */}
        <div className={`position-absolute top-0 end-0 m-2 ${isHovered ? 'd-block' : 'd-none'}`}>
          {showWishlist && (
            <button
              className={`btn btn-sm rounded-circle mb-2 d-block ${isWishlisted ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={handleWishlist}
            >
              <i className="fa fa-heart"></i>
            </button>
          )}
          {showCompare && (
            <button className="btn btn-sm btn-outline-secondary rounded-circle mb-2 d-block">
              <i className="fa fa-balance-scale"></i>
            </button>
          )}
          {showQuickView && (
            <button className="btn btn-sm btn-outline-secondary rounded-circle d-block">
              <i className="fa fa-eye"></i>
            </button>
          )}
        </div>

        {/* Quick Add to Cart - Hiển thị khi hover */}
        <div className={`position-absolute bottom-0 start-0 end-0 p-3 ${isHovered ? 'd-block' : 'd-none'}`}>
          <button
            className="btn btn-primary w-100 btn-sm"
            onClick={handleAddToCart}
          >
            <i className="fa fa-shopping-cart me-2"></i>
            Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info p-3">
        <div className="category text-muted small mb-1">
          {product.category || 'Uncategorized'}
        </div>
        
        <h6 className="product-name mb-2">
          <a href={`/product/${product.slug}`} className="text-decoration-none text-dark">
            {product.name}
          </a>
        </h6>

        {/* Rating */}
        <div className="rating mb-2">
          {Array.from({length: 5}).map((_, i) => (
            <i
              key={i}
              className={`fa fa-star ${i < Math.floor(product.rating || 4) ? 'text-warning' : 'text-muted'}`}
            ></i>
          ))}
          <span className="ms-2 small text-muted">({product.rating || 4.0})</span>
        </div>

        {/* Price */}
        <div className="price-section">
          <span className="current-price fw-bold text-success">
            {product.price.toLocaleString()}đ
          </span>
          {product.discount > 0 && (
            <span className="original-price text-muted text-decoration-line-through ms-2">
              {(product.price + product.discount).toLocaleString()}đ
            </span>
          )}
        </div>

        {/* Stock info */}
        {product.stock && (
          <div className="stock-info mt-2">
            <div className="progress" style={{height: 4}}>
              <div 
                className="progress-bar bg-success" 
                style={{width: `${Math.min(100, (product.stock / 100) * 100)}%`}}
              ></div>
            </div>
            <small className="text-muted">Còn lại: {product.stock}</small>
          </div>
        )}
      </div>
    </div>
  )
}
```

## 🎯 Sử dụng trong pages/layout

```typescript
// app/layout.tsx - Thêm cart provider
import { CartProvider } from '@/context/CartContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
```

Những ví dụ này cho thấy cách sử dụng service API một cách hiệu quả và linh hoạt trong ứng dụng thực tế!
