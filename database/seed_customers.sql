-- Seed the Customers table with bcrypt-hashed passwords

INSERT INTO Customers (customer_id, first_name, last_name, email, password, address, phone_number, type) VALUES
  (1, 'Jane', 'Doe', 'neda.mohamed@sabanciuniv.edu', '$2b$10$eZ8wJjiWxQTsdf2xT11NuO2CbzqiyJzqXPlsG2F.XgCz/aI0b/t22', '123 Coffee St', '555-1001', 'regular'),
  (2, 'Sales', 'Manager', 'sales@fincan.com', '$2b$10$PCjK2wENIhCAgq7WFVW3NehS1QesXxzUVqOGpntisugVr1A.r5lAS', 'fincan inc', '555-1001', 'sales'),
  (3, 'Product', 'Manager', 'products@fincan.com', '$2b$10$ZXUGrqveSvjdbrWA1vuSPuJCzCku2q2DLEyFkBK5YTLX5W9bkwBJW', '123 Coffee St', '555-1001', 'regular');