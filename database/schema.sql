-- Drop existing tables to avoid “already exists” errors
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Shipments;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Wishlists;
DROP TABLE IF EXISTS Cards;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Categories;

-- Categories
CREATE TABLE Categories (
    category_id INT NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255),
    PRIMARY KEY (category_id)
);

-- Customers
CREATE TABLE Customers (
    customer_id  INT NOT NULL AUTO_INCREMENT,
    first_name   VARCHAR(255),
    last_name    VARCHAR(255),
    email        VARCHAR(255),
    password     VARCHAR(255),
    address      VARCHAR(255),
    phone_number VARCHAR(255),
    type         VARCHAR(255),
    PRIMARY KEY (customer_id)
);

-- Admins
CREATE TABLE Admins (
    id       INT NOT NULL AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

-- Products
CREATE TABLE Products (
    product_id   INT NOT NULL AUTO_INCREMENT,
    category_id  INT NOT NULL,
    sku          VARCHAR(10),
    name         VARCHAR(255),
    description  VARCHAR(255),
    price        DECIMAL(10, 2),
    stock        INT,
    PRIMARY KEY (product_id),
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

-- Ratings
CREATE TABLE Ratings (
    review_id   INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    manager_id  INT NOT NULL,
    product_id  INT NOT NULL,
    score       INT,
    approval    BOOL,
    PRIMARY KEY (review_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (manager_id)  REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
);

-- Comments
CREATE TABLE Comments (
    commnt_id   INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_id  INT NOT NULL,
    text        VARCHAR(512),
    approval    BOOL,
    manager_id  INT NOT NULL,
    PRIMARY KEY (commnt_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
);

-- Cards (bcrypt-hashed card numbers)
CREATE TABLE Cards (
    card_id        INT          NOT NULL AUTO_INCREMENT,
    customer_id    INT          NOT NULL,
    card_number    VARCHAR(255) NOT NULL,
    expiration_date DATE        NOT NULL,
    card_name      VARCHAR(64)  NOT NULL,
    PRIMARY KEY (card_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Carts
CREATE TABLE Carts (
    cart_id       INT             NOT NULL AUTO_INCREMENT,
    customer_id   INT             NULL,
    product_id    INT             NOT NULL,
    quantity      INT,
    session_id    VARCHAR(255),
    PRIMARY KEY (cart_id),
    FOREIGN KEY (customer_id)
        REFERENCES Customers(customer_id)
        ON DELETE SET NULL,
    FOREIGN KEY (product_id)
        REFERENCES Products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Wishlists
CREATE TABLE Wishlists (
    wishlist_id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_id  INT NOT NULL,
    PRIMARY KEY (wishlist_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
);

-- Payments
CREATE TABLE Payments (
    payment_id     INT          NOT NULL AUTO_INCREMENT,
    customer_id    INT          NOT NULL,
    payment_date   DATETIME,
    payment_method VARCHAR(255),
    amount         DECIMAL(10, 2),
    PRIMARY KEY (payment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Shipments
CREATE TABLE Shipments (
    shipment_id   INT          NOT NULL AUTO_INCREMENT,
    customer_id   INT          NOT NULL,
    shipment_date DATETIME,
    address       VARCHAR(255),
    city          VARCHAR(255),
    state         VARCHAR(30),
    country       VARCHAR(50),
    zip_code      VARCHAR(10),
    PRIMARY KEY (shipment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Orders
CREATE TABLE Orders (
    order_id      INT       NOT NULL,
    customer_id   INT       NOT NULL,
    product_id    INT       NOT NULL,
    quantity      INT,
    order_date    DATETIME,
    order_status  VARCHAR(20),
    total_amount  DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
);