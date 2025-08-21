# Components Structure

Cấu trúc component đã được tổ chức lại theo chức năng để dễ bảo trì và mở rộng.

## 📁 Cấu trúc thư mục

```
app/components/
├── layout/                    # Layout components
│   ├── Header.tsx            # Header chính của website
│   ├── Footer.tsx            # Footer chính của website  
│   └── Marquee.tsx           # Banner chạy chữ
├── ui/                       # UI components
│   ├── Avatar.tsx            # Component avatar
│   ├── LoadingSkeleton.tsx   # Loading states và skeleton UI
│   ├── Pagination.tsx        # Phân trang
│   ├── ErrorBoundary.tsx     # Xử lý lỗi
│   └── FeaturesDemo.tsx      # Demo các tính năng
├── product/                  # Product related components
│   ├── ProductCard.tsx       # Card hiển thị sản phẩm
│   ├── CategoryFilter.tsx    # Bộ lọc danh mục
│   ├── CategoryProductList.tsx # Danh sách sản phẩm theo danh mục
│   ├── CategorySidebar.tsx   # Sidebar danh mục
│   ├── SidebarFilter.tsx     # Bộ lọc sidebar
│   └── Search.tsx            # Tìm kiếm sản phẩm
├── order/                    # Order related components
│   ├── OrderCard.tsx         # Card hiển thị đơn hàng
│   └── OrderList.tsx         # Danh sách đơn hàng
├── payment/                  # Payment related components
│   ├── PaymentGateway.tsx    # Cổng thanh toán
│   ├── PaymentStatus.tsx     # Trạng thái thanh toán
│   └── PaymentStatusTester.tsx # Test trạng thái thanh toán
├── user/                     # User related components
│   ├── AddressManager.tsx    # Quản lý địa chỉ
│   └── logout.tsx            # Component đăng xuất
├── pwa/                      # PWA components
│   └── PWAComponents.tsx     # Các component PWA
└── index.ts                  # Export tất cả components
```

## 🚀 Cách sử dụng

### Import từ index file (khuyến nghị)
```typescript
import { Header, Footer, ProductCard, OrderList } from '@/components'
```

### Import trực tiếp từ thư mục
```typescript
import Header from '@/components/layout/Header'
import ProductCard from '@/components/product/ProductCard'
import OrderList from '@/components/order/OrderList'
```

## 📋 Danh sách components

### Layout Components
- **Header**: Header chính với navigation, cart, user menu
- **Footer**: Footer với thông tin công ty và links
- **Marquee**: Banner chạy chữ thông báo

### UI Components
- **Avatar**: Component hiển thị avatar người dùng
- **LoadingSkeleton**: Các component loading và skeleton UI
- **Pagination**: Component phân trang
- **ErrorBoundary**: Xử lý lỗi và fallback UI
- **FeaturesDemo**: Demo các tính năng mới

### Product Components
- **ProductCard**: Card hiển thị thông tin sản phẩm
- **CategoryFilter**: Bộ lọc theo danh mục và giá
- **CategoryProductList**: Danh sách sản phẩm theo danh mục
- **CategorySidebar**: Sidebar hiển thị danh mục
- **SidebarFilter**: Bộ lọc nâng cao trong sidebar
- **Search**: Component tìm kiếm sản phẩm

### Order Components
- **OrderCard**: Card hiển thị thông tin đơn hàng
- **OrderList**: Danh sách và quản lý đơn hàng

### Payment Components
- **PaymentGateway**: Cổng thanh toán và QR code
- **PaymentStatus**: Hiển thị trạng thái thanh toán
- **PaymentStatusTester**: Tool test trạng thái thanh toán

### User Components
- **AddressManager**: Quản lý địa chỉ giao hàng
- **LogoutButton**: Component đăng xuất

### PWA Components
- **PWAComponents**: Các component PWA (install banner, update notification)

## 🔧 Lợi ích của cấu trúc mới

1. **Tổ chức rõ ràng**: Các component được nhóm theo chức năng
2. **Dễ bảo trì**: Tìm kiếm và sửa đổi component dễ dàng hơn
3. **Tái sử dụng**: Các component UI có thể được sử dụng ở nhiều nơi
4. **Mở rộng**: Dễ dàng thêm component mới vào nhóm phù hợp
5. **Import đơn giản**: Có thể import từ index file hoặc trực tiếp từ thư mục

## 📝 Ghi chú

- Tất cả components đều được export từ `index.ts`
- Có thể import từng component riêng lẻ hoặc import tất cả từ index
- Cấu trúc này tương thích ngược với code hiện tại
- Legacy exports vẫn được giữ lại trong `index.ts`
