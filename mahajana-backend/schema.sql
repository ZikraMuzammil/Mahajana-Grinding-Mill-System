-- ============================================================
-- Mahajana Grinding Mill — Database Schema
-- Run this once in MySQL:  mysql -u root -p < schema.sql
-- (or paste into phpMyAdmin / MySQL Workbench)
-- ============================================================

CREATE DATABASE IF NOT EXISTS mahajana_db;
USE mahajana_db;

-- ---------- CUSTOMERS ----------
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(30),
  password VARCHAR(255) NOT NULL,
  location VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- ADMINS (sellers) ----------
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- seed default admin so LoginPage.js (admin / 1234) still works
INSERT INTO admins (username, password)
SELECT 'admin', '1234'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

-- ---------- ORDERS ----------
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  customer_name VARCHAR(120) NOT NULL,
  phone VARCHAR(30),
  email VARCHAR(150),
  address VARCHAR(255),
  city VARCHAR(100),
  postal VARCHAR(20),
  notes TEXT,
  delivery_method VARCHAR(20) DEFAULT 'home',
  payment_method VARCHAR(20) DEFAULT 'cod',
  coupon VARCHAR(50),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- ---------- ORDER ITEMS ----------
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_name VARCHAR(150) NOT NULL,
  category VARCHAR(100),
  weight VARCHAR(20),
  qty INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
