--create sequence bm_id_seq start with 1 increment by 50;
--
--create table product (
--    id bigint default nextval('bm_id_seq') not null,
--    name varchar(255) not null,
--    image varchar(255) not null,
--    quantity int,
--    price int,
--    weight int,
--    description varchar(255),
--    primary key (id)
--);


DROP TABLE IF EXISTS category CASCADE;
CREATE TABLE category (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(160) NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

DROP Table IF EXISTS product CASCADE;
CREATE TABLE product (
  id             BIGSERIAL PRIMARY KEY,
  name           VARCHAR(200) NOT NULL,
  description    TEXT,
  category_id    BIGINT REFERENCES category(id) ON DELETE SET NULL,
  vendor_price   NUMERIC(10, 2) NOT NULL CHECK (vendor_price >= 0),
  sell_price     NUMERIC(10, 2) NOT NULL CHECK (sell_price >= 0),
  stock_qty      INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  sku            VARCHAR(80) UNIQUE,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  images         JSONB   NOT NULL DEFAULT '[]',         -- e.g. ['s3://bucket/.../uuid1.jpg', ...]
  primary_image  TEXT,                                  -- e.g. 's3://bucket/.../uuid1.jpg'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category   ON product(category_id);
CREATE INDEX idx_products_active     ON product(is_active);
CREATE INDEX idx_products_price      ON product(sell_price);
CREATE INDEX idx_products_created_at ON product(created_at DESC);

DROP TABLE IF EXISTS customer CASCADE;
CREATE TABLE customer (
  id           BIGSERIAL PRIMARY KEY,
  email        VARCHAR(160) NOT NULL UNIQUE,
  password     VARCHAR(255),   -- store a hash (e.g., bcrypt/argon2)
  first_name   VARCHAR(100),
  last_name    VARCHAR(100),
  phone        VARCHAR(30),
  is_guest     BOOLEAN NOT NULL DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address (
  id            BIGSERIAL PRIMARY KEY,
  customer_id   BIGINT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  address_line1 TEXT   NOT NULL,
  address_line2 TEXT,
  city          VARCHAR(120) NOT NULL,
  state         VARCHAR(120),
  postal_code   VARCHAR(20)  NOT NULL,
  country       VARCHAR(2)   NOT NULL DEFAULT 'IN', -- ISO-3166-1 alpha-2
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_address_customer ON address(customer_id);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS cart CASCADE;
CREATE TABLE cart (
  id           BIGSERIAL PRIMARY KEY,
  customer_id  BIGINT REFERENCES customer(id) ON DELETE CASCADE,
  guest_token  VARCHAR(255),
  total_price  NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id), -- one active cart per customer
  UNIQUE (guest_token)
);

CREATE INDEX idx_cart_customer ON cart(customer_id);
CREATE INDEX idx_cart_guest_token ON cart(guest_token);

DROP TABLE IF EXISTS cart_items CASCADE;
CREATE TABLE cart_items (
  id               BIGSERIAL PRIMARY KEY,
  cart_id          BIGINT   NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
  product_id       BIGINT NOT NULL REFERENCES product(id),
  product_name     VARCHAR(200) NOT NULL,  -- snapshot for display consistency
  price            NUMERIC(10, 2) NOT NULL CHECK (price >= 0), -- unit price at time of add
  quantity         INTEGER NOT NULL CHECK (quantity > 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- avoid duplicate product lines in a cart; update quantity instead
  UNIQUE (cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
