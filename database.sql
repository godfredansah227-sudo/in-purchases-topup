-- Schema for IN-PURCHASES TOP-UP Database (Neon PostgreSQL)

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(30) UNIQUE NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'GHS',
    player_id VARCHAR(100) NOT NULL,
    server_id VARCHAR(100) DEFAULT '',
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(150),
    payment_method VARCHAR(50) DEFAULT 'Telecel Mobile Money',
    payment_number VARCHAR(30) DEFAULT '0205438685',
    payment_reference VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending Verification', -- 'Pending Verification', 'Payment Verified', 'Completed', 'Rejected'
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast order lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Table for Admin User Authentication
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin User if not exists (username: Mr9iceguy)
-- Password: @Mr9iceguy
INSERT INTO admin_users (username, password_hash, email)
VALUES ('Mr9iceguy', '@Mr9iceguy', 'admin@inpurchasestopup.com')
ON CONFLICT (username) DO NOTHING;
