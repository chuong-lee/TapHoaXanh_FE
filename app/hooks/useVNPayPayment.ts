import { useState } from 'react';
import api from '@/lib/axios';

interface VNPayPaymentParams {
  orderId: string;
  amount: number;
  customerEmail?: string;
  customerPhone?: string;
}

interface VNPayPaymentResponse {
  success: boolean;
  data?: {
    paymentUrl: string;
    orderId: string;
  };
  error?: string;
}

export function useVNPayPayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (params: VNPayPaymentParams): Promise<VNPayPaymentResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/payment/vnpay', params);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Failed to create payment');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Payment creation failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const redirectToPayment = (paymentUrl: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = paymentUrl;
    }
  };

  const processPayment = async (params: VNPayPaymentParams) => {
    const result = await createPayment(params);
    
    if (result.success && result.data) {
      redirectToPayment(result.data.paymentUrl);
    }
    
    return result;
  };

  return {
    createPayment,
    processPayment,
    redirectToPayment,
    loading,
    error,
    clearError: () => setError(null)
  };
}
