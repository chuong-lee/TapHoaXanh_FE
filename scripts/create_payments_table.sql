-- Tạo bảng payments để quản lý trạng thái thanh toán
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status ENUM(
    'payment_pending',
    'payment_success', 
    'payment_failed',
    'payment_insufficient_funds',
    'payment_processing',
    'payment_refunded',
    'payment_partial'
  ) DEFAULT 'payment_pending',
  method VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  failure_reason TEXT,
  transaction_id VARCHAR(255),
  bank_account VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Thêm một số dữ liệu mẫu
INSERT INTO payments (order_id, status, method, amount, failure_reason, transaction_id, bank_account) VALUES
(1, 'payment_success', 'Thẻ tín dụng', 150000.00, NULL, 'TXN001', NULL),
(2, 'payment_pending', 'Ví điện tử', 250000.00, NULL, 'TXN002', NULL),
(3, 'payment_failed', 'Chuyển khoản ngân hàng', 500000.00, 'Lỗi kết nối ngân hàng', 'TXN003', '1234567890'),
(4, 'payment_insufficient_funds', 'Thẻ ATM', 1000000.00, 'Số dư không đủ. Hiện tại: 500,000₫, Cần: 1,000,000₫', 'TXN004', '0987654321'),
(5, 'payment_processing', 'Momo', 75000.00, NULL, 'TXN005', NULL),
(6, 'payment_refunded', 'ZaloPay', 120000.00, NULL, 'TXN006', NULL);

-- Cập nhật trạng thái đơn hàng dựa trên trạng thái thanh toán
UPDATE orders SET status = 'confirmed' WHERE id IN (1, 6);
UPDATE orders SET status = 'pending' WHERE id IN (2, 3, 4, 5); 