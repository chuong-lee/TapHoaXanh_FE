'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import api from '@/lib/axios'
import Image from 'next/image'
import 'dotenv/config'

export interface Product {
  id: number;
  name: string;
  price: number;
  slug: string;
  images: string | string[]
  discount: number
  description: string
  categoryId?: number;
  category?: { id: number; name: string };
}

export interface ProductVariant {
  id: number;
  variant_name: string;
  price_modifier: number;
  stock: number;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Banner {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export function useProduct(options?: { itemsPerPage?: number }) {
  const [currentProduct, setCurrentProduct] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product[]>([]);
  const [bestSellingProduct, setBestSellingProduct] = useState<Product[]>([]);
  const [bannerList, setBannerList] = useState<Banner[]>([]);
  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Products
        const productRes = await api.get('/api/products');
        let products: Product[] = [];
        if (productRes.data && Array.isArray(productRes.data.data)) {
          products = productRes.data.data;
        } else if (Array.isArray(productRes.data)) {
          products = productRes.data;
        }
        setCurrentProduct(products);

        // Categories
        const catRes = await api.get('/api/category');
        let cats: Category[] = [];
        if (catRes.data && Array.isArray(catRes.data.data)) {
          cats = catRes.data.data;
        } else if (Array.isArray(catRes.data)) {
          cats = catRes.data;
        }
        setCategory(cats);

        // Banner - skip for now as we don't have this endpoint yet
        // const bannerRes = await api.get('/api/banner');
        // let banners: Banner[] = [];
        // if (bannerRes.data && Array.isArray(bannerRes.data.data)) {
        //   banners = bannerRes.data.data;
        // } else if (Array.isArray(bannerRes.data)) {
        //   banners = bannerRes.data;
        // }
        // setBannerList(banners);
        setBannerList([]); // Empty for now

        // Featured products (ví dụ: sản phẩm có discount > 0)
        setFeaturedProduct(products.filter(p => p.discount > 0).slice(0, 10));

        // Best selling (ví dụ: sản phẩm có price > 100000)
        setBestSellingProduct(products.filter(p => p.price > 100000).slice(0, 10));
      } catch (err) {
        // Có thể log hoặc xử lý error nếu muốn
      }
    };
    fetchAll();
  }, []);

  return {
    currentProduct,
    category,
    featuredProduct,
    bestSellingProduct,
    bannerList,
  };
}

