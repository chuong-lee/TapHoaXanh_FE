import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/productService'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  showBadge?: boolean
  badgeText?: string
  badgeClass?: string
  layout?: 'default' | 'horizontal' | 'minimal'
}

function fixImgSrc(img: string) {
  // Fallback to available product image nếu không có image
  if (!img) return '/client/images/product.png';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/')) return img;
  
  // Nếu là path từ database dạng 'client/images/...'
  if (img.startsWith('client/images/')) {
    // Kiểm tra nếu là những hình không tồn tại thì fallback ngay
    const problematicImages = [
      'client/images/product-40.jpg',
      'client/images/product-45.jpg', 
      'client/images/product-17.jpg',
      'client/images/product-7.jpg',
      'client/images/product-27.jpg',
      'client/images/product-48.jpg',
      'client/images/product-20.jpg',
      'client/images/product-22.jpg',
      'client/images/product-21.jpg',
      'client/images/product-5.jpg',
      'client/images/product-38.jpg',
      'client/images/product-59.jpg',
      'client/images/product-26.jpg',
      'client/images/product-6.jpg',
      'client/images/product-54.jpg',
      'client/images/product-51.jpg',
      'client/images/product-4.jpg',
      'client/images/product-1.jpg',
      'client/images/product-19.jpg',
      'client/images/product-2.jpg'
    ];
    
    if (problematicImages.includes(img)) {
      return '/client/images/product.png';
    }
    
    return '/' + img;
  }
  
  // Fallback cho các trường hợp khác - dùng product.png
  return '/client/images/product.png';
}

export default function ProductCard({ 
  product, 
  onAddToCart,
  showBadge = false,
  badgeText,
  badgeClass = 'badge-hot',
  layout = 'default'
}: ProductCardProps) {
  const router = useRouter();

  // Tạo slug từ tên sản phẩm nếu không có slug
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleViewDetail = () => {
    try {
      let productSlug = ''
      
      // Ưu tiên dùng slug có sẵn
      if (product.slug) {
        productSlug = product.slug
      } 
      // Nếu không có slug, tạo từ tên
      else if (product.name) {
        productSlug = createSlug(product.name)
      }
      // Nếu không có gì thì dùng ID
      else {
        productSlug = `product-${product.id}`
      }

      // Normalize slug để đảm bảo tương thích URL
      const finalSlug = createSlug(productSlug)
      
      router.push(`/product/${finalSlug}`)
      
    } catch (error) {
      console.error('❌ Lỗi chuyển trang:', error)
      // Fallback: chuyển về trang chủ
      router.push('/')
    }
  };

  return (
    <div
      className="product-card"
      style={{
        border: '1.5px solid #f3f3f3',
        borderRadius: 16,
        padding: 18,
        background: '#fff',
        minHeight: 340,
        cursor: 'pointer'
      }}
      onClick={handleViewDetail}
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') handleViewDetail() }}
      role="button"
    >
      <div className="text-center mb-2">
        <Image
          src={fixImgSrc(product.images)}
          alt={product.name}
          width={120}
          height={120}
          style={{objectFit: 'contain', width: '100%', height: 120}}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/client/images/product.png';
          }}
        />
      </div>
      <div className="text-secondary small mb-1">Snack</div>
      <div 
        className="fw-bold mb-1" 
        style={{
          fontSize: '1.08rem',
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.3,
          minHeight: '1.3em'
        }}
      >
        {product.name}
      </div>
      <div className="mb-1" style={{fontSize: 14, color: '#e11d48', fontWeight: 500}}>
        by <span style={{color: '#ff9800'}}>
          {product.brand?.name || 'Tạp Hoá Xanh'}
        </span>
      </div>
      <div className="mb-1">
        <span className="fw-bold text-danger me-2" style={{fontSize: 18}}>${product.price.toLocaleString()}</span>
        <span className="text-muted text-decoration-line-through small">${(product.price + product.discount).toLocaleString()}</span>
      </div>
      <div className="mb-1" style={{color: '#ffc107', fontWeight: 500, fontSize: 15}}>
        <span style={{fontSize: 18}}>★</span> {product.rating || 4.0}
      </div>
      <button
        className="btn btn-success w-100"
        style={{
          borderRadius: 8, 
          fontWeight: 600, 
          fontSize: 18, 
          marginTop: 8,
          background: '#22c55e',
          border: 'none',
          color: '#fff',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#16a34a'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#22c55e'
        }}
        // onClick removed, now handled by card
      >
        Xem chi tiết
      </button>
    </div>
  )
}
