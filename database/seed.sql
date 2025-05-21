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
  (1,  1, 'CB001', 'Kenya Coffee A',           'KB-100',  'SN1001', 'Rich and smooth',                              0,   15.99, 'N/A',       'Fincan Coffee Co.', 'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632240/hand-drawn-coffee-label-design-template_23-2149814317_keutgm.jpg', FALSE),
  -- “B” product: stock set to 1
  (2,  1, 'CB002', 'Premium Coffee B',         'PC-200',  'SN1002', 'Local Farming',                                 1,   12.99, 'N/A',       'Fincan Coffee Co.', 'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632291/hand-drawn-coffee-label-template-design_23-2149824207_y43d4p.jpg', FALSE),
  -- “C” product: plenty in stock
  (3,  1, 'CB003', 'Blue Coffee C',            'BC-300',  'SN1003', 'Blue Bottle coffee',                            75,   18.99, 'N/A',       'Fincan Coffee Co.', 'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632322/photo-1605711599412-775918dbe770_f94gaz.jpg', FALSE),
  -- the rest unchanged
  (4,  1, 'CB004', 'Vienese Coffee',           'VC-400',  'SN1004', 'Rich and smooth',                              200,  14.99, 'N/A',       'Fincan Coffee Co.', 'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632328/hand-drawn-coffee-label-design-template_23-2149814329_zxkvuk.jpg', FALSE),
  (5,  1, 'CB005', 'Moroccan Coffee',          'MC-500',  'SN1005', 'Rich and smooth',                              150,  16.99, 'N/A',       'Fincan Coffee Co.', 'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632337/hand-drawn-coffee-label-design-template_23-2149814314_hvcwlv.jpg', FALSE),

  (6,  6, 'TE001', 'Fresh Tea',                'FT-600',  'SN1006', 'Refreshing and healthy',                        50,   9.99,  'N/A',       'Fincan Tea Co.',    'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632343/tea-ad-with-watercolor-decoration_52683-30486_re6dfz.jpg', FALSE),
  (7,  6, 'TE002', 'Chamomile Tea',            'CT-700',  'SN1007', 'Chamomile herbal tea',                         60,   8.99,  'N/A',       'Fincan Tea Co.',    'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632359/tea-ad-with-watercolor-decoration_52683-30456_dgobma.jpg', FALSE),
  (8,  6, 'TE003', 'Blackcurrant Tea',         'BT-800',  'SN1008', 'Authentic Handmade tea',                       40,   10.99, 'N/A',       'Fincan Tea Co.',    'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632369/tea-ad-with-watercolor-decoration_52683-30487_j2ptvn.jpg', FALSE),
  (9,  6, 'TE004', 'Jasmine Tea',              'JT-900',  'SN1009', 'Jasmine herbal tea',                           80,   11.99, 'N/A',       'Fincan Tea Co.',    'https://res.cloudinary.com/dc59eknyr/image/upload/v1747632373/tea-ad-with-watercolor-decoration_52683-30486_nyuehi.jpg', FALSE),

  (10, 4, 'AC001', 'Espresso Machine',         'EM-1000', 'SN1010','Perfect brew every time',                     100,  199.99,'2 years',   'Fincan Gear Ltd.','https://res.cloudinary.com/dc59eknyr/image/upload/v1747632383/view-3d-coffee-cup-with-machine_23-2151083728_p2bdwf.jpg', FALSE),
  (11, 4, 'AC002', 'Coffee Grinder',           'CG-1100', 'SN1011','Freshly ground beans',                        100,  49.99, '2 years',   'Fincan Gear Ltd.','https://res.cloudinary.com/dc59eknyr/image/upload/v1747632398/photo-1637029436347-e33bf98a5412_kipvy3.jpg', FALSE),
  -- best sellers
  (12, 4, 'AC003', 'Turkish Coffee Cup',       'TC-1200', 'SN1012','Traditional Turkish coffee cup with elegant design', 200,  4.99,  '1 year',    'Fincan Gear Ltd.','https://res.cloudinary.com/dc59eknyr/image/upload/v1747632410/best-seller1_kn1dwk.jpg', TRUE),
  (13, 4, 'AC004', 'Tea Cup & Kettle',         'TK-1300', 'SN1013','Premium tea cup and kettle set for tea enthusiasts',150, 19.99,'1 year',    'Fincan Gear Ltd.','https://res.cloudinary.com/dc59eknyr/image/upload/v1747632415/best-seller2_zqclvf.webp', TRUE);

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


