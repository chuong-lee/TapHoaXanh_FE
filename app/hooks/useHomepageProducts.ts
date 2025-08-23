import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

interface HomepageProduct {
  id: number;
  name: string;
  price: number;
  discount: number;
  images: string;
  slug: string;
  category: string;
  description: string;
  quantity: number;
}

interface UseHomepageProductsReturn {
  products: HomepageProduct[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// In-memory cache for homepage products
let homepageCache: {
  data: HomepageProduct[];
  timestamp: number;
} | null = null;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function useHomepageProducts(): UseHomepageProductsReturn {
  const [products, setProducts] = useState<HomepageProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (!forceRefresh && homepageCache && Date.now() - homepageCache.timestamp < CACHE_DURATION) {
        setProducts(homepageCache.data);
        setLoading(false);
        return;
      }

      console.log('Fetching homepage products...');
      const response = await api.get('/products/homepage');
      console.log('Homepage products response:', response.data);
      
      console.log('Processing homepage response:', response.data);
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const newProducts = response.data.data;
        console.log('Setting homepage products:', newProducts.length);
        setProducts(newProducts);
        
        // Update cache
        homepageCache = {
          data: newProducts,
          timestamp: Date.now()
        };
      } else if (response.data && Array.isArray(response.data.data)) {
        const newProducts = response.data.data;
        console.log('Setting homepage products (no success field):', newProducts.length);
        setProducts(newProducts);
        
        // Update cache
        homepageCache = {
          data: newProducts,
          timestamp: Date.now()
        };
      } else {
        console.error('Invalid homepage response format:', response.data);
        throw new Error('Failed to fetch products');
      }
      
    } catch (err) {
      console.error('Error fetching homepage products:', err);
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      
      // Use cached data if available
      if (homepageCache) {
        setProducts(homepageCache.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh
  };
}
