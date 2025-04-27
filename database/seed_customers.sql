-- Seed the Customers table with bcrypt-hashed passwords

INSERT INTO Customers (customer_id, first_name, last_name, email, password, address, phone_number, type) VALUES
  (1, 'Alice', 'Johnson', 'alice.johnson@example.com', '$2b$10$Qvt1KE4U3pI6CLnl5V48pOxnqhomS.MvdmGENFet5zQnh2rYXcOtO', '123 Coffee St', '555-1001', 'regular'),
  (2, 'Bob', 'Smith', 'bob.smith@example.com', '$2b$10$wDmJmJAF53ETLo36LiwFp.uSyWP74iCU4/5tLkeytMM6y.xXPLF32', '456 Brewery Ln', '555-1002', 'regular'),
  (3, 'Charlie', 'Brown', 'charlie.brown@example.com', '$2b$10$m6QNYcslsEApQYm0OF47TuFxgRF6g.eiVmYaDoo0tFXyvD0HcUIiu', '789 Roast Rd', '555-1003', 'regular'),
  (4, 'Diana', 'Evans', 'diana.evans@example.com', '$2b$10$nO/rLl8icA0arB9MaO8SJu0CjMdcyxYIqtj/CyHWV7dmaRW5z9pmm', '101 Espresso Ave', '555-1004', 'regular'),
  (5, 'Ethan', 'Harris', 'ethan.harris@example.com', '$2b$10$UxorUGH610ymjh6.LJVSBe4aY035r3Cg1y86wfot78DS/cQfaj5BC', '112 Latte Ln', '555-1005', 'regular'),
  (6, 'Fiona', 'Clark', 'fiona.clark@example.com', '$2b$10$dgcaFjH/H8hjuy47iYNIsOdqZutJm8Vh5WWVsqFT5kFvzzH2Ua3Jq', '131 Cappuccino Ct', '555-1006', 'regular'),
  (7, 'George', 'Lewis', 'george.lewis@example.com', '$2b$10$sm63eXsD9mn4RC7ET6SBkeMQtvwTRdUHkVqbPsi3kWm9poBmtPcj.', '415 Mocha Dr', '555-1007', 'regular'),
  (8, 'Hannah', 'Walker', 'hannah.walker@example.com', '$2b$10$Ng08vqLbHti0IeZgxNUn2OrmJZ4dDsTPr9elFkSl1sUhhexoUw27S', '161 Arabica Ave', '555-1008', 'manager'),
  (9, 'Ian', 'Hall', 'ian.hall@example.com', '$2b$10$NMAW7FHwQeEAMSULXSTu7.YXUupvAlCA.fVj6GS//3qIwMD4lNkga', '718 Robusta Rd', '555-1009', 'manager'),
  (10, 'Julia', 'Young', 'julia.young@example.com', '$2b$10$9jFS5U3rhjvnLiJ8WTad4.hV.y9FVWAWFdj4D.zIcekqRIu8H9MK2', '919 Macchiato Mn', '555-1010', 'manager');
