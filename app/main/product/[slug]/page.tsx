'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import api from '@/lib/axios'
import Image from 'next/image'

type Product = {
  id: number
  name: string
  price: number
  slug: string
  images: string | string[]
  discount: number
  description: string
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { addToCart } = useCart()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState<'desc'|'profile'|'review'|'related'>('desc')
  const [colors, setColors] = useState([]);
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get<Product[]>('/products')
        const found = res.data.find((item) => item.slug === slug)

        if (found) {
          const images: string[] = typeof found.images === 'string'
            ? found.images.split(',').map((s: string) => s.trim())
            : (found.images || [])

          const productWithImagesArray = { ...found, images }
          setProduct(productWithImagesArray as Product)
          setSelectedImage(productWithImagesArray.images[0] || null)
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

  useEffect(() => {
    const fetchVariants = async () => {
      if (!product) return;
      const res = await api.get(`/product-variant?productId=${product.id}`);
      // Giả sử res.data là mảng variant, mỗi variant có type: 'color' hoặc 'memory'
      setColors(res.data.filter(v => v.type === 'color'));
      setMemories(res.data.filter(v => v.type === 'memory'));
    };
    fetchVariants();
  }, [product]);

  if (loading) return <p>Đang tải sản phẩm...</p>
  if (!product) return <div className="alert alert-danger">Không tìm thấy sản phẩm</div>

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
              src={selectedImage || '/images/placeholder.png'}
              alt={product.name}
              width={400}
              height={400}
              className="rounded w-100"
            />
          </div>
          <div className="d-flex gap-2 mt-3">
            {(() => {
              let imgs = product.images as string[];
              if (imgs.length < 3) {
                imgs = [...imgs];
                while (imgs.length < 3) imgs.push(imgs[0]);
              }
              return imgs.slice(0, 3).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  width={60}
                  height={60}
                  className={`border rounded product-thumb${selectedImage === img ? ' selected' : ''}`}
                  onClick={() => setSelectedImage(img)}
                />
              ));
            })()}
          </div>
        </div>
        {/* Right: Product Info & Purchase Card */}
        <div className="col-md-7">
          <div className="row">
            {/* Left part of right column: Info */}
            <div className="col-md-7">
              <h4 className="mb-1">{product.name}</h4>
              <div className="mb-2 text-muted">SKU: ABC025168 | CATEGORY: Cell Phones & Tablets | BRAND: Somsung</div>
              <ul>
                <li>Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core</li>
                <li>DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory</li>
                <li>Commanding Power Design: Twin 16+1+2 Phases Digital VRM</li>
              </ul>
              <div className="mb-2">
                <span className="text-success fw-bold">FREE SHIPPING</span>
                <span className="text-danger ms-3 fw-bold">FREE GIFT</span>
              </div>
              <div className="mb-3">
                <span className="fw-bold">COLOR: {selectedColor ? COLORS.find(c => c.value === selectedColor)?.label : ''}</span>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {colors.map(c => (
                    <label key={c.value} className={`btn option-btn${selectedColor === c.value ? ' active' : ''} rounded-3 px-3 py-2`} style={{minWidth:120}}>
                      <input type="radio" name="color" value={c.value} checked={selectedColor === c.value} onChange={() => setSelectedColor(c.value)} className="d-none" />
                      <div>{c.label}</div>
                      <div className="fw-bold">${c.price}.00</div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <span className="fw-bold">MEMORY SIZE: {selectedMemory ? MEMORY.find(m => m.value === selectedMemory)?.label : ''}</span>
                <div className="d-flex flex-wrap gap-2 mt-1">
                  {memories.map(m => (
                    <label key={m.value} className={`btn option-btn${selectedMemory === m.value ? ' active' : ''} rounded-3 px-3 py-2 fw-bold`} style={{minWidth:90}}>
                      <input type="radio" name="memory" value={m.value} checked={selectedMemory === m.value} onChange={() => setSelectedMemory(m.value)} className="d-none" />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-light rounded p-3 mb-3">
                <ul className="mb-2">
                  <li>Buy <span className="text-success fw-bold">02</span> boxes get a <a href="#" className="text-primary">Snack Tray</a></li>
                  <li>Buy <span className="text-success fw-bold">04</span> boxes get a free <a href="#" className="text-primary">Block Toys</a></li>
                </ul>
                <div className="text-secondary mb-2" style={{fontSize:14}}>Promotion will expires in: <span className="fw-bold">9h00pm, 25/5/2024</span></div>
                <div className="mt-2" style={{fontSize:15}}>
                  <div><b>SKU:</b> <span className="text-success">ABCO25168</span></div>
                  <div><b>CATEGORY:</b> <span className="text-success">Cell Phones & Tablets</span></div>
                  <div><b>BRAND:</b> <span className="text-success">somsung</span></div>
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
              <div className="card shadow-sm p-3" style={{borderRadius: 12}}>
                <div className="d-flex align-items-baseline">
                  <div className="fs-2 fw-bold text-dark">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </div>
                  <small className="text-muted ms-2">affirm $49/mo in 12 months.</small>
                </div>

                <div className="my-3">
                  <span className="badge bg-success bg-opacity-10 text-success me-2">
                    <i className="bi bi-check-circle-fill"></i> In stock
                  </span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <button className="btn btn-light border rounded-pill px-3" onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                  <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                  <button className="btn btn-light border rounded-pill px-3" onClick={() => setQuantity(q => q+1)}>+</button>
                </div>

                <button
                  className="btn btn-success btn-lg w-100 mb-2 fw-bold"
                  style={{borderRadius: 8}}
                  onClick={() => addToCart({
                    ...product,
                    images: Array.isArray(product.images) ? product.images.join(',') : product.images,
                    id: product.id, name: product.name, price: product.price,
                    slug: product.slug, discount: product.discount, description: product.description
                  })}
                  disabled={!selectedColor || !selectedMemory}
                >
                  ADD TO CART
                </button>
                <button className="btn btn-warning btn-lg w-100 mb-3 fw-bold" style={{borderRadius: 8}} disabled={!selectedColor || !selectedMemory}>
                  BUY WITH PayPal
                </button>

                <div className="d-flex justify-content-between text-sm">
                  <a href="#" className="text-decoration-none text-success">Wishlist added</a>
                  <a href="#" className="text-decoration-none text-muted">Compare</a>
                </div>
                <hr/>
                <div className="mb-2"><img src="/images/safe-checkout.png" alt="Safe Checkout" style={{height:24}} /></div>
                <div className="mb-2 fw-bold">Quick Order 24/7<br/><span className="fw-normal">(025) 3886 25 16</span></div>
                <div className="mb-2"><i className="bi bi-truck"></i> Ships from <a href="#" className="text-decoration-none">United States</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="mt-5">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button className={`nav-link${tab==='desc'?' active':''}`} onClick={()=>setTab('desc')}>Home</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link${tab==='profile'?' active':''}`} onClick={()=>setTab('profile')}>Profile</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link${tab==='review'?' active':''}`} onClick={()=>setTab('review')}>Contact</button>
          </li>
        </ul>
        <div className="border border-top-0 p-4 bg-white">
          {tab==='desc' && (
            <>
              <h5 className="fw-bold">MÔ TẢ SẢN PHẨM</h5>
              <p>{product.description}</p>
              <h5 className="fw-bold mt-4">HƯỚNG DẪN SỬ DỤNG</h5>
              <p>{product.description}</p>
            </>
          )}
          {tab==='profile' && (
            <>
              <table className="table table-bordered">
                <tbody>
                  <tr><td>Specialty</td><td>Vegetarian</td></tr>
                  <tr><td>Ingredient Type</td><td>Vegetarian</td></tr>
                  <tr><td>Brand</td><td>Lavian Exotique</td></tr>
                  <tr><td>Form</td><td>Bar Brownie</td></tr>
                  <tr><td>Package Information</td><td>Box</td></tr>
                  <tr><td>Manufacturer</td><td>Prayagh Nutri Product Pvt Ltd</td></tr>
                  <tr><td>Item part number</td><td>LE 014 – 20pcs Crème Bakes (Pack of 2)</td></tr>
                  <tr><td>Net Quantity</td><td>40.00 count</td></tr>
                </tbody>
              </table>
            </>
          )}
          {tab==='review' && (
            <div className="row">
              {/* Tổng quan đánh giá */}
              <div className="col-md-5">
                <div className="mb-3">
                  <span className="fs-2 fw-bold text-warning">5.0 ★</span>
                  <span className="ms-2">5 Overall Rating</span>
                  <div className="mt-2">
                    <div>5★ <span className="bg-warning" style={{width:'60px',display:'inline-block',height:'8px'}}></span> 47</div>
                    <div>4★ <span className="bg-warning" style={{width:'10px',display:'inline-block',height:'8px'}}></span> 2</div>
                    <div>3★ <span className="bg-warning" style={{width:'20px',display:'inline-block',height:'8px'}}></span> 6</div>
                    <div>2★ <span className="bg-warning" style={{width:'15px',display:'inline-block',height:'8px'}}></span> 7</div>
                    <div>1★ <span className="bg-warning" style={{width:'8px',display:'inline-block',height:'8px'}}></span> 4</div>
                  </div>
                </div>
                <div className="mb-3">
                  <b>Review this product</b>
                  <div>Let other customers know what you think</div>
                  <button className="btn btn-outline-primary mt-2 w-100">Write a review</button>
                </div>
              </div>
              {/* Danh sách bình luận */}
              <div className="col-md-7">
                <div className="border rounded p-3 mb-2">
                  <b className="text-danger">Jack Doe</b> <span className="text-muted ms-2">29 Sep 2023 06:40PM</span>
                  <span className="float-end fw-bold">4.0</span>
                  <div className="mt-2">Avoid this product. The quality is terrible, and it started falling apart almost immediately. I wish I had read more reviews before buying. Lesson learned.</div>
                </div>
                <div className="border rounded p-3 mb-2">
                  <b className="text-danger">Jessica Miller</b> <span className="text-muted ms-2">29 Sep 2023 06:40PM</span>
                  <span className="float-end fw-bold">4.0</span>
                  <div className="mt-2">Avoid this product. The quality is terrible, and it started falling apart almost immediately. I wish I had read more reviews before buying. Lesson learned.</div>
                </div>
                <div className="border rounded p-3 mb-2">
                  <b className="text-danger">Rome Doe</b> <span className="text-muted ms-2">29 Sep 2023 06:40PM</span>
                  <span className="float-end fw-bold">4.0</span>
                  <div className="mt-2">Avoid this product. The quality is terrible, and it started falling apart almost immediately. I wish I had read more reviews before buying. Lesson learned.</div>
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
          {[1,2,3,4].map(i => (
            <div className="col-3" key={i}>
              <div className="border rounded p-2 text-center">
                <Image src="/images/lemons.png" alt="related" width={120} height={120} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}