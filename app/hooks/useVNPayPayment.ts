import { useState } from 'react';
import api from '@/lib/axios';

interface VNPayPaymentParams {
  orderId: string;
  amount: number;
  ?: string;
  ?: string;
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
  const [, setError] = useState<string | null>(null);

  const createPayment = async (params: VNPayPaymentParams): Promise<VNPayPaymentResponse> => {
    setLoading(true);
    (null);

    try {
      const response = await api.post('/payment/vnpay', params);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data. || 'Failed to create payment');
      }
    } catch (err: unknown) {
      const errorMessage = err.response?.data?.error || .message || 'Payment creation failed';
      (errorMessage);
      return {
        success: false,
        : errorMessage
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
    ,
    clearError: () => (null)
  };
}
