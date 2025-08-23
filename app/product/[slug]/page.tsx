'use client'

import { , useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from &#39;@/hooks/useCart'
import api from &#39;@/lib/axios'
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
  const [currentProduct, setCurrentProduct] = useState<Product[]&gt;([]);
  const [category, setCategory] = useState<[]&gt;([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product[]&gt;([]);
  const [bestSellingProduct, setBestSellingProduct] = useState<Product[]&gt;([]);
  const [bannerList, setBannerList] = useState<Banner[]&gt;([]);
  // Fetch all data on mount
  (() =&gt; {
    const fetchAll = async () =&gt; {
      try {
        // Products
        const productRes = await api.get(&#39;/api/products');
        let products: [] = [];
        if (productRes.data && Array.isArray(productRes.data.data)) {
          products = productRes.data.data;
        } else if (Array.isArray(productRes.data)) {
          products = productRes.data;
        }
        setCurrentProduct(products);

        // Categories
        const catRes = await api.get(&#39;/api/category');
        let cats: Category[] = [];
        if (catRes.data && Array.isArray(catRes.data.data)) {
          cats = catRes.data.data;
        } else if (Array.isArray(catRes.data)) {
          cats = catRes.data;
        }
        setCategory(cats);

        // Banner - skip for now as we don't have this endpoint yet
        // const bannerRes = await api.get(&#39;/api/banner');
        // let banners: Banner[] = [];
        // if (bannerRes.data && Array.isArray(bannerRes.data.data)) {
        //   banners = bannerRes.data.data;
        // } else if (Array.isArray(bannerRes.data)) {
        //   banners = bannerRes.data;
        // }
        // setBannerList(banners);
        setBannerList([]); // Empty for now

        // Featured products (ví dụ: sản phẩm có discount &gt; 0)
        setFeaturedProduct(products.filter(p =&gt; p.discount &gt; 0).slice(0, 10));

        // Best selling (ví dụ: sản phẩm có price &gt; 100000)
        setBestSellingProduct(products.filter(p =&gt; p.price &gt; 100000).slice(0, 10));
      } catch (err) {
        // Có thể log hoặc xử lý  nếu muốn
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
  if (!src || typeof src !== 'string' || !src.trim() || src === 'null' || src === 'undefined') return &#39;/images/placeholder.png';
  src = src.toString().trim();
  if (src.startsWith('http')) return src;
  src = src.replace(/^\.\//, &#39;');
  if (src.startsWith(&#39;/')) return src;
  if (src.startsWith('client/images/&#39;)) return &#39;/' + src;
  if (src.startsWith('images/&#39;)) return &#39;/' + src;
  return &#39;/' + src;
}

// Helper function để tạo slug consistent
function createProductSlug(product: { slug?: string; name?: string; id: number }): string {
  let productSlug = &#39;'
  
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
    .replace(/[\u0300-\u036f]/g, &#39;')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, &#39;')
    .replace(/\s+/g, &#39;-')
    .replace(/-+/g, &#39;-')
    .replace(/^-+|-+$/g, &#39;');
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [, setCanScrollLeft] = useState(false)
  const [, setCanScrollRight] = useState(true)
  
  // Review form state
  const [reviewForm, setReviewForm] = useState({
    : &#39;',
    rating: 5,
    comment: &#39;'
  })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewMessage, setReviewMessage] = useState(&#39;')

  // Thêm state để hiển thị thông báo thêm vào giỏ hàng
  const [addToCartMessage, setAddToCartMessage] = useState(&#39;')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Thêm hàm xử lý thêm vào giỏ hàng với thông báo
  const handleAddToCart = async (product: Product, variant?: ProductVariant) =&gt; {
    try {
      setIsAddingToCart(true)
      setAddToCartMessage(&#39;')
      
      const finalPrice = variant 
        ? (variant.price_modifier === 0 ? product.price : product.price + variant.price_modifier) - product.discount
        : product.price - product.discount
      
      const cartItem = {
        ...product,
        variant_id: variant?.id,
        variant_name: variant?.variant_name,
        price: finalPrice,
        stock: variant?.stock || product.quantity || 0,
        images: Array.isArray(product.images) ? product.images.join(&#39;,') : product.images,
      }
      
      addToCart(cartItem, quantity)
      
      setAddToCartMessage(&#39;✅ Đã thêm vào giỏ hàng thành công!&#39;)
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() =&gt; {
        setAddToCartMessage(&#39;')
      }, 3000)
      
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:&#39;, )
      setAddToCartMessage(&#39;❌ Có lỗi xảy ra khi thêm vào giỏ hàng')
      
      // Tự động ẩn thông báo lỗi sau 3 giây
      setTimeout(() =&gt; {
        setAddToCartMessage(&#39;')
      }, 3000)
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Function để kiểm tra scroll position
  const checkScrollButtons = () =&gt; {
    const slider = document.getElementById('related-products-slider');
    if (slider) {
      setCanScrollLeft(slider.scrollLeft &gt; 0);
      setCanScrollRight(slider.scrollLeft &lt; slider.scrollWidth - slider.clientWidth);
    }
  };

  // Function để scroll slider
  
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
  const handleReviewChange = (field: string, value: string | number) =&gt; {
    setReviewForm(prev =&gt; ({
      ...prev,
      [field]: value
    }))
  }

  // Handle review form submit
  const handleReviewSubmit = async (e: React.FormEvent) =&gt; {
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
    
    if (reviewForm.comment.trim().length &lt; 10) {
      setReviewMessage('Nhận xét phải có ít nhất 10 ký tự&#39;)
      return
    }
    
    setIsSubmittingReview(true)
    setReviewMessage(&#39;')
    
    try {
      const response = await fetch(&#39;/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          customerName: reviewForm..trim(),
          rating: reviewForm.rating,
          comment: reviewForm.comment.trim()
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setReviewMessage(&#39;✅ Cảm ơn bạn đã đánh giá! Đánh giá của bạn đã được lưu.&#39;)
        // Reset form
        setReviewForm({
          : &#39;',
          rating: 5,
          comment: &#39;'
        })
        
        // Reload product data để cập nhật rating mới
        setTimeout(() =&gt; {
          window.location.reload()
        }, 2000)
      } else {
        setReviewMessage(`❌ ${result.message}`)
      }
    } catch (error) {
      console.error('Error submitting review:&#39;, )
      setReviewMessage(&#39;❌ Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.&#39;)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  // Lấy chi tiết sản phẩm - SỬA LỖI URL ENCODING
  useEffect(() =&gt; {
    const fetchProduct = async () =&gt; {
      try {
        setLoading(true)
        console.log(&#39;🔍 Tìm sản phẩm với slug:&#39;, slug)

        // Encode slug để tránh lỗi URL
        const encodedSlug = encodeURIComponent(slug)
        console.log(&#39;🔍 Encoded slug:&#39;, encodedSlug)

        // Gọi API endpoint với slug đã encode
        const response = await fetch(`/api/products/detail/${encodedSlug}`)
        
        if (!response.ok) {
          console.(&#39;❌ API response not ok:&#39;, response.status, response.statusText)
          setProduct(null)
          setLoading(false)
          return
        }
        
        const result = await response.json()
        console.log(&#39;📦 API Response:&#39;, result)
        
        if (!result.success || !result.data) {
          console.(&#39;❌ Không tìm thấy sản phẩm:&#39;, result.message)
          setProduct(null)
          setLoading(false)
          return
        }

        const productData = result.data
        console.log(&#39;✅ Đã tìm thấy sản phẩm:&#39;, productData.name)
        
        // Xử lý images
        let images: string[] = []
        if (typeof productData.images === 'string') {
          images = productData.images.split(&#39;,').map(s =&gt; s.trim()).filter(s =&gt; s && s !== 'null')
        } else if (Array.isArray(productData.images)) {
          images = productData.images.filter(s =&gt; s && s !== 'null')
        }

        if (images.length === 0) {
          images = [&#39;/client/images/product.png']
        }

        const finalProduct = {
          ...productData,
          images: images
        }

        console.log(&#39;📋 Product specifications:&#39;, finalProduct.specifications)
        console.log(&#39;⭐ Product reviews:&#39;, finalProduct.reviews)
        console.log(&#39;📝 Product description:&#39;, finalProduct.description)

        setProduct(finalProduct)
        setSelectedImage(images[0])
        setLoading(false)
        
      } catch (error) {
        console.error(&#39;🚨 Lỗi fetch sản phẩm:&#39;, )
        setProduct(null)
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])


  // Lấy biến thể và related products theo cùng category
  useEffect(() =&gt; {
      if (!product) return;
    
    const fetchVariantsAndRelated = async () =&gt; {
      try {
        console.log(&#39;🔍 Lấy variants và sản phẩm liên quan cho product:&#39;, product.name, 'categoryId:&#39;, product.categoryId);
        
        // Gọi variants và related products thông minh dựa trên sản phẩm hiện tại
        const [variantRes, relatedRes] = await Promise.all([
          fetch(`/api/product-variant?productId=${product.id}`),
          fetch(`/api/products/related/${product.id}?limit=12`) // API thông minh cho related products
        ]);
        
        // Set variants
        const variantData = await variantRes.json();
        const variants = variantData.success && Array.isArray(variantData.data) ? variantData.data : [];
        setVariants(variants);
        console.log(&#39;📦 Variants:&#39;, variants.length);
        
        // Set related products (API đã tự động loại trừ sản phẩm hiện tại)
        const relatedData = await relatedRes.json();
        const relatedProducts = relatedData.success && Array.isArray(relatedData.data) ? relatedData.data : [];
        
        setRelatedproduct(relatedProducts);
        console.log(&#39;🔗 Smart related products:&#39;, relatedProducts.length);
        
        // Log breakdown nếu có
        if (relatedData.meta?.breakdown) {
          const { breakdown } = relatedData.meta;
          console.log(&#39;📊 Related products breakdown:&#39;);
          console.log(`- Cùng category + brand: ${breakdown.sameCategoryBrand}`);
          console.log(`- Cùng category khác brand: ${breakdown.sameCategory}`);
          console.log(`- Cùng khoảng giá: ${breakdown.similarPrice}`);
        }
        
      } catch (error) {
        console.error(&#39;🚨 Lỗi fetch variants/related:&#39;, );
        setVariants([]);
        setRelatedproduct([]);
      }
    };
    
    fetchVariantsAndRelated();
  }, [product])

  // Check scroll buttons sau khi related products load
  useEffect(() =&gt; {
    if (relatedproduct.length &gt; 0) {
      setTimeout(checkScrollButtons, 100);
    }
  }, [relatedproduct])



  if (loading) return (
    <div className="container main-content py-4" style={{ paddingTop: 110 }}&gt;
      <div className="row"&gt;
        <div className="col-md-5"&gt;
          <div className="placeholder-glow"&gt;
            <div className="placeholder" style={{width: '100%&#39;, height: 400}}&gt;&lt;/div>
          &lt;/div>
        &lt;/div>
        <div className="col-md-7"&gt;
          <div className="placeholder-glow"&gt;
            <div className="placeholder col-6 mb-3"&gt;&lt;/div>
            <div className="placeholder col-8 mb-2"&gt;&lt;/div>
            <div className="placeholder col-4 mb-3"&gt;&lt;/div>
            <div className="placeholder col-12 mb-2"&gt;&lt;/div>
            <div className="placeholder col-5"&gt;&lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
    &lt;/div>
  )
  
  if (!product) return (
    <div className="container main-content py-4" style={{ paddingTop: 110 }}&gt;
      <div className="alert alert-danger"&gt;
        <h4>Không tìm thấy sản phẩm</h4>
        <p>Sản phẩm có thể đã bị xóa hoặc URL không chính xác.&lt;/p>
        <a href=&quot;/" className="btn btn-primary">Về trang chủ&lt;/a>
      &lt;/div>
    &lt;/div>
  )

  const getSelectedPrice = () =&gt; {
    const variant = variants.find(v =&gt; v.id === selectedVariant);
    const priceModifier = variant?.price_modifier || 0;

    // Nếu priceModifier = 0, giá gốc là product.price
    // Nếu priceModifier &gt; 0, giá gốc là product.price + priceModifier
    const basePrice = priceModifier === 0 ? product.price : product.price + priceModifier;

    // Giá sau giảm
    const finalPrice = basePrice - product.discount;

    // Phần trăm giảm giá (nếu muốn hiển thị badge)
    
    return finalPrice;
  };
  const totalPrice = getSelectedPrice() * quantity;

  return (
    &lt;&gt;
      {/* Breadcrumb Section */}
      <div className="breadcrumb-section"&gt;
        <div className="container"&gt;
          <div className="row"&gt;
            <div className="col-12"&gt;
              <nav aria-label="breadcrumb"&gt;
                <ol className="breadcrumb"&gt;
                  <li className="breadcrumb-item"&gt;
                    <a href=&quot;/" className="text-decoration-none"&gt;
                      <i className="fas fa-home me-1"&gt;&lt;/i>
                      Trang chủ
                    &lt;/a>
                  &lt;/li>
                  <li className="breadcrumb-item"&gt;
                    <a href=&quot;/product" className="text-decoration-none">Sản phẩm</a>
                  &lt;/li>
                  <li className="breadcrumb-item active" aria-current="page"&gt;
                    {product?.name || 'Chi tiết sản phẩm'}
                  &lt;/li>
                &lt;/ol>
              &lt;/nav>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>

      <div className="container main-content py-4" style={{ paddingTop: 110 }}&gt;
      <div className="row"&gt;
        {/* Left:  Images */}
        <div className="col-md-5"&gt;
          <div className="border rounded p-2 bg-white"&gt;
            <Image
              src={fixImgSrc(selectedImage)}
              alt={product.name}
              width={400}
              height={400}
              className="rounded w-100"
            /&gt;
          &lt;/div>
          <div className="d-flex gap-2 mt-3"&gt;
            {(() =&gt; {
              let imgs = Array.isArray(product.images)
                ? product.images
                : typeof product.images === 'string'
                  ? product.images.split(&#39;,') : [];
              imgs = imgs
                .map(img =&gt; (typeof img === 'string' ? img.trim() : &#39;'))
                .filter(img =&gt; !!img && img !== 'null' && img !== 'undefined' && img !== &#39;');

              if (imgs.length === 0) {
                return <div className="text-muted">Không có ảnh</div>;
              }
              if (imgs.length &lt; 3) {
                imgs = [...imgs];
                while (imgs.length &lt; 3) imgs.push(imgs[0]);
              }
              return imgs.slice(0, 3).map((img: string, index: number) =&gt; {
                const safeImg = fixImgSrc(img);
                // Chỉ render nếu safeImg là string hợp lệ
                if (!safeImg || typeof safeImg !== 'string' || safeImg === 'null' || safeImg === 'undefined' || safeImg.trim() === &#39;') {
                  return null;
                }
                return (
                  <Image
                    key={index}
                    src={safeImg}
                    alt={`Ảnh nhỏ ${index}`}
                    width={60}
                    height={60}
                    className={`border rounded product-thumb${selectedImage === img ? &#39; ' : &#39;'}`}
                    onClick={() =&gt; setSelectedImage(img && img.trim() ? img : null)}
                  /&gt;
                );
              });
            })()}
          &lt;/div>
        &lt;/div>
        {/* Right:  Info & Purchase Card */}
        <div className="col-md-7"&gt;
          <div className="row"&gt;
            {/* Left part of right column: Info */}
            <div className="col-md-7"&gt;
              <h4 className="mb-1"&gt;{product.name}&lt;/h4>
              <div
                style={{
                  fontSize: 16,
                  color: &#39;#555',
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  marginBottom: 12
                }}
                dangerouslySetInnerHTML={{
                  __html: product.description.replace(/\\n/g, &#39;<br /&gt;&#39;)
                }}
              /&gt;
              <div className="mb-2"&gt;
                <span className="text-success fw-bold">MIỄN PHÍ GIAO HÀNG</span>
                <span className="text-danger ms-3 fw-bold">QUÀ TẶNG MIỄN PHÍ&lt;/span>
              &lt;/div>
              {/* Chọn biến thể */}
              <div className="mb-3"&gt;
                <span className="fw-bold">CHỌN PHIÊN BẢN:&lt;/span>
                <div className="d-flex flex-wrap gap-2 mt-1"&gt;
                  {Array.isArray(variants) && variants.length &gt; 0 ? variants.map(v =&gt; (
                    <label key={v.id} className={`btn option-btn${v.id === selectedVariant ? &#39; active' : &#39;'} rounded-3 px-3 py-2`} style={{ minWidth: 120 }}&gt;
                      <input
                        type="radio"
                        name="variant"
                        value={v.id}
                        checked={v.id === selectedVariant}
                        onChange={() =&gt; setSelectedVariant(v.id)}
                        className="d-none"
                      /&gt;
                      <div>{v.variant_name}&lt;/div>
                      <div className="fw-bold"&gt;
                        {v.price_modifier &gt; 0 ? `+${v.price_modifier.toLocaleString()}₫` : &#39;'}
                      &lt;/div>
                      <div className="text-muted small">Kho: {v.stock}&lt;/div>
                    &lt;/label>
                  )) : <span className="text-muted">Không có phiên bản</span>}
                &lt;/div>
              &lt;/div>
              <div className="bg-light rounded p-3 mb-3"&gt;
                <ul className="mb-2"&gt;
                  <li>Mua <span className="text-success fw-bold">02</span> hộp tặng <a href=&quot;#" className="text-primary">Khay Snack</a>&lt;/li>
                  <li>Mua <span className="text-success fw-bold">04</span> hộp tặng <a href=&quot;#" className="text-primary"&gt;Đồ chơi lắp ráp</a>&lt;/li>
                &lt;/ul>
                <div className="text-secondary mb-2" style={{ fontSize: 14 }}>Khuyến mãi kết thúc lúc: <span className="fw-bold">9h00 tối, 25/5/2024</span>&lt;/div>
                <div className="mt-2" style={{ fontSize: 15 }}&gt;
                  <div><b>Mã SP:&lt;/b> <span className="text-success"&gt;#{product.id.toString().padStart(6, '0')}&lt;/span>&lt;/div>
                  <div><b>Danh mục:&lt;/b> <span className="text-success"&gt;{product.category?.name || 'Chưa phân loại'}&lt;/span>&lt;/div>
                  <div><b>Thương hiệu:&lt;/b> <span className="text-success"&gt;{product.brand?.name || 'Chưa có thông tin'}&lt;/span>&lt;/div>
                &lt;/div>
                <div className="mt-2 d-flex gap-2"&gt;
                  <a href=&quot;#"&gt;<img src=&quot;/images/social-fb.png" alt="fb" width={28} /&gt;&lt;/a>
                  <a href=&quot;#"&gt;<img src=&quot;/images/social-ig.png" alt="ig" width={28} /&gt;&lt;/a>
                  <a href=&quot;#"&gt;<img src=&quot;/images/social-x.png" alt="x" width={28} /&gt;&lt;/a>
                  <a href=&quot;#"&gt;<img src=&quot;/images/social-yt.png" alt="yt" width={28} /&gt;&lt;/a>
                  <a href=&quot;#"&gt;<img src=&quot;/images/social-tg.png" alt="tg" width={28} /&gt;&lt;/a>
                  <a href=&quot;#"&gt;<img src=&quot;/images/social-in.png" alt="in" width={28} /&gt;&lt;/a>
                &lt;/div>
              &lt;/div>
            &lt;/div>
            {/* Right part of right column: Purchase Card */}
            <div className="col-md-5"&gt;
              <div className="card shadow-sm p-3" style={{ borderRadius: 12 }}&gt;
                <div className="d-flex align-items-baseline"&gt;
                  <div className="fs-2 fw-bold text-dark"&gt;
                    {variants.length &gt; 0 ? (
                      selectedVariant ? (
                      <span>{totalPrice.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}&lt;/span>
                    ) : (
                      <span className="text-muted" style={{ fontSize: 18 }}>Vui lòng chọn phiên bản</span>
                      )
                    ) : (
                      <span>{((product.price - product.discount) * quantity).toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}&lt;/span>
                    )}
                  &lt;/div>
                &lt;/div>
                <div className="my-3"&gt;
                  <span className="badge bg-success bg-opacity-10 text-success me-2"&gt;
                    <i className="bi bi-check-circle-fill"&gt;&lt;/i> Còn hàng
                  &lt;/span>
                &lt;/div>
                {(selectedVariant || variants.length === 0) && (
                  <div className="d-flex align-items-center mb-3"&gt;
                    <button className="btn btn-light border rounded-pill px-3" onClick={() =&gt; setQuantity(q =&gt; Math.max(1, q - 1))}&gt;-&lt;/button>
                    <span className="mx-3 fs-5 fw-bold"&gt;{quantity}&lt;/span>
                    <button className="btn btn-light border rounded-pill px-3" onClick={() =&gt; setQuantity(q =&gt; q + 1)}&gt;+&lt;/button>
                  &lt;/div>
                )}
                {/* Hiển thị thông báo thêm vào giỏ hàng */}
                {addToCartMessage && (
                  <div className={`alert ${addToCartMessage.includes(&#39;✅') ? 'alert-success' : 'alert-danger'} mb-3`}&gt;
                    {addToCartMessage}
                  &lt;/div>
                )}
                
                {variants.length &gt; 0 ? (
                  &lt;&gt;
                    <button
                      className="btn w-100 mb-2 fw-bold"
                      style={{
                        background: &#39;#22c55e',
                        color: &#39;#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      onClick={() =&gt; {
                        if (!selectedVariant) return;
                        const variant = variants.find(v =&gt; v.id === selectedVariant);
                        handleAddToCart(product, variant);
                      }}
                      disabled={!selectedVariant || isAddingToCart}
                    &gt;
                      {isAddingToCart ? (
                        &lt;&gt;
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"&gt;&lt;/span>
                          Đang thêm...
                        &lt;/&gt;
                      ) : (
                        'Thêm vào giỏ hàng'
                      )}
                    &lt;/button>
                    <button
                      className="btn w-100 mb-3 fw-bold"
                      style={{
                        background: &#39;#fb923c',
                        color: &#39;#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      disabled={!selectedVariant}
                    &gt;
                      Mua với PayPal
                    &lt;/button>
                  &lt;/&gt;
                ) : (
                  &lt;&gt;
                    <button
                      className="btn w-100 mb-2 fw-bold"
                      style={{
                        background: &#39;#22c55e',
                        color: &#39;#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                      onClick={() =&gt; handleAddToCart(product)}
                      disabled={isAddingToCart}
                    &gt;
                      {isAddingToCart ? (
                        &lt;&gt;
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"&gt;&lt;/span>
                          Đang thêm...
                        &lt;/&gt;
                      ) : (
                        'Thêm vào giỏ hàng'
                      )}
                    &lt;/button>
                    <button
                      className="btn w-100 mb-3 fw-bold"
                      style={{
                        background: &#39;#fb923c',
                        color: &#39;#fff',
                        borderRadius: 8,
                        fontWeight: 600
                      }}
                    &gt;
                      Mua với PayPal
                    &lt;/button>
                  &lt;/&gt;
                )}
                <div className="d-flex justify-content-between text-sm"&gt;
                  <a href=&quot;#" className="text-decoration-none text-success"&gt;Đã thêm vào yêu thích</a>
                  <a href=&quot;#" className="text-decoration-none text-muted">So sánh</a>
                &lt;/div>
                <hr /&gt;
                <div className="mb-2"&gt;<img src=&quot;/images/safe-checkout.png" alt="Thanh toán an toàn" style={{ height: 24 }} /&gt;&lt;/div>
                <div className="mb-2 fw-bold"&gt;Đặt hàng nhanh 24/7<br /&gt;<span className="fw-normal"&gt;(025) 3886 25 16</span>&lt;/div>
                <div className="mb-2"&gt;<i className="bi bi-truck"&gt;&lt;/i> Giao từ <a href=&quot;#" className="text-decoration-none">Việt Nam</a>&lt;/div>
              &lt;/div>
            &lt;/div>
          &lt;/div>
        &lt;/div>
      &lt;/div>
      {/* Tabs */}
      <div className="mt-5"&gt;
        <ul className="nav nav-tabs"&gt;
          <li className="nav-item"&gt;
            <button className={`nav-link${tab === 'desc' ? &#39; active' : &#39;'}`} onClick={() =&gt; setTab('desc')}>Mô tả&lt;/button>
          &lt;/li>
          <li className="nav-item"&gt;
            <button className={`nav-link${tab === 'profile' ? &#39; active' : &#39;'}`} onClick={() =&gt; setTab('profile')}>Thông số&lt;/button>
          &lt;/li>
          <li className="nav-item"&gt;
            <button className={`nav-link${tab === 'review' ? &#39; active' : &#39;'}`} onClick={() =&gt; setTab('review')}&gt;Đánh giá&lt;/button>
          &lt;/li>
        &lt;/ul>
        <div className="border border-top-0 p-4 bg-white"&gt;
          {tab === 'desc' && (
            &lt;&gt;
              <h5 className="fw-bold text-success"&gt;
                <i className="fas fa-file-text me-2"&gt;&lt;/i>MÔ TẢ SẢN PHẨM
              &lt;/h5>
              <div className="description-content mb-4"&gt;
                <p className="fs-6 lh-lg"&gt;{product.description}&lt;/p>
                <div className="mt-3"&gt;
                  <h6 className="fw-bold text-success"&gt;Đặc điểm nổi bật:&lt;/h6>
                  <ul className="list-unstyled"&gt;
                    <li><i className="fas fa-check text-success me-2"&gt;&lt;/i>Chất lượng cao, đảm bảo an toàn thực phẩm</li>
                    <li><i className="fas fa-check text-success me-2"&gt;&lt;/i>Đóng gói tiêu chuẩn, bảo quản tốt</li>
                    <li><i className="fas fa-check text-success me-2"&gt;&lt;/i>Nguồn gốc xuất xứ rõ ràng</li>
                    <li><i className="fas fa-check text-success me-2"&gt;&lt;/i>Giá cả hợp lý, phù hợp với chất lượng</li>
                  &lt;/ul>
                &lt;/div>
              &lt;/div>
              
              <h5 className="fw-bold text-warning"&gt;
                <i className="fas fa-book me-2"&gt;&lt;/i>HƯỚNG DẪN SỬ DỤNG
              &lt;/h5>
              <div className="usage-guide-content"&gt;
                <h6 className="fw-bold text-warning">Cách sử dụng:&lt;/h6>
                <ol className="usage-steps"&gt;
                  <li className="mb-2"&gt;
                    <strong>Bước 1:&lt;/strong> Kiểm tra hạn sử dụng trước khi sử dụng
                  &lt;/li>
                  <li className="mb-2"&gt;
                    <strong>Bước 2:&lt;/strong> Mở bao bì cẩn thận, tránh làm rơi vãi
                  &lt;/li>
                  <li className="mb-2"&gt;
                    <strong>Bước 3:&lt;/strong> Sử dụng theo nhu cầu, đảm bảo vệ sinh an toàn
                  &lt;/li>
                  <li className="mb-2"&gt;
                    <strong>Bước 4:&lt;/strong> Bảo quản sản phẩm còn lại ở nơi khô ráo, thoáng mát
                  &lt;/li>
                &lt;/ol>
                
                <div className="mt-4"&gt;
                  <h6 className="fw-bold text-warning">Lưu ý quan trọng:&lt;/h6>
                  <ul className="list-unstyled"&gt;
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"&gt;&lt;/i>Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp</li>
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"&gt;&lt;/i>Không sử dụng khi sản phẩm có dấu hiệu hư hỏng</li>
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"&gt;&lt;/i>Tránh xa tầm tay trẻ em</li>
                    <li><i className="fas fa-exclamation-triangle text-warning me-2"&gt;&lt;/i>Đọc kỹ thông tin trên bao bì trước khi sử dụng</li>
                  &lt;/ul>
                &lt;/div>
              &lt;/div>
            &lt;/&gt;
          )}
          {tab === 'profile' && (
            &lt;&gt;
              <h5 className="fw-bold text-primary mb-3"&gt;
                <i className="fas fa-info-circle me-2"&gt;&lt;/i>THÔNG SỐ KỸ THUẬT
              &lt;/h5>
              {product && product.specifications ? (
                <div className="row"&gt;
                  <div className="col-md-6"&gt;
                    <table className="table table-striped table-bordered"&gt;
                <tbody>
                        <tr>
                          <td className="fw-bold bg-light">Mã SP:&lt;/td>
                          <td>
                            <span className="badge bg-primary"&gt;#{product.id.toString().padStart(6, '0')}&lt;/span>
                          &lt;/td>
                        &lt;/tr>
                        {product.category && (
                          <tr>
                            <td className="fw-bold bg-light">Danh mục:&lt;/td>
                            <td>
                              <span className="badge bg-info"&gt;{product.category.name}&lt;/span>
                            &lt;/td>
                          &lt;/tr>
                        )}
                        {product.brand && (
                          <tr>
                            <td className="fw-bold bg-light">Thương hiệu:&lt;/td>
                            <td>
                              <span className="badge bg-warning text-dark"&gt;{product.brand.name}&lt;/span>
                            &lt;/td>
                          &lt;/tr>
                        )}
                        {product.specifications.barcode && (
                          <tr>
                            <td className="fw-bold bg-light">Mã vạch:&lt;/td>
                            <td>{product.specifications.barcode}&lt;/td>
                          &lt;/tr>
                        )}
                        {product.specifications.origin && (
                          <tr>
                            <td className="fw-bold bg-light">Xuất xứ:&lt;/td>
                            <td>
                              <span className="badge bg-success"&gt;{product.specifications.origin}&lt;/span>
                            &lt;/td>
                          &lt;/tr>
                        )}
                        {product.specifications.weight_unit && (
                          <tr>
                            <td className="fw-bold bg-light"&gt;Đơn vị đo:&lt;/td>
                            <td>{product.specifications.weight_unit}&lt;/td>
                          &lt;/tr>
                        )}
                        {product.quantity && (
                          <tr>
                            <td className="fw-bold bg-light">Số lượng trong kho:&lt;/td>
                            <td>
                              <span className={`badge ${product.quantity &gt; 10 ? 'bg-success' : product.quantity &gt; 0 ? 'bg-warning' : 'bg-danger'}`}&gt;
                                {product.quantity} sản phẩm
                              &lt;/span>
                            &lt;/td>
                          &lt;/tr>
                        )}
                &lt;/tbody>
              &lt;/table>
                  &lt;/div>
                  <div className="col-md-6"&gt;
                    <table className="table table-striped table-bordered"&gt;
                      <tbody>
                        {product.specifications.expiry_date && (
                          <tr>
                            <td className="fw-bold bg-light">Hạn sử dụng:&lt;/td>
                            <td>
                              <i className="fas fa-calendar-alt text-warning me-2"&gt;&lt;/i>
                              {new Date(product.specifications.expiry_date).toLocaleDateString('vi-VN')}
                            &lt;/td>
                          &lt;/tr>
                        )}
                        {product.specifications.purchase_price &gt; 0 && (
                          <tr>
                            <td className="fw-bold bg-light">Giá nhập:&lt;/td>
                            <td>
                              <span className="text-muted"&gt;
                                <i className="fas fa-dollar-sign me-1"&gt;&lt;/i>
                                {product.specifications.purchase_price.toLocaleString()}₫
                              &lt;/span>
                            &lt;/td>
                          &lt;/tr>
                        )}
                        <tr>
                          <td className="fw-bold bg-light">Giá bán:&lt;/td>
                          <td>
                            <span className="text-success fw-bold"&gt;
                              <i className="fas fa-tag me-1"&gt;&lt;/i>
                              {product.price.toLocaleString()}₫
                            &lt;/span>
                          &lt;/td>
                        &lt;/tr>
                        <tr>
                          <td className="fw-bold bg-light"&gt;Đánh giá:&lt;/td>
                          <td>
                            <span className="text-warning"&gt;
                              <i className="fas fa-star me-1"&gt;&lt;/i>
                              {product.rating.toFixed(1)}/5.0
                            &lt;/span>
                          &lt;/td>
                        &lt;/tr>
                      &lt;/tbody>
                    &lt;/table>
                  &lt;/div>
                &lt;/div>
              ) : (
                <div className="text-center py-4"&gt;
                  <div className="spinner-border text-primary" role="status"&gt;
                    <span className="visually-hidden"&gt;Đang tải...&lt;/span>
                  &lt;/div>
                  <p className="text-muted mt-2"&gt;Đang tải thông số sản phẩm...&lt;/p>
                &lt;/div>
              )}
            &lt;/&gt;
          )}
          {tab === 'review' && (
            &lt;&gt;
              <h5 className="fw-bold text-info mb-3"&gt;
                <i className="fas fa-comments me-2"&gt;&lt;/i>ĐÁNH GIÁ & NHẬN XÉT
              &lt;/h5>
              {product && product.reviews ? (
                <div className="row"&gt;
                  {/* Tổng quan đánh giá */}
                  <div className="col-md-5"&gt;
                    <div className="card border-info"&gt;
                      <div className="card-header bg-info text-white"&gt;
                        <h6 className="mb-0">Tổng quan đánh giá&lt;/h6>
                      &lt;/div>
                      <div className="card-body text-center"&gt;
                        <div className="rating-display mb-3"&gt;
                          <span className="display-3 fw-bold text-warning"&gt;
                            {product.avg_rating ? product.avg_rating.toFixed(1) : '0.0'}
                          &lt;/span>
                          <div className="rating-stars mt-2"&gt;
                            {[1,2,3,4,5].map(star =&gt; (
                              <i key={star} className={`fas fa-star fs-5 ${star &lt;= Math.round(product.avg_rating || 0) ? 'text-warning' : 'text-muted'}`}&gt;&lt;/i>
                            ))}
                          &lt;/div>
                          <p className="text-muted mt-2"&gt;Đánh giá trung bình</p>
                          <p className="text-muted"&gt;
                            {product.total_reviews || 0} đánh giá
                          &lt;/p>
                        &lt;/div>
                        
                        <div className="rating-breakdown text-start"&gt;
                          {[5,4,3,2,1].map(stars =&gt; {
                            const percentage = stars === Math.round(product.avg_rating || 0) ? 80 : Math.random() * 30 + 5;
                            return (
                              <div key={stars} className="mb-2"&gt;
                                <span className="me-2"&gt;{stars}★&lt;/span>
                                <div className="progress d-inline-block" style={{width: '100px', height: '8px'}}&gt;
                                  <div 
                                    className="progress-bar bg-warning" 
                                    style={{width: `${percentage}%`}}
                                  &gt;&lt;/div>
                                &lt;/div>
                                <span className="ms-2 small"&gt;{Math.round(percentage)}%&lt;/span>
                              &lt;/div>
                            );
                          })}
                        &lt;/div>
                      &lt;/div>
                    &lt;/div>
                    
                    <div className="mt-3"&gt;
                      <button className="btn btn-outline-info w-100"&gt;
                        <i className="fas fa-plus me-2"&gt;&lt;/i>Viết đánh giá của bạn
                      &lt;/button>
                    &lt;/div>
                  &lt;/div>
                  
                  {/* Chi tiết đánh giá */}
                  <div className="col-md-7"&gt;
                    <div className="review-detail"&gt;
                      <h6 className="fw-bold">Nhận xét chi tiết từ khách hàng:&lt;/h6>
                      
                      {/* Hiển thị danh sách đánh giá từ database */}
                      {product.reviews && product.reviews.length &gt; 0 ? (
                        product.reviews.map((review: unknown, index: number) =&gt; (
                          <div key={review.id || index} className="border rounded p-3 mb-3 bg-light"&gt;
                            <div className="d-flex justify-content-between align-items-center mb-2"&gt;
                              <div>
                                <b className="text-primary"&gt;
                                  <i className="fas fa-user-circle me-2"&gt;&lt;/i>
                                  {review.customer_name || 'Khách hàng'}
                                &lt;/b>
                                <span className="text-muted ms-2"&gt;
                                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                &lt;/span>
                              &lt;/div>
                              <div className="rating-stars"&gt;
                                {[1,2,3,4,5].map(star =&gt; (
                                  <i key={star} className={`fas fa-star ${star &lt;= review.rating ? 'text-warning' : 'text-muted'}`}&gt;&lt;/i>
                                ))}
                                <span className="ms-2 fw-bold"&gt;{review.rating.toFixed(1)}&lt;/span>
                              &lt;/div>
                            &lt;/div>
                            <div className="review-content"&gt;
                              <p className="mb-0 fst-italic"&gt;&quot;{review.comment}&quot;&lt;/p>
                            &lt;/div>
                            <div className="mt-2"&gt;
                              <span className="badge bg-success"&gt;Đã xác thực mua hàng</span>
                            &lt;/div>
                          &lt;/div>
                        ))
                      ) : (
                        <div className="text-center py-4"&gt;
                          <i className="fas fa-comment-slash text-muted fs-1"&gt;&lt;/i>
                          <p className="text-muted mt-2">Chưa có đánh giá nào cho sản phẩm này</p>
                        &lt;/div>
                      )}
                      
                      {/* Form thêm đánh giá */}
                      <div className="add-review-form"&gt;
                        <h6 className="fw-bold">Thêm đánh giá của bạn:&lt;/h6>
                        
                        {/* Hiển thị message */}
                        {reviewMessage && (
                          <div className={`alert ${reviewMessage.includes(&#39;✅') ? 'alert-success' : 'alert-danger'} mt-3`}&gt;
                            {reviewMessage}
                          &lt;/div>
                        )}
                        
                        <form onSubmit={handleReviewSubmit} className="row g-3"&gt;
                          <div className="col-md-6"&gt;
                            <label className="form-label">Họ tên: <span className="text-danger"&gt;*&lt;/span>&lt;/label>
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Nhập họ tên của bạn"
                              value={reviewForm.}
                              onChange={(e) =&gt; handleReviewChange(&#39;', e.target.value)}
                              required
                              disabled={isSubmittingReview}
                            /&gt;
                          &lt;/div>
                          <div className="col-md-6"&gt;
                            <label className="form-label"&gt;Đánh giá: <span className="text-danger"&gt;*&lt;/span>&lt;/label>
                            <select 
                              className="form-select"
                              value={reviewForm.rating}
                              onChange={(e) =&gt; handleReviewChange('rating', parseInt(e.target.value))}
                              disabled={isSubmittingReview}
                            &gt;
                              <option value={5}>5 sao - Tuyệt vời</option>
                              <option value={4}>4 sao - Tốt</option>
                              <option value={3}>3 sao - Bình thường</option>
                              <option value={2}>2 sao - Kém</option>
                              <option value={1}>1 sao - Rất kém</option>
                            &lt;/select>
                          &lt;/div>
                          <div className="col-12"&gt;
                            <label className="form-label">Nhận xét: <span className="text-danger"&gt;*&lt;/span>&lt;/label>
                            <textarea 
                              className="form-control" 
                              rows={3} 
                              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm... (Ít nhất 10 ký tự)&quot;
                              value={reviewForm.comment}
                              onChange={(e) =&gt; handleReviewChange('comment', e.target.value)}
                              required
                              disabled={isSubmittingReview}
                              minLength={10}
                            &gt;&lt;/textarea>
                            <small className="text-muted"&gt;
                              {reviewForm.comment.length}/10 ký tự tối thiểu
                            &lt;/small>
                          &lt;/div>
                          <div className="col-12"&gt;
                            <button 
                              type="submit" 
                              className="btn btn-info text-white"
                              disabled={isSubmittingReview || reviewForm.comment.length &lt; 10 || !reviewForm..trim()}
                            &gt;
                              {isSubmittingReview ? (
                                &lt;&gt;
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"&gt;&lt;/span>
                                  Đang gửi...
                                &lt;/&gt;
                              ) : (
                                &lt;&gt;
                                  <i className="fas fa-paper-plane me-2"&gt;&lt;/i>Gửi đánh giá
                                &lt;/&gt;
                              )}
                            &lt;/button>
                          &lt;/div>
                        &lt;/form>
                      &lt;/div>
                    &lt;/div>
                  &lt;/div>
                &lt;/div>
              ) : (
                <div className="text-center py-4"&gt;
                  <div className="spinner-border text-info" role="status"&gt;
                    <span className="visually-hidden"&gt;Đang tải...&lt;/span>
                  &lt;/div>
                  <p className="text-muted mt-2"&gt;Đang tải thông tin đánh giá...&lt;/p>
                &lt;/div>
              )}
            &lt;/&gt;
          )}
        &lt;/div>
      &lt;/div>
      &lt;/div>
    &lt;/&gt;
  )
}
