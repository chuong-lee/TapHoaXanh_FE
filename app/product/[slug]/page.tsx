'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import api from '@/lib/axios'
import Image from 'next/image'

interface ProductVariant {
  id: number;
  variant_name: string;
  price_modifier: number;
  stock: number;
  productId: number;
}

type Product = {
  id: number
  name: string
  price: number
  slug: string
  images: string | string[]
  discount: number
  description: string
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

  // Lấy chi tiết sản phẩm theo slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get<Product[]>('/products')
        const found = res.data.find((item) => item.slug === slug)
        if (found) {
          const images: string[] = typeof found.images === 'string'
            ? found.images
                .split(',')
                .map(s => s && s.trim())
                .filter(s => !!s && s !== 'null' && s !== 'undefined')
            : (Array.isArray(found.images) ? found.images.filter(s => !!s && s !== 'null' && s !== 'undefined') : []);
          const productWithImagesArray = { ...found, images }
          setProduct(productWithImagesArray as Product)
          setSelectedImage(images[0] || null)
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết sản phẩm:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  // Lấy biến thể đúng theo id của sản phẩm đang xem
  useEffect(() => {
    const fetchVariants = async () => {
      if (!product) return;
      try {
        const res = await api.get<ProductVariant[]>(`/product-variant?productId=${product.id}`);
        setVariants(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setVariants([]);
      }
    };
    fetchVariants();
  }, [product])

  if (loading) return <p>Đang tải sản phẩm...</p>
  if (!product) return <div className="alert alert-danger">Không tìm thấy sản phẩm</div>

  const getSelectedPrice = () => {
    const base = product.price * (1 - product.discount / 100);
    const variant = variants.find(v => v.id === selectedVariant);
    return base + (variant?.price_modifier || 0);
  };
  const totalPrice = getSelectedPrice() * quantity;

  return (
    <div className="container py-4">
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
                    alt={`thumb-${index}`}
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
              <div className="mb-2 text-muted">
                Mã SP: COCA330 | DANH MỤC: Nước giải khát | THƯƠNG HIỆU: Coca-Cola
              </div>
              <ul>
                <li>Nước giải khát có gas, hương vị truyền thống</li>
                <li>Thể tích: 330ml/lon</li>
                <li>Thích hợp cho mọi bữa tiệc, dã ngoại, giải khát tức thì</li>
              </ul>
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
                  <div><b>Mã SP:</b> <span className="text-success">ABCO25168</span></div>
                  <div><b>Danh mục:</b> <span className="text-success">Điện thoại & Máy tính bảng</span></div>
                  <div><b>Thương hiệu:</b> <span className="text-success">Somsung</span></div>
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
                    {totalPrice.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}
                  </div>
                </div>
                <div className="my-3">
                  <span className="badge bg-success bg-opacity-10 text-success me-2">
                    <i className="bi bi-check-circle-fill"></i> Còn hàng
                  </span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <button className="btn btn-light border rounded-pill px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                  <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                  <button className="btn btn-light border rounded-pill px-3" onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
                <button
                  className="btn btn-success btn-lg w-100 mb-2 fw-bold"
                  style={{ borderRadius: 8 }}
                  onClick={() => {
                    if (!selectedVariant) return;
                    const variant = variants.find(v => v.id === selectedVariant);
                    addToCart({
                      ...product,
                      variant_id: variant?.id,
                      variant_name: variant?.variant_name,
                      price: product.price + (variant?.price_modifier || 0),
                      stock: variant?.stock || 0,
                      images: Array.isArray(product.images) ? product.images.join(',') : product.images,
                      quantity, // nhớ truyền số lượng!
                    });
                    router.push('/cart');
                  }}
                  disabled={!selectedVariant}
                >
                  Thêm vào giỏ hàng
                </button>
                <button className="btn btn-warning btn-lg w-100 mb-3 fw-bold" style={{ borderRadius: 8 }} disabled={!selectedVariant}>
                  Mua với PayPal
                </button>
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
          {[1, 2, 3, 4].map(i => (
            <div className="col-3" key={i}>
              <div className="border rounded p-2 text-center">
                <Image src="/images/lemons.png" alt="Sản phẩm liên quan" width={120} height={120} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
