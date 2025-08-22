# Hướng dẫn Setup API với Database MySQL

## 1. Cài đặt mysql2 package
```bash
cd /Users/minh/Documents/work/TapHoaXanh_FE
npm install mysql2
```

## 2. Cấu hình Database
Đảm bảo MySQL server đang chạy và database `tap_hoa_xanh` đã tồn tại với:
- Host: localhost
- Port: 3306  
- User: root
- Password: (trống)
- Database: tap_hoa_xanh

## 3. Test API Endpoints

### Test database connection:
```
http://localhost:3000/api/test-db
```

### Get categories:
```
http://localhost:3000/api/categories
```

### Get products:
```
http://localhost:3000/api/products
```

### Get products by category:
```
http://localhost:3000/api/products?category_id=1
```

## 4. Chạy Development Server
```bash
npm run dev
```

## 5. Kiểm tra console logs
Mở Developer Tools và xem console để debug API calls và responses.

## Troubleshooting
- Nếu database connection fails, check MySQL server có đang chạy không
- Nếu categories rỗng, check database có data không
- Nếu vẫn hiển thị mock data, clear browser cache và restart dev server
