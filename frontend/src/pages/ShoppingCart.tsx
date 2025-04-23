import React, { useState, useEffect } from "react";
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

  // Init EmailJS once
  useEffect(() => {
    emailjs.init("sLZQwIIbpMOy-EVnm"); // Your public EmailJS key
  }, []);

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
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toFixed(2);
  };

  const isCreditCardValid = () => {
    if (!user || !user.creditCard) return false;
    const { cardNumber, expirationDate, cardholderName } = user.creditCard;
    if (!cardNumber || !expirationDate || !cardholderName) return false;
    if (cardNumber.length !== 16) return false;

    const [month, year] = expirationDate.split("/");
    if (!month || !year) return false;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
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

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      setMessage("Please log in to confirm the checkout.");
      return;
    }
    if (!isCreditCardValid()) {
      setMessage("Please add a valid credit card to your account.");
      return;
    }

    try {
      console.log("[Checkout] Sending EmailJS email...");

      const formattedOrders = cart.map((item) => ({
        image_url: item.image,
        name: item.name,
        units: item.quantity,
        price: formatCurrency(item.price * item.quantity),
      }));

      const total = formatCurrency(calculateTotal());

      const templateParams = {
        order_id: Math.floor(Math.random() * 1000000).toString(), // unique ID
        email: user.email || "no-reply@example.com",
        orders: formattedOrders,
        cost: {
          shipping: "0.00",
          tax: "0.00",
          total,
        },
      };

      const result = await emailjs.send(
        "service_icp8vi6",
        "template_gb3xppt",
        templateParams,
        "sLZQwIIbpMOy-EVnm"
      );

      console.log("[Checkout] Email sent:", result.status, result.text);

      addOrder({
        date: new Date().toLocaleString(),
        items: cart,
        total: calculateTotal(),
      });

      setMessage("Thank you for your purchase! Confirmation email sent.");
      setTimeout(() => clearCart(), 3000);
    } catch (error) {
      console.error("[Checkout] Failed to send email:", error);
      setMessage("Error processing checkout or sending email.");
    }
  };

  if (loading) {
    return <div className="shopping-cart">Loading cart...</div>;
  }

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
                <li key={item.productId}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                  />
                  {item.name} - ${formatCurrency(item.price)} x {item.quantity}
                  <button onClick={() => removeFromCart(item.productId)}>
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