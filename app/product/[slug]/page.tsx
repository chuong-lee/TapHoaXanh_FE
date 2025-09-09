'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import api from '@/lib/axios'
import Image from 'next/image'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

// function fixImgSrc(src: string | null | undefined): string {
//   if (!src || typeof src !== 'string' || !src.trim() || src === 'null' || src === 'undefined') return '/images/placeholder.jpg';
//   src = src.toString().trim();
//   if (src.startsWith('http')) return src;
//   src = src.replace(/^\.\//, '');
//   if (src.startsWith('/')) return src;
//   if (src.startsWith('client/images/')) return '/' + src;
//   if (src.startsWith('images/')) return '/' + src;
//   return '/' + src;
// }

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'desc' | 'profile' | 'review' | 'related'>('desc')
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Lấy chi tiết sản phẩm theo slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('Đang tìm sản phẩm với slug:', slug);

        // Sử dụng API mới để lấy sản phẩm theo slug
        const res = await api.get<Product>(`/products/slug/${slug}`)
        console.log('Sản phẩm tìm thấy:', res.data);

        if (res.data) {
          setProduct(res.data)
          // Reset quantity về 1 khi load sản phẩm mới
          setQuantity(1)
        } else {
          console.log('Không tìm thấy sản phẩm với slug:', slug);
          setProduct(null)
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết sản phẩm:', err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  // Đảm bảo quantity không vượt quá tồn kho
  useEffect(() => {
    if (product && quantity > product.quantity) {
      setQuantity(Math.max(1, product.quantity))
    }
  }, [product, quantity])


  // Lấy sản phẩm liên quan cùng danh mục (không trùng với sản phẩm hiện tại)
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      
      try {
        const res = await api.get<Product[]>('/products');
        console.log(res.data, "res.data")
        
        // Lấy sản phẩm liên quan (loại trừ sản phẩm hiện tại)
        const relatedProducts = res.data
          .filter((item) => item.slug !== slug)
          .slice(0, 4);

        setRelatedProducts(relatedProducts);
      } catch {
        setRelatedProducts([]);
      }
    };
    fetchRelated();
  }, [slug, product]);

  if (loading) return <p>Đang tải sản phẩm...</p>
  if (!product) return <div className="alert alert-danger">Không tìm thấy sản phẩm</div>

  const getProductPrice = () => {
    // Giá sau giảm
    const finalPrice = product.price - product.discount;
    return finalPrice;
  };
  const totalPrice = getProductPrice() * quantity;

  return (
    <div className="container main-content py-4" style={{marginTop: 100}}>
      <style jsx>{`
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
              src={product.images}
              alt={product.name}
              width={400}
              height={400}
              className="object-fit-cover rounded w-100"
            />
          </div>
          <div className="d-flex gap-2 mt-3">

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
              {/* Thông tin giá */}
              <div className="mb-3">
                <div className="d-flex align-items-baseline">
                  <div className="fs-2 fw-bold text-dark me-3">
                    {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                  {product.discount > 0 && (
                    <div className="text-decoration-line-through text-muted">
                      {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </div>
                  )}
                </div>
                {product.discount > 0 && (
                  <div className="text-success fw-bold">
                    Tiết kiệm: {product.discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </div>
                )}
              </div>
              <div className="bg-light rounded p-3 mb-3">
                <ul className="mb-2">
                  <li>Mua <span className="text-success fw-bold">02</span> hộp tặng <a href="#" className="text-primary">Khay Snack</a></li>
                  <li>Mua <span className="text-success fw-bold">04</span> hộp tặng <a href="#" className="text-primary">Đồ chơi lắp ráp</a></li>
                </ul>
                <div className="text-secondary mb-2" style={{ fontSize: 14 }}>Khuyến mãi kết thúc lúc: <span className="fw-bold">9h00 tối, 25/5/2024</span></div>
                <div className="mt-2" style={{ fontSize: 15 }}>
                  <div><b>Mã SP:</b> <span className="text-success">{product.barcode || 'N/A'}</span></div>
                  <div><b>Xuất xứ:</b> <span className="text-success">{product.origin || 'N/A'}</span></div>
                  <div><b>Đơn vị:</b> <span className="text-success">{product.weight_unit || 'N/A'}</span></div>
                  <div><b>Hạn sử dụng:</b> <span className="text-success">{product.expiry_date || 'N/A'}</span></div>
                  <div><b>Tồn kho:</b> <span className="text-success">{product.quantity}</span></div>
                </div>
              </div>
            </div>
            {/* Right part of right column: Purchase Card */}
            <div className="col-md-5">
              <div className="card shadow-sm p-3" style={{ borderRadius: 12 }}>
                <div className="my-3">
                  {product.quantity > 0 ? (
                    <span className="badge bg-success bg-opacity-10 text-success me-2">
                      <i className="bi bi-check-circle-fill"></i> Còn hàng ({product.quantity})
                    </span>
                  ) : (
                    <span className="badge bg-danger bg-opacity-10 text-danger me-2">
                      <i className="bi bi-x-circle-fill"></i> Hết hàng
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center mb-3">
                  <button 
                    className="btn btn-light border rounded-pill px-3" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={product.quantity <= 0}
                  >-</button>
                  <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                  <button 
                    className="btn btn-light border rounded-pill px-3" 
                    onClick={() => setQuantity(q => Math.min(q + 1, product.quantity))}
                    disabled={product.quantity <= 0 || quantity >= product.quantity}
                  >+</button>
                </div>
                <button
                  className="btn w-100 mb-2 fw-bold"
                  style={{
                    background: product.quantity > 0 ? '#22c55e' : '#6c757d',
                    color: '#fff',
                    borderRadius: 8,
                    fontWeight: 600
                  }}
                  onClick={() => {
                    if (product.quantity <= 0) return;
                    const finalPrice = product.price - product.discount;
                    addToCart({
                      ...product,
                      price: finalPrice,
                    }, quantity);
                    router.push('/cart');
                  }}
                  disabled={product.quantity <= 0}
                >
                  {product.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </button>
                <div className="d-flex justify-content-between text-sm">
                  <a href="#" className="text-decoration-none text-success">Đã thêm vào yêu thích</a>
                  <a href="#" className="text-decoration-none text-muted">So sánh</a>
                </div>
                <hr />
                <div className="mb-2"><Image src="/images/safe-checkout.jpg" alt="Thanh toán an toàn" width={24} height={24} /></div>
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
              <h5 className="fw-bold">MÔ TẢ SẢN PHẨM</h5>
              <p>{product.description}</p>
              <h5 className="fw-bold mt-4">HƯỚNG DẪN SỬ DỤNG</h5>
              <p>{product.description}</p>
            </>
          )}
          {tab === 'profile' && (
            <>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>Đặc điểm</td><td>Ăn chay</td></tr>
                  <tr><td>Loại thành phần</td><td>Ăn chay</td></tr>
                  <tr><td>Thương hiệu</td><td>Lavian Exotique</td></tr>
                  <tr><td>Dạng</td><td>Bánh Brownie</td></tr>
                  <tr><td>Đóng gói</td><td>Hộp</td></tr>
                  <tr><td>Nhà sản xuất</td><td>Prayagh Nutri Product Pvt Ltd</td></tr>
                  <tr><td>Mã sản phẩm</td><td>LE 014 – 20pcs Crème Bakes (Pack of 2)</td></tr>
                  <tr><td>Số lượng</td><td>40 cái</td></tr>
                </tbody>
              </table>
            </>
          )}
          {tab === 'review' && (
            <div className="row">
              {/* Tổng quan đánh giá */}
              <div className="col-md-5">
                <div className="mb-3">
                  <span className="fs-2 fw-bold text-warning">5.0 ★</span>
                  <span className="ms-2">5 Điểm đánh giá</span>
                  <div className="mt-2">
                    <div>5★ <span className="bg-warning" style={{ width: '60px', display: 'inline-block', height: '8px' }}></span> 47</div>
                    <div>4★ <span className="bg-warning" style={{ width: '10px', display: 'inline-block', height: '8px' }}></span> 2</div>
                    <div>3★ <span className="bg-warning" style={{ width: '20px', display: 'inline-block', height: '8px' }}></span> 6</div>
                    <div>2★ <span className="bg-warning" style={{ width: '15px', display: 'inline-block', height: '8px' }}></span> 7</div>
                    <div>1★ <span className="bg-warning" style={{ width: '8px', display: 'inline-block', height: '8px' }}></span> 4</div>
                  </div>
                </div>
                <div className="mb-3">
                  <b>Đánh giá sản phẩm này</b>
                  <div>Hãy cho mọi người biết cảm nhận của bạn</div>
                  <button className="btn btn-outline-primary mt-2 w-100">Viết đánh giá</button>
                </div>
              </div>
              {/* Danh sách bình luận */}
              <div className="col-md-7">
                <div className="border rounded p-3 mb-2">
                  <b className="text-danger">Nguyễn Văn A</b> <span className="text-muted ms-2">29/09/2023 18:40</span>
                  <span className="float-end fw-bold">4.0</span>
                  <div className="mt-2">Sản phẩm không tốt như mong đợi, chất lượng kém, nhanh hỏng. Tôi sẽ cân nhắc kỹ hơn lần sau.</div>
                </div>
                <div className="border rounded p-3 mb-2">
                  <b className="text-danger">Trần Thị B</b> <span className="text-muted ms-2">29/09/2023 18:40</span>
                  <span className="float-end fw-bold">4.0</span>
                  <div className="mt-2">Sản phẩm không tốt như mong đợi, chất lượng kém, nhanh hỏng. Tôi sẽ cân nhắc kỹ hơn lần sau.</div>
                </div>
                <div className="border rounded p-3 mb-2">
                  <b className="text-danger">Lê Văn C</b> <span className="text-muted ms-2">29/09/2023 18:40</span>
                  <span className="float-end fw-bold">4.0</span>
                  <div className="mt-2">Sản phẩm không tốt như mong đợi, chất lượng kém, nhanh hỏng. Tôi sẽ cân nhắc kỹ hơn lần sau.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-5">
        <h5 className="fw-bold mb-3">SẢN PHẨM LIÊN QUAN</h5>
        <div className="row g-3">
          {relatedProducts.map((item) => {
            const basePrice = item.price;
            const finalPrice = basePrice - item.discount;
            return (
              <div className="col-3" key={item.id}>
                <div className="custom-product-card h-100">
                  <span className="badge-hot">
                    -{Math.round((item.discount / item.price) * 100)}%
                  </span>
                  <div className="product-image">
                    <Image
                      src={Array.isArray(item.images) ? item.images[0] : (typeof item.images === 'string' ? (item.images.split(',')[0] || '/images/placeholder.jpg') : '/images/placeholder.jpg')}
                      alt={item.name}
                      width={140}
                      height={140}
                      style={{ objectFit: 'contain', width: '100%', height: '140px', background: 'transparent' }}
                    />
                  </div>
                  <div className="product-info">
                    <div className="product-type">Đồ ăn vặt</div>
                    <div className="product-name">{item.name}</div>
                    <div className="product-brand">Bởi NestFood</div>
                    <div className="product-price">
                      <span className="price-main">{finalPrice.toLocaleString()}₫</span>
                      <span className="price-old">{basePrice.toLocaleString()}₫</span>
                    </div>
                    <div className="product-rating">
                      <span className="star">★</span> <span>4.0</span>
                    </div>
                  </div>
                  <a
                    href={item.slug ? `/product/${item.slug}` : '#'}
                    className="btn-add-cart"
                    style={{
                      background: '#38bdf8',
                      color: '#fff',
                      borderRadius: 999,
                      fontWeight: 600,
                      display: 'inline-block',
                      textAlign: 'center',
                      padding: '12px 24px',
                      cursor: item.slug ? 'pointer' : 'not-allowed',
                      pointerEvents: item.slug ? 'auto' : 'none'
                    }}
                  >
                    Xem chi tiết <i className="fa fa-eye"></i>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}
