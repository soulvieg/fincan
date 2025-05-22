// frontend/src/pages/ShoppingCart.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { useOrders } from "../contexts/OrderContext";
import "../styles/ShoppingCart.css";
import emailjs from "@emailjs/browser";

const ShoppingCart: React.FC = () => {
  const { cart, loading, removeFromCart, clearCart } = useCart();
  const { user } = useUser();
  const { addOrder } = useOrders();
  const [message, setMessage] = useState<string | null>(null);

  // ---- Init EmailJS ----
  useEffect(() => {
    emailjs.init("XeZqzDWKL2_REWIhw");
  }, []);

  // ---- Auto-notify on any price drop ----
  useEffect(() => {
    if (!user || cart.length === 0) return;

    const key = `prev_prices_${user.id}`;
    const prevPrices: Record<number, number> = JSON.parse(
      localStorage.getItem(key) || "{}"
    );

    cart.forEach(item => {
      const oldPrice = prevPrices[item.productId];
      if (oldPrice !== undefined && item.price < oldPrice) {
        emailjs
          .send("service_dpxa8s8", "template_db0hdkf", {
            user_name: `${user.first_name} ${user.last_name}`,
            email: user.email,
          })
          .then(() => console.log(`Discount email sent for ${item.name}`))
          .catch(err => console.error("EmailJS error:", err));
      }
    });

    const current: Record<number, number> = {};
    cart.forEach(item => (current[item.productId] = item.price));
    localStorage.setItem(key, JSON.stringify(current));
  }, [cart, user]);

  // ---- Clear flash messages ----
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const calculateTotal = (): number =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatCurrency = (amount: number): string =>
    amount.toFixed(2);

  const isCreditCardValid = (): boolean => {
    if (!user || !user.creditCard) return false;
    return true; // unchanged
  };

  const handleCheckout = async () => {
    // existing checkout code…
  };

  if (loading) {
    return <div className="shopping-cart">Loading cart...</div>;
  }

  return (
    <div className="shopping-cart">
      <h2>Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.productId}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
                {item.name} — ${formatCurrency(item.price)} × {item.quantity}
                <button onClick={() => removeFromCart(item.productId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h3>Total: ${formatCurrency(calculateTotal())}</h3>
          <button
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </>
      )}

      {message && (
        <div className="purchase-message">{message}</div>
      )}
    </div>
  );
};

export default ShoppingCart;