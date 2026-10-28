-- ============================================================================
--  UNTERGRUND CLOTHING STORE  ::  COMPLETE DATABASE SETUP (PostgreSQL)
--  Everything in one file: tables + indexes + seed data + coupons + admin user.
--  Just copy this whole file and run it once.
--
--  WHERE TO RUN IT
--    psql        :  psql "postgresql://user:password@host:5432/dbname" -f database.sql
--    PgAdmin     :  right-click database -> Query Tool -> paste -> Execute (F5)
--    DBeaver     :  SQL Editor -> paste -> Execute script (Alt+X)
--    Supabase    :  SQL Editor -> New query -> paste -> Run
--    Neon        :  SQL Editor -> paste -> Run
--
--  SAFE TO RE-RUN: every statement is idempotent (IF NOT EXISTS / ON CONFLICT).
--  Admin login created by this file:  admin@untergrund.com  /  Admin@123
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- OPTIONAL: full reset. Uncomment these 10 lines ONLY if you want to wipe the
-- database and start from zero (this DELETES all existing data).
-- ---------------------------------------------------------------------------
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS coupons CASCADE;
-- DROP TABLE IF EXISTS cart_items CASCADE;
-- DROP TABLE IF EXISTS wishlist_items CASCADE;
-- DROP TABLE IF EXISTS newsletter CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;

-- ===========================================================================
-- 1. PRODUCTS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  name            TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  description     TEXT        NOT NULL,
  price           REAL        NOT NULL,
  compare_price   REAL,
  category        TEXT        NOT NULL,
  images          JSONB       NOT NULL DEFAULT '[]'::jsonb,
  colors          JSONB       NOT NULL DEFAULT '[]'::jsonb,   -- [{"name":"Black","hex":"#000000"}]
  sizes           JSONB       NOT NULL DEFAULT '[]'::jsonb,   -- ["S","M","L"]
  tags            JSONB       NOT NULL DEFAULT '[]'::jsonb,   -- ["Latest Drop"]
  is_limited_drop BOOLEAN     NOT NULL DEFAULT FALSE,
  drop_ends_at    TIMESTAMP,
  in_stock        BOOLEAN     NOT NULL DEFAULT TRUE,
  stock_count     INTEGER     NOT NULL DEFAULT 100,
  featured        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 2. CART ITEMS  (guest carts are keyed by session_id)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  session_id  TEXT      NOT NULL,
  product_id  INTEGER   NOT NULL,
  quantity    INTEGER   NOT NULL DEFAULT 1,
  size        TEXT      NOT NULL,
  color       TEXT      NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 3. WISHLIST ITEMS  (either user_id for logged-in users, or session_id for guests)
