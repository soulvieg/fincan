-- Seed the Categories table
INSERT INTO Categories (category_id, name) VALUES
(1, 'Coffee Beans'),
(2, 'Coffee Mugs'),
(3, 'Brewing Equipment'),
(4, 'Accessories'),
(5, 'Merchandise'),
(6, 'Tea'),
(7, 'Snacks'),
(8, 'Syrups'),
(9, 'Cups'),
(10, 'Filters');

-- Seed the Products table to match frontend products
INSERT INTO Products (product_id, category_id, sku, name, description, price, stock) VALUES
(1, 1, 'CB001', 'Kenya Coffee', 'Rich and smooth', 15.99, 0),
(2, 1, 'CB002', 'Premium Coffee', 'Local Farming', 12.99, 1),
(3, 1, 'CB003', 'Blue Coffee', 'Blue Bottle coffee', 18.99, 75),
(4, 1, 'CB004', 'Vienese Coffee', 'Rich and smooth', 14.99, 200),
(5, 1, 'CB005', 'Moroccan Coffee', 'Rich and smooth', 16.99, 150),
(6, 6, 'TE001', 'Fresh Tea', 'Refreshing and healthy', 9.99, 50),
(7, 6, 'TE002', 'Chamomile Tea', 'Chamomile herbal tea', 8.99, 60),
(8, 6, 'TE003', 'Blackcurrant Tea', 'Authentic Handmade tea', 10.99, 40),
(9, 6, 'TE004', 'Jasmine Tea', 'Jasmine herbal tea', 11.99, 80),
(10, 4, 'AC001', 'Espresso Machine', 'Perfect brew every time', 199.99, 100),
(11, 4, 'AC002', 'Coffee Grinder', 'Freshly ground beans', 49.99, 100),
(12, 4, 'AC003', 'Turkish Coffee Cup', 'Traditional Turkish coffee cup with elegant design', 4.99, 200),
(13, 4, 'AC004', 'Tea Cup & Kettle', 'Premium tea cup and kettle set for tea enthusiasts', 19.99, 150);

-- Seed the Ratings table
INSERT INTO Ratings (review_id, customer_id, manager_id, product_id, score, approval) VALUES
(1, 1, 8, 1, 5, TRUE),
(2, 2, 8, 2, 4, TRUE),
(3, 3, 9, 3, 5, TRUE),
(4, 4, 9, 4, 3, FALSE),
(5, 5, 10, 5, 4, TRUE),
(6, 6, 10, 6, 5, TRUE),
(7, 7, 8, 7, 4, TRUE),
(8, 1, 9, 8, 5, TRUE),
(9, 2, 10, 9, 3, FALSE),
(10, 3, 8, 10, 4, TRUE);

-- Seed the Comments table
INSERT INTO Comments (commnt_id, customer_id, product_id, text, approval, manager_id) VALUES
(1, 1, 1, 'Great coffee beans!', FALSE, 8),
(2, 2, 2, 'Very robust flavor.', FALSE, 8),
(3, 3, 3, 'Smooth and aromatic.', TRUE, 9),
(4, 4, 4, 'Love the design of this mug.', FALSE, 9),
(5, 5, 5, 'Keeps coffee hot for hours.', TRUE, 10),
(6, 6, 6, 'Easy to use and clean.', TRUE, 10),
(7, 7, 7, 'Perfect for pour-over coffee.', FALSE, 8),
(8, 1, 8, 'Grinds coffee beans evenly.', TRUE, 9),
(9, 2, 9, 'Froths milk perfectly.', FALSE, 10),
(10, 3, 10, 'Comfortable and stylish.', TRUE, 8);


-- Seed the Carts table
INSERT INTO Carts (cart_id, customer_id, product_id, quantity) VALUES
(1, 1, 1, 2),
(2, 2, 2, 1),
(3, 3, 3, 3),
(4, 4, 4, 1),
(5, 5, 5, 2),
(6, 6, 6, 1),
(7, 7, 7, 1),
(8, 1, 8, 1),
(9, 2, 9, 1),
(10, 3, 10, 2);

