import React from "react";
import { useCart } from "../components/CartContext";
import "../styles/ShoppingCart.css";

const ShoppingCart: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const calculateTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="shopping-cart-page">
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
