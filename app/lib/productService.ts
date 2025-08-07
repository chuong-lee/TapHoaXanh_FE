import api from './axios'
import { mockProductService, mockCategoryService } from './mockService'

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
  brand?: string // Thêm brand để hiển thị thương hiệu
}

export interface Category {
  id: number
  name: string
  color?: string
  icon?: string
  count?: number
  description?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  total?: number
  page?: number
  limit?: number
}

// Flag to enable/disable mock mode - Disable mock when API URL is set
const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'development'

class ProductService {
  // Lấy tất cả sản phẩm
  async getAllProducts(params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    fetchAll?: boolean // custom flag để lấy toàn bộ
  }): Promise<Product[]> {
    // Sử dụng mock data nếu không có API
    if (USE_MOCK_DATA) {
      console.log('🔧 Using mock data for products')
      return mockProductService.getAllProducts(params)
    }

    try {
      // Chỉ xóa page/limit khi fetchAll=true, còn nếu truyền limit thì giữ nguyên
      let queryParams = params ? { ...params } : {};
      if (params?.fetchAll) {
        delete queryParams.page;
        delete queryParams.limit;
      }
      const response = await api.get('/products', { params: queryParams });
      let data: any = response.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('API trả về không phải JSON:', data);
          return [];
        }
      }

      // Xử lý các format response khác nhau từ API
      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else if (Array.isArray(data)) {
        return data
      } else if (data.products && Array.isArray(data.products)) {
        return data.products
      }

      console.warn('Unexpected API response format:', data)
      return []
    } catch (error) {
      console.error('Error fetching products, falling back to mock data:', error)
      // Fallback to mock data if API fails
      return mockProductService.getAllProducts(params)
    }
  }

  // Lấy sản phẩm theo ID
  async getProductById(id: number): Promise<Product | null> {
    if (USE_MOCK_DATA) {
      return mockProductService.getProductById(id)
    }

    try {
      const response = await api.get(`/products/${id}`)
      const data: any = response.data
      
      if (data.success && data.data) {
        return data.data
      } else if (data) {
        return data as Product
      }
      
      return null
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      return mockProductService.getProductById(id)
    }
  }

  // Lấy sản phẩm theo slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    if (USE_MOCK_DATA) {
      return mockProductService.getProductBySlug(slug)
    }

    try {
      const response = await api.get(`/products/slug/${slug}`)
      const data: any = response.data
      
      if (data.success && data.data) {
        return data.data
      } else if (data) {
        return data as Product
      }
      
      return null
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return mockProductService.getProductBySlug(slug)
    }
  }

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(categoryId: number, params?: {
    page?: number
    limit?: number
    sort?: string
    order?: 'asc' | 'desc'
  }): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      return mockProductService.getProductsByCategory(categoryId)
    }

    try {
      const response = await api.get(`/products/category/${categoryId}`, { params })
      const data: any = response.data
      
      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else if (Array.isArray(data)) {
        return data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return mockProductService.getProductsByCategory(categoryId)
    }
  }

  // Tìm kiếm sản phẩm
  async searchProducts(query: string, params?: {
    page?: number
    limit?: number
    category?: string
  }): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      return mockProductService.searchProducts(query)
    }

    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...params }
      })
      const data: any = response.data
      
      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else if (Array.isArray(data)) {
        return data
      }
      
      return []
    } catch (error) {
      console.error('Error searching products:', error)
      return mockProductService.searchProducts(query)
    }
  }

  // Lấy sản phẩm nổi bật
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      return mockProductService.getFeaturedProducts(limit)
    }

    try {
      const response = await api.get('/products/featured', {
        params: { limit }
      })
      const data: any = response.data
      
      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else if (Array.isArray(data)) {
        return data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return mockProductService.getFeaturedProducts(limit)
    }
  }

  // Lấy sản phẩm bán chạy
  async getBestSellingProducts(limit: number = 8): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      return mockProductService.getBestSellingProducts(limit)
    }

    try {
      const response = await api.get('/products/best-selling', {
        params: { limit }
      })
      const data: any = response.data
      
      if (data.success && Array.isArray(data.data)) {
        return data.data
      } else if (Array.isArray(data)) {
        return data
      }
      
      return []
    } catch (error) {
      console.error('Error fetching best selling products:', error)
      return mockProductService.getBestSellingProducts(limit)
    }
  }
}

class CategoryService {
  // Lấy tất cả danh mục
  async getAllCategories(): Promise<Category[]> {
    if (USE_MOCK_DATA) {
      console.log('🔧 Using mock data for categories')
      return mockCategoryService.getAllCategories()
    }

    try {
      const response = await api.get('/categories')
      const data: unknown = response.data
      
      if (typeof data === 'object' && data !== null && 'success' in data && Array.isArray((data as any).data)) {
        return (data as any).data
      } else if (Array.isArray(data)) {
        return data as Category[]
      }
      
      return []
    } catch (error) {
      console.error('Error fetching categories, falling back to mock data:', error)
      return mockCategoryService.getAllCategories()
    }
  }

  // Lấy danh mục theo ID
  async getCategoryById(id: number): Promise<Category | null> {
    if (USE_MOCK_DATA) {
      return mockCategoryService.getCategoryById(id)
    }

    try {
      const response = await api.get(`/categories/${id}`)
      const data: unknown = response.data
      
      if (typeof data === 'object' && data !== null && 'success' in data && (data as any).data) {
        return (data as any).data
      } else if (data) {
        return data as Category
      }
      
      return null
    } catch (error) {
      console.error('Error fetching category by ID:', error)
      return mockCategoryService.getCategoryById(id)
    }
  }
}

// Export instances
export const productService = new ProductService()
export const categoryService = new CategoryService()

// Export default
const services = {
  productService,
  categoryService
}

export default services
