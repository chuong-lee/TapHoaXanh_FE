-- Tạo bảng payments để lưu thông tin thanh toán SePay
CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(100) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `sepay_transaction_id` varchar(100) DEFAULT NULL,
  `amount` decimal(20,2) NOT NULL,
  `description` text,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `status` enum('pending','success','failed','expired') NOT NULL DEFAULT 'pending',
  `bank_account` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `qr_code_url` text DEFAULT NULL,
  `transaction_date` datetime DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `order_id` (`order_id`),
  KEY `status` (`status`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm cột payment_date vào bảng order nếu chưa có
ALTER TABLE `order` 
ADD COLUMN IF NOT EXISTS `payment_date` datetime DEFAULT NULL AFTER `payment_status`;

