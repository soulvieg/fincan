DELIMITER //
CREATE PROCEDURE total_sales()
BEGIN
    SELECT SUM(price * quantity) AS total_sales
    FROM Carts C
    JOIN Products P ON C.product_id = P.product_id;
END //
DELIMITER ;