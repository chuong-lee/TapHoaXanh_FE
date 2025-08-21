import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export interface Voucher {
  id: number;
  code: string;
  max_discount: number;
  min_order_value: number;
  quantity: number;
  is_used: number;
  start_date: string;
  end_date: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface UseVouchersReturn {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// In-memory cache
let voucherCache: { data: Voucher[]; timestamp: number; } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useVouchers(): UseVouchersReturn {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVouchers = useCallback(async (forceRefresh = false) => {
    try {
      // Check cache first
      if (!forceRefresh && voucherCache && (Date.now() - voucherCache.timestamp) < CACHE_DURATION) {
        setVouchers(voucherCache.data);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await api.get('/vouchers');
      
      if (response.data.success) {
        const voucherData = response.data.data;
        setVouchers(voucherData);
        
        // Update cache
        voucherCache = {
          data: voucherData,
          timestamp: Date.now()
        };
      } else {
        throw new Error(response.data.error || 'Failed to fetch vouchers');
      }
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch vouchers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const refresh = useCallback(() => {
    fetchVouchers(true);
  }, [fetchVouchers]);

  return { vouchers, loading, error, refresh };
}
