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

INSERT INTO Products (
  product_id,
  category_id,
  sku,
  name,
  model,
  serial_number,
  description,
  quantity_in_stock,
  price,
  warranty_status,
  distributor_info,
  image_url,
  is_best_seller
) VALUES
 -- “A” product: stock forced to zero
  (1,  1, 'CB001', 'Kenya Coffee A',           'KB-100',  'SN1001', 'Rich and smooth',                              0,   15.99, 'N/A',       'Fincan Coffee Co.', 'https://img.freepik.com/free-vector/hand-drawn-coffee-label-design-template_23-2149814317.jpg', FALSE),
  -- “B” product: stock set to 1
  (2,  1, 'CB002', 'Premium Coffee B',         'PC-200',  'SN1002', 'Local Farming',                                 1,   12.99, 'N/A',       'Fincan Coffee Co.', 'https://img.freepik.com/free-vector/hand-drawn-coffee-label-template-design_23-2149824207.jpg', FALSE),
  -- “C” product: plenty in stock
  (3,  1, 'CB003', 'Blue Coffee C',            'BC-300',  'SN1003', 'Blue Bottle coffee',                            75,   18.99, 'N/A',       'Fincan Coffee Co.', 'https://images.unsplash.com/photo-1605711599412-775918dbe770?q=80&w=3024&auto=format&fit=crop', FALSE),
  -- the rest unchanged
  (4,  1, 'CB004', 'Vienese Coffee',           'VC-400',  'SN1004', 'Rich and smooth',                              200,  14.99, 'N/A',       'Fincan Coffee Co.', 'https://img.freepik.com/free-vector/hand-drawn-coffee-label-design-template_23-2149814329.jpg', FALSE),
  (5,  1, 'CB005', 'Moroccan Coffee',          'MC-500',  'SN1005', 'Rich and smooth',                              150,  16.99, 'N/A',       'Fincan Coffee Co.', 'https://img.freepik.com/free-vector/hand-drawn-coffee-label-design-template_23-2149814314.jpg', FALSE),

  (6,  6, 'TE001', 'Fresh Tea',                'FT-600',  'SN1006', 'Refreshing and healthy',                        50,   9.99,  'N/A',       'Fincan Tea Co.',    'https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30486.jpg', FALSE),
  (7,  6, 'TE002', 'Chamomile Tea',            'CT-700',  'SN1007', 'Chamomile herbal tea',                         60,   8.99,  'N/A',       'Fincan Tea Co.',    'https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30456.jpg', FALSE),
  (8,  6, 'TE003', 'Blackcurrant Tea',         'BT-800',  'SN1008', 'Authentic Handmade tea',                       40,   10.99, 'N/A',       'Fincan Tea Co.',    'https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30487.jpg', FALSE),
  (9,  6, 'TE004', 'Jasmine Tea',              'JT-900',  'SN1009', 'Jasmine herbal tea',                           80,   11.99, 'N/A',       'Fincan Tea Co.',    'https://img.freepik.com/free-vector/tea-ad-with-watercolor-decoration_52683-30486.jpg', FALSE),

  (10, 4, 'AC001', 'Espresso Machine',         'EM-1000', 'SN1010','Perfect brew every time',                     100,  199.99,'2 years',   'Fincan Gear Ltd.','https://img.freepik.com/free-photo/view-3d-coffee-cup-with-machine_23-2151083728.jpg', FALSE),
  (11, 4, 'AC002', 'Coffee Grinder',           'CG-1100', 'SN1011','Freshly ground beans',                        100,  49.99, '2 years',   'Fincan Gear Ltd.','https://images.unsplash.com/photo-1637029436347-e33bf98a5412?q=80&w=2960&auto=format&fit=crop', FALSE),
  -- best sellers
  (12, 4, 'AC003', 'Turkish Coffee Cup',       'TC-1200', 'SN1012','Traditional Turkish coffee cup with elegant design', 200,  4.99,  '1 year',    'Fincan Gear Ltd.','/img/best-seller1.jpg', TRUE),
  (13, 4, 'AC004', 'Tea Cup & Kettle',         'TK-1300', 'SN1013','Premium tea cup and kettle set for tea enthusiasts',150, 19.99,'1 year',    'Fincan Gear Ltd.','/img/best-seller2.webp', TRUE);

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
INSERT INTO Comments (comment_id, customer_id, product_id, text, approval, manager_id) VALUES
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
(1, 1, 1, 2, '2023-10-01 10:00:00', 'in-transit', 51.98),
(2, 2, 2, 1, '2023-10-02 11:00:00', 'processing', 22.99),
(3, 3, 3, 3, '2023-10-03 12:00:00', 'delivered', 59.97),
(4, 4, 4, 1, '2023-10-04 13:00:00', 'in-transit', 12.99),
(5, 5, 5, 2, '2023-10-05 14:00:00', 'processing', 49.98),
(6, 6, 6, 1, '2023-10-06 15:00:00', 'delivered', 29.99),
(7, 7, 7, 1, '2023-10-07 16:00:00', 'in-transit', 34.99),
(8, 1, 8, 1, '2023-10-08 17:00:00', 'processing', 49.99),
(9, 2, 9, 1, '2023-10-09 18:00:00', 'delivered', 19.99),
(10, 3, 10, 2, '2023-10-10 19:00:00', 'in-transit', 45.98);


