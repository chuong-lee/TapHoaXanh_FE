# Hướng dẫn Trạng thái Thanh toán

## Tổng quan

Hệ thống đã được cập nhật với các trạng thái thanh toán mới để quản lý chi tiết hơn quá trình thanh toán của khách hàng.

## Các trạng thái thanh toán mới

### 1. Chưa thanh toán (`payment_pending`)
- **Mô tả**: Khách hàng chưa thực hiện thanh toán
- **Màu sắc**: Vàng (#ffc107)
- **Icon**: 💳
- **Hành động**: "Thanh toán ngay"

### 2. Thanh toán thành công (`payment_success`)
- **Mô tả**: Thanh toán đã được xử lý thành công
- **Màu sắc**: Xanh lá (#28a745)
- **Icon**: ✅
- **Hành động**: Không có

### 3. Thanh toán thất bại (`payment_failed`)
- **Mô tả**: Thanh toán không thành công do lỗi hệ thống
- **Màu sắc**: Đỏ (#dc3545)
- **Icon**: ⚠️
- **Hành động**: "Thử lại"

### 4. Số dư không đủ (`payment_insufficient_funds`)
- **Mô tả**: Tài khoản ngân hàng không đủ số dư
- **Màu sắc**: Đỏ (#dc3545)
- **Icon**: ⚠️
- **Hành động**: "Nạp tiền"
- **Đặc biệt**: Hiển thị thông tin số dư hiện tại và số tiền cần

### 5. Đang xử lý thanh toán (`payment_processing`)
- **Mô tả**: Thanh toán đang được xử lý
- **Màu sắc**: Xanh dương (#17a2b8)
- **Icon**: 🔄 (spinning)
- **Hành động**: Không có

### 6. Đã hoàn tiền (`payment_refunded`)
- **Mô tả**: Số tiền đã được hoàn về tài khoản
- **Màu sắc**: Xám (#6c757d)
- **Icon**: ↩️
- **Hành động**: Không có

### 7. Thanh toán một phần (`payment_partial`)
- **Mô tả**: Chỉ một phần thanh toán được xử lý
- **Màu sắc**: Cam (#fd7e14)
- **Icon**: %
- **Hành động**: "Thanh toán nốt"

## Cách sử dụng

### 1. Component PaymentStatus

```tsx
import PaymentStatus from '../components/PaymentStatus';

// Hiển thị đơn giản
<PaymentStatus status="payment_success" />

// Hiển thị chi tiết
<PaymentStatus 
  status="payment_insufficient_funds"
  paymentMethod="Thẻ ATM"
  amount={1000000}
  showDetails={true}
/>
```

### 2. API Endpoints

#### Lấy trạng thái thanh toán
```bash
GET /api/payment/status?orderId=1
```

#### Cập nhật trạng thái thanh toán
```bash
POST /api/payment/status
{
  "orderId": 1,
  "paymentStatus": "payment_success",
  "paymentMethod": "Thẻ tín dụng",
  "amount": 150000
}
```

#### Xử lý thanh toán ngân hàng (kiểm tra số dư)
```bash
PUT /api/payment/status
{
  "orderId": 1,
  "paymentMethod": "Chuyển khoản ngân hàng",
  "amount": 500000,
  "bankAccount": "1234567890"
}
```

### 3. Database Schema

Bảng `payments` mới:

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status ENUM(
    'payment_pending',
    'payment_success', 
    'payment_failed',
    'payment_insufficient_funds',
    'payment_processing',
    'payment_refunded',
    'payment_partial'
  ) DEFAULT 'payment_pending',
  method VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  failure_reason TEXT,
  transaction_id VARCHAR(255),
  bank_account VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

## Tính năng đặc biệt

### 1. Kiểm tra số dư ngân hàng
- Hệ thống mô phỏng kiểm tra số dư với các tài khoản mẫu:
  - `1234567890`: 500,000₫
  - `0987654321`: 200,000₫
  - `1122334455`: 1,500,000₫

### 2. Component Test
- Sử dụng `PaymentStatusTester` để test các trạng thái
- Có thể thay đổi trạng thái, phương thức, số tiền
- Preview real-time

### 3. Tích hợp với đơn hàng
- Trạng thái thanh toán tự động cập nhật trạng thái đơn hàng
- `payment_success` → `confirmed`
- `payment_failed`/`payment_insufficient_funds` → `pending`

## Ví dụ sử dụng

### Trong Profile Page
```tsx
// Hiển thị trạng thái thanh toán trong danh sách đơn hàng
{orders.map(order => (
  <div key={order.id}>
    <PaymentStatus 
      status={order.paymentStatus}
      paymentMethod={order.paymentMethod}
      amount={order.amount}
      showDetails={true}
    />
  </div>
))}
```

### Trong Checkout Page
```tsx
// Hiển thị trạng thái thanh toán sau khi xử lý
const [paymentStatus, setPaymentStatus] = useState('payment_processing');

const handlePayment = async () => {
  try {
    const response = await fetch('/api/payment/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        paymentMethod: 'Chuyển khoản ngân hàng',
        amount: order.total,
        bankAccount: bankAccount
      })
    });
    
    const result = await response.json();
    setPaymentStatus(result.data.paymentStatus);
  } catch (error) {
    setPaymentStatus('payment_failed');
  }
};
```

## Lưu ý

1. **Tương thích**: Các trạng thái cũ vẫn được hỗ trợ
2. **Database**: Chạy script `scripts/create_payments_table.sql` để tạo bảng mới
3. **Testing**: Sử dụng component `PaymentStatusTester` để test
4. **Styling**: Tất cả styles được inline để dễ tùy chỉnh

## Troubleshooting

### Lỗi thường gặp

1. **"Order not found"**: Kiểm tra orderId có tồn tại trong database
2. **"Payment status not updated"**: Kiểm tra quyền truy cập database
3. **"Bank balance check failed"**: Kiểm tra tài khoản ngân hàng mẫu

### Debug

```bash
# Kiểm tra log API
curl -X GET "http://localhost:3000/api/payment/status?orderId=1"

# Test thanh toán ngân hàng
curl -X PUT "http://localhost:3000/api/payment/status" \
  -H "Content-Type: application/json" \
  -d '{"orderId": 1, "paymentMethod": "Chuyển khoản ngân hàng", "amount": 500000, "bankAccount": "1234567890"}'
``` 