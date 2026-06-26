CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────────
-- Category
-- ───────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS recently_viewed CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS product_review CASCADE;
DROP TABLE IF EXISTS product_variant CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS address CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS category CASCADE;

CREATE TABLE category (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(160) NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ───────────────────────────────────────────────────────────────
-- Product (includes material, ratings, tags, specs from start)
-- ───────────────────────────────────────────────────────────────
CREATE TABLE product (
  id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              VARCHAR(200)   NOT NULL,
  description       TEXT,
  category_id       UUID           REFERENCES category(id) ON DELETE SET NULL,
  vendor_price      NUMERIC(10, 2) NOT NULL CHECK (vendor_price >= 0),
  sell_price        NUMERIC(10, 2) NOT NULL CHECK (sell_price >= 0),
  stock_qty         INTEGER        NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  sku               VARCHAR(80)    UNIQUE,
  is_active         BOOLEAN        NOT NULL DEFAULT TRUE,
  images            JSONB          NOT NULL DEFAULT '[]',
  primary_image     TEXT,
  material          VARCHAR(100),
  care_instructions TEXT,
  rating_avg        NUMERIC(3, 2)  DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count      INTEGER        DEFAULT 0 CHECK (rating_count >= 0),
  tags              JSONB          DEFAULT '[]',
  specifications    JSONB          DEFAULT '{}',
  created_at        TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category   ON product(category_id);
CREATE INDEX idx_products_active     ON product(is_active);
CREATE INDEX idx_products_price      ON product(sell_price);
CREATE INDEX idx_products_created_at ON product(created_at DESC);

-- ───────────────────────────────────────────────────────────────
-- Customer
-- ───────────────────────────────────────────────────────────────
CREATE TABLE customer (
  id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  email               VARCHAR(160) NOT NULL UNIQUE,
  password            VARCHAR(255),
  first_name          VARCHAR(100),
  last_name           VARCHAR(100),
  phone               VARCHAR(30),
  is_guest            BOOLEAN      NOT NULL DEFAULT FALSE,
  reset_token         VARCHAR(255),
  reset_token_expiry  TIMESTAMP,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ───────────────────────────────────────────────────────────────
-- Address
-- ───────────────────────────────────────────────────────────────
CREATE TABLE address (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   UUID         NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  address_line1 TEXT         NOT NULL,
  address_line2 TEXT,
  city          VARCHAR(120) NOT NULL,
  state         VARCHAR(120),
  postal_code   VARCHAR(20)  NOT NULL,
  country       VARCHAR(2)   NOT NULL DEFAULT 'IN',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_address_customer ON address(customer_id);

-- ───────────────────────────────────────────────────────────────
-- Cart
-- ───────────────────────────────────────────────────────────────
CREATE TABLE cart (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id  UUID           REFERENCES customer(id) ON DELETE CASCADE,
  guest_token  VARCHAR(255),
  total_price  NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
  UNIQUE (customer_id),
  UNIQUE (guest_token)
);

CREATE INDEX idx_cart_customer    ON cart(customer_id);
CREATE INDEX idx_cart_guest_token ON cart(guest_token);

-- ───────────────────────────────────────────────────────────────
-- Cart Items
-- ───────────────────────────────────────────────────────────────
CREATE TABLE cart_items (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id      UUID           NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id   UUID           NOT NULL REFERENCES product(id),
  product_name VARCHAR(200)   NOT NULL,
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity     INTEGER        NOT NULL CHECK (quantity > 0),
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);

-- ───────────────────────────────────────────────────────────────
-- Product Variants
-- ───────────────────────────────────────────────────────────────
CREATE TABLE product_variant (
  id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID           NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  sku              VARCHAR(80)    UNIQUE NOT NULL,
  variant_name     VARCHAR(100)   NOT NULL,
  attributes       JSONB          NOT NULL DEFAULT '{}',
  price_adjustment NUMERIC(10, 2) DEFAULT 0,
  stock_qty        INTEGER        NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_variant_product ON product_variant(product_id);
CREATE INDEX idx_variant_active  ON product_variant(is_active);

-- ───────────────────────────────────────────────────────────────
-- Product Reviews
-- ───────────────────────────────────────────────────────────────
CREATE TABLE product_review (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID         NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  customer_id   UUID         NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  rating        INTEGER      NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         VARCHAR(200),
  comment       TEXT,
  is_verified   BOOLEAN      NOT NULL DEFAULT FALSE,
  is_approved   BOOLEAN      NOT NULL DEFAULT FALSE,
  helpful_count INTEGER      DEFAULT 0 CHECK (helpful_count >= 0),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (product_id, customer_id)
);

CREATE INDEX idx_review_product  ON product_review(product_id);
CREATE INDEX idx_review_customer ON product_review(customer_id);
CREATE INDEX idx_review_approved ON product_review(is_approved);
CREATE INDEX idx_review_rating   ON product_review(rating DESC);

-- ───────────────────────────────────────────────────────────────
-- Wishlist
-- ───────────────────────────────────────────────────────────────
CREATE TABLE wishlist (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID        NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id, product_id)
);

CREATE INDEX idx_wishlist_customer ON wishlist(customer_id);
CREATE INDEX idx_wishlist_product  ON wishlist(product_id);

-- ───────────────────────────────────────────────────────────────
-- Recently Viewed
-- ───────────────────────────────────────────────────────────────
CREATE TABLE recently_viewed (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID        REFERENCES customer(id) ON DELETE CASCADE,
  guest_token VARCHAR(255),
  product_id  UUID        NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  viewed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recently_viewed_customer ON recently_viewed(customer_id, viewed_at DESC);
CREATE INDEX idx_recently_viewed_guest    ON recently_viewed(guest_token, viewed_at DESC);

-- ───────────────────────────────────────────────────────────────
-- Seed: Categories
-- ───────────────────────────────────────────────────────────────
INSERT INTO category (id, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarees'),
  ('22222222-2222-2222-2222-222222222222', 'Lehengas'),
  ('33333333-3333-3333-3333-333333333333', 'Kurtis'),
  ('44444444-4444-4444-4444-444444444444', 'Salwar Suits'),
  ('55555555-5555-5555-5555-555555555555', 'Dupattas')
ON CONFLICT (name) DO NOTHING;

-- ───────────────────────────────────────────────────────────────
-- Seed: Products (images stored under products/{product_id}/)
-- ───────────────────────────────────────────────────────────────
INSERT INTO product (id, name, description, category_id, vendor_price, sell_price, stock_qty, sku, is_active, images, primary_image, material, care_instructions, rating_avg, rating_count, tags, specifications) VALUES
  ('a1111111-1111-1111-1111-111111111111',
   'Royal Blue Banarasi Silk Saree',
   'Exquisite handwoven Banarasi silk saree featuring intricate gold zari work and traditional motifs. Perfect for weddings and special occasions.',
   '11111111-1111-1111-1111-111111111111', 8500.00, 12999.00, 15, 'SAR-BAN-001', true,
   '["http://localhost:9000/weaver-images/products/a1111111-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/a1111111-1111-1111-1111-111111111111/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/a1111111-1111-1111-1111-111111111111/1.jpg',
   'Pure Banarasi Silk', 'Dry clean only. Store in a cool, dry place.', 4.70, 89,
   '["Banarasi","Silk","Wedding"]'::jsonb,
   '{"length":"5.5 meters","occasion":"Wedding"}'::jsonb),

  ('a1111111-2222-2222-2222-222222222222',
   'Emerald Green Kanjivaram Silk Saree',
   'Authentic Kanjivaram silk saree with contrasting maroon border. Features temple motifs and pure zari work.',
   '11111111-1111-1111-1111-111111111111', 9200.00, 14500.00, 12, 'SAR-KAN-002', true,
   '["http://localhost:9000/weaver-images/products/a1111111-2222-2222-2222-222222222222/1.jpg","http://localhost:9000/weaver-images/products/a1111111-2222-2222-2222-222222222222/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/a1111111-2222-2222-2222-222222222222/1.jpg',
   'Pure Kanjivaram Silk', 'Dry clean recommended.', 4.80, 124,
   '["Kanjivaram","Silk","Traditional"]'::jsonb,
   '{"length":"6.3 meters","occasion":"Wedding"}'::jsonb),

  ('a1111111-3333-3333-3333-333333333333',
   'Pink Chanderi Cotton Saree',
   'Lightweight Chanderi cotton saree with delicate zari border and buttis. Ideal for summer occasions and festive gatherings.',
   '11111111-1111-1111-1111-111111111111', 3200.00, 4999.00, 25, 'SAR-CHN-003', true,
   '["http://localhost:9000/weaver-images/products/a1111111-3333-3333-3333-333333333333/1.jpg","http://localhost:9000/weaver-images/products/a1111111-3333-3333-3333-333333333333/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/a1111111-3333-3333-3333-333333333333/1.jpg',
   'Chanderi Cotton Silk', 'Hand wash or dry clean. Iron on medium heat.', 4.50, 67,
   '["Chanderi","Cotton","Festive"]'::jsonb,
   '{"length":"5.5 meters","occasion":"Festive"}'::jsonb),

  ('a1111111-4444-4444-4444-444444444444',
   'Maroon Paithani Silk Saree',
   'Traditional Paithani silk saree from Maharashtra with handwoven peacock pallu and oblique square design body.',
   '11111111-1111-1111-1111-111111111111', 15000.00, 22999.00, 6, 'SAR-PAI-004', true,
   '["http://localhost:9000/weaver-images/products/a1111111-4444-4444-4444-444444444444/1.jpg","http://localhost:9000/weaver-images/products/a1111111-4444-4444-4444-444444444444/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/a1111111-4444-4444-4444-444444444444/1.jpg',
   'Pure Paithani Silk', 'Dry clean only. Avoid direct sunlight.', 4.90, 203,
   '["Paithani","Silk","Bridal"]'::jsonb,
   '{"length":"5.5 meters","occasion":"Wedding"}'::jsonb),

  ('a1111111-5555-5555-5555-555555555555',
   'Ivory Tussar Silk Saree',
   'Handloom Tussar silk saree in natural ivory with tribal art prints inspired by Madhubani paintings.',
   '11111111-1111-1111-1111-111111111111', 4500.00, 6999.00, 20, 'SAR-TUS-005', true,
   '["http://localhost:9000/weaver-images/products/a1111111-5555-5555-5555-555555555555/1.jpg","http://localhost:9000/weaver-images/products/a1111111-5555-5555-5555-555555555555/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/a1111111-5555-5555-5555-555555555555/1.jpg',
   'Tussar Silk', 'Dry clean recommended. Store flat.', 4.30, 45,
   '["Tussar","Silk","Casual"]'::jsonb,
   '{"length":"5.5 meters","occasion":"Casual"}'::jsonb),

  ('b2222222-1111-1111-1111-111111111111',
   'Bridal Red Velvet Lehenga',
   'Luxurious bridal lehenga in rich red velvet with heavy zardozi embroidery. Includes embroidered blouse and dupatta.',
   '22222222-2222-2222-2222-222222222222', 18500.00, 28999.00, 8, 'LEH-VEL-001', true,
   '["http://localhost:9000/weaver-images/products/b2222222-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/b2222222-1111-1111-1111-111111111111/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/b2222222-1111-1111-1111-111111111111/1.jpg',
   'Velvet with Zardozi Work', 'Dry clean only. Store in garment bag.', 4.90, 156,
   '["Bridal","Velvet","Wedding"]'::jsonb,
   '{"lehenga_length":"42 inches","occasion":"Wedding"}'::jsonb),

  ('b2222222-2222-2222-2222-222222222222',
   'Navy Blue Silk Lehenga',
   'Elegant navy blue raw silk lehenga with silver thread embroidery and mirror work. Perfect for sangeet and reception.',
   '22222222-2222-2222-2222-222222222222', 12000.00, 18499.00, 10, 'LEH-SLK-002', true,
   '["http://localhost:9000/weaver-images/products/b2222222-2222-2222-2222-222222222222/1.jpg","http://localhost:9000/weaver-images/products/b2222222-2222-2222-2222-222222222222/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/b2222222-2222-2222-2222-222222222222/1.jpg',
   'Raw Silk with Mirror Work', 'Dry clean only.', 4.60, 78,
   '["Silk","Mirror Work","Reception"]'::jsonb,
   '{"lehenga_length":"40 inches","occasion":"Reception"}'::jsonb),

  ('c3333333-1111-1111-1111-111111111111',
   'White Cotton Chikankari Kurti',
   'Hand-embroidered Lucknowi chikankari kurti in pure cotton. Features intricate threadwork and comfortable fit.',
   '33333333-3333-3333-3333-333333333333', 1200.00, 1999.00, 50, 'KUR-CHI-001', true,
   '["http://localhost:9000/weaver-images/products/c3333333-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/c3333333-1111-1111-1111-111111111111/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/c3333333-1111-1111-1111-111111111111/1.jpg',
   'Pure Cotton', 'Machine wash cold. Tumble dry low.', 4.40, 234,
   '["Cotton","Chikankari","Casual"]'::jsonb,
   '{"length":"44 inches","occasion":"Casual"}'::jsonb),

  ('c3333333-2222-2222-2222-222222222222',
   'Mustard Chanderi Kurti',
   'Stylish mustard Chanderi silk kurti with gota patti work and flared sleeves. Versatile for office and festive wear.',
   '33333333-3333-3333-3333-333333333333', 1800.00, 2799.00, 35, 'KUR-CHD-002', true,
   '["http://localhost:9000/weaver-images/products/c3333333-2222-2222-2222-222222222222/1.jpg","http://localhost:9000/weaver-images/products/c3333333-2222-2222-2222-222222222222/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/c3333333-2222-2222-2222-222222222222/1.jpg',
   'Chanderi Silk', 'Hand wash or dry clean.', 4.20, 112,
   '["Chanderi","Silk","Office"]'::jsonb,
   '{"length":"42 inches","occasion":"Office/Festive"}'::jsonb),

  ('d4444444-1111-1111-1111-111111111111',
   'Peach Georgette Salwar Suit',
   'Elegant peach georgette salwar suit with thread embroidery and sequin work. Includes matching dupatta.',
   '44444444-4444-4444-4444-444444444444', 3500.00, 5499.00, 18, 'SAL-GEO-001', true,
   '["http://localhost:9000/weaver-images/products/d4444444-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/d4444444-1111-1111-1111-111111111111/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/d4444444-1111-1111-1111-111111111111/1.jpg',
   'Georgette with Sequin Work', 'Dry clean recommended.', 4.30, 56,
   '["Georgette","Sequin","Festive"]'::jsonb,
   '{"top_length":"40 inches","occasion":"Festive"}'::jsonb),

  ('e5555555-1111-1111-1111-111111111111',
   'Red Banarasi Silk Dupatta',
   'Handwoven Banarasi silk dupatta with gold zari border and intricate jaal work. Perfect complement for any outfit.',
   '55555555-5555-5555-5555-555555555555', 2200.00, 3499.00, 30, 'DUP-BAN-001', true,
   '["http://localhost:9000/weaver-images/products/e5555555-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/e5555555-1111-1111-1111-111111111111/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/e5555555-1111-1111-1111-111111111111/1.jpg',
   'Banarasi Silk', 'Dry clean only.', 4.50, 92,
   '["Banarasi","Silk","Accessory"]'::jsonb,
   '{"length":"2.5 meters","occasion":"Any"}'::jsonb),

  ('e5555555-2222-2222-2222-222222222222',
   'Indigo Ajrakh Block Print Dupatta',
   'Natural dyed Ajrakh block print dupatta in indigo and madder. Hand-block printed using traditional techniques from Kutch.',
   '55555555-5555-5555-5555-555555555555', 1500.00, 2499.00, 22, 'DUP-AJR-002', true,
   '["http://localhost:9000/weaver-images/products/e5555555-2222-2222-2222-222222222222/1.jpg","http://localhost:9000/weaver-images/products/e5555555-2222-2222-2222-222222222222/2.jpg"]'::jsonb,
   'http://localhost:9000/weaver-images/products/e5555555-2222-2222-2222-222222222222/1.jpg',
   'Cotton with Natural Dyes', 'Hand wash separately in cold water.', 4.60, 41,
   '["Ajrakh","Block Print","Casual"]'::jsonb,
   '{"length":"2.5 meters","occasion":"Casual"}'::jsonb);
