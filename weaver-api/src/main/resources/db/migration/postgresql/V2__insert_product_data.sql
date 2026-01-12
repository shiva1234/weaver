-- Insert Categories
INSERT INTO category (name) VALUES
('Sarees'),
('Fabrics'),
('Dupattas'),
('Stoles'),
('Home Decor');

-- Insert Products
-- Note: Prices are in cents (e.g., 15000 = $150.00)
INSERT INTO product (name, description, category_id, vendor_price, sell_price, stock_qty, sku, is_active, images, primary_image) VALUES
('Banarasi Silk Saree', 'Authentic handwoven Banarasi silk saree with intricate zari work.', 1, 120.00, 180.00, 50, 'SAR-BAN-001', TRUE, '["https://example.com/images/banarasi1.jpg", "https://example.com/images/banarasi2.jpg"]', 'https://example.com/images/banarasi1.jpg'),
('Kanjivaram Silk Saree', 'Traditional Kanjivaram silk saree known for its durability and shine.', 1, 140.00, 210.00, 30, 'SAR-KAN-002', TRUE, '["https://example.com/images/kanjivaram1.jpg"]', 'https://example.com/images/kanjivaram1.jpg'),
('Cotton Ikat Fabric', 'Pure cotton fabric with traditional Ikat patterns, suitable for kurtas.', 2, 15.00, 25.00, 200, 'FAB-IKA-001', TRUE, '["https://example.com/images/ikat1.jpg"]', 'https://example.com/images/ikat1.jpg'),
('Chanderi Silk Dupatta', 'Lightweight and sheer Chanderi silk dupatta with golden border.', 3, 30.00, 50.00, 75, 'DUP-CHA-001', TRUE, '["https://example.com/images/chanderi1.jpg"]', 'https://example.com/images/chanderi1.jpg'),
('Pashmina Stole', 'Luxurious and warm Pashmina stole from Kashmir.', 4, 80.00, 120.00, 40, 'STO-PAS-001', TRUE, '["https://example.com/images/pashmina1.jpg"]', 'https://example.com/images/pashmina1.jpg'),
('Hand-block Printed Cushion Cover', 'Cotton cushion cover with traditional hand-block prints.', 5, 10.00, 18.00, 100, 'HOM-CUS-001', TRUE, '["https://example.com/images/cushion1.jpg"]', 'https://example.com/images/cushion1.jpg');
