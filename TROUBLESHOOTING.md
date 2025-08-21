# 🔧 Cách kiểm tra và khắc phục API không hoạt động

## 📍 Vấn đề hiện tại
Trang chủ chưa hiển thị được dữ liệu từ API. Đây là cách để kiểm tra và khắc phục:

## 🔍 Bước 1: Kiểm tra các trang test

### 1.1 Trang Test API
Truy cập: `http://localhost:3000/test-api`

Trang này sẽ hiển thị:
- ✅ Dữ liệu sản phẩm
- ✅ Dữ liệu danh mục  
- ✅ Sản phẩm nổi bật
- ✅ Loading states
- ✅ Error messages (nếu có)

### 1.2 Trang Debug API
Truy cập: `http://localhost:3000/debug-api`

Trang này sẽ hiển thị:
- 🔧 API Base URL đang sử dụng
- 🔧 Raw API response
- 🔧 Processed data format
- 🔧 Error details

## 🔧 Bước 2: Cấu hình Environment

### 2.1 Tạo file .env.local
```bash
# Tại root directory của project
cp .env.local.example .env.local
```

### 2.2 Cấu hình API URL
```bash
# Nếu có backend đang chạy
NEXT_PUBLIC_API_URL=http://localhost:5000

# Hoặc API production
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### 2.3 Restart server
```bash
npm run dev
```

## 🚀 Bước 3: Các tình huống xử lý

### 3.1 Trường hợp 1: Không có backend API
- ✅ System tự động sử dụng **mock data**
- ✅ Hiển thị 8 sản phẩm mẫu
- ✅ Hiển thị 6 danh mục mẫu
- ✅ Tất cả chức năng hoạt động bình thường

### 3.2 Trường hợp 2: Có backend nhưng khác format
System tự động xử lý 3 format phổ biến:

**Format 1: Direct Array**
```json
[
  {
    "id": 1,
    "name": "Product 1",
    "price": 100000
  }
]
```

**Format 2: Wrapped Response**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product 1", 
      "price": 100000
    }
  ]
}
```

**Format 3: Legacy Format**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Product 1",
      "price": 100000
    }
  ]
}
```

### 3.3 Trường hợp 3: API lỗi CORS
Thêm vào backend:
```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}))
```

## 🎯 Bước 4: Kiểm tra kết quả

### 4.1 Mở Developer Console
Truy cập trang chủ và mở F12, kiểm tra tab Console:

**✅ Thành công:**
```
🔧 Using mock data for products
🔧 Using mock data for categories
🔍 Homepage Debug: {currentProducts: 8, categories: 6, ...}
```

**❌ Có lỗi:**
```
Error fetching products, falling back to mock data: [Error details]
❌ API call failed: Network Error
```

### 4.2 Kiểm tra Network Tab
- Xem có API calls nào được gửi không
- Status codes (200, 404, 500, CORS error)
- Response format

## 🛠️ Bước 5: Troubleshooting

### 5.1 Lỗi thường gặp:

**🔴 "Cannot read properties of undefined"**
- ✅ Đã được xử lý: System tự động fallback sang mock data

**🔴 "Network Error"**  
- ❓ Kiểm tra backend có đang chạy không
- ❓ Kiểm tra URL trong .env.local
- ❓ Kiểm tra CORS settings

**🔴 "Loading never ends"**
- ✅ Đã được xử lý: Timeout tự động sau 10 giây

### 5.2 Debug steps:
1. ✅ Check `/test-api` page
2. ✅ Check browser console
3. ✅ Check network tab  
4. ✅ Verify .env.local file
5. ✅ Check backend logs

## 📱 Bước 6: Kết quả mong đợi

### Trang chủ sẽ hiển thị:
- ✅ Debug panel (development mode)
- ✅ Featured categories với dữ liệu thật/mock
- ✅ Flash sale products
- ✅ Popular products grid
- ✅ Loading skeletons khi cần
- ✅ Error handling graceful

### Console log sẽ hiển thị:
```
🔍 Homepage Debug: {
  currentProducts: 8,
  categories: 6, 
  featuredProducts: 4,
  loading: false,
  error: null
}
```

## 🎉 Kết luận

System đã được thiết kế để:
- ✅ **Luôn hoạt động** dù có hay không có backend
- ✅ **Tự động fallback** sang mock data
- ✅ **Xử lý errors** gracefully
- ✅ **Responsive** và user-friendly

Nếu vẫn có vấn đề, hãy:
1. Check `/test-api` page
2. Share console errors
3. Share network errors
4. Describe expected vs actual behavior
