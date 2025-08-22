-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Aug 20, 2025 at 12:27 PM
-- Server version: 5.7.39
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tap_hoa_xanh`
--

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `street` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `is_default` tinyint(4) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `name`, `slug`, `category_id`) VALUES
(1, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vinmart', 'vinmart', 1),
(2, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'CP', 'cp', 2),
(3, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Maggi', 'maggi', 3),
(4, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nutrilite', 'nutrilite', 4),
(5, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vinamilk Organic', 'vinamilk-organic', 5),
(6, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Coca-Cola', 'coca-cola', 6),
(7, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Dutch Lady', 'dutch-lady', 7),
(8, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Kinh Đô', 'kinh-do', 8),
(9, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vega', 'vega', 9),
(10, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Đa Cua Hải Phòng', 'banh-da-cua-hai-phong', 10),
(11, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vissan', 'vissan', 2),
(12, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Ba Con Cừu', 'ba-con-cuu', 2),
(13, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nestle', 'nestle', 4),
(14, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Herbalife', 'herbalife', 4),
(15, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Biogreen', 'biogreen', 5),
(16, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Biona', 'biona', 5),
(17, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Pepsi', 'pepsi', 6),
(18, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tân Hiệp Phát', 'tan-hiep-phat', 6),
(19, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Phò Mai Cô Gái', 'pho-mai-co-gai', 7),
(20, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Anchor', 'anchor', 7),
(21, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Oreo', 'oreo', 8),
(22, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mars', 'mars', 8),
(23, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Annam Gourmet', 'annam-gourmet', 9),
(24, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fruits & Veggies', 'fruits-veg', 9),
(25, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Dac San Viet', 'dac-san-viet', 10),
(26, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Quà tặng Việt Nam', 'qua-tang-viet-nam', 10),
(27, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Satrafoods', 'satrafoods', 1),
(28, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Big C', 'big-c', 1),
(29, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Green Farm', 'green-farm', 2),
(30, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Jollibee', 'jollibee', 2),
(31, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Knorr', 'knorr', 3),
(32, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Hải Hà', 'hai-ha', 3),
(33, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Blackmores', 'blackmores', 4),
(34, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Amway', 'amway', 4),
(35, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Organic Valley', 'organic-valley', 5),
(36, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nature\'s Path', 'natures-path', 5),
(37, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Suntory', 'suntory', 6),
(38, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fanta', 'fanta', 6),
(39, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak', 'tetra-pak', 7),
(40, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Yomilk', 'yomilk', 7),
(41, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Pía', 'banh-pia', 8),
(42, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Glico', 'glico', 8),
(43, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vegemite', 'vegemite', 9),
(44, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Lao Dao', 'lao-dao', 9),
(45, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Đa Cua Quảng Ninh', 'banh-da-cua-quang-ninh', 10),
(46, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sản phẩm đặc sản Phú Quốc', 'dac-san-phu-quoc', 10),
(47, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sagrifood', 'sagrifood', 1),
(48, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fami', 'fami', 1),
(49, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Jelly Belly', 'jelly-belly', 2),
(50, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Hormel', 'hormel', 2),
(51, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Guilin', 'guilin', 3),
(52, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Haitian', 'haitian', 3),
(53, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Life Space', 'life-space', 4),
(54, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Swisse', 'swisse', 4),
(55, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nature\'s Way', 'natures-way', 5),
(56, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Kirkland', 'kirkland', 5);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `total_price` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `cart_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `name`, `slug`, `parent_id`) VALUES
(1, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm tươi sống', 'thuc-pham-tuoi-sống', 0),
(2, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm chế biến sẵn', 'thuc-pham-che-bien-san', 0),
(3, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm đóng hộp và gia vị', 'thuc-pham-dong-hop-gia-vi', 0),
(4, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm chức năng và bổ sung dinh dưỡng', 'thuc-pham-chuc-nang-bo-sung-dinh-duong', 0),
(5, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm hữu cơ và ăn kiêng', 'thuc-pham-huu-co-va-an-kieng', 0),
(6, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Đồ uống', 'do-uong', 0),
(7, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sản phẩm từ sữa và phô mai', 'san-pham-tu-sua-va-pho-mai', 0),
(8, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh kẹo và các món tráng miệng', 'banh-keo-va-cac-mon-trang-mieng', 0),
(9, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm chay và thực phẩm thuần chay', 'thuc-pham-chay-va-thuc-pham-thuan-chay', 0),
(10, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm đặc sản', 'thuc-pham-dac-san', 0),
(11, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Rau củ quả', 'rau-cu-qua', 1),
(12, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thịt tươi', 'thit-tuoi', 1),
(13, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Hải sản', 'hai-san', 1),
(14, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Trái cây tươi', 'trai-cay-tuoi', 1),
(15, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Xúc xích', 'xuc-xich', 2),
(16, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Giò chả', 'gio-cha', 2),
(17, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mì ăn liền', 'mi-an-lien', 2),
(18, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh mì', 'banh-mi', 2),
(19, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Cá hộp', 'ca-hop', 3),
(20, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thịt hộp', 'thit-hop', 3),
(21, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nước mắm', 'nuoc-mam', 3),
(22, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Gia vị nấu ăn', 'gia-vi-nau-an', 3),
(23, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vitamin', 'vitamin', 4),
(24, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bột protein', 'bot-protein', 4),
(25, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Omega-3', 'omega-3', 4),
(26, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Men vi sinh', 'men-vi-sinh', 4),
(27, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sữa hữu cơ', 'sua-huu-co', 5),
(28, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Ngũ cốc hữu cơ', 'ngu-coc-huu-co', 5),
(29, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm chay', 'thuc-pham-chay', 5),
(30, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thực phẩm thuần chay', 'thuc-pham-thuan-chay', 5),
(31, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nước ngọt', 'nuoc-ngot', 6),
(32, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Trà', 'tra', 6),
(33, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nước ép', 'nuoc-ep', 6),
(34, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bia', 'bia', 6),
(35, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Phô mai', 'pho-mai', 7),
(36, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sữa tươi', 'sua-tuoi', 7),
(37, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sữa chua', 'sua-chua', 7),
(38, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bơ', 'bo', 7),
(39, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh ngọt', 'banh-ngot', 8),
(40, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Kẹo', 'keo', 8),
(41, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sô cô la', 'so-co-la', 8),
(42, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh quy', 'banh-quy', 8),
(43, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Đậu hũ', 'dau-hu', 9),
(44, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Giò chay', 'gio-chay', 9),
(45, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Chả chay', 'cha-chay', 9),
(46, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh chay', 'banh-chay', 9),
(47, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Đa Cua Hải Phòng', 'banh-da-cua-hai-phong', 10),
(48, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh khọt Vũng Tàu', 'banh-khot-vung-tau', 10),
(49, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mắm Tôm', 'mam-tom', 10),
(50, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sò huyết', 'so-huyet', 10);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `summary` text,
  `images` text,
  `description` text NOT NULL,
  `views` int(11) DEFAULT '0',
  `likes` int(11) DEFAULT '0',
  `comments_count` int(11) DEFAULT '0',
  `author_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `total_price` int(11) NOT NULL,
  `note` int(11) NOT NULL,
  `order_code` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `productVariant_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `discount` int(11) NOT NULL,
  `images` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `expiry_date` datetime NOT NULL,
  `origin` varchar(255) NOT NULL,
  `weight_unit` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `purchase` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `name`, `price`, `discount`, `images`, `slug`, `barcode`, `expiry_date`, `origin`, `weight_unit`, `description`, `quantity`, `purchase`, `category_id`, `brand_id`) VALUES
(1, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Rau củ hữu cơ', 50000, 10, 'client/images/product-1.png', 'rau-cu-huu-co', '1234567890123', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Rau củ hữu cơ tươi ngon, an toàn.', 100, 30000, 2, 5),
(2, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Thịt bò tươi', 250000, 5, 'client/images/product-2.png', 'thit-bo-tuoi', '2345678901234', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Thịt bò tươi, giàu dinh dưỡng.', 50, 200000, 3, 1),
(3, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Xúc xích C.P.', 45000, 15, 'client/images/product-3.png', 'xuc-xich-cp', '3456789012345', '2026-12-31 00:00:00', 'Thái Lan', 'g', 'Xúc xích thơm ngon, dễ chế biến.', 200, 35000, 2, 2),
(4, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Giò chả Vissan', 75000, 10, 'client/images/product-4.png', 'gio-cha-vissan', '4567890123456', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Giò chả tươi ngon, chất lượng cao.', 150, 60000, 2, 3),
(5, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh mì sandwich', 20000, 5, 'client/images/product-5.png', 'banh-mi-sandwich', '5678901234567', '2026-08-20 00:00:00', 'Việt Nam', 'g', 'Bánh mì sandwich mềm mịn, thích hợp ăn sáng.', 300, 15000, 2, 1),
(6, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Phô mai mozzarella', 150000, 20, 'client/images/product-6.png', 'pho-mai-mozzarella', '6789012345678', '2026-08-20 00:00:00', 'New Zealand', 'kg', 'Phô mai mozzarella thơm ngon, dễ chế biến.', 75, 120000, 7, 4),
(7, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sữa tươi Vinamilk', 35000, 5, 'client/images/product-7.png', 'sua-tuoi-vinamilk', '7890123456789', '2026-08-20 00:00:00', 'Việt Nam', 'l', 'Sữa tươi Vinamilk, bổ dưỡng, thích hợp cho mọi lứa tuổi.', 500, 30000, 7, 5),
(8, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh ngọt Kinh Đô', 25000, 10, 'client/images/product-8.png', 'banh-ngot-kinh-do', '8901234567890', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Bánh ngọt Kinh Đô, ngọt ngào và thơm ngon.', 150, 20000, 8, 6),
(9, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Kẹo dẻo Haribo', 35000, 15, 'client/images/product-9.png', 'keo-deo-haribo', '9012345678901', '2026-12-31 00:00:00', 'Đức', 'g', 'Kẹo dẻo Haribo với nhiều hương vị hấp dẫn.', 250, 30000, 8, 7),
(10, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Cà phê hòa tan Nestle', 60000, 10, 'client/images/product-10.png', 'ca-phe-hoa-tan-nestle', '0123456789012', '2026-12-31 00:00:00', 'Thụy Sĩ', 'g', 'Cà phê hòa tan Nestle, thơm ngon, dễ pha chế.', 200, 50000, 6, 8),
(11, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sữa đặc có đường', 25000, 5, 'client/images/product-11.png', 'sua-dac-co-duong', '1234567890111', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Sữa đặc có đường, thích hợp cho pha chế.', 400, 20000, 7, 5),
(12, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh quy Oreo', 35000, 10, 'client/images/product-12.png', 'banh-quy-oreo', '2345678900122', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Bánh quy Oreo thơm ngon, ngọt ngào.', 250, 30000, 8, 6),
(13, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Trà Lipton', 20000, 5, 'client/images/product-13.png', 'tra-lipton', '3456789010123', '2026-08-20 00:00:00', 'Anh', 'g', 'Trà Lipton đậm đà, dễ uống.', 300, 15000, 6, 7),
(14, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mì ăn liền Vifon', 12000, 10, 'client/images/product-14.png', 'mi-an-lien-vifon', '4567890120134', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Mì ăn liền Vifon, tiện lợi và nhanh chóng.', 500, 10000, 2, 1),
(15, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Chè đậu xanh', 30000, 5, 'client/images/product-15.png', 'che-dau-xanh', '5678901230145', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Chè đậu xanh thơm ngon, mát lành.', 200, 25000, 9, 10),
(16, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh chả chay', 40000, 10, 'client/images/product-16.png', 'banh-cha-chay', '6789012340146', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Bánh chả chay thơm ngon, hấp dẫn.', 150, 35000, 9, 10),
(17, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Đa Cua Hải Phòng', 70000, 15, 'client/images/product-17.png', 'banh-da-cua-hai-phong', '7890123450147', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Bánh Đa Cua Hải Phòng đặc sản nổi tiếng.', 100, 50000, 10, 11),
(18, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mắm Tôm', 25000, 5, 'client/images/product-18.png', 'mam-tom', '8901234560148', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Mắm Tôm đặc sản, gia vị tuyệt vời cho các món ăn.', 150, 20000, 10, 12),
(19, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sò huyết', 100000, 5, 'client/images/product-19.png', 'so-huyet', '9012345670149', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Sò huyết tươi, ngon và giàu dinh dưỡng.', 50, 90000, 10, 12),
(20, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Trái cây nhập khẩu', 150000, 10, 'client/images/product-20.png', 'trai-cay-nhap-khau', '0123456780150', '2026-08-20 00:00:00', 'Châu Âu', 'kg', 'Trái cây nhập khẩu, tươi ngon và chất lượng.', 120, 130000, 1, 5),
(21, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vissan Pork', 200000, 5, 'client/images/product-11.png', 'vissan-pork', '1234567890011', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Thịt heo tươi Vissan, ngon và sạch.', 150, 180000, 2, 11),
(22, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Organic Honey', 250000, 5, 'client/images/product-22.png', 'organic-honey', '1234567890022', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Mật ong hữu cơ, nguyên chất, an toàn cho sức khỏe.', 100, 230000, 5, 3),
(23, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nestle Chocolate', 35000, 10, 'client/images/product-23.png', 'nestle-chocolate', '1234567890023', '2026-12-31 00:00:00', 'Thụy Sĩ', 'g', 'Sô cô la Nestle, ngọt ngào và thơm ngon.', 200, 32000, 8, 12),
(24, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Herbalife Protein', 400000, 10, 'client/images/product-24.png', 'herbalife-protein', '1234567890024', '2026-08-20 00:00:00', 'Mỹ', 'kg', 'Bột protein Herbalife, hỗ trợ tăng cơ và giảm cân.', 150, 370000, 4, 14),
(25, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sữa Vinamilk', 70000, 5, 'client/images/product-25.png', 'sua-vinamilk', '1234567890025', '2026-08-20 00:00:00', 'Việt Nam', 'l', 'Sữa Vinamilk tươi, bổ dưỡng, dành cho mọi lứa tuổi.', 300, 65000, 5, 16),
(26, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Pepsi Cola', 15000, 10, 'client/images/product-26.png', 'pepsi-cola', '1234567890026', '2026-12-31 00:00:00', 'USA', 'l', 'Nước ngọt Pepsi Cola, giải khát tuyệt vời.', 500, 14000, 6, 17),
(27, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tân Hiệp Phát Tea', 25000, 5, 'client/images/product-27.png', 'tan-hiep-phat-tea', '1234567890027', '2026-12-31 00:00:00', 'Việt Nam', 'l', 'Trà Tân Hiệp Phát, thơm ngon, thanh mát.', 400, 22000, 6, 18),
(28, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Oreo Cookies', 35000, 10, 'client/images/product-28.png', 'oreo-cookies', '1234567890028', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Bánh quy Oreo, ngọt ngào, dễ ăn.', 250, 32000, 8, 21),
(29, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mars Chocolate', 50000, 5, 'client/images/product-29.png', 'mars-chocolate', '1234567890029', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Sô cô la Mars, thơm ngon và bổ dưỡng.', 300, 45000, 8, 22),
(30, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fruits & Veggies Fresh', 150000, 5, 'client/images/product-30.png', 'fruits-veg-fresh', '1234567890030', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Trái cây và rau củ tươi, giàu vitamin và dinh dưỡng.', 150, 140000, 9, 24),
(31, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Knorr Soup', 50000, 10, 'client/images/product-31.png', 'knorr-soup', '1234567890031', '2026-12-31 00:00:00', 'Ấn Độ', 'g', 'Súp Knorr, tiện lợi và bổ dưỡng.', 200, 45000, 3, 31),
(32, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Hải Hà Salted Fish', 150000, 5, 'client/images/product-32.png', 'hai-ha-salted-fish', '1234567890032', '2026-12-31 00:00:00', 'Việt Nam', 'kg', 'Cá biển Hải Hà, tươi ngon, đặc sản nổi tiếng.', 100, 140000, 3, 32),
(33, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Blackmores Vitamins', 350000, 10, 'client/images/product-33.png', 'blackmores-vitamins', '1234567890033', '2026-12-31 00:00:00', 'Úc', 'g', 'Viên uống Blackmores, bổ sung vitamin và khoáng chất.', 150, 320000, 4, 33),
(34, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Amway Supplements', 600000, 5, 'client/images/product-34.png', 'amway-supplements', '1234567890034', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Thực phẩm bổ sung Amway, hỗ trợ tăng cường sức khỏe.', 100, 570000, 4, 34),
(35, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Organic Valley Milk', 70000, 10, 'client/images/product-35.png', 'organic-valley-milk', '1234567890035', '2026-08-20 00:00:00', 'Mỹ', 'l', 'Sữa hữu cơ Organic Valley, chất lượng tuyệt vời.', 300, 65000, 5, 35),
(36, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nature\'s Path Organic', 60000, 5, 'client/images/product-36.png', 'natures-path-organic', '1234567890036', '2026-08-20 00:00:00', 'Mỹ', 'kg', 'Sản phẩm hữu cơ Nature\'s Path, tốt cho sức khỏe.', 150, 57000, 5, 36),
(37, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Suntory Water', 15000, 5, 'client/images/product-37.png', 'suntory-water', '1234567890037', '2026-12-31 00:00:00', 'Nhật Bản', 'l', 'Nước giải khát Suntory, thanh mát và bổ dưỡng.', 500, 14000, 6, 37),
(38, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fanta Soft Drink', 18000, 10, 'client/images/product-38.png', 'fanta-soft-drink', '1234567890038', '2026-12-31 00:00:00', 'USA', 'l', 'Nước ngọt Fanta, ngọt ngào và giải khát.', 400, 16000, 6, 38),
(39, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak Juice', 35000, 5, 'client/images/product-39.png', 'tetra-pak-juice', '1234567890039', '2026-12-31 00:00:00', 'Thụy Điển', 'l', 'Nước ép Tetra Pak, tươi ngon và bổ dưỡng.', 300, 32000, 7, 39),
(40, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Yomilk Yogurt', 25000, 10, 'client/images/product-40.png', 'yomilk-yogurt', '1234567890040', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Sữa chua Yomilk, ngon và giàu dinh dưỡng.', 300, 22000, 7, 40),
(41, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Pía', 45000, 5, 'client/images/product-41.png', 'banh-pia', '1234567890041', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Bánh Pía thơm ngon, đặc sản nổi tiếng của Sóc Trăng.', 200, 40000, 8, 41),
(42, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Glico Biscuits', 25000, 10, 'client/images/product-42.png', 'glico-biscuits', '1234567890042', '2026-12-31 00:00:00', 'Nhật Bản', 'g', 'Bánh quy Glico, giòn tan, ngọt ngào và thơm ngon.', 300, 22000, 8, 42),
(43, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vegemite Spread', 150000, 10, 'client/images/product-43.png', 'vegemite-spread', '1234567890043', '2026-12-31 00:00:00', 'Úc', 'g', 'Mứt Vegemite đặc trưng của Úc, đậm đà hương vị.', 100, 140000, 9, 43),
(44, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Lao Dao Rice', 22000, 5, 'client/images/product-44.png', 'lao-dao-rice', '1234567890044', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Gạo Lao Dao, chất lượng cao, thích hợp cho gia đình.', 500, 20000, 9, 44),
(45, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Bánh Đa Cua Quảng Ninh', 85000, 10, 'client/images/product-45.png', 'banh-da-cua-quang-ninh', '1234567890045', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Bánh đa cua Quảng Ninh, món ăn đặc sản của miền Bắc.', 150, 80000, 10, 45),
(46, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sản phẩm đặc sản Phú Quốc', 120000, 5, 'client/images/product-46.png', 'dac-san-phu-quoc', '1234567890046', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Sản phẩm đặc sản Phú Quốc, chất lượng tuyệt vời, giá trị dinh dưỡng cao.', 200, 110000, 10, 46),
(47, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sagrifood Snacks', 30000, 5, 'client/images/product-47.png', 'sagrifood-snacks', '1234567890047', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Snack Sagrifood, giòn rụm, ngon miệng.', 400, 27000, 1, 47),
(48, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fami Cereal', 25000, 10, 'client/images/product-48.png', 'fami-cereal', '1234567890048', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Ngũ cốc Fami, giàu dinh dưỡng, tốt cho bữa sáng.', 350, 23000, 1, 48),
(49, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Jelly Belly Candies', 70000, 10, 'client/images/product-49.png', 'jelly-belly-candies', '1234567890049', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Kẹo Jelly Belly, nhiều hương vị ngon miệng.', 200, 65000, 2, 49),
(50, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Hormel Bacon', 150000, 10, 'client/images/product-50.png', 'hormel-bacon', '1234567890050', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Thịt xông khói Hormel, thơm ngon và giàu hương vị.', 150, 140000, 2, 50),
(51, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Guilin Instant Noodles', 25000, 5, 'client/images/product-51.png', 'guilin-instant-noodles', '1234567890051', '2026-12-31 00:00:00', 'Trung Quốc', 'g', 'Mì ăn liền Guilin, thơm ngon và tiện lợi.', 350, 22000, 3, 51),
(52, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Haitian Sauces', 120000, 10, 'client/images/product-52.png', 'haitian-sauces', '1234567890052', '2026-12-31 00:00:00', 'Trung Quốc', 'g', 'Gia vị Haitian, đậm đà hương vị cho các món ăn.', 200, 110000, 3, 52),
(53, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Life Space Probiotics', 450000, 10, 'client/images/product-53.png', 'life-space-probiotics', '1234567890053', '2026-08-20 00:00:00', 'Úc', 'g', 'Viên uống Life Space, hỗ trợ tiêu hóa và sức khỏe hệ miễn dịch.', 100, 400000, 4, 53),
(54, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Swisse Supplements', 500000, 15, 'client/images/product-54.png', 'swisse-supplements', '1234567890054', '2026-12-31 00:00:00', 'Úc', 'g', 'Thực phẩm bổ sung Swisse, hỗ trợ tăng cường sức khỏe.', 150, 470000, 4, 54),
(55, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nature\'s Way Vitamins', 300000, 5, 'client/images/product-55.png', 'natures-way-vitamins', '1234567890055', '2026-12-31 00:00:00', 'Úc', 'g', 'Vitamin Nature\'s Way, bổ sung dinh dưỡng cho cơ thể.', 200, 285000, 5, 55),
(56, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Kirkland Signature', 65000, 5, 'client/images/product-56.png', 'kirkland-signature', '1234567890056', '2026-08-20 00:00:00', 'Mỹ', 'kg', 'Sản phẩm Kirkland Signature, chất lượng cao, giá trị tuyệt vời.', 300, 62000, 5, 56),
(57, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Suntory Green Tea', 22000, 5, 'client/images/product-57.png', 'suntory-green-tea', '1234567890057', '2026-08-20 00:00:00', 'Nhật Bản', 'l', 'Trà xanh Suntory, thanh mát và giải khát.', 500, 20000, 6, 37),
(58, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fanta Orange', 15000, 5, 'client/images/product-58.png', 'fanta-orange', '1234567890058', '2026-12-31 00:00:00', 'USA', 'l', 'Nước ngọt Fanta, hương vị cam tươi ngon, mát lạnh.', 600, 14000, 6, 38),
(59, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak Tomato Juice', 35000, 10, 'client/images/product-59.png', 'tetra-pak-tomato-juice', '1234567890059', '2026-12-31 00:00:00', 'Thụy Điển', 'l', 'Nước ép cà chua Tetra Pak, giàu vitamin và dinh dưỡng.', 300, 32000, 7, 39),
(60, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Yomilk Yogurt Drink', 25000, 10, 'client/images/product-60.png', 'yomilk-yogurt-drink', '1234567890060', '2026-08-20 00:00:00', 'Việt Nam', 'l', 'Sữa chua Yomilk dạng uống, ngon và giàu dinh dưỡng.', 350, 22000, 7, 40),
(61, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Ocean Spray Cranberry Juice', 35000, 5, 'client/images/product-61.png', 'ocean-spray-cranberry-juice', '1234567890061', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ép nam việt quất Ocean Spray, tốt cho sức khỏe.', 300, 32000, 7, 1),
(62, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Lipton Green Tea', 25000, 5, 'client/images/product-62.png', 'lipton-green-tea', '1234567890062', '2026-12-31 00:00:00', 'Anh', 'g', 'Trà xanh Lipton, thanh mát và dễ uống.', 400, 23000, 6, 2),
(63, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Knorr Seasoning', 18000, 5, 'client/images/product-63.png', 'knorr-seasoning', '1234567890063', '2026-12-31 00:00:00', 'Ấn Độ', 'g', 'Gia vị Knorr, thêm hương vị cho các món ăn của bạn.', 500, 15000, 3, 3),
(64, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vita Coco Coconut Water', 50000, 10, 'client/images/product-64.png', 'vita-coco-coconut-water', '1234567890064', '2026-12-31 00:00:00', 'Thái Lan', 'l', 'Nước dừa Vita Coco, giải khát và bổ sung năng lượng.', 250, 45000, 7, 4),
(65, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Amway Nutrilite', 600000, 10, 'client/images/product-65.png', 'amway-nutrilite', '1234567890065', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Viên uống Nutrilite của Amway, hỗ trợ tăng cường sức khỏe.', 100, 550000, 4, 5),
(66, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Suntory Pepsi', 15000, 10, 'client/images/product-66.png', 'suntory-pepsi', '1234567890066', '2026-12-31 00:00:00', 'Nhật Bản', 'l', 'Nước ngọt Suntory Pepsi, ngọt ngào và giải khát.', 500, 13000, 6, 6),
(67, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Glico Pocky', 30000, 5, 'client/images/product-67.png', 'glico-pocky', '1234567890067', '2026-12-31 00:00:00', 'Nhật Bản', 'g', 'Bánh quy Pocky Glico, thơm ngon, dễ ăn.', 400, 27000, 8, 7),
(68, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Annam Gourmet Foods', 150000, 10, 'client/images/product-68.png', 'annam-gourmet-foods', '1234567890068', '2026-12-31 00:00:00', 'Việt Nam', 'kg', 'Các sản phẩm Annam Gourmet, chất lượng cao, nhập khẩu.', 150, 130000, 9, 8),
(69, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fruits & Veggies Fresh', 130000, 5, 'client/images/product-69.png', 'fruits-veg-fresh', '1234567890069', '2026-08-31 00:00:00', 'Việt Nam', 'kg', 'Trái cây và rau củ tươi, giàu vitamin và dinh dưỡng.', 200, 120000, 9, 9),
(70, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Dried Fruits', 90000, 10, 'client/images/product-70.png', 'dried-fruits', '1234567890070', '2026-08-20 00:00:00', 'Việt Nam', 'kg', 'Trái cây sấy khô, bảo quản lâu dài, dễ dàng sử dụng.', 150, 85000, 9, 10),
(71, '2025-08-01 18:00:00.000000', '2025-08-01 18:00:00.000000', NULL, 'Thịt bò tươi', 150000, 10, 'client/images/product-71.png', 'thit-bo-tuoi', '12345678901244gd', '2026-12-31 00:00:00', 'Việt Nam', 'kg', 'Thịt bò tươi ngon, giàu dinh dưỡng.', 100, 120000, 2, 1),
(72, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'M&M\'s Chocolate', 35000, 5, 'client/images/product-71.png', 'mms-chocolate', '1234567890071', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Sô cô la M&M\'s, ngọt ngào, nhiều hương vị.', 300, 32000, 8, 1),
(73, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Coca-Cola Zero', 20000, 10, 'client/images/product-72.png', 'coca-cola-zero', '1234567890072', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ngọt Coca-Cola Zero, không đường, giải khát tuyệt vời.', 500, 18000, 6, 2),
(74, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Annam Rice', 30000, 5, 'client/images/product-73.png', 'annam-rice', '1234567890073', '2026-12-31 00:00:00', 'Việt Nam', 'kg', 'Gạo Annam, chất lượng cao, phù hợp cho mọi bữa ăn.', 500, 28000, 9, 3),
(75, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Oreo Biscuits', 35000, 10, 'client/images/product-74.png', 'oreo-biscuits', '1234567890074', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Bánh quy Oreo, giòn, ngọt ngào, nhiều hương vị.', 250, 32000, 8, 4),
(76, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nestle Coffee', 150000, 10, 'client/images/product-75.png', 'nestle-coffee', '1234567890075', '2026-12-31 00:00:00', 'Thụy Sĩ', 'g', 'Cà phê Nestle, đậm đà, thức uống lý tưởng cho buổi sáng.', 300, 130000, 6, 5),
(77, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Suntory Fanta', 22000, 5, 'client/images/product-76.png', 'suntory-fanta', '1234567890076', '2026-12-31 00:00:00', 'Nhật Bản', 'l', 'Nước ngọt Fanta Suntory, hương vị thơm ngon, giải khát.', 400, 20000, 6, 6),
(78, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vega Tea', 25000, 5, 'client/images/product-77.png', 'vega-tea', '1234567890077', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Trà xanh Vega, thanh mát, giải nhiệt ngày hè.', 300, 23000, 7, 7),
(79, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Dutch Lady Milk', 45000, 10, 'client/images/product-78.png', 'dutch-lady-milk', '1234567890078', '2026-08-20 00:00:00', 'Hà Lan', 'l', 'Sữa Dutch Lady, bổ dưỡng, thích hợp cho trẻ em.', 250, 42000, 7, 8),
(80, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vissan Sausage', 120000, 5, 'client/images/product-79.png', 'vissan-sausage', '1234567890079', '2026-12-31 00:00:00', 'Việt Nam', 'g', 'Lạp xưởng Vissan, chất lượng cao, thơm ngon.', 300, 110000, 2, 9),
(81, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak Orange Juice', 25000, 5, 'client/images/product-80.png', 'tetra-pak-orange-juice', '1234567890080', '2026-12-31 00:00:00', 'Thụy Điển', 'l', 'Nước ép cam Tetra Pak, tươi ngon và bổ dưỡng.', 350, 23000, 7, 10),
(83, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'M&M\'s Chocolate', 35000, 5, 'client/images/product-81.png', 'mms-chocolate', '9876543210981', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Sô cô la M&M\'s, ngọt ngào, nhiều hương vị.', 300, 32000, 8, 1),
(84, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Coca-Cola Zero', 20000, 10, 'client/images/product-82.png', 'coca-cola-zero', '9876543210982', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ngọt Coca-Cola Zero, không đường, giải khát tuyệt vời.', 500, 18000, 6, 2),
(85, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Cadbury Chocolate', 45000, 10, 'client/images/product-83.png', 'cadbury-chocolate', '9876543210983', '2026-12-31 00:00:00', 'Anh', 'g', 'Sô cô la Cadbury, ngọt ngào và thơm ngon.', 300, 40000, 8, 3),
(86, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Sapporo Beer', 100000, 5, 'client/images/product-84.png', 'sapporo-beer', '9876543210984', '2026-12-31 00:00:00', 'Nhật Bản', 'l', 'Bia Sapporo, thơm ngon, đậm đà.', 200, 95000, 6, 4),
(87, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tropicana Juice', 35000, 5, 'client/images/product-85.png', 'tropicana-juice', '9876543210985', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ép trái cây Tropicana, tươi ngon và bổ dưỡng.', 400, 32000, 7, 5),
(88, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Coca-Cola Original', 20000, 5, 'client/images/product-86.png', 'coca-cola-original', '9876543210986', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ngọt Coca-Cola, hương vị đặc trưng của thương hiệu.', 500, 18000, 6, 6),
(89, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Danone Yogurt', 25000, 5, 'client/images/product-87.png', 'danone-yogurt', '9876543210987', '2026-12-31 00:00:00', 'Pháp', 'kg', 'Sữa chua Danone, mềm mịn và ngon miệng.', 300, 22000, 7, 7),
(90, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Mars Chocolate', 50000, 10, 'client/images/product-88.png', 'mars-chocolate', '9876543210988', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Sô cô la Mars, thơm ngon và bổ dưỡng.', 300, 45000, 8, 8),
(91, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Pepsi Cola', 15000, 10, 'client/images/product-89.png', 'pepsi-cola', '9876543210989', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ngọt Pepsi Cola, thơm ngon, giải khát.', 500, 13000, 6, 9),
(92, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Fanta Orange', 18000, 5, 'client/images/product-90.png', 'fanta-orange', '9876543210990', '2026-12-31 00:00:00', 'USA', 'l', 'Nước ngọt Fanta hương cam, tươi mát và bổ dưỡng.', 500, 16000, 6, 10),
(93, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak Orange Juice', 25000, 5, 'client/images/product-91.png', 'tetra-pak-orange-juice', '9876543210991', '2026-12-31 00:00:00', 'Thụy Điển', 'l', 'Nước ép cam Tetra Pak, tươi ngon và bổ dưỡng.', 350, 23000, 7, 1),
(94, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak Tomato Juice', 35000, 10, 'client/images/product-92.png', 'tetra-pak-tomato-juice', '9876543210992', '2026-12-31 00:00:00', 'Thụy Điển', 'l', 'Nước ép cà chua Tetra Pak, bổ dưỡng và tốt cho sức khỏe.', 400, 32000, 7, 2),
(95, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nestle Milk', 70000, 5, 'client/images/product-93.png', 'nestle-milk', '9876543210993', '2026-12-31 00:00:00', 'Thụy Sĩ', 'l', 'Sữa Nestle, bổ dưỡng cho mọi gia đình.', 300, 67000, 7, 3),
(96, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Vega Rice', 25000, 5, 'client/images/product-94.png', 'vega-rice', '9876543210994', '2026-12-31 00:00:00', 'Việt Nam', 'kg', 'Gạo Vega, chất lượng cao, giá hợp lý.', 400, 23000, 9, 4),
(97, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Coca-Cola Cherry', 30000, 5, 'client/images/product-95.png', 'coca-cola-cherry', '9876543210995', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ngọt Coca-Cola hương cherry, ngon tuyệt vời.', 500, 28000, 6, 5),
(98, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Lays Chips', 25000, 5, 'client/images/product-96.png', 'lays-chips', '9876543210996', '2026-12-31 00:00:00', 'Mỹ', 'g', 'Bánh snack Lays, giòn tan, nhiều hương vị.', 300, 23000, 8, 6),
(99, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Pepsi Max', 22000, 10, 'client/images/product-97.png', 'pepsi-max', '9876543210997', '2026-12-31 00:00:00', 'Mỹ', 'l', 'Nước ngọt Pepsi Max, ít calo, giải khát tuyệt vời.', 400, 20000, 6, 7),
(100, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Red Bull Sugarfree', 30000, 10, 'client/images/product-98.png', 'red-bull-sugarfree', '9876543210998', '2026-12-31 00:00:00', 'Áo', 'l', 'Nước tăng lực Red Bull không đường, giúp tăng cường năng lượng.', 500, 28000, 6, 8),
(101, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nestle Milo', 45000, 5, 'client/images/product-99.png', 'nestle-milo', '9876543210999', '2026-12-31 00:00:00', 'Úc', 'g', 'Sữa Milo Nestle, bổ dưỡng và giàu năng lượng.', 300, 42000, 7, 9),
(102, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Tetra Pak Apple Juice', 30000, 5, 'client/images/product-100.png', 'tetra-pak-apple-juice', '9876543210100', '2026-12-31 00:00:00', 'Thụy Điển', 'l', 'Nước ép táo Tetra Pak, tươi ngon và bổ dưỡng.', 400, 28000, 7, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `productId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product_variant`
--

CREATE TABLE `product_variant` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `variant_name` varchar(255) NOT NULL,
  `price_modifier` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_variant`
--

INSERT INTO `product_variant` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `variant_name`, `price_modifier`, `stock`, `product_id`) VALUES
(31, '2025-06-30 23:05:33.331959', '2025-07-01 23:58:05.524583', NULL, '330ml', 0, 100, 1),
(32, '2025-06-30 23:05:33.331959', '2025-07-01 23:58:35.278357', NULL, '500ml', 500, 50, 1),
(33, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 2),
(34, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 1L', 1000, 70, 2),
(35, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 330ml', 0, 100, 3),
(36, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 3),
(37, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 330ml', 0, 100, 4),
(38, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 4),
(39, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 50000, 100, 5),
(40, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 100000, 50, 5),
(41, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 70000, 150, 6),
(42, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 140000, 100, 6),
(43, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 45000, 200, 7),
(44, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 90000, 150, 7),
(45, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 60000, 180, 8),
(46, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 120000, 120, 8),
(47, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 500g', 30000, 200, 9),
(48, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 1kg', 60000, 150, 9),
(49, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 500g', 20000, 250, 10),
(50, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 1kg', 40000, 150, 10),
(51, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 11),
(52, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 1L', 1000, 70, 11),
(53, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 330ml', 0, 100, 12),
(54, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 12),
(55, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 330ml', 0, 100, 13),
(56, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 13),
(57, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 330ml', 0, 100, 14),
(58, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Loại 500ml', 500, 50, 14),
(59, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 50000, 100, 15),
(60, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 100000, 50, 15),
(61, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 70000, 150, 16),
(62, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 140000, 100, 16),
(63, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 45000, 200, 17),
(64, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 90000, 150, 17),
(65, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '500g', 60000, 180, 18),
(66, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, '1kg', 120000, 120, 18),
(67, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 500g', 30000, 200, 19),
(68, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 1kg', 60000, 150, 19),
(69, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 500g', 20000, 250, 20),
(70, '2025-07-18 10:20:14.000000', '2025-07-18 10:20:14.000000', NULL, 'Gói 1kg', 40000, 150, 20),
(71, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 50000, 100, 25),
(72, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 100000, 50, 25),
(73, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 70000, 150, 26),
(74, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 140000, 100, 26),
(75, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 45000, 200, 27),
(76, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 90000, 150, 27),
(77, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 60000, 180, 28),
(78, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 120000, 120, 28),
(79, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 30000, 200, 29),
(80, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 60000, 150, 29),
(81, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 20000, 250, 30),
(82, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 40000, 150, 30),
(83, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 31),
(84, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 31),
(85, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 32),
(86, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 32),
(87, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 33),
(88, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 33),
(89, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 34),
(90, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 34),
(91, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 35),
(92, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 35),
(93, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 45000, 200, 36),
(94, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 90000, 150, 36),
(95, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 60000, 180, 37),
(96, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 120000, 100, 37),
(97, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 70000, 150, 38),
(98, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 140000, 80, 38),
(99, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 80000, 200, 39),
(100, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 160000, 120, 39),
(101, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 65000, 180, 40),
(102, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 130000, 100, 40),
(103, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 25000, 200, 41),
(104, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 50000, 150, 41),
(105, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 20000, 250, 42),
(106, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 40000, 150, 42),
(107, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 15000, 300, 43),
(108, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 30000, 200, 43),
(109, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 25000, 200, 41),
(110, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 50000, 150, 41),
(111, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 20000, 250, 42),
(112, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 40000, 150, 42),
(113, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 15000, 300, 43),
(114, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 30000, 200, 43),
(115, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 18000, 250, 44),
(116, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 36000, 200, 44),
(117, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 45),
(118, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 45),
(119, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 46),
(120, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 46),
(121, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 47),
(122, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 47),
(123, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 48),
(124, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 48),
(125, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 45000, 200, 49),
(126, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 90000, 150, 49),
(127, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 70000, 150, 50),
(128, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 140000, 100, 50),
(129, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 50000, 200, 51),
(130, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 100000, 150, 51),
(131, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 60000, 180, 52),
(132, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 120000, 120, 52),
(133, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '500g', 65000, 180, 53),
(134, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, '1kg', 130000, 100, 53),
(135, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 500g', 18000, 250, 54),
(136, '2025-07-31 18:20:14.000000', '2025-07-31 18:20:14.000000', NULL, 'Gói 1kg', 36000, 200, 54),
(137, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 55),
(138, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 55),
(139, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 56),
(140, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 56),
(141, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 57),
(142, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 57),
(143, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 58),
(144, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 58),
(145, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 0, 100, 59),
(146, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 500, 50, 59),
(147, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '500g', 60000, 150, 60),
(148, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '1kg', 120000, 100, 60),
(149, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '500g', 55000, 200, 61),
(150, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '1kg', 110000, 150, 61),
(151, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '500g', 70000, 180, 62),
(152, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '1kg', 140000, 120, 62),
(153, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '500g', 75000, 150, 63),
(154, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '1kg', 150000, 100, 63),
(155, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '500g', 85000, 120, 64),
(156, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, '1kg', 170000, 80, 64),
(157, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Gói 500g', 20000, 250, 65),
(158, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Gói 1kg', 40000, 150, 65),
(159, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200ml', 8000, 150, 66),
(160, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 10000, 100, 66),
(161, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 30000, 50, 66),
(162, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200ml', 9000, 150, 67),
(163, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 300ml', 13000, 120, 67),
(164, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 35000, 70, 67),
(165, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 12000, 180, 68),
(166, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 25000, 150, 68),
(167, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2L', 50000, 50, 68),
(168, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 8000, 100, 69),
(169, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 15000, 70, 69),
(170, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2L', 30000, 50, 69),
(171, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 9000, 150, 70),
(172, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 18000, 120, 70),
(173, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 35000, 80, 70),
(177, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 40000, 250, 71),
(178, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 100000, 150, 71),
(179, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1.5kg', 300000, 50, 71),
(180, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 100g', 35000, 200, 72),
(181, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 70000, 150, 72),
(182, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 20000, 300, 73),
(183, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 40000, 150, 73),
(184, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 15000, 500, 74),
(185, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1kg', 30000, 300, 74),
(186, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2kg', 60000, 100, 74),
(187, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 150g', 25000, 250, 75),
(188, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 300g', 50000, 150, 75),
(189, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 150000, 250, 76),
(190, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 300000, 150, 76),
(191, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1kg', 600000, 80, 76),
(192, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 22000, 400, 77),
(193, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 40000, 200, 77),
(194, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 25000, 300, 78),
(195, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 50000, 250, 78),
(196, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 15000, 250, 79),
(197, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 60000, 200, 79),
(198, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 60000, 300, 80),
(199, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 150000, 200, 80),
(200, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200ml', 25000, 350, 81),
(201, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 50000, 250, 81),
(202, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 100000, 150, 81),
(203, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 20000, 300, 84),
(204, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 40000, 250, 84),
(205, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 80000, 150, 84),
(206, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 100g', 25000, 200, 85),
(207, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 50000, 150, 85),
(208, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 120000, 100, 85),
(209, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 100000, 150, 86),
(210, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 150000, 100, 86),
(211, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 250000, 50, 86),
(212, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 15000, 250, 87),
(213, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 25000, 200, 87),
(214, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 50000, 150, 87),
(215, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 18000, 300, 88),
(216, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 35000, 250, 88),
(217, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 70000, 150, 88),
(218, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 100g', 12000, 300, 89),
(219, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 25000, 250, 89),
(220, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 50000, 150, 89),
(221, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 100g', 30000, 250, 90),
(222, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 60000, 150, 90),
(223, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 120000, 100, 90),
(224, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 15000, 300, 91),
(225, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 30000, 250, 91),
(226, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2L', 60000, 150, 91),
(227, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 18000, 400, 92),
(228, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 35000, 300, 92),
(229, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2L', 70000, 200, 92),
(230, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 18000, 400, 92),
(231, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 35000, 300, 92),
(232, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2L', 70000, 200, 92),
(233, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 25000, 300, 93),
(234, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 45000, 250, 93),
(235, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 70000, 200, 93),
(236, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 22000, 350, 94),
(237, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 42000, 250, 94),
(238, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 2L', 85000, 100, 94),
(239, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 20000, 300, 95),
(240, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 35000, 250, 95),
(241, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1kg', 60000, 150, 95),
(242, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 15000, 300, 96),
(243, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 30000, 200, 96),
(244, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 50000, 100, 96),
(245, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 330ml', 20000, 350, 97),
(246, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 35000, 300, 97),
(247, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 70000, 150, 97),
(248, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 15000, 400, 98),
(249, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 30000, 250, 98),
(250, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1kg', 50000, 100, 98),
(251, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 250ml', 20000, 350, 99),
(252, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500ml', 40000, 300, 99),
(253, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1L', 70000, 150, 99),
(254, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 200g', 18000, 400, 100),
(255, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 500g', 35000, 250, 100),
(256, '2025-08-01 18:20:14.000000', '2025-08-01 18:20:14.000000', NULL, 'Loại 1kg', 55000, 100, 100);

-- --------------------------------------------------------

--
-- Table structure for table `rating`
--

CREATE TABLE `rating` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `comment` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rating`
--

INSERT INTO `rating` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `comment`, `rating`, `user_id`, `product_id`) VALUES
(4, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'Rau củ tươi ngon, rất thích hợp để chế biến món ăn.', 5, 1, 1),
(5, '2025-08-20 12:05:00.000000', '2025-08-20 12:05:00.000000', NULL, 'Sản phẩm khá tươi, nhưng có vẻ hơi đắt.', 3, 2, 1),
(6, '2025-08-20 12:10:00.000000', '2025-08-20 12:10:00.000000', NULL, 'Rau không được tươi lắm, tôi khá thất vọng.', 2, 3, 1),
(10, '2025-08-20 12:30:00.000000', '2025-08-20 12:30:00.000000', NULL, 'Thịt bò ngon, mềm và rất tươi.', 5, 1, 2),
(11, '2025-08-20 12:35:00.000000', '2025-08-20 12:35:00.000000', NULL, 'Thịt hơi dai, nhưng chất lượng khá ổn.', 3, 2, 2),
(12, '2025-08-20 12:40:00.000000', '2025-08-20 12:40:00.000000', NULL, 'Giá cao hơn mong đợi, nhưng vẫn chấp nhận được.', 4, 3, 2),
(13, '2025-08-20 12:45:00.000000', '2025-08-20 12:45:00.000000', NULL, 'Thịt rất ngon và tươi, tôi rất hài lòng.', 5, 4, 2),
(14, '2025-08-20 12:50:00.000000', '2025-08-20 12:50:00.000000', NULL, 'Thịt có mùi hơi lạ, nhưng chấp nhận được.', 2, 5, 2),
(15, '2025-08-20 13:00:00.000000', '2025-08-20 13:00:00.000000', NULL, 'Xúc xích rất ngon, dễ dàng chế biến cho bữa sáng.', 5, 1, 3),
(16, '2025-08-20 13:05:00.000000', '2025-08-20 13:05:00.000000', NULL, 'Mùi vị ổn, nhưng hơi nhiều gia vị.', 3, 2, 3),
(17, '2025-08-20 13:10:00.000000', '2025-08-20 13:10:00.000000', NULL, 'Xúc xích không tươi, hơi khô một chút.', 2, 3, 3),
(18, '2025-08-20 13:15:00.000000', '2025-08-20 13:15:00.000000', NULL, 'Ngon, đặc biệt là khi ăn với bánh mì.', 5, 4, 3),
(19, '2025-08-20 13:20:00.000000', '2025-08-20 13:20:00.000000', NULL, 'Chất lượng khá tốt, nhưng giá cao.', 4, 5, 3),
(20, '2025-08-20 13:25:00.000000', '2025-08-20 13:25:00.000000', NULL, 'Giò chả rất ngon, chất lượng cao, thích hợp cho bữa cơm gia đình.', 5, 1, 4),
(21, '2025-08-20 13:30:00.000000', '2025-08-20 13:30:00.000000', NULL, 'Giò chả khá ngọt, không hợp khẩu vị của tôi.', 3, 2, 4),
(22, '2025-08-20 13:35:00.000000', '2025-08-20 13:35:00.000000', NULL, 'Giò chả tươi ngon, tôi rất thích.', 5, 3, 4),
(23, '2025-08-20 13:40:00.000000', '2025-08-20 13:40:00.000000', NULL, 'Giò chả hơi mặn, nhưng vẫn có thể chấp nhận được.', 4, 4, 4),
(24, '2025-08-20 13:45:00.000000', '2025-08-20 13:45:00.000000', NULL, 'Chất lượng tuyệt vời, sẽ mua lại.', 5, 5, 4),
(25, '2025-08-20 13:50:00.000000', '2025-08-20 13:50:00.000000', NULL, 'Bánh mì mềm mịn, rất thích hợp cho bữa sáng.', 5, 1, 5),
(26, '2025-08-20 13:55:00.000000', '2025-08-20 13:55:00.000000', NULL, 'Bánh mì hơi khô, không mềm như tôi mong đợi.', 2, 2, 5),
(27, '2025-08-20 14:00:00.000000', '2025-08-20 14:00:00.000000', NULL, 'Chất lượng ổn, nhưng tôi thích loại khác hơn.', 3, 3, 5),
(28, '2025-08-20 14:05:00.000000', '2025-08-20 14:05:00.000000', NULL, 'Bánh mì ngon, ăn sáng rất hợp.', 5, 4, 5),
(29, '2025-08-20 14:10:00.000000', '2025-08-20 14:10:00.000000', NULL, 'Bánh mì ngon nhưng giá hơi cao.', 4, 5, 5),
(30, '2025-08-20 14:15:00.000000', '2025-08-20 14:15:00.000000', NULL, 'Phô mai rất thơm, dễ chế biến, tôi rất thích.', 5, 1, 6),
(31, '2025-08-20 14:20:00.000000', '2025-08-20 14:20:00.000000', NULL, 'Phô mai hơi dai, không phù hợp với khẩu vị của tôi.', 2, 2, 6),
(32, '2025-08-20 14:25:00.000000', '2025-08-20 14:25:00.000000', NULL, 'Phô mai khá ngon, nhưng giá hơi cao.', 3, 3, 6),
(33, '2025-08-20 14:30:00.000000', '2025-08-20 14:30:00.000000', NULL, 'Phô mai rất tươi và béo, ăn rất ngon.', 5, 4, 6),
(34, '2025-08-20 14:35:00.000000', '2025-08-20 14:35:00.000000', NULL, 'Phô mai rất tốt, sẽ tiếp tục mua.', 5, 5, 6),
(39, '2025-08-20 14:40:00.000000', '2025-08-20 14:40:00.000000', NULL, 'Sữa tươi rất ngon, uống vào cảm giác tươi mát.', 5, 1, 7),
(40, '2025-08-20 14:45:00.000000', '2025-08-20 14:45:00.000000', NULL, 'Sữa hơi ngọt, nhưng vẫn chấp nhận được.', 4, 2, 7),
(41, '2025-08-20 14:50:00.000000', '2025-08-20 14:50:00.000000', NULL, 'Sữa có mùi hơi lạ, nhưng khá ngon.', 3, 3, 7),
(42, '2025-08-20 14:55:00.000000', '2025-08-20 14:55:00.000000', NULL, 'Sữa tươi chất lượng cao, rất phù hợp cho trẻ nhỏ.', 5, 4, 7),
(43, '2025-08-20 15:00:00.000000', '2025-08-20 15:00:00.000000', NULL, 'Sữa ngon, nhưng giá hơi cao.', 4, 5, 7),
(44, '2025-08-20 16:00:00.000000', '2025-08-20 16:00:00.000000', NULL, 'Bánh ngọt rất ngon, giòn và thơm.', 5, 1, 8),
(45, '2025-08-20 16:05:00.000000', '2025-08-20 16:05:00.000000', NULL, 'Bánh hơi ngọt, nhưng vẫn rất ngon.', 4, 2, 8),
(46, '2025-08-20 16:10:00.000000', '2025-08-20 16:10:00.000000', NULL, 'Bánh không quá ngọt, giòn và dễ ăn.', 3, 3, 8),
(47, '2025-08-20 16:15:00.000000', '2025-08-20 16:15:00.000000', NULL, 'Bánh rất ngon, nhưng giá hơi cao.', 4, 4, 8),
(48, '2025-08-20 16:20:00.000000', '2025-08-20 16:20:00.000000', NULL, 'Bánh rất ngọt, thích hợp cho những ai thích ngọt.', 5, 5, 8),
(49, '2025-08-20 16:25:00.000000', '2025-08-20 16:25:00.000000', NULL, 'Kẹo dẻo ngon, nhiều hương vị hấp dẫn.', 5, 1, 9),
(50, '2025-08-20 16:30:00.000000', '2025-08-20 16:30:00.000000', NULL, 'Kẹo quá ngọt và hơi dai.', 3, 2, 9),
(51, '2025-08-20 16:35:00.000000', '2025-08-20 16:35:00.000000', NULL, 'Kẹo dẻo rất ngon, nhưng hơi ngọt.', 4, 3, 9),
(52, '2025-08-20 16:40:00.000000', '2025-08-20 16:40:00.000000', NULL, 'Kẹo quá ngọt và không tươi.', 2, 4, 9),
(53, '2025-08-20 16:45:00.000000', '2025-08-20 16:45:00.000000', NULL, 'Kẹo dẻo tuyệt vời, ngọt ngào và giòn.', 5, 5, 9),
(54, '2025-08-20 16:50:00.000000', '2025-08-20 16:50:00.000000', NULL, 'Cà phê hòa tan rất thơm và dễ pha chế.', 5, 1, 10),
(55, '2025-08-20 16:55:00.000000', '2025-08-20 16:55:00.000000', NULL, 'Cà phê đắng quá, không hợp khẩu vị của tôi.', 3, 2, 10),
(56, '2025-08-20 17:00:00.000000', '2025-08-20 17:00:00.000000', NULL, 'Cà phê rất đậm đà, phù hợp với tôi.', 4, 3, 10),
(57, '2025-08-20 17:05:00.000000', '2025-08-20 17:05:00.000000', NULL, 'Cà phê hòa tan không tươi, có vị hơi lạ.', 2, 4, 10),
(58, '2025-08-20 17:10:00.000000', '2025-08-20 17:10:00.000000', NULL, 'Cà phê này rất ngon, tôi sẽ mua lại.', 5, 5, 10),
(59, '2025-08-20 17:15:00.000000', '2025-08-20 17:15:00.000000', NULL, 'Sữa đặc có đường rất ngon, thích hợp pha chế các món.', 5, 1, 11),
(60, '2025-08-20 17:20:00.000000', '2025-08-20 17:20:00.000000', NULL, 'Sữa đặc ngọt ngào, nhưng hơi ngấy.', 3, 2, 11),
(61, '2025-08-20 17:25:00.000000', '2025-08-20 17:25:00.000000', NULL, 'Chất lượng sữa ổn, nhưng tôi không thích vị ngọt quá.', 4, 3, 11),
(62, '2025-08-20 17:30:00.000000', '2025-08-20 17:30:00.000000', NULL, 'Tốt cho các món pha chế, ngọt vừa phải.', 5, 4, 11),
(63, '2025-08-20 17:35:00.000000', '2025-08-20 17:35:00.000000', NULL, 'Sữa đặc ngon, nhưng giá hơi cao.', 4, 5, 11),
(64, '2025-08-20 17:40:00.000000', '2025-08-20 17:40:00.000000', NULL, 'Nước ép cam rất tươi và ngon, tôi rất thích.', 5, 1, 12),
(65, '2025-08-20 17:45:00.000000', '2025-08-20 17:45:00.000000', NULL, 'Nước ép có vị chua quá, không hợp khẩu vị của tôi.', 2, 2, 12),
(66, '2025-08-20 17:50:00.000000', '2025-08-20 17:50:00.000000', NULL, 'Nước cam khá ngọt, uống rất dễ chịu.', 4, 3, 12),
(67, '2025-08-20 17:55:00.000000', '2025-08-20 17:55:00.000000', NULL, 'Cam rất ngọt, nhưng tôi không thích hương vị nhân tạo.', 3, 4, 12),
(68, '2025-08-20 18:00:00.000000', '2025-08-20 18:00:00.000000', NULL, 'Nước ép cam tuyệt vời, tươi ngon và bổ dưỡng.', 5, 5, 12),
(69, '2025-08-20 18:05:00.000000', '2025-08-20 18:05:00.000000', NULL, 'Nước ép cam rất tươi và ngon, tôi rất thích.', 5, 1, 12),
(70, '2025-08-20 18:10:00.000000', '2025-08-20 18:10:00.000000', NULL, 'Nước ép có vị chua quá, không hợp khẩu vị của tôi.', 2, 2, 12),
(71, '2025-08-20 18:15:00.000000', '2025-08-20 18:15:00.000000', NULL, 'Nước cam khá ngọt, uống rất dễ chịu.', 4, 3, 12),
(72, '2025-08-20 18:20:00.000000', '2025-08-20 18:20:00.000000', NULL, 'Cam rất ngọt, nhưng tôi không thích hương vị nhân tạo.', 3, 4, 12),
(73, '2025-08-20 18:25:00.000000', '2025-08-20 18:25:00.000000', NULL, 'Nước ép cam tuyệt vời, tươi ngon và bổ dưỡng.', 5, 5, 12),
(74, '2025-08-20 18:30:00.000000', '2025-08-20 18:30:00.000000', NULL, 'Gạo rất thơm, chất lượng tốt.', 5, 1, 13),
(75, '2025-08-20 18:35:00.000000', '2025-08-20 18:35:00.000000', NULL, 'Gạo có mùi hơi khó chịu, không tươi.', 2, 2, 13),
(76, '2025-08-20 18:40:00.000000', '2025-08-20 18:40:00.000000', NULL, 'Chất lượng gạo khá tốt, nhưng giá hơi cao.', 3, 3, 13),
(77, '2025-08-20 18:45:00.000000', '2025-08-20 18:45:00.000000', NULL, 'Gạo rất tươi, tôi sẽ tiếp tục mua.', 5, 4, 13),
(78, '2025-08-20 18:50:00.000000', '2025-08-20 18:50:00.000000', NULL, 'Gạo ngon, phù hợp cho bữa cơm gia đình.', 4, 5, 13),
(79, '2025-08-20 18:55:00.000000', '2025-08-20 18:55:00.000000', NULL, 'Bánh quy ngon, giòn và ngọt ngào.', 5, 1, 14),
(80, '2025-08-20 19:00:00.000000', '2025-08-20 19:00:00.000000', NULL, 'Bánh hơi ngọt, nhưng vẫn rất ngon.', 4, 2, 14),
(81, '2025-08-20 19:05:00.000000', '2025-08-20 19:05:00.000000', NULL, 'Bánh quy giòn, nhưng tôi thích loại khác hơn.', 3, 3, 14),
(82, '2025-08-20 19:10:00.000000', '2025-08-20 19:10:00.000000', NULL, 'Bánh quy rất ngon, ăn rất thích.', 5, 4, 14),
(83, '2025-08-20 19:15:00.000000', '2025-08-20 19:15:00.000000', NULL, 'Bánh hơi ngọt, nhưng vẫn ngon miệng.', 4, 5, 14),
(84, '2025-08-20 19:20:00.000000', '2025-08-20 19:20:00.000000', NULL, 'Cà phê hòa tan rất ngon, dễ pha chế và thơm.', 5, 1, 15),
(85, '2025-08-20 19:25:00.000000', '2025-08-20 19:25:00.000000', NULL, 'Cà phê có vị hơi đắng, nhưng tôi thích.', 4, 2, 15),
(86, '2025-08-20 19:30:00.000000', '2025-08-20 19:30:00.000000', NULL, 'Cà phê rất đậm đà, phù hợp với tôi.', 5, 3, 15),
(87, '2025-08-20 19:35:00.000000', '2025-08-20 19:35:00.000000', NULL, 'Cà phê không tươi, có vị hơi lạ.', 2, 4, 15),
(88, '2025-08-20 19:40:00.000000', '2025-08-20 19:40:00.000000', NULL, 'Cà phê hòa tan này rất thơm và dễ uống.', 5, 5, 15),
(89, '2025-08-20 19:45:00.000000', '2025-08-20 19:45:00.000000', NULL, 'Bánh mì sandwich mềm mịn, ngon miệng.', 5, 1, 16),
(90, '2025-08-20 19:50:00.000000', '2025-08-20 19:50:00.000000', NULL, 'Bánh mì hơi khô, nhưng vẫn ăn được.', 3, 2, 16),
(91, '2025-08-20 19:55:00.000000', '2025-08-20 19:55:00.000000', NULL, 'Bánh mì ngon, phù hợp cho bữa sáng.', 4, 3, 16),
(92, '2025-08-20 20:00:00.000000', '2025-08-20 20:00:00.000000', NULL, 'Bánh mì hơi cứng, không thật sự thích hợp.', 2, 4, 16),
(93, '2025-08-20 20:05:00.000000', '2025-08-20 20:05:00.000000', NULL, 'Bánh mì sandwich rất ngon, mềm và dễ ăn.', 5, 5, 16),
(94, '2025-08-20 20:10:00.000000', '2025-08-20 20:10:00.000000', NULL, 'Phô mai mozzarella thơm ngon, dễ chế biến.', 5, 1, 17),
(95, '2025-08-20 20:15:00.000000', '2025-08-20 20:15:00.000000', NULL, 'Phô mai hơi mặn, nhưng vẫn ổn.', 4, 2, 17),
(96, '2025-08-20 20:20:00.000000', '2025-08-20 20:20:00.000000', NULL, 'Phô mai ngon, dễ chế biến, phù hợp với món ăn.', 5, 3, 17),
(97, '2025-08-20 20:25:00.000000', '2025-08-20 20:25:00.000000', NULL, 'Phô mai không tươi, có mùi lạ.', 2, 4, 17),
(98, '2025-08-20 20:30:00.000000', '2025-08-20 20:30:00.000000', NULL, 'Phô mai mozzarella rất ngon, tôi sẽ mua lại.', 5, 5, 17),
(99, '2025-08-20 22:00:00.000000', '2025-08-20 22:00:00.000000', NULL, 'Trà Vega rất thơm, dễ uống.', 5, 1, 18),
(100, '2025-08-20 22:05:00.000000', '2025-08-20 22:05:00.000000', NULL, 'Trà hơi ngọt, nhưng ngon miệng.', 4, 2, 18),
(101, '2025-08-20 22:10:00.000000', '2025-08-20 22:10:00.000000', NULL, 'Trà không đủ đậm, cảm giác hơi nhạt.', 3, 3, 18),
(102, '2025-08-20 22:15:00.000000', '2025-08-20 22:15:00.000000', NULL, 'Trà rất ngon, giúp giải nhiệt ngày hè.', 5, 4, 18),
(103, '2025-08-20 22:20:00.000000', '2025-08-20 22:20:00.000000', NULL, 'Trà thơm, nhưng tôi thích hương vị đậm hơn.', 4, 5, 18),
(104, '2025-08-20 22:25:00.000000', '2025-08-20 22:25:00.000000', NULL, 'Sữa rất bổ dưỡng, rất thích hợp cho trẻ em.', 5, 1, 19),
(105, '2025-08-20 22:30:00.000000', '2025-08-20 22:30:00.000000', NULL, 'Sữa có vị hơi ngọt, nhưng vẫn ngon.', 4, 2, 19),
(106, '2025-08-20 22:35:00.000000', '2025-08-20 22:35:00.000000', NULL, 'Sữa rất tốt, nhưng tôi cảm thấy hơi ngấy.', 3, 3, 19),
(107, '2025-08-20 22:40:00.000000', '2025-08-20 22:40:00.000000', NULL, 'Sữa có vị tươi và dễ uống.', 5, 4, 19),
(108, '2025-08-20 22:45:00.000000', '2025-08-20 22:45:00.000000', NULL, 'Sữa bổ dưỡng, nhưng hơi ngọt đối với tôi.', 4, 5, 19),
(109, '2025-08-20 22:50:00.000000', '2025-08-20 22:50:00.000000', NULL, 'Lạp xưởng Vissan rất thơm và ngon.', 5, 1, 20),
(110, '2025-08-20 22:55:00.000000', '2025-08-20 22:55:00.000000', NULL, 'Lạp xưởng rất ngon, nhưng tôi thấy hơi mặn.', 4, 2, 20),
(111, '2025-08-20 23:00:00.000000', '2025-08-20 23:00:00.000000', NULL, 'Lạp xưởng Vissan quá ngấy, không thích hợp với tôi.', 2, 3, 20),
(112, '2025-08-20 23:05:00.000000', '2025-08-20 23:05:00.000000', NULL, 'Lạp xưởng rất ngon, tôi sẽ mua lại.', 5, 4, 20),
(113, '2025-08-20 23:10:00.000000', '2025-08-20 23:10:00.000000', NULL, 'Lạp xưởng vừa ngon vừa dễ ăn, rất thích.', 4, 5, 20),
(114, '2025-08-20 23:15:00.000000', '2025-08-20 23:15:00.000000', NULL, 'Nước ép cam rất tươi và ngon.', 5, 1, 21),
(115, '2025-08-20 23:20:00.000000', '2025-08-20 23:20:00.000000', NULL, 'Nước cam khá ngọt, nhưng không có gì đặc biệt.', 3, 2, 21),
(116, '2025-08-20 23:25:00.000000', '2025-08-20 23:25:00.000000', NULL, 'Nước ép cam rất ngon, tươi mát.', 5, 3, 21),
(117, '2025-08-20 23:30:00.000000', '2025-08-20 23:30:00.000000', NULL, 'Nước cam quá ngọt, tôi không thích.', 2, 4, 21),
(118, '2025-08-20 23:35:00.000000', '2025-08-20 23:35:00.000000', NULL, 'Nước cam tuyệt vời, tươi ngon và bổ dưỡng.', 5, 5, 21),
(119, '2025-08-20 23:40:00.000000', '2025-08-20 23:40:00.000000', NULL, 'Sô cô la Mars rất ngon, ngọt ngào.', 5, 1, 22),
(120, '2025-08-20 23:45:00.000000', '2025-08-20 23:45:00.000000', NULL, 'Sô cô la rất ngọt, tôi không thích vị này.', 3, 2, 22),
(121, '2025-08-20 23:50:00.000000', '2025-08-20 23:50:00.000000', NULL, 'Sô cô la Mars tuyệt vời, tôi rất thích.', 5, 3, 22),
(122, '2025-08-20 23:55:00.000000', '2025-08-20 23:55:00.000000', NULL, 'Sô cô la ngon nhưng quá ngọt với tôi.', 4, 4, 22),
(123, '2025-08-21 00:00:00.000000', '2025-08-21 00:00:00.000000', NULL, 'Sô cô la rất thơm và ngon, chắc chắn sẽ mua lại.', 5, 5, 22),
(124, '2025-08-21 00:05:00.000000', '2025-08-21 00:05:00.000000', NULL, 'Milo rất ngon, bổ dưỡng và dễ uống.', 5, 1, 23),
(125, '2025-08-21 00:10:00.000000', '2025-08-21 00:10:00.000000', NULL, 'Milo có vị ngọt, rất thích hợp cho trẻ em.', 4, 2, 23),
(126, '2025-08-21 00:15:00.000000', '2025-08-21 00:15:00.000000', NULL, 'Milo rất ngon, nhưng tôi thích loại khác hơn.', 3, 3, 23),
(127, '2025-08-21 00:20:00.000000', '2025-08-21 00:20:00.000000', NULL, 'Milo ngon, nhưng hơi ngọt với tôi.', 4, 4, 23),
(128, '2025-08-21 00:25:00.000000', '2025-08-21 00:25:00.000000', NULL, 'Milo rất bổ dưỡng, tôi sẽ mua lại.', 5, 5, 23),
(129, '2025-08-21 00:30:00.000000', '2025-08-21 00:30:00.000000', NULL, 'Bánh Lays rất giòn, hương vị tuyệt vời.', 5, 1, 24),
(130, '2025-08-21 00:35:00.000000', '2025-08-21 00:35:00.000000', NULL, 'Bánh hơi mặn, nhưng vẫn ngon.', 4, 2, 24),
(131, '2025-08-21 00:40:00.000000', '2025-08-21 00:40:00.000000', NULL, 'Bánh Lays ngon, nhưng hơi ngấy.', 3, 3, 24),
(132, '2025-08-21 00:45:00.000000', '2025-08-21 00:45:00.000000', NULL, 'Bánh giòn, nhưng không đủ hương vị.', 2, 4, 24),
(133, '2025-08-21 00:50:00.000000', '2025-08-21 00:50:00.000000', NULL, 'Bánh Lays rất ngon, tôi sẽ mua lại.', 5, 5, 24),
(134, '2025-08-21 00:55:00.000000', '2025-08-21 00:55:00.000000', NULL, 'Pepsi Max rất ngon, ít calo, giải khát tuyệt vời.', 5, 1, 25),
(135, '2025-08-21 01:00:00.000000', '2025-08-21 01:00:00.000000', NULL, 'Pepsi Max khá ngon, nhưng tôi thích Pepsi thường hơn.', 4, 2, 25),
(136, '2025-08-21 01:05:00.000000', '2025-08-21 01:05:00.000000', NULL, 'Nước ngọt ngon nhưng hơi ngọt.', 3, 3, 25),
(137, '2025-08-21 01:10:00.000000', '2025-08-21 01:10:00.000000', NULL, 'Pepsi Max không phải là sở thích của tôi, quá ngọt.', 2, 4, 25),
(138, '2025-08-21 01:15:00.000000', '2025-08-21 01:15:00.000000', NULL, 'Pepsi Max là một lựa chọn tuyệt vời cho những ai giảm cân.', 5, 5, 25),
(139, '2025-08-21 01:20:00.000000', '2025-08-21 01:20:00.000000', NULL, 'Red Bull Sugarfree rất ngon, giúp tăng cường năng lượng.', 5, 1, 26),
(140, '2025-08-21 01:25:00.000000', '2025-08-21 01:25:00.000000', NULL, 'Red Bull rất mạnh, giúp tôi tỉnh táo.', 4, 2, 26),
(141, '2025-08-21 01:30:00.000000', '2025-08-21 01:30:00.000000', NULL, 'Red Bull có vị hơi nồng, nhưng khá hiệu quả.', 3, 3, 26),
(142, '2025-08-21 01:35:00.000000', '2025-08-21 01:35:00.000000', NULL, 'Red Bull quá ngọt, tôi không thích.', 2, 4, 26),
(143, '2025-08-21 01:40:00.000000', '2025-08-21 01:40:00.000000', NULL, 'Red Bull Sugarfree giúp tôi tỉnh táo, nhưng tôi thích loại khác hơn.', 4, 5, 26),
(144, '2025-08-21 01:45:00.000000', '2025-08-21 01:45:00.000000', NULL, 'Milo rất ngon, bổ dưỡng và giàu năng lượng.', 5, 1, 27),
(145, '2025-08-21 01:50:00.000000', '2025-08-21 01:50:00.000000', NULL, 'Milo có vị ngọt, rất thích hợp cho trẻ em.', 4, 2, 27),
(146, '2025-08-21 01:55:00.000000', '2025-08-21 01:55:00.000000', NULL, 'Milo rất ngon, nhưng tôi thích loại khác hơn.', 3, 3, 27),
(147, '2025-08-21 02:00:00.000000', '2025-08-21 02:00:00.000000', NULL, 'Milo ngon, nhưng hơi ngọt với tôi.', 4, 4, 27),
(148, '2025-08-21 02:05:00.000000', '2025-08-21 02:05:00.000000', NULL, 'Milo rất bổ dưỡng, tôi sẽ mua lại.', 5, 5, 27),
(149, '2025-08-21 02:10:00.000000', '2025-08-21 02:10:00.000000', NULL, 'Nước ép táo rất ngon và tươi mát.', 5, 1, 28),
(150, '2025-08-21 02:15:00.000000', '2025-08-21 02:15:00.000000', NULL, 'Nước ép táo có vị hơi chua, không hợp khẩu vị của tôi.', 2, 2, 28),
(151, '2025-08-21 02:20:00.000000', '2025-08-21 02:20:00.000000', NULL, 'Nước ép táo khá ngọt, uống rất dễ chịu.', 4, 3, 28),
(152, '2025-08-21 02:25:00.000000', '2025-08-21 02:25:00.000000', NULL, 'Nước táo ngọt quá, tôi không thích.', 3, 4, 28),
(153, '2025-08-21 02:30:00.000000', '2025-08-21 02:30:00.000000', NULL, 'Nước ép táo tuyệt vời, tôi sẽ mua lại.', 5, 5, 28),
(154, '2025-08-21 10:00:00.000000', '2025-08-21 10:00:00.000000', NULL, 'Nước cam rất ngon, tươi mát.', 5, 1, 30),
(155, '2025-08-21 10:05:00.000000', '2025-08-21 10:05:00.000000', NULL, 'Nước cam ngọt, nhưng hơi chua đối với tôi.', 4, 2, 30),
(156, '2025-08-21 10:10:00.000000', '2025-08-21 10:10:00.000000', NULL, 'Nước cam quá ngọt, không thích hợp cho tôi.', 3, 3, 30),
(157, '2025-08-21 10:15:00.000000', '2025-08-21 10:15:00.000000', NULL, 'Nước cam rất tươi, tôi sẽ tiếp tục mua.', 5, 4, 30),
(158, '2025-08-21 10:20:00.000000', '2025-08-21 10:20:00.000000', NULL, 'Nước cam tươi ngon, nhưng hơi ngọt.', 4, 5, 30),
(159, '2025-08-21 10:25:00.000000', '2025-08-21 10:25:00.000000', NULL, 'Coca-Cola Zero rất ngon, giải khát tuyệt vời.', 5, 1, 31),
(160, '2025-08-21 10:30:00.000000', '2025-08-21 10:30:00.000000', NULL, 'Coca-Cola Zero khá ngọt, nhưng vẫn chấp nhận được.', 4, 2, 31),
(161, '2025-08-21 10:35:00.000000', '2025-08-21 10:35:00.000000', NULL, 'Nước ngọt khá ngon, nhưng hơi ngọt với tôi.', 3, 3, 31),
(162, '2025-08-21 10:40:00.000000', '2025-08-21 10:40:00.000000', NULL, 'Coca-Cola Zero giúp tôi giải khát, nhưng không phải là lựa chọn tốt nhất.', 2, 4, 31),
(163, '2025-08-21 10:45:00.000000', '2025-08-21 10:45:00.000000', NULL, 'Coca-Cola Zero rất tươi mát, tôi rất thích.', 5, 5, 31),
(164, '2025-08-21 10:50:00.000000', '2025-08-21 10:50:00.000000', NULL, 'Sô cô la Mars rất ngon, ngọt ngào.', 5, 1, 32),
(165, '2025-08-21 10:55:00.000000', '2025-08-21 10:55:00.000000', NULL, 'Sô cô la khá ngọt, nhưng tôi thích.', 4, 2, 32),
(166, '2025-08-21 11:00:00.000000', '2025-08-21 11:00:00.000000', NULL, 'Sô cô la Mars quá ngọt, nhưng vẫn ngon.', 3, 3, 32),
(167, '2025-08-21 11:05:00.000000', '2025-08-21 11:05:00.000000', NULL, 'Sô cô la rất ngon, nhưng hơi ngọt với tôi.', 4, 4, 32),
(168, '2025-08-21 11:10:00.000000', '2025-08-21 11:10:00.000000', NULL, 'Sô cô la Mars tuyệt vời, tôi sẽ mua lại.', 5, 5, 32),
(169, '2025-08-21 11:15:00.000000', '2025-08-21 11:15:00.000000', NULL, 'Gạo Vega rất thơm, chất lượng tuyệt vời.', 5, 1, 33),
(170, '2025-08-21 11:20:00.000000', '2025-08-21 11:20:00.000000', NULL, 'Gạo có mùi hơi khó chịu, nhưng khá ngon.', 4, 2, 33),
(171, '2025-08-21 11:25:00.000000', '2025-08-21 11:25:00.000000', NULL, 'Gạo khá ngon, nhưng giá hơi cao.', 3, 3, 33),
(172, '2025-08-21 11:30:00.000000', '2025-08-21 11:30:00.000000', NULL, 'Gạo Vega khá ngon, nhưng vẫn có thể cải thiện.', 4, 4, 33),
(173, '2025-08-21 11:35:00.000000', '2025-08-21 11:35:00.000000', NULL, 'Gạo rất ngon, tôi sẽ mua lại.', 5, 5, 33),
(174, '2025-08-21 11:40:00.000000', '2025-08-21 11:40:00.000000', NULL, 'Fanta Orange rất ngon, giải khát tuyệt vời.', 5, 1, 34),
(175, '2025-08-21 11:45:00.000000', '2025-08-21 11:45:00.000000', NULL, 'Fanta quá ngọt, tôi không thích.', 2, 2, 34),
(176, '2025-08-21 11:50:00.000000', '2025-08-21 11:50:00.000000', NULL, 'Fanta hương cam rất mát, nhưng có vị hơi ngọt.', 4, 3, 34),
(177, '2025-08-21 11:55:00.000000', '2025-08-21 11:55:00.000000', NULL, 'Fanta quá ngọt, không phải là lựa chọn của tôi.', 2, 4, 34),
(178, '2025-08-21 12:00:00.000000', '2025-08-21 12:00:00.000000', NULL, 'Fanta hương cam rất ngon, tôi sẽ mua lại.', 5, 5, 34),
(179, '2025-08-21 12:05:00.000000', '2025-08-21 12:05:00.000000', NULL, 'Nước ép cà chua rất bổ dưỡng, tốt cho sức khỏe.', 5, 1, 35),
(180, '2025-08-21 12:10:00.000000', '2025-08-21 12:10:00.000000', NULL, 'Cà chua ép khá ngọt, nhưng hơi chua đối với tôi.', 3, 2, 35),
(181, '2025-08-21 12:15:00.000000', '2025-08-21 12:15:00.000000', NULL, 'Nước cà chua rất ngon, tươi mát.', 5, 3, 35),
(182, '2025-08-21 12:20:00.000000', '2025-08-21 12:20:00.000000', NULL, 'Nước ép cà chua có vị hơi lạ, nhưng vẫn uống được.', 4, 4, 35),
(183, '2025-08-21 12:25:00.000000', '2025-08-21 12:25:00.000000', NULL, 'Nước ép cà chua tuyệt vời, sẽ mua lại.', 5, 5, 35),
(184, '2025-08-21 12:30:00.000000', '2025-08-21 12:30:00.000000', NULL, 'Sữa Nestle rất bổ dưỡng, thích hợp cho mọi gia đình.', 5, 1, 36),
(185, '2025-08-21 12:35:00.000000', '2025-08-21 12:35:00.000000', NULL, 'Sữa hơi ngọt, nhưng chất lượng rất tốt.', 4, 2, 36),
(186, '2025-08-21 12:40:00.000000', '2025-08-21 12:40:00.000000', NULL, 'Sữa Nestle khá ngon, nhưng tôi không thích sữa quá ngọt.', 3, 3, 36),
(187, '2025-08-21 12:45:00.000000', '2025-08-21 12:45:00.000000', NULL, 'Sữa chất lượng tốt, nhưng tôi thích loại ít ngọt hơn.', 4, 4, 36),
(188, '2025-08-21 12:50:00.000000', '2025-08-21 12:50:00.000000', NULL, 'Sữa Nestle rất ngon, sẽ tiếp tục mua.', 5, 5, 36),
(189, '2025-08-21 12:55:00.000000', '2025-08-21 12:55:00.000000', NULL, 'Fanta Suntory rất ngon, hương vị thơm mát.', 5, 1, 37),
(190, '2025-08-21 13:00:00.000000', '2025-08-21 13:00:00.000000', NULL, 'Fanta hơi ngọt, nhưng vẫn rất ngon.', 4, 2, 37),
(191, '2025-08-21 13:05:00.000000', '2025-08-21 13:05:00.000000', NULL, 'Nước ngọt Fanta hơi quá ngọt với tôi.', 3, 3, 37),
(192, '2025-08-21 13:10:00.000000', '2025-08-21 13:10:00.000000', NULL, 'Fanta rất ngon, giải khát tốt trong mùa hè.', 5, 4, 37),
(193, '2025-08-21 13:15:00.000000', '2025-08-21 13:15:00.000000', NULL, 'Fanta quá ngọt, tôi không thích hương vị này.', 2, 5, 37),
(194, '2025-08-21 13:20:00.000000', '2025-08-21 13:20:00.000000', NULL, 'Gạo Vega rất ngon, thích hợp cho bữa cơm gia đình.', 5, 1, 38),
(195, '2025-08-21 13:25:00.000000', '2025-08-21 13:25:00.000000', NULL, 'Gạo hơi khô, nhưng chất lượng khá tốt.', 3, 2, 38),
(196, '2025-08-21 13:30:00.000000', '2025-08-21 13:30:00.000000', NULL, 'Gạo Vega rất thơm và mềm, tôi thích.', 5, 3, 38),
(197, '2025-08-21 13:35:00.000000', '2025-08-21 13:35:00.000000', NULL, 'Gạo khá ngon, nhưng giá hơi cao.', 4, 4, 38),
(198, '2025-08-21 13:40:00.000000', '2025-08-21 13:40:00.000000', NULL, 'Gạo ngon, nhưng cần cải thiện độ dẻo.', 3, 5, 38),
(199, '2025-08-21 13:45:00.000000', '2025-08-21 13:45:00.000000', NULL, 'Blackmores rất bổ dưỡng, hiệu quả tốt.', 5, 1, 39),
(200, '2025-08-21 13:50:00.000000', '2025-08-21 13:50:00.000000', NULL, 'Viên uống hơi đắng, nhưng có hiệu quả.', 4, 2, 39),
(201, '2025-08-21 13:55:00.000000', '2025-08-21 13:55:00.000000', NULL, 'Viên uống có tác dụng, nhưng tôi không thích vị.', 3, 3, 39),
(202, '2025-08-21 14:00:00.000000', '2025-08-21 14:00:00.000000', NULL, 'Blackmores tốt, giúp cải thiện sức khỏe.', 5, 4, 39),
(203, '2025-08-21 14:05:00.000000', '2025-08-21 14:05:00.000000', NULL, 'Viên uống bổ dưỡng, tuy nhiên vị hơi khó uống.', 4, 5, 39),
(204, '2025-08-21 14:10:00.000000', '2025-08-21 14:10:00.000000', NULL, 'Amway rất hiệu quả, dễ sử dụng và tiện lợi.', 5, 1, 40),
(205, '2025-08-21 14:15:00.000000', '2025-08-21 14:15:00.000000', NULL, 'Sản phẩm Amway khá tốt, nhưng tôi cảm thấy không thích hợp với tôi.', 3, 2, 40),
(206, '2025-08-21 14:20:00.000000', '2025-08-21 14:20:00.000000', NULL, 'Amway mang lại hiệu quả tốt, nhưng hơi đắt.', 4, 3, 40),
(207, '2025-08-21 14:25:00.000000', '2025-08-21 14:25:00.000000', NULL, 'Sản phẩm Amway khá đắt nhưng hiệu quả.', 4, 4, 40),
(208, '2025-08-21 14:30:00.000000', '2025-08-21 14:30:00.000000', NULL, 'Amway rất hiệu quả, giá cả hợp lý.', 5, 5, 40);

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `access_token` varchar(255) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `logintype` enum('GOOGLE','EMAIL') NOT NULL DEFAULT 'EMAIL',
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `name`, `phone`, `image`, `role`, `email`, `password`, `token_id`) VALUES
(1, '2025-08-20 10:00:00.000000', '2025-08-20 10:00:00.000000', NULL, 'Nguyễn Văn A', '0901234567', 'client/images/user-1.png', 'ADMIN', 'nguyenvana@example.com', 'password123', NULL),
(2, '2025-08-20 10:05:00.000000', '2025-08-20 10:05:00.000000', NULL, 'Trần Thị B', '0902345678', 'client/images/user-2.png', 'USER', 'tranthib@example.com', 'password123', NULL),
(3, '2025-08-20 10:10:00.000000', '2025-08-20 10:10:00.000000', NULL, 'Lê Văn C', '0903456789', 'client/images/user-3.png', 'USER', 'levanc@example.com', 'password123', NULL),
(4, '2025-08-20 10:15:00.000000', '2025-08-20 10:15:00.000000', NULL, 'Phạm Thị D', '0904567890', 'client/images/user-4.png', 'ADMIN', 'phamthid@example.com', 'password123', NULL),
(5, '2025-08-20 10:20:00.000000', '2025-08-20 10:20:00.000000', NULL, 'Hoàng Minh E', '0905678901', 'client/images/user-5.png', 'USER', 'hoangminhe@example.com', 'password123', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `max_discount` int(11) NOT NULL,
  `min_order_value` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `is_used` tinyint(4) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `voucher`
--

INSERT INTO `voucher` (`id`, `createdAt`, `updatedAt`, `deletedAt`, `code`, `max_discount`, `min_order_value`, `quantity`, `is_used`, `start_date`, `end_date`, `user_id`, `order_id`) VALUES
(1, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'FREESHIP01', 50000, 0, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(2, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'FREESHIP02', 50000, 0, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(3, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'FREESHIP03', 50000, 0, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(4, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'FREESHIP04', 50000, 0, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(5, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'FREESHIP05', 50000, 0, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(6, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA50K', 50000, 500000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(7, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA100K', 100000, 1000000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(8, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA200K', 200000, 1500000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(9, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA400K', 400000, 2000000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(10, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA500K', 500000, 2500000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(11, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA10P', 10, 300000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(12, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA20P', 20, 400000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(13, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA30P', 30, 500000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(14, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA50P', 50, 600000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL),
(15, '2025-08-20 12:00:00.000000', '2025-08-20 12:00:00.000000', NULL, 'GIA100P', 100, 1000000, 100, 0, '2025-08-20 00:00:00', '2025-09-20 00:00:00', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_35cd6c3fafec0bb5d072e24ea20` (`user_id`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f091e86a234693a49084b4c2c86` (`user_id`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_67a2e8406e01ffa24ff9026944e` (`product_id`),
  ADD KEY `FK_b6b2a4f1f533d89d218e70db941` (`cart_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_news_author` (`author_id`),
  ADD KEY `fk_news_category` (`category_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_199e32a02ddc0f47cd93181d8fd` (`user_id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5e17c017aa3f5164cb2da5b1c6b` (`product_id`),
  ADD KEY `FK_e9674a6053adbaa1057848cddfa` (`order_id`),
  ADD KEY `FK_76becd2a6886dc29cb8202b650b` (`productVariant_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_7ac18742b02b8af41afdaa3b9a` (`barcode`),
  ADD KEY `FK_0dce9bc93c2d2c399982d04bef1` (`category_id`),
  ADD KEY `FK_2eb5ce4324613b4b457c364f4a2` (`brand_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b367708bf720c8dd62fc6833161` (`productId`);

--
-- Indexes for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ca67dd080aac5ecf99609960cd2` (`product_id`);

--
-- Indexes for table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_17618c8d69b7e2e287bf9f8fbb3` (`user_id`),
  ADD KEY `FK_2432a0d3bcc975f29eb1e43456b` (`product_id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_e50ca89d635960fda2ffeb1763` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD UNIQUE KEY `REL_e03e90fb544adefa10a6c20218` (`token_id`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_90c55a3063ce5d49ea567a9a9a6` (`user_id`),
  ADD KEY `FK_6007bc31bfbf3a897c62328066b` (`order_id`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_512bf776587ad5fc4f804277d76` (`user_id`),
  ADD KEY `FK_16f64e06715ce4fea8257cc42c5` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_variant`
--
ALTER TABLE `product_variant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `rating`
--
ALTER TABLE `rating`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `token`
--
ALTER TABLE `token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `FK_35cd6c3fafec0bb5d072e24ea20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `FK_f091e86a234693a49084b4c2c86` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `FK_67a2e8406e01ffa24ff9026944e` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_b6b2a4f1f533d89d218e70db941` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `fk_news_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_news_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `FK_199e32a02ddc0f47cd93181d8fd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `FK_5e17c017aa3f5164cb2da5b1c6b` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_76becd2a6886dc29cb8202b650b` FOREIGN KEY (`productVariant_id`) REFERENCES `product_variant` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e9674a6053adbaa1057848cddfa` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_0dce9bc93c2d2c399982d04bef1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2eb5ce4324613b4b457c364f4a2` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `FK_b367708bf720c8dd62fc6833161` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `FK_ca67dd080aac5ecf99609960cd2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `FK_17618c8d69b7e2e287bf9f8fbb3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_2432a0d3bcc975f29eb1e43456b` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FK_e50ca89d635960fda2ffeb17639` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_e03e90fb544adefa10a6c202188` FOREIGN KEY (`token_id`) REFERENCES `token` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `voucher`
--
ALTER TABLE `voucher`
  ADD CONSTRAINT `FK_6007bc31bfbf3a897c62328066b` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_90c55a3063ce5d49ea567a9a9a6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `FK_16f64e06715ce4fea8257cc42c5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_512bf776587ad5fc4f804277d76` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
