'use client';

import React, { useState } from 'react';
import PaymentStatus from './PaymentStatus';

interface PaymentStatusTesterProps {
  orderId?: number;
}

export const PaymentStatusTester: React.FC<PaymentStatusTesterProps> = ({ orderId = 1 }) => {
  const [selectedStatus, setSelectedStatus] = useState('payment_pending');
  const [paymentMethod, setPaymentMethod] = useState('Thẻ tín dụng');
  const [amount, setAmount] = useState(150000);
  const [showDetails, setShowDetails] = useState(true);
  const [testResult, setTestResult] = useState<any>(null);

  const statusOptions = [
    { value: 'payment_pending', label: 'Chưa thanh toán' },
    { value: 'payment_success', label: 'Thanh toán thành công' },
    { value: 'payment_failed', label: 'Thanh toán thất bại' },
    { value: 'payment_insufficient_funds', label: 'Số dư không đủ' },
    { value: 'payment_processing', label: 'Đang xử lý thanh toán' },
    { value: 'payment_refunded', label: 'Đã hoàn tiền' },
    { value: 'payment_partial', label: 'Thanh toán một phần' }
  ];

  const methodOptions = [
    'Thẻ tín dụng',
    'Thẻ ATM',
    'Ví điện tử',
    'Chuyển khoản ngân hàng',
    'Momo',
    'ZaloPay',
    'Thanh toán khi nhận hàng'
  ];

  const testPaymentStatus = async () => {
    try {
      const response = await fetch('/api/payment/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentStatus: selectedStatus,
          paymentMethod,
          amount,
          failureReason: selectedStatus === 'payment_insufficient_funds' 
            ? `Số dư không đủ. Hiện tại: ${(amount * 0.5).toLocaleString('vi-VN')}₫, Cần: ${amount.toLocaleString('vi-VN')}₫`
            : null
        }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('Error testing payment status:', error);
      setTestResult({ success: false, error: 'Network error' });
    }
  };

  const testBankPayment = async () => {
    try {
      const response = await fetch('/api/payment/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: 'Chuyển khoản ngân hàng',
          amount,
          bankAccount: '1234567890'
        }),
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      console.error('Error testing bank payment:', error);
      setTestResult({ success: false, error: 'Network error' });
    }
  };

  return (
    <div className="payment-status-tester" style={{
      background: '#f8f9fa',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e9ecef',
      marginBottom: '24px'
    }}>
      <h4 style={{ marginBottom: '20px', color: '#495057' }}>
        🧪 Test Trạng thái Thanh toán
      </h4>
      
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Trạng thái thanh toán:
          </label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Phương thức thanh toán:
          </label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          >
            {methodOptions.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Số tiền (VNĐ):
          </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ced4da',
              fontSize: '14px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Hiển thị chi tiết:
          </label>
          <input 
            type="checkbox" 
            checked={showDetails} 
            onChange={(e) => setShowDetails(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontSize: '14px' }}>Hiển thị thông tin chi tiết</span>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button 
          onClick={testPaymentStatus}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: '#007bff',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🧪 Test Trạng thái
        </button>
        
        <button 
          onClick={testBankPayment}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: '#28a745',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🏦 Test Thanh toán Ngân hàng
        </button>
      </div>

      {testResult && (
        <div style={{ 
          marginTop: '20px', 
          padding: '16px', 
          borderRadius: '8px',
          background: testResult.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
          color: testResult.success ? '#155724' : '#721c24'
        }}>
          <h5 style={{ margin: '0 0 8px 0' }}>
            {testResult.success ? '✅ Thành công' : '❌ Lỗi'}
          </h5>
          <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '24px' }}>
        <h5 style={{ marginBottom: '16px', color: '#495057' }}>
          Preview:
        </h5>
        <PaymentStatus 
          status={selectedStatus}
          paymentMethod={paymentMethod}
          amount={amount}
          showDetails={showDetails}
        />
      </div>
    </div>
  );
};

export default PaymentStatusTester; 