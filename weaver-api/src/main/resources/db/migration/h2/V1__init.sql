-- H2 version of all tables (single init migration)

CREATE TABLE IF NOT EXISTS category (
  id          UUID         DEFAULT RANDOM_UUID() PRIMARY KEY,
  name        VARCHAR(160) NOT NULL UNIQUE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product (
  id                UUID           DEFAULT RANDOM_UUID() PRIMARY KEY,
  name              VARCHAR(200)   NOT NULL,
  description       TEXT,
  category_id       UUID,
  vendor_price      DECIMAL(10, 2) NOT NULL CHECK (vendor_price >= 0),
  sell_price        DECIMAL(10, 2) NOT NULL CHECK (sell_price >= 0),
  stock_qty         INTEGER        NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  sku               VARCHAR(80)    UNIQUE,
  is_active         BOOLEAN        NOT NULL DEFAULT TRUE,
  images            VARCHAR(4000)  NOT NULL DEFAULT '[]',
  primary_image     TEXT,
  material          VARCHAR(100),
  care_instructions TEXT,
  rating_avg        DECIMAL(3, 2)  DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count      INTEGER        DEFAULT 0 CHECK (rating_count >= 0),
  tags              VARCHAR(2000)  DEFAULT '[]',
  specifications    VARCHAR(4000)  DEFAULT '{}',
  created_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category   ON product(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active     ON product(is_active);
CREATE INDEX IF NOT EXISTS idx_products_price      ON product(sell_price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON product(created_at DESC);

CREATE TABLE IF NOT EXISTS customer (
  id                  UUID         DEFAULT RANDOM_UUID() PRIMARY KEY,
  email               VARCHAR(160) NOT NULL UNIQUE,
  password            VARCHAR(255),
  first_name          VARCHAR(100),
  last_name           VARCHAR(100),
  phone               VARCHAR(30),
  is_guest            BOOLEAN      NOT NULL DEFAULT FALSE,
  reset_token         VARCHAR(255),
  reset_token_expiry  TIMESTAMP,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS address (
  id            UUID         DEFAULT RANDOM_UUID() PRIMARY KEY,
  customer_id   UUID         NOT NULL,
  address_line1 TEXT         NOT NULL,
  address_line2 TEXT,
  city          VARCHAR(120) NOT NULL,
  state         VARCHAR(120),
  postal_code   VARCHAR(20)  NOT NULL,
  country       VARCHAR(2)   NOT NULL DEFAULT 'IN',
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_address_customer ON address(customer_id);

CREATE TABLE IF NOT EXISTS cart (
  id           UUID           DEFAULT RANDOM_UUID() PRIMARY KEY,
  customer_id  UUID,
  guest_token  VARCHAR(255),
  total_price  DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (customer_id),
  UNIQUE (guest_token),
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cart_customer    ON cart(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_guest_token ON cart(guest_token);

CREATE TABLE IF NOT EXISTS cart_items (
  id           UUID           DEFAULT RANDOM_UUID() PRIMARY KEY,
  cart_id      UUID           NOT NULL,
  product_id   UUID           NOT NULL,
  product_name VARCHAR(200)   NOT NULL,
  price        DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  quantity     INTEGER        NOT NULL CHECK (quantity > 0),
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cart_id, product_id),
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);

CREATE TABLE IF NOT EXISTS product_variant (
  id               UUID           DEFAULT RANDOM_UUID() PRIMARY KEY,
  product_id       UUID           NOT NULL,
  sku              VARCHAR(80)    NOT NULL UNIQUE,
  variant_name     VARCHAR(100)   NOT NULL,
  attributes       VARCHAR(2000)  NOT NULL DEFAULT '{}',
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  stock_qty        INTEGER        NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  is_active        BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_variant_product ON product_variant(product_id);
CREATE INDEX IF NOT EXISTS idx_variant_active  ON product_variant(is_active);

CREATE TABLE IF NOT EXISTS product_review (
  id            UUID      DEFAULT RANDOM_UUID() PRIMARY KEY,
  product_id    UUID      NOT NULL,
  customer_id   UUID      NOT NULL,
  rating        INTEGER   NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         VARCHAR(200),
  comment       TEXT,
  is_verified   BOOLEAN   NOT NULL DEFAULT FALSE,
  is_approved   BOOLEAN   NOT NULL DEFAULT FALSE,
  helpful_count INTEGER   DEFAULT 0 CHECK (helpful_count >= 0),
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  UNIQUE (product_id, customer_id)
);

CREATE INDEX IF NOT EXISTS idx_review_product  ON product_review(product_id);
CREATE INDEX IF NOT EXISTS idx_review_customer ON product_review(customer_id);
CREATE INDEX IF NOT EXISTS idx_review_approved ON product_review(is_approved);
CREATE INDEX IF NOT EXISTS idx_review_rating   ON product_review(rating DESC);

CREATE TABLE IF NOT EXISTS wishlist (
  id          UUID      DEFAULT RANDOM_UUID() PRIMARY KEY,
  customer_id UUID      NOT NULL,
  product_id  UUID      NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
  UNIQUE (customer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_customer ON wishlist(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product  ON wishlist(product_id);

CREATE TABLE IF NOT EXISTS recently_viewed (
  id          UUID      DEFAULT RANDOM_UUID() PRIMARY KEY,
  customer_id UUID,
  guest_token VARCHAR(255),
  product_id  UUID      NOT NULL,
  viewed_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_customer ON recently_viewed(customer_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_guest    ON recently_viewed(guest_token, viewed_at DESC);

-- Seed categories
MERGE INTO category (id, name) KEY(name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarees'),
  ('22222222-2222-2222-2222-222222222222', 'Lehengas'),
  ('33333333-3333-3333-3333-333333333333', 'Kurtis'),
  ('44444444-4444-4444-4444-444444444444', 'Salwar Suits'),
  ('55555555-5555-5555-5555-555555555555', 'Dupattas');

-- Seed products (images stored under products/{product_id}/)
INSERT INTO product (id, name, description, category_id, vendor_price, sell_price, stock_qty, sku, is_active, images, primary_image, material, care_instructions, rating_avg, rating_count, tags, specifications) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Royal Blue Banarasi Silk Saree', 'Exquisite handwoven Banarasi silk saree featuring intricate gold zari work and traditional motifs.', '11111111-1111-1111-1111-111111111111', 8500.00, 12999.00, 15, 'SAR-BAN-001', true,
   '["http://localhost:9000/weaver-images/products/a1111111-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/a1111111-1111-1111-1111-111111111111/2.jpg"]',
   'http://localhost:9000/weaver-images/products/a1111111-1111-1111-1111-111111111111/1.jpg', 'Pure Banarasi Silk', 'Dry clean only.', 4.70, 89,
   '["Banarasi","Silk","Wedding"]', '{"length":"5.5 meters","occasion":"Wedding"}'),
  ('a1111111-2222-2222-2222-222222222222', 'Emerald Green Kanjivaram Silk Saree', 'Authentic Kanjivaram silk saree with contrasting maroon border.', '11111111-1111-1111-1111-111111111111', 9200.00, 14500.00, 12, 'SAR-KAN-002', true,
   '["http://localhost:9000/weaver-images/products/a1111111-2222-2222-2222-222222222222/1.jpg","http://localhost:9000/weaver-images/products/a1111111-2222-2222-2222-222222222222/2.jpg"]',
   'http://localhost:9000/weaver-images/products/a1111111-2222-2222-2222-222222222222/1.jpg', 'Pure Kanjivaram Silk', 'Dry clean recommended.', 4.80, 124,
   '["Kanjivaram","Silk","Traditional"]', '{"length":"6.3 meters","occasion":"Wedding"}'),
  ('b2222222-1111-1111-1111-111111111111', 'Bridal Red Velvet Lehenga', 'Luxurious bridal lehenga in rich red velvet with heavy zardozi embroidery.', '22222222-2222-2222-2222-222222222222', 18500.00, 28999.00, 8, 'LEH-VEL-001', true,
   '["http://localhost:9000/weaver-images/products/b2222222-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/b2222222-1111-1111-1111-111111111111/2.jpg"]',
   'http://localhost:9000/weaver-images/products/b2222222-1111-1111-1111-111111111111/1.jpg', 'Velvet with Zardozi Work', 'Dry clean only.', 4.90, 156,
   '["Bridal","Velvet","Wedding"]', '{"lehenga_length":"42 inches","occasion":"Wedding"}'),
  ('c3333333-1111-1111-1111-111111111111', 'White Cotton Chikankari Kurti', 'Hand-embroidered Lucknowi chikankari kurti in pure cotton.', '33333333-3333-3333-3333-333333333333', 1200.00, 1999.00, 50, 'KUR-CHI-001', true,
   '["http://localhost:9000/weaver-images/products/c3333333-1111-1111-1111-111111111111/1.jpg","http://localhost:9000/weaver-images/products/c3333333-1111-1111-1111-111111111111/2.jpg"]',
   'http://localhost:9000/weaver-images/products/c3333333-1111-1111-1111-111111111111/1.jpg', 'Pure Cotton', 'Machine wash cold.', 4.40, 234,
   '["Cotton","Chikankari","Casual"]', '{"length":"44 inches","occasion":"Casual"}');
