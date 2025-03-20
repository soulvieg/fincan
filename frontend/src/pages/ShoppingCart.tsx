import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import "../styles/ShoppingCart.css";

const ShoppingCart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useUser(); // Access user context
  const [message, setMessage] = useState<string | null>(null);

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    if (!user) {
      setMessage("Please log in to confirm the checkout.");
      return;
    }

    const newOrder = {
      id: Date.now(), // Unique timestamp-based ID
      date: new Date().toLocaleString(), // Dynamic purchase date
      items: cart,
      total: calculateTotal(),
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setMessage("Thank you for your purchase!");
    setTimeout(() => {
      setMessage(null);
      clearCart(); // Clear cart after successful checkout
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
                  {item.name} - ${item.price} x {item.quantity}
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <h3>Total: ${calculateTotal()}</h3>
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
