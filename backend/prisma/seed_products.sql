-- ===============================================================
-- QUERY THÊM 9 SẢN PHẨM TRỨ DANH CHO VELVET & BREW (CAFE_DB)
-- Bao gồm: Danh sách món, Kích cỡ (Size S, M, L) và Topping liên kết
-- ===============================================================

USE `cafe_db`;

-- 1. BẢNG TOPPING (Nếu chưa có)
INSERT INTO `Topping` (`id`, `name`, `price`) VALUES
(1, 'Trân châu đen mật mía', 5000.00),
(2, 'Trân châu hoàng kim dai giòn', 7000.00),
(3, 'Kem Cheese dẻo', 10000.00)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `price` = VALUES(`price`);

-- 2. BẢNG PRODUCT (9 Sản phẩm cao cấp)
INSERT INTO `Product` (`id`, `name`, `category`, `description`, `basePrice`, `image`, `isBestSeller`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'Cà phê sữa truyền thống', 'coffee', 'Đậm đà Robusta Buôn Ma Thuột phối cùng Arabica Cầu Đất, hòa quyện sữa đặc ngọt dịu.', 45000.00, 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=700&q=85', 1, 1, NOW(3), NOW(3)),
(2, 'Trà sữa Oolong Nướng', 'milktea', 'Lá trà Ô Long sấy chậm đượm hương khói thơm lừng, kết hợp cốt sữa thanh béo tròn vị.', 49000.00, 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=700&q=85', 1, 1, NOW(3), NOW(3)),
(3, 'Bạc xỉu Sài Gòn 3 tầng', 'coffee', 'Sữa tươi béo ngậy hòa cùng sữa đặc ngọt thơm và tầng cà phê Robusta nồng nàn sóng sánh.', 50000.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=700&q=85', 0, 1, NOW(3), NOW(3)),
(4, 'Matcha Latte Kem Cheese', 'special', 'Bột Matcha Uji Nhật Bản thượng hạng hòa quyện lớp macchiato kem cheese dẻo mặn.', 55000.00, 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=700&q=85', 1, 1, NOW(3), NOW(3)),
(5, 'Trà Đào Cam Sả Tươi', 'fruittea', 'Hương sả thanh dịu quyện nước cốt cam vàng mọng nước và miếng đào giòn ngọt mát lạnh.', 48000.00, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700&q=85', 0, 1, NOW(3), NOW(3)),
(6, 'Cà phê Muối Cố Đô', 'coffee', 'Lớp kem muối biển sánh mịn béo mặn nhẹ cân bằng hoàn hảo hậu vị đắng đậm đà nguyên bản.', 52000.00, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=85', 1, 1, NOW(3), NOW(3)),
(7, 'Sữa Tươi Trân Châu Đường Đen', 'milktea', 'Sữa tươi thanh trùng Đà Lạt hòa quyện sốt đường đen mật mía dẻo thơm ấm nóng.', 55000.00, 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=700&q=85', 0, 1, NOW(3), NOW(3)),
(8, 'Cacao Dừa Tuyết Đá Xay', 'special', 'Cacao nguyên chất Đắk Lắk đậm đà xay tuyết cùng cốt dừa tươi Bến Tre béo thơm ngọt lành.', 58000.00, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=700&q=85', 0, 1, NOW(3), NOW(3)),
(9, 'Cold Brew Cam Vàng Thảo Mộc', 'coffee', 'Cà phê ủ lạnh 16 giờ chiết xuất từng giọt tinh túy, kết hợp cam vàng California và hương thảo tươi mát.', 62000.00, 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=700&q=85', 1, 1, NOW(3), NOW(3))
ON DUPLICATE KEY UPDATE 
  `name` = VALUES(`name`),
  `category` = VALUES(`category`),
  `description` = VALUES(`description`),
  `basePrice` = VALUES(`basePrice`),
  `image` = VALUES(`image`),
  `isBestSeller` = VALUES(`isBestSeller`),
  `isActive` = VALUES(`isActive`),
  `updatedAt` = NOW(3);

-- 3. BẢNG PRODUCTSIZE (Kích cỡ Size S, M, L cho 9 sản phẩm)
DELETE FROM `ProductSize` WHERE `productId` BETWEEN 1 AND 9;

INSERT INTO `ProductSize` (`name`, `subText`, `extraPrice`, `productId`) VALUES
('Size S', 'Tiêu chuẩn', 0.00, 1),
('Size M', '+6.000đ', 6000.00, 1),
('Size L', '+12.000đ', 12000.00, 1),

('Size S', 'Tiêu chuẩn', 0.00, 2),
('Size M', '+6.000đ', 6000.00, 2),
('Size L', '+12.000đ', 12000.00, 2),

('Size S', 'Tiêu chuẩn', 0.00, 3),
('Size M', '+6.000đ', 6000.00, 3),
('Size L', '+12.000đ', 12000.00, 3),

('Size S', 'Tiêu chuẩn', 0.00, 4),
('Size M', '+6.000đ', 6000.00, 4),
('Size L', '+12.000đ', 12000.00, 4),

('Size S', 'Tiêu chuẩn', 0.00, 5),
('Size M', '+6.000đ', 6000.00, 5),
('Size L', '+12.000đ', 12000.00, 5),

('Size S', 'Tiêu chuẩn', 0.00, 6),
('Size M', '+6.000đ', 6000.00, 6),
('Size L', '+12.000đ', 12000.00, 6),

('Size S', 'Tiêu chuẩn', 0.00, 7),
('Size M', '+6.000đ', 6000.00, 7),
('Size L', '+12.000đ', 12000.00, 7),

('Size S', 'Tiêu chuẩn', 0.00, 8),
('Size M', '+6.000đ', 6000.00, 8),
('Size L', '+12.000đ', 12000.00, 8),

('Size S', 'Tiêu chuẩn', 0.00, 9),
('Size M', '+6.000đ', 6000.00, 9),
('Size L', '+12.000đ', 12000.00, 9);

-- 4. BẢNG PRODUCTTOPPING (Gán 3 loại Topping cho cả 9 sản phẩm)
INSERT IGNORE INTO `ProductTopping` (`productId`, `toppingId`) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2), (3, 3),
(4, 1), (4, 2), (4, 3),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 2), (6, 3),
(7, 1), (7, 2), (7, 3),
(8, 1), (8, 2), (8, 3),
(9, 1), (9, 2), (9, 3);
