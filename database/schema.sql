-- Drop existing tables to avoid “already exists” errors
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Shipments;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Wishlists;
DROP TABLE IF EXISTS Cards;
DROP TABLE IF EXISTS Comments;
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Carts;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Refunds;
DROP TABLE IF EXISTS Categories;

-- Categories
CREATE TABLE Categories (
    category_id INT NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255),
    PRIMARY KEY (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admins
CREATE TABLE Admins (
    id       INT NOT NULL AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products
CREATE TABLE Products (
    product_id        INT             NOT NULL AUTO_INCREMENT,
    category_id       INT             NULL,
    sku               VARCHAR(50)     NULL,
    name              VARCHAR(255)    NOT NULL,
    model             VARCHAR(255)    NULL,
    serial_number     VARCHAR(255)    NULL,
    description       TEXT            NULL,
    quantity_in_stock INT             NOT NULL DEFAULT 0 CHECK (quantity_in_stock >= 0),
    price             DECIMAL(10,2)   NOT NULL,
    warranty_status   VARCHAR(100)    NULL,
    distributor_info  VARCHAR(512)    NULL,
    image_url         VARCHAR(512)    NULL,
    is_best_seller    BOOLEAN         NOT NULL DEFAULT FALSE,
    PRIMARY KEY (product_id),
    FOREIGN KEY (category_id)
      REFERENCES Categories(category_id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ratings
CREATE TABLE Ratings (
    review_id   INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    manager_id  INT     NULL,
    product_id  INT NOT NULL,
    score       INT     NULL,
    approval    BOOL    NULL,
    PRIMARY KEY (review_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (manager_id)  REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id) ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Comments
CREATE TABLE Comments (
    comment_id   INT          NOT NULL AUTO_INCREMENT,
    customer_id  INT          NOT NULL,
    product_id   INT          NOT NULL,
    text         VARCHAR(512) NULL,
    approval     BOOL         NULL,
    manager_id   INT          NULL,
    PRIMARY KEY (comment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cards
CREATE TABLE Cards (
    card_id        INT          NOT NULL AUTO_INCREMENT,
    customer_id    INT          NOT NULL,
    card_number    VARCHAR(255) NOT NULL,
    card_last4     CHAR(4)      NOT NULL,
    expiration_date DATE        NOT NULL,
    card_name      VARCHAR(64)  NOT NULL,
    PRIMARY KEY (card_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Carts
CREATE TABLE Carts (
    cart_id       INT          NOT NULL AUTO_INCREMENT,
    customer_id   INT          NULL,
    product_id    INT          NOT NULL,
    quantity      INT          NULL,
    session_id    VARCHAR(255) NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payments
CREATE TABLE Payments (
    payment_id     INT          NOT NULL AUTO_INCREMENT,
    customer_id    INT          NOT NULL,
    payment_date   DATETIME     NULL,
    payment_method VARCHAR(255) NULL,
    amount         DECIMAL(10,2) NULL,
    PRIMARY KEY (payment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Shipments
CREATE TABLE Shipments (
    shipment_id   INT          NOT NULL AUTO_INCREMENT,
    customer_id   INT          NOT NULL,
    shipment_date DATETIME     NULL,
    address       VARCHAR(255) NULL,
    city          VARCHAR(255) NULL,
    state         VARCHAR(30)  NULL,
    country       VARCHAR(50)  NULL,
    zip_code      VARCHAR(10)  NULL,
    PRIMARY KEY (shipment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders
CREATE TABLE Orders (
    order_id      INT       NOT NULL,
    customer_id   INT       NOT NULL,
    product_id    INT       NOT NULL,
    quantity      INT       NULL,
    order_date    DATETIME  NULL,
    order_status  VARCHAR(20) NULL,
    total_amount  DECIMAL(10,2) NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Refunds (
    refund_id       INT                    NOT NULL AUTO_INCREMENT,
    order_id        INT                    NOT NULL,
    customer_id     INT                    NOT NULL,
    amount          DECIMAL(10,2)          NOT NULL,
    refund_status   ENUM(
                       'waiting for refund',
                       'refunded',
                       'refund denied'
                    )                     NOT NULL
                                       DEFAULT 'waiting for refund',
    request_date    DATETIME               NOT NULL
                                       DEFAULT CURRENT_TIMESTAMP,
    processed_date  DATETIME               NULL,
    PRIMARY KEY (refund_id),
    -- note: Orders.order_id is part of a composite PK; adjust or omit FK if your engine rejects it
    FOREIGN KEY (customer_id)
      REFERENCES Customers(customer_id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;