-- ===========================================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER,
  session_id  TEXT,
  product_id  INTEGER   NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 4. USERS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  name           TEXT      NOT NULL,
  email          TEXT      NOT NULL UNIQUE,
  password_hash  TEXT      NOT NULL,           -- format: "salt:pbkdf2_sha512_hex"
  role           TEXT      NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
  phone          TEXT,
  address        TEXT,
  city           TEXT,
  postal_code    TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 5. ORDERS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  order_number     TEXT      NOT NULL UNIQUE,
  user_id          INTEGER,                      -- NULL for guest checkout
  customer_name    TEXT      NOT NULL,
  customer_email   TEXT      NOT NULL,
  customer_phone   TEXT      NOT NULL,
  shipping_address JSONB     NOT NULL,           -- {"address":"..","city":"..","postalCode":"..","notes":".."}
  subtotal         REAL      NOT NULL,
  discount_amount  REAL      NOT NULL DEFAULT 0,
  total_amount     REAL      NOT NULL,
  payment_method   TEXT      NOT NULL DEFAULT 'COD',       -- 'COD' | 'CARD'
  payment_status   TEXT      NOT NULL DEFAULT 'pending',   -- 'pending' | 'paid' | 'failed'
  order_status     TEXT      NOT NULL DEFAULT 'pending',   -- 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 6. ORDER ITEMS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INTEGER   NOT NULL,
  product_id  INTEGER   NOT NULL,
  name        TEXT      NOT NULL,
  price       REAL      NOT NULL,
  quantity    INTEGER   NOT NULL,
  size        TEXT      NOT NULL,
  color       TEXT      NOT NULL,
  image       TEXT      NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 7. COUPONS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS coupons (
  id                SERIAL PRIMARY KEY,
  code              TEXT      NOT NULL UNIQUE,
  discount_percent  REAL,                      -- e.g. 10 = 10%
  discount_amount   REAL,                      -- e.g. 500 = Rs. 500 off
  min_order_amount  REAL      DEFAULT 0,
  is_active         BOOLEAN   NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 8. REVIEWS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id                 SERIAL PRIMARY KEY,
  product_id         INTEGER   NOT NULL,
  user_id            INTEGER   NOT NULL,
  rating             INTEGER   NOT NULL,       -- 1..5
  comment            TEXT,
  is_verified_buyer  BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- 9. NEWSLETTER SUBSCRIBERS
-- ===========================================================================
CREATE TABLE IF NOT EXISTS newsletter (
  id          SERIAL PRIMARY KEY,
  email       TEXT      NOT NULL UNIQUE,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================================
-- INDEXES (query performance)
-- ===========================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug         ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category     ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_featured     ON products (featured);
CREATE INDEX IF NOT EXISTS idx_products_limited_drop ON products (is_limited_drop);
CREATE INDEX IF NOT EXISTS idx_products_tags         ON products USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_cart_session          ON cart_items (session_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user         ON wishlist_items (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_session      ON wishlist_items (session_id);
CREATE INDEX IF NOT EXISTS idx_users_email           ON users (email);
CREATE INDEX IF NOT EXISTS idx_orders_user           ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number         ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order     ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product       ON reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code          ON coupons (code);

-- ===========================================================================
-- SEED DATA  ::  12 demo products (matches src/db/seed.ts)
-- ===========================================================================
-- 12 demo products (mirrors src/db/seed.ts). Re-running does not duplicate them.
INSERT INTO products
  (name, slug, description,
   price, compare_price, category,
   images, colors, sizes, tags,
   is_limited_drop, drop_ends_at, in_stock, stock_count, featured)
VALUES
  (
    'SHADOW OVERSIZED TEE', 'shadow-oversized-tee',
    'Premium 300gsm heavyweight cotton oversized tee. Drop shoulder design with raw-cut hem. Garment dyed for a washed-out underground aesthetic. Made in Australia.',
    89.00, 120.00, 'Oversized Tees',
    '["https://images.pexels.com/photos/18584221/pexels-photo-18584221.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/28701950/pexels-photo-28701950.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/30257616/pexels-photo-30257616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Washed Black", "hex": "#1a1a1a"}, {"name": "Stone", "hex": "#b5a99a"}, {"name": "Off White", "hex": "#f5f0eb"}]'::jsonb,   -- colors
    '["S", "M", "L", "XL", "XXL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    TRUE, NOW() + INTERVAL '3 days', TRUE, 47, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'NOCTURNAL HOODIE', 'nocturnal-hoodie',
    '480gsm heavyweight French terry hoodie. Boxy fit with kangaroo pocket and premium YKK hardware. Embossed logo detail. Limited to 200 units worldwide.',
    189.00, 250.00, 'Hoodies',
    '["https://images.pexels.com/photos/19887010/pexels-photo-19887010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/16272623/pexels-photo-16272623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/28701960/pexels-photo-28701960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Midnight", "hex": "#0d0d0d"}, {"name": "Concrete", "hex": "#808080"}]'::jsonb,   -- colors
    '["S", "M", "L", "XL", "XXL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    TRUE, NOW() + INTERVAL '5 days', TRUE, 23, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'UNDERGROUND CARGO', 'underground-cargo',
    'Ripstop nylon cargo pants with multiple utility pockets. Adjustable cuffs with snap buttons. Water-resistant coating. Relaxed fit through thigh with tapered leg.',
    159.00, NULL, 'Cargo Pants',
    '["https://images.pexels.com/photos/28701960/pexels-photo-28701960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/19887012/pexels-photo-19887012.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/18584221/pexels-photo-18584221.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Black", "hex": "#000000"}, {"name": "Olive", "hex": "#556B2F"}, {"name": "Sand", "hex": "#C2B280"}]'::jsonb,   -- colors
    '["28", "30", "32", "34", "36"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 85, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'PHANTOM JACKET', 'phantom-jacket',
    'Technical shell jacket with reflective detailing. Storm flap construction with sealed seams. Packable design with integrated hood. Premium DWR coating.',
    299.00, 380.00, 'Jackets',
    '["https://images.pexels.com/photos/30257616/pexels-photo-30257616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/18956666/pexels-photo-18956666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/28701950/pexels-photo-28701950.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Stealth Black", "hex": "#111111"}, {"name": "Graphite", "hex": "#383838"}]'::jsonb,   -- colors
    '["S", "M", "L", "XL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    TRUE, NOW() + INTERVAL '7 days', TRUE, 15, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'VOID OVERSIZED TEE', 'void-oversized-tee',
    'Ultra heavyweight 350gsm oversized tee with back print. Screen printed graphic with puff print details. Double stitched for durability.',
    99.00, NULL, 'Oversized Tees',
    '["https://images.pexels.com/photos/19862949/pexels-photo-19862949.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/32037694/pexels-photo-32037694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/19887010/pexels-photo-19887010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Black", "hex": "#000000"}, {"name": "Charcoal", "hex": "#36454F"}]'::jsonb,   -- colors
    '["S", "M", "L", "XL", "XXL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 120, FALSE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'DUSK ZIP-UP', 'dusk-zip-up',
    '500gsm premium zip-up hoodie with metal hardware. Split kangaroo pockets. Ribbed cuffs and hem. Oversized fit with dropped shoulders.',
    219.00, NULL, 'Hoodies',
    '["https://images.pexels.com/photos/34582210/pexels-photo-34582210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/33055601/pexels-photo-33055601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/16272623/pexels-photo-16272623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Washed Black", "hex": "#1a1a1a"}, {"name": "Cement", "hex": "#ABABAB"}]'::jsonb,   -- colors
    '["S", "M", "L", "XL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 65, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'CHROME CHAIN', 'chrome-chain',
    'Stainless steel Cuban link chain with custom clasp. 60cm length. Chrome finish. Comes in premium gift box.',
    79.00, NULL, 'Accessories',
    '["https://images.pexels.com/photos/19887012/pexels-photo-19887012.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/16272623/pexels-photo-16272623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/33055601/pexels-photo-33055601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Chrome", "hex": "#C0C0C0"}]'::jsonb,   -- colors
    '["60cm"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 200, FALSE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'ECLIPSE CARGO SHORTS', 'eclipse-cargo-shorts',
    'Premium twill cargo shorts with utility pockets. Relaxed fit with elastic waistband and drawstring. Enzyme washed for a broken-in feel.',
    119.00, NULL, 'Cargo Pants',
    '["https://images.pexels.com/photos/32037694/pexels-photo-32037694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/18584221/pexels-photo-18584221.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/30257616/pexels-photo-30257616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Black", "hex": "#000000"}, {"name": "Khaki", "hex": "#BDB76B"}]'::jsonb,   -- colors
    '["28", "30", "32", "34", "36"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 90, FALSE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'TRAPSTAR OVERSIZED TEE', 'trapstar-oversized-tee',
    'Limited collaboration oversized tee. 320gsm organic cotton. Exclusive embroidered patch detail. Only 100 units made.',
    129.00, 180.00, 'Oversized Tees',
    '["https://images.pexels.com/photos/28701950/pexels-photo-28701950.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/34582210/pexels-photo-34582210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/19862949/pexels-photo-19862949.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Vintage Black", "hex": "#1c1c1c"}]'::jsonb,   -- colors
    '["M", "L", "XL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    TRUE, NOW() + INTERVAL '2 days', TRUE, 8, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'MONOCHROME BEANIE', 'monochrome-beanie',
    'Ribbed knit beanie in premium merino wool blend. Embroidered logo. One size fits all.',
    49.00, NULL, 'Accessories',
    '["https://images.pexels.com/photos/18956666/pexels-photo-18956666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/19887010/pexels-photo-19887010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/19887012/pexels-photo-19887012.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Black", "hex": "#000000"}, {"name": "Grey", "hex": "#808080"}]'::jsonb,   -- colors
    '["One Size"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 150, FALSE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'STEALTH BOMBER', 'stealth-bomber',
    'MA-1 inspired bomber jacket in premium nylon. Padded construction with satin lining. Custom metal zippers and ribbed trim.',
    349.00, NULL, 'Jackets',
    '["https://images.pexels.com/photos/33055601/pexels-photo-33055601.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/28701960/pexels-photo-28701960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/18956666/pexels-photo-18956666.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Jet Black", "hex": "#0a0a0a"}, {"name": "Army", "hex": "#4B5320"}]'::jsonb,   -- colors
    '["S", "M", "L", "XL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    TRUE, NOW() + INTERVAL '10 days', TRUE, 30, TRUE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  ),
  (
    'GRIP SOCKS', 'grip-socks',
    'Premium crew socks in organic cotton. Cushioned sole with arch support. Logo knit detail.',
    29.00, NULL, 'Accessories',
    '["https://images.pexels.com/photos/16272623/pexels-photo-16272623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/30257616/pexels-photo-30257616.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800", "https://images.pexels.com/photos/32037694/pexels-photo-32037694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800"]'::jsonb,   -- images
    '[{"name": "Black", "hex": "#000000"}, {"name": "White", "hex": "#FFFFFF"}]'::jsonb,   -- colors
    '["S/M", "L/XL"]'::jsonb,   -- sizes
    '[]'::jsonb,   -- tags
    FALSE, NULL, TRUE, 300, FALSE   -- is_limited_drop, drop_ends_at, in_stock, stock_count, featured
  )
ON CONFLICT (slug) DO NOTHING;

-- ===========================================================================
-- SEED DATA  ::  COUPONS
-- ===========================================================================
INSERT INTO coupons (code, discount_percent, discount_amount, min_order_amount, is_active)
VALUES
  ('UNTER10',    10,   NULL, 0,    TRUE),   -- 10% off
  ('WELCOME500', NULL, 500,  2000, TRUE)    -- Rs. 500 off orders over Rs. 2000
ON CONFLICT (code) DO NOTHING;

-- ===========================================================================
-- SEED DATA  ::  ADMIN USER
--   email: admin@untergrund.com     password: Admin@123
--   (hash is PBKDF2-SHA512 salt:hash, the same format src/lib/auth.ts uses)
--   Change the password after your first login.
-- ===========================================================================
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Store Admin',
  'admin@untergrund.com',
  'bde4acfb025590da64c34601a2152ff0:f1517e6d028e992bc66e27333eadf5422114be895045b95a35e24f3bec3a4756e6df3348df2e71035b50649026b9e2eb8fbfb0f87b4572f5fe224c973ba575c1',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

COMMIT;

-- ===========================================================================
-- VERIFY (optional) - run these to confirm everything landed
-- ===========================================================================
-- SELECT COUNT(*) AS products FROM products;     -- expect 12
-- SELECT COUNT(*) AS coupons  FROM coupons;      -- expect 2
-- SELECT id, name, email, role FROM users;       -- expect admin@untergrund.com
-- SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' ORDER BY table_name;  -- expect 9 tables
