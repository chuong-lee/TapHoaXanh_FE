// lib/productService.ts

const API_BASE_URL = '/api';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  color?: string;
  parent_id?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount: number;
  images: string;
  category: string;
  brand?: {
    id: number;
    name: string;
  };
  rating: number;
  soldCount?: number;
  description?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
  sort?: string;
}

export const categoryService = {
  getAllCategories: async (withCount: boolean = false): Promise<Category[]> => {
    try {
      const url = withCount ? `${API_BASE_URL}/category?withCount=true` : `${API_BASE_URL}/categories`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Xử lý response format
      if (Array.isArray(data)) {
        return data;
      } else if (data.success && Array.isArray(data.data)) {
        return data.data;
      } else if (data.categories && Array.isArray(data.categories)) {
        return data.categories;
      } else {
        console.warn('Unexpected categories response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      return []; // Return empty array instead of throwing
    }
  },
};

export const productService = {
  getAllProducts: async (filters: ProductFilters = {}): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.sort) params.append('sort', filters.sort);

      const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: any = await response.json();
      
      // Xử lý các format response khác nhau từ API
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  getProductById: async (id: number): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching product by id:', error);
      return null;
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
  },

  getProductsByCategory: async (categoryId: number, filters: ProductFilters = {}): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.sort) params.append('sort', filters.sort);

      // Thử endpoint chính trước
      let response = await fetch(`${API_BASE_URL}/products/category/${categoryId}?${params.toString()}`);
      
      // Nếu endpoint không tồn tại, thử endpoint khác
      if (!response.ok && response.status === 404) {
        response = await fetch(`${API_BASE_URL}/products?category_id=${categoryId}&${params.toString()}`);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products by category: ${response.status} ${response.statusText}`);
      }
      
      const data: any = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else {
        console.warn('Unexpected products by category response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const params = new URLSearchParams();
      params.append('search', query);
      params.append('limit', '1000');

      const response = await fetch(`${API_BASE_URL}/products/search?${params.toString()}`);
      if (!response.ok) {
        // Fallback: search trong tất cả products
        return productService.getAllProducts({ search: query, limit: 1000 });
      }
      
      const data: any = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },

  getFeaturedProducts: async (limit: number = 8): Promise<Product[]> => {
    try {
      // Thử endpoint featured trước
      let response = await fetch(`${API_BASE_URL}/products/featured?limit=${limit}`);
      
      if (!response.ok) {
        // Fallback: lấy sản phẩm thường
        console.warn('Featured products endpoint not available, using fallback');
        const products = await productService.getAllProducts({ limit });
        return products.slice(0, limit);
      }
      
      const data: any = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback: lấy sản phẩm thường
      try {
        const products = await productService.getAllProducts({ limit });
        return products;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
    }
  },

  getBestSellingProducts: async (limit: number = 8): Promise<Product[]> => {
    try {
      // Thử endpoint best-selling trước
      let response = await fetch(`${API_BASE_URL}/products/best-selling?limit=${limit}`);
      
      if (!response.ok) {
        // Fallback: lấy sản phẩm thường
        console.warn('Best selling products endpoint not available, using fallback');
        const products = await productService.getAllProducts({ limit, sort: 'soldCount_desc' });
        return products;
      }
      
      const data: any = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.products && Array.isArray(data.products)) {
        return data.products;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching best selling products:', error);
      // Fallback: lấy sản phẩm thường
      try {
        const products = await productService.getAllProducts({ limit });
        return products;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
    }
  }
};

// // Export default cho compatibility
// export default {
//   categoryService,
//   productService
// };