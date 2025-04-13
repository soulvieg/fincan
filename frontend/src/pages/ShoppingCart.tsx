import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { useOrders } from "../contexts/OrderContext";
import "../styles/ShoppingCart.css";

const ShoppingCart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const { addOrder } = useOrders();
  const [message, setMessage] = useState<string | null>(null);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const calculateTotal = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return total;
  };

  // Format currency to always show 2 decimal places
  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  // Check if credit card is valid
  const isCreditCardValid = () => {
    if (!user || !user.creditCard) return false;

    const { cardNumber, expirationDate, cvv, cardholderName } = user.creditCard;

    // Check if all fields exist
    if (!cardNumber || !expirationDate || !cvv || !cardholderName) {
      return false;
    }

    // Check card number length
    if (cardNumber.length !== 16) {
      return false;
    }

    // Check CVV length
    if (cvv.length !== 3) {
      return false;
    }

    // Check expiration date
    const [month, year] = expirationDate.split("/");
    if (!month || !year) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits
    const currentMonth = currentDate.getMonth() + 1; // 1-12

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (
      isNaN(expMonth) ||
      isNaN(expYear) ||
      expMonth < 1 ||
      expMonth > 12 ||
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return false;
    }

    return true;
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!user) {
      setMessage("Please log in to confirm the checkout.");
      return;
    }

    if (!isCreditCardValid()) {
      setMessage("Please add a valid credit card to your account.");
      return;
    }

    // Create a new order using the OrderContext
    addOrder({
      date: new Date().toLocaleString(),
      items: cart,
      total: calculateTotal(),
    });

    setMessage("Thank you for your purchase!");
    setTimeout(() => {
      clearCart();
    }, 3000);
  };

  return (
    <div>
      <div className="shopping-cart">
        <h2>Your Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  {item.name} - ${formatCurrency(item.price)} x {item.quantity}
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <h3>Total: ${formatCurrency(calculateTotal())}</h3>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
      {message && <div className="purchase-message">{message}</div>}
    </div>
  );
};

export default ShoppingCart;
