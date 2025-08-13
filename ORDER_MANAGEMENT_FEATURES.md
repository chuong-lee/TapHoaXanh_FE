# Chức Năng Quản Lý Đơn Hàng - Tạp Hóa Xanh

## Tổng Quan

Đã cập nhật và hoàn thiện các chức năng quản lý đơn hàng cho ứng dụng Tạp Hóa Xanh, bao gồm:

1. **Xóa/Hủy đơn hàng**
2. **In hóa đơn**
3. **Theo dõi đơn hàng**

## 1. Chức Năng Hủy Đơn Hàng

### API Endpoint
```
PUT /api/order/[id]/cancel
```

### Tính Năng
- ✅ Xác thực người dùng thông qua JWT token
- ✅ Kiểm tra quyền sở hữu đơn hàng
- ✅ Chỉ cho phép hủy đơn hàng ở trạng thái `pending` hoặc `confirmed`
- ✅ Cập nhật trạng thái đơn hàng thành `cancelled`
- ✅ Thông báo kết quả cho người dùng

### Sử Dụng
```javascript
// Trong profile page
const handleCancelOrder = async (orderId: number) => {
  if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    if (!token) {
      alert('Vui lòng đăng nhập để thực hiện thao tác này');
      return;
    }
    
    await api.put(`/order/${orderId}/cancel`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert('Đơn hàng đã được hủy thành công');
    fetchOrders(); // Reload orders
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Có lỗi xảy ra khi hủy đơn hàng';
    alert(errorMessage);
  }
};
```

## 2. Chức Năng In Hóa Đơn

### Trang Hóa Đơn
```
/invoice/[id]
```

### Tính Năng
- ✅ Hiển thị thông tin chi tiết đơn hàng
- ✅ Thông tin khách hàng và địa chỉ giao hàng
- ✅ Danh sách sản phẩm với hình ảnh và giá
- ✅ Tổng kết thanh toán (tổng tiền, phí vận chuyển, giảm giá)
- ✅ Thông tin phương thức thanh toán
- ✅ Nút in hóa đơn (sử dụng `window.print()`)
- ✅ Giao diện đẹp, chuyên nghiệp

### Sử Dụng
```javascript
// Mở hóa đơn trong tab mới
const handleViewInvoice = (orderId: number) => {
  window.open(`/invoice/${orderId}`, '_blank');
};
```

### Giao Diện Hóa Đơn
- Header với logo và thông tin công ty
- Thông tin khách hàng
- Bảng chi tiết sản phẩm
- Tổng kết thanh toán
- Thông tin thanh toán
- Footer với thông tin liên hệ

## 3. Chức Năng Theo Dõi Đơn Hàng

### Trang Theo Dõi
```
/track-order/[id]
```

### Tính Năng
- ✅ Timeline trực quan hiển thị trạng thái đơn hàng
- ✅ Thông tin tổng quan đơn hàng
- ✅ Danh sách sản phẩm đã đặt
- ✅ Thông tin liên hệ hỗ trợ
- ✅ Responsive design

### Các Trạng Thái Đơn Hàng
1. **Đã đặt hàng** - Đơn hàng đã được đặt thành công
2. **Đã xác nhận** - Đơn hàng đã được xác nhận bởi cửa hàng
3. **Đang xử lý** - Đơn hàng đang được chuẩn bị
4. **Đang giao hàng** - Đơn hàng đang được vận chuyển
5. **Đã giao hàng** - Đơn hàng đã được giao thành công
6. **Đã hủy** - Đơn hàng đã được hủy

### Sử Dụng
```javascript
// Mở trang theo dõi đơn hàng
const handleTrackOrder = (orderId: number) => {
  window.open(`/track-order/${orderId}`, '_blank');
};
```

## 4. API Chi Tiết Đơn Hàng

### Endpoint
```
GET /api/order/[id]
```

