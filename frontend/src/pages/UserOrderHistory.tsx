import React, { useState, useEffect } from "react";
import "../styles/ShoppingCart.css";

// Define interfaces for Order and Item
interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  date: string;
  items: Item[];
  total: number;
}

const OrderPage: React.FC = () => {
  // Specify the type for orders as an array of Order objects
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  // Function to clear the order history
  const clearOrderHistory = () => {
    localStorage.removeItem("orders"); // Remove orders from localStorage
    setOrders([]); // Clear the orders state
  };

  return (
    <div
      className="shopping-cart-page"
      style={{
        backgroundImage: "url('/img/background1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Header */}
      <header className="second-header">
        <h1 className="title2">
          <span className="emoji2">☕</span>Fincan
        </h1>
      </header>

      {/* Order History */}
      <div className="order-history">
        <h2>Your Order History</h2>
        {orders.length === 0 ? (
          <p>No past orders.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <h3>Order on {order.date}</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id} className="order-list-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-img"
                    />
                    {item.name} - ${item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <h3>Total: ${order.total}</h3>
            </div>
          ))
        )}
        {/* Clear Order History Button */}
        <button
          className="clear-order-history-button"
          onClick={clearOrderHistory}
        >
          Clear Order History
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