function fixImgSrc(src: string | null | undefined): string {
  if (!src || typeof src !== 'string' || !src.trim() || src === 'null' || src === 'undefined') return '/images/placeholder.png';
  src = src.toString().trim();
  if (src.startsWith('http')) return src;
  src = src.replace(/^\.\//, '');
  if (src.startsWith('/')) return src;
  if (src.startsWith('client/images/')) return '/' + src;
  if (src.startsWith('images/')) return '/' + src;
  return '/' + src;
}

// Helper function để tạo slug consistent
function createProductSlug(product: { slug?: string; name?: string; id: number }): string {
  let productSlug = ''
  
  if (product.slug) {
    productSlug = product.slug
  } else if (product.name) {
    productSlug = product.name
  } else {
    productSlug = `product-${product.id}`
  }

  // Normalize slug để tương thích URL
  return productSlug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'desc' | 'profile' | 'review' | 'related'>('desc')
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [relatedproduct, setRelatedproduct] = useState<Product[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    comment: ''
  })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')

  // Function để kiểm tra scroll position
  const checkScrollButtons = () => {
    const slider = document.getElementById('related-products-slider');
    if (slider) {
      setCanScrollLeft(slider.scrollLeft > 0);
      setCanScrollRight(slider.scrollLeft < slider.scrollWidth - slider.clientWidth);
    }
  };

  // Function để scroll slider
  const scrollSlider = (direction: 'left' | 'right') => {
    const slider = document.getElementById('related-products-slider');
    if (slider) {
      const scrollAmount = 270; // width của 1 product + gap
      slider.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
      // Delay check để animation hoàn thành
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Handle review form changes
  const handleReviewChange = (field: string, value: string | number) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle review form submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) {
      setReviewMessage('Không tìm thấy thông tin sản phẩm')
      return
    }
    
    // Validation
    if (!reviewForm.customerName.trim()) {
      setReviewMessage('Vui lòng nhập họ tên')
      return
    }
    
    if (reviewForm.comment.trim().length < 10) {
      setReviewMessage('Nhận xét phải có ít nhất 10 ký tự')
      return
    }
    
    setIsSubmittingReview(true)
    setReviewMessage('')
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewForm.customerName.trim(),
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim()
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setReviewMessage('✅ Cảm ơn bạn đã đánh giá! Đánh giá của bạn đã được lưu.')
        // Reset form
        setReviewForm({
          customerName: '',
          rating: 5,
          comment: ''
        })
        
        // Reload product data để cập nhật rating mới
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setReviewMessage(`❌ ${result.message}`)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      setReviewMessage('❌ Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Lấy chi tiết sản phẩm - ĐƠNGIẢN VÀ CHẮC CHẮN
 useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true)
        console.log('🔍 Tìm sản phẩm với slug:', slug)

        // Gọi API endpoint mới - đơn giản và chắc chắn
        const response = await fetch(`/api/products/detail/${slug}`)
        const result = await response.json()
        
        console.log('📦 API Response:', result)
        
        if (!result.success || !result.data) {
          console.error('❌ Không tìm thấy sản phẩm')
          setProduct(null)
          setLoading(false)
          return
        }

        const productData = result.data
        console.log('✅ Đã tìm thấy sản phẩm:', productData.name)
        
        // Xử lý images
        let images: string[] = []
        if (typeof productData.images === 'string') {
          images = productData.images.split(',').map(s => s.trim()).filter(s => s && s !== 'null')
        } else if (Array.isArray(productData.images)) {
          images = productData.images.filter(s => s && s !== 'null')
        }

        if (images.length === 0) {
          images = ['/client/images/product.png']
        }

        const finalProduct = {
          ...productData,
          images: images
        }

        console.log('📋 Product specifications:', finalProduct.specifications)
        console.log('⭐ Product reviews:', finalProduct.reviews)
        console.log('📝 Product description:', finalProduct.description)

        setProduct(finalProduct)
        setSelectedImage(images[0])
        setLoading(false)
        
      } catch (error) {
        console.error('🚨 Lỗi fetch sản phẩm:', error)
      setProduct(null)
      setLoading(false)
    }
  }

    if (slug) {
  fetchProduct()
    }
}, [slug])


  // Lấy biến thể và related products theo cùng category
  useEffect(() => {
      if (!product) return;
    
    const fetchVariantsAndRelated = async () => {
      try {
        console.log('🔍 Lấy variants và sản phẩm liên quan cho product:', product.name, 'categoryId:', product.categoryId);
        
        // Gọi variants và related products thông minh dựa trên sản phẩm hiện tại
        const [variantRes, relatedRes] = await Promise.all([
          fetch(`/api/product-variant?productId=${product.id}`),
          fetch(`/api/products/related/${product.id}?limit=12`) // API thông minh cho related products
        ]);
        
        // Set variants
        const variantData = await variantRes.json();
        const variants = variantData.success && Array.isArray(variantData.data) ? variantData.data : [];
        setVariants(variants);
        console.log('📦 Variants:', variants.length);
        
        // Set related products (API đã tự động loại trừ sản phẩm hiện tại)
        const relatedData = await relatedRes.json();
        const relatedProducts = relatedData.success && Array.isArray(relatedData.data) ? relatedData.data : [];
        
        setRelatedproduct(relatedProducts);
        console.log('🔗 Smart related products:', relatedProducts.length);
        
        // Log breakdown nếu có
        if (relatedData.meta?.breakdown) {
          const { breakdown } = relatedData.meta;
          console.log('📊 Related products breakdown:');
          console.log(`- Cùng category + brand: ${breakdown.sameCategoryBrand}`);
          console.log(`- Cùng category khác brand: ${breakdown.sameCategory}`);
          console.log(`- Cùng khoảng giá: ${breakdown.similarPrice}`);
        }
        
      } catch (error) {
        console.error('🚨 Lỗi fetch variants/related:', error);
        setVariants([]);
        setRelatedproduct([]);
      }
    };
    
    fetchVariantsAndRelated();
  }, [product])

  // Check scroll buttons sau khi related products load
  useEffect(() => {
    if (relatedproduct.length > 0) {
      setTimeout(checkScrollButtons, 100);
    }
  }, [relatedproduct])



  if (loading) return (
    <div className="container main-content py-4" style={{ paddingTop: 110 }}>
      <div className="row">
        <div className="col-md-5">
          <div className="placeholder-glow">
            <div className="placeholder" style={{width: '100%', height: 400}}></div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="placeholder-glow">
            <div className="placeholder col-6 mb-3"></div>
            <div className="placeholder col-8 mb-2"></div>
            <div className="placeholder col-4 mb-3"></div>
            <div className="placeholder col-12 mb-2"></div>
            <div className="placeholder col-5"></div>
          </div>
        </div>
      </div>
    </div>
  )
  
  if (!product) return (
    <div className="container main-content py-4" style={{ paddingTop: 110 }}>
      <div className="alert alert-danger">
        <h4>Không tìm thấy sản phẩm</h4>
        <p>Sản phẩm có thể đã bị xóa hoặc URL không chính xác.</p>
        <a href="/" className="btn btn-primary">Về trang chủ</a>
      </div>
    </div>
  )

  const getSelectedPrice = () => {
    const variant = variants.find(v => v.id === selectedVariant);
    const priceModifier = variant?.price_modifier || 0;

    // Nếu priceModifier = 0, giá gốc là product.price
    // Nếu priceModifier > 0, giá gốc là product.price + priceModifier
    const basePrice = priceModifier === 0 ? product.price : product.price + priceModifier;

    // Giá sau giảm
    const finalPrice = basePrice - product.discount;

    // Phần trăm giảm giá (nếu muốn hiển thị badge)
    const percent = Math.round((product.discount / basePrice) * 100);
    return finalPrice;
  };
  const totalPrice = getSelectedPrice() * quantity;

  return (
    <div className="container main-content py-4" style={{ paddingTop: 110 }}>
      <style jsx>{`
        .related-products-slider::-webkit-scrollbar {
          height: 6px;
        }
        .related-products-slider::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .related-products-slider::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .related-products-slider::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .slider-controls button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .badge-hot {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #ff4757;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          z-index: 2;
        }
        .option-btn {
          border: 2px solid #ddd;
          color: #222;
          background: #fff;
          transition: border 0.2s, color 0.2s, background 0.2s;
        }
        .option-btn:hover {
          border: 2px solid #4CAF50 !important;
          color: #4CAF50 !important;
          background: #fff !important;
        }
        .option-btn.active, .option-btn.selected {
          border: 2px solid #4CAF50 !important;
          color: #4CAF50 !important;
          background: #fff !important;
        }
        .product-thumb {
          transition: border 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .product-thumb:hover {
          border: 2px solid #4CAF50 !important;
          box-shadow: 0 0 0 2px #d1e7dd;
        }
        .product-thumb.selected {
          border: 2.5px solid #4CAF50 !important;
          box-shadow: 0 0 0 2px #b6f0c2;
        }
      `}</style>
      <div className="row">
        {/* Left: Product Images */}
        <div className="col-md-5">
          <div className="border rounded p-2 bg-white">
            <Image
              src={fixImgSrc(selectedImage)}
              alt={product.name}
              width={400}
              height={400}
              className="rounded w-100"
            />
          </div>
          <div className="d-flex gap-2 mt-3">
            {(() => {
              let imgs = Array.isArray(product.images)
                ? product.images
                : typeof product.images === 'string'
                  ? product.images.split(',') : [];
              imgs = imgs
                .map(img => (typeof img === 'string' ? img.trim() : ''))
                .filter(img => !!img && img !== 'null' && img !== 'undefined' && img !== '');

              if (imgs.length === 0) {
                return <div className="text-muted">Không có ảnh</div>;
              }
              if (imgs.length < 3) {
                imgs = [...imgs];
                while (imgs.length < 3) imgs.push(imgs[0]);
              }
              return imgs.slice(0, 3).map((img: string, index: number) => {
                const safeImg = fixImgSrc(img);
                // Chỉ render nếu safeImg là string hợp lệ
                if (!safeImg || typeof safeImg !== 'string' || safeImg === 'null' || safeImg === 'undefined' || safeImg.trim() === '') {
                  return null;
                }
                return (
                  <Image
                    key={index}
                    src={safeImg}
                    alt={`Ảnh nhỏ ${index}`}
                    width={60}
                    height={60}
                    className={`border rounded product-thumb${selectedImage === img ? ' selected' : ''}`}
                    onClick={() => setSelectedImage(img && img.trim() ? img : null)}
                  />
                );
              });
            })()}
          </div>
        </div>
        {/* Right: Product Info & Purchase Card */}
        <div className="col-md-7">
          <div className="row">
            {/* Left part of right column: Info */}
            <div className="col-md-7">
              <h4 className="mb-1">{product.name}</h4>
              <div
                style={{
                  fontSize: 16,
                  color: '#555',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  marginBottom: 12
                }}
                dangerouslySetInnerHTML={{
                  __html: product.description.replace(/\\n/g, '<br />')
                }}
              />
              <div className="mb-2">
                <span className="text-success fw-bold">MIỄN PHÍ GIAO HÀNG</span>
                <span className="text-danger ms-3 fw-bold">QUÀ TẶNG MIỄN PHÍ</span>
              </div>
              {/* Chọn biến thể */}
              <div className="mb-3">
                <span className="fw-bold">CHỌN PHIÊN BẢN:</span>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {Array.isArray(variants) && variants.length > 0 ? variants.map(v => (
                    <label key={v.id} className={`btn option-btn${v.id === selectedVariant ? ' active' : ''} rounded-3 px-3 py-2`} style={{ minWidth: 120 }}>
                      <input
                        type="radio"
                        name="variant"
                        value={v.id}
                        checked={v.id === selectedVariant}
                        onChange={() => setSelectedVariant(v.id)}
                        className="d-none"
                      />
                      <div>{v.variant_name}</div>
                      <div className="fw-bold">
                        {v.price_modifier > 0 ? `+${v.price_modifier.toLocaleString()}₫` : ''}
                      </div>
                      <div className="text-muted small">Kho: {v.stock}</div>
                    </label>
                  )) : <span className="text-muted">Không có phiên bản</span>}
                </div>
              </div>
              <div className="bg-light rounded p-3 mb-3">
                <ul className="mb-2">
                  <li>Mua <span className="text-success fw-bold">02</span> hộp tặng <a href="#" className="text-primary">Khay Snack</a></li>
                  <li>Mua <span className="text-success fw-bold">04</span> hộp tặng <a href="#" className="text-primary">Đồ chơi lắp ráp</a></li>
                </ul>
                <div className="text-secondary mb-2" style={{ fontSize: 14 }}>Khuyến mãi kết thúc lúc: <span className="fw-bold">9h00 tối, 25/5/2024</span></div>
                <div className="mt-2" style={{ fontSize: 15 }}>
                  <div><b>Mã SP:</b> <span className="text-success">#{product.id.toString().padStart(6, '0')}</span></div>
                  <div><b>Danh mục:</b> <span className="text-success">{product.category?.name || 'Chưa phân loại'}</span></div>
                  <div><b>Thương hiệu:</b> <span className="text-success">{product.brand?.name || 'Chưa có thông tin'}</span></div>
                </div>
                <div className="mt-2 d-flex gap-2">
                  <a href="#"><img src="/images/social-fb.png" alt="fb" width={28} /></a>
                  <a href="#"><img src="/images/social-ig.png" alt="ig" width={28} /></a>
                  <a href="#"><img src="/images/social-x.png" alt="x" width={28} /></a>
                  <a href="#"><img src="/images/social-yt.png" alt="yt" width={28} /></a>
                  <a href="#"><img src="/images/social-tg.png" alt="tg" width={28} /></a>
                  <a href="#"><img src="/images/social-in.png" alt="in" width={28} /></a>
                </div>
              </div>
            </div>
            {/* Right part of right column: Purchase Card */}
            <div className="col-md-5">
              <div className="card shadow-sm p-3" style={{ borderRadius: 12 }}>
                <div className="d-flex align-items-baseline">
                  <div className="fs-2 fw-bold text-dark">
                    {variants.length > 0 ? (
                      selectedVariant ? (
                      <span>{totalPrice.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
                    ) : (
                      <span className="text-muted" style={{ fontSize: 18 }}>Vui lòng chọn phiên bản</span>
                      )
                    ) : (
                      <span>{((product.price - product.discount) * quantity).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
                    )}
                  </div>
                </div>
                <div className="my-3">
                  <span className="badge bg-success bg-opacity-10 text-success me-2">
                    <i className="bi bi-check-circle-fill"></i> Còn hàng
                  </span>
                </div>
                {(selectedVariant || variants.length === 0) && (
                  <div className="d-flex align-items-center mb-3">
                    <button className="btn btn-light border rounded-pill px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                    <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                    <button className="btn btn-light border rounded-pill px-3" onClick={() => setQuantity(q => q + 1)}>+</button>
                  </div>
                )}
                {variants.length > 0 ? (
                  <>
                    <button
                      className="btn w-100 mb-2 fw-bold"
                      style={{
                        background: '#22c55e',
                        color: '#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      onClick={() => {
                        if (!selectedVariant) return;
                        const variant = variants.find(v => v.id === selectedVariant);
                        const priceModifier = variant?.price_modifier || 0;

                        // Nếu priceModifier = 0, giá gốc là product.price
                        // Nếu priceModifier > 0, giá gốc là product.price + priceModifier
                        const basePrice = priceModifier === 0 ? product.price : product.price + priceModifier;

                        // Giá sau giảm
                        const finalPrice = basePrice - product.discount;

                        // Phần trăm giảm giá (nếu muốn hiển thị badge)
                        const percent = Math.round((product.discount / basePrice) * 100);
                        addToCart({
                          ...product,
                          variant_id: variant?.id,
                          variant_name: variant?.variant_name,
                          price: finalPrice,
                          stock: variant?.stock || 0,
                          images: Array.isArray(product.images) ? product.images.join(',') : product.images,
                        }, quantity);
                        router.push('/cart');
                      }}
                      disabled={!selectedVariant}
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      className="btn w-100 mb-3 fw-bold"
                      style={{
                        background: '#fb923c',
                        color: '#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      disabled={!selectedVariant}
                    >
                      Mua với PayPal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn w-100 mb-2 fw-bold"
                      style={{
                        background: '#22c55e',
                        color: '#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      onClick={() => {
                        const finalPrice = product.price - product.discount;
                        addToCart({
                          ...product,
                          price: finalPrice,
                          stock: product.quantity || 0,
                          images: Array.isArray(product.images) ? product.images.join(',') : product.images,
                        }, quantity);
                        router.push('/cart');
                      }}
                    >
                      Thêm vào giỏ hàng
                    </button>
                    <button
                      className="btn w-100 mb-3 fw-bold"
                      style={{
                        background: '#fb923c',
                        color: '#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                    >
                      Mua với PayPal
                    </button>
                  </>
                )}
                <div className="d-flex justify-content-between text-sm">
                  <a href="#" className="text-decoration-none text-success">Đã thêm vào yêu thích</a>
                  <a href="#" className="text-decoration-none text-muted">So sánh</a>
                </div>
                <hr />
                <div className="mb-2"><img src="/images/safe-checkout.png" alt="Thanh toán an toàn" style={{ height: 24 }} /></div>
                <div className="mb-2 fw-bold">Đặt hàng nhanh 24/7<br /><span className="fw-normal">(025) 3886 25 16</span></div>
                <div className="mb-2"><i className="bi bi-truck"></i> Giao từ <a href="#" className="text-decoration-none">Việt Nam</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button className={`nav-link${tab === 'desc' ? ' active' : ''}`} onClick={() => setTab('desc')}>Mô tả</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link${tab === 'profile' ? ' active' : ''}`} onClick={() => setTab('profile')}>Thông số</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link${tab === 'review' ? ' active' : ''}`} onClick={() => setTab('review')}>Đánh giá</button>
          </li>
        </ul>
        <div className="border border-top-0 p-4 bg-white">
          {tab === 'desc' && (
            <>
              <h5 className="fw-bold text-success">
                <i className="fas fa-file-text me-2"></i>MÔ TẢ SẢN PHẨM
              </h5>
              <div className="description-content mb-4">
                <p className="fs-6 lh-lg">{product.description}</p>
                <div className="mt-3">
                  <h6 className="fw-bold text-success">Đặc điểm nổi bật:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i>Chất lượng cao, đảm bảo an toàn thực phẩm</li>
                    <li><i className="fas fa-check text-success me-2"></i>Đóng gói tiêu chuẩn, bảo quản tốt</li>
                    <li><i className="fas fa-check text-success me-2"></i>Nguồn gốc xuất xứ rõ ràng</li>
                    <li><i className="fas fa-check text-success me-2"></i>Giá cả hợp lý, phù hợp với chất lượng</li>
                  </ul>
                </div>
              </div>
              
              <h5 className="fw-bold text-warning">
                <i className="fas fa-book me-2"></i>HƯỚNG DẪN SỬ DỤNG
              </h5>
              <div className="usage-guide-content">
                <h6 className="fw-bold text-warning">Cách sử dụng:</h6>
                <ol className="usage-steps">
                  <li className="mb-2">
                    <strong>Bước 1:</strong> Kiểm tra hạn sử dụng trước khi sử dụng
                  </li>
                  <li className="mb-2">
                    <strong>Bước 2:</strong> Mở bao bì cẩn thận, tránh làm rơi vãi
                  </li>
                  <li className="mb-2">
                    <strong>Bước 3:</strong> Sử dụng theo nhu cầu, đảm bảo vệ sinh an toàn
                  </li>
                  <li className="mb-2">
                    <strong>Bước 4:</strong> Bảo quản sản phẩm còn lại ở nơi khô ráo, thoáng mát
                  </li>
                </ol>
                
                <div className="mt-4">
                  <h6 className="fw-bold text-warning">Lưu ý quan trọng:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"></i>Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp</li>
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"></i>Không sử dụng khi sản phẩm có dấu hiệu hư hỏng</li>
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"></i>Tránh xa tầm tay trẻ em</li>
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"></i>Đọc kỹ thông tin trên bao bì trước khi sử dụng</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          {tab === 'profile' && (
            <>
              <h5 className="fw-bold text-primary mb-3">
                <i className="fas fa-info-circle me-2"></i>THÔNG SỐ KỸ THUẬT
              </h5>
              {product && product.specifications ? (
                <div className="row">
                  <div className="col-md-6">
                    <table className="table table-striped table-bordered">
                <tbody>
                        <tr>
                          <td className="fw-bold bg-light">Mã SP:</td>
                          <td>
                            <span className="badge bg-primary">#{product.id.toString().padStart(6, '0')}</span>
                          </td>
                        </tr>
                        {product.category && (
                          <tr>
                            <td className="fw-bold bg-light">Danh mục:</td>
                            <td>
                              <span className="badge bg-info">{product.category.name}</span>
                            </td>
                          </tr>
                        )}
                        {product.brand && (
                          <tr>
                            <td className="fw-bold bg-light">Thương hiệu:</td>
                            <td>
                              <span className="badge bg-warning text-dark">{product.brand.name}</span>
                            </td>
                          </tr>
                        )}
                        {product.specifications.barcode && (
                          <tr>
                            <td className="fw-bold bg-light">Mã vạch:</td>
                            <td>{product.specifications.barcode}</td>
                          </tr>
                        )}
                        {product.specifications.origin && (
                          <tr>
                            <td className="fw-bold bg-light">Xuất xứ:</td>
                            <td>
                              <span className="badge bg-success">{product.specifications.origin}</span>
                            </td>
                          </tr>
                        )}
                        {product.specifications.weight_unit && (
                          <tr>
                            <td className="fw-bold bg-light">Đơn vị đo:</td>
                            <td>{product.specifications.weight_unit}</td>
                          </tr>
                        )}
                        {product.quantity && (
                          <tr>
                            <td className="fw-bold bg-light">Số lượng trong kho:</td>
                            <td>
                              <span className={`badge ${product.quantity > 10 ? 'bg-success' : product.quantity > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                {product.quantity} sản phẩm
                              </span>
                            </td>
                          </tr>
                        )}
                </tbody>
              </table>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-striped table-bordered">
                      <tbody>
                        {product.specifications.expiry_date && (
                          <tr>
                            <td className="fw-bold bg-light">Hạn sử dụng:</td>
                            <td>
                              <i className="fas fa-calendar-alt text-warning me-2"></i>
                              {new Date(product.specifications.expiry_date).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        )}
                        {product.specifications.purchase_price > 0 && (
                          <tr>
                            <td className="fw-bold bg-light">Giá nhập:</td>
                            <td>
                              <span className="text-muted">
                                <i className="fas fa-dollar-sign me-1"></i>
                                {product.specifications.purchase_price.toLocaleString()}₫
                              </span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="fw-bold bg-light">Giá bán:</td>
                          <td>
                            <span className="text-success fw-bold">
                              <i className="fas fa-tag me-1"></i>
                              {product.price.toLocaleString()}₫
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-bold bg-light">Đánh giá:</td>
                          <td>
                            <span className="text-warning">
                              <i className="fas fa-star me-1"></i>
                              {product.rating.toFixed(1)}/5.0
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p className="text-muted mt-2">Đang tải thông số sản phẩm...</p>
                </div>
              )}
            </>
          )}
          {tab === 'review' && (
            <>
              <h5 className="fw-bold text-info mb-3">
                <i className="fas fa-comments me-2"></i>ĐÁNH GIÁ & NHẬN XÉT
              </h5>
              {product && product.reviews ? (
            <div className="row">
              {/* Tổng quan đánh giá */}
              <div className="col-md-5">
                    <div className="card border-info">
                      <div className="card-header bg-info text-white">
                        <h6 className="mb-0">Tổng quan đánh giá</h6>
                  </div>
                      <div className="card-body text-center">
                        <div className="rating-display mb-3">
                          <span className="display-3 fw-bold text-warning">{product.reviews.rating.toFixed(1)}</span>
                          <div className="rating-stars mt-2">
                            {[1,2,3,4,5].map(star => (
                              <i key={star} className={`fas fa-star fs-5 ${star <= Math.round(product.reviews.rating) ? 'text-warning' : 'text-muted'}`}></i>
                            ))}
                </div>
                          <p className="text-muted mt-2">Đánh giá trung bình</p>
                </div>
                        
                        <div className="rating-breakdown text-start">
                          {[5,4,3,2,1].map(stars => {
                            const percentage = stars === Math.round(product.reviews.rating) ? 80 : Math.random() * 30 + 5;
                            return (
                              <div key={stars} className="mb-2">
                                <span className="me-2">{stars}★</span>
                                <div className="progress d-inline-block" style={{width: '100px', height: '8px'}}>
                                  <div 
                                    className="progress-bar bg-warning" 
                                    style={{width: `${percentage}%`}}
                                  ></div>
              </div>
                                <span className="ms-2 small">{Math.round(percentage)}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <button className="btn btn-outline-info w-100">
                        <i className="fas fa-plus me-2"></i>Viết đánh giá của bạn
                      </button>
                    </div>
                  </div>
                  
                  {/* Chi tiết đánh giá */}
              <div className="col-md-7">
                    <div className="review-detail">
                      <h6 className="fw-bold">Nhận xét chi tiết từ khách hàng:</h6>
                      
                      {/* Đánh giá từ database */}
                      <div className="border rounded p-3 mb-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <b className="text-primary">
                              <i className="fas fa-user-circle me-2"></i>Khách hàng đã mua
                            </b>
                            <span className="text-muted ms-2">
                              {product.reviews.updated_at ? new Date(product.reviews.updated_at).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                </div>
                          <div className="rating-stars">
                            {[1,2,3,4,5].map(star => (
                              <i key={star} className={`fas fa-star ${star <= Math.round(product.reviews.rating) ? 'text-warning' : 'text-muted'}`}></i>
                            ))}
                            <span className="ms-2 fw-bold">{product.reviews.rating.toFixed(1)}</span>
                </div>
                </div>
                        <div className="review-content">
                          <p className="mb-0 fst-italic">"{product.reviews.comment}"</p>
              </div>
                        <div className="mt-2">
                          <span className="badge bg-success">Đã xác thực mua hàng</span>
            </div>
        </div>
                      
                                            {/* Form thêm đánh giá */}
                      <div className="add-review-form">
                        <h6 className="fw-bold">Thêm đánh giá của bạn:</h6>
                        
                        {/* Hiển thị message */}
                        {reviewMessage && (
                          <div className={`alert ${reviewMessage.includes('✅') ? 'alert-success' : 'alert-danger'} mt-3`}>
                            {reviewMessage}
      </div>
                        )}
                        
                        <form onSubmit={handleReviewSubmit} className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Họ tên: <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Nhập họ tên của bạn"
                              value={reviewForm.customerName}
                              onChange={(e) => handleReviewChange('customerName', e.target.value)}
                              required
                              disabled={isSubmittingReview}
                  />
                </div>
                          <div className="col-md-6">
                            <label className="form-label">Đánh giá: <span className="text-danger">*</span></label>
                            <select 
                              className="form-select"
                              value={reviewForm.rating}
                              onChange={(e) => handleReviewChange('rating', parseInt(e.target.value))}
                              disabled={isSubmittingReview}
                            >
                              <option value={5}>5 sao - Tuyệt vời</option>
                              <option value={4}>4 sao - Tốt</option>
                              <option value={3}>3 sao - Bình thường</option>
                              <option value={2}>2 sao - Kém</option>
                              <option value={1}>1 sao - Rất kém</option>
                            </select>
                  </div>
                          <div className="col-12">
                            <label className="form-label">Nhận xét: <span className="text-danger">*</span></label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm... (Ít nhất 10 ký tự)"
                              value={reviewForm.comment}
                              onChange={(e) => handleReviewChange('comment', e.target.value)}
                              required
                              disabled={isSubmittingReview}
                              minLength={10}
                            ></textarea>
                            <small className="text-muted">
                              {reviewForm.comment.length}/10 ký tự tối thiểu
                            </small>
                  </div>
                          <div className="col-12">
                            <button 
                              type="submit" 
                              className="btn btn-info text-white"
                              disabled={isSubmittingReview || reviewForm.comment.length < 10 || !reviewForm.customerName.trim()}
                            >
                              {isSubmittingReview ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-paper-plane me-2"></i>Gửi đánh giá
                                </>
                              )}
                            </button>
              </div>
                        </form>
            </div>
        </div>
      </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                  <p className="text-muted mt-2">Đang tải thông tin đánh giá...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  )
}
