-- ============================================================
-- Adds real product + stock tracking to your existing database.
-- Run AFTER your original schema.sql (this only ADDS a table,
-- doesn't touch orders/customers/admins).
-- ============================================================

USE mahajana_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,      -- page name, e.g. "Spice", "Herbal"
  subcategory VARCHAR(100),           -- tab name, e.g. "Curry Blends"
  base_price DECIMAL(10,2) NOT NULL,
  stock_json JSON NOT NULL,           -- {"100g":80,"200g":60,"500g":40,"750g":25,"1kg":15}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);