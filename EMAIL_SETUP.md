# 📧 Hướng dẫn setup Email cho Contact Form

## 🔧 Cấu hình Email

### 1. Tạo App Password cho Gmail

1. Vào [Google Account Settings](https://myaccount.google.com/)
2. Chọn **Security** → **2-Step Verification** (bật nếu chưa có)
3. Chọn **App passwords**
4. Chọn **Mail** và **Other (Custom name)**
5. Nhập tên: "Tạp Hóa Xanh Contact Form"
6. Copy password được tạo (16 ký tự)

### 2. Thêm vào file .env.local

```env
# Email Configuration
EMAIL_USER="your_gmail@gmail.com"
EMAIL_PASS="your_16_character_app_password"
CONTACT_EMAIL="contact@taphoxanh.com"
```

### 3. Cài đặt Nodemailer

```bash
npm install nodemailer @types/nodemailer
```

## 📋 Cách hoạt động

1. **Khách hàng** điền form liên hệ
2. **Frontend** gửi data đến `/api/contact`
3. **Backend** validate và gửi email
4. **Email** được gửi đến `CONTACT_EMAIL`
5. **Khách hàng** nhận thông báo thành công

## 🎯 Email Template

Email sẽ có format:
- **Subject**: `[Tạp Hóa Xanh] Liên hệ từ khách hàng: {tiêu đề}`
- **Content**: Thông tin khách hàng + nội dung tin nhắn
- **HTML**: Đẹp mắt với styling

## 🔒 Bảo mật

- Sử dụng App Password (không phải password chính)
- Validate input trên cả frontend và backend
- Rate limiting (có thể thêm sau)
- Sanitize HTML input

## 🚀 Test

1. Điền form contact
2. Kiểm tra email nhận được
3. Kiểm tra console log nếu có lỗi
