'use client'
import { useState, useEffect } from 'react'
import api from '../lib/axios'

export default function TestVoucherPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Testing voucher API...');
        
        const response = await api.get('/api/voucher');
        console.log('API Response:', response);
        console.log('Response data:', response.data);
        
        setVouchers(response.data || []);
      } catch (err: any) {
        console.error('Error fetching vouchers:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  return (
    <div className="container py-5">
      <h1>Test Voucher API</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      
      <div>
        <h3>Vouchers ({vouchers.length})</h3>
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="card mb-2">
            <div className="card-body">
              <h5>{voucher.code}</h5>
              <p>Max Discount: {voucher.max_discount}</p>
              <p>Min Order: {voucher.min_order_value}</p>
              <p>Quantity: {voucher.quantity}</p>
              <p>Is Used: {voucher.is_used ? 'Yes' : 'No'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
