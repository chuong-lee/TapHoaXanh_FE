'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '../../lib/axios'

export interface Product {
  id: number
  name: string
  price: number
  images: string | string[]
  discount: number
  description: string
  categoryId?: number
  category?: { id: number; name: string }
  quantity?: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Fetch product detail
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching product detail for ID:', id)
        const response = await api.get(`/products/${id}`)
        
        const data = response.data as any
        if (data && data.success && data.data) {
          setProduct(data.data)
        } else if (data) {
          setProduct(data)
        } else {
          console.warn('No product data returned for ID:', id)
          setProduct(null)
        }
        
        // Fetch related products
        try {
          const relatedResponse = await api.get(`/products/related/${id}`)
          const relatedData = relatedResponse.data as any
          if (relatedData && relatedData.success && Array.isArray(relatedData.data)) {
            setRelatedProducts(relatedData.data)
          } else {
            setRelatedProducts([])
          }
        } catch (err) {
          console.warn('No related products available')
          setRelatedProducts([])
        }
        
      } catch (err) {
        console.error('Error fetching product detail:', err)
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.')
        setProduct(null)
        setRelatedProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProductDetail()
    }
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      // Add to cart logic here
      console.log('Adding to cart:', product.id, quantity)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-image" style={{ width: '100%', height: '400px', backgroundColor: '#f0f0f0' }}></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-title" style={{ width: '80%', height: '30px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}></div>
            <div className="skeleton-price" style={{ width: '60%', height: '25px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}></div>
            <div className="skeleton-description" style={{ width: '100%', height: '100px', backgroundColor: '#f0f0f0' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error || 'Không tìm thấy sản phẩm'}
        </div>
      </div>
    )
  }

  const images = Array.isArray(product.images) ? product.images : [product.images]
  const currentPrice = product.discount > 0 
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Product Images */}
        <div className="col-md-6">
          <div className="product-images">
            <div className="main-image">
              <Image
                src={images[selectedImage] || '/images/placeholder.jpg'}
                alt={product.name}
                width={500}
                height={400}
                className="img-fluid"
              />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-images mt-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail-btn ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="img-fluid"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-category mb-3">
              Danh mục: {product.category?.name || 'Chưa phân loại'}
            </div>

            <div className="product-price mb-4">
              {product.discount > 0 ? (
                <>
                  <span className="old-price text-muted text-decoration-line-through me-3">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="current-price text-danger fw-bold fs-4">
                    {currentPrice.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="discount-badge bg-danger text-white ms-2 px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </>
              ) : (
                <span className="current-price fw-bold fs-4">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
              )}
            </div>

            <div className="product-description mb-4">
              <h5>Mô tả sản phẩm:</h5>
              <p>{product.description}</p>
            </div>

            <div className="product-quantity mb-4">
              <label htmlFor="quantity" className="form-label">Số lượng:</label>
              <div className="input-group" style={{ width: '150px' }}>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-actions">
              <button
                className="btn btn-primary btn-lg me-3"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
              <button className="btn btn-outline-primary btn-lg">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products mt-5">
          <h3 className="mb-4">Sản phẩm liên quan</h3>
          <div className="row">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="col-md-3 mb-4">
                <div className="card h-100">
                  <Image
                    src={Array.isArray(relatedProduct.images) ? relatedProduct.images[0] : relatedProduct.images}
                    alt={relatedProduct.name}
                    width={200}
                    height={200}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{relatedProduct.name}</h6>
                    <p className="card-text text-danger fw-bold">
                      {relatedProduct.discount > 0 
                        ? Math.round(relatedProduct.price * (1 - relatedProduct.discount / 100)).toLocaleString('vi-VN') + 'đ'
                        : relatedProduct.price.toLocaleString('vi-VN') + 'đ'
                      }
                    </p>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => router.push(`/product/${relatedProduct.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
