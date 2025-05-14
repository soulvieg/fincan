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
  const [receipt, setReceipt] = useState<any | null>(null);

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

    // Allow either 16 digits straight, or the masked form "**** **** **** 1234"
    const plain16 = /^\d{16}$/;
    const masked16 = /^(\*{4}\s){3}\d{4}$/;
    if (!(plain16.test(cardNumber) || masked16.test(cardNumber))) {
      return false;
    }

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

  const showReceiptPopup = (receiptData: any) => {
    const popup = window.open("", "Receipt", "width=600,height=800");
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
              
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #6d4c41;
                color: #f5f0e6;
              }
              
              .brand {
                font-family: "The Seasons", "Playfair Display", serif;
                color: #f5f0e6;
                font-size: 2rem;
                margin-bottom: 20px;
              }
              
              h2 {
                text-align: center;
                color: #f5f0e6;
              }
              
              h3 {
                text-align: left;
                color: #f5f0e6;
                margin-top: 30px;
                margin-bottom: 15px;
              }
              
              ul {
                list-style: none;
                padding: 0;
              }
              
              li {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                padding: 10px;
                background: #7d5c51;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              }
              
              img {
                margin-right: 15px;
                border-radius: 4px;
              }
              
              .cost-summary {
                margin-top: 20px;
                padding: 15px;
                background: #7d5c51;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              }
              
              .total {
                font-size: 2rem;
                font-weight: bold;
                text-align: center;
                margin-top: 40px;
                margin-bottom: 30px;
                color: #f5f0e6;
              }
              
              p {
                color: #f5f0e6;
              }
            </style>
          </head>
          <body>
            <div class="brand">Fincan</div>
            <h2>Receipt</h2>
            <p>Order ID: ${receiptData.order.order_id}</p>
            <h3>Items:</h3>
            <ul>
              ${receiptData.orderItems
                .map(
                  (item: any) => `
                <li>
                  <img src="${item.image}" width="80" height="80" />
                  ${item.name} - ${item.quantity} x $${formatCurrency(
                    item.price
                  )}
                </li>
              `
                )
                .join("")}
            </ul>
            <div class="cost-summary">
              <p>Shipping: $0.00</p>
              <p>Tax: $0.00</p>
            </div>
            <div class="total">
              Total: $${formatCurrency(receiptData.order.total_amount)}
            </div>
          </body>
        </html>
      `);
      popup.document.close();
    }
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
      // 1) Call backend to place order
      const payload = {
        products: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentInfo: user.creditCard,
      };
      const response = await axios.post("/api/orders", payload, {
        withCredentials: true,
      });

      // 2) On success, update frontend state
      const { order } = response.data;
      addOrder({
        date: new Date().toLocaleString(),
        items: cart,
        total: calculateTotal(),
      });
      setReceipt({ orderItems: cart, order });
      clearCart();

      // 3) Send EmailJS confirmation
      const emailParams = {
        order_id: order.order_id.toString(),
        email: user.email || "no-reply@example.com",
        orders: cart.map((item) => ({
          image_url: item.image,
          name: item.name,
          units: item.quantity,
          price: formatCurrency(item.price * item.quantity),
        })),
        cost: {
          shipping: "0.00",
          tax: "0.00",
          total: formatCurrency(calculateTotal()),
        },
      };
      await emailjs.send(
        "service_icp8vi6",
        "template_gb3xppt",
        emailParams,
        "sLZQwIIbpMOy-EVnm"
      );

      // 4) Show receipt and success message
      showReceiptPopup({ orderItems: cart, order });
      setMessage("Thank you for your purchase! Confirmation email sent.");
    } catch (error: any) {
      console.error("[Checkout] Error:", error.response || error);
      setMessage(error.response?.data?.message || "Error processing checkout.");
    }
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
      {message && <div className="purchase-message">{message}</div>}
    </div>
  );
};

export default ShoppingCart;
