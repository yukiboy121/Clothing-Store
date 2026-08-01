import { pgTable, serial, text, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  comparePrice: real("compare_price"),
  category: text("category").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<{ name: string; hex: string }[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  isLimitedDrop: boolean("is_limited_drop").notNull().default(false),
  dropEndsAt: timestamp("drop_ends_at"),
  inStock: boolean("in_stock").notNull().default(true),
  stockCount: integer("stock_count").notNull().default(100),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: text("size").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // Nullable for guest wishlist using sessionId
  sessionId: text("session_id"), 
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(), // 1 to 5
  comment: text("comment"),
  isVerifiedBuyer: boolean("is_verified_buyer").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletter = pgTable("newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"), // "user" | "admin"
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id"), // Nullable for guest checkouts if needed
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: jsonb("shipping_address").$type<{
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  }>().notNull(),
  subtotal: real("subtotal").notNull(),
  discountAmount: real("discount_amount").notNull().default(0),
  totalAmount: real("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull().default("COD"), // "COD" | "CARD"
  paymentStatus: text("payment_status").notNull().default("pending"), // "pending" | "paid" | "failed"
  orderStatus: text("order_status").notNull().default("pending"), // "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountPercent: real("discount_percent"), // e.g. 10 for 10%
  discountAmount: real("discount_amount"), // e.g. 500 for Rs. 500 off
  minOrderAmount: real("min_order_amount").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

