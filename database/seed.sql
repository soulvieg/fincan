INSERT INTO Categories (category_id, name) VALUES
(1, 'Coffee Beans'),
(2, 'Coffee Mugs'),
(3, 'Brewing Equipment'),
(4, 'Accessories'),
(5, 'Merchandise');

INSERT INTO Customers (customer_id, first_name, last_name, email, password, address, phone_number) VALUES
(1, 'Alice', 'Johnson', 'alice.johnson@example.com', 'password123', '123 Coffee St', '555-1001'),
(2, 'Bob', 'Smith', 'bob.smith@example.com', 'password456', '456 Brewery Ln', '555-1002'),
(3, 'Charlie', 'Brown', 'charlie.brown@example.com', 'password789', '789 Roast Rd', '555-1003'),
(4, 'Diana', 'Evans', 'diana.evans@example.com', 'password101', '101 Espresso Ave', '555-1004'),
(5, 'Ethan', 'Harris', 'ethan.harris@example.com', 'password112', '112 Latte Ln', '555-1005'),
(6, 'Fiona', 'Clark', 'fiona.clark@example.com', 'password131', '131 Cappuccino Ct', '555-1006'),
(7, 'George', 'Lewis', 'george.lewis@example.com', 'password415', '415 Mocha Dr', '555-1007'),
(8, 'Hannah', 'Walker', 'hannah.walker@example.com', 'password161', '161 Arabica Ave', '555-1008'),
(9, 'Ian', 'Hall', 'ian.hall@example.com', 'password718', '718 Robusta Rd', '555-1009'),
(10, 'Julia', 'Young', 'julia.young@example.com', 'password919', '919 Macchiato Mn', '555-1010');

INSERT INTO Products (product_id, category_id, sku, description, price, stock) VALUES
(1, 1, 'CB001', 'Arabica Coffee Beans - 1kg', 25.99, 100),
(2, 1, 'CB002', 'Robusta Coffee Beans - 1kg', 22.99, 150),
(3, 1, 'CB003', 'Ethiopian Yirgacheffe - 500g', 19.99, 75),
(4, 2, 'CM001', 'Classic Ceramic Coffee Mug', 12.99, 200),
(5, 2, 'CM002', 'Insulated Stainless Steel Mug', 24.99, 150),
(6, 3, 'BE001', 'French Press - 1L', 29.99, 50),
(7, 3, 'BE002', 'Pour Over Coffee Maker', 34.99, 60),
(8, 4, 'AC001', 'Coffee Grinder', 49.99, 40),
(9, 4, 'AC002', 'Milk Frother', 19.99, 80),
(10, 5, 'ME001', 'Coffee Lover T-Shirt', 22.99, 100);

INSERT INTO Carts (cart_id, customer_id, product_id, quantity) VALUES
(1, 1, 1, 2),
(2, 2, 5, 1),
(3, 3, 3, 3),
(4, 4, 7, 1),
(5, 5, 9, 2),
(6, 6, 2, 1),
(7, 7, 4, 4),
(8, 8, 6, 1),
(9, 9, 8, 1),
(10, 10, 10, 2);

INSERT INTO Wishlists (wishlist_id, customer_id, product_id) VALUES
(1, 1, 2),
(2, 2, 3),
(3, 3, 4),
(4, 4, 5),
(5, 5, 6),
(6, 6, 7),
(7, 7, 8),
(8, 8, 9),
(9, 9, 10),
(10, 10, 1);

INSERT INTO Payments (payment_id, customer_id, payment_date, payment_method, amount) VALUES
(1, 1, '2023-10-01 10:00:00', 'Credit Card', 51.98),
(2, 2, '2023-10-02 11:00:00', 'PayPal', 24.99),
(3, 3, '2023-10-03 12:00:00', 'Credit Card', 59.97),
(4, 4, '2023-10-04 13:00:00', 'Debit Card', 34.99),
(5, 5, '2023-10-05 14:00:00', 'Credit Card', 39.98),
(6, 6, '2023-10-06 15:00:00', 'PayPal', 22.99),
(7, 7, '2023-10-07 16:00:00', 'Credit Card', 51.96),
(8, 8, '2023-10-08 17:00:00', 'Debit Card', 29.99),
(9, 9, '2023-10-09 18:00:00', 'Credit Card', 49.99),
(10, 10, '2023-10-10 19:00:00', 'PayPal', 45.98);

INSERT INTO Shipments (shipment_id, customer_id, shipment_date, address, city, state, country, zip_code) VALUES
(1, 1, '2023-10-03 12:00:00', '123 Coffee St', 'Anytown', 'CA', 'USA', '12345'),
(2, 2, '2023-10-04 13:00:00', '456 Brewery Ln', 'Othertown', 'NY', 'USA', '67890'),
(3, 3, '2023-10-05 14:00:00', '789 Roast Rd', 'Sometown', 'TX', 'USA', '11223'),
(4, 4, '2023-10-06 15:00:00', '101 Espresso Ave', 'Yourtown', 'FL', 'USA', '44556'),
(5, 5, '2023-10-07 16:00:00', '112 Latte Ln', 'Theirtown', 'WA', 'USA', '77889'),
(6, 6, '2023-10-08 17:00:00', '131 Cappuccino Ct', 'Mytown', 'IL', 'USA', '99001'),
(7, 7, '2023-10-09 18:00:00', '415 Mocha Dr', 'Hometown', 'OH', 'USA', '22334'),
(8, 8, '2023-10-10 19:00:00', '161 Arabica Ave', 'Yourcity', 'GA', 'USA', '55667'),
(9, 9, '2023-10-11 20:00:00', '718 Robusta Rd', 'Ourcity', 'MI', 'USA', '88990'),
(10, 10, '2023-10-12 21:00:00', '919 Macchiato Mn', 'Theircity', 'PA', 'USA', '33445');

INSERT INTO Orders (order_id, customer_id, order_date, total_amount) VALUES
(1, 1, '2023-10-01 10:00:00', 51.98),
(2, 2, '2023-10-02 11:00:00', 24.99),
(3, 3, '2023-10-03 12:00:00', 59.97),
(4, 4, '2023-10-04 13:00:00', 34.99),
(5, 5, '2023-10-05 14:00:00', 39.98),
(6, 6, '2023-10-06 15:00:00', 22.99),
(7, 7, '2023-10-07 16:00:00', 51.96),
(8, 8, '2023-10-08 17:00:00', 29.99),
(9, 9, '2023-10-09 18:00:00', 49.99),
(10, 10, '2023-10-10 19:00:00', 45.98);

INSERT INTO Order_items (order_item_id, order_id, product_id, quantity) VALUES
(1, 1, 1, 2),
(2, 2, 5, 1),
(3, 3, 3, 3),
(4, 4, 7, 1),
(5, 5, 9, 2),
(6, 6, 2, 1),
(7, 7, 4, 4),
(8, 8, 6, 1),
(9, 9, 8, 1),
(10, 10, 10, 2);
