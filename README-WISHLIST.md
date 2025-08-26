# Tính Năng Wishlist - Tạp Hóa Xanh

## 🚀 Cách Chạy Dự Án

### 1. Chạy Frontend (Next.js)
```bash
cd TapHoaXanh_FE
npm install
npm run dev
```
Frontend sẽ chạy tại: http://localhost:3000

### 2. Chạy Backend (NestJS)
```bash
cd TapHoaXanh_BE
npm install
npm run start:dev
```
Backend sẽ chạy tại: http://localhost:3001

### 3. Chạy Cả Hai Cùng Lúc
```bash
# Trong thư mục TapHoaXanh_FE
./start-dev.bat
```

## 🔧 Cấu Hình Database

### Chạy Migration cho Wishlist
```bash
cd TapHoaXanh_BE
npm run migration:run
```

## ✨ Tính Năng Wishlist

### Chức Năng Chính:
1. **Thêm vào yêu thích**: Click nút heart trên sản phẩm
2. **Xem danh sách yêu thích**: Click icon heart trên header
3. **Xóa khỏi yêu thích**: Click nút X trên card sản phẩm trong trang wishlist

### Hành Vi:
- **Chưa đăng nhập**: Lưu vào localStorage, hiển thị thông báo "Đã lưu vào sản phẩm yêu thích"
- **Đã đăng nhập**: Lưu vào database, đồng bộ từ localStorage nếu có

### API Endpoints:
- `GET /api/wishlist` - Lấy danh sách wishlist của user
- `POST /api/wishlist` - Thêm sản phẩm vào wishlist
- `DELETE /api/wishlist?productId=X` - Xóa sản phẩm khỏi wishlist
- `GET /api/wishlist/check/:productId` - Kiểm tra trạng thái wishlist

## 🐛 Sửa Lỗi Thường Gặp

### Lỗi Port 3000 đã được sử dụng:
```bash
# Dừng tất cả process Node.js
taskkill /f /im node.exe

# Hoặc chạy với port khác
npm run dev -- --port 3001
```

### Lỗi Database Connection:
- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin kết nối trong `.env`

### Lỗi Build:
```bash
npm run build
# Nếu có lỗi, kiểm tra import paths
```

## 📁 Cấu Trúc Files

### Frontend:
- `app/hooks/useWishlist.ts` - Hook quản lý wishlist
- `app/components/product/WishlistButton.tsx` - Component nút yêu thích
- `app/wishlist/page.tsx` - Trang danh sách yêu thích
- `app/api/wishlist/` - API routes

### Backend:
- `src/wishlist/` - Module wishlist
- `src/migrations/1749142159562-CreateWishlistTable.ts` - Migration

## 🎯 Tính Năng Đã Hoàn Thành

✅ Hook useWishlist với localStorage và database  
✅ Component WishlistButton tái sử dụng  
✅ Trang wishlist với giao diện đẹp  
✅ API routes cho frontend  
✅ Backend API với authentication  
✅ Database migration  
✅ Icon wishlist trên header với badge  
✅ Đồng bộ localStorage ↔ database  
✅ Thông báo khi chưa đăng nhập  
✅ Loading states và error handling  

## 🔄 Workflow

1. User click heart → Kiểm tra đăng nhập
2. Chưa đăng nhập → Lưu localStorage + Hiển thị thông báo
3. Đã đăng nhập → Lưu database + Cập nhật UI
4. Khi đăng nhập → Đồng bộ localStorage lên database
5. Icon header hiển thị số lượng wishlist real-time
