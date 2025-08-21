-- Tạo bảng voucher
CREATE TABLE IF NOT EXISTS `voucher` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `description` text,
  `discount_type` enum('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) NOT NULL DEFAULT 0,
  `max_discount_amount` decimal(10,2) NOT NULL DEFAULT 0,
  `usage_limit` int(11) NOT NULL DEFAULT 0,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_code` (`code`),
  KEY `idx_active` (`is_active`),
  KEY `idx_dates` (`start_date`, `end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu
INSERT INTO `voucher` (`code`, `name`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `usage_limit`, `start_date`, `end_date`) VALUES
('WELCOME10', 'Chào mừng khách hàng mới', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10.00, 100000.00, 50000.00, 100, '2024-01-01 00:00:00', '2025-12-31 23:59:59'),
('SAVE20K', 'Tiết kiệm 20K', 'Giảm 20,000đ cho đơn hàng từ 200K', 'fixed', 20000.00, 200000.00, 20000.00, 50, '2024-01-01 00:00:00', '2025-12-31 23:59:59'),
('SUMMER15', 'Mùa hè sôi động', 'Giảm 15% cho đơn hàng từ 300K', 'percentage', 15.00, 300000.00, 100000.00, 30, '2024-06-01 00:00:00', '2024-08-31 23:59:59'),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí vận chuyển cho đơn hàng từ 500K', 'fixed', 15000.00, 500000.00, 15000.00, 20, '2024-01-01 00:00:00', '2025-12-31 23:59:59'),
('VIP25', 'Khách hàng VIP', 'Giảm 25% cho đơn hàng từ 1M', 'percentage', 25.00, 1000000.00, 200000.00, 10, '2024-01-01 00:00:00', '2025-12-31 23:59:59');
