import React from "react";
import { useCart } from "../contexts/CartContext";
import "../styles/ShoppingCart.css";

const ShoppingCart: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      {/* Header Section */}
      <header className="second-header">
        <h1 className="title2">
          <span className="emoji2">☕</span>Fincan
        </h1>
      </header>

      {/* Shopping Cart Content */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
