# Breadcrumb Section Usage Guide

## Tổng quan
Tất cả các trang có breadcrumb-section đều sử dụng file `public/client/scss/breadcrumb.scss` để đảm bảo tính nhất quán trong thiết kế.

## Các trang đã được thống nhất
Dưới đây là danh sách các trang đã sử dụng breadcrumb-section từ file `breadcrumb.scss`:

### Trang chính
- `app/about-us/page.tsx` - Về Chúng Tôi
- `app/contact/page.tsx` - Liên Hệ
- `app/login/page.tsx` - Đăng Nhập
- `app/register/page.tsx` - Đăng Ký
- `app/cart/page.tsx` - Giỏ Hàng
- `app/checkout/page.tsx` - Thanh Toán
- `app/profile/page.tsx` - Hồ Sơ Cá Nhân

### Trang sản phẩm
- `app/product/page.tsx` - Trang Sản Phẩm
- `app/categories/page.tsx` - Danh Mục
- `app/categories/[id]/page.tsx` - Chi Tiết Danh Mục

### Trang tin tức
- `app/news/page.tsx` - Tin Tức
- `app/news/[id]/page.tsx` - Chi Tiết Tin Tức
- `app/post/page.tsx` - Bài Viết

### Trang đơn hàng
- `app/track-order/[id]/page.tsx` - Theo Dõi Đơn Hàng
- `app/invoice/[id]/page.tsx` - Hóa Đơn

### Trang khác
- `app/payment/page.tsx` - Trang Thanh Toán
- `app/voucher/page.tsx` - Voucher
- `app/demo-scss/page.tsx` - Demo SCSS

## Cách sử dụng

### Cấu trúc HTML chuẩn
```tsx
<div className="breadcrumb-section">
  <div className="container">
    <h3 className="text-center">Tiêu đề trang</h3>
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link href="/">Trang Chủ</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">Tên trang hiện tại</li>
      </ol>
    </nav>
  </div>
</div>
```

### Ví dụ cụ thể
```tsx
// Trang Về Chúng Tôi
<div className="breadcrumb-section">
  <div className="container">
    <h3 className="text-center">Về Chúng Tôi</h3>
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link href="/">Trang Chủ</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">Về Chúng Tôi</li>
      </ol>
    </nav>
  </div>
</div>
```

## Tính năng CSS

### Responsive Design
- **Desktop**: Padding 188px top, 59px bottom
- **Tablet (≤768px)**: Padding 120px top, 40px bottom
- **Mobile (≤576px)**: Padding 100px top, 30px bottom

### Hiệu ứng
- Animation fadeInUp khi load trang
- Hover effects cho breadcrumb links
- Text shadow cho tiêu đề
- Background overlay cho khả năng đọc tốt hơn

### Màu sắc
- Background: Hình ảnh `breabcrumb-bg.png`
- Text: Màu trắng với shadow
- Links: Màu trắng, hover màu xanh (#6bbf2d)
- Active item: Màu xanh với background semi-transparent

## Lưu ý quan trọng

1. **Không tạo CSS riêng**: Tất cả styles cho breadcrumb-section phải được định nghĩa trong `breadcrumb.scss`
2. **Import tự động**: File `breadcrumb.scss` được import tự động thông qua `app/styles.scss`
3. **Responsive**: CSS đã bao gồm responsive design cho tất cả kích thước màn hình
4. **Accessibility**: Sử dụng semantic HTML với `nav` và `aria-label`

## Cập nhật gần đây
- ✅ Xóa CSS riêng trong `news.scss`
- ✅ Xóa CSS riêng trong `product.scss`
- ✅ Xóa mixin breadcrumb-section trong `_mixins.scss`
- ✅ Thống nhất tất cả styles trong `breadcrumb.scss`
- ✅ Thêm responsive overrides cho các trang đặc biệt

## Troubleshooting

### Nếu breadcrumb không hiển thị đúng
1. Kiểm tra file `breadcrumb.scss` có được import trong `styles.scss`
2. Đảm bảo sử dụng đúng class name `breadcrumb-section`
3. Kiểm tra console để xem có lỗi CSS không

### Nếu muốn tùy chỉnh cho trang cụ thể
Sử dụng CSS specificity hoặc thêm class wrapper:
```scss
.news .breadcrumb-section {
  // Tùy chỉnh cho trang news
}

.product-page .breadcrumb-section {
  // Tùy chỉnh cho trang product
}
```
