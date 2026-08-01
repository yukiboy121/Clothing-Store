-- UNTERGRUND CLOTHING STORE - NEW DATABASE TABLES
-- Run this SQL in your PostgreSQL Database (PgAdmin, DBeaver, or psql)

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id INTEGER,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal REAL NOT NULL,
  discount_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'COD',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Create Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percent REAL,
  discount_amount REAL,
  min_order_amount REAL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 5. Create Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  is_verified_buyer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Update existing wishlist_items table
ALTER TABLE wishlist_items 
  ADD COLUMN IF NOT EXISTS user_id INTEGER;

ALTER TABLE wishlist_items 
  ALTER COLUMN session_id DROP NOT NULL;

-- 7. Insert Initial Test Coupons (Optional)
INSERT INTO coupons (code, discount_percent, discount_amount, min_order_amount, is_active)
VALUES 
  ('UNTER10', 10, NULL, 0, true),
  ('WELCOME500', NULL, 500, 2000, true)
ON CONFLICT (code) DO NOTHING;

ALTER TABLE "products" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;
