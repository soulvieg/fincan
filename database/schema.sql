CREATE TABLE Categories(
    category_id INT NOT NULL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Customers(
    customer_id INT NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    address VARCHAR(255),
    phone_number VARCHAR(255),
    type VARCHAR(255)
);

CREATE TABLE Products(
    product_id INT NOT NULL PRIMARY KEY,
    category_id INT NOT NULL,
    sku VARCHAR(10),
    description VARCHAR(255),
    price DECIMAL(10, 2),
    stock INT,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);


CREATE TABLE Ratings(
    review_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    manager_id INT NOT NULL,
    product_id INT NOT NULL,
    score INT,
    approval BOOL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (manager_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Comments(
    commnt_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    text VARCHAR(512),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Carts(
    cart_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Wishlists(
    whishlist_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

CREATE TABLE Payments(
    payment_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    payment_date DATETIME,
    payment_method VARCHAR(255),
    amount DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Shipments (
    shipment_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    shipment_date DATETIME,
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(30),
    country VARCHAR(50),
    zip_code VARCHAR(10),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Orders (
    order_id INT NOT NULL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATETIME,
    order_status VARCHAR(10),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE Order_items (
    order_item_id INT NOT NULL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

CREATE TABLE Cards (
    card_id INT NOT NULL PRIMARY KEY,
    card_name VARCHAR(64),
    customer_id INT NOT NULL,
    card_number INT,
    expiration_date DATE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);