### Response
```json
{
  "success": true,
  "data": {
    "id": 18,
    "createdAt": "2025-08-10T12:37:32.000Z",
    "updatedAt": "2025-08-10T12:37:32.000Z",
    "price": 31000,
    "status": "pending",
    "paymentMethod": "cod",
    "deliveryDate": "2025-08-17",
    "items": [
      {
        "id": 5,
        "name": "Sản phẩm",
        "price": 16000,
        "quantity": 1,
        "images": "client/images/product-6.jpg",
        "description": ""
      }
    ],
    "address": "Địa chỉ giao hàng",
    "user": {
      "name": "Demo User",
      "email": "demo@gmail.com"
    },
    "quantity": 1,
    "comment": "Địa chỉ giao hàng",
    "currency": "VND",
    "discount": 0,
    "shippingFee": 15000,
    "voucherId": null,
    "transactionId": null,
    "paymentStatus": "pending"
  }
}
```

## 5. Cập Nhật Profile Page

### Tính Năng Mới
- ✅ Modal chi tiết đơn hàng
- ✅ Nút "Chi tiết" để xem thông tin đơn hàng
- ✅ Nút "Theo dõi đơn hàng" mở trang tracking
- ✅ Nút "Hóa đơn" mở trang in hóa đơn
- ✅ Nút "Hủy đơn hàng" (chỉ hiển thị cho đơn hàng có thể hủy)
- ✅ Giao diện đẹp với các trạng thái màu sắc khác nhau

### Giao Diện
- Card đơn hàng với thông tin tổng quan
- Hiển thị trạng thái với icon và màu sắc
- Các nút hành động được sắp xếp hợp lý
- Responsive design cho mobile

## 6. Bảo Mật và Xác Thực

### JWT Token
- Tất cả các API đều yêu cầu JWT token
- Token được lấy từ `localStorage`
- Kiểm tra quyền sở hữu đơn hàng

### Validation
- Kiểm tra trạng thái đơn hàng trước khi hủy
- Validate dữ liệu đầu vào
- Xử lý lỗi và thông báo cho người dùng

## 7. Database Schema

### Bảng `order`
```sql
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `images` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `usersId` int(11) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `payment_description` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `gateway_response` varchar(255) DEFAULT NULL,
  `payment_amount` float DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `freeship` float DEFAULT NULL,
  `shipping_fee` float DEFAULT NULL,
  `voucherId` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usersId` (`usersId`),
  KEY `voucherId` (`voucherId`)
);
```

## 8. Hướng Dẫn Sử Dụng

### Cho Người Dùng
1. **Xem đơn hàng**: Vào trang Profile > Đơn hàng của tôi
2. **Xem chi tiết**: Click nút "Chi tiết" để xem thông tin đầy đủ
3. **Theo dõi**: Click nút "Theo dõi đơn hàng" để xem trạng thái
4. **In hóa đơn**: Click nút "Hóa đơn" để in hoặc lưu PDF
5. **Hủy đơn hàng**: Click nút "Hủy đơn hàng" (nếu có thể)

### Cho Developer
1. **API Testing**: Sử dụng Postman hoặc curl để test API
2. **Frontend**: Các component đã được tạo sẵn và có thể tái sử dụng
3. **Styling**: Sử dụng inline styles và Bootstrap classes
4. **Error Handling**: Đã implement error handling cho tất cả API calls

## 9. Tính Năng Mở Rộng

### Có Thể Thêm
- Email notification khi trạng thái đơn hàng thay đổi
- SMS notification cho khách hàng
- QR code để tracking đơn hàng
- Bản đồ theo dõi vị trí giao hàng
- Đánh giá và review sản phẩm sau khi nhận hàng
- Tích hợp với các đơn vị vận chuyển

### Performance
- Caching cho API responses
- Lazy loading cho danh sách đơn hàng
- Pagination cho danh sách đơn hàng lớn
- Image optimization cho sản phẩm

## 10. Kết Luận

Các chức năng quản lý đơn hàng đã được hoàn thiện với:
- ✅ Giao diện người dùng thân thiện
- ✅ API endpoints đầy đủ và bảo mật
- ✅ Error handling toàn diện
- ✅ Responsive design
- ✅ Tài liệu hướng dẫn chi tiết

Hệ thống sẵn sàng cho việc triển khai production và có thể mở rộng thêm các tính năng khác trong tương lai. 