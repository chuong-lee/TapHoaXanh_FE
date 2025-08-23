import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  brand?: string | { name: string }
  rating?: number
  category?: {
    id: number
    name: string
  }
  categoryId?: number
}

function fixImgSrc(img: string) {
  if (!img) return '/images/placeholder.jpg';
  if (img.startsWith('http')) return img;
  if (img.startsWith('/')) return img;
  if (img.startsWith('client/images/')) return '/' + img;
  return '/images/products/' + img;
}

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const handleViewDetail = () => {
    // Bỏ kiểm tra đăng nhập, cho phép truy cập tự do
    if (product.slug) {
      router.push(`/product/${product.slug}`);
    } else {
      alert('Không tìm thấy sản phẩm!');
    }
  };

  return (
    <div className="product-card" style={{
      border: '1.5px solid #f3f3f3', borderRadius: 16, padding: 18, background: '#fff', minHeight: 340
    }}>
      <div className="text-center mb-2">
        <Image
          src={fixImgSrc(product.images)}
          alt={product.name}
          width={120}
          height={120}
          style={{objectFit: 'contain', width: '100%', height: 120}}
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
          {typeof product.brand === 'string' ? product.brand : 
           typeof product.brand === 'object' && product.brand?.name ? product.brand.name : 
           'brsmaket'}
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
        onClick={handleViewDetail}
      >
        Xem chi tiết
      </button>
    </div>
  )
}
