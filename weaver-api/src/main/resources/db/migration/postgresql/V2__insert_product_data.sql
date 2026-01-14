-- This file is now more complex because we need to know the UUIDs to link products to categories.
-- We will use CTEs (Common Table Expressions) to handle this.

WITH category_data AS (
    INSERT INTO category (name) VALUES
    ('Sarees'),
    ('Fabrics'),
    ('Dupattas'),
    ('Stoles'),
    ('Home Decor')
    RETURNING id, name
),
sarees_id AS (
    SELECT id FROM category_data WHERE name = 'Sarees'
),
fabrics_id AS (
    SELECT id FROM category_data WHERE name = 'Fabrics'
),
dupattas_id AS (
    SELECT id FROM category_data WHERE name = 'Dupattas'
),
stoles_id AS (
    SELECT id FROM category_data WHERE name = 'Stoles'
),
home_decor_id AS (
    SELECT id FROM category_data WHERE name = 'Home Decor'
)
INSERT INTO product (name, description, category_id, vendor_price, sell_price, stock_qty, sku, is_active, images, primary_image) VALUES
('Banarasi Silk Saree', 'Authentic handwoven Banarasi silk saree with intricate zari work.', (SELECT id FROM sarees_id), 120.00, 180.00, 50, 'SAR-BAN-001', TRUE, '[]', null),
('Kanjivaram Silk Saree', 'Traditional Kanjivaram silk saree known for its durability and shine.', (SELECT id FROM sarees_id), 140.00, 210.00, 30, 'SAR-KAN-002', TRUE, '[]', null),
('Cotton Ikat Fabric', 'Pure cotton fabric with traditional Ikat patterns, suitable for kurtas.', (SELECT id FROM fabrics_id), 15.00, 25.00, 200, 'FAB-IKA-001', TRUE, '[]', null),
('Chanderi Silk Dupatta', 'Lightweight and sheer Chanderi silk dupatta with golden border.', (SELECT id FROM dupattas_id), 30.00, 50.00, 75, 'DUP-CHA-001', TRUE, '[]', null),
('Pashmina Stole', 'Luxurious and warm Pashmina stole from Kashmir.', (SELECT id FROM stoles_id), 80.00, 120.00, 40, 'STO-PAS-001', TRUE, '[]', null),
('Hand-block Printed Cushion Cover', 'Cotton cushion cover with traditional hand-block prints.', (SELECT id FROM home_decor_id), 10.00, 18.00, 100, 'HOM-CUS-001', TRUE, '[]', null);
