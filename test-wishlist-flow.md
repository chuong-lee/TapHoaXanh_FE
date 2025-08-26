# Test Wishlist Flow - Hướng Dẫn Kiểm Tra

## 🧪 Cách Test Wishlist Hoạt Động

### 1. **Test Chưa Đăng Nhập (localStorage)**

#### Bước 1: Mở trang sản phẩm
```
1. Truy cập: http://localhost:3000/product
2. Đảm bảo chưa đăng nhập (không có profile)
```

#### Bước 2: Click tim sản phẩm
```
1. Tìm sản phẩm bất kỳ
2. Click nút heart (trái tim)
3. Kiểm tra:
   - Hiển thị thông báo "Đã lưu vào sản phẩm yêu thích"
   - Icon heart chuyển thành màu đỏ
   - Badge count trên header tăng lên
```

#### Bước 3: Kiểm tra trang wishlist
```
1. Click icon heart trên header
2. Truy cập: http://localhost:3000/wishlist
3. Kiểm tra:
   - Sản phẩm vừa thêm xuất hiện trong danh sách
   - Hiển thị thông báo "Chưa đăng nhập"
   - Debug info hiển thị count > 0
```

### 2. **Test Đã Đăng Nhập (Database)**

#### Bước 1: Đăng nhập
```
1. Truy cập: http://localhost:3000/login
2. Đăng nhập với tài khoản hợp lệ
3. Đảm bảo có profile (đã đăng nhập)
```

#### Bước 2: Click tim sản phẩm
```
1. Truy cập: http://localhost:3000/product
2. Click nút heart sản phẩm khác
3. Kiểm tra:
   - Không hiển thị thông báo
   - Icon heart chuyển thành màu đỏ
   - Badge count tăng lên
```

#### Bước 3: Kiểm tra trang wishlist
```
1. Truy cập: http://localhost:3000/wishlist
2. Kiểm tra:
   - Sản phẩm vừa thêm xuất hiện
   - Không có thông báo "Chưa đăng nhập"
   - Debug info hiển thị count > 0
```

### 3. **Test Đồng Bộ (Login với localStorage)**

#### Bước 1: Thêm sản phẩm khi chưa đăng nhập
```
1. Đăng xuất (nếu đang đăng nhập)
2. Thêm 2-3 sản phẩm vào wishlist
3. Kiểm tra localStorage có dữ liệu
```

#### Bước 2: Đăng nhập và kiểm tra đồng bộ
```
1. Đăng nhập
2. Kiểm tra:
   - Sản phẩm từ localStorage được đồng bộ lên database
   - localStorage được xóa
   - Wishlist hiển thị tất cả sản phẩm
```

## 🔍 Debug Info

### Khi vào trang wishlist, kiểm tra:

1. **Auth Status**: Đã đăng nhập / Chưa đăng nhập
2. **Loading**: Đang tải / Đã tải xong
3. **Wishlist Count**: Số lượng sản phẩm
4. **localStorage**: Dữ liệu trong localStorage
5. **Wishlist Items**: Danh sách sản phẩm chi tiết

### Console Logs:

Mở Developer Tools (F12) và kiểm tra:
```
- Network tab: API calls đến /api/wishlist
- Console tab: Error messages
- Application tab: localStorage data
```

## 🐛 Troubleshooting

### Nếu sản phẩm không hiển thị:

1. **Kiểm tra localStorage**:
   ```javascript
   // Trong console
   localStorage.getItem('wishlist_items')
   ```

2. **Kiểm tra API calls**:
   - Network tab trong DevTools
   - Xem có lỗi 401/500 không

3. **Kiểm tra useWishlist hook**:
   - Debug component hiển thị count = 0
   - Kiểm tra profile status

### Nếu không lưu được:

1. **Chưa đăng nhập**: Kiểm tra localStorage
2. **Đã đăng nhập**: Kiểm tra JWT token
3. **Backend**: Kiểm tra server logs

## ✅ Checklist Test

- [ ] Click heart → Icon chuyển đỏ
- [ ] Click heart → Badge count tăng
- [ ] Vào wishlist → Sản phẩm hiển thị
- [ ] Chưa đăng nhập → Thông báo localStorage
- [ ] Đã đăng nhập → Không có thông báo
- [ ] Login → Đồng bộ localStorage lên database
- [ ] Xóa sản phẩm → Biến mất khỏi wishlist
- [ ] Refresh trang → Dữ liệu vẫn còn
