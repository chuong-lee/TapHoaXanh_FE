import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
    slug?: string;
  };
  createdAt: string;
}

interface UseWishlistReturn {
  wishlist: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (productId: number, productData?: any) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  syncWishlist: () => Promise<void>;
}

const WISHLIST_STORAGE_KEY = 'wishlist_items';

// Kiểm tra môi trường để tránh lỗi server-side
const isClient = typeof window !== 'undefined';

export const useWishlist = (): UseWishlistReturn => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();

  // Lấy wishlist từ localStorage (chỉ khi ở client)
  const getLocalWishlist = (): WishlistItem[] => {
    if (!isClient) return [];
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  };

  // Lưu wishlist vào localStorage (chỉ khi ở client)
  const saveLocalWishlist = (items: WishlistItem[]) => {
    if (!isClient) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  // Kiểm tra sản phẩm có trong wishlist không
  const isInWishlist = useCallback((productId: number): boolean => {
    return wishlist.some(item => item.product.id === productId);
  }, [wishlist]);

  // Thêm vào wishlist
  const addToWishlist = useCallback(async (productId: number, productData?: any) => {
    setIsLoading(true);
    try {
      if (profile) {
        // Đã đăng nhập - lưu vào database
        await api.post('/api/wishlist', { productId });
        
        // Cập nhật state từ server
        const response = await api.get('/api/wishlist');
        setWishlist(response.data);
      } else {
        // Chưa đăng nhập - lưu vào localStorage
        const localWishlist = getLocalWishlist();
        
        // Kiểm tra xem đã có chưa
        if (!localWishlist.some(item => item.product.id === productId)) {
          const newItem: WishlistItem = {
            id: Date.now(), // Tạo ID tạm thời
            product: {
              id: productId,
              name: productData?.name || `Product ${productId}`,
              price: productData?.price || 0,
              image: productData?.image,
              slug: productData?.slug,
            },
            createdAt: new Date().toISOString(),
          };
          
          const updatedWishlist = [...localWishlist, newItem];
          setWishlist(updatedWishlist);
          saveLocalWishlist(updatedWishlist);
        }
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Xóa khỏi wishlist
  const removeFromWishlist = useCallback(async (productId: number) => {
    setIsLoading(true);
    try {
      if (profile) {
        // Đã đăng nhập - xóa từ database
        await api.delete(`/api/wishlist?productId=${productId}`);
        
        // Cập nhật state từ server
        const response = await api.get('/api/wishlist');
        setWishlist(response.data);
      } else {
        // Chưa đăng nhập - xóa từ localStorage
        const localWishlist = getLocalWishlist();
        const updatedWishlist = localWishlist.filter(item => item.product.id !== productId);
        setWishlist(updatedWishlist);
        saveLocalWishlist(updatedWishlist);
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  // Đồng bộ wishlist từ localStorage lên database khi đăng nhập
  const syncWishlist = useCallback(async () => {
    if (!profile || !isClient) return;
    
    const localWishlist = getLocalWishlist();
    if (localWishlist.length === 0) return;

    try {
      // Thêm tất cả sản phẩm từ localStorage vào database
      for (const item of localWishlist) {
        try {
          await api.post('/api/wishlist', { productId: item.product.id });
        } catch (error) {
          // Bỏ qua lỗi nếu sản phẩm đã có trong database
          console.log('Product already in database wishlist');
        }
      }

      // Xóa localStorage sau khi đồng bộ thành công
      localStorage.removeItem(WISHLIST_STORAGE_KEY);
      
      // Cập nhật state từ server
      const response = await api.get('/api/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error syncing wishlist:', error);
    }
  }, [profile]);

  // Load wishlist khi component mount (chỉ khi ở client)
  useEffect(() => {
    if (!isClient) return;
    
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        if (profile) {
          // Đã đăng nhập - lấy từ database
          const response = await api.get('/api/wishlist');
          setWishlist(response.data);
        } else {
          // Chưa đăng nhập - lấy từ localStorage
          const localWishlist = getLocalWishlist();
          setWishlist(localWishlist);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
        // Fallback to localStorage if API fails
        const localWishlist = getLocalWishlist();
        setWishlist(localWishlist);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [profile]);

  // Đồng bộ wishlist khi đăng nhập
  useEffect(() => {
    if (profile && isClient) {
      syncWishlist();
    }
  }, [profile, syncWishlist]);

  return {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    syncWishlist,
  };
};
