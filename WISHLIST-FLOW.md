# Flow Hoạt Động Wishlist - 2 Trường Hợp

## 🔄 Flow Tổng Quan

### 1. **Chưa đăng nhập (Guest User)**
```
User click heart → Lưu vào localStorage → Hiển thị thông báo
```

### 2. **Đã đăng nhập (Auth User)**
```
User click heart → Lưu vào database → Cập nhật UI
```

## 📋 Chi Tiết API Endpoints

### Backend API Routes:

#### Cho User Đã Đăng Nhập (Database):
- `POST /wishlist/auth` - Thêm sản phẩm vào database
- `GET /wishlist/auth/user` - Lấy wishlist từ database
- `DELETE /wishlist/auth/product/:productId` - Xóa khỏi database
- `GET /wishlist/auth/check/:productId` - Kiểm tra trong database

#### Cho User Chưa Đăng Nhập (localStorage):
- `POST /wishlist/guest` - Trả về thông báo để frontend xử lý localStorage
- `GET /wishlist/guest/check/:productId` - Trả về thông báo
- `DELETE /wishlist/guest/product/:productId` - Trả về thông báo

### Frontend API Routes:
- `POST /api/wishlist` - Proxy đến backend (auth hoặc guest)
- `GET /api/wishlist` - Proxy đến backend
- `DELETE /api/wishlist?productId=X` - Proxy đến backend
- `GET /api/wishlist/check/[productId]` - Proxy đến backend

## 🎯 Logic Xử Lý trong useWishlist Hook

### Khi Thêm Vào Wishlist:
```typescript
if (profile) {
  // Đã đăng nhập - gọi API database
  await api.post('/api/wishlist', { productId });
  const response = await api.get('/api/wishlist');
  setWishlist(response.data);
} else {
  // Chưa đăng nhập - lưu localStorage
  const localWishlist = getLocalWishlist();
  const newItem = { /* product data */ };
  const updatedWishlist = [...localWishlist, newItem];
  setWishlist(updatedWishlist);
  saveLocalWishlist(updatedWishlist);
}
```

### Khi Load Wishlist:
```typescript
if (profile) {
  // Đã đăng nhập - lấy từ database
  const response = await api.get('/api/wishlist');
  setWishlist(response.data);
} else {
  // Chưa đăng nhập - lấy từ localStorage
  const localWishlist = getLocalWishlist();
  setWishlist(localWishlist);
}
```

### Khi Đồng Bộ (Login):
```typescript
// Khi user đăng nhập, đồng bộ localStorage lên database
const localWishlist = getLocalWishlist();
for (const item of localWishlist) {
  await api.post('/api/wishlist', { productId: item.product.id });
}
localStorage.removeItem('wishlist_items');
```

## 🔧 Cách Hoạt Động

### 1. **User Chưa Đăng Nhập Click Heart:**
1. Frontend kiểm tra `profile` = null
2. Lưu sản phẩm vào localStorage
3. Hiển thị thông báo "Đã lưu vào sản phẩm yêu thích"
4. Cập nhật UI với dữ liệu từ localStorage

### 2. **User Đã Đăng Nhập Click Heart:**
1. Frontend kiểm tra `profile` có giá trị
2. Gọi API `POST /api/wishlist` với authToken
3. Backend lưu vào database
4. Frontend cập nhật UI với dữ liệu từ database

### 3. **User Đăng Nhập (Đồng Bộ):**
1. Khi `profile` thay đổi từ null → có giá trị
2. Hook tự động đồng bộ localStorage lên database
3. Xóa localStorage sau khi đồng bộ thành công
4. Cập nhật UI với dữ liệu từ database

## 🎨 UI/UX

### Thông Báo:
- **Chưa đăng nhập**: "Đã lưu vào sản phẩm yêu thích"
- **Đã đăng nhập**: Không hiển thị thông báo (lưu trực tiếp)

### Icon Heart:
- **Chưa yêu thích**: Trái tim trống
- **Đã yêu thích**: Trái tim đỏ
- **Loading**: Spinner

### Badge Count:
- Hiển thị số lượng wishlist real-time
- Cập nhật ngay khi thêm/xóa

## 🔒 Bảo Mật

### Authentication:
- API database yêu cầu JWT token
- API guest không yêu cầu authentication
- Frontend tự động chuyển đổi dựa trên trạng thái đăng nhập

### Data Persistence:
- **localStorage**: Chỉ lưu trong browser, mất khi clear cache
- **Database**: Lưu vĩnh viễn, đồng bộ across devices