-- Seed the Wishlists table  (fixed column name)
INSERT INTO Wishlists (wishlist_id, customer_id, product_id) VALUES
(1, 1, 2),
(2, 2, 3),
(3, 3, 4),
(4, 4, 5),
(5, 5, 6),
(6, 6, 7),
(7, 7, 8),
(8, 1, 9),
(9, 2, 10),
(10, 3, 1);

-- Seed the Payments table
INSERT INTO Payments (payment_id, customer_id, payment_date, payment_method, amount) VALUES
(1, 1, '2023-10-01 10:00:00', 'Credit Card', 51.98),
(2, 2, '2023-10-02 11:00:00', 'PayPal', 22.99),
(3, 3, '2023-10-03 12:00:00', 'Credit Card', 59.97),
(4, 4, '2023-10-04 13:00:00', 'Debit Card', 12.99),
(5, 5, '2023-10-05 14:00:00', 'Credit Card', 49.98),
(6, 6, '2023-10-06 15:00:00', 'PayPal', 29.99),
(7, 7, '2023-10-07 16:00:00', 'Credit Card', 34.99),
(8, 1, '2023-10-08 17:00:00', 'Debit Card', 49.99),
(9, 2, '2023-10-09 18:00:00', 'Credit Card', 19.99),
(10, 3, '2023-10-10 19:00:00', 'PayPal', 45.98);

-- Seed the Shipments table
INSERT INTO Shipments (shipment_id, customer_id, shipment_date, address, city, state, country, zip_code) VALUES
(1, 1, '2023-10-03 12:00:00', '123 Coffee St', 'Anytown', 'CA', 'USA', '12345'),
(2, 2, '2023-10-04 13:00:00', '456 Brewery Ln', 'Othertown', 'NY', 'USA', '67890'),
(3, 3, '2023-10-05 14:00:00', '789 Roast Rd', 'Sometown', 'TX', 'USA', '11223'),
(4, 4, '2023-10-06 15:00:00', '101 Espresso Ave', 'Yourtown', 'FL', 'USA', '44556'),
(5, 5, '2023-10-07 16:00:00', '112 Latte Ln', 'Theirtown', 'WA', 'USA', '77889'),
(6, 6, '2023-10-08 17:00:00', '131 Cappuccino Ct', 'Mytown', 'IL', 'USA', '99001'),
(7, 7, '2023-10-09 18:00:00', '415 Mocha Dr', 'Hometown', 'OH', 'USA', '22334'),
(8, 1, '2023-10-10 19:00:00', '161 Arabica Ave', 'Yourcity', 'GA', 'USA', '55667'),
(9, 2, '2023-10-11 20:00:00', '718 Robusta Rd', 'Ourcity', 'MI', 'USA', '88990'),
(10, 3, '2023-10-12 21:00:00', '919 Macchiato Mn', 'Theircity', 'PA', 'USA', '33445');

-- Seed the Orders table
INSERT INTO Orders (
  order_id, customer_id, product_id, quantity,
  order_date, order_status, total_amount
) VALUES
(1, 1, 1, 2, '2023-10-01 10:00:00', 'Shipped', 51.98),
(2, 2, 2, 1, '2023-10-02 11:00:00', 'Processing', 22.99),
(3, 3, 3, 3, '2023-10-03 12:00:00', 'Delivered', 59.97),
(4, 4, 4, 1, '2023-10-04 13:00:00', 'Shipped', 12.99),
(5, 5, 5, 2, '2023-10-05 14:00:00', 'Processing', 49.98),
(6, 6, 6, 1, '2023-10-06 15:00:00', 'Delivered', 29.99),
(7, 7, 7, 1, '2023-10-07 16:00:00', 'Shipped', 34.99),
(8, 1, 8, 1, '2023-10-08 17:00:00', 'Processing', 49.99),
(9, 2, 9, 1, '2023-10-09 18:00:00', 'Delivered', 19.99),
(10, 3, 10, 2, '2023-10-10 19:00:00', 'Shipped', 45.98);


