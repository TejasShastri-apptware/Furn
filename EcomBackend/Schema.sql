-- WILL WRITE MIGRATION SCRIPTS LATER ON FOR THE TABLES, WOULD NOT TAKE LONG ONCE THE STRUCTURE IS FINALIZED
-- NEED TO RUN THE ALTER QUERIES TOO

-- 1. Users & Authentication
CREATE TABLE roles (
    role_id TINYINT PRIMARY KEY,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id TINYINT DEFAULT 2,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 2. Products
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT
);


CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    
    description TEXT,
    image_url VARCHAR(255),
    
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    
    material VARCHAR(100),
    color VARCHAR(50),
    dimensions VARCHAR(100),
    
    stock_quantity INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 3. Shopping Cart (Volatile Storage)
CREATE TABLE cart_items (
    cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- 4. Orders & Payments
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_status ENUM('pending', 'paid', 'shipped', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_id VARCHAR(100), -- Razorpay Order/Payment ID
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL, -- Snapshot of price to prevent history corruption
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);



ALTER TABLE order_items 
ADD COLUMN unit_price DECIMAL(10, 2) NOT NULL AFTER quantity,
ADD COLUMN subtotal DECIMAL(10, 2) NOT NULL AFTER unit_price;

ALTER TABLE users 
ADD COLUMN default_shipping_address TEXT AFTER phone;


ALTER TABLE order_items DROP COLUMN price_at_purchase;