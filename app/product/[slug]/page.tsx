'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { productService } from '@/lib/productService'
import Image from 'next/image'

interface ProductVariant {
  id: number;
  variant_name: string;
  price_modifier: number;
  stock: number;
  productId: number;
}

interface ApiProduct {
  id: number
  name: string
  price: number
  slug?: string
  images: string | string[]
  discount: number
  description: string
  category?: {
    id: number
    name: string
  }
  categoryId?: number
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
  // State cho bình luận
  type Comment = {
    name: string;
    content: string;
    rating: number;
    createdAt: string;
  };
  const [comments, setComments] = useState<Comment[]>([
    // Dữ liệu mẫu ban đầu
    {
      name: 'Nguyễn Văn A',
      content: 'Sản phẩm không tốt như mong đợi, chất lượng kém, nhanh hỏng. Tôi sẽ cân nhắc kỹ hơn lần sau.',
      rating: 4,
      createdAt: '29/09/2023 18:40',
    },
    {
      name: 'Trần Thị B',
      content: 'Sản phẩm không tốt như mong đợi, chất lượng kém, nhanh hỏng. Tôi sẽ cân nhắc kỹ hơn lần sau.',
      rating: 4,
      createdAt: '29/09/2023 18:40',
    },
    {
      name: 'Lê Văn C',
      content: 'Sản phẩm không tốt như mong đợi, chất lượng kém, nhanh hỏng. Tôi sẽ cân nhắc kỹ hơn lần sau.',
      rating: 4,
      createdAt: '29/09/2023 18:40',
    },
  ]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentName, setCommentName] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentContent.trim()) return;
    setComments([
      {
        name: commentName,
        content: commentContent,
        rating: commentRating,
        createdAt: new Date().toLocaleString('vi-VN'),
      },
      ...comments,
    ]);
    setCommentName('');
    setCommentContent('');
    setCommentRating(5);
    setShowCommentForm(false);
  };
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
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Tạo slug từ tên sản phẩm giống như trong trang listing
  const generateSlug = (name: string, id: number) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${id}`
  }

  // Lấy chi tiết sản phẩm theo slug
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('Đang tìm sản phẩm với slug:', slug);
        // Sử dụng productService để lấy đúng sản phẩm theo slug
        const found = await productService.getProductBySlug(slug);
        if (found) {
          // Xử lý images về dạng mảng nếu cần
          const images: string[] = typeof found.images === 'string'
            ? found.images.split(',').map((s: string) => s && s.trim()).filter((s: string) => !!s && s !== 'null' && s !== 'undefined')
            : (Array.isArray(found.images) ? found.images.filter((s: string) => !!s && s !== 'null' && s !== 'undefined') : []);
          const productWithImagesArray = {
            ...found,
            images,
            slug: found.slug || generateSlug(found.name, found.id)
          };
          setProduct(productWithImagesArray as Product);
          setSelectedImage(images[0] || null);
          console.log('Đã set product thành công với slug:', productWithImagesArray.slug);
        } else {
          console.log('Không tìm thấy sản phẩm với slug:', slug);
          setProduct(null);
        }
      } catch (err) {
        console.error('Lỗi lấy chi tiết sản phẩm:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Lấy biến thể đúng theo id của sản phẩm đang xem
  useEffect(() => {
    const fetchVariants = async () => {
      if (!product) return;
      try {
        const response = await fetch(`http://localhost:4000/product-variant?productId=${product.id}`);
        if (response.ok) {
          const data = await response.json();
          setVariants(Array.isArray(data) ? data : []);
        } else {
          setVariants([]);
        }
      } catch (e) {
        console.error('Lỗi lấy variants:', e);
        setVariants([]);
      }
    };
    fetchVariants();
  }, [product])

  // Lấy tất cả sản phẩm liên quan (không trùng với sản phẩm hiện tại)
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Lấy tất cả sản phẩm (limit lớn)
        const products = await productService.getAllProducts({ limit: 1000 });
        // Loại bỏ sản phẩm hiện tại
        let filteredProducts = products.filter((item) => item.slug !== slug);
        setRelatedProducts(filteredProducts);
      } catch (e) {
        console.error('Lỗi lấy sản phẩm liên quan:', e);
        setRelatedProducts([]);
      }
    };
    fetchRelated();
  }, [slug]);

  if (loading) return <p>Đang tải sản phẩm...</p>
  if (!product) return <div className="alert alert-danger">Không tìm thấy sản phẩm</div>

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
                  <div><b>Mã SP:</b> <span className="text-success">{product.id}</span></div>
                  <div><b>Danh mục:</b> <span className="text-success">{product.category?.name || 'Không rõ'}</span></div>
                  <div><b>Thương hiệu:</b> <span className="text-success">{(product as any).brand || 'Không rõ'}</span></div>
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
            {/* Right part */}
            <div className="col-md-5">
              <div className="card shadow-sm p-3" style={{ borderRadius: 12 }}>
                <div className="d-flex align-items-baseline">
                  <div className="fs-2 fw-bold text-dark">
                    {selectedVariant ? (
                      <span>{totalPrice.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
                    ) : (
                      <span className="text-muted" style={{ fontSize: 18 }}>Vui lòng chọn phiên bản</span>
                    )}
                  </div>
                </div>
                <div className="my-3">
                  <span className="badge bg-success bg-opacity-10 text-success me-2">
                    <i className="bi bi-check-circle-fill"></i> Còn hàng
                  </span>
                </div>
                {selectedVariant && (
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
                  <div className="alert alert-warning mt-2">Sản phẩm này chưa có biến thể, không thể mua.</div>
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
                  <button className="btn btn-outline-primary mt-2 w-100" onClick={() => setShowCommentForm(v => !v)}>
                    {showCommentForm ? 'Đóng' : 'Viết đánh giá'}
                  </button>
                  {showCommentForm && (
                    <form className="mt-3 border rounded p-3 bg-light" onSubmit={handleAddComment}>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Tên của bạn"
                          value={commentName}
                          onChange={e => setCommentName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          placeholder="Nội dung đánh giá"
                          value={commentContent}
                          onChange={e => setCommentContent(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="me-2">Chấm điểm:</label>
                        <select value={commentRating} onChange={e => setCommentRating(Number(e.target.value))}>
                          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ★</option>)}
                        </select>
                      </div>
                      <button type="submit" className="btn btn-success w-100">Gửi đánh giá</button>
                    </form>
                  )}
                </div>
              </div>
              {/* Danh sách bình luận */}
              <div className="col-md-7">
                {comments.length === 0 && (
                  <div className="text-muted">Chưa có đánh giá nào.</div>
                )}
                {comments.map((c, idx) => (
                  <div className="border rounded p-3 mb-2" key={idx}>
                    <b className="text-danger">{c.name}</b> <span className="text-muted ms-2">{c.createdAt}</span>
                    <span className="float-end fw-bold">{c.rating}.0 ★</span>
                    <div className="mt-2">{c.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Related Products */}
      <div className="mt-5">
        <h5 className="fw-bold mb-3">SẢN PHẨM LIÊN QUAN</h5>
        <div className="row g-3">
          {relatedProducts.map((item, i) => {
            const basePrice = item.price;
            const finalPrice = basePrice - item.discount;
            // Sử dụng slug nếu có, nếu không thì generateSlug
            const detailSlug = item.slug ? item.slug : generateSlug(item.name, item.id);
            return (
            <div className="col-3" key={item.id}>
              <div className="custom-product-card h-100">
                  <span className="badge-hot">
                    -{Math.round((item.discount / item.price) * 100)}%
                  </span>
                <div className="product-image">
                  <Image
                    src={fixImgSrc(Array.isArray(item.images) ? item.images[0] : (typeof item.images === 'string' ? (item.images.split(',')[0] || '/images/placeholder.png') : '/images/placeholder.png'))}
                    alt={item.name}
                    width={140}
                    height={140}
                    style={{objectFit: 'contain', width: '100%', height: '140px', background: 'transparent'}}
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
                  href={`/product/${detailSlug}`}
                  className="btn-add-cart"
                  style={{
                    background: '#38bdf8',
                    color: '#fff',
                    borderRadius: 999,
                    fontWeight: 600,
                    display: 'inline-block',
                    textAlign: 'center',
                    padding: '12px 24px',
                    cursor: detailSlug ? 'pointer' : 'not-allowed',
                    pointerEvents: detailSlug ? 'auto' : 'none'
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
  );
}
