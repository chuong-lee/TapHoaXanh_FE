#!/bin/bash

echo "🧹 Bắt đầu dọn dẹp dự án..."

# Xóa thư mục demo
echo "🗑️ Xóa thư mục demo..."
rm -rf app/demo/

# Xóa thư mục test và debug rỗng
echo "🗑️ Xóa thư mục test/debug rỗng..."
rm -rf app/api/test-news/
rm -rf app/api/debug/
rm -rf app/api/order/test/
rm -rf app/admin/orders/pending-shipping/
rm -rf app/api/products/related/

# Xóa thư mục auth bản sao rỗng
echo "🗑️ Xóa thư mục auth bản sao rỗng..."
rm -rf "app/api/auth/login 2/"
rm -rf "app/api/auth/profile 2/"

# Xóa file bản sao API
echo "🗑️ Xóa file bản sao API..."
rm -f "app/api/product-variant/route 2.ts"
rm -f "app/api/reviews/route 2.ts"

# Xóa file cấu hình trùng lặp
echo "🗑️ Xóa file cấu hình trùng lặp..."
rm -f next.config.js
rm -f next
rm -f taphoaxanhmmofe@0.1.0
rm -f "taphoaxanhmmofe@0.1.0 2"
rm -f tsconfig.tsbuildinfo

# Xóa file documentation bản sao
echo "🗑️ Xóa file documentation bản sao..."
rm -f "API_INTEGRATION_GUIDE 2.md"
rm -f "API_SETUP 2.md"
rm -f "BREADCRUMB_SUMMARY 2.md"
rm -f "BREADCRUMB_USAGE 2.md"
rm -f "EXAMPLES 2.md"
rm -f "FEATURES 2.md"
rm -f "FIXES_COMPLETED 2.md"
rm -f "OPTIMIZATION_SUMMARY 2.md"
rm -f "ORDER_MANAGEMENT_FEATURES 2.md"
rm -f "PAYMENT_STATUS_GUIDE 2.md"
rm -f "TROUBLESHOOTING 2.md"

# Xóa file app bản sao
echo "🗑️ Xóa file app bản sao..."
rm -f "app/about-us/page 2.tsx"
rm -f "app/categories/page 2.tsx"
rm -f "app/api/news/route 2.ts"
rm -f "app/api/address/route 2.ts"

# Xóa file scripts bản sao
echo "🗑️ Xóa file scripts bản sao..."
rm -f "scripts/check_address_table 2.js"
rm -f "scripts/create_address_table 2.sql"
rm -f "scripts/insert_sample_addresses 2.js"
rm -f "scripts/setup_address_table 2.js"
rm -f "scripts/fix_user_images 2.js"
rm -f "scripts/run_order_table_update 2.js"
rm -f "scripts/check-database-images 2.js"
rm -f "scripts/create-diverse-product-images 2.js"
rm -f "scripts/generate-all-product-images 2.js"
rm -f "scripts/generate-product-images-simple 2.js"
rm -f "scripts/generate-product-images 2.js"
rm -f "scripts/fix-eslint-errors 2.js"
rm -f "scripts/fix-html-entities 2.js"
rm -f "scripts/fix-remaining-errors 2.js"
rm -f "scripts/create_payments_table 2.sql"
rm -f "scripts/generate-icons 2.js"
rm -f "scripts/insert-sample-orders-new 2.js"
rm -f "scripts/setup_payments 2.js"
rm -f "scripts/update-user-passwords 2.js"

# Xóa file database bản sao
echo "🗑️ Xóa file database bản sao..."
rm -f "database/voucher 2.sql"

# Xóa file hooks bản sao
echo "🗑️ Xóa file hooks bản sao..."
rm -f "hooks/useProduct 2.ts"

# Xóa file cấu hình bản sao
echo "🗑️ Xóa file cấu hình bản sao..."
rm -f "next.config 2.js"
rm -f "jsconfig 2.json"
rm -f ".eslintrc 2.json"
rm -f "install-mysql 2.sh"

# Xóa thư mục bản sao (nếu tồn tại)
echo "🗑️ Xóa thư mục bản sao..."
rm -rf "app/categories/[id] 2" 2>/dev/null
rm -rf "app/invoice/[id] 2" 2>/dev/null
rm -rf "app/track-order/[id] 2" 2>/dev/null

# Xóa thư mục .next cache (tùy chọn - sẽ được tạo lại khi build)
echo "🗑️ Xóa cache .next..."
rm -rf .next/

# Xóa node_modules (tùy chọn - sẽ được cài lại)
echo "🗑️ Xóa node_modules..."
rm -rf node_modules/

echo "✅ Hoàn thành dọn dẹp!"
echo ""
echo "📊 Thống kê:"
echo "   - Đã xóa thư mục demo"
echo "   - Đã xóa các thư mục test/debug rỗng"
echo "   - Đã xóa tất cả file bản sao (* 2*)"
echo "   - Đã xóa file cấu hình trùng lặp"
echo "   - Đã xóa cache .next"
echo "   - Đã xóa node_modules"
echo ""
echo "🚀 Bước tiếp theo:"
echo "   1. Chạy: npm install"
echo "   2. Chạy: npm run dev"
echo "   3. Kiểm tra ứng dụng hoạt động bình thường"
