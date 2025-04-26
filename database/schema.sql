CREATE TABLE Categories (
    category_id INT NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255),
    PRIMARY KEY (category_id)
);

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

CREATE TABLE Admins (
    id       INT NOT NULL AUTO_INCREMENT,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO Admins (name, email, password, role)
VALUES ('Top Admin',
        'admin@fincan.com',
        '$2b$10$irEyZLMsqFu41HOJDVQPduGLCW./8cmKzndPApnlE9QgSyMTmig3G',
        'overseeingAdmin');

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

CREATE TABLE Cards (
    card_id        INT             NOT NULL AUTO_INCREMENT,
    customer_id    INT             NOT NULL,
    card_number    VARCHAR(255)    NOT NULL,
    expiration_date DATE           NOT NULL,
    card_name      VARCHAR(64)     NOT NULL,
    PRIMARY KEY (card_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Wishlists (
    wishlist_id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_id  INT NOT NULL,
    PRIMARY KEY (wishlist_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
);

CREATE TABLE Payments (
    payment_id   INT NOT NULL AUTO_INCREMENT,
    customer_id  INT NOT NULL,
    payment_date DATETIME,
    payment_method VARCHAR(255),
    amount       DECIMAL(10, 2),
    PRIMARY KEY (payment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Shipments (
    shipment_id  INT NOT NULL AUTO_INCREMENT,
    customer_id  INT NOT NULL,
    shipment_date DATETIME,
    address      VARCHAR(255),
    city         VARCHAR(255),
    state        VARCHAR(30),
    country      VARCHAR(50),
    zip_code     VARCHAR(10),
    PRIMARY KEY (shipment_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Orders(
    order_id      INT NOT NULL,
    customer_id   INT NOT NULL,
    product_id    INT NOT NULL,
    quantity      INT,
    order_date    DATETIME,
    order_status  VARCHAR(20),
    total_amount  DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id)  REFERENCES Products(product_id)
);



CREATE TABLE Cards (
    card_id      INT NOT NULL AUTO_INCREMENT,
    customer_id  INT NOT NULL,
    card_number  BIGINT,
    expiration_date DATE,
    card_name    VARCHAR(64),
    PRIMARY KEY (card_id),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);