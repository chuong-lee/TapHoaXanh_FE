import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  images: string;
  slug: string;
  description: string;
  quantity: number;
  categoryId?: number;
  category?: string;
  brandId?: number;
  brand?: string;
  rating?: number;
}

interface UseProductsOptions {
  limit?: number;
  page?: number;
  categoryId?: number;
  search?: string;
  enableCache?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  totalProducts: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: Product[]; timestamp: number; total: number }>();

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const {
    limit = 12,
    page = 1,
    categoryId,
    search,
    enableCache = true
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Generate cache key
  const getCacheKey = useCallback(() => {
    return `products_${limit}_${page}_${categoryId || 'all'}_${search || 'none'}`;
  }, [limit, page, categoryId, search]);

  // Check cache
  const getFromCache = useCallback((key: string) => {
    if (!enableCache) return null;
    
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    return null;
  }, [enableCache]);

  // Set cache
  const setCache = useCallback((key: string, data: Product[], total: number) => {
    if (!enableCache) return;
    
    cache.set(key, {
      data,
      timestamp: Date.now(),
      total
    });
  }, [enableCache]);

  // Fetch products
  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = getCacheKey();
      const cached = getFromCache(cacheKey);

      if (cached && !isLoadMore) {
        setProducts(cached.data);
        setTotalProducts(cached.total);
        setHasMore(cached.data.length < cached.total);
        setLoading(false);
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('page', page.toString());
      
      if (categoryId) {
        params.append('categoryId', categoryId.toString());
      }
      
      if (search) {
        params.append('search', search);
      }

      const response = await api.get(`/products?${params.toString()}`);
      
      let newProducts: Product[] = [];
      let total = 0;

      if (response.data && Array.isArray(response.data.data)) {
        newProducts = response.data.data;
        total = response.data.total || response.data.data.length;
      } else if (Array.isArray(response.data)) {
        newProducts = response.data;
        total = response.data.length;
      } else {
        throw new Error('Invalid response format');
      }

      if (isLoadMore) {
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
        setCache(cacheKey, newProducts, total);
      }

      setTotalProducts(total);
      setHasMore(newProducts.length === limit && products.length + newProducts.length < total);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [limit, page, categoryId, search, enableCache, getCacheKey, getFromCache, setCache, products.length]);

  // Load more products
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchProducts(true);
    }
  }, [loading, hasMore, fetchProducts]);

  // Refresh products
  const refresh = useCallback(() => {
    cache.delete(getCacheKey());
    fetchProducts();
  }, [getCacheKey, fetchProducts]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalProducts
  };
}

// Hook for featured products (cached for longer)
export function useFeaturedProducts(limit = 8) {
  return useProducts({ limit, enableCache: true });
}

// Hook for category products
export function useCategoryProducts(categoryId: number, limit = 12) {
  return useProducts({ categoryId, limit, enableCache: true });
}

// Hook for search products
export function useSearchProducts(search: string, limit = 20) {
  return useProducts({ search, limit, enableCache: false });
}
