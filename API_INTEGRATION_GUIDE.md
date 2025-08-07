# Hướng dẫn sử dụng API Service cho Sản phẩm

## 📖 Tổng quan
Tôi đã tạo ra một hệ thống quản lý dữ liệu sản phẩm hoàn chỉnh bao gồm:
- **Service layer**: Quản lý các API calls
- **Custom hooks**: Quản lý state và logic
- **TypeScript interfaces**: Định nghĩa types rõ ràng

## 🗂️ Cấu trúc files

### 1. `/app/lib/productService.ts`
**Service chính để gọi API sản phẩm và danh mục**

```typescript
// Interfaces
export interface Product {
  id: number
  name: string
  price: number
  slug: string
  images: string
  discount: number
  description: string
  category?: string
  category_id?: number
  stock?: number
  rating?: number
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: number
  name: string
  color?: string
  icon?: string
  count?: number
  description?: string
}

// Services
export const productService = new ProductService()
export const categoryService = new CategoryService()
```

### 2. `/app/hooks/useProducts.ts`
**Custom hook để quản lý state sản phẩm**

```typescript
export function useProducts(options?: UseProductsOptions): UseProductsReturn
export function useProduct(id?: number, slug?: string)
```

## 🚀 Cách sử dụng

### 1. Trong Component (Recommended)

```typescript
import { useProducts } from '@/hooks/useProducts'

function ProductPage() {
  const {
    currentProducts,      // Sản phẩm hiện tại theo pagination
    categories,          // Danh sách danh mục
    featuredProducts,    // Sản phẩm nổi bật
    loading,            // Trạng thái loading
    error,              // Lỗi nếu có
    searchProducts,     // Function tìm kiếm
    filterByCategory,   // Function lọc theo danh mục
    fetchFeaturedProducts,
    fetchBestSellingProducts,
    currentPage,
    setCurrentPage
  } = useProducts({
    itemsPerPage: 20,
    autoFetch: true
  })

  // Sử dụng dữ liệu
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  )
}
```

### 2. Sử dụng Service trực tiếp

```typescript
import { productService, categoryService } from '@/lib/productService'

// Lấy tất cả sản phẩm
const products = await productService.getAllProducts({
  page: 1,
  limit: 20,
  category: 'electronics',
  search: 'laptop'
})

// Lấy sản phẩm theo ID
const product = await productService.getProductById(1)

// Lấy sản phẩm theo slug
const product = await productService.getProductBySlug('iphone-14')

// Tìm kiếm sản phẩm
const searchResults = await productService.searchProducts('điện thoại')

// Lấy sản phẩm nổi bật
const featured = await productService.getFeaturedProducts(8)

// Lấy danh mục
const categories = await categoryService.getAllCategories()
```

## 🔧 Cấu hình API Backend

Service này hỗ trợ nhiều format response từ backend:

### Format 1: Direct array
```json
[
  {
    "id": 1,
    "name": "Sản phẩm 1",
    "price": 100000,
    ...
  }
]
```

### Format 2: Wrapped response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sản phẩm 1",
      "price": 100000,
      ...
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Format 3: Legacy format
```json
{
  "products": [
    {
      "id": 1,
      "name": "Sản phẩm 1",
      "price": 100000,
      ...
    }
  ]
}
```

## 📍 API Endpoints cần thiết

Để service hoạt động đầy đủ, backend cần cung cấp các endpoints sau:

### Products
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy sản phẩm theo ID
- `GET /products/slug/:slug` - Lấy sản phẩm theo slug
- `GET /products/category/:id` - Lấy sản phẩm theo danh mục
- `GET /products/search?q=query` - Tìm kiếm sản phẩm
- `GET /products/featured` - Sản phẩm nổi bật
- `GET /products/best-selling` - Sản phẩm bán chạy

### Categories
- `GET /categories` - Lấy danh sách danh mục
- `GET /categories/:id` - Lấy danh mục theo ID

## 🎯 Features hiện có

### ✅ Đã implement
- [x] Fetch tất cả sản phẩm
- [x] Fetch sản phẩm theo ID/slug
- [x] Tìm kiếm sản phẩm
- [x] Lọc theo danh mục
- [x] Sản phẩm nổi bật
- [x] Sản phẩm bán chạy
- [x] Pagination
- [x] Loading states
- [x] Error handling
- [x] TypeScript support
- [x] Multiple API format support

### 🔮 Có thể mở rộng
- [ ] Cache với React Query
- [ ] Infinite scroll
- [ ] Wishlist management
- [ ] Product comparison
- [ ] Real-time inventory
- [ ] Product reviews

## 🛠️ Troubleshooting

### Lỗi thường gặp:

#### 1. API không trả về dữ liệu
```typescript
// Kiểm tra base URL trong /app/lib/axios.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
})
```

#### 2. Format dữ liệu không đúng
Service tự động xử lý nhiều format, nhưng nếu có lỗi:
```typescript
// Thêm log để debug
console.log('API Response:', response.data)
```

#### 3. Loading không kết thúc
```typescript
// Đảm bảo có try-catch và finally
try {
  // API call
} catch (error) {
  console.error(error)
} finally {
  setLoading(false) // Quan trọng!
}
```

## 📝 Ví dụ thực tế

### Trang chủ hiện tại đã sử dụng:
```typescript
// /app/page.tsx
const {
  currentProducts,
  categories,
  featuredProducts,
  loading,
  fetchFeaturedProducts,
  fetchBestSellingProducts
} = useProducts({
  itemsPerPage: 20
})

// Hiển thị sản phẩm với loading state
{loading ? (
  <LoadingSkeleton />
) : (
  currentProducts.map(product => (
    <ProductCard key={product.id} product={product} />
  ))
)}
```

## 🔄 Cập nhật trang hiện tại

Tôi đã cập nhật `/app/page.tsx` với:
1. ✅ Import service và hooks
2. ✅ Thay thế logic fetch cũ
3. ✅ Thêm loading states
4. ✅ Hiển thị dữ liệu thật từ API
5. ✅ Error handling

## 📞 Liên hệ và hỗ trợ

Nếu cần hỗ trợ thêm về:
- Setup API endpoints
- Customize UI components
- Performance optimization
- Advanced features

Hãy cho tôi biết requirements cụ thể!